const { uploadS3, deleteS3 } = require("../middlewares/multer");
const Destination = require("../models/Destination");
const User = require("../models/User");
const { s3Folders } = require("../configs/s3");
const { MAX_IMAGE_ALLOWED } = require("../configs/config");

// ? post image
const postImage = (req, res, next) => {
  let imageKeys = [];
  const basePath = req.baseUrl.split("/").at(-1);
  const bucketFolder = Object.values(s3Folders[basePath]).join("");
  const multerUpload = uploadS3(bucketFolder).array("image", MAX_IMAGE_ALLOWED);

  multerUpload(req, res, async (err) => {
    try {
      if (err) throw new Error(err.message);
      // ? save multer result to pass in destinationController
      if (req.files.length < 1) {
        res.image_keys = [""];
      } else {
        req.files.forEach((image) => imageKeys.push(image.key));
        res.image_keys = imageKeys;
      }
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
};

// TODO : error handling if key is undefined/undefined
const deleteImage = async (req, res, next) => {
  const basePath = req.baseUrl.split("/").at(-1);
  let assets;
  try {
    // TODO: add base path for payment images
    // ? this route currently deleting all images in destination
    if (basePath === "destinations") {
      const {
        content: { image_assets },
      } = await Destination.findById(`${req.params.id}`);
      assets = image_assets;
    }

    if (basePath === "users") {
      const { image_assets } = await User.findById(`${req.params.id}`);
      assets = { ...image_assets, assets_key: [image_assets.assets_key] };
    }

    deleteS3(assets.assets_key, assets.bucket);
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
