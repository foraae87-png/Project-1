const fs = require('fs');
const currentData = JSON.parse(fs.readFileSync('data/menu.json', 'utf8'));
let arr = currentData.items;
let newItem = '';
if (arr.length > 0) {
  if (typeof arr[0] === 'object') {
    newItem = {};
    for (let k in arr[0]) {
      newItem[k] = typeof arr[0][k] === 'number' ? 0 : (typeof arr[0][k] === 'boolean' ? false : '');
    }
  }
} else {
  newItem = { name: '', description: '' };
}
arr.push(newItem);
console.log(arr[arr.length - 1]);
