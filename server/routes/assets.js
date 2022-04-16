const router = require("express").Router();
const { getImage } = require("../controllers/assetsController");
const { verifyTokenAndAuthorization } = require("../middlewares/verifyToken");

/**
 * ? GET route needs folder and key query to where the assets is located
 * TODO: use param or query in getImage ???
 * TODO: create a function to purge unused images from upate destination content
 */

router.get("/", getImage); // ? get image ( public )
router.get("/protected/:key", verifyTokenAndAuthorization, getImage); // ? get image ( protected )

module.exports = router;
