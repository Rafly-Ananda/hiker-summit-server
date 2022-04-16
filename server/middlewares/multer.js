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

const getS3 = (key, bucketFolder) => {
  const params = {
    Bucket: `${process.env.AWS_BUCKET_NAME}/${bucketFolder}`,
    Key: key,
  };
  return s3.getObject(params);
};

const deleteS3 = (imageKeys, bucketFolder) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Delete: {
      Objects: imageKeys.map((key) => {
        return { Key: `${bucketFolder}/${key}` };
      }),
    },
  };

  s3.deleteObjects(params, function (err, data) {
    if (err) console.log(err, err.stack); // ? an error occurred
    else console.log(data); // ? successful response
  });
};

module.exports = {
  uploadS3,
  getS3,
  deleteS3,
};
