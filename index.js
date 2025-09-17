const express = require("express");
const app = express();
require("dotenv").config();
const db = require("./config/mongooseConnections");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const reviewSubmitRoute = require("./routes/reviewSubmitRoute");
const reviewsShowRoute = require("./routes/reviewsShowRoute");
const customerReviewsRoute = require("./routes/customerReviewsRoute");

const customerRegRoute = require("./routes/customerRegRoute");
const customerListRoute = require("./routes/customerListRoute");
const customerEditRoute = require("./routes/customerEditRoute");
const adminReviewsRoute = require("./routes/adminReviewRoute");
const adminRegRoute = require("./routes/adminRegRoute");
const adminListRoute = require("./routes/adminListRoute");
const adminSelfEditRoute = require("./routes/adminSelfEditRoute");

const loginRoute = require("./routes/loginRoute");
const logoutRoute = require("./routes/logoutRoute");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.redirect("/login");
});

// Customer links
app.use("/login", loginRoute);
app.use("/logout", logoutRoute);
app.use("/customerReg", customerRegRoute);
app.use("/reviewsubmit", reviewSubmitRoute);
app.use("/reviews", reviewsShowRoute);
app.use("/customerReviews", isLoggedIn, customerReviewsRoute);

// Admin Links
app.use("/customerList", isLoggedIn, isAdmin, customerListRoute);
app.use("/customerEdit", isLoggedIn, isAdmin, customerEditRoute);
app.use("/adminReviews", isLoggedIn, isAdmin, adminReviewsRoute);
app.use("/adminReg", isLoggedIn, isAdmin, adminRegRoute);
app.use("/adminList", isLoggedIn, isAdmin, adminListRoute);
app.use("/adminSelfEdit", isLoggedIn, isAdmin, adminSelfEditRoute);

function isLoggedIn(req, res, next) {
  if (req.cookies.token === "") {
    res.redirect("/login");
  } else {
    let data = jwt.verify(req.cookies.token, "DxMdeA@Wa3FjKGXu");
    req.user = data;
    next();
  }
}

function isAdmin(req, res, next) {
  if (
    (req.user && req.user.role === "admin") ||
    req.user.role === "superAdmin"
  ) {
    return next();
  }
  res.status(403).send("Access denied. Admins only.");
}
app.listen(process.env.PORT);
