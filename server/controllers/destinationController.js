const Destination = require("../models/Destination");
const User = require("../models/User");
const Review = require("../models/Review");
const Guide = require("../models/Guide");

// ? Create Destination
const createDestination = async (req, res) => {
  const newDestination = new Destination(JSON.parse(req.body.document));
  newDestination.content.image_assets.bucket = res.s3_bucket;
  newDestination.content.image_assets.assets_key = res.image_keys;
  newDestination.user_id = req.params.id;

  try {
    const user = await User.findById(req.params.id);
    if (user.is_admin) {
      newDestination.status = "active";
      newDestination.approved = "approved";
    }
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

// ? Update Destination Content,
const updateDestination = async (req, res) => {
  const payload = JSON.parse(req.body.document);
  let newAssetsKeyValue = [];

  console.log(res.image_keys);

  // ? if its includes " " it means that we modified the document body in the front end, if not then we add it from insomnia where we cant explicitly edit or add the new key name to the updated destination
  res.image_keys.includes("")
    ? (newAssetsKeyValue = [...payload.content.image_assets.assets_key])
    : (newAssetsKeyValue = [
        ...payload.content.image_assets.assets_key,
        ...res.image_keys,
      ]);

  payload.content.image_assets.assets_key = newAssetsKeyValue;

  try {
    if (!req.params.destination_id)
      throw new Error("destination_id Query is needed ...");
    const updatedDestination = await Destination.findByIdAndUpdate(
      req.params.destination_id,
      {
        $set: payload,
      },
      { new: false, runValidators: true }
    );

    if (!updatedDestination)
      throw new Error(
        `Destination With id ${req.params.destination_id} Not Found...`
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
  const { approved: approveStatus } = req.body;

  try {
    await Destination.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          approved: "approved",
        },
      },
      {
        new: false,
        runValidators: true,
      }
    );
    res.status(201).json({
      succes: true,
      message: `Destination ${req.params.id} Approved Status Changed To ${approveStatus}.`,
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
    await Promise.allSettled([
      Destination.findByIdAndDelete(req.params.id),
      Review.deleteMany({ destination_id: req.params.id }),
      Guide.deleteMany({ destination_id: req.params.id }),
      User.updateMany(
        {
          destination_wishlist: {
            $in: [req.params.id],
          },
        },
        {
          $pull: {
            destination_wishlist: { $in: [req.params.id] },
          },
        }
      ),
    ]);

    res.status(200).json({
      succes: true,
      message: `Destination ${req.params.id} Deleted.`,
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
  const aggregate = Destination.aggregate();
  const paginationOptions = {
    page: +req.query.page || 1,
  };

  req.query.page_size
    ? (paginationOptions.limit = +req.query.page_size)
    : (paginationOptions.pagination = false);
  req.query.newest ? (paginationOptions.sort = { createdAt: -1 }) : "";

  try {
    // ? if query island
    req.query.island
      ? aggregate.match({
          "location.island": req.query.island,
        })
      : "";

    // ? if query level
    req.query.level
      ? aggregate.match({
          difficulty: req.query.level,
        })
      : "";

    // ? if query status
    req.query.status
      ? aggregate.match({
          status: req.query.status,
        })
      : "";

    // ? if query user_id
    req.query.user_id
      ? aggregate.match({
          added_by: req.query.user_id,
        })
      : "";

    const result = await Destination.aggregatePaginate(
      aggregate,
      paginationOptions
    );

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

// ? Get Single Destination
const getSingleDestination = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
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
