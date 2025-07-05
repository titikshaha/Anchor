const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  journal: {
    type: String,
   // required: true,
    maxlength: 1000,
  },
  date: {
    type: Date,
    default: Date.now, // captures creation time
    index: true,
  }
}, {
  timestamps: true // includes createdAt and updatedAt fields
});

const Entry = mongoose.model('Entry', entrySchema);
module.exports = Entry;

