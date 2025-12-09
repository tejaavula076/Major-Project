if (process.env.NODE_ENV != "production") {
    require('dotenv').config()
}

console.log(process.env.SECRET)

const express = require("express");
const ExpressError = require("./utils/ExpressError.js");
const path = require("path");
const app = express();
let port = 3031;
const ejsMate = require("ejs-mate")
app.engine('ejs', ejsMate);
app.listen(port, (req, res) => {
    console.log("App is listening to server")
})

const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy;
let User = require("./models/users.js");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const methodOverride = require("method-override");
app.use(methodOverride("_method"))

const Review = require("./models/reviews.js");
const mongoose = require("mongoose");
const dbUrl = process.env.ATLASDB_URL;
main().then((res) => { console.log("I am good at listening to db") }).catch((err) => { console.log("There is error in db") });
async function main() {
    await mongoose.connect(dbUrl)
}
const store = MongoStore.create({
    mongoUrl:dbUrl,
   crypto:{
    secret:process.env.SECRET
   },
   touchAfter:24*3600
})
store.on("error",()=>{
    console.log("Error in Mongo Session Store",err)
})
let sessionOptions = {
    store,
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}

app.use(session(sessionOptions));
app.use(flash())
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user
    next()
})

// app.get("/demouser", async (req, res) => {
//     let fakeuser = new User({ email: "abc@gmail.com", username: "delta student" });
//     let registeredUser = await User.register(fakeuser, "helloworld"); //the helloworld is password
//     console.log(registeredUser);
//     res.send(registeredUser)
// })
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter)


//root
// app.get("/", async (req, res) => {
//     res.send("I am root")
// })

// all your routes above this...

// 404 Middleware (for all unknown URLs)
app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

// Central Error Handler
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong";
    res.status(status).render("err.ejs", { err })
    // res.status(status).send(message);
});
