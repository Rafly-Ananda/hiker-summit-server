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
  getAllDestinationByUser,
  getSingleDestination,
} = require("../controllers/destinationController");

// TODO: Integrate S3 image upload middleware
// ? Create Destination
router.post("/:user_id", verifyTokenAndAuthorization, createDestination);

// TODO: Integrate S3 image upload middleware
// ? Update Destination Content
router.put(
  "/:user_id/:destination_id",
  verifyTokenAndAuthorization,
  updateDestination
);

// TODO : Fix approved state logic later (admin can also un-Approved)
// ? Update Destination Approved State ( Admin Only )
router.put("/:destination_id", verifyTokenAndAdmin, updateApprovedState);

// TODO: Integrate S3 image upload middleware to also delete
// TODO: If a destination is deleted the reviews in that destination is also deleted
// ? Delete Destination ( Admin Only )
router.delete("/:destination_id", verifyTokenAndAdmin, deleteDestination);

router.get("/", getAllDestination); // ? Get All Destination
router.get("/find/user/:user_id", getAllDestinationByUser); // ? Get All Destination Added by User
router.get("/find/:destination_id", getSingleDestination); // ? Get Single Destination

module.exports = router;
