const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

router.get('/', publicController.renderHome);
router.get('/services', publicController.renderServices);
router.get('/downloads', publicController.renderDownloads);
router.get('/data-protection', publicController.renderDataProtection);

module.exports = router;
