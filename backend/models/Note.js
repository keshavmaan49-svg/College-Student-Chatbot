const mongoose = require('mongoose');
const { isMongo, localDb } = require('../config/db');

const FlashcardSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true }
});

const QuizQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String }],
  answerIndex: { type: Number, required: true }
});

const NoteSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, default: '' },
  fileName: { type: String },
  fileType: { type: String },
  filePath: { type: String },
  summary: { type: String },
  keyPoints: [{ type: String }],
  flashcards: [FlashcardSchema],
  quiz: [QuizQuestionSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const MongoNoteModel = mongoose.models.Note || mongoose.model('Note', NoteSchema);

const Note = {
  find: async (query) => {
    if (isMongo()) {
      return await MongoNoteModel.find(query).sort({ createdAt: -1 });
    } else {
      const items = localDb.find('notes', (n) => {
        for (let key in query) {
          if (n[key] !== query[key]) return false;
        }
        return true;
      });
      return items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  },

  findById: async (id) => {
    if (isMongo()) {
      return await MongoNoteModel.findById(id);
    } else {
      return localDb.findOne('notes', (n) => n._id === id);
    }
  },

  create: async (noteData) => {
    if (isMongo()) {
      const newNote = new MongoNoteModel(noteData);
      return await newNote.save();
    } else {
      return localDb.insert('notes', {
        keyPoints: [],
        flashcards: [],
        quiz: [],
        ...noteData
      });
    }
  },

  findByIdAndUpdate: async (id, updateData) => {
    if (isMongo()) {
      return await MongoNoteModel.findByIdAndUpdate(id, { $set: updateData }, { new: true });
    } else {
      return localDb.update('notes', (n) => n._id === id, updateData);
    }
  },

  deleteOne: async (query) => {
    if (isMongo()) {
      return await MongoNoteModel.deleteOne(query);
    } else {
      return localDb.delete('notes', (n) => {
        for (let key in query) {
          if (n[key] !== query[key]) return false;
        }
        return true;
      });
    }
  }
};

module.exports = Note;
