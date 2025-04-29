import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyResetOtp = () => {
  const { state } = useLocation();
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/verify-otp", { email: state.email, otp });
      alert("✅ OTP verified successfully!");
      navigate("/reset-password", { state: { email: state.email } });
    } catch (error) {
      alert(error.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>🔑 Verify OTP</h2>
      <form onSubmit={handleVerify} style={formStyle}>
        <input 
          type="text" 
          placeholder="Enter OTP" 
          value={otp} 
          onChange={(e) => setOtp(e.target.value)} 
          required 
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>
          Verify OTP
        </button>
      </form>
    </div>
  );
};

// CSS styles
const containerStyle = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(to right, #36d1dc, #5b86e5)", // Blue gradient
  padding: "20px",
};

const headingStyle = {
  color: "#fff",
  fontSize: "32px",
  marginBottom: "20px",
};

const formStyle = {
  backgroundColor: "#fff",
  padding: "30px",
  borderRadius: "14px",
  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
  display: "flex",
  flexDirection: "column",
  gap: "18px",
  width: "90%",
  maxWidth: "400px",
};

const inputStyle = {
  padding: "14px",
  fontSize: "16px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  outline: "none",
};

const buttonStyle = {
  padding: "14px",
  fontSize: "18px",
  fontWeight: "bold",
  backgroundColor: "#36d1dc",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  transition: "background-color 0.3s",
};

export default VerifyResetOtp;
