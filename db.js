const mongoose = require("mongoose");

const DB_STRING = process.env.DB_STRING;

mongoose.connect(DB_STRING);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function callback() {
  console.log("Connection successful to ", DB_STRING);
});
