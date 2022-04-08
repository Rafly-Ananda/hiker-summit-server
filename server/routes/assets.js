const router = require("express").Router();
const { getImage, postImage } = require("../controllers/assetsController");
const { verifyTokenAndAuthorization } = require("../middlewares/verifyToken");

/**
 * ? POST route needs bucket query to select the target s3 bukcket
 * ? GET route needs folder and key query to where the assets is located
 * TODO: use param or query in getImage ???
 */

router.post("/upload", postImage); // ? post image s3 bucket
router.get("/", getImage); // ? get image ( public )
router.get("/protected/:key", verifyTokenAndAuthorization, getImage); // ? get image ( protected )

module.exports = router;
