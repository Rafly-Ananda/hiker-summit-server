const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { TokenExpiredError } = jwt;
const { sendVerificationEmail } = require("../helpers/nodemailer");

const userEmailConfirmation = async (req, res) => {
  try {
    const { user: userId } = jwt.verify(
      req.params.token,
      process.env.JWT_EMAIL_SEC
    );

    const user = await User.findById(userId);

    if (user.verified) {
      res.status(200).json({
        succes: true,
        message: "Email already verified",
      });
      return;
    } else {
      await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            verified: true,
          },
        },
        { new: false }
      );

      res.status(201).json({
        succes: true,
        message: `Email verified`,
      });
    }
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      res.status(500).json({
        succes: false,
        message: "Verification link expired",
      });
      return;
    } else {
      res.status(500).json({
        succes: false,
        message: `${error.message}.`,
      });
    }
  }
};

const requestUserEmailConfirmation = async (req, res) => {
  const user = await User.findById(req.params.id);
  sendVerificationEmail(user);
  try {
    res.status(200).json({
      succes: true,
      message: "Email verification sent",
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: `${error.message}.`,
    });
  }
};

module.exports = {
  userEmailConfirmation,
  requestUserEmailConfirmation,
};
