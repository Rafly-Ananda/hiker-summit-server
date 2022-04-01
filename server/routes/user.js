const router = require("express").Router();
const CryptoJS = require("crypto-js");
const {
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
} = require("../middlewares/verifyToken");
const User = require("../models/User");

// ? Update User
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  const userPassword = req.body.password;

  if (userPassword) {
    userPassword = CryptoJS.AES.encrypt(
      userPassword,
      process.env.PASS_SEC
    ).toString();
  } else {
    throw new Error("Password Is Required.");
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json(error);
  }
});

// ? Delete User
router.delete("/:user_id", verifyTokenAndAdmin, async (req, res) => {
  const user_id = req.params.user_id;
  try {
    await User.findByIdAndDelete(user_id);
    res.status(200).json("User Deleted.");
  } catch (error) {
    res.status(500).json(`Error Occurred : ${error.message}`);
  }
});

// ? Get All User
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  let user;
  const queryNewest = req.query.newest;
  const queryDestination = req.query.wrote_destination;

  // TODO : add query to get user that has added destination and wrote a review

  try {
    if (queryNewest) {
      user = await User.find().sort({ createdAt: -1 });
    } else {
      user = await User.find();
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(`Error Occurred : ${error.message}`);
  }
});

// ? Get Single User
router.get("/find/:user_id", verifyTokenAndAdmin, async (req, res) => {
  const userID = req.params.user_id;
  try {
    const user = await User.findById(userID);
    // ? others is a variable that we make to store the rest of the user._doc object
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (error) {
    res.status(500).json(`Error Occurred : ${error.message}`);
  }
});

// ? Get User Stats ( e.g. total user per month )
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1)); // ? will return last year from today

  try {
    // TODO Research about this aggregate function in mongoDB
    const data = await User.aggregate([
      {
        $match: { createdAt: { $gte: lastYear } }, // ? gte = greater than
      },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 }, // ? sum 1  = will sum every registered user
        },
      },
    ]);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(`Error Occurred : ${error.message}`);
  }
});

module.exports = router;
