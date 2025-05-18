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


// 🔥 Delete a specific record by ID
router.delete('/api/loans/:id', authMiddleware, async (req, res) => {
  console.log('Delete record request received');
  console.log('Record ID:', req.params.id);
  try {
    const record = await Record.findOne({ _id: req.params.id, user: req.user.id });

    if (!record) {
      return res.status(404).json({ message: 'Record not found or unauthorized' });
    }

    await Record.deleteOne({ _id: req.params.id });
    res.json({ message: 'Record deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
