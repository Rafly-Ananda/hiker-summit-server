const router = require("express").Router();
const Review = require("../models/Review");
const { verifyTokenAndAuthorization } = require("../middlewares/verifyToken");
const { MAX_REVIEW_LENGTH } = require("../config");

// TODO : this is still using server side validation for max rating, try to use mongodb validation
// ? Create Review
router.post(
  "/:user_id/:destination_id",
  verifyTokenAndAuthorization,
  async (req, res) => {
    const userId = req.params.user_id;
    const destinationId = req.params.destination_id;

    const newReview = new Review({
      user_id: userId,
      destination_id: destinationId,
      ...req.body,
    });

    const userReview = await Review.find({
      user_id: userId,
    });

    try {
      // TODO : Fix max review logic
      if (userReview.length >= MAX_REVIEW_LENGTH)
        throw new Error("Reviews Limit Reached.");

      if (newReview.rating < 1 || newReview.rating > 5) {
        throw new Error(`Rating Value is Out of Range, ( Min = 1 | Max = 5 )`);
      } else {
        const savedReview = await newReview.save();
        res.status(200).json(`Review Added : ${savedReview}`);
      }
    } catch (error) {
      res.status(500).json(`Error Occurred : ${error.message}.`);
    }
  }
);

// TODO : this is still using server side validation for max rating, try to use mongodb validation
// ? Update Review
router.put(
  "/:user_id/:review_id",
  verifyTokenAndAuthorization,
  async (req, res) => {
    const reviewId = req.params.review_id;
    const ratingValue = req.body.rating;
    try {
      if (ratingValue < 1 || ratingValue > 5) {
        throw new Error(`Rating Value is Out of Range, ( Min = 1 | Max = 5 )`);
      } else {
        const updatedReview = await Review.findByIdAndUpdate(
          reviewId,
          {
            $set: req.body,
          },
          {
            new: true,
          }
        );
        res.status(200).json(`Review Updated. Details : ${updatedReview}`);
      }
    } catch (error) {
      res.status(500).json(`Error Occurred : ${error.message}.`);
    }
  }
);

// ? Delete Review
router.delete(
  "/:user_id/:review_id",
  verifyTokenAndAuthorization,
  async (req, res) => {
    const reviewId = req.params.review_id;
    try {
      const response = await Review.findByIdAndDelete(reviewId);
      if (!response) {
        throw new Error("Review Not Found.");
      } else {
        res.status(200).json("Review Deleted.");
      }
    } catch (error) {
      res.status(500).json(`Error Occurred : ${error.message}.`);
    }
  }
);

// ? Get All Reviews
router.get("/", async (req, res) => {
  let reviews;
  const queryNewest = req.query.newest;

  try {
    if (queryNewest) {
      reviews = await Review.find().sort({ createdAt: -1 });
    } else {
      reviews = await Review.find();
    }
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json(`Error Occurred : ${error.message}.`);
  }
});

// ? Get Single Review
router.get("/find/:review_id", async (req, res) => {
  const review_id = req.params.review_id;
  try {
    const review = await Review.findById(review_id);
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json(`Error Occurred : ${error.message}`);
  }
});

// ? Get All Reviews Based on Destination
router.get("/find/destination/:destination_id", async (req, res) => {
  let reviews;
  const queryNewest = req.query.newest;

  try {
    if (queryNewest) {
      reviews = await Review.find({
        destination_id: req.params.destination_id,
      }).sort({ createdAt: -1 });
    } else {
      reviews = await Review.find({
        destination_id: req.params.destination_id,
      });
    }

    if (reviews.length < 1) {
      res.status(404).json("No Reviews Found For This Destination.");
    } else {
      res.status(200).json(reviews);
    }
  } catch (error) {
    res.status(500).json(`Error Occurred : ${error.message}.`);
  }
});

// ? Get All Review Based on User
router.get("/find/user/:user_id", async (req, res) => {
  let reviews;
  const queryNewest = req.query.newest;
  try {
    if (queryNewest) {
      reviews = await Review.find({
        user_id: req.params.user_id,
      }).sort({ createdAt: -1 });
    } else {
      reviews = await Review.find({
        user_id: req.params.user_id,
      });
    }

    if (reviews.length < 1) {
      res.status(404).json("The User Has Not Written Any Reviews.");
    } else {
      res.status(200).json(reviews);
    }
  } catch (error) {
    res.status(500).json(`Error Occurred : ${error.message}.`);
  }
});

module.exports = router;
