const serverError = (error, req, res, next) => {
  return res.status(500).json({
    message: error.message || "Somthing happened",
  });
};

module.exports = {
  serverError,
};
