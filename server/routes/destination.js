const router = require("express").Router();
const Destination = require("../models/Destination");
const User = require("../models/User");
const {
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
} = require("../middlewares/verifyToken");

// // ? Image processing dependencies
// const mongoose = require("mongoose");
// const multer = require("multer");
// const { GridFsStorage } = require("multer-gridfs-storage");
// const Grid = require("gridfs-stream");
// const crypto = require("crypto");

// let gfs, gridfsBucket;
// const connection = mongoose.createConnection(process.env.MONGODB_URI);
// connection.once("open", () => {
//   gridfsBucket = new mongoose.mongo.GridFSBucket(connection.db, {
//     bucketName: "destination_assets",
//   });

//   gfs = Grid(connection.db, mongoose.mongo);
//   gfs.collection("destination_assets");
// });

// // ? Multer Storage Config
// const destinationStorage = new GridFsStorage({
//   url: process.env.MONGODB_URI,
//   file: (req, file) => {
//     return new Promise((resolve, reject) => {
//       crypto.randomBytes(16, (err, buf) => {
//         if (err) {
//           return reject(err);
//         }
//         const filename = file.originalname;
//         const fileInfo = {
//           filename: filename,
//           bucketName: "destination_assets",
//         };
//         resolve(fileInfo);
//       });
//     });
//   },
// });

// const fileFilter = (req, file, cb) => {
//   if (
//     file.mimetype === "image/png" ||
//     file.mimetype === "image/jpg" ||
//     file.mimetype === "image/jpeg"
//   ) {
//     // accept
//     cb(null, true);
//   } else {
//     // reject file (only accpets png or jpg)
//     cb(new Error("File extension not allowed."), false);
//   }
// };

// const destinationUpload = multer({
//   storage: destinationStorage,
//   limits: {
//     fileSize: 1024 * 1024, // ? 1 mb, this is in bytes
//   },
//   fileFilter: fileFilter,
// });

// ? Create Destination
router.post("/:user_id", verifyTokenAndAuthorization, async (req, res) => {
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
});

// ? Update Destination Content
router.put(
  "/:user_id/:destination_id",
  verifyTokenAndAuthorization,
  async (req, res) => {
    try {
      const updatedDestination = await Destination.findByIdAndUpdate(
        req.params.destination_id,
        {
          $set: req.body,
        },
        { new: true } // ? this will change the destination _id
      );

      res
        .status(201)
        .json(`Destination Updated. Details : ${updatedDestination}`);
    } catch (error) {
      res.status(500).json(`Error Occurred : ${error.message}.`);
    }
  }
);

// TODO : Fix approved state logic later (admin can also un-Approved)
// ? Update Destination Approved State ( Admin Only )
router.put("/:destination_id", verifyTokenAndAdmin, async (req, res) => {
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
          new: true,
        }
      );
      res.status(200).json(`Destination Status Approved`);
      return;
    }
  } catch (error) {
    res.status(500).json(`Error Occurred : ${error.message}`);
  }
});

// ? Delete Destination ( Admin Only )
router.delete("/:destination_id", verifyTokenAndAdmin, async (req, res) => {
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
    if (!response) {
      throw new Error("Destination Not Found.");
    } else {
      res.status(200).json("Destination Deleted.");
      return;
    }
  } catch (error) {
    res.status(500).json(`Error Occurred : ${error.message}.`);
  }
});

// ? Get All Destination
router.get("/", async (req, res) => {
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
});

// ? Get All Destination Added by User
router.get("/find/user/:user_id", async (req, res) => {
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
});

// ? Get Single Destination
router.get("/find/:destination_id", async (req, res) => {
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
});

module.exports = router;
