const router = require("express").Router();
const { getImage } = require("../controllers/assetsController");
const { verifyTokenAndAuthorization } = require("../middlewares/verifyToken");

/**
 * ? GET route needs folder and key query to where the assets is located
 * TODO: use param or query in getImage ???
 * TODO: save image key in a variable and put it into image array in destination collection
 */

router.get("/", getImage); // ? get image ( public )
router.get("/protected/:key", verifyTokenAndAuthorization, getImage); // ? get image ( protected )

module.exports = router;
