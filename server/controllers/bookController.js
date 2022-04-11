const Book = require("../models/Book");

// TODO : Deadline pembayaran (30 menit), pasang bukti pembayaran
const createBooking = async (req, res) => {
  const queryDestinationId = req.query.destination_id;
  const newBooking = new Book({
    user_id: req.params.user_id,
    destination_id: queryDestinationId,
    ...req.body,
  });

  try {
    const savedBooking = await newBooking.save();
    res.status(201).json({
      succes: true,
      message: `Booking Created`,
      result: savedBooking,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: `${error.message}.`,
    });
  }
};

// ? Update Booking Details
const updateBookingDetails = async (req, res) => {
  try {
    // ? check if booking status is already paid or not
    const { paid_status } = await Book.findById(req.params.booking_id);

    if (paid_status === "unpaid")
      throw new Error("Booking process is already finished");

    const updatedBooking = await Book.findByIdAndUpdate(
      bookingId,
      {
        $set: req.body,
      },
      { new: false }
    );

    res.status(201).json({
      succes: true,
      message: `Booking Updated`,
      result: updatedBooking,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: `${error.message}.`,
    });
  }
};

// ? Update Booking Paid Status
const updateBookingPaidStatus = async (req, res) => {
  try {
    const updatedBookingStatus = await Book.findByIdAndUpdate(
      req.params.booking_id,
      {
        $set: {
          paid_status: req.body,
        },
      },
      { new: false }
    );

    res.status(201).json({
      succes: true,
      message: `Booking Status Updated`,
      result: updatedBookingStatus,
    });
  } catch (error) {
    res.status(500).json(`Error Occurred : ${error}`);
  }
};

// ? Delete Booking
const deleteBooking = async (req, res) => {
  try {
    if (!req.query.booking_id)
      throw new Error("booking_id Query is Needed ... ");
    await Book.findByIdAndDelete(req.query.booking_id);
    res.status(200).json({
      succes: true,
      message: `Booking Deleted.`,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: `${error.message}.`,
    });
  }
};

// ? Get All Bookings
const getAllBooking = async (req, res) => {
  const queryStatus = req.query.status;
  const queryDestinationId = req.query.destination_id;
  const queryUserId = req.query.user_id;
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
    } else if (queryDestinationId) {
      bookings = await Book.find({
        destination_id: queryDestinationId,
      });
      if (bookings.length < 1)
        throw new Error(
          `Bookings on Destiantion ${queryDestinationId} Not Found.`
        );
    } else if (queryUserId) {
      bookings = await Book.find({
        user_id: queryUserId,
      });
      if (bookings.length < 1)
        throw new Error(`User With Id ${queryUserId} Has No Bookings.`);
    } else {
      bookings = await Book.find();
    }

    res.status(200).json({
      succes: true,
      result: bookings,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: `${error.message}.`,
    });
  }
};

const getAllUserBookings = async (req, res) => {
  let bookings;
  const queryStatus = req.query.status;

  try {
    if (queryStatus) {
      if (queryStatus === "unpaid") {
        bookings = await Book.find({
          user_id: req.params.user_id,
          paid_status: "unpaid",
        });
      } else {
        bookings = await Book.find({
          user_id: req.params.user_id,
          paid_status: "paid",
        });
      }
    } else {
      bookings = await Book.find({
        user_id: req.params.user_id,
      });
    }

    res.status(200).json({
      succes: true,
      result: bookings,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: `${error.message}.`,
    });
  }
};

// ? Get Single Bookings
const getSingleBooking = async (req, res) => {
  try {
    const bookings = await Book.findById(req.params.booking_id);
    if (!bookings)
      throw new Error(`Bookings Details on ${destinationId} Not Found.`);
    res.status(200).json({
      succes: true,
      result: bookings,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: `${error.message}.`,
    });
  }
};

module.exports = {
  createBooking,
  updateBookingDetails,
  updateBookingPaidStatus,
  deleteBooking,
  getAllBooking,
  getAllUserBookings,
  getSingleBooking,
};
