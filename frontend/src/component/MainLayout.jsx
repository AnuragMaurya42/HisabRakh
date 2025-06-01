import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("date-desc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // New state for handling the delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        const res = await axios.get(
          "https://hisabrakh-backend.onrender.com/api/loans",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setData(res.data);
      } catch (err) {
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

  // Opens the modal and saves which record to delete.
  const handleOpenDeleteModal = (id) => {
    setRecordToDelete(id);
    setShowDeleteModal(true);
  };

  // Performs the delete operation after confirmation.
  const handleConfirmDelete = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Unauthorized: Please login again.");
      navigate("/login");
      return;
    }

    try {
      await axios.delete(
        `https://hisabrakh-backend.onrender.com/api/loans/${recordToDelete}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData((prevData) =>
        prevData.filter((item) => item._id !== recordToDelete)
      );
      alert("Record deleted successfully!");
    } catch (error) {
      alert("Failed to delete record. Please try again.");
    } finally {
      setShowDeleteModal(false);
      setRecordToDelete(null);
    }
  };

  // Closes the modal cancellation.
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setRecordToDelete(null);
  };







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
    const month = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ][date.getMonth()];
    return `${day}-${month}-${date.getFullYear()}`;
  };

  const calculateDaysElapsed = (dateStr) => {
    const startDate = new Date(dateStr);
    const currentDate = new Date();
    return Math.ceil(Math.abs(currentDate - startDate) / (1000 * 60 * 60 * 24));
  };

  const calculateTotalAmount = (amount, loanPercentage, daysElapsed) => {
    const dailyRate = loanPercentage / 30;
    const interest = (amount * dailyRate * daysElapsed) / 100;
    return (amount + interest).toFixed(2);
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

  if (loading)
    return (
      <div style={loadingStyle}>
        <img
          src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif"
          alt="Loading..."
          style={{ width: "150px", height: "150px" }}
        />
      </div>
    );
  if (error) return <div style={errorStyle}>{error}</div>;

  return (
    <div style={containerStyle}>
      <style>{`
        .card-container {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 16px;
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
        .top-bar {
          position: sticky;
          top: 0;
          background: #fff;
          z-index: 10;
          padding: 10px 10px;
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.12);
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-radius: 0 0 12px 12px;
        }
        .card {
          background-color: #ffffff;
          border-radius: 12px;
          padding: 3px;
          box-shadow: 0 8px 16px rgba(63, 81, 181, 0.12);
          animation: fadeInUp 0.6s ease forwards;
          opacity: 0;
          transform: translateY(20px);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
        }
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        button.delete-btn {
          background-color: #e53935;
          color: white;
          border: none;
          padding: 8px 14px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: background-color 0.3s ease;
          align-self: flex-end;
          margin-top: 12px;
          user-select: none;
        }
        button.delete-btn:active {
          background-color: #b71c1c;
        }
        button.logout-btn {
          padding: 8px 16px;
          background-color: #3949ab;
          color: #fff;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 700;
          user-select: none;
          transition: background-color 0.3s ease;
        }
        button.logout-btn:active {
          background-color: #1a237e;
        }
        input,
        select {
          padding: 10px 12px;
          border-radius: 10px;
          border: 1.5px solid #90caf9;
          font-size: 15px;
          outline-color: #3f51b5;
          width: 100%;
          box-sizing: border-box;
          font-weight: 500;
        }
        input::placeholder {
          color: #9e9e9e;
        }
        .input-group {
          display: flex;
          gap: 12px;
          margin: 10px 0;
          flex-wrap: wrap;
        }
        .input-group > * {
          flex: 1 1 200px;
        }
      `}</style>

      <div className="top-bar">
        <h2 style={{ margin: 0, color: "#3f51b5" }}>📊 Loan Dashboard</h2>
        <button className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>

      <div className="input-group">
        <input
          type="text"
          placeholder="Search by name or amount..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="date-desc">Date (Newest)</option>
          <option value="date-asc">Date (Oldest)</option>
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="amount-asc">Amount (Low to High)</option>
          <option value="amount-desc">Amount (High to Low)</option>
        </select>
      </div>

      <div className="card-container">
        {sortedData.map((item) => {
          const daysElapsed = calculateDaysElapsed(item.date);
          const monthsElapsed = Math.floor(daysElapsed / 30);
          const totalAmount = calculateTotalAmount(
            item.amount,
            item.loanPercentage,
            daysElapsed
          );
          return (
            <div key={item._id} className="card">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <h3 style={{ margin: 0, color: "#303f9f" }}>{item.name}</h3>
                  <p style={{ margin: "4px 0", fontSize: "14px", color: "#666" }}>
                    {item.address}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p
                    style={{
                      margin: 0,
                      fontWeight: "bold",
                      color: "#388e3c",
                      fontSize: "18px",
                    }}
                  >
                    ₹{item.amount}
                  </p>
                  <p style={{ margin: 0, fontSize: "12px", color: "#757575" }}>
                    {item.loanPercentage}% (~₹
                    {((item.amount * item.loanPercentage) / 100).toFixed(2)})
                  </p>
                </div>
              </div>
              <p
                style={{
                  fontSize: "14px",
                  margin: "12px 0",
                  color: "#555",
                  fontWeight: "500",
                }}
              >
                📅 {formatDate(item.date)} — Duration: {monthsElapsed} months{" "}
                {daysElapsed % 30} days
              </p>
              <div
                style={{
                  backgroundColor: "#e3f2fd",
                  padding: "3px",
                  borderRadius: "8px",
                  fontWeight: "600",
                  color: "#d32f2f",
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "14px",
                  color: "#f70000",
                }}>
                  <span>🧾 Total Due: ₹{totalAmount}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <p style={{ fontSize: "16px", margin: "0 0 20px 0" }}>
              Are you sure you want to delete this record?
            </p>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <button style={modalDeleteButtonStyle} onClick={handleConfirmDelete}>
                Delete
              </button>
              <button style={modalCancelButtonStyle} onClick={handleCancelDelete}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles
const loadingStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "200vh",
  backgroundColor: "#f0f4ff",
};

const errorStyle = {
  color: "red",
  textAlign: "center",
  marginTop: "50px",
};

const containerStyle = {
  minHeight: "100vh",
  background: "#f0f4ff",
  padding: "3px",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalContentStyle = {
  backgroundColor: "#8ddcfa",
  padding: "20px",
  borderRadius: "8px",
  width: "90%",
  maxWidth: "400px",
  textAlign: "center",
};

const modalDeleteButtonStyle = {
  backgroundColor: "#e53935",
  color: "#fff",
  border: "none",
  padding: "10px 20px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600",
};

const modalCancelButtonStyle = {
  backgroundColor: "#757575",
  color: "#fff",
  border: "none",
  padding: "10px 20px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600",
};

export default MainPage;
