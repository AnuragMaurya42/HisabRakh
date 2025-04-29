import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const { state } = useLocation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return alert("Passwords do not match!");
    }

    try {
      await axios.post("https://hisabrakh-backend.onrender.com/api/auth/reset-password", { 
        email: state.email, 
        newPassword: password 
      });
      alert("Password reset successfully!");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>🔒 Reset Password</h2>
      <form onSubmit={handleReset} style={formStyle}>
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>Reset Password</button>
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
  background: "linear-gradient(to right, #00c6ff, #0072ff)",
  padding: "20px",
};

const headingStyle = {
  color: "#fff",
  fontSize: "30px",
  marginBottom: "20px",
};

const formStyle = {
  backgroundColor: "#ffffff",
  padding: "30px",
  borderRadius: "12px",
  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
  display: "flex",
  flexDirection: "column",
  gap: "18px",
  width: "90%",
  maxWidth: "400px",
};

const inputStyle = {
  padding: "12px",
  fontSize: "16px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  outline: "none",
  transition: "border-color 0.3s",
};

const buttonStyle = {
  padding: "12px",
  fontSize: "18px",
  fontWeight: "bold",
  borderRadius: "8px",
  backgroundColor: "#0072ff",
  color: "#fff",
  border: "none",
  cursor: "pointer",
  transition: "background-color 0.3s",
};

export default ResetPassword;
