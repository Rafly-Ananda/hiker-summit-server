const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

// ? Register Controller
const authRegister = async (req, res) => {
  const newUser = new User({
    ...req.body,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json({
      succes: true,
      message: `User Created`,
      result: savedUser,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: `${error.message}.`,
    });
  }
};

// ? Login Controller
const authLogin = async (req, res) => {
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
    res.status(500).json({
      succes: false,
      message: `${error.message}.`,
    });
  }
};

module.exports = {
  authLogin,
  authRegister,
};
