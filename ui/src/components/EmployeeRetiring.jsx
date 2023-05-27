import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect } from "react";
import { useState } from "react";

export default function EmployeeRetiring({ fetchEmployees }) {
  // list of employees, initial state as empty array
  const [employeeList, setEmployeeList] = useState([]);
  const status = ["Not Working", "Working", "Retired"];

  // use effect to run after the first render, to display the list of retiring employees
  useEffect(() => {
    filterEmpList("ALL", "ALL", "ALL", "RETIRING");
  }, []);

  // fetching the list of employees based on the filters
  function filterEmpList(empType, roleType, deptType, status) {
    const empListQuery = `
    query FetEmployeeList($empType: String!, $roleType: String!, $deptType: String!, $status: String!) {
        filterEmployeeList(empType: $empType, roleType: $roleType, deptType: $deptType, status: $status) {
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
    }
  `;
    fetch("http://localhost:4000/graphql", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: empListQuery,
        variables: { empType, roleType, deptType, status },
      }),
    }).then(async (resp) => {
      resp = await resp.json();
      resp = resp.data?.filterEmployeeList || [];
      setEmployeeList([...resp]);
    });
  }

  return (
    <div>
      <div className="listContainer">
        <h2>List of Retiring Employees</h2>
        <div className="container">
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
    </div>
  );
}
