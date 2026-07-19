import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcrypt';
import sharp from 'sharp';
import crypto from 'crypto';
import { updateStaticSite } from './generate.js';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set('trust proxy', 1); // Trust first proxy for express-rate-limit
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'arusuvai-secure-secret-key-2026';
const CSRF_SECRET = process.env.CSRF_SECRET || 'csrf-secret-key';

// Security Headers
app.use(helmet({
  contentSecurityPolicy: false, // allow inline scripts for admin and generic assets
}));

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// Rate Limiting
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // limit each IP to 5 login requests per windowMs
  message: { error: 'Too many login attempts, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { error: 'Too many API requests, please try again later' }
});

// JSON File Lock & Transaction Utility
const jsonLocks = {};
async function writeJsonSafe(filePath, data) {
  while (jsonLocks[filePath]) {
    await new Promise(r => setTimeout(r, 10));
  }
  jsonLocks[filePath] = true;
  try {
    const backupPath = filePath + '.bak';
    if (fs.existsSync(filePath)) {
      fs.copyFileSync(filePath, backupPath); // automatic backup
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    if (fs.existsSync(filePath + '.bak')) {
      fs.copyFileSync(filePath + '.bak', filePath); // rollback
    }
    throw err;
  } finally {
    jsonLocks[filePath] = false;
  }
}

// Multer setup with limits
const storage = multer.memoryStorage(); // Use memory storage to process with Sharp
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/json') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Admin Password Handling
const getAdminHash = () => {
  let pwd = process.env.ADMIN_PASSWORD;
  if (!pwd) {
    try {
      const envContent = fs.readFileSync(path.join(__dirname, '.env.example'), 'utf8');
      const match = envContent.match(/^ADMIN_PASSWORD=(.*)$/m);
      if (match && match[1].trim() !== '') {
        pwd = match[1].trim();
      }
    } catch (e) {}
  }
  // In a real environment we would check for ADMIN_PASSWORD_HASH first.
  // Here we hash the plain text password dynamically if needed for bcrypt comparison.
  // We use a constant salt rounds.
  return pwd ? bcrypt.hashSync(pwd, 10) : null;
};
let adminPasswordHash = getAdminHash();

// Check if credentials are secure
if (!adminPasswordHash) {
  console.warn('WARNING: Admin password is not set. Admin panel will be locked.');
}

// Custom Auth & CSRF Middleware
const authMiddleware = (req, res, next) => {
  if (!adminPasswordHash) {
    return res.status(500).json({ error: 'Server misconfiguration: Admin password is not set.' });
  }
  
  let token = req.cookies.admin_session; // Fallback for direct browser access
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }

  if (!token) {
    if (req.originalUrl.startsWith('/api/')) return res.status(401).json({ error: 'Unauthorized' });
    return res.redirect('/kitchen-99in');
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    
    // CSRF Check for state-changing requests
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
      const csrfHeader = req.headers['x-csrf-token'];
      if (!csrfHeader || csrfHeader !== decoded.csrfToken) {
        return res.status(403).json({ error: 'CSRF token validation failed' });
      }
    }
    
    next();
  } catch (err) {
    if (req.originalUrl.startsWith('/api/')) return res.status(401).json({ error: 'Session expired or invalid' });
    return res.redirect('/kitchen-99in');
  }
};

// --- AUTHENTICATION ROUTES ---

app.post('/api/login', loginLimiter, async (req, res) => {
  const { password } = req.body;
  
  if (!adminPasswordHash) {
    return res.status(500).json({ error: 'Admin password is not configured' });
  }
  
  const isValid = await bcrypt.compare(password, adminPasswordHash);
  if (isValid) {
    const csrfToken = crypto.randomBytes(32).toString('hex');
    const token = jwt.sign({ user: 'admin', csrfToken }, JWT_SECRET, { expiresIn: '12h' });
    
    // Regenerate session
    res.cookie('admin_session', token, { 
      httpOnly: true, 
      secure: true,
      sameSite: 'none',
      maxAge: 12 * 60 * 60 * 1000 // 12 hours
    });
    
    return res.json({ success: true, csrfToken, token });
  }
  return res.status(401).json({ error: 'Invalid password' });
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('admin_session', { httpOnly: true, secure: true, sameSite: 'none' });
  res.json({ success: true });
});

app.get('/api/verify', authMiddleware, (req, res) => {
  res.json({ success: true, csrfToken: req.admin.csrfToken });
});

// Login Page Route
app.get('/kitchen-99in', (req, res) => {
  res.sendFile(path.join(__dirname, 'kitchen-99-admin', 'login.html'));
});

// Secure the API routes

app.use('/api/data', apiLimiter, authMiddleware);
app.use('/api/media', apiLimiter, authMiddleware);
app.use('/api/stats', apiLimiter, authMiddleware);
app.use('/api/backup', apiLimiter, authMiddleware);
app.use('/api/restore', apiLimiter, authMiddleware);
app.use('/api/upload', apiLimiter, authMiddleware);

// --- DASHBOARD API ---

