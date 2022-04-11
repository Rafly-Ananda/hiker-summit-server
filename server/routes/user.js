const router = require("express").Router();
const {
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
} = require("../middlewares/verifyToken");
const {
  updateUser,
  deleteUser,
  getAllUser,
  getSingleUser,
  getUserStats,
} = require("../controllers/userController");

/**
 * TODO: if user deleted, if user is a guide delete him from guide also
 */

router.put("/:user_id", verifyTokenAndAuthorization, updateUser); // ? update user
router.delete("/:user_id", verifyTokenAndAdmin, deleteUser); // ? Delete User
router.get("/", verifyTokenAndAdmin, getAllUser); // ? Get All User
router.get("/:user_id", verifyTokenAndAdmin, getSingleUser); // ? Get Single User
router.get("/stats", verifyTokenAndAdmin, getUserStats); // ? Get User Stats

module.exports = router;
