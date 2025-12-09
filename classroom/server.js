const express = require("express");
const app = express();
const path = require("path")
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"))
const user = require("./routes/user.js");
const post = require("./routes/posts.js");
const cookieParser = require("cookie-parser")


app.use(cookieParser("mysecret"))
const session = require("express-session");
let sessionOptions = {
    secret: "mysecret",
    resave: false,
    saveUninitialized: true
}

const flash = require("connect-flash");

app.use(session(sessionOptions));
app.use(flash())
app.use((req, res, next) => {
    req.locals.success = req.flash("success");
    req.locals.failure = req.flash("failure");
    next();
})
app.get("/register", (req, res) => {
    let { name = "anonymois" } = req.query;
    req.session.name = name;

    if (name === "anonymois") {
        req.flash("failure", "failed user registeration succefully")
    } else {
        req.flash("success", "user registered succefully")
    }
    res.redirect("/hello")
})
app.get("/hello", (req, res) => {
    res.render("page.ejs",
        { name: req.session.name, message: req.flash("success") }
    )
    // res.send(`hello ${ req.session.name }`)
})

app.listen(3033, (req, res) => {

    console.log("I am listening to 3033")
})
