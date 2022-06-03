const express = require("express");
// const morgan = require("morgan");
const db = require("../db/models");
const { Tweet } = db;
const router = express.Router();

const { check, validationResult } = require('express-validator');

const asyncHandler = (handler) => (req, res, next) => handler(req, res, next).catch(next);
const tweetNotFoundError = (id) => {
  const err = Error(`Tweet with id of ${id} could not be found`);
  err.title = "Tweet not found.";
  err.status = 404;
  return err;
}

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const tweets = await Tweet.findAll();
    res.json({tweets})

  })
);

router.get(
  "/:id(\\d+)",
  asyncHandler(async (req, res, next) => {
    const tweetId = parseInt(req.params.id, 10)
    const tweet = await Tweet.findByPk(tweetId)

    if(tweet) {
      res.json({tweet})
    } else {
      next(tweetNotFoundError(tweetId));
    }
  })
)



// tweet validation: you're great, tweets!
const validateTweets = [
  check("message")
  .exists({checkFalsy: true})
  .withMessage("Message Can't Be Empty"),
  check("message")
  .isLength({max: 280})
  .withMessage("Tweet can't be longer than 280 characters")
]




//validation middleware
const handleValidationErrors = (req, res, next) => {
  const validationErrors = validationResult(req);
  //ToDo

  if (!validationErrors.isEmpty()) {  //if it's not empty
    const errorMessages = validationErrors.array().map((error) => error.msg);  //creates array of all the error messages

      const errorObject = Error('Bad Request.');
      errorObject.errors = errorMessages
      errorObject.status = 400
      errorObject.title = "Bad Request."
      return next(errorObject)
  }
  next()
}


router.post("/tweets", validateTweets, handleValidationErrors, asyncHandler(async(req, res) => {        // create a new tweet
  const { tweet } = req.body;
  const newTweet = await Tweet.create({ tweet });
  res.status(201).json({ newTweet })
})
);



module.exports = router;
