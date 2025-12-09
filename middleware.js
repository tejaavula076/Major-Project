const Listing = require("./models/listing");
const Review = require("./models/reviews.js");
const { listingSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js")
const { reviewSchema } = require("./schema.js");
module.exports.isLoggedin = (req, res, next) => {
    console.log(req.user)
    if (!req.isAuthenticated()) {
        //redirect to correct url
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged into create listing")
        return res.redirect("/login")
    }
    next()
}
//this method will work for redirecting because passport used to start the session newly everytime it is created 
//so that is the reason u writeseparatelt
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next()
}

//check is owner of that route
module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id)
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`)
    }
    next()
}

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg)
    } else {
        next()
    }
}

module.exports.reviewListing = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body)
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg)
    } else {
        next()
    }
}
module.exports.isAuthor = async (req, res, next) => {
    let {id, reviewId } = req.params;
    let review = await Review.findById(reviewId)
    if (!review) {
        req.flash("error", "Review not found");
        return res.redirect("/listings");
    }

    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not theauthor of this review");
        return res.redirect(`/listings/${id}`)
    }
    next()
}