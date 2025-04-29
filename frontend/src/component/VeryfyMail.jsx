import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const VeryfyMail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {}; // get email from previous page

  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/auth/verify-otp', { email, otp });

      setMessage(res.data.message);
      alert("Email verified successfully!");
      navigate('/login'); // after successful verification, move to login
    } catch (error) {
      setMessage(error.response?.data?.message || "Verification failed!");
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Verify Your Email</h2>
      <form onSubmit={handleVerify} style={formStyle}>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>Verify OTP</button>
      </form>
      {message && <p style={messageStyle}>{message}</p>}
    </div>
  );
};

// Styles
const containerStyle = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'linear-gradient(to right, #8e44ad, #3498db)',
  padding: '20px',
};

const headingStyle = {
  color: '#fff',
  fontSize: '26px',
  fontWeight: '700',
  marginBottom: '20px',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  width: '90%',
  maxWidth: '400px',
  padding: '20px',
  borderRadius: '12px',
  background: 'rgba(255, 255, 255, 0.9)',
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  fontSize: '16px',
  borderRadius: '8px',
  border: '1px solid #ddd',
  outline: 'none',
};

const buttonStyle = {
  padding: '12px',
  fontSize: '18px',
  borderRadius: '8px',
  border: 'none',
  background: '#3498db',
  color: '#fff',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
};

const messageStyle = {
  marginTop: '15px',
  color: 'red',
  fontWeight: '600',
};

export default VeryfyMail;
