const JWT_SECRET = process.env.JWT_SECRET || "I dont care about security";

const jwt = require("jsonwebtoken");

const makeJWT = (payload) => {
  return jwt.sign(payload, JWT_SECRET);
};

const verifyJWT = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = {
  makeJWT,
  verifyJWT,
};
