// server.js
require('dotenv').config(); // Load env vars in development; in Render, .env isn't used but harmless if absent

const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
// Use Render’s PORT or default 3000
const PORT = process.env.PORT || 3000;

// Ensure essential env vars
const SESSION_SECRET = process.env.SESSION_SECRET;
const DEFAULT_ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD;

if (!SESSION_SECRET) {
  console.error('Error: SESSION_SECRET is not set. Exiting.');
  process.exit(1);
}
if (!DEFAULT_ADMIN_PASSWORD) {
  console.error('Error: DEFAULT_ADMIN_PASSWORD is not set. Exiting.');
  process.exit(1);
}

// Paths
const PUBLIC_DIR = path.join(__dirname, 'public');
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const UPLOADS_PUBLIC_DIR = path.join(UPLOADS_DIR, 'public');
const UPLOADS_EULOGY_DIR = path.join(UPLOADS_DIR, 'eulogy');
const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_JSON = path.join(DATA_DIR, 'uploads.json');

// Ensure directories exist
[UPLOADS_DIR, UPLOADS_PUBLIC_DIR, UPLOADS_EULOGY_DIR, DATA_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});
// Initialize uploads.json if not exists
if (!fs.existsSync(UPLOADS_JSON)) {
  fs.writeFileSync(UPLOADS_JSON, JSON.stringify([]));
}

// Session setup
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

// Set view engine for admin pages
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(PUBLIC_DIR));
app.use('/uploads/public', express.static(UPLOADS_PUBLIC_DIR));

// Default admin credentials (username always 'admin')
const DEFAULT_USERNAME = 'admin';
const SALT_ROUNDS = 10;
// Hash default admin password on startup
let defaultHashedPassword = null;
bcrypt.hash(DEFAULT_ADMIN_PASSWORD, SALT_ROUNDS).then(hash => {
  defaultHashedPassword = hash;
});

// Helper: read/write uploads metadata
function readUploadsMeta() {
  try {
    const data = fs.readFileSync(UPLOADS_JSON, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading uploads metadata:', err);
    return [];
  }
}
function writeUploadsMeta(arr) {
  fs.writeFileSync(UPLOADS_JSON, JSON.stringify(arr, null, 2));
}

// Auto-clean expired eulogy files (>7 days)
function cleanupExpiredEulogy() {
  const meta = readUploadsMeta();
  const now = Date.now();
  let changed = false;
  const filtered = meta.filter(item => {
    if (item.category === 'Eulogy') {
      const expiry = new Date(item.expiryDate).getTime();
      if (now > expiry) {
        const filePath = path.join(UPLOADS_EULOGY_DIR, item.storedName);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        changed = true;
        return false;
      }
    }
    return true;
  });
  if (changed) {
    writeUploadsMeta(filtered);
  }
}
// Run cleanup at startup
cleanupExpiredEulogy();

// Middleware: require admin session
function requireAdmin(req, res, next) {
  if (req.session && req.session.isAdmin) {
    next();
  } else {
    res.redirect('/admin/login');
  }
}

// --------- Admin Login
app.get('/admin/login', (req, res) => {
  res.render('admin-login', { error: null });
});

app.post('/admin/login', async (req, res) => {
  const { username, password } = req.body;
  if (username === DEFAULT_USERNAME && defaultHashedPassword) {
    // Read stored hash if password has been changed
    const PASS_FILE = path.join(DATA_DIR, 'password.json');
    let currentHash;
    if (fs.existsSync(PASS_FILE)) {
      const obj = JSON.parse(fs.readFileSync(PASS_FILE, 'utf-8'));
      currentHash = obj.hash;
    } else {
      currentHash = defaultHashedPassword;
    }
    const match = await bcrypt.compare(password, currentHash);
    if (match) {
      req.session.isAdmin = true;
      // If first login (password.json not exists), force change
      if (!fs.existsSync(PASS_FILE)) {
        return res.redirect('/admin/change-password');
      }
      return res.redirect('/admin/dashboard');
    }
  }
  res.render('admin-login', { error: 'Invalid credentials' });
});

// --------- Change Password
app.get('/admin/change-password', requireAdmin, (req, res) => {
  res.render('change-password', { error: null });
});
app.post('/admin/change-password', requireAdmin, async (req, res) => {
  const { newPassword, confirmPassword } = req.body;
  if (!newPassword || newPassword.length < 6) {
    return res.render('change-password', { error: 'Password must be at least 6 characters' });
  }
  if (newPassword !== confirmPassword) {
    return res.render('change-password', { error: 'Passwords do not match' });
  }
  const hash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  const PASS_FILE = path.join(DATA_DIR, 'password.json');
  fs.writeFileSync(PASS_FILE, JSON.stringify({ hash }));
  res.redirect('/admin/dashboard');
});

// --------- Admin Dashboard
app.get('/admin/dashboard', requireAdmin, (req, res) => {
  const meta = readUploadsMeta();
  res.render('admin-dashboard', { uploads: meta, error: null, success: null });
});

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const category = req.body.category;
    if (category === 'Eulogy') {
      cb(null, UPLOADS_EULOGY_DIR);
    } else {
      cb(null, UPLOADS_PUBLIC_DIR);
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const storedName = uuidv4() + ext;
    cb(null, storedName);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

// Handle upload POST
app.post('/admin/upload', requireAdmin, upload.single('document'), (req, res) => {
  cleanupExpiredEulogy();
  if (!req.file) {
    const meta = readUploadsMeta();
    return res.render('admin-dashboard', { uploads: meta, error: 'File upload failed or no file selected', success: null });
  }
  const { originalname, filename: storedName } = req.file;
  const category = req.body.category;
  const uploadDate = new Date().toISOString();
  let expiryDate = null;
  if (category === 'Eulogy') {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
    expiryDate = expiry.toISOString();
  }
  const meta = readUploadsMeta();
  meta.push({
    id: uuidv4(),
    originalName: originalname,
    storedName,
    category,
    uploadDate,
    expiryDate
  });
  writeUploadsMeta(meta);
  res.render('admin-dashboard', { uploads: meta, error: null, success: 'File uploaded successfully' });
});

// Handle delete file
app.post('/admin/delete', requireAdmin, (req, res) => {
  const { id } = req.body;
  let meta = readUploadsMeta();
  const item = meta.find(u => u.id === id);
  if (item) {
    const dir = item.category === 'Eulogy' ? UPLOADS_EULOGY_DIR : UPLOADS_PUBLIC_DIR;
    const filePath = path.join(dir, item.storedName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    meta = meta.filter(u => u.id !== id);
    writeUploadsMeta(meta);
    return res.render('admin-dashboard', { uploads: meta, error: null, success: 'File deleted' });
  }
  res.render('admin-dashboard', { uploads: meta, error: 'File not found', success: null });
});

// API for Downloads page to list public docs
app.get('/api/public-docs', (req, res) => {
  const meta = readUploadsMeta();
  const publicDocs = meta
    .filter(item => item.category === 'Public')
    .map(item => ({
      id: item.id,
      originalName: item.originalName,
      url: `/uploads/public/${item.storedName}`,
      uploadDate: item.uploadDate
    }));
  res.json(publicDocs);
});

// Optional: Admin logout
app.get('/admin/logout', requireAdmin, (req, res) => {
  req.session.destroy(() => res.redirect('/admin/login'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
