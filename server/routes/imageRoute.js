const router = require("express").Router();
const Image = require("../models/ImageTesting");
const mongoose = require("mongoose");
const { GridFsStorage } = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const crypto = require("crypto");

// ! FIRST TRY

// // ! ASYNC THIS WHOLE ROUTES
// // ** bucketname differnce
// // let gfs, gridfsBucket;
// // const conn = mongoose.createConnection(process.env.MONGODB_URI);
// // conn.once("open", () => {
// //   gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
// //     bucketName: "uploads",
// //   });

// //   gfs = Grid(conn.db, mongoose.mongo);
// //   gfs.collection("uploads");
// // });

// // ** bucketname differnce
// let gfs, gridfsBucket;
// const connection = mongoose.createConnection(process.env.MONGODB_URI);
// connection.once("open", () => {
//   // ? 1. for destination
//   gridfsBucket = new mongoose.mongo.GridFSBucket(connection.db, {
//     bucketName: "destination_assets",
//   });
//   // ? 2. for reviews

//   // ? 3. for user (profile and payment) make this private

//   // ? 4. App Asset ( carousel, jumbotron )

//   gfs = Grid(connection.db, mongoose.mongo);
//   gfs.collection("destination_assets");
// });

// // ? local storage #1
// const destinationStorage = multer.diskStorage({
//   // ? cb = callback
//   destination: (req, file, cb) => {
//     cb(null, "./uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${new Date().toString()} ${file.originalname}`);
//   },
// });

// // ? Turn into binary # 2
// // const storage = multer.memoryStorage();

// // ? using multer-gridfs-storate # 3 ( auto schema in db no need to make models )
// const storage = new GridFsStorage({
//   url: process.env.MONGODB_URI,
//   file: (req, file) => {
//     return new Promise((resolve, reject) => {
//       crypto.randomBytes(16, (err, buf) => {
//         if (err) {
//           return reject(err);
//         }
//         const filename = file.originalname;
//         const fileInfo = { filename: filename, bucketName: "uploads" };
//         resolve(fileInfo);
//       });
//     });
//   },
// });

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

// const appStorage = new GridFsStorage({
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
//           bucketName: "app_assets",
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

// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 1024 * 1024, // ? 1 mb, this is in bytes
//   },
//   fileFilter: fileFilter,
// });

// const destinationUpload = multer({
//   storage: destinationStorage,
//   limits: {
//     fileSize: 1024 * 1024, // ? 1 mb, this is in bytes
//   },
//   fileFilter: fileFilter,
// });

// const appUpload = multer({
//   storage: appStorage,
//   limits: {
//     fileSize: 1024 * 1024, // ? 1 mb, this is in bytes
//   },
//   fileFilter: fileFilter,
// });

// router.post("/", upload.single("image"), (req, res) => {
//   console.log(req.file);
//   res.status(201).json("image saved");
// });

// router.post("/destination", destinationUpload.array("image", 5), (req, res) => {
//   console.log(req.files);
//   console.log(req.body);
//   res.status(201).json("image saved");
// });

// router.post("/app", appUpload.single("image"), (req, res) => {
//   res.status(201).json("image saved");
// });

// // ? single image sync
// // router.get("/:filename", (req, res) => {
// //   gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
// //     if (!file || file.length === 0) {
// //       return res.status(404).json({
// //         err: "No file exists",
// //       });
// //     }

// //     // Read output to browser
// //     const readStream = gridfsBucket.openDownloadStream(file._id);
// //     readStream.pipe(res);
// //   });
// // });

// // ? Single image async
// router.get("/:filename", async (req, res) => {
//   try {
//     const file = await gfs.files.findOne({
//       filename: req.params.filename,
//     });
//     const readStream = gridfsBucket.openDownloadStream(file._id);
//     readStream.pipe(res);
//   } catch (error) {
//     res.send("not found");
//   }
// });

// // ? delete image
// router.delete("/:filename", (req, res) => {
//   gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
//     if (!file || file.length === 0)
//       res.status(404).json({
//         err: "No file exists",
//       });

//     gridfsBucket.delete(file._id);

//     res.status(200).json("file deleted");
//   });
// });

// ! CLOUDINARY
const {
  multerUploads,
  multerS3Upload,
  getS3File,
  dataUri,
} = require("../middlewares/multer");
const { uploader } = require("../configs/cloudinary");
const cloudinary = require("cloudinary").v2;

router.post("/cloudinary/upload", multerUploads, async (req, res) => {
  const payload = [];

  try {
    for (const data of req.files) {
      let file = dataUri(data).content;
      let response = await uploader.upload(file, {
        folder: "destinations_assets",
      });
      payload.push(response.url);
    }

    res.status(200).json({
      messge: "Image's Uploaded",
      data: payload,
    });
  } catch (error) {
    res.status(400).json(error.message);
    return;
  }
});

router.post("/s3/upload", multerS3Upload.array("image", 5), (req, res) => {
  res.send("Successfully uploaded " + req.files.length + " files!");
});

// ? get all image from cloudinary
router.get("/cloudinary", (req, res) => {
  cloudinary.api.resources(function (error, result) {
    if (error) return;
    res.status(200).json(result);
  });
});

// TODO : fix error when wrong id and change id
// ? get single image from destination route s3
router.get("/s3/:key", (req, res) => {
  try {
    const key = req.params.key;
    const readStream = getS3File(key);
    readStream.pipe(res);
  } catch (error) {
    res.json("error");
  }
});

// ? get single image from s3 (protected assets)
// router.get("/s3/protected/:key", (req, res) => {
//   const key = req.params.key;
//   const readStream = getS3File(key);
//   readStream.pipe(res);
// });

module.exports = router;
