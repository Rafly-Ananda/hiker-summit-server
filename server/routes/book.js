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
  deleteBooking,
  getAllBooking,
  getAllUserBookings,
  getSingleBooking,
} = require("../controllers/bookController");

/**
 * TODO: Deadline pembayaran (24 jam), pasang bukti pembayaran
 * ? for pagination needs to attach query page_size (limit) and page (currentPage)
 */

router.post("/:user_id", verifyTokenAndAuthorization, createBooking); // ? Create Booking
router.put("/:booking_id", verifyTokenAndAuthorization, updateBookingDetails); // ? Booking Details
router.put("/status/:booking_id", verifyTokenAndAdmin, updateBookingPaidStatus); // ? Booking Status
router.delete("/:user_id", verifyTokenAndAuthorization, deleteBooking); // ? Delete Booking
router.get("/", verifyTokenAndAdmin, getAllBooking); // ? All Bookings
router.get("/user/:user_id", verifyTokenAndAuthorization, getAllUserBookings); // ? All User Booking
router.get("/:booking_id", verifyToken, getSingleBooking); // ? Single Bookings

module.exports = router;
