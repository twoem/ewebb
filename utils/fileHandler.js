const fs = require('fs');
const path = require('path');

const EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

const removeOldFiles = (dirPath) => {
  const now = Date.now();
  fs.readdirSync(dirPath).forEach(file => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isFile() && now - fs.statSync(filePath).mtimeMs > EXPIRY_MS) {
      fs.unlinkSync(filePath);
    }
  });
};

module.exports = { removeOldFiles };
