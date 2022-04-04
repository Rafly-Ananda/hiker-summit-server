require("dotenv").config();
const multer = require("multer");
const DatauriParser = require("datauri/parser");
const path = require("path");

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    // accept
    cb(null, true);
  } else {
    // reject file (only accpets png or jpg)
    cb(new Error("File extension not allowed."), false);
  }
};
const storage = multer.memoryStorage();

// ? CLOUDINARY Settings
const multerUploads = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024,
  },
  fileFilter,
}).array("image", 5);

const parser = new DatauriParser();

const dataUri = (req) => {
  return parser.format(path.extname(req.originalname).toString(), req.buffer);
};

// ? S3 Settings
// const s3 = require("../configs/s3");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");

aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  region: process.env.AWS_BUCKET_REGION,
});

const s3 = new aws.S3();

// ** to get into s3 directory use / in the bucket when doing multers3 upload actions, look below

const multerS3Upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: `${process.env.AWS_BUCKET_NAME}/destination_assets`,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});

const getS3File = (key) => {
  const params = {
    Key: key,
    Bucket: process.env.AWS_BUCKET_NAME + "/destination_assets",
  };
  return s3.getObject(params).createReadStream();
};

module.exports = {
  multerUploads,
  multerS3Upload,
  getS3File,
  dataUri,
};