app.get('/api/stats', (req, res) => {
  const dataDir = path.join(__dirname, 'data');
  const read = (file) => {
    try {
      return JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
    } catch(e) { return {}; }
  };
  
  const menu = read('menu.json').items || [];
  const gallery = read('gallery.json').items || [];
  const reviews = read('reviews.json').items || [];
  const subscriptions = read('subscriptions.json').plans || [];
  const corporate = read('corporate.json').packages || [];
  const faq = read('faq.json').items || [];

  res.json({
    menuItems: menu.length,
    galleryImages: gallery.length,
    reviews: reviews.length,
    mealPlans: subscriptions.length,
    corporatePackages: corporate.length,
    faqs: faq.length,
    lastUpdated: new Date().toISOString()
  });
});

// --- DATA CRUD API ---

app.get('/api/data', (req, res) => {
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) return res.json([]);
  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
  res.json(files);
});

app.get('/api/data/:file', (req, res) => {
  const safeFile = path.basename(req.params.file);
  const filePath = path.join(__dirname, 'data', safeFile);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  res.json(data);
});

app.post('/api/data/:file', async (req, res) => {
  const safeFile = path.basename(req.params.file);
  const filePath = path.join(__dirname, 'data', safeFile);
  
  try {
    await writeJsonSafe(filePath, req.body);
    
    // Update HTML files
    updateStaticSite();
    
    // Rebuild the dist output asynchronously
    exec('npm run build', (error) => {
      if (error) console.error(`Build error: ${error}`);
    });

    res.json({ success: true });
  } catch (err) {
    console.error('Save failed:', err);
    res.status(500).json({ error: 'Failed to save data safely' });
  }
});

// --- MEDIA MANAGER API ---

const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.get('/api/media', (req, res) => {
  if (!fs.existsSync(uploadDir)) return res.json([]);
  const files = fs.readdirSync(uploadDir).filter(f => !f.startsWith('.'));
  const mediaFiles = files.map(f => {
    const stat = fs.statSync(path.join(uploadDir, f));
    return {
      name: f,
      url: `/uploads/${f}`,
      size: stat.size,
      created: stat.birthtime
    };
  });
  // Sort by newest first
  mediaFiles.sort((a, b) => b.created - a.created);
  res.json(mediaFiles);
});

app.delete('/api/media/:file', (req, res) => {
  const safeFile = path.basename(req.params.file);
  const filePath = path.join(uploadDir, safeFile);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return res.json({ success: true });
  }
  res.status(404).json({ error: 'File not found' });
});

app.post('/api/upload', upload.array('files', 10), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }
  
  try {
    const uploadedUrls = [];
    for (const file of req.files) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      let filename = uniqueSuffix + '-' + file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
      
      // Auto convert images to WebP
      if (file.mimetype.startsWith('image/')) {
        filename = filename.replace(/\.[^/.]+$/, "") + '.webp';
        await sharp(file.buffer)
          .webp({ quality: 80 })
          .toFile(path.join(uploadDir, filename));
      } else {
        fs.writeFileSync(path.join(uploadDir, filename), file.buffer);
      }
      
      uploadedUrls.push(`/uploads/${filename}`);
    }
    
    exec('npm run build', (error) => {
      if (error) console.error(`Build error after upload: ${error}`);
    });
    
    res.json({ success: true, urls: uploadedUrls });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Error processing upload' });
  }
});

// --- BACKUP & RESTORE API ---

app.get('/api/backup', (req, res) => {
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) return res.json({});
  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
  const backupData = {};
  files.forEach(f => {
    backupData[f] = JSON.parse(fs.readFileSync(path.join(dataDir, f), 'utf8'));
  });
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename="arusuvai-backup.json"');
  res.send(JSON.stringify(backupData, null, 2));
});

app.post('/api/restore', upload.single('backupFile'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  try {
    const backupData = JSON.parse(req.file.buffer.toString('utf8'));
    const dataDir = path.join(__dirname, 'data');
    for (const [filename, content] of Object.entries(backupData)) {
      if (filename.endsWith('.json')) {
        await writeJsonSafe(path.join(dataDir, path.basename(filename)), content);
      }
    }
    updateStaticSite();
    exec('npm run build');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Invalid backup file' });
  }
});

// --- STATIC ASSETS ---

app.get('/kitchen-99-admin', authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, 'kitchen-99-admin', 'index.html'));
});

app.use('/kitchen-99-admin/assets', express.static(path.join(__dirname, 'kitchen-99-admin', 'assets')));
app.use('/kitchen-99-admin/js', express.static(path.join(__dirname, 'kitchen-99-admin', 'js')));

app.use(express.static(path.join(__dirname, 'dist'), { extensions: ['html'] }));
app.use(express.static(path.join(__dirname, 'public'), { extensions: ['html'] }));

// Fallback for missing build
app.use((req, res) => {
  res.status(404).send(`
    <h1>Build Not Found</h1>
    <p>Cannot find the requested page. If you are deploying this app, make sure to run <code>npm run build</code> so the <code>dist</code> directory is generated.</p>
  `);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
