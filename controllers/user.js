const User = require("../models/users.js");
//get signup
module.exports.getSignup = (req, res) => {
    res.render("./users/signup.ejs")
}
//post signup

module.exports.renderSignup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) { console.log(err) }
            req.flash("success", "Welcome to Wanderlust");
            return res.render("./users/login.ejs")
        })

    } catch (e) {
        console.log(e)
        req.flash("error", e.message);
        res.redirect("/signup")
    }
}

//get login 

module.exports.getLogin = (req, res) => {
    res.render("./users/login.ejs")
}
//postlogin 
module.exports.renderlogin = async (req, res) => {
    console.log("in controller",res.locals.redirectUrl )
    req.flash("success", "Welcome back!");
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
}
//logout
module.exports.getlogout = (req, res, next) => {
    req.logout((err) => {
        if (err) { next(err) }
        req.flash("success", "you have successfully logged out");
        res.redirect("/listings")
    })
}