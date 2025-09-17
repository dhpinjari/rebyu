const express = require("express");
const route = express.Router();
const reviewModel = require("../models/reviewmodel");
const jwt = require("jsonwebtoken");

route.get("/", async (req, res) => {
  const token = req.cookies.token;
  let reviewsShow = await reviewModel.find().populate("customerID"); //populate to put customerModel data in reviewshow
  res.render("reviews", { reviewsShow, token });
});

module.exports = route;
