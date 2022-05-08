const Review = require("../models/Review");
const { MAX_REVIEW_LENGTH } = require("../configs/config");

// ? Create Review
const createReview = async (req, res) => {
  const destinationId = req.query.destination_id;

  const newReview = new Review({
    user_id: req.params.id,
    destination_id: destinationId,
    ...req.body,
  });

  const userReview = await Review.find({
    user_id: req.params.id,
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
  const paginationOptions = {
    page: parseInt(req.query.page || 0),
  };
  const paginationQuery = new Object();

  req.query.page_size
    ? (paginationOptions.limit = +req.query.page_size)
    : (paginationOptions.pagination = false);
  req.query.destination_id
    ? (paginationQuery.destination_id = req.query.destination_id)
    : "";
  req.query.newest ? (paginationOptions.sort = { createdAt: -1 }) : "";
  req.query.user_id ? (paginationQuery.user_id = req.query.user_id) : "";

  try {
    const result = await Review.paginate(paginationQuery, paginationOptions);
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

// ? Get Single Review
const getSingleReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
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
