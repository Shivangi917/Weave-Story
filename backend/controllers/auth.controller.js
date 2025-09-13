const User = require("../models/User.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { sendVerificationEmail } = require('../config/mailer');

const JWT_SECRET = process.env.JWT_SECRET;

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const signupController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log(req.body);

    let user = await User.findOne({ email });
    if (user) {
      console.log(user);
      return res.status(400).json({ message: "User already exists" });
    }

    const verificationCode = generateVerificationCode();

    user = new User({ 
      name, 
      email, 
      password,
      validationCode: verificationCode,
      validationCodeExpires: Date.now() + 3600000,
    });

    await user.save();

    await sendVerificationEmail(email, verificationCode);

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

    res.status(201).json({
      message: "User registered successfully. Please verify your email.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const verifyEmailController = async (req, res) => {
  const { verificationCode } = req.body;
  try {
    const user = await User.findOne({
      validationCode: verificationCode,
      validationCodeExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    user.validated = true;
    user.validationCode = undefined;
    user.validationCodeExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ message: "Error verifying email" });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.validated) {
      return res.status(401).json({ message: "Please verify your email before logging in" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({
      message: "User logged in successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { loginController, signupController, verifyEmailController };