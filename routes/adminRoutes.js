const express = require('express');
const router = express.Router();
const multer = require('multer');
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');

const upload = multer({ dest: 'public/uploads/temp/' });

router.get('/admin/login', adminController.renderLogin);
router.post('/admin/login', adminController.login);
router.get('/admin/dashboard', auth.ensureAuthenticated, adminController.renderDashboard);
router.post('/admin/upload', auth.ensureAuthenticated, upload.single('document'), adminController.handleUpload);

module.exports = router;
