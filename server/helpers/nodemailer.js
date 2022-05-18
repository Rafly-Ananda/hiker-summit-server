const nodemailer = require("nodemailer");
const { generateToken } = require("../helpers/generateToken");
const { JWT_EMAIL_EXPIRATION } = require("../configs/config");

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.NODEMAILER_USER, // generated ethereal user
    pass: process.env.NODEMAILER_PASS, // generated ethereal password
  },
});

// TODO: style this email template later
const sendVerificationEmail = async (user) => {
  const emailToken = generateToken(
    { user: user._id },
    JWT_EMAIL_EXPIRATION,
    process.env.JWT_EMAIL_SEC
  );

  const url = `http://localhost:5000/api/v1/confirmation/${emailToken}`;

  await transporter.sendMail({
    from: process.env.NODEMAILER_USER, // sender address
    to: user.email, // list of receivers
    subject: "Hiker Summit Email Confirmation",
    html: `<b>Welcome To Hiker Summit, ✨✨</b>
    <a href="${url}">Click this link to confirm your email</a> `,
  });
};

const sendEmail = async (target) => {
  await transporter.sendMail({
    from: process.env.NODEMAILER_USER,
    to: target,
    subject: "testing",
    text: "you are logged in",
    html: `<div style="background-color:#FF0000;height:200px;width:200px"><p> you are logged in </p> </div>`,
  });
};

module.exports = {
  sendEmail,
  sendVerificationEmail,
};
