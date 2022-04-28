const { getS3 } = require("../middlewares/multer");

// ? get image using query param
const getImage = async (req, res) => {
  const stream = getS3(req.query.key, req.query.bucket);
  if (stream)
    stream
      .createReadStream()
      .on("error", (e) => {
        res.status(404).json({
          success: false,
          message: "Asset Not Found",
          err: e,
        });
      })
      .pipe(res);
};

module.exports = {
  getImage,
};
