import React from "react";
import { useState } from "react";
import Button from "@mui/material/Button";

export default function EmployeeSearch({ filterEmpList }) {
  const [employeeType, setEmployeeType] = useState("ALL");
  const [roleType, setRoleType] = useState("ALL");
  const [departmentType, setDepartmentType] = useState("ALL");
  const [status, setStatus] = useState("ALL");

  const handleSearch = () =>
    filterEmpList(employeeType, roleType, departmentType, status);
  return (
    <div className="containerSearch">
      <h3>Search for Employees by:</h3>

      <div className="flexContainer">
        <div className="filterSection">
          <label htmlFor="employeeType">Type:</label>
          <select
            className="dropdown"
            name="employeeType"
            id="employeeType"
            value={employeeType}
            onChange={(e) => setEmployeeType(e.target.value)}
          >
            <option value="ALL">All</option>
            <option value="FULL_TIME">Full Time</option>
            <option value="PART_TIME">Part Time</option>
            <option value="CONTRACT">Contract</option>
            <option value="SEASONAL">Seasonal</option>
          </select>
        </div>

        <div className="filterSection">
          <label htmlFor="title">Title:</label>
          <select
            className="dropdown"
            name="title"
            id="title"
            onChange={(e) => setRoleType(e.target.value)}
            value={roleType}
          >
            <option value="ALL">All</option>
            <option value="EMPLOYEE">Employee</option>
            <option value="MANAGER">Manager</option>
            <option value="DIRECTOR">Director</option>
            <option value="VP">VP</option>
          </select>
        </div>

        <div className="filterSection">
          <label htmlFor="department">Department:</label>
          <select
            className="dropdown"
            name="department"
            id="department"
            value={departmentType}
            onChange={(e) => setDepartmentType(e.target.value)}
          >
            <option value="ALL">All</option>
            <option value="IT">IT</option>
            <option value="MARKETING">Marketing</option>
            <option value="HR">HR</option>
            <option value="ENGINEERING">Engineering</option>
          </select>
        </div>
        <div className="filterSection">
          <label htmlFor="status">Status:</label>
          <select
            className="dropdown"
            name="status"
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="ALL">All</option>
            <option value="RETIRING">Retiring in 6 months</option>
            <option value="Working">Working</option>
          </select>
        </div>
      </div>

      <Button
        variant="contained"
        className="searchButton"
        onClick={handleSearch}
        size="small"
      >
        Search
      </Button>
    </div>
  );
}
