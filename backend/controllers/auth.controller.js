const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey_for_college_student_assistant';

// Auto-creater for review credentials
const ensureReviewUser = async () => {
  const email = 'keshavmaan@college.edu';
  try {
    const user = await User.findOne({ email });
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('keshav', salt);
      await User.create({
        name: 'Keshav Maan',
        email,
        password: hashedPassword,
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=KeshavMaan',
        settings: {
          theme: 'dark',
          aiProvider: 'mock',
          customApiKey: ''
        }
      });
      console.log('✅ Review account auto-created successfully.');
    }
  } catch (e) {
    console.error('Failed to pre-create review account:', e);
  }
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please enter all fields' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
      settings: {
        theme: 'dark',
        aiProvider: 'mock',
        customApiKey: ''
      }
    });

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
        settings: newUser.settings
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Please enter all fields' });
    }

    // Auto-create if it's the review user
    if (email === 'keshavmaan@college.edu' && password === 'keshav') {
      await ensureReviewUser();
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials. Use keshavmaan / keshav' });
    }

    if (!user.password) {
      return res.status(400).json({ error: 'This email is linked with Google Login. Please use Google Login.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials. Use keshavmaan / keshav' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        settings: user.settings
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.googleLogin = async (req, res) => {
  try {
    const { name, email, googleId, avatar } = req.body;
    if (!email || !googleId) {
      return res.status(400).json({ error: 'Google credentials missing' });
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name: name || 'Student',
        email,
        googleId,
        avatar: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
        settings: {
          theme: 'dark',
          aiProvider: 'mock',
          customApiKey: ''
        }
      });
    } else if (!user.googleId) {
      user = await User.findByIdAndUpdate(user._id, { googleId, avatar: avatar || user.avatar });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        settings: user.settings
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      settings: user.settings
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const { theme, aiProvider, customApiKey, name } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    updateData.settings = {
      theme: theme || user.settings?.theme || 'dark',
      aiProvider: aiProvider || user.settings?.aiProvider || 'mock',
      customApiKey: customApiKey !== undefined ? customApiKey : (user.settings?.customApiKey || '')
    };

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData);
    res.json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      settings: updatedUser.settings
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
