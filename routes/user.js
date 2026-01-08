const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");
const User = require("../models/users.js");

router
  .route("/signup")
  .get(userController.getSignup)
  .post(wrapAsync(userController.renderSignup));

router.route("/login").get(userController.getLogin);
// .post(
//     saveRedirectUrl,
//     passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
//     userController.renderlogin
// )
router.post(
  "/login",
  async (req, res, next) => {
    console.log("inpost route", req.body.username);
    console.log(User);
    const user = await User.findOne({ username: req.body.username });
    console.log("LOGIN user exists?", !!user, "username:", req.body.username);
    next();
  },
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.renderlogin
);

router.get("/logout", userController.getlogout);

module.exports = router;
