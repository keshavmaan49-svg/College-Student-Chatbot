const Chat = require('../models/Chat');
const User = require('../models/User');
const aiController = require('./ai.controller');

exports.getChats = async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user.id });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getChatMessages = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) return res.status(404).json({ error: 'Chat not found' });
    if (chat.userId !== req.user.id) return res.status(401).json({ error: 'Unauthorized' });
    res.json(chat.messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createChat = async (req, res) => {
  try {
    const { title } = req.body;
    const newChat = await Chat.create({
      userId: req.user.id,
      title: title || 'New Conversation'
    });
    res.status(201).json(newChat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    let chat = await Chat.findById(req.params.id);
    if (!chat) return res.status(404).json({ error: 'Chat not found' });
    if (chat.userId !== req.user.id) return res.status(401).json({ error: 'Unauthorized' });

    // Append user message
    const userMsg = { sender: 'user', text: message, timestamp: new Date() };
    const updatedMessages = [...chat.messages, userMsg];

    // Get user custom key and setting
    const user = await User.findById(req.user.id);
    const settings = user?.settings || { aiProvider: 'mock', customApiKey: '' };

    // Format request object
    const aiReq = {
      body: {
        message,
        history: chat.messages,
        aiProvider: settings.aiProvider,
        customApiKey: settings.customApiKey
      }
    };

    // Response object mapping
    let aiReply = '';
    const aiRes = {
      json: (data) => {
        aiReply = data.reply;
      },
      status: (code) => ({
        json: (data) => {
          aiReply = data.reply || 'Sorry, I failed to generate a response.';
        }
      })
    };

    await aiController.getChatResponse(aiReq, aiRes);

    const assistantMsg = { sender: 'assistant', text: aiReply, timestamp: new Date() };
    updatedMessages.push(assistantMsg);

    // Save updated messages
    // If chat title is "New Conversation", rename it based on the first few words of the user message
    let newTitle = chat.title;
    if (chat.title === 'New Conversation') {
      newTitle = message.split(' ').slice(0, 4).join(' ') + '...';
    }

    const updatedChat = await Chat.findByIdAndUpdate(req.params.id, {
      messages: updatedMessages,
      title: newTitle,
      updatedAt: new Date()
    });

    res.json({
      chat: updatedChat,
      userMessage: userMsg,
      assistantMessage: assistantMsg
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) return res.status(404).json({ error: 'Chat not found' });
    if (chat.userId !== req.user.id) return res.status(401).json({ error: 'Unauthorized' });

    await Chat.deleteOne({ _id: req.params.id });
    res.json({ success: true, message: 'Chat deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
