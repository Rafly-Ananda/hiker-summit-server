const router = require("express").Router();
const {
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
} = require("../middlewares/verifyToken");
const {
  createTicket,
  getAllTicket,
  getSingleTicket,
  deleteTicket,
} = require("../controllers/ticketsController");

router.post("/user/:id", verifyTokenAndAuthorization, createTicket);
router.get("/", verifyTokenAndAdmin, getAllTicket);
router.get("/:ticket_id/user/:id", verifyTokenAndAdmin, getSingleTicket);
router.delete("/:ticket_id/users/:id", verifyTokenAndAdmin, deleteTicket);

module.exports = router;
