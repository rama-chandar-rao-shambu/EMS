import React, { useState, useEffect } from "react";
import EmployeeSearch from "./EmployeeSearch.jsx";
import EmployeeTable from "./EmployeeTable.jsx";

export default function Home() {
  // list of employees, initial state as empty array
  const [employeeList, setEmployeeList] = useState([]);

  //  graphql query to fetch the data from the database
  let empListQuery = `
    query GetEmployeeList {
      getEmployeeList {
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

  // included fetch in the below function so that it can be recalled anytime
  // and to reduce the code duplication
  function fetchEmployees() {
    fetch("http://localhost:4000/graphql", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: empListQuery }),
    }).then(async (resp) => {
      resp = await resp.json();
      resp = resp.data?.getEmployeeList || [];
      setEmployeeList([...resp]);
    });
  }

  // fetching the list of employees based on the filters
  function filterEmpList(empType, roleType, deptType, status) {
    empListQuery = `
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

  // use effect to run after the first render, to display the list of employees
  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <React.Fragment>
      {/* passing filter func as props to employee search */}
      <EmployeeSearch filterEmpList={filterEmpList} />
      {/* employee table child component */}
      <EmployeeTable
        employeeList={employeeList}
        fetchEmployees={fetchEmployees}
      />
    </React.Fragment>
  );
}
