const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

let isMongoConnected = false;

// Directory for local JSON database fallback
const DATA_DIR = path.join(__dirname, '../data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    console.log('⚠️  No MONGODB_URI found in environment. Using local JSON file database fallback.');
    isMongoConnected = false;
    return false;
  }

  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000 // Timeout after 3 seconds
    });
    console.log('✅ Connected to MongoDB successfully.');
    isMongoConnected = true;
    return true;
  } catch (err) {
    console.error(`❌ MongoDB Connection Error: ${err.message}`);
    console.log('⚠️  Falling back to local JSON file database store.');
    isMongoConnected = false;
    return false;
  }
};

// Local JSON File Helper
const localDb = {
  read: (collection) => {
    const filePath = path.join(DATA_DIR, `${collection}.json`);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([], null, 2));
      return [];
    }
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data || '[]');
    } catch (e) {
      return [];
    }
  },
  write: (collection, data) => {
    const filePath = path.join(DATA_DIR, `${collection}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  },
  findOne: (collection, queryFn) => {
    const items = localDb.read(collection);
    return items.find(queryFn);
  },
  find: (collection, queryFn = () => true) => {
    const items = localDb.read(collection);
    return items.filter(queryFn);
  },
  insert: (collection, doc) => {
    const items = localDb.read(collection);
    const newDoc = {
      _id: doc._id || Math.random().toString(36).substring(2, 11),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...doc
    };
    items.push(newDoc);
    localDb.write(collection, items);
    return newDoc;
  },
  update: (collection, queryFn, updateData) => {
    const items = localDb.read(collection);
    const index = items.findIndex(queryFn);
    if (index === -1) return null;
    items[index] = {
      ...items[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    localDb.write(collection, items);
    return items[index];
  },
  delete: (collection, queryFn) => {
    let items = localDb.read(collection);
    const initialLen = items.length;
    items = items.filter(item => !queryFn(item));
    localDb.write(collection, items);
    return items.length < initialLen;
  }
};

module.exports = {
  connectDB,
  isMongo: () => isMongoConnected,
  localDb
};
