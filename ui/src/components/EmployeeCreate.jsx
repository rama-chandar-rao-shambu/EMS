import React, { useState } from "react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ModalComp from "./Modal";
import Button from "@mui/material/Button";

// child component
export default function EmployeeCreate() {
  // using location hook to get the empId
  const location = useLocation();
  const nav = useNavigate();
  // fetching empId from URL
  const empId = location.state?.empId;
  // creating a read only field
  const readOnly = empId !== undefined;

  const [openModal, setOpenModal] = useState(false);
  const [message, setMessage] = useState(null);

  //creating a temp/new Emp Obj
  const tempObj = {
    firstName: "",
    lastName: "",
    dateOfJoining: "",
    title: "EMPLOYEE",
    age: "",
    department: "IT",
    employeeType: "FULL_TIME",
    currentStatus: 1,
  };

  // new employee state
  const [employee, setEmployee] = useState(tempObj);
  // error obj
  const [error, setError] = useState({});

  // retrive emp obj if present
  useEffect(() => {
    const query = `
    query FindById($id: String!) {
      findById(id: $id) {
        _id
        firstName
        lastName
        age
        dateOfJoining
        title
        department
        employeeType
        currentStatus
      }
    }`;
    if (empId) {
      fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ query, variables: { id: empId } }),
      })
        .then((resp) => resp.json())
        .then((resp) => {
          if (resp) {
            setEmployee({ ...resp.data?.findById });
          }
        });
    }
  }, [empId]);

  //handle close func
  const handleClose = () => setOpenModal(false);

  //    handle change in emp input data
  const handleEmployeeInput = (e) => {
    let { name, value } = e.target;
    if (
      name === "employeeType" &&
      (value?.toLowerCase() === "contract" ||
        value?.toLowerCase() === "seasonal") &&
      (employee.title === "VP" ||
        employee.title === "Manager" ||
        employee.title === "Director")
    ) {
      setOpenModal(true);
      setMessage("Contractor/Seasonal Employee Can't be Manager/Director/VP");
      return;
    }
    setEmployee((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  // making the save call to the db
  const handleSave = (query, tempEmp) => {
    fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables: { emp: tempEmp } }),
    })
      .then((resp) => resp.json())
      .then((resp) => {
        if (!empId) {
          resp = resp.data.save;
          if (resp.error) {
            alert(resp.error);
            return;
          } else nav("/");
        } else {
          setEmployee({ ...tempObj });
          nav("/");
        }
      })
      .catch((err) => {
        console.log("Error Occurred", err);
      });
  };

  //    on submit event
  const handleCreate = (e) => {
    e.preventDefault();
    let err = {};
    // checking for validations
    if (!/^[a-zA-Z ]+$/.test(employee.firstName?.trim())) {
      err["firstName"] = "First Name must contains only letters and space";
    }
    if (!/^[a-zA-Z ]+$/.test(employee.lastName.trim())) {
      err["lastName"] = "Last Name must contains only letters and space";
    }
    if (!employee.age) {
      err["age"] = "Age is required";
    } else if (employee.age < 20 || employee.age > 70) {
      err["age"] = "Age should be between 20 and 70";
    }
    if (!employee.dateOfJoining?.trim()) {
      err["dateOfJoining"] = "Date of Joining is required";
    }
    if (
      employee.dateOfJoining &&
      new Date(employee.dateOfJoining) > new Date()
    ) {
      err["dateOfJoining"] =
        "Date of Joining cannot be greater than today's date";
    }
    if (!employee.title?.trim()) {
      err["title"] = "Title is required";
    }
    if (!employee.department?.trim()) {
      err["department"] = "Department is required";
    }
    if (!employee.employeeType?.trim()) {
      err["employeeType"] = "Employee Type is required";
    }
    if (!employee.currentStatus) {
      err["currentStatus"] = "Current Status is required";
    }

    setError({ ...err });
    if (Object.keys(err).length > 0) {
      return;
    }
    const tempEmp = {
      _id: empId,
      firstName: employee.firstName,
      lastName: employee.lastName,
      age: parseInt(employee.age),
      title: employee.title,
      department: employee.department,
      dateOfJoining: employee.dateOfJoining,
      employeeType: employee.employeeType,
      currentStatus: parseInt(employee.currentStatus),
    };

    // graphql mutation query to insert data into mongoDB
    let query = `#graphql
        mutation Mutation($emp: EmployeeInput!) {
          save(emp: $emp) {
            success,
            error
          }
        }
    `;
    if (empId) {
      query = `
      mutation UpdateById($emp: EmployeeInput!) {
        updateById(emp: $emp) {
          _id
        }
      }
    `;
    }
    // fetch function to post the new employee OR update the existing emp object
    handleSave(query, tempEmp);
  };

  return (
    // jsx code
    <div className="formContainer">
      <ModalComp
        open={openModal}
        type="Info"
        message={message}
        handleClose={handleClose}
      />
      <h2>{empId ? "Update Employee Record" : "Create an Employee"}</h2>
      <form>
        <div>
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            disabled={readOnly}
            name="firstName"
            value={employee.firstName}
            onChange={handleEmployeeInput}
          />
          {/* error span tag */}
          <span className="error">{error.firstName}</span>
        </div>

        <div>
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            disabled={readOnly}
            name="lastName"
            onChange={handleEmployeeInput}
            value={employee.lastName}
          />
          <span className="error">{error.lastName}</span>
        </div>

        <div>
          <label htmlFor="age">Age:</label>
          <input
            type="number"
            min={20}
            max={70}
            disabled={readOnly}
            step="1"
            id="age"
            onChange={handleEmployeeInput}
            name="age"
            value={employee.age}
          />
          <span className="error">{error.age}</span>
        </div>

        <div>
          <label htmlFor="dateOfJoining">Date of Joining:</label>
          <input
            type="date"
            id="dateOfJoining"
            max={new Date().toISOString().split("T")[0]}
            disabled={readOnly}
            onChange={handleEmployeeInput}
            name="dateOfJoining"
            value={employee.dateOfJoining}
          />
          <span className="error">{error.dateOfJoining}</span>
        </div>

        <div>
          <label htmlFor="title">Title:</label>
          <select
            name="title"
            id="title"
            onChange={handleEmployeeInput}
            value={employee.title}
          >
            <option value="EMPLOYEE">Employee</option>
            {!(
              employee.employeeType
                .toString()
                ?.toLowerCase()
                .includes("contract") ||
              employee.employeeType
                .toString()
                ?.toLowerCase()
                .includes("seasonal")
            ) && (
              <>
                <option value="MANAGER">Manager</option>
                <option value="DIRECTOR">Director</option>
                <option value="VP">VP</option>
              </>
            )}
          </select>
          <span className="error">{error.title}</span>
        </div>

        <div>
          <label htmlFor="department">Department:</label>
          <select
            name="department"
            id="department"
            value={employee.department}
            onChange={handleEmployeeInput}
          >
            <option value="IT">IT</option>
            <option value="MARKETING">Marketing</option>
            <option value="HR">HR</option>
            <option value="ENGINEERING">Engineering</option>
          </select>
          <span className="error">{error.department}</span>
        </div>
        <div>
          <label htmlFor="employeeType">Employee Type:</label>
          <select
            name="employeeType"
            id="employeeType"
            disabled={readOnly}
            value={employee.employeeType}
            onChange={handleEmployeeInput}
          >
            <option value="FULL_TIME">Full Time</option>
            <option value="PART_TIME">Part Time</option>
            <option value="CONTRACT">Contract</option>
            <option value="SEASONAL">Seasonal</option>
          </select>
          <span className="error">{error.employeeType}</span>
        </div>

        <div>
          <label htmlFor="status">Current Status:</label>
          <select
            name="currentStatus"
            disabled={!readOnly}
            value={employee.currentStatus}
            onChange={handleEmployeeInput}
            id="status"
          >
            <option value="0">Not Working</option>
            <option value="1">Working</option>
            <option value="2">Retired</option>
          </select>
          <span className="error">{error.currentStatus}</span>
        </div>
        <div>
          {/* submit button to update or create a new employee */}

          <Button
            variant="contained"
            type="submit"
            color="success"
            onClick={handleCreate}
          >
            {empId ? "Update" : "Create"}
          </Button>

          {/* back button to go to home page */}
          <Button variant="contained" className="back" onClick={() => nav("/")}>
            Back
          </Button>
        </div>
      </form>
    </div>
  );
}
