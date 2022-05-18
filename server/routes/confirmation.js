const router = require("express").Router();
const {
  userEmailConfirmation,
  requestUserEmailConfirmation,
} = require("../controllers/confirmationController");

router.post("/:id", requestUserEmailConfirmation); //?  request for new verification
router.get("/:token", userEmailConfirmation);

module.exports = router;
