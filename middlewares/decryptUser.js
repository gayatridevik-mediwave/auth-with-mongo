const { verifyJWT } = require("../utils");

const decryptUser = (req, res, next) => {
  try {
    const token = req.headers["authorization"];

    if (!token) {
      return res.status(403).json({
        message: "Authorization needed",
      });
    }

    const tokenSplit = token.split(" ");
    if (tokenSplit.length != 2) {
      return res.status(403).json({
        message: "Invalid token",
      });
    }

    const jwt = tokenSplit[1];

    const verified = verifyJWT(jwt);

    res.locals.user = verified._id;

    next();
  } catch (e) {
    next(e);
  }
};

module.exports = {
  decryptUser,
};
