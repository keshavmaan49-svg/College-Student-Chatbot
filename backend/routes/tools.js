const express = require('express');
const router = express.Router();
const toolsController = require('../controllers/tools.controller');
const authMiddleware = require('../config/auth.middleware');

router.use(authMiddleware);

router.get('/:type', toolsController.getTracker);
router.put('/:type', toolsController.updateTracker);

module.exports = router;
