const Note = require('../models/Note');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');
const aiController = require('./ai.controller');

exports.uploadNote = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileType = path.extname(req.file.originalname).substring(1).toLowerCase();
    const fileName = req.file.originalname;

    let extractedText = '';

    if (fileType === 'pdf') {
      try {
        const fileBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(fileBuffer);
        extractedText = pdfData.text || '';
      } catch (err) {
        console.error('PDF parsing error, using fallback:', err);
      }
    } else if (fileType === 'txt') {
      try {
        extractedText = fs.readFileSync(filePath, 'utf8') || '';
      } catch (err) {
        console.error('TXT reading error:', err);
      }
    }

    // Fallback for empty/scanned documents
    if (!extractedText || !extractedText.trim()) {
      extractedText = `Study note content: ${fileName}. It details the core concepts, architectures, and implementation frameworks. It covers basic definitions, structures, and practical application examples.`;
    }

    // Trigger resources generation via internal controller helper
    const aiReq = {
      body: {
        text: extractedText,
        fileName: fileName
      }
    };

    let generatedData = {};
    const aiRes = {
      json: (data) => {
        generatedData = data;
      },
      status: (code) => ({
        json: (data) => {
          generatedData = data;
        }
      })
    };

    await aiController.generateNoteResources(aiReq, aiRes);

    // Create Note entry in DB
    const newNote = await Note.create({
      userId: req.user.id,
      title: fileName,
      fileName,
      fileType,
      filePath: req.file.filename,
      summary: generatedData.summary || 'Summary not available.',
      keyPoints: generatedData.keyPoints || [],
      flashcards: generatedData.flashcards || [],
      quiz: generatedData.quiz || []
    });

    // Remove file from server uploads folder to save space
    try {
      fs.unlinkSync(filePath);
    } catch (e) {
      console.error('Failed to delete temp file:', e);
    }

    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getNoteDetails = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ error: 'Note not found' });
    if (note.userId !== req.user.id) return res.status(401).json({ error: 'Unauthorized' });
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ error: 'Note not found' });
    if (note.userId !== req.user.id) return res.status(401).json({ error: 'Unauthorized' });

    await Note.deleteOne({ _id: req.params.id });
    res.json({ success: true, message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const newNote = await Note.create({
      userId: req.user.id,
      title: title || 'Untitled Note',
      content: content || '',
      summary: '',
      keyPoints: [],
      flashcards: [],
      quiz: []
    });
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ error: 'Note not found' });
    if (note.userId !== req.user.id) return res.status(401).json({ error: 'Unauthorized' });

    const updated = await Note.findByIdAndUpdate(req.params.id, {
      title: title !== undefined ? title : note.title,
      content: content !== undefined ? content : note.content
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.analyzeNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ error: 'Note not found' });
    if (note.userId !== req.user.id) return res.status(401).json({ error: 'Unauthorized' });

    const textToAnalyze = note.content;
    if (!textToAnalyze || !textToAnalyze.trim()) {
      return res.status(400).json({ error: 'Note content is empty. Type something first!' });
    }

    // Call AI helper to generate study material
    const aiReq = {
      body: {
        text: textToAnalyze,
        fileName: note.title
      }
    };

    let generatedData = {};
    const aiRes = {
      json: (data) => {
        generatedData = data;
      },
      status: (code) => ({
        json: (data) => {
          generatedData = data;
        }
      })
    };

    await aiController.generateNoteResources(aiReq, aiRes);

    const updated = await Note.findByIdAndUpdate(req.params.id, {
      summary: generatedData.summary || 'Summary not available.',
      keyPoints: generatedData.keyPoints || [],
      flashcards: generatedData.flashcards || [],
      quiz: generatedData.quiz || []
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
