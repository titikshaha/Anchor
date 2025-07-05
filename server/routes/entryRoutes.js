const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Entry = require('../models/entry');
const moment = require('moment');

// Mood Logging (Home Page)
router.post('/mood', authMiddleware, async (req, res) => {
  const { mood } = req.body;

  if (!mood) {
    return res.status(400).json({ error: "Mood is required." });
  }

  const start = moment().startOf('day').toDate();
  const end = moment().endOf('day').toDate();

  const existing = await Entry.findOne({
    user: req.user.id,
    date: { $gte: start, $lte: end }
  });

  if (existing) {
    return res.status(409).json({ error: "Mood already submitted today." });
  }

  try {
    const newEntry = new Entry({
      user: req.user.id,
      mood
      
    });
    const saved = await newEntry.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save mood' });
  }
});

// Journal Entry (Diary Page)
router.post('/journal', authMiddleware, async (req, res) => {
  const { journal } = req.body;

  if (!journal || journal.length > 1000) {
    return res.status(400).json({ error: 'Journal must be under 1000 characters.' });
  }

  const start = moment().startOf('day').toDate();
  const end = moment().endOf('day').toDate();

  const existing = await Entry.findOne({
    user: req.user.id,
    date: { $gte: start, $lte: end }
  });

  try {
    if (existing) {
      existing.journal = journal;
      const updated = await existing.save();
      res.json(updated);
    } else {
      const newEntry = new Entry({
        user: req.user.id,
        journal
      });
      const saved = await newEntry.save();
      res.status(201).json(saved);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to save journal entry' });
  }
});

// Update journal (only same-day allowed)
router.put('/:id', authMiddleware, async (req, res) => {
  const { journal } = req.body;
  if (!journal || journal.trim() === "") {
    return res.status(400).json({ error: "Journal content is required." });
  }

  try {
    const entry = await Entry.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!entry) return res.status(404).json({ error: "Entry not found" });

    const now = moment();
    const entryDate = moment(entry.date);

    if (!now.isSame(entryDate, 'day')) {
      return res.status(403).json({ error: "You can only edit today's journal." });
    }

    entry.journal = journal;
    const updated = await entry.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update entry" });
  }
});

// Get all entries for logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const entries = await Entry.find({ user: req.user.id }).sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch entries' });
  }
});

// Check if today’s entry exists
router.get('/has-today-entry', authMiddleware, async (req, res) => {
  try {
    const startOfToday = moment().startOf('day').toDate();
    const endOfToday = moment().endOf('day').toDate();

    const existingEntry = await Entry.findOne({
      user: req.user.id,
      date: { $gte: startOfToday, $lte: endOfToday }
    });

    if (existingEntry) {
      res.json({
        submitted: true,
        mood: existingEntry.mood,
        journal: existingEntry.journal
      });
    } else {
      res.json({ submitted: false });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to check today's entry" });
  }
});

// Get today's mood entry
router.get('/today/mood', authMiddleware, async (req, res) => {
  const start = moment().startOf('day').toDate();
  const end = moment().endOf('day').toDate();

  try {
    const entry = await Entry.findOne({
      user: req.user.id,
      date: { $gte: start, $lte: end }
    });

    if (entry) {
      res.json({ submitted: true, mood: entry.mood, timestamp: entry.date });
    } else {
      res.json({ submitted: false });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch today's mood." });
  }
});

// Get today's journal
router.get('/today/journal', authMiddleware, async (req, res) => {
  const start = moment().startOf('day').toDate();
  const end = moment().endOf('day').toDate();

  try {
    const entry = await Entry.findOne({
      user: req.user.id,
      date: { $gte: start, $lte: end }
    });

    if (entry) {
      res.json(entry);
    } else {
      res.status(204).send();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch today's entry." });
  }
});

// Weekly mood data
router.get('/weekly-mood', authMiddleware, async (req, res) => {
  try {
    const today = moment().startOf('day');
    const sevenDaysAgo = moment(today).subtract(6, 'days');

    const last7Dates = [];
    for (let i = 0; i < 7; i++) {
      last7Dates.push(moment(sevenDaysAgo).add(i, 'days').format('YYYY-MM-DD'));
    }

    const entries = await Entry.find({
      user: req.user.id,
      date: {
        $gte: sevenDaysAgo.toDate(),
        $lte: moment(today).endOf('day').toDate()
      }
    });

    const entryMap = {};
    entries.forEach(entry => {
      const dateKey = moment(entry.date).format('YYYY-MM-DD');
      entryMap[dateKey] = entry.mood || null;
    });

    const moodData = last7Dates.map(date => ({
      date,
      mood: entryMap[date] || null
    }));

    res.json(moodData);
  } catch (err) {
    console.error('Weekly mood error:', err);
    res.status(500).json({ msg: 'Failed to fetch mood data' });
  }
});

module.exports = router;
