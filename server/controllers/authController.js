const User = require("../models/User");
const CryptoJS = require("crypto-js");
const {
  JWT_ACCESS_EXPIRATION,
  JWT_REFRESH_EXPIRATION,
} = require("../configs/config");
const { generateToken } = require("../helpers/generateToken");
const nodemailer = require("nodemailer");

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: "your@email.com", // generated ethereal user
    pass: "emailpassword", // generated ethereal password
  },
});

// ? Refresh Token Controller
const authToken = (req, res) => {
  res.status(200).json({ accessToken: req.accessToken });
};

// ? Register Controller
const authRegister = async (req, res) => {
  const payload = JSON.parse(req.body.document);
  const newUser = new User({
    ...payload,
    password: CryptoJS.AES.encrypt(
      payload.password,
      process.env.PASS_SEC
    ).toString(),
    image_assets: {
      bucket: res.s3_bucket,
      assets_key: res.image_keys[0],
    },
    verified: payload.is_admin ? true : false,
  });

  try {
    const savedUser = await newUser.save();

    // send mail with defined transport object
    await transporter.sendMail({
      from: "darkrafly@gmail.com", // sender address
      to: payload.email, // list of receivers
      subject: "Let's get started on your new adventure ... ", // Subject line
      text: "thanks for registering", // plain text body
    });

    res.status(201).json({
      success: true,
      message: `User Created`,
      result: savedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error.message}.`,
    });
  }
};

// ? Login Controller
const authLogin = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) throw new Error("User Not Exist.");

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );
    const Normalizedpassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    if (Normalizedpassword !== req.body.password)
      throw new Error("Wrong Credentials.");

    const accessToken = generateToken(
      {
        id: user._id,
        is_admin: user.is_admin,
      },
      JWT_ACCESS_EXPIRATION,
      process.env.JWT_ACCESS_SEC
    );

    const refreshToken = generateToken(
      {
        id: user._id,
        is_admin: user.is_admin,
      },
      JWT_REFRESH_EXPIRATION,
      process.env.JWT_REFRESH_SEC
    );

    const { password, ...others } = user._doc;

    res
      .status(200)
      .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
      .json({ ...others, accessToken });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: `${error.message}.`,
    });
  }
};

// ? Logout Controller
const authLogout = async (req, res) => {
  try {
    res
      .status(200)
      .clearCookie("refresh_token")
      .json({ success: true, message: "Successfully Logged Out" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error.message}.`,
    });
  }
};

module.exports = {
  authRegister,
  authLogin,
  authLogout,
  authToken,
};
