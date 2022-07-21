const nodemailer = require("nodemailer");
const { generateToken } = require("../helpers/generateToken");
const { JWT_EMAIL_EXPIRATION } = require("../configs/config");
const path = require("path");

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

  const url = `https://hiker-summit.herokuapp.com/api/v1/confirmation/${emailToken}`;

  await transporter.sendMail({
    from: process.env.NODEMAILER_USER,
    to: user.email,
    subject: "Hiker Summit Email Confirmation ✨",
    attachments: [
      {
        filename: "confirmation.png",
        path: path.join(__dirname, "../assets/illustrationWelcome.png"),
        cid: "illustrationWelcome",
      },
    ],
    html: ` 
    <div style="
      width: 560px;
      margin: auto;
      font-family: sans-serif;
      color: #363740;
    " >
    <h1 style="margin-top: 40px; padding: 0">
      Welcome to <span style="color: #e98b00">Hiker Summit</span>!
    </h1>
    <hr style="margin-top: -8px; margin-bottom: 20px" />
    <img src="cid:illustrationWelcome" alt="" style="max-width: 560px" />
    <p style="letter-spacing: 1px">Hello There,</p>
    <p style="text-align: justify; letter-spacing: 1px">
      We're excited for you to join millions of hiker who are talking about
      mountain recommendation, and you can booking tour guide even be a guide.
    </p>
    <p style="text-align: justify; letter-spacing: 1px">
      We really look forward to your contribution either to share information
      about the mountain or to be a guide to accompany guests who need your
      services.
    </p>
    <p style="letter-spacing: 1px">- The HikerSummit Team</p>
    <p style="text-align: justify; letter-spacing: 1px; margin-top: 28px">
      <span style="font-weight: 550">Please Note:</span>
      Since you're new to joining, you don't currently have access to some
      features. To enjoy the full features, please
      <a href="${url}">confirm your email</a>.
    </p>
    <hr style="margin-top: 36px" />
    <p style="letter-spacing: 1px; text-align: center; font-size: 10px">
      Copyright ©2022, Hiker Summit
    </p>
  </div>`,
  });
};

const sendPaymentConfirmationEmail = async (user, amount) => {
  await transporter.sendMail({
    from: process.env.NODEMAILER_USER,
    to: user.email,
    subject: "Hiker Summit Transaction Confirmation",
    attachments: [
      {
        filename: "logo.png",
        path: path.join(__dirname, "../assets/logo.png"),
        cid: "illustrationWelcome",
      },
    ],
    html: `<div
    style="
      width: 560px;
      margin: auto;
      font-family: sans-serif;
      color: #363740;
    "
  >
    <img src="logo.png" alt="" style="max-width: 150px; margin-top: 60px" />
    <h1 style="padding: 0; margin-top: 4px">Guide accepted your booking!</h1>
    <hr style="margin-top: -8px; margin-bottom: 32px" />
    <p style="letter-spacing: 1px">Hello Hiker,</p>
    <p style="text-align: justify; letter-spacing: 1px">
      The guide has accepted your booking, only
      <span style="font-weight: 550"
        >one more step to complete the transaction</span
      >
      and then ready to go on an adventure accompanied by our guide.
    </p>
    <p style="text-align: justify; letter-spacing: 1px">
      Please pay the balance of
      <span style="font-weight: 550">${amount}</span> via transfer according
      to the following information:
    </p>
    <table style="width: 70%; margin-left: auto; margin-right: auto">
      <tr>
        <td>Bank</td>
        <td>Bank Central Asia</td>
      </tr>
      <tr>
        <td>Account Number</td>
        <td>123456789</td>
      </tr>
      <tr>
        <td>Account Name</td>
        <td>PT. Jelajah Gunung</td>
      </tr>
    </table>
    <p style="text-align: justify; letter-spacing: 1px">
      After transfer, please send the payment proof by
      <a href="https://hikersummit.netlify.app/dashboard/pesanan/${user._id}">click here</a>.
    </p>
    <p style="text-align: justify; letter-spacing: 1px">
      Don't hesitate to contact us if you have any questions or concerns.
      Thank you!
    </p>
    <p style="letter-spacing: 1px">Warm regards,</p>
    <p style="letter-spacing: 1px; margin-top: 32px">HikerSummit Team</p>
    <hr style="margin-top: 36px" />
    <p style="letter-spacing: 1px; text-align: center; font-size: 10px">
      Copyright ©2022, Hiker Summit
    </p>
  </div>`,
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
