import React from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    // nav bar
    <div className="navLink">
      <NavLink to="/">Employee List</NavLink>
      <NavLink to="/add-emp">Add Employee</NavLink>
      <NavLink to="/retiring">Upcoming Retirements</NavLink>
    </div>
  );
}
