const mongoose = require('mongoose');
const { isMongo, localDb } = require('../config/db');

// 1. Define Mongoose Schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  googleId: { type: String },
  avatar: { type: String },
  settings: {
    theme: { type: String, default: 'dark' },
    aiProvider: { type: String, default: 'mock' }, // 'openai', 'gemini', 'mock'
    customApiKey: { type: String, default: '' }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const MongoUserModel = mongoose.models.User || mongoose.model('User', UserSchema);

// 2. Unified Wrapper
const User = {
  findOne: async (query) => {
    if (isMongo()) {
      return await MongoUserModel.findOne(query);
    } else {
      return localDb.findOne('users', (u) => {
        for (let key in query) {
          if (u[key] !== query[key]) return false;
        }
        return true;
      });
    }
  },

  findById: async (id) => {
    if (isMongo()) {
      return await MongoUserModel.findById(id);
    } else {
      return localDb.findOne('users', (u) => u._id === id);
    }
  },

  create: async (userData) => {
    if (isMongo()) {
      const newUser = new MongoUserModel(userData);
      return await newUser.save();
    } else {
      return localDb.insert('users', userData);
    }
  },

  findByIdAndUpdate: async (id, updateData) => {
    if (isMongo()) {
      return await MongoUserModel.findByIdAndUpdate(id, { $set: updateData }, { new: true });
    } else {
      return localDb.update('users', (u) => u._id === id, updateData);
    }
  }
};

module.exports = User;
