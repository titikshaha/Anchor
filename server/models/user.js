const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


// defining user scheme with name, email and password
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 5,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/.+\@.+\..+/, 'Please enter a valid email'], 
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt timestamps to the document


// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // only hash if password was changed

 try {
  const salt = await bcrypt.genSalt(10);  // Generate a salt and hash the password with it

  this.password = await bcrypt.hash(this.password, salt);// hash password + salt
  next(); 
  }catch (err) {
    next(err);
  }
   // Continue to the next middleware or save function

});


module.exports = mongoose.model('User', userSchema);