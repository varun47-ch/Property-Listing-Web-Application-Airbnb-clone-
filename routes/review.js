const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

// Add review
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// Delete one review
router.delete("/:reviewId",isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destoryReview));
module.exports = router;