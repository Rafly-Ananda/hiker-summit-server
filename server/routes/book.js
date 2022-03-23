const router = require("express").Router();

router.get("/", (req, res) => {
  res.json("book route");
});

module.exports = router;
