const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
const authMiddleware = require('../config/auth.middleware');

router.use(authMiddleware);

router.get('/', chatController.getChats);
router.post('/', chatController.createChat);
router.get('/:id/messages', chatController.getChatMessages);
router.post('/:id/messages', chatController.sendMessage);
router.delete('/:id', chatController.deleteChat);

module.exports = router;
