const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const notesController = require('../controllers/notes.controller');
const authMiddleware = require('../config/auth.middleware');

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.pdf' || ext === '.docx' || ext === '.doc' || ext === '.ppt' || ext === '.pptx' || ext === '.txt') {
      cb(null, true);
    } else {
      cb(new Error('Only document files (PDF, DOCX, PPT, TXT) are allowed'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

router.use(authMiddleware);

router.post('/upload', upload.single('file'), notesController.uploadNote);
router.get('/', notesController.getNotes);
router.get('/:id', notesController.getNoteDetails);
router.delete('/:id', notesController.deleteNote);

// Direct Typing Note Sheet Endpoints
router.post('/', notesController.createNote);
router.put('/:id', notesController.updateNote);
router.post('/:id/analyze', notesController.analyzeNote);

module.exports = router;
