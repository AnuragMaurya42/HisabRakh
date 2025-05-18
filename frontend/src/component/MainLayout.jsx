import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ Navigation

const MainPage = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("date-desc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log(token);
        if (!token) {
          console.log("token nahi le paya");
          navigate("/login");
          return;
        }
        const res = await axios.get("https://hisabrakh-backend.onrender.com/api/loans", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
      } catch (err) {
        console.error(err);
        if (err.response && err.response.status === 401) {
          navigate("/login");
        } else {
          setError("Failed to load data");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);







const handleDelete = async (id) => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Unauthorized: Please login again.");
    navigate("/login");
    return;
  }

  try {
    await axios.delete(`https://hisabrakh-backend.onrender.com/api/loans/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Update local state to reflect deletion
    setData((prevData) => prevData.filter((item) => item._id !== id));

    alert("Record deleted successfully!");
    console.log(`Deleted record with ID: ${id}`);
  } catch (error) {
    console.error("Delete failed:", error.response || error.message);
    alert("Failed to delete record. Please try again.");
  }
};




  
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    alert("Logged out successfully!");
    navigate("/login");
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const calculateDaysElapsed = (dateStr) => {
    const startDate = new Date(dateStr);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateTotalAmount = (amount, loanPercentage, daysElapsed) => {
    const dailyRate = loanPercentage / 30; // Assuming monthly % divided over 30 days
    const totalInterest = (amount * dailyRate * daysElapsed) / 100;
    return (amount + totalInterest).toFixed(2);
  };

  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.amount.toString().includes(searchTerm)
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortOption === "date-desc") return new Date(b.date) - new Date(a.date);
    if (sortOption === "date-asc") return new Date(a.date) - new Date(b.date);
    if (sortOption === "name-asc") return a.name.localeCompare(b.name);
    if (sortOption === "name-desc") return b.name.localeCompare(a.name);
    if (sortOption === "amount-asc") return a.amount - b.amount;
    if (sortOption === "amount-desc") return b.amount - a.amount;
    return 0;
  });

  if (loading) return <div style={loadingStyle}>Loading...</div>;
  if (error) return <div style={errorStyle}>{error}</div>;

  return (
    <div style={containerStyle}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        input:focus, select:focus {
          border-color: #3498db;
          box-shadow: 0 0 8px rgba(52, 152, 219, 0.5);
        }
        .card {
          transition: all 0.3s ease-in-out;
        }
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.2);
        }
        .card-container {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 5px;
          margin-top: 0px;
        }
        @media (min-width: 600px) {
          .card-container {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 900px) {
          .card-container {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>

      <div style={topBarStyle}>
        <h2 style={headingStyle}>📊 Loan Dashboard</h2>
        <button style={logoutButtonStyle} onClick={handleLogout}>🚪 Logout</button>
      </div>

      <div style={inputContainerStyle}>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={inputStyle}
        />

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          style={dropdownStyle}
        >
          <option value="date-desc">Date (Newest)</option>
          <option value="date-asc">Date (Oldest)</option>
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="amount-asc">Amount (Low)</option>
          <option value="amount-desc">Amount (High)</option>
        </select>
      </div>

      <div className="card-container" style={cardContainerStyle}>
        {sortedData.map((item) => {
          const daysElapsed = calculateDaysElapsed(item.date);
          const monthsElapsed = Math.floor(daysElapsed / 30);
          const totalAmount = calculateTotalAmount(
            item.amount,
            item.loanPercentage,
            daysElapsed
          );

          return (
            <div
              key={item._id || item.id}
              className="card"
              style={{
                marginTop: 0,
                backgroundColor: "#fff",
                borderRadius: "4px",
                padding: "5px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                marginBottom: "3px",
                fontFamily: "Arial, sans-serif",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0px",
                }}
              >
                <div>
                  <h3 style={{
                    margin: "0 0 4px 0",
                    fontSize: "18px",
                    color: "#0e2aff",
                  }}>
                    {item.name}
                  </h3>
                  <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
                    {item.address}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{
                    margin: 0,
                    fontWeight: "bold",
                    color: "#1aa502",
                    fontSize: "16px",
                  }}>
                    ₹{item.amount}
                  </p>
                  <p style={{
                    margin: 0,
                    color: "#333333",
                    fontSize: "13px",
                  }}>
                    {item.loanPercentage}% per month (~₹
                    {((item.amount * item.loanPercentage) / 100).toFixed(2)})
                  </p>
                </div>
              </div>

              <p style={{
                margin: "8px 0",
                color: "#313131",
                fontSize: "14px"
              }}>
                📅 {formatDate(item.date)} (Duration: {monthsElapsed} months {daysElapsed % 30} days)
              </p>

              <div style={{
                backgroundColor: "#f9f9f9",
                padding: "8px",
                borderRadius: "4px",
              }}>
                <p style={{
                  margin: 0,
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "14px",
                  color: "#f70000",
                }}>
                  <span>🧾 Total Due: ₹{totalAmount}</span>

                    {/* ✅ Delete Button */}
          <button
            onClick={() => handleDelete(item._id)}
            style={{
              marginTop: "8px",
              padding: "6px 12px",
              backgroundColor: "#e74c3c",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Delete
          </button>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Styles
const containerStyle = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  background: "linear-gradient(to right, #8e44ad, #3498db)",
  padding: "10px",
  animation: "fadeIn 0.8s ease-out",
};

const topBarStyle = {
  width: "100%",
  maxWidth: "1200px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "10px",
};

const logoutButtonStyle = {
  padding: "10px 20px",
  backgroundColor: "#ff7675",
  color: "#fff",
  border: "none",
  borderRadius: "20px",
  fontSize: "16px",
  cursor: "pointer",
  fontWeight: "bold",
  transition: "all 0.3s ease",
};

const inputContainerStyle = {
  width: "100%",
  maxWidth: "600px",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  marginBottom: "20px",
  padding: "10px",
  flexWrap: "wrap",
  position: "sticky",
  top: "0",
  background: "linear-gradient(to right, #8e44ad, #3498db)",
  zIndex: 100,
};

const inputStyle = {
  flex: "2",
  minWidth: "150px",
  padding: "8px 12px",
  fontSize: "14px",
  borderRadius: "20px",
  border: "1px solid #ddd",
  outline: "none",
  transition: "all 0.3s ease",
};

const dropdownStyle = {
  flex: "1",
  minWidth: "100px",
  padding: "8px 12px",
  fontSize: "14px",
  borderRadius: "20px",
  border: "1px solid #ddd",
  outline: "none",
  transition: "all 0.3s ease",
};

const headingStyle = {
  color: "#fff",
  fontSize: "32px",
  fontWeight: "700",
  marginBottom: "10px",
};

const cardContainerStyle = {
  width: "100%",
  maxWidth: "1200px",
};

const loadingStyle = {
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center",
  marginTop: "20px",
};

const errorStyle = {
  fontSize: "20px",
  color: "red",
  textAlign: "center",
  marginTop: "20px",
};

export default MainPage;
