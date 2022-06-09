const CryptoJS = require("crypto-js");
const User = require("../models/User");
const Guide = require("../models/Guide");
const { sendVerificationEmail } = require("../helpers/nodemailer");

// ? Update User General
const updateUser = async (req, res) => {
  try {
    const result = await Promise.all([
      User.findById(req.body._id),
      User.findOne({
        username: req.body.username,
      }),
      User.findOne({ email: req.body.email }),
    ]);

    // ? if user is attaching password, it means user is changing password
    if (req.body.password) {
      req.body.password = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.PASS_SEC
      ).toString();
    }

    if (result[1] && result[0].username !== req.body.username) {
      throw Error("Userame already registered");
    } else if (result[2] && result[0].email !== req.body.email) {
      throw Error("Email already registered");
    } else {
      if (result[0].email !== req.body.email) {
        req.body.verified = false;
        sendVerificationEmail(req.body);
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            ...req.body,
          },
        },
        { new: false }
      );
      res.status(201).json({
        succes: true,
        message: `User Updated`,
        result: updatedUser,
      });
    }
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: `${error.message}.`,
    });
  }
};

// ? Update User Picture
const updateUserPicture = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          image_assets: {
            bucket: res.s3_bucket,
            assets_key: res.image_keys[0],
          },
        },
      },
      { new: false }
    );

    res.status(201).json({
      succes: true,
      message: `User Updated`,
      result: res.image_keys[0],
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
    await Promise.allSettled([
      await User.findByIdAndDelete(req.params.id),
      await Guide.deleteMany({
        user_id: req.params.id,
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

const getAllUserPublic = async (req, res) => {
  const paginationOptions = {
    page: parseInt(req.query.page || 0),
    select: "_id first_name last_name image_assets",
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

// ? Get All User
const getAllUser = async (req, res) => {
  const paginationOptions = {
    page: parseInt(req.query.page || 0),
    select: "-password", // ? send everything but exclude password
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
    const user = await User.findById(req.params.id);
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
  updateUserPicture,
  deleteUser,
  getAllUser,
  getAllUserPublic,
  getSingleUser,
  getUserStats,
};
