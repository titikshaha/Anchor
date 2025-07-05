const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const createToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your_super_secret_key', {
    expiresIn: '7d',
  });
};

// Register Controller
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const trimmedPassword = password.trim();
    console.log('🔐 Registration Password:', trimmedPassword);

    // Let schema handle hashing via pre-save hook
    const user = await User.create({ username, email, password: trimmedPassword });

    console.log('✅ User registered:', user);

    const token = createToken(user);
    return res.status(201).json({ token, user: { id: user._id, username, email } });

  } catch (err) {
    console.error('❌ Registration error:', err);
    return res.status(500).json({ message: 'Registration failed.' });
  }
};

// Login Controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const trimmedPassword = password.trim();

    console.log('🔑 Login Email:', email);
    console.log('🔑 Login Password:', trimmedPassword);

    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found');
      return res.status(400).json({ message: 'Invalid email' });
    }

    console.log('📦 Found User:', user);
    console.log('📦 Stored Hashed Password:', user.password);

    const isMatch = await bcrypt.compare(trimmedPassword, user.password);
    console.log('🔍 Password Match:', isMatch);

    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    const token = createToken(user);
    console.log('✅ Login successful');

    return res.status(200).json({
      token,
      user: { id: user._id, username: user.username, email }
    });

  } catch (err) {
    console.error('❌ Login error:', err.message);
    return res.status(500).json({ message: 'Login failed.' });
  }
};

// const User = require('../models/user');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt'); // ✅ updated

// const createToken = (user) => {
//   return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//     expiresIn: '7d',
//   });
// };

// exports.register = async (req, res) => {
//   console.log("Registering user:", req.body);

//   try {
//     const { username, email, password } = req.body;

//     if (!username || !email || !password) {
//       return res.status(400).json({ message: "All fields are required." });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(409).json({ message: "User already exists." });
//     }

//     const trimmedPassword = password.trim();
//     const hashedPassword = await bcrypt.hash(trimmedPassword, 10);

//     const newUser = await User.create({
//       username,
//       email,
//       password: hashedPassword
//     });

//     const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
//       expiresIn: "7d",
//     });

//     console.log("✅ User registered successfully:", newUser.email);
//     res.status(201).json({ token, user: { id: newUser._id, username, email } });
//   } catch (err) {
//     console.error("Registration error:", err);
//     res.status(500).json({ message: "Registration failed." });
//   }
// };

// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(400).json({ msg: 'Invalid email' });
//     }

//     const trimmedPassword = password.trim();
//     const isMatch = await bcrypt.compare(trimmedPassword, user.password);

//     if (!isMatch) {
//       return res.status(400).json({ msg: 'Invalid password' });
//     }

//     const token = createToken(user);
//     res.status(200).json({ token, user: { id: user._id, username: user.username, email } });
//   } catch (err) {
//     console.error("Login error:", err);
//     res.status(500).json({ msg: 'Login error', error: err.message });
//   }
// };
