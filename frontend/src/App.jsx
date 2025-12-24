import React from "react";
import './App.css'
import { Router, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import StaffDashboard from "./pages/StaffDashboard"
import AdminDashboard from "./pages/AdminDashboard"

// Role-based route wrappers
const StaffRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  if (!token || role !== "staff") return <Navigate to="/" replace />;
  return children;
};

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  if (!token || role !== "admin") return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <>
      <Routes>
        {/* Login page */}
        <Route path="/" element={<Login />} />

        {/* Staff Dashboard */}
        <Route
          path="/staff"
          element={
            <StaffRoute>
              <StaffDashboard />
            </StaffRoute>
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* Redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
