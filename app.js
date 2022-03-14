require("dotenv").config();
const PORT = process.env.PORT || 3000;

const argon2 = require("argon2");

const express = require("express");
const app = express();

const { makeJWT } = require("./utils");

// models
const UserModel = require("./models/user.model");
const { decryptUser } = require("./middlewares/decryptUser");

app.use(express.json());

app.post("/users", async (req, res) => {
  try {
    const payload = {
      ...req.body,
      password: await argon2.hash(req.body.password),
    };

    const newUser = await UserModel.create(payload);
    return res.send({
      message: "User created",
      data: newUser._id,
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message || "Something happened",
    });
  }
});

// login
app.post("/sessions", async (req, res) => {
  const user = await UserModel.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).json({
      message: `user under ${req.body.email} is not found`,
    });
  }

  // are passwords valid
  const arePasswordsOK = await argon2.verify(user.password, req.body.password);

  if (!arePasswordsOK) {
    return res.status(403).json({
      message: `Invalid credentials`,
    });
  }

  const jwtPayload = {
    _id: user.id,
  };

  const token = makeJWT(jwtPayload);

  return res.send({
    message: "Successful",
    data: token,
  });
});

// authenticated endpoints
app.get("/users", decryptUser, async (req, res) => {
  try {
    console.log("locals ", res.locals);
    const userInfo = await UserModel.findById(
      res.locals.user,
      "email name createdAt"
    );

    return res.send({
      data: {
        user: userInfo,
      },
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message || "Something happened",
    });
  }
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
