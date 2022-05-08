const router = require("express").Router();
const {
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
} = require("../middlewares/verifyToken");
const {
  updateUser,
  updateUserPicture,
  deleteUser,
  getAllUser,
  getSingleUser,
  getUserStats,
} = require("../controllers/userController");
const { postImage, deleteImage } = require("../middlewares/S3Actions");

/**
 * ? for pagination needs to attach query page_size (limit) and page (currentPage)
 */

router.put("/:id", verifyTokenAndAuthorization, updateUser); // ? update user
router.put(
  "/profile_picture/:id",
  verifyTokenAndAuthorization,
  deleteImage,
  postImage,
  updateUserPicture
); // ? update user picures
router.delete("/:id", deleteImage, verifyTokenAndAdmin, deleteUser); // ? Delete User
router.get("/", verifyTokenAndAdmin, getAllUser); // ? Get All User
router.get("/:id", verifyTokenAndAdmin, getSingleUser); // ? Get Single User
router.get("/stats", verifyTokenAndAdmin, getUserStats); // ? Get User Stats

module.exports = router;
