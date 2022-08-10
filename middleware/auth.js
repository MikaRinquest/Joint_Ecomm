const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function (req, res, next) {
  if (!token) {
    return res
      .status(401)
      .json({ warning: "Access denied, you do not have a token." });
  }
  try {
    const decoded = jwt.verify(token, process.env.jwtSecret);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ warning: "Token is not valid" });
  }
};
