const router = require("express").Router();

router.get("/", (req, res) => {
  res.json("this is order route");
});

module.exports = router;
