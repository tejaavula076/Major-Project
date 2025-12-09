const express = require("express");
const router = express.Router();
const listingController = require("../controllers/listing.js")
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedin, isOwner, validateListing } = require("../middleware.js");
const multer = require('multer')
const { storage } = require("../cloudconfig.js")
const upload = multer({ storage })

router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedin, upload.single('listing[image]'), wrapAsync(listingController.addListing))


//new route
router.get("/new", isLoggedin, listingController.renderNewForm)

router
    .route("/title")
    .get(listingController.searchListing)


router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedin, isOwner, upload.single('listing[image]'), wrapAsync(listingController.updateListing))
    .delete(isLoggedin, isOwner, wrapAsync(listingController.deleteListing))




//edit route
router.get("/:id/edit", isLoggedin, wrapAsync(listingController.editListing))


module.exports = router;