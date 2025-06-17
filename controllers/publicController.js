const path = require('path');
const fs = require('fs');

exports.renderHome = (req, res) => res.render('home');
exports.renderServices = (req, res) => res.render('services');
exports.renderDataProtection = (req, res) => res.render('data-protection');
exports.renderDownloads = (req, res) => {
  const publicDir = path.join(__dirname, '../public/uploads/public');
  const eulogyDir = path.join(__dirname, '../public/uploads/eulogy');

  const getFiles = (dir) => fs.readdirSync(dir).map(filename => ({
    filename,
    originalname: filename
  }));

  res.render('downloads', {
    publicDocs: getFiles(publicDir),
    eulogyDocs: getFiles(eulogyDir)
  });
};
