const express = require('express');
const router = express.Router();
const Record = require('../models/Record');
const authMiddleware = require('../middleware/authMiddleware');

// Get all records for logged in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const records = await Record.find({ user: req.user.id }).sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new record
router.post('/', authMiddleware, async (req, res) => {
  const { name, amount, loanPercentage, address, date } = req.body;
  try {
    const newRecord = new Record({
      name,
      amount,
      loanPercentage,
      address,
      date,
      user: req.user.id,
    });

    const savedRecord = await newRecord.save();
    res.json(savedRecord);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
