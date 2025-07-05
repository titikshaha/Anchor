const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const ChecklistItem = require('../models/checklist');

// Get all checklist items for the user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const items = await ChecklistItem.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch checklist' });
  }
});

// Add new item
router.post('/', authMiddleware, async (req, res) => {
  const { text } = req.body;

  if (!text) return res.status(400).json({ error: 'Checklist item text is required' });

  try {
    const item = new ChecklistItem({
      user: req.user.id,
      text,
    });

    const saved = await item.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add checklist item' });
  }
});

// Update item (mark complete/incomplete)
router.put('/:id', authMiddleware, async (req, res) => {
  const { completed } = req.body;

  try {
    const updated = await ChecklistItem.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { completed },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'Item not found' });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update checklist item' });
  }
});

// Delete item
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await ChecklistItem.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!deleted) return res.status(404).json({ error: 'Item not found' });

    res.json({ msg: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete checklist item' });
  }
});

module.exports = router;
