const express = require("express");
const route = express.Router();
const reviewModel = require("../models/reviewmodel");
const customerModel = require("../models/customerRegModel");
const jwt = require("jsonwebtoken");

route.get("/", async (req, res) => {
  const token = req.cookies.token;
  const decoded = jwt.verify(token, "DxMdeA@Wa3FjKGXu");
  const adminUserID = decoded.customerID;

  const [currentAdmin, showAdminReviews] = await Promise.all([
    customerModel.findOne({ _id: adminUserID }),
    reviewModel.find().populate("customerID"),
  ]);
  res.render("adminReviews", { currentAdmin, showAdminReviews });
});

route.get("/adminEditReview/:reviewID", async (req, res) => {
  const adminReviewEdit = await reviewModel
    .findOne({
      _id: req.params.reviewID,
    })
    .populate("customerID");
  res.render("adminEditReview", { adminReviewEdit });
});

route.post("/adminEditReview/:reviewID", async (req, res) => {
  const { reviewTitle, reviewDesc, reviewImage } = req.body;
  const adminUpdateReview = await reviewModel.findOneAndUpdate(
    {
      _id: req.params.reviewID,
    },
    { reviewTitle, reviewDesc, reviewImage },
    { new: true }
  );
  res.redirect("/adminReviews");
});

route.get("/adminDeleteReview/:reviewID", async (req, res) => {
  const adminReviewDelete = await reviewModel
    .findOneAndDelete({
      _id: req.params.reviewID,
    })
    .populate("customerID");
  res.redirect("/adminReviews");
});

module.exports = route;
