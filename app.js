require("dotenv").config();
const PORT = process.env.PORT || 3000;

const argon2 = require("argon2");
const express = require("express");
const app = express();

// models
const UserModel = require("./models/user.model");

app.use(express.json());

app.post("/users", async (req, res) => {
  const payload = {
    ...req.body,
    password: await argon2.hash(req.body.password),
  };

  const newUser = await UserModel.create(payload);
  return res.send({
    message: "User created",
    data: newUser,
  });
});

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
    console.log("Cant run server on port ", PORT);
    process.exit(1);
  }
  console.log("Server running on port ", PORT);
  require("./db");
});
