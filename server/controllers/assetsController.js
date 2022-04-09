const { getS3 } = require("../middlewares/multer");

// ? get image using query param
const getImage = async (req, res) => {
  const bucketQuery = req.query.bucket;
  const keyQuery = req.query.key;
  try {
    if (!keyQuery || !bucketQuery) throw new Error("Query Parameter Needed.");
    const readStream = getS3(keyQuery, bucketQuery)
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
    res.status(500).json({
      succes: false,
      message: `${error.message}.`,
    });
  }
};

module.exports = {
  getImage,
};
