const express = require("express");
// const morgan = require("morgan");

const router = express.Router();
router.use(express.json());






router.get("/", (req, res) => {
  res.json({
    message:"test root index"
  });
});





module.exports = router;
