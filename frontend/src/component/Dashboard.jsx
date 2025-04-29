import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();

  // Form state
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [loanPercentage, setLoanPercentage] = useState('');
  const [address, setAddress] = useState('badhaipurwa');
  const [customAddress, setCustomAddress] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    setCurrentDate(today);

    // Corrected: Fetch from the right localStorage key
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalAddress = address === 'other' ? customAddress : address;

    if (address === 'other' && !customAddress) {
      alert('Please provide a custom address or select one from the list.');
      return;
    }

    const loanData = {
      name: name,
      amount: amount,
      loanPercentage: loanPercentage,
      address: finalAddress,
      date: currentDate,
    };

    try {
      const response = await axios.post('http://localhost:5000/api/loans', loanData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200 || response.status === 201) {
        alert('Loan registration successful!');
        navigate('/main');
      } else {
        alert('Error registering loan: ' + (response.data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error registering loan. Please try again.');
    }
  };

  return (
    <div style={containerStyle}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }

        input:focus, select:focus {
          border-color: #23a6d5;
          box-shadow: 0px 0px 8px rgba(35, 166, 213, 0.5);
        }

        button:hover {
          transform: scale(1.05);
          transition: all 0.3s ease-in-out;
        }
      `}</style>

      <h2 style={headingStyle}>Register</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="number"
          placeholder="Loan Percentage (%)"
          value={loanPercentage}
          onChange={(e) => setLoanPercentage(e.target.value)}
          required
          style={inputStyle}
        />
        <select
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          style={inputStyle}
        >
          <option value="badhaipurwa">Badhaipurwa</option>
          <option value="armi patauna">Armi Patauna</option>
          <option value="karmahiya">Karmahiya</option>
          <option value="nichlaun">Nichlaun</option>
          <option value="ramchandrahi">Ramchandrahi</option>
          <option value="other">Other (Manual Entry)</option>
        </select>

        {address === 'other' && (
          <input
            type="text"
            placeholder="Enter your address"
            value={customAddress}
            onChange={(e) => setCustomAddress(e.target.value)}
            required
            style={inputStyle}
          />
        )}

        <input
          type="date"
          value={currentDate}
          onChange={(e) => setCurrentDate(e.target.value)}
          required
          style={inputStyle}
        />

        <button type="submit" style={buttonStyle}>ADD</button>
      </form>
    </div>
  );
};

// 🎨 Styled Components
const containerStyle = {
  minHeight: "94vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(to right, #8e44ad, #3498db)",
  padding: "20px",
  animation: "fadeIn 0.8s ease-out",
};

const headingStyle = {
  color: "#fff",
  fontSize: "28px",
  fontWeight: "700",
  marginBottom: "20px",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "15px",
  width: "90%",
  maxWidth: "450px",
  padding: "20px",
  borderRadius: "12px",
  background: "rgba(255, 255, 255, 0.9)",
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  fontSize: "16px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  outline: "none",
  transition: "all 0.3s ease",
};

const buttonStyle = {
  padding: "12px",
  fontSize: "18px",
  borderRadius: "8px",
  border: "none",
  background: "#23a6d5",
  color: "#fff",
  cursor: "pointer",
  transition: "all 0.3s ease",
};

export default Dashboard;
