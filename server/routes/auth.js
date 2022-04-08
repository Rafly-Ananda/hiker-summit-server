const router = require("express").Router();
const { authRegister, authLogin } = require("../controllers/authController");

// TODO : Change the expiry date of the JWT

router.post("/register", authRegister); // ? Register
router.post("/login", authLogin); // ? Login

module.exports = router;
