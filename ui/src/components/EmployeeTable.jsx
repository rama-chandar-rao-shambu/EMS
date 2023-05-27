import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Fab from "@mui/material/Fab";
import { useNavigate } from "react-router-dom";
import ModalComp from "./Modal";

// child component
export default function EmployeeTable({ employeeList, fetchEmployees }) {
  //open Modal
  const [openModal, setOpenModal] = useState(false);
  // set Message
  const [message, setMessage] = useState(null);

  const status = ["Not Working", "Working", "Retired"];
  const nav = useNavigate();
  const query = `#graphql
    mutation DeleteById($id: String!) {
      deleteById(id: $id){
        success,
        error
      }
    }
  `;

  const handleDelete = (id) => {
    fetch("http://localhost:4000/graphql", {
      method: "POST",
      // using include to allow cors and pass necessary details
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables: { id } }),
    })
      .then((resp) => resp.json())
      .then((resp) => {
        if (resp) {
          resp = resp.data.deleteById;
          if (resp.error) {
            setOpenModal(true);
            setMessage(resp.error);
          } else fetchEmployees();
        }
      });
  };

  const handleUpdate = (id) => {
    nav("/add-emp", { state: { empId: id } });
  };

  //handle close func
  const handleClose = () => setOpenModal(false);

  return (
    <div className="listContainer">
      <h2>List of Employees</h2>
      <div className="container">
        <ModalComp
          open={openModal}
          handleClose={handleClose}
          type={"Info"}
          message={message}
        />
        {/* map function to iterate over the list of employees and to populate the data */}
        <TableContainer component={Paper}>
          <Table
            sx={{ minWidth: 650 }}
            aria-label="employee table"
            className="employeeTable"
          >
            <TableHead>
              <TableRow>
                <TableCell>First Name</TableCell>
                <TableCell align="right">Last Name</TableCell>
                <TableCell align="right">Age</TableCell>
                <TableCell align="right">Date of Joining</TableCell>
                <TableCell align="right">Title</TableCell>
                <TableCell align="right">Department</TableCell>
                <TableCell align="right">Employee Type</TableCell>
                <TableCell align="right">Current Status</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employeeList.length > 0 ? (
                employeeList.map((emp, i) => {
                  if (emp.dateOfJoining) {
                    emp.dateOfJoining = emp.dateOfJoining
                      ?.split("T")[0]
                      ?.split("-")
                      ?.reverse()
                      ?.join("/");
                  }
                  return (
                    <TableRow key={i}>
                      <TableCell scope="row">{emp.firstName}</TableCell>
                      <TableCell align="right">{emp.lastName}</TableCell>
                      <TableCell align="right">{emp.age}</TableCell>
                      <TableCell align="right">{emp.dateOfJoining}</TableCell>
                      <TableCell align="right">{emp.title}</TableCell>
                      <TableCell align="right">{emp.department}</TableCell>
                      <TableCell align="right">
                        {emp.employeeType?.replace("_", " ")}
                      </TableCell>
                      <TableCell align="right">
                        {status[emp.currentStatus]}
                      </TableCell>
                      <TableCell align="right">
                        <DeleteIcon
                          onClick={handleDelete.bind(this, emp._id)}
                          style={{ marginRight: "5px", color: "red" }}
                        />
                        <EditIcon
                          onClick={handleUpdate.bind(this, emp._id)}
                          style={{ marginRight: "5px", color: "green" }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell align="center" colSpan={9}>
                    No Data Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
