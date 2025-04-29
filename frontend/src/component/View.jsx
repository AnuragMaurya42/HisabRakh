import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const View = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", email: "", mobile: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (token && storedUser) {
      setUser(storedUser);
    } else {
      console.log("token hi nahi mila yrrr");
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    alert("You have been logged out!");
    navigate("/login");
  };

  return (
    <div style={containerStyle}>
      <div style={profileCardStyle}>
        <h2 style={profileHeading}>👤 User Profile</h2>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Mobile:</strong> {user.mobile}</p>
      </div>

      <h2 style={headingStyle}>Welcome to HisabRakh</h2>
      <div style={buttonContainerStyle}>
        <button style={addButtonStyle} onClick={() => navigate("/dashboard")}>
          ➕ ADD RECORD
        </button>
        <button style={viewButtonStyle} onClick={() => navigate("/main")}>
          👁️ VIEW RECORDS
        </button>
        <button style={logoutButtonStyle} onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>
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
  background: "linear-gradient(to right, #fbc2eb, #a6c1ee)",
  textAlign: "center",
  padding: "20px"
};

const profileCardStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
  marginBottom: "30px",
  width: "90%",
  maxWidth: "400px",
  textAlign: "left"
};

const profileHeading = {
  fontSize: "22px",
  marginBottom: "15px",
  color: "#23a6d5"
};

const headingStyle = {
  color: "#333",
  fontSize: "26px",
  fontWeight: "700",
  marginBottom: "20px"
};

const buttonContainerStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "15px",
  width: "80%",
  maxWidth: "400px"
};

const buttonStyle = {
  padding: "12px",
  fontSize: "18px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  transition: "all 0.3s ease",
  boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
  fontWeight: "bold"
};

const addButtonStyle = {
  ...buttonStyle,
  height: "80px",
  background: "#23a6d5",
  color: "#fff"
};

const viewButtonStyle = {
  ...buttonStyle,
  height: "80px",
  background: "#fff",
  color: "#23a6d5",
  border: "2px solid #23a6d5"
};

const logoutButtonStyle = {
  ...buttonStyle,
  height: "60px",
  background: "#ff7675",
  color: "#fff",
  marginTop: "10px"
};

export default View;
