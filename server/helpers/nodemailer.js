const nodemailer = require("nodemailer");
const { generateToken } = require("../helpers/generateToken");
const { JWT_EMAIL_EXPIRATION } = require("../configs/config");

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});

const sendVerificationEmail = async (user) => {
  const emailToken = generateToken(
    { user: user._id },
    JWT_EMAIL_EXPIRATION,
    process.env.JWT_EMAIL_SEC
  );

  const url = `http://localhost:5000/api/v1/confirmation/${emailToken}`;

  await transporter.sendMail({
    from: process.env.NODEMAILER_USER,
    to: user.email,
    subject: "Hiker Summit Email Confirmation",
    html: `<b>Welcome To Hiker Summit, ✨✨</b>
    <a href="${url}">Click this link to confirm your email</a>`,
  });
};

const sendPaymentConfirmationEmail = async (user, amount) => {
  await transporter.sendMail({
    from: process.env.NODEMAILER_USER,
    to: user.email,
    subject: "Hiker Summit Transaction Confirmation",
    html: `<b>Yaay, a guide accepted your booking ... </b> please pay to .... (bank acc hiker summit) with amount ${amount}, after that send the payment proof to here ... (link to upload proof page in fe)`,
  });
};

const sendBookingPaidEmailUser = async (user, guide, booking) => {
  await transporter.sendMail({
    from: process.env.NODEMAILER_USER,
    to: user.email,
    subject: "Hiker Summit Booking Success",
    html: `<b>Booking is accepted, enjoy your adventure... here is your guide detail ${JSON.stringify(
      guide
    )}<br/>
    booking detail:
    <br/>
    ${JSON.stringify(booking)}`,
  });
};

const sendBookingPaidEmailGuide = async (user, guide, booking) => {
  await transporter.sendMail({
    from: process.env.NODEMAILER_USER,
    to: guide.email,
    subject: "Hiker Summit Booking Success",
    html: `<b>Booking is approved, enjoy your adventure... </b> here is the customer detail${JSON.stringify(
      user
    )}<br/>
    booking detail:
    <br/>
    ${JSON.stringify(booking)}`,
  });
};

module.exports = {
  sendVerificationEmail,
  sendPaymentConfirmationEmail,
  sendBookingPaidEmailUser,
  sendBookingPaidEmailGuide,
};
