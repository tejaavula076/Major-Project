const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js")

router
    .route("/signup")
    .get(userController.getSignup)
    .post(wrapAsync(userController.renderSignup))

router
    .route("/login")
    .get(userController.getLogin)
    .post(
        saveRedirectUrl,
        passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
        userController.renderlogin
    )


router.get("/logout", userController.getlogout)

module.exports = router;