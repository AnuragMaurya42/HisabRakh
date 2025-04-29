import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== repeatPassword) return alert("Passwords do not match!");

    try {
      // Step 1: Send Email to get OTP
      await axios.post("http://localhost:5000/api/auth/send-register-otp", { email });

      // Step 2: Go to VerifyOtp page, pass user details in navigation state
      navigate("/verify-otp", { state: { name, email, mobile, password } });
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Register</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
        {/* form fields */}
        <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} />
        <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
        <input type="tel" placeholder="Mobile Number" value={mobile} onChange={(e) => setMobile(e.target.value)} required style={inputStyle} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={inputStyle} />
        <input type="password" placeholder="Repeat Password" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} required style={inputStyle} />
        <button type="submit" style={buttonStyle}>Send OTP</button>
      </form>
    </div>
  );
};

// 🎨 Styles
const containerStyle = {
  minHeight: "100vh",
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
  fontSize: "26px",
  fontWeight: "700",
  marginBottom: "20px",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  width: "90%",
  maxWidth: "400px",
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
  background: "#3498db",
  color: "#fff",
  cursor: "pointer",
  transition: "all 0.3s ease",
};

// const secondaryButtonStyle = {
//   ...buttonStyle,
//   background: "transparent",
//   border: "2px solid #fff",
//   color: "#fff",
// };

export default Register;
