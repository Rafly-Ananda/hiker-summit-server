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
 * ? for pagination needs to attach query page_size (limit) and page (currentPage)
 */

router.post("/:id", verifyTokenAndAuthorization, registerGuide);
router.put("/:id", verifyTokenAndAuthorization, updateGuide);
router.put("/status/:id", verifyTokenAndAdmin, updateGuideStatus);
router.delete("/:id", verifyTokenAndAdmin, deleteGuide);
router.get("/", getAllGuide);
router.get("/:id", getSingleGuide);

module.exports = router;
