import React from "react";

const NotFound = () => {
  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>😵 404</h1>
      <h2 style={subHeadingStyle}>Oops! Page Not Found</h2>
      <p style={textStyle}>
        It seems you've ventured into unknown territory... 🚀
      </p>
      <a href="/" style={buttonStyle}>Take me Home</a>
    </div>
  );
};

// Fun and modern CSS
const containerStyle = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  background: "linear-gradient(135deg, #ff758c, #ff7eb3)",
  color: "#fff",
  padding: "20px",
};

const headingStyle = {
  fontSize: "100px",
  margin: "0",
};

const subHeadingStyle = {
  fontSize: "32px",
  margin: "10px 0",
};

const textStyle = {
  fontSize: "18px",
  marginBottom: "30px",
};

const buttonStyle = {
  padding: "12px 24px",
  backgroundColor: "#fff",
  color: "#ff758c",
  borderRadius: "30px",
  textDecoration: "none",
  fontWeight: "bold",
  fontSize: "16px",
  transition: "background-color 0.3s, color 0.3s",
};

export default NotFound;
