const { uploadS3, deleteS3 } = require("../middlewares/multer");
const Destination = require("../models/Destination");
const { s3Folders } = require("../configs/s3");

// ? post image
const postImage = (req, res, next) => {
  let imageKeys = [];
  if (!req.query.bucket) {
    res.status(500).json({
      succes: false,
      message: `Bucket Query Needed.`,
    });
    return;
  }

  if (s3Folders.includes(`${req.query.bucket.toLowerCase()}`)) {
    const multerUpload = uploadS3(req.query.bucket.toLowerCase()).array(
      "image",
      5
    );
    multerUpload(req, res, async (err) => {
      try {
        if (err) throw new Error(err.message);

        // ? save multer result to pass in destinationController
        req.files.forEach((image) => imageKeys.push(image.key));
        res.image_keys = imageKeys;

        // ! need optional chaining here
        res.s3_bucket =
          req.files.length > 0 ? req.files[0].bucket.split("/")[1] : "";
        next();
      } catch (error) {
        res.status(500).json({
          succes: false,
          message: `${error.message}.`,
        });
      }
    });
  } else {
    res.status(500).json({
      succes: false,
      message: `Invalid Bucket.`,
    });
  }
};

const deleteImage = async (req, res, next) => {
  try {
    const {
      content: { image_assets },
    } = await Destination.findById(`${req.params.destination_id}`);
    deleteS3(image_assets.assets_key, image_assets.bucket);
    next();
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: `${error.message}.`,
    });
  }
};

module.exports = {
  postImage,
  deleteImage,
};
