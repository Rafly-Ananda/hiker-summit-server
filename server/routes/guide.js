const router = require("express").Router();
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middlewares/verifyToken");
const {
  registerGuide,
  updateGuide,
  updateGuideStatus,
  deleteGuide,
  getAllGuide,
  getSingleGuide,
} = require("../controllers/guideController");

/**
 * ? put request (update guide) needs to have a guide_id query
 */

router.post("/:user_id", verifyTokenAndAuthorization, registerGuide);
router.delete("/:guide_id", verifyTokenAndAdmin, deleteGuide);
router.put("/:user_id", verifyTokenAndAuthorization, updateGuide);
router.put("/status/:guide_id", verifyTokenAndAdmin, updateGuideStatus);
router.get("/", getAllGuide);
router.get("/:guide_id", getSingleGuide);

module.exports = router;
