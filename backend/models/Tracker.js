const mongoose = require('mongoose');
const { isMongo, localDb } = require('../config/db');

const TrackerSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  type: { type: String, required: true }, // 'attendance', 'gpa', 'timetable', 'checklist'
  data: { type: mongoose.Schema.Types.Mixed, required: true },
  updatedAt: { type: Date, default: Date.now }
});

const MongoTrackerModel = mongoose.models.Tracker || mongoose.model('Tracker', TrackerSchema);

const Tracker = {
  findOne: async (query) => {
    if (isMongo()) {
      return await MongoTrackerModel.findOne(query);
    } else {
      return localDb.findOne('trackers', (t) => {
        for (let key in query) {
          if (t[key] !== query[key]) return false;
        }
        return true;
      });
    }
  },

  create: async (trackerData) => {
    if (isMongo()) {
      const newTracker = new MongoTrackerModel(trackerData);
      return await newTracker.save();
    } else {
      return localDb.insert('trackers', trackerData);
    }
  },

  findOneAndUpdate: async (query, updateData) => {
    if (isMongo()) {
      return await MongoTrackerModel.findOneAndUpdate(query, { $set: updateData }, { new: true, upsert: true });
    } else {
      const existing = await Tracker.findOne(query);
      if (existing) {
        return localDb.update('trackers', (t) => t._id === existing._id, updateData);
      } else {
        return localDb.insert('trackers', { ...query, ...updateData });
      }
    }
  }
};

module.exports = Tracker;
