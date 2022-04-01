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
    ).toString(),
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json(`Error Occurred : ${error.message}`);
  }
});

// TODO : Change the expiry date of the JWT
// ? Login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) throw new Error("Wrong Username.");

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );
    const Normalizedpassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    if (Normalizedpassword !== req.body.password)
      throw new Error("Wrong Password.");

    const accessToken = jwt.sign(
      {
        id: user._id,
        is_admin: user.is_admin,
      },
      process.env.JWT_SEC,
      {
        // TODO : Change this logic
        expiresIn: `3d`, // ? token expires in 30 min `${30 * 60000}`
      }
    );

    const { password, ...others } = user._doc;

    res.status(200).json({ ...others, accessToken });
  } catch (error) {
    res.status(500).json(`Error Occurred : ${error.message}`);
  }
});

module.exports = router;
