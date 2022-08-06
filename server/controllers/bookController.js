const Book = require("../models/Book");
const Destination = require("../models/Destination");
const Guide = require("../models/Guide");
const User = require("../models/User");
const {
  sendPaymentConfirmationEmail,
  sendBookingPaidEmailUser,
  sendBookingPaidEmailGuide,
} = require("../helpers/nodemailer");

// ? Create Booking
const createBooking = async (req, res) => {
  // ? generate unique number for payment amount
  let uniqueId = Math.floor(Math.random() * 1000 + 1);
  // ? function to add hours
  const setDeadline = (hoursCount = 1, date = new Date()) => {
    date.setTime(date.getTime() + hoursCount * 60 * 60 * 1000); // 24 hrs
    return date;
  };

  const queryDestinationId = req.params.destination_id;

  const newBooking = new Book({
    ...req.body,
    user_id: req.params.id,
    destination_id: queryDestinationId,
    payment_deadline: setDeadline().getTime(),
  });

  try {
    const user = await User.findById(req.params.id);

    if (!user.verified) throw new Error("Your account is not verified");

    const { price_per_day } = await Destination.findById(
      req.params.destination_id
    );

    // ? calculate and generate payment amount
    newBooking.payment_amount = Number(
      String(price_per_day * newBooking.hiker_count).slice(0, -3) +
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
    const { paid_status, guide_id } = await Book.findById(
      req.params.booking_id
    );

    if (paid_status === "paid") {
      res.status(202).json({
        succes: false,
        message: "Booking process is already finished",
      });
      return;
    }

    if (guide_id.length > 0) {
      res.status(202).json({
        succes: false,
        message: "Guide already accepted, cannot be changed",
      });
      return;
    }

    const updatedBooking = await Book.findByIdAndUpdate(
      req.params.booking_id,
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
      await Book.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            paid_status: "unpaid",
            booking_status: "declined",
          },
        },
        { new: false, runValidators: true }
      );

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

// ? Update Booking Paid Status ( this route is used after checking the validity of the proof of payment, Done by admin via dashboard admin )
const updateBookingPaidStatus = async (req, res) => {
  const { paid_status, booking_status } = req.body;
  const currentDate = new Date();

  try {
    const booking = await Book.findById(req.params.id);

    if (booking.guide_id.length < 1) {
      throw new Error("Guide for this booking, not found");
    }

    const [user, guide] = await Promise.allSettled([
      User.findById(booking.user_id),
      Guide.findById(booking.guide_id),
    ]);

    const userGuide = await User.findById(guide.value.user_id);

    // if (currentDate.getTime() > booking.payment_deadline) {
    //   res.status(202).json({
    //     succes: false,
    //     message: "Payment deadline overdue",
    //   });
    //   return;
    // }

    const updatedBookingStatus = await Book.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          paid_status,
          booking_status,
        },
      },
      { new: false, runValidators: true }
    );

    // TODO: send the booking details also in the image to the user and guide
    sendBookingPaidEmailUser(user.value, userGuide, booking);
    sendBookingPaidEmailGuide(user.value, userGuide, booking);

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

const cancelBooking = async (req, res) => {
  try {
    const updatedBookingStatus = await Book.findByIdAndUpdate(
      req.params.booking_id,
      {
        $set: {
          booking_status: "canceled",
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

const guideAccept = async (req, res) => {
  const currentDate = new Date();
  const { payment_deadline } = await Book.findById(req.params.booking_id);
  if (currentDate.getTime() > payment_deadline) {
    await Book.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          paid_status: "unpaid",
          booking_status: "declined",
        },
      },
      { new: false, runValidators: true }
    );

    res.status(202).json({
      succes: false,
      message: "Payment deadline overdue",
    });
    return;
  }

  // TODO: update the guide ongoing transaction to this
  try {
    const [userGuide, booking] = await Promise.allSettled([
      Guide.find({ user_id: req.params.id }),
      Book.findById(req.params.booking_id),
    ]);

    const userThatBook = await User.findById(booking.value.user_id);

    if (userGuide.value.length < 1) throw new Error("No guide found");
    if (booking.value.guide_id.length)
      throw new Error("Book is not valid to be accepted");

    await Book.findByIdAndUpdate(
      req.params.booking_id,
      {
        $set: {
          guide_id: userGuide.value[0]._id,
        },
      },
      { new: false }
    );

    sendPaymentConfirmationEmail(userThatBook, booking.value.payment_amount);
    res.status(201).json({
      succes: true,
      message: `Guide Accepted`,
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
  cancelBooking,
  uploadProofOfPayment,
  guideAccept,
  deleteBooking,
  getAllBooking,
  getAllUserBookings,
  getSingleBooking,
};
