import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Register from "./component/Register";
import VerifyOtp from "./component/VerifyOtp";
import Login from "./component/Login";
import View from "./component/View";
import ForgetPassword from "./component/ForgetPassword";
import VerifyResetOtp from "./component/VerifyResetOtp";
import ResetPassword from "./component/ResetPassword";
import NotFound from "./component/NotFound";
import MainPage from "./component/MainLayout";
import Dashboard from "./component/Dashboard";
import Register from "./component/Register";



const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/view" element={<View />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/verify-reset-otp" element={<VerifyResetOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
