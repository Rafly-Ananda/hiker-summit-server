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

router.post("/:user_id", verifyTokenAndAuthorization, createReview); // ? Create Review
router.put("/:user_id", verifyTokenAndAuthorization, updateReview); // ? Update Review
router.delete("/:user_id", verifyTokenAndAuthorization, deleteReview); // ? Delete Review
router.get("/", getAllReviews); // ? Get All Reviews
router.get("/:review_id", getSingleReview); // ? Get Single Review

module.exports = router;
