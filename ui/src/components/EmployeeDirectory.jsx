import React from "react";
import EmployeeCreate from "./EmployeeCreate.jsx";

import { Routes, Route } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Home from "./Home.jsx";
import EmployeeRetiring from "./EmployeeRetiring.jsx";

// parent component
export function EmployeeDirectory() {
  return (
    // jsx code having child components
    <div>
      <h1>Employee Management System</h1>
      {/* Navigation bar */}
      <Navbar />
      {/* search functionality yet to be implemented */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-emp" element={<EmployeeCreate />} />
        <Route path="/retiring" element={<EmployeeRetiring />} />
      </Routes>
    </div>
  );
}
