const router = require("express").Router();
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middlewares/verifyToken");
const {
  createBooking,
  updateBookingDetails,
  updateBookingPaidStatus,
  cancelBooking,
  uploadProofOfPayment,
  guideAccept,
  deleteBooking,
  getAllBooking,
  getAllUserBookings,
  getSingleBooking,
} = require("../controllers/bookController");
const { postImage } = require("../middlewares/S3Actions");

/**
 * ? for pagination needs to attach query page_size (limit) and page (currentPage)
 */

router.post(
  "/users/:id/destinations/:destination_id",
  verifyTokenAndAuthorization,
  createBooking
); // ? Create Booking
router.put(
  "/:booking_id/users/:id",
  verifyTokenAndAuthorization,
  updateBookingDetails
); // ? Booking Details
router.put("/status/:id", verifyTokenAndAdmin, updateBookingPaidStatus); // ? Booking Status
router.put(
  "/payment/:id",
  verifyTokenAndAuthorization,
  postImage,
  uploadProofOfPayment
); // ? Upload proof of payment ( need query booking_id=...)
router.put(
  "/:booking_id/users/:id/cancel",
  verifyTokenAndAuthorization,
  cancelBooking
);
router.post(
  "/:booking_id/guides/:id",
  verifyTokenAndAuthorization,
  guideAccept
); // ? guide accepting book
router.delete("/:id", verifyTokenAndAuthorization, deleteBooking); // ? Delete Booking
router.get("/", verifyTokenAndAdmin, getAllBooking); // ? All Bookings
router.get("/guides/:id", verifyTokenAndAuthorization, getAllBooking); // ? All Bookings For Guide
router.get("/user/:id", verifyTokenAndAuthorization, getAllUserBookings); // ? All User Booking
router.get("/:id", verifyToken, getSingleBooking); // ? Single Bookings

module.exports = router;
