const mongoose = require("mongoose");

// employee schema
const EmployeeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  dateOfJoining: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    enum: ["EMPLOYEE", "MANAGER", "DIRECTOR", "VP"],
  },
  department: {
    type: String,
    enum: ["IT", "MARKETING", "HR", "ENGINEERING"],
    required: true,
  },
  employeeType: {
    type: String,
    enum: ["FULL_TIME", "PART_TIME", "CONTRACT", "SEASONAL"],
    required: true,
  },
  currentStatus: {
    type: Number,
    default: 1,
  },
});

// employee model named as User
const User = mongoose.model("Employee", EmployeeSchema);

module.exports = User;
