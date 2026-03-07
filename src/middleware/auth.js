const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).send("Please login first");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = decoded;

    const user = await User.findById(_id);

    if (!user) {
      return res.status(401).send("User not found");
    }

    req.user = user;

    next(); // IMPORTANT
  } catch (error) {
    res.status(401).send("Invalid token");
  }
};

module.exports = userAuth;
