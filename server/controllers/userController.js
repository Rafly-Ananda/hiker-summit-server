const CryptoJS = require("crypto-js");
const User = require("../models/User");

// ? Update User
const updateUser = async (req, res) => {
  const userPassword = req.body.password;
  const userId = req.params.user_id;

  try {
    if (!userPassword) throw new Error("Password Is Required.");

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          ...req.body,
          password: CryptoJS.AES.encrypt(
            userPassword,
            process.env.PASS_SEC
          ).toString(),
        },
      },
      { new: false }
    );

    res.status(201).json({
      succes: true,
      message: `User Updated`,
      result: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: `${error.message}.`,
    });
  }
};

// ? Delete User
const deleteUser = async (req, res) => {
  const user_id = req.params.user_id;
  try {
    await User.findByIdAndDelete(user_id);
    res.status(200).json({
      succes: true,
      message: `User Deleted`,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: `${error.message}.`,
    });
  }
};

// ? Get All User
const getAllUser = async (req, res) => {
  let users;
  const queryNewest = req.query.newest;

  try {
    if (queryNewest) {
      users = await User.find().sort({ createdAt: -1 });
    } else {
      users = await User.find();
    }

    res.status(200).json({
      succes: true,
      result: users,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: `${error.message}.`,
    });
  }
};

// ? Get Single User
const getSingleUser = async (req, res) => {
  const userID = req.params.user_id;
  try {
    const user = await User.findById(userID);
    const { password, ...others } = user._doc;
    res.status(200).json({
      succes: true,
      result: others,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: `${error.message}.`,
    });
  }
};

// ? Get User Stats ( e.g. total user per month )
const getUserStats = async (req, res) => {
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
    res.status(200).json({
      succes: true,
      result: data,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: `${error.message}.`,
    });
  }
};

module.exports = {
  updateUser,
  deleteUser,
  getAllUser,
  getSingleUser,
  getUserStats,
};
