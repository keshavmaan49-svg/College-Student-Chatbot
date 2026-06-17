const Tracker = require('../models/Tracker');

exports.getTracker = async (req, res) => {
  try {
    const { type } = req.params;
    if (!['attendance', 'gpa', 'timetable', 'checklist'].includes(type)) {
      return res.status(400).json({ error: 'Invalid tracker type' });
    }

    let tracker = await Tracker.findOne({ userId: req.user.id, type });
    if (!tracker) {
      let defaultData;
      if (type === 'attendance') {
        defaultData = [];
      } else if (type === 'gpa') {
        defaultData = {
          currentCgpa: 0,
          targetCgpa: 0,
          semesters: []
        };
      } else if (type === 'timetable') {
        defaultData = {
          Monday: [],
          Tuesday: [],
          Wednesday: [],
          Thursday: [],
          Friday: []
        };
      } else if (type === 'checklist') {
        defaultData = [];
      }

      tracker = await Tracker.create({
        userId: req.user.id,
        type,
        data: defaultData
      });
    }

    res.json(tracker);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTracker = async (req, res) => {
  try {
    const { type } = req.params;
    const { data } = req.body;
    if (!['attendance', 'gpa', 'timetable', 'checklist'].includes(type)) {
      return res.status(400).json({ error: 'Invalid tracker type' });
    }

    const tracker = await Tracker.findOneAndUpdate(
      { userId: req.user.id, type },
      { data, updatedAt: new Date() }
    );

    res.json(tracker);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
