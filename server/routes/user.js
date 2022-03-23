const router = require("express").Router();
const CryptoJS = require("crypto-js");
const User = require("../models/User");

router.get("/", async (req, res) => {
  res.status(200).json("hello this is user route");
});

module.exports = router;
