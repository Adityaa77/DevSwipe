const jwt = require("jsonwebtoken");
const User = require("../models/user");

const UserAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).send("Please login first");

    let decodeObj;
    try {
      decodeObj = jwt.verify(token, "Dev@Swipe$2004");
    } catch {
      return res.status(401).send("Invalid token");
    }

    const user = await User.findById(decodeObj._id);
    if (!user) return res.status(404).send("User not found");

    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};


module.exports={
    UserAuth,
};