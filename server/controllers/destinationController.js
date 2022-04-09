const Destination = require("../models/Destination");
const User = require("../models/User");
const Review = require("../models/Review");

// ? Create Destination
const createDestination = async (req, res) => {
  const newDestination = new Destination(JSON.parse(Object.values(req.body)));
  newDestination.content.image_assets.bucket = res.s3_bucket;
  newDestination.content.image_assets.assets_key = [...res.image_keys];

  try {
    const user = await User.findById(req.params.user_id);
    if (user.is_admin) newDestination.approved = true;
    const savedDestination = await newDestination.save();
    res.status(201).json({
      succes: true,
      message: `Successfully Added Destination`,
      result: savedDestination,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: `${error.message}.`,
    });
  }
};

// ? Update Destination Content
const updateDestination = async (req, res) => {
  try {
    if (!req.query.destination)
      throw new Error("destination_id Query is needed ...");
    const updatedDestination = await Destination.findByIdAndUpdate(
      req.query.destination_id,
      {
        $set: req.body,
      },
      { new: false }
    );

    res.status(201).json({
      succes: true,
      message: `Successfully Updated Destination`,
      result: updatedDestination,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: `${error.message}.`,
    });
  }
};

// ? Update Destination Approved State ( Admin Only )
const updateApprovedState = async (req, res) => {
  const destinationId = req.params.destination_id;
  const { approved: approveStatus } = req.body;

  try {
    await Destination.findByIdAndUpdate(
      destinationId,
      {
        $set: {
          approved: approveStatus,
        },
      },
      {
        new: false,
      }
    );
    res.status(201).json({
      succes: true,
      message: `Destination ${req.params.destination_id} Approved Status Changed To ${approveStatus}.`,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: `${error.message}.`,
    });
  }
};

// ? Delete Destination ( Admin Only )
const deleteDestination = async (req, res) => {
  try {
    await Promise.all([
      Destination.findByIdAndDelete(req.params.destination_id),
      Review.deleteMany({ destination_id: req.params.destination_id }),
    ]);
    res.status(200).json({
      succes: true,
      message: `Destination ${req.params.destination_id} Deleted.`,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: `${error.message}.`,
    });
  }
};

// ? Get All Destination
const getAllDestination = async (req, res) => {
  const queryNewest = req.query.new;
  const queryIsland = req.query.island;
  const queryDifficulty = req.query.difficulty;
  const queryStatus = req.query.status;
  const queryUser = req.query.user_id;

  try {
    let destinations;

    if (queryNewest) {
      // ? this will sort all of the destination without limitting it, if want to limit use limit(number) method after sort method (e.g. pagination)
      destinations = await Destination.find().sort({ createdAt: -1 });
    } else if (queryIsland) {
      destinations = await Destination.find({
        "location.island": queryIsland,
      }).sort({ createdAt: -1 });
    } else if (queryDifficulty) {
      destinations = await Destination.find({
        "location.difficulty": queryDifficulty,
      }).sort({ createdAt: -1 });
    } else if (queryStatus) {
      destinations = await Destination.find({
        approved: queryStatus,
      }).sort({ createdAt: -1 });
    } else if (queryUser) {
      destinations = await Destination.find({
        added_by: queryUser,
      }).sort({ createdAt: -1 });
    } else {
      destinations = await Destination.find();
    }

    res.status(200).json({
      succes: true,
      result: destinations,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: `${error.message}.`,
    });
  }
};

// ? Get Single Destination
const getSingleDestination = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.destination_id);
    if (!destination) throw new Error("Destination Not Found");

    res.status(200).json({
      succes: true,
      result: destination,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: `${error.message}.`,
    });
  }
};

module.exports = {
  createDestination,
  updateDestination,
  updateApprovedState,
  deleteDestination,
  getAllDestination,
  getSingleDestination,
};
