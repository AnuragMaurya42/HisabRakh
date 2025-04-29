const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const otpStore = {}; // { email: otp }

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ----------------- SEND OTP (for Registration) -----------------
router.post('/send-register-otp', async (req, res) => {
  const { email } = req.body;
  try {
    const userExist = await User.findOne({ email });
    if (userExist) return res.status(400).json({ message: 'Email already registered' });

    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
    otpStore[email] = otp;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify your Email (OTP)',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f7f7f7; border-radius: 10px;">
          <h2 style="color: #4CAF50;">Email Verification</h2>
          <p>Thank you for registering. Please use the OTP below to verify your email address:</p>
          <h1 style="color: #333; background-color: #e0e0e0; display: inline-block; padding: 10px 20px; border-radius: 5px;">${otp}</h1>
          <p style="margin-top: 20px;">This OTP is valid for 10 minutes.</p>
          <p style="color: #999; font-size: 12px;">If you did not request this, please ignore this email.</p>
        </div>
      `,
    });

    res.json({ success: true, message: 'OTP sent to your email' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});


// ----------------- VERIFY OTP -----------------
router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  const storedOtp = otpStore[email];

  if (!storedOtp) return res.status(400).json({ success: false, message: 'No OTP found. Please request again.' });

  if (parseInt(otp) !== storedOtp) {
    return res.status(400).json({ success: false, message: 'Invalid OTP' });
  }

  delete otpStore[email]; // Clear OTP after successful verification
  res.json({ success: true, message: 'OTP verified successfully' });
});

// ----------------- REGISTER USER (After OTP Verified) -----------------
router.post('/register', async (req, res) => {
  const { name, email, mobile, password } = req.body;
  try {
    const userExist = await User.findOne({ email });
    if (userExist) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      mobile,
      password: hashedPassword,
    });

    res.json({ success: true, message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// ----------------- LOGIN USER (Simple login with JWT) -----------------
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid Credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

    const payload = {
      id: user._id,
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ success: true, token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// ----------------- SEND OTP (for Password Reset) -----------------
router.post('/send-reset-otp', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
    otpStore[email] = otp;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: '🔐 Password Reset OTP',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; background: linear-gradient(to right, #f8f9fa, #e0f7fa); border-radius: 12px; max-width: 600px; margin: auto; box-shadow: 0 10px 20px rgba(0,0,0,0.1);">
          <div style="text-align: center;">
            <img src="https://cdn-icons-png.flaticon.com/512/2913/2913465.png" alt="Lock Icon" width="80" style="margin-bottom: 20px;">
            <h2 style="color: #333;">Reset Your Password</h2>
            <p style="font-size: 16px; color: #555;">We received a request to reset your password. Use the OTP below to continue:</p>
            <h1 style="background-color: #fff; padding: 15px 25px; display: inline-block; border-radius: 8px; color: #0d47a1; font-size: 36px; letter-spacing: 4px; margin-top: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              ${otp}
            </h1>
            <p style="margin-top: 20px; font-size: 14px; color: #777;">This code will expire in 10 minutes.</p>
            <p style="font-size: 12px; color: #aaa;">Didn't request this? Just ignore this email.</p>
          </div>
        </div>
      `,
    });

    res.json({ success: true, message: 'Password reset OTP sent to your email' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});


// ----------------- VERIFY OTP (for Password Reset) -----------------
router.post('/verify-reset-otp', (req, res) => {
  const { email, otp } = req.body;
  const storedOtp = otpStore[email];

  if (!storedOtp) return res.status(400).json({ success: false, message: 'No OTP found. Please request again.' });

  if (parseInt(otp) !== storedOtp) {
    return res.status(400).json({ success: false, message: 'Invalid OTP' });
  }

  res.json({ success: true, message: 'OTP verified for password reset' });
});

// ----------------- RESET PASSWORD -----------------
// ----------------- RESET PASSWORD -----------------
router.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ success: false, message: 'Email and New Password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    delete otpStore[email]; // Clear OTP after password reset

    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});


module.exports = router;
