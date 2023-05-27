import React from "react";
import ReactDOM from "react-dom/client";
import { EmployeeDirectory } from "./components/EmployeeDirectory";
import "./index.css";
import { MemoryRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* using memory router for routing */}
    <MemoryRouter>
      <EmployeeDirectory />
    </MemoryRouter>
  </React.StrictMode>
);
