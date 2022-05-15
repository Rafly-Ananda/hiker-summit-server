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
 * TODO: purge unused assets
 * ? POST and PUT Destination Content need to pass bucket query
 * ? for pagination needs to attach query page_size (limit) and page (currentPage)
 */

// ? Create Destination
router.post("/:id", verifyTokenAndAuthorization, postImage, createDestination);

// ? Update Destination Content
router.put("/:id", verifyTokenAndAuthorization, postImage, updateDestination);

// ? Update Destination Approved State ( Admin Only )
router.put("/status/:id", verifyTokenAndAdmin, updateApprovedState);

// ? Delete Destination ( Admin Only )
router.delete("/:id", verifyTokenAndAdmin, deleteImage, deleteDestination);

router.get("/", getAllDestination); // ? Get All Destination
router.get("/:id", getSingleDestination); // ? Get Single Destination

module.exports = router;
