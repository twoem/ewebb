const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

let ADMIN_USERNAME = process.env.ADMIN_USERNAME;
let ADMIN_HASHED_PASSWORD = process.env.ADMIN_HASHED_PASSWORD;

exports.renderLogin = (req, res) => res.render('login');

exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && await bcrypt.compare(password, ADMIN_HASHED_PASSWORD)) {
    req.session.authenticated = true;
    res.redirect('/admin/dashboard');
  } else {
    res.send('Login failed');
  }
};

exports.renderDashboard = (req, res) => res.render('dashboard');

exports.handleUpload = (req, res) => {
  const docType = req.body.docType;
  const file = req.file;
  if (!file || !['public', 'eulogy'].includes(docType)) return res.send('Invalid upload');

  const dest = path.join(__dirname, `../public/uploads/${docType}/${file.originalname}`);
  fs.renameSync(file.path, dest);
  res.redirect('/admin/dashboard');
};
