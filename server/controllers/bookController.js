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
  const { paid_status } = req.body;

  try {
    const updatedBookingStatus = await Book.findByIdAndUpdate(
      req.params.booking_id,
      {
        $set: {
          paid_status,
        },
      },
      { new: false, runValidators: true }
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
  const paginationOptions = {
    page: parseInt(req.query.page || 0),
  };
  const paginationQuery = new Object();

  req.query.page_size
    ? (paginationOptions.limit = +req.query.page_size)
    : (paginationOptions.pagination = false);
  req.query.user_id ? (paginationQuery.user_id = req.query.user_id) : "";
  req.query.status ? (paginationQuery.paid_status = req.query.status) : "";
  req.query.destination_id
    ? (paginationQuery.destination_id = req.query.destination_id)
    : "";
  req.query.user_id ? (paginationQuery.user_id = req.query.user_id) : "";
  req.query.newest ? (paginationOptions.sort = { createdAt: -1 }) : "";

  try {
    const result = await Book.paginate(paginationQuery, paginationOptions);

    res.status(200).json({
      succes: true,
      result,
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
