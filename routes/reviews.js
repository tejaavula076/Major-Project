const express = require("express");
const wrapAsync = require("../utils/wrapAsync");

const router = express.Router({ mergeParams: true });

const { reviewListing, isLoggedin, isAuthor } = require("../middleware.js")
const reviewController = require("../controllers/review.js")
//Review
// post review
router.post("/", isLoggedin, reviewListing, wrapAsync(reviewController.postReview))

//delete review
router.delete("/:reviewId", isAuthor, wrapAsync(reviewController.deleteReview))

module.exports = router;