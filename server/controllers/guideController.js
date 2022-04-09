const Guide = require("../models/Guide");

// ? Register Guide
const registerGuide = async (req, res) => {
  const userId = req.params.user_id;
  const { destination_id } = req.body;
  const newGuide = new Guide({
    user_id: userId,
    ...req.body,
  });
  try {
    // ? verify duplicate
    const userGuide = await Guide.find({
      user_id: userId,
      destination_id: destination_id,
    });

    // ? if guide exist
    if (userGuide && userGuide.length > 0)
      throw new Error("Destination Only Accepts One User Guide Instance...");
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

// ? Update Guide, (everything except destination)
const updateGuide = async (req, res) => {
  const guideId = req.query.guide_id;
  try {
    if (guideId) throw new Error("guide_id Query is Needed ... ");
    const updatedGuide = await Guide.findByIdAndUpdate(
      guideId,
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
  const guideId = req.params.guide_id;
  const { status: activeStatus } = req.body;
  console.log(activeStatus);

  try {
    const response = await Guide.findByIdAndUpdate(
      guideId,
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
    res.status(201).json({
      succes: true,
      message: `Guide Status Updated`,
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
  const queryGuideId = req.params.guide_id;
  try {
    await Guide.findByIdAndDelete(queryGuideId);
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
  let guides;
  const queryDestination = req.query.destination;
  const queryNewest = req.query.newest;
  const queryUser = req.query.user;

  try {
    if (queryNewest) {
      guides = await Guide.find().sort({ createdAt: -1 });
    } else if (queryDestination) {
      guides = await Guide.find({
        destination_id: queryDestination,
      });
    } else if (queryUser) {
      guides = await Guide.find({
        user_id: queryUser,
      });
    } else {
      guides = await Guide.find();
    }
    res.status(200).json({
      succes: true,
      result: guides,
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
  const queryGuide = req.query.guide_id;
  try {
    const guide = await Guide.findById(queryGuide);
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
  updateGuideStatus,
  deleteGuide,
  getAllGuide,
  getSingleGuide,
};
