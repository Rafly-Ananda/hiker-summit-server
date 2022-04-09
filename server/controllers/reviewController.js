const Review = require("../models/Review");
const { MAX_REVIEW_LENGTH } = require("../configs/config");

// ? Create Review
const createReview = async (req, res) => {
  const userId = req.params.user_id;
  const destinationId = req.query.destination_id;

  const newReview = new Review({
    user_id: userId,
    destination_id: destinationId,
    ...req.body,
  });

  const userReview = await Review.find({
    user_id: userId,
  });

  try {
    if (!destinationId) throw new Error("destination_id Query is Needed ... ");

    if (userReview.length >= MAX_REVIEW_LENGTH)
      throw new Error("User Reviews Limit Reached.");
    const savedReview = await newReview.save();
    res.status(201).json({
      succes: true,
      message: `Review Created`,
      result: savedReview,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: `${error.message}.`,
    });
  }
};

// ? Update Review
const updateReview = async (req, res) => {
  const reviewId = req.query.review_id;

  try {
    if (!reviewId) throw new Error("review_id Query is Needed ... ");

    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      {
        $set: req.body,
      },
      {
        new: false,
        runValidators: true,
      }
    );

    res.status(201).json({
      succes: true,
      message: `Review Updated`,
      result: updatedReview,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: `${error.message}.`,
    });
  }
};

// ? Delete Review
const deleteReview = async (req, res) => {
  const reviewId = req.query.review_id;
  try {
    if (!reviewId) throw new Error("review_id Query is Needed ... ");
    await Review.findByIdAndDelete(reviewId);

    res.status(200).json({
      succes: true,
      message: `Review Deleted.`,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: `${error.message}.`,
    });
  }
};

// ? Get All Reviews
const getAllReviews = async (req, res) => {
  let reviews;
  const queryNewest = req.query.newest;
  const queryDestinationId = req.query.destination_id;
  const queryUserId = req.query.user_id;

  try {
    if (queryNewest) {
      reviews = await Review.find().sort({ createdAt: -1 });
    } else if (queryDestinationId) {
      reviews = await Review.find({
        destination_id: queryDestinationId,
      }).sort({ createdAt: -1 });
      if (reviews.length < 1) {
        res.status(200).json({
          succes: true,
          message: "Destination Has No Reviews ...",
        });
        return;
      }
    } else if (queryUserId) {
      reviews = await Review.find({
        user_id: queryUserId,
      }).sort({ createdAt: -1 });
      if (reviews.length < 1) {
        res.status(200).json({
          succes: true,
          message: "User Has Not Written Any Reviews ...",
        });
        return;
      }
    } else {
      reviews = await Review.find();
    }
    res.status(200).json({
      succes: true,
      result: reviews,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: `${error.message}.`,
    });
  }
};

// ? Get Single Review
const getSingleReview = async (req, res) => {
  const review_id = req.params.review_id;
  try {
    const review = await Review.findById(review_id);
    res.status(200).json({
      succes: true,
      result: review,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: `${error.message}.`,
    });
  }
};

module.exports = {
  createReview,
  updateReview,
  deleteReview,
  getAllReviews,
  getSingleReview,
};
