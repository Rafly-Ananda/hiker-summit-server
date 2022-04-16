const CryptoJS = require("crypto-js");
const User = require("../models/User");
const Guide = require("../models/Guide");

// ? Update User
const updateUser = async (req, res) => {
  try {
    if (!req.body.password) throw new Error("Password Is Required.");

    const updatedUser = await User.findByIdAndUpdate(
      req.params.user_id,
      {
        $set: {
          ...req.body,
          password: CryptoJS.AES.encrypt(
            req.body.password,
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
  try {
    await Promise.all([
      await User.findByIdAndDelete(req.params.user_id),
      await Guide.deleteMany({
        user_id: req.params.user_id,
      }),
    ]);

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
  const paginationOptions = {
    page: parseInt(req.query.page || 0),
  };

  req.query.page_size
    ? (paginationOptions.limit = +req.query.page_size)
    : (paginationOptions.pagination = false);
  req.query.newest ? (paginationOptions.sort = { createdAt: -1 }) : "";

  try {
    const result = await User.paginate({}, paginationOptions);
    res.status(200).json({
      succes: true,
      result,
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
  try {
    const user = await User.findById(req.params.user_id);
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
