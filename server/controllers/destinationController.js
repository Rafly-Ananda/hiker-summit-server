const Destination = require("../models/Destination");
const User = require("../models/User");

// TODO: Integrate S3 image upload middleware
// ? Create Destination
const createDestination = async (req, res) => {
  // const newDestination = new Destination(JSON.parse(Object.values(req.body)));
  const user_id = req.params.user_id;
  // const imgList = req.files.map((file) => {
  //   return file.originalname;
  // });

  // newDestination.content.image_galery = [...imgList];

  const newDestination = new Destination(req.body);

  try {
    const user = await User.findById(user_id);
    if (user.is_admin) newDestination.approved = true;
    const savedDestination = await newDestination.save();
    res.status(201).json(savedDestination);
  } catch (error) {
    res.status(500).json(`Error Occurred : ${error.message}.`);
  }
};

// TODO: Integrate S3 image upload middleware
// ? Update Destination Content
const updateDestination = async (req, res) => {
  try {
    const updatedDestination = await Destination.findByIdAndUpdate(
      req.params.destination_id,
      {
        $set: req.body,
      },
      { new: false } // ? this will change the destination _id
    );

    res
      .status(201)
      .json(`Destination Updated. Details : ${updatedDestination}`);
  } catch (error) {
    res.status(500).json(`Error Occurred : ${error.message}.`);
  }
};

// TODO : Fix approved state logic later (admin can also un-Approved)
// ? Update Destination Approved State ( Admin Only )
const updateApprovedState = async (req, res) => {
  const destinationId = req.params.destination_id;

  try {
    const destination = await Destination.findById(destinationId);

    if (destination.approved) {
      res.status(406).json(`Destination Already Approved.`);
      return;
    } else {
      await Destination.findByIdAndUpdate(
        destinationId,
        {
          $set: {
            approved: true,
          },
        },
        {
          new: false,
        }
      );
      res.status(200).json(`Destination Status Approved`);
      return;
    }
  } catch (error) {
    res.status(500).json(`Error Occurred : ${error.message}`);
  }
};

// TODO: Integrate S3 image upload middleware to also delete
// ? Delete Destination ( Admin Only )
const deleteDestination = async (req, res) => {
  const destinationId = req.params.destination_id;
  try {
    // // ? deleting image blob data in mongodb
    // const {
    //   content: { image_galery },
    // } = await Destination.findById(destinationId);
    // image_galery.forEach((img) =>
    //   gfs.files.findOne({ filename: img }, (err, file) => {
    //     if (!file || file.length === 0)
    //       res.status(404).json({
    //         err: "No file exists",
    //       });

    //     gridfsBucket.delete(file._id);
    //   })
    // );

    const response = await Destination.findByIdAndDelete(destinationId);

    res.status(200).json("Destination Deleted.");
    return;
  } catch (error) {
    res.status(500).json(`Error Occurred : ${error.message}.`);
  }
};

// ? Get All Destination
const getAllDestination = async (req, res) => {
  // destinations?newest=true&destination=zero, use '&' to add another query param after a query param
  const queryNewest = req.query.new;
  const queryIsland = req.query.island;
  const queryDifficulty = req.query.difficulty;
  const queryStatus = req.query.status;

  try {
    let destination;

    if (queryNewest) {
      // ? this will sort all of the destination without limitting it, if want to limit use limit(number) method after sort method (e.g. pagination)
      destination = await Destination.find().sort({ createdAt: -1 });
    } else if (queryIsland) {
      destination = await Destination.find({
        "location.island": queryIsland,
      });
    } else if (queryDifficulty) {
      destination = await Destination.find({
        "location.difficulty": queryDifficulty,
      });
    } else if (queryStatus) {
      destination = await Destination.find({
        approved: queryStatus,
      }).sort({ createdAt: -1 });
    } else {
      destination = await Destination.find();
    }

    res.status(200).json(destination);
  } catch (error) {
    res.status(500).json(`Error Occurred : ${error.message}`);
  }
};

// ? Get All Destination Added by User
const getAllDestinationByUser = async (req, res) => {
  const userId = req.params.user_id;
  const queryNewest = req.query.new;
  let destinations;

  try {
    if (queryNewest) {
      destinations = await Destination.find({
        added_by: userId,
      }).sort({ createdAt: -1 });
    } else {
      destinations = await Destination.find({
        added_by: userId,
      });
    }

    res.status(200).json(destinations);
  } catch (error) {
    res.status(500).json(`Error Occurred : ${error}`);
  }
};

// ? Get Single Destination
const getSingleDestination = async (req, res) => {
  const destinationId = req.params.destination_id;
  try {
    const destination = await Destination.findById(destinationId);
    if (!destination) {
      throw new Error("Destination Not Found");
    } else {
      res.status(200).json(destination);
      return;
    }
  } catch (error) {
    res.status(404).json(`Error Occurred : ${error.message}`);
  }
};

module.exports = {
  createDestination,
  updateDestination,
  updateApprovedState,
  deleteDestination,
  getAllDestination,
  getAllDestinationByUser,
  getSingleDestination,
};
