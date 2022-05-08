const router = require("express").Router();
const { verifyTokenAndAuthorization } = require("../middlewares/verifyToken");
const {
  createReview,
  updateReview,
  deleteReview,
  getAllReviews,
  getSingleReview,
} = require("../controllers/reviewController");

/**
 * ? put and delete request needs to have a review_id query
 * ? for pagination needs to attach query page_size (limit) and page (currentPage)
 */

router.post("/:id", verifyTokenAndAuthorization, createReview); // ? Create Review
router.put("/:id", verifyTokenAndAuthorization, updateReview); // ? Update Review
router.delete("/:id", verifyTokenAndAuthorization, deleteReview); // ? Delete Review
router.get("/", getAllReviews); // ? Get All Reviews
router.get("/:id", getSingleReview); // ? Get Single Review

module.exports = router;
