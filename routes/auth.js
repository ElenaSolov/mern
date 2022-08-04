const { Router } = require("express");
const dotenv = require("dotenv");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");

const router = Router();

router.post(
  "/register",
  // username must be an email
  body("username").isEmail(),
  // password must be at least 5 chars long
  body("password").isLength({ min: 6 }),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Not valid registration values",
        });
      }
      const { email, password } = req.body;
      const candidate = await User.findOne({ email });
      if (candidate) {
        res.status(400).json({ message: "This email is already registered" });
      } else {
        const hashedPassword = bcrypt.hash(password, 12);
        const user = new User({ email, password: hashedPassword });
        await user.save();
        res.status(200).json({ message: "User successfully created" });
      }
    } catch (e) {
      res.status(500).json.message("Server error");
    }
  }
);

router.post(
  "/login",
  // username must be an email
  body("username").isEmail(),
  // password must be at least 5 chars long
  body("password").isLength({ min: 6 }),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ errors: errors.array(), message: "Not valid login values" });
      }
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        res.status(400).json({ message: "This email is not registered" });
      } else {
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
          res.status(400).json({ message: "Wrong password" });
        }
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
          expiresIn,
        :"20m"});
        res.status(200).json({token, userId: user.id });
      }
    } catch (e) {
      res.status(500).json.message("Server error");
    }
  }
);

module.exports = router;
