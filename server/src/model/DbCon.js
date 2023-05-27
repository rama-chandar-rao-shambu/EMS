// importing mongoose and connecting to db cluster
const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://gollum:gollum@cluster0.ft2tqhy.mongodb.net/EMS"
);

// listening to the connected on event
mongoose.connection.on("connected", () => {
  console.log("DB is connected");
});
