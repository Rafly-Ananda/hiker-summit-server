const router = require("express").Router();
const {
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
} = require("../middlewares/verifyToken");
const {
  createDestination,
  updateDestination,
  updateApprovedState,
  deleteDestination,
  getAllDestination,
  getSingleDestination,
} = require("../controllers/destinationController");
const { postImage, deleteImage } = require("../middlewares/S3Actions");

/**
 * TODO: because this will be in form/data need to update the method
 *
 */

// ? Create Destination
router.post(
  "/:user_id",
  verifyTokenAndAuthorization,
  postImage,
  createDestination
);

// ? Update Destination Content
router.put(
  "/:user_id",
  verifyTokenAndAuthorization,
  postImage,
  updateDestination
);

// ? Update Destination Approved State ( Admin Only )
router.put("/status/:destination_id", verifyTokenAndAdmin, updateApprovedState);

// ? Delete Destination ( Admin Only )
router.delete(
  "/:destination_id",
  verifyTokenAndAdmin,
  deleteImage,
  deleteDestination
);

router.get("/", getAllDestination); // ? Get All Destination
router.get("/:destination_id", getSingleDestination); // ? Get Single Destination

module.exports = router;
