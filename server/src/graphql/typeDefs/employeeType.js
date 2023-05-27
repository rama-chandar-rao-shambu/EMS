// graphQL type definitions
const typeDefs = `
  enum Type{
    FULL_TIME,
    PART_TIME,
    CONTRACT,
    SEASONAL
  },
  enum Department{
    IT,
    MARKETING,
    HR,
    ENGINEERING
  },
  enum Title{
    VP,
    MANAGER,
    EMPLOYEE,
    DIRECTOR
  },
  type Employee{
    _id:String!,
    firstName: String!,
    lastName: String!,
    age: Int!,
    dateOfJoining: String!,
    title: Title!,
    department: Department!,
    employeeType: Type!,
    currentStatus: Int!
  }
  type Query{
    getEmployeeList: [Employee!]
    findById(id: String!): Employee!
    filterEmployeeList(empType: String!, roleType: String!, deptType: String!, status: String!): [Employee!]
  },
  input EmployeeInput{
    _id:String,
    firstName: String!,
    lastName: String!,
    age: Int!,
    dateOfJoining: String!,
    title: String!,
    department: String!,
    employeeType: String!,
    currentStatus: Int!
  },
  type Response {
    success: Boolean!,
    error: String
  },
  type Mutation{
    save(emp: EmployeeInput!): Response!
    deleteById(id: String!): Response!
    updateById(emp: EmployeeInput!): Employee!
  }
`;

module.exports = typeDefs;
