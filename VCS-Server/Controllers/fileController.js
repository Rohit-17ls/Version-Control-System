const fs = require('fs');

// Specify the path to the file you want to read
const filePath = '../DB/connection.js';

// Use the `fs.readFile` function to read the file
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  console.log('File contents:', data);
});