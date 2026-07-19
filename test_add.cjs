const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const html = fs.readFileSync('admin/index.html', 'utf8');
const dom = new JSDOM(html, { runScripts: "dangerously", resources: "usable" });
dom.window.fetch = async (url) => {
  if (url === '/api/stats') return { json: async () => ({}) };
  if (url === '/api/data/menu.json') {
    return {
      status: 200,
      json: async () => JSON.parse(fs.readFileSync('data/menu.json', 'utf8'))
    };
  }
};
setTimeout(() => {
  dom.window.selectFile('menu.json', dom.window.document.createElement('li')).then(() => {
    const addBtn = Array.from(dom.window.document.querySelectorAll('button')).find(b => b.textContent.includes('Add New items'));
    if (addBtn) {
      console.log('Found add button, clicking...');
      addBtn.click();
      console.log('Clicked add button. Items count:', dom.window.document.querySelectorAll('.array-item').length);
    } else {
      console.log('Add button not found');
    }
  }).catch(e => console.error(e));
}, 1000);
