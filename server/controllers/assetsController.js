const { getS3File, uploadS3 } = require("../middlewares/multer");

// ? post image
const postImage = (req, res) => {
  const multerUpload = uploadS3(req.query.bucket).array("image", 5);
  multerUpload(req, res, async (err) => {
    if (err)
      res.status(500).json({
        succes: false,
        message: `${err.message}.`,
      });
    res.send("Successfully uploaded " + req.files.length + " files!");
  });
};

// ? get image using query param
const getImage = async (req, res) => {
  const bucketQuery = req.query.bucket;
  const keyQuery = req.query.key;
  console.log("qweqwe");
  try {
    if (!keyQuery || !bucketQuery) throw new Error("Query Parameter Needed.");
    const readStream = getS3File(keyQuery, bucketQuery)
      .createReadStream()
      .on("error", (error) => {
        res
          .status(500)
          .json(
            `Error Occurred : ${error.message} - folder name or object key might be incorrect...`
          );
      });
    readStream.pipe(res);
  } catch (error) {
    res.status(500).json(`Error Occurred : ${error.message}`);
  }
};

module.exports = {
  postImage,
  getImage,
};
