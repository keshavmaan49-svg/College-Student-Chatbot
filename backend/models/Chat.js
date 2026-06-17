const mongoose = require('mongoose');
const { isMongo, localDb } = require('../config/db');

const MessageSchema = new mongoose.Schema({
  sender: { type: String, enum: ['user', 'assistant'], required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const ChatSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, default: 'New Conversation' },
  messages: [MessageSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const MongoChatModel = mongoose.models.Chat || mongoose.model('Chat', ChatSchema);

const Chat = {
  find: async (query) => {
    if (isMongo()) {
      return await MongoChatModel.find(query).sort({ updatedAt: -1 });
    } else {
      const items = localDb.find('chats', (c) => {
        for (let key in query) {
          if (c[key] !== query[key]) return false;
        }
        return true;
      });
      return items.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }
  },

  findById: async (id) => {
    if (isMongo()) {
      return await MongoChatModel.findById(id);
    } else {
      return localDb.findOne('chats', (c) => c._id === id);
    }
  },

  create: async (chatData) => {
    if (isMongo()) {
      const newChat = new MongoChatModel(chatData);
      return await newChat.save();
    } else {
      return localDb.insert('chats', {
        messages: [],
        ...chatData
      });
    }
  },

  findByIdAndUpdate: async (id, updateData) => {
    if (isMongo()) {
      return await MongoChatModel.findByIdAndUpdate(id, { $set: updateData }, { new: true });
    } else {
      return localDb.update('chats', (c) => c._id === id, updateData);
    }
  },

  deleteOne: async (query) => {
    if (isMongo()) {
      return await MongoChatModel.deleteOne(query);
    } else {
      return localDb.delete('chats', (c) => {
        for (let key in query) {
          if (c[key] !== query[key]) return false;
        }
        return true;
      });
    }
  }
};

module.exports = Chat;
