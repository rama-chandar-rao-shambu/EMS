require("../../model/DbCon");
const User = require("../../model/Employee");
// graphql query
const findEmployee = {
  Query: {
    getEmployeeList,
    findById,
    filterEmployeeList,
  },
};

// graphql resolver function to fetch the list of employees
async function getEmployeeList() {
  const empList = await User.find({});
  return empList;
}

// graphql resolver function to fetch an employee by Id
async function findById(_, { id }) {
  const emp = await User.findById({ _id: id });
  return emp;
}

// graphql resolver function to filter and fetch the list of employees
async function filterEmployeeList(
  _,
  { empType, roleType, deptType, status = "RETIRING" }
) {
  let query = {};
  if (empType) {
    empType = empType.toUpperCase();
    if (empType !== "ALL") query["employeeType"] = empType;
  }

  if (roleType) {
    roleType = roleType.toUpperCase();
    if (roleType !== "ALL") query["title"] = roleType;
  }

  if (deptType) {
    deptType = deptType.toUpperCase();
    if (deptType !== "ALL") query["department"] = deptType;
  }

  const empList = await User.find(query);
  if (status?.toUpperCase() === "ALL") return empList;
  const today = new Date();
  return empList.filter((emp) => {
    const doj = new Date(emp.dateOfJoining);
    const year = doj.getFullYear() - emp.age;
    const month = doj.getMonth() - 2 > 0 ? doj.getMonth() - 2 : 0;
    const date = doj.getDate() - 9 ? doj.getDate() - 9 : 1;
    const dob = new Date(year, month, date);
    console.log(dob);
    const retirementDate = new Date(
      dob.getFullYear() + 65,
      dob.getMonth(),
      dob.getDate()
    );
    if (status && status.toUpperCase() === "RETIRING") {
      return (
        retirementDate > today &&
        retirementDate <=
          new Date(today.getFullYear(), today.getMonth() + 6, today.getDate())
      );
    } else {
      return !(
        retirementDate > today &&
        retirementDate <=
          new Date(today.getFullYear(), today.getMonth() + 6, today.getDate())
      );
    }
  });
}

module.exports = findEmployee;
