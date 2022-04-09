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
 * TODO: Deadline pembayaran (30 menit), pasang bukti pembayaran
 * TODO: Paid status route
 */

router.post("/:user_id", verifyTokenAndAuthorization, createBooking); // ? Create Booking
router.put("/:booking_id", verifyTokenAndAuthorization, updateBookingDetails); // ? Booking Details
router.put("/status/:booking_id", verifyTokenAndAdmin, updateBookingPaidStatus); // ? Booking Status
router.delete("/:user_id", verifyTokenAndAuthorization, deleteBooking); // ? Delete Booking
router.get("/", verifyTokenAndAdmin, getAllBooking); // ? All Bookings
router.get("/user/:user_id", verifyToken, getAllUserBookings); // ? All User Booking
router.get("/:booking_id", verifyToken, getSingleBooking); // ? Single Bookings

module.exports = router;
