const multer = require("multer");
const { s3 } = require("../configs/s3");
const multerS3 = require("multer-s3");

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("File extension not allowed."), false);
  }
};

const uploadS3 = (bucketName) => {
  return multer({
    storage: multerS3({
      s3: s3,
      bucket: `${process.env.AWS_BUCKET_NAME}/${bucketName}`,
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
      },
    }),
    fileFilter,
  });
};

const getS3File = (key, bucketFolder) => {
  const params = {
    Key: key,
    Bucket: `${process.env.AWS_BUCKET_NAME}/${bucketFolder}`,
  };
  return s3.getObject(params);
};

module.exports = {
  getS3File,
  uploadS3,
};
