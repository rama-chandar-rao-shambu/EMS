const express = require("express");

const { ApolloServer } = require("apollo-server-express");
const app = express();

app.use(express.static("public"));

const findEmployee = require("./src/graphql/resolvers/find");
const mutateEmployee = require("./src/graphql/resolvers/mutate");
const employeeTypeDef = require("./src/graphql/typeDefs/employeeType");

// creating graphql server using apollo-server-express
const server = new ApolloServer({
  typeDefs: employeeTypeDef,
  resolvers: {
    ...findEmployee,
    ...mutateEmployee,
  },
});

// listenting to server start event
server.start().then(function () {
  server.applyMiddleware({
    app,
    path: "/graphql",
    cors: {
      // allowing cors for the below URL
      origin: "http://localhost:3000",
      credentials: true,
    },
  });
});

// app running on port 3000
app.listen(4000, () => {
  console.log("server listening on port 4000");
});
