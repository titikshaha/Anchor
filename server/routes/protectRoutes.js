const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, (req, res) => {
  res.status(200).json({ msg: 'You are authorized', user: req.user.id });
});

module.exports = router;
