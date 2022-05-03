const router = require("express").Router();
const {
  authRegister,
  authLogin,
  authLogout,
  authToken,
} = require("../controllers/authController");
const { verifyRefreshToken } = require("../middlewares/verifyToken");
const { postImage } = require("../middlewares/S3Actions");

router.post("/register", postImage, authRegister); // ? Register
router.post("/login", authLogin); // ? Login
router.post("/logout", authLogout); // ? Logout
router.post("/token", verifyRefreshToken, authToken); // ? Token Handler

module.exports = router;
