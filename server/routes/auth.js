const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

// ? Register
router.post("/register", async (req, res) => {
  const newUser = new User({
    ...req.body,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(), // ? to string is used to save it as string so we can store it in the database
  });

  try {
    // ? save(), is an async function, need to async/await it
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json("Account Already Exist.");
    res.status(500).json(`Error Occurred : ${error.message}`);
  }
});

// TODO : Change the expiry date of the JWT
// ? Login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      res.status(401).json("Wrong Username.");
      return;
    }

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );
    const Normalizedpassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    if (Normalizedpassword !== req.body.password) {
      res.status(401).json("Wrong Password.");
      return;
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        is_admin: user.is_admin,
      },
      process.env.JWT_SEC,
      {
        expiresIn: "3d", // ? token expires in 3 days
      }
    );

    // ? get everything else except password
    const { password, ...others } = user._doc;

    res.status(200).json({ ...others, accessToken });
  } catch (error) {
    res.status(500).json(`Error Occurred : ${error.message}`);
  }
});

module.exports = router;
