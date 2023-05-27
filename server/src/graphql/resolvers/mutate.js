require("../../model/DbCon");
const User = require("../../model/Employee");

// graphql mutation
const mutateEmployee = {
  Mutation: {
    save,
    deleteById,
    updateById,
  },
};

// graphql resolver funtion that accepts  args
async function save(_, { emp }) {
  if (
    (emp.employeeType?.toLowerCase().includes("contract") ||
      emp.employeeType?.toLowerCase().includes("seasonal")) &&
    (emp.title?.toLowerCase().includes("vp") ||
      emp.title?.toLowerCase().includes("manager") ||
      emp.title?.toLowerCase().includes("director"))
  ) {
    return {
      success: false,
      error: "Contractor/Seasonal Employee Can't be Manager/Director/VP",
    };
  }
  emp = await User.create(emp);
  if (!emp) {
    return {
      success: false,
      error: "Error occurred while creating employee",
    };
  } else {
    return {
      success: true,
      error: "",
    };
  }
}

// delete employee by ID
async function deleteById(_, { id }) {
  const user = await User.findById({ _id: id });
  console.log(user, user.currentStatus === 1);
  if (user.currentStatus === 1) {
    return {
      success: false,
      error: "CAN'T DELETE EMPLOYEE - STATUS ACTIVE",
    };
  }
  const result = await User.deleteOne({ _id: id });
  return {
    success: result !== null,
    error: "",
  };
}

// update employee by ID
async function updateById(_, { emp }) {
  const result = await User.findByIdAndUpdate(
    { _id: emp._id },
    {
      department: emp.department,
      currentStatus: emp.currentStatus,
      title: emp.title,
    }
  );
  return result;
}

module.exports = mutateEmployee;
