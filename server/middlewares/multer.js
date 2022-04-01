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

const destinationStorage = multer.diskStorage({
  // ? cb = callback
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${new Date().toString()} ${file.originalname}`);
  },
});

const multerUploads = multer({
  storage: destinationStorage,
  limits: {
    fileSize: 1024 * 1024,
  },
  fileFilter,
}).array("image", 5);

const parser = new DatauriParser();

const dataUri = (req) => {
  return parser.format(path.extname(req.originalname).toString(), req.buffer);
};

module.exports = {
  multerUploads,
  dataUri,
};
