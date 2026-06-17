const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../config/auth.middleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/google-login', authController.googleLogin);
router.get('/me', authMiddleware, authController.getMe);
router.put('/settings', authMiddleware, authController.updateSettings);

module.exports = router;
