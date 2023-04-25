const bigPromise = require("./bigPromise");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.isLoggedIn = bigPromise(async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return next(new Error("Login first to reach the access page", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);
  next();
});

// In this middleware we can get the userdata
