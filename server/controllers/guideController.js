const Guide = require("../models/Guide");
const User = require("../models/User");

// ? Register Guide
const registerGuide = async (req, res) => {
  const newGuide = new Guide({
    user_id: req.params.id,
    ...req.body,
  });

  try {
    // ? verify guide duplicate track_route
    const userGuide = await Guide.find({
      user_id: req.params.id,
      track_route: {
        $in: [req.body.track_route],
      },
    });

    // ? if guide exist
    if (userGuide && userGuide.length > 0)
      throw new Error("Duplicate Track Route Detected ...");
    const savedGuide = await newGuide.save();
    res.status(201).json({
      succes: true,
      message: `Guide Registered`,
      result: savedGuide,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: `${error.message}.`,
    });
  }
};

// ! might want to handle deleting destination id here
// ? Update Guide, (everything except destination)
const updateGuide = async (req, res) => {
  const queryGuideId = req.query.guide_id;
  try {
    if (queryGuideId) throw new Error("guide_id Query is Needed ... ");
    const updatedGuide = await Guide.findByIdAndUpdate(
      req.query.guide_id,
      {
        $set: req.body,
      },
      {
        new: false,
      }
    );
    res.status(201).json({
      succes: true,
      message: `Guide Updated`,
      result: updatedGuide,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: `${error.message}.`,
    });
  }
};

// ? Update Guide, Status
const updateGuideStatus = async (req, res) => {
  const { status: activeStatus } = req.body;
  const userRoles = activeStatus === "active" ? "guide" : "umum";

  try {
    const response = await Guide.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          status: activeStatus,
        },
      },
      {
        new: false,
        runValidators: true, // ? enforce schema validation on update
      }
    );

    if (!response) throw new Error("Guide Not Found ... ");

    // ? change user role status/role from 'umum' to 'guide'
    const { user_id } = await Guide.findById(req.params.id);
    await User.findByIdAndUpdate(
      user_id,
      {
        $set: {
          user_status: userRoles,
        },
      },
      {
        new: false,
        runValidators: true,
      }
    );

    res.status(201).json({
      succes: true,
      message: `Guide Status Updated`,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: `${error.message}.`,
    });
  }
};

const approveGuide = async (req, res) => {
  const { result, status } = req.body;

  try {
    const { user_id } = await Guide.findByIdAndUpdate(
      req.params.guide_id,
      {
        $set: {
          approved: result,
          status: "active",
        },
      },
      {
        new: false,
        runValidators: true, // ? enforce schema validation on update
      }
    );

    // ? change user role status/role from 'umum' to 'guide'
    await User.findByIdAndUpdate(
      user_id,
      {
        $set: {
          user_status: status,
        },
      },
      {
        new: false,
        runValidators: true,
      }
    );

    res.status(201).json({
      succes: true,
      message: `Guide Approved`,
      result: response,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: `${error.message}.`,
    });
  }
};

// ? Delete Guide
const deleteGuide = async (req, res) => {
  try {
    await Guide.findByIdAndDelete(req.params.id);
    res.status(200).json({
      succes: true,
      message: `Guide Deleted.`,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: `${error.message}.`,
    });
  }
};

// ? Get All Guide
const getAllGuide = async (req, res) => {
  const paginationOptions = {
    page: parseInt(req.query.page || 0),
  };
  const paginationQuery = new Object();

  req.query.page_size
    ? (paginationOptions.limit = +req.query.page_size)
    : (paginationOptions.pagination = false);
  req.query.destination_id
    ? (paginationQuery.destination_id = req.query.destination_id)
    : "";
  req.query.newest ? (paginationOptions.sort = { createdAt: -1 }) : "";
  req.query.user_id ? (paginationQuery.user_id = req.query.user_id) : "";

  try {
    const result = await Guide.paginate(paginationQuery, paginationOptions);
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

// ? Get Single Guide
const getSingleGuide = async (req, res) => {
  try {
    const guide = await Guide.findById(req.params.id);
    res.status(200).json({
      succes: true,
      result: guide,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: `${error.message}.`,
    });
  }
};

module.exports = {
  registerGuide,
  updateGuide,
  approveGuide,
  updateGuideStatus,
  deleteGuide,
  getAllGuide,
  getSingleGuide,
};
