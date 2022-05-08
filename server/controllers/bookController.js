const Book = require("../models/Book");
const Destination = require("../models/Destination");

// ? Create Booking
const createBooking = async (req, res) => {
  // ? generate unique number for payment amount
  let uniqueId = Math.floor(Math.random() * 1000 + 1);
  // ? function to add hours
  const setDeadline = (hoursCount = 1, date = new Date()) => {
    date.setTime(date.getTime() + hoursCount * 60 * 60 * 1000);
    return date;
  };

  const queryDestinationId = req.query.destination_id;

  const newBooking = new Book({
    ...req.body,
    user_id: req.params.id,
    destination_id: queryDestinationId,
    payment_deadline: setDeadline().getTime(),
  });

  try {
    const { price_per_person } = await Destination.findById(
      req.query.destination_id
    );

    // ? calculate and generate payment amount
    newBooking.payment_amount = Number(
      String(price_per_person * newBooking.hiker_count).slice(0, -3) +
        String(uniqueId)
    );

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
    const { paid_status } = await Book.findById(req.params.id);

    if (paid_status === "paid") {
      res.status(202).json({
        succes: false,
        message: "Booking process is already finished",
      });
      return;
    }

    const updatedBooking = await Book.findByIdAndUpdate(
      bookingId,
      {
        $set: req.body,
      },
      { new: false }
    );

    res.status(201).json({
      succes: true,
      message: `Booking Details Updated`,
      result: updatedBooking,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: `${error.message}.`,
    });
  }
};

// ? upload proof of payment
const uploadProofOfPayment = async (req, res) => {
  const currentDate = new Date();
  try {
    const { payment_deadline } = await Book.findById(req.query.booking_id);
    if (currentDate.getTime() > payment_deadline) {
      res.status(202).json({
        succes: false,
        message: "Payment deadline overdue",
      });
      return;
    }

    const updatedBooking = await Book.findByIdAndUpdate(
      req.query.booking_id,
      {
        $set: {
          proof_of_payment: {
            bucket: res.s3_bucket,
            assets_key: res.image_keys[0],
          },
        },
      },
      { new: false }
    );

    res.status(201).json({
      succes: true,
      message: `Proof of payment, uploaded`,
      result: updatedBooking,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: `${error.message}.`,
    });
  }
};

// ? Update Booking Paid Status ( this route is used after checking the validity of the proof of payment )
const updateBookingPaidStatus = async (req, res) => {
  const { paid_status } = req.body;
  const currentDate = new Date();

  try {
    const { payment_deadline } = await Book.findById(req.params.id);

    if (currentDate.getTime() > payment_deadline) {
      res.status(202).json({
        succes: false,
        message: "Payment deadline overdue",
      });
      return;
    }
    const updatedBookingStatus = await Book.findByIdAndUpdate(
      req.params.id,
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
    res.status(500).json({
      succes: false,
      message: `${error.message}.`,
    });
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
          user_id: req.params.id,
          paid_status: "unpaid",
        });
      } else {
        bookings = await Book.find({
          user_id: req.params.id,
          paid_status: "paid",
        });
      }
    } else {
      bookings = await Book.find({
        user_id: req.params.id,
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
    const bookings = await Book.findById(req.params.id);
    if (!bookings)
      throw new Error(`Bookings Details on ${req.params.id} Not Found.`);
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
  uploadProofOfPayment,
  deleteBooking,
  getAllBooking,
  getAllUserBookings,
  getSingleBooking,
};
