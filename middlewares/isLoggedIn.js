const userModel = require("../models/userModel");
const { asyncHandler } = require("../utils/asyncHandler");
const jwt = require("jsonwebtoken");
const isLoggedIn = asyncHandler(async (req, res, next) => {
  try {
    if (!req.cookies.accessToken) {
      return res.status(401).json({ message: "You are not logged in" });
    }
    const decoded = jwt.verify(
      req.cookies.accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );
    const user = await userModel
      .findById(decoded?.id)
      .select("-password -refreshToken");
    if (!user) {
      return res.status(401).json({ message: "You are not logged in" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "You are not logged in" });
  }
});

module.exports = { isLoggedIn };
