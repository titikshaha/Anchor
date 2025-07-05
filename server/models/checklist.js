const mongoose = require('mongoose');

const checklistItemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

const ChecklistItem = mongoose.model('ChecklistItem', checklistItemSchema);
module.exports = ChecklistItem;
