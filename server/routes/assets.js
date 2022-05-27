const router = require("express").Router();
const { getImage, deleteImage } = require("../controllers/assetsController");
const { verifyTokenAndAuthorization } = require("../middlewares/verifyToken");

/**
 * ? GET route needs folder and key query to where the assets is located
 * TODO: create a function to purge unused images from upate destination content
 */

router.get("/", getImage); // ? get image ( public )
router.delete("/", deleteImage); // ? delete image ( provide key and bucket query)
router.get("/protected/:key", verifyTokenAndAuthorization, getImage); // ? get image ( protected: payment proof etc.. )

module.exports = router;
