const router = require("express").Router();
const Book = require("../models/Book");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middlewares/verifyToken");

// TODO : Deadline pembayaran (30 menit), pasang bukti pembayaran

// ? Create Booking
router.post("/", verifyToken, async (req, res) => {
  const userId = req.query.user_id;
  const destinationId = req.query.destination_id;
  const newBooking = new Book({
    user_id: userId,
    destination_id: destinationId,
    ...req.body,
  });

  try {
    const savedBooking = await newBooking.save();
    res.status(200).json(savedBooking);
  } catch (error) {
    res.status(500).json(`Error Occurred : ${error}`);
  }
});

// TODO : IMPORTANT!! TEST THIS UPDATE BOOK, CONFLICT WITH DESTINATION AND USERID
// TODO : Delete prev state when updating
// ? Update Booking Content
router.put("/:booking_id", verifyTokenAndAuthorization, async (req, res) => {
  const bookingId = req.params.booking_id;
  try {
    // ? check if booking status is already paid or not
    const bookingState = await Book.findById(bookingId);

    const updatedBooking = await Book.findByIdAndUpdate(
      bookingId,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(500).json(`Error Occurred : ${error}`);
  }
});

// ? Update Booking Paid Status
router.put("/status/:booking_id", verifyTokenAndAdmin, async (req, res) => {
  const bookingId = req.params.booking_id;
  try {
    const updatedBooking = await Book.findByIdAndUpdate(
      bookingId,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(500).json(`Error Occurred : ${error}`);
  }
});

// ? Delete Booking
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  const bookingId = req.params.id;
  try {
    await Book.findByIdAndDelete(bookingId);
    res.status(200).json("Booking Deleted.");
  } catch (error) {
    res.status(500).json(`Error Occurred : ${error}`);
  }
});

// ? Get All Bookings
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  const queryStatus = req.query.status;
  let bookings;

  try {
    if (queryStatus) {
      if (queryStatus === "unpaid") {
        bookings = await Book.find({
          paid_status: "unpaid",
        });
      } else {
        bookings = await Book.find({
          paid_status: "paid",
        });
      }
    } else {
      bookings = await Book.find();
    }

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json(`Error Occurred : ${error}`);
  }
});

// ? Get All Bookings on a Destination
router.get(
  "/find/destination/:destination_id",
  verifyTokenAndAdmin,
  async (req, res) => {
    const destinationId = req.params.destination_id;
    try {
      const bookings = await Book.find({
        destination_id: destinationId,
      });

      if (!bookings) throw new Error(`Bookings on ${destinationId} Not Found.`);
      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json(`Error Occurred : ${error}`);
    }
  }
);

// ? Get All User Booking
router.get("/find/user/:user_id", verifyToken, async (req, res) => {
  const userId = req.params.user_id;
  try {
    const bookings = await Book.find({
      user_id: userId,
    });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json(`Error Occurred : ${error}`);
  }
});

// ? Get Single Bookings
router.get("/:booking_id", verifyToken, async (req, res) => {
  const bookingId = req.params.booking_id;
  try {
    const bookings = await Book.findById(bookingId);
    if (!bookings)
      throw new Error(`Bookings Details on ${destinationId} Not Found.`);
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json(`Error Occurred : ${error}`);
  }
});

module.exports = router;
