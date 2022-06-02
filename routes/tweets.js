const express = require("express");
// const morgan = require("morgan");


const router = express.Router();


router.get("/", (req, res) => {
  res.json({
    message:"test tweets index"
  });
});





module.exports = router;
