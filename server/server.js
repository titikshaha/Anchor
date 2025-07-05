const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors({
  origin: "http://localhost:3000", // React app
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
//console.log('Connecting to:', process.env.MONGO_URI);

const checklistRoutes = require('./routes/checklistRoutes');
app.use('/api/checklist', checklistRoutes);

const protectedRoute = require('./routes/protectRoutes');
app.use('/api/protected', protectedRoute);

app.get('/', (req, res) => {
  res.status(404).json({ msg: 'Route not found', path: req.path });
});
const entryRoutes = require('./routes/entryRoutes');
app.use('/api/entries', entryRoutes);

const spotifyRoutes = require('./routes/spotifyRoutes1');
app.use('/api', spotifyRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error('❌ DB connection error:', err.message);
  });
