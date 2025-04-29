import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleForget = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/send-reset-otp", { email });
      alert("OTP sent to your email!");
      navigate("/verify-reset-otp", { state: { email } });
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send OTP.");
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Forgot Password</h2>
      <form onSubmit={handleForget} style={formStyle}>
        <input
          type="email"
          placeholder="Enter your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>Send OTP</button>
      </form>
    </div>
  );
};

// Improved CSS styles
const containerStyle = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(to right, #8e44ad, #3498db)",
  padding: "20px",
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
  gap: "18px",
  width: "90%",
  maxWidth: "400px",
  padding: "25px",
  borderRadius: "16px",
  background: "rgba(255, 255, 255, 0.95)",
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)",
};

const inputStyle = {
  padding: "12px",
  fontSize: "16px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  outline: "none",
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

export default ForgetPassword;
