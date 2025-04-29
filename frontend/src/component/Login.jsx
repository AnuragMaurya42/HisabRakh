import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginAttempts, setLoginAttempts] = useState(0);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/login", { email, password });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("✅ Login Successful!");
      navigate("/view");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Login failed. Please try again.");
      setLoginAttempts((prev) => prev + 1);
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>🔐 Login</h2>
      <form onSubmit={handleLogin} style={formStyle}>
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>Login</button>
      </form>

      {loginAttempts >= 3 && (
        <button
          onClick={() => navigate("/forgot-password")}
          style={{ ...buttonStyle, backgroundColor: "#ff7675", marginTop: "15px" }}
        >
          Forgot Password?
        </button>
      )}

      <p style={{ marginTop: "20px", color: "#fff" }}>
        Don't have an account?{" "}
        <span
          onClick={() => navigate("/register")}
          style={{ textDecoration: "underline", cursor: "pointer", color: "#fff", fontWeight: "bold" }}
        >
          Register here
        </span>
      </p>
    </div>
  );
};

// Styles
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
  color: "#ffffff",
  fontSize: "32px",
  fontWeight: "bold",
  marginBottom: "25px",
  textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  width: "90%",
  maxWidth: "400px",
  padding: "30px",
  borderRadius: "20px",
  background: "rgba(255, 255, 255, 0.95)",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
};

const inputStyle = {
  padding: "14px",
  fontSize: "16px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  outline: "none",
  transition: "border-color 0.3s",
};

const buttonStyle = {
  padding: "14px",
  fontSize: "18px",
  fontWeight: "bold",
  borderRadius: "10px",
  border: "none",
  background: "#23a6d5",
  color: "#ffffff",
  cursor: "pointer",
  transition: "all 0.3s ease",
};

export default Login;
