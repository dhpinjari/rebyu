const express = require("express");
const route = express.Router();
const reviewModel = require("../models/reviewmodel");
const jwt = require("jsonwebtoken");

route.get("/", (req, res) => {
  res.render("reviewSubmit");
});
route.post("/", async (req, res) => {
  // Get token from cookies
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).send("Unauthorized: No token provided");
  }
  // Verify and decode token
  const decoded = jwt.verify(token, "DxMdeA@Wa3FjKGXu");
  const customerID = decoded.customerID;

  let { reviewRating, reviewTitle, reviewDesc, reviewImage } = req.body;
  const submitReview = await reviewModel.create({
    reviewRating,
    reviewImage,
    reviewTitle,
    reviewDesc,
    customerID,
  });
  res.redirect("/reviews");
});

module.exports = route;
