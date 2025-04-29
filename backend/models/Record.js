const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({
  name: String,
  amount: Number,
  loanPercentage: Number,
  address: String,
  date: Date,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Record", recordSchema);
