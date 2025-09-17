const express = require("express");
const route = express.Router();
const reviewModel = require("../models/reviewmodel");
const customerModel = require("../models/customerRegModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

route.get("/", async (req, res) => {
  // Get token from cookies
  const token = req.cookies.token;

  // Verify and decode token
  const decoded = jwt.verify(token, "DxMdeA@Wa3FjKGXu");
  const customerID = decoded.customerID;

  // let showCustomerReviews = await reviewModel.find({
  //   customerID: customerID,
  // });
  // let customerDetails = await customerModel.findOne({
  //   _id: customerID,
  // });

  // Fetch both collections in parallel (faster)
  const [showCustomerReviews, customerDetails] = await Promise.all([
    reviewModel.find({ customerID }),
    customerModel.findById(customerID),
  ]);
  res.render("customerReviews", { showCustomerReviews, customerDetails });
});

// Name udpate
route.get("/customerEditbyCustomer", async (req, res) => {
  // Get token from cookies
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).send("Unauthorized: No token provided");
  }
  // Verify and decode token
  const decoded = jwt.verify(token, "DxMdeA@Wa3FjKGXu");
  const customerID = decoded.customerID;

  let customerSelfUpdate = await customerModel.findOne({ _id: customerID });
  if (customerSelfUpdate.role == "customer") {
    res.render("customerEditbyCustomer", { customerSelfUpdate });
  } else {
    res.send("This route is for customers to update details");
  }
});

route.post("/customerEditbyCustomer/:customerSelfUpdate", async (req, res) => {
  let { profileImage, firstName, lastName } = req.body;
  let udpateCustomerSelf = await customerModel.findOneAndUpdate(
    { _id: req.params.customerSelfUpdate },
    { profileImage, firstName, lastName },
    { new: true }
  );
  res.redirect("/customerReviews");
});

// Password Reset
route.get("/customerSelfPasswordReset", async (req, res) => {
  // Get token from cookies
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).send("Unauthorized: No token provided");
  }
  // Verify and decode token
  const decoded = jwt.verify(token, "DxMdeA@Wa3FjKGXu");
  const customerID = decoded.customerID;

  let customerSelfPasswordUpdate = await customerModel.findOne({
    _id: customerID,
  });
  if (customerSelfPasswordUpdate.role == "customer") {
    res.render("customerSelfPasswordReset", { customerSelfPasswordUpdate });
  } else {
    res.send("This route is for customers to reset their passwords");
  }
});

route.post(
  "/customerSelfPasswordReset/:customerSelfPasswordUpdate",
  async (req, res) => {
    let { oldPassword, newPassword, confirmPassword } = req.body;
    if (confirmPassword === newPassword) {
      const customerStoredPassword = await customerModel.findOne({
        _id: req.params.customerSelfPasswordUpdate,
      });
      bcrypt.compare(
        oldPassword,
        customerStoredPassword.password,
        (err, result) => {
          if (result) {
            bcrypt.genSalt(10, function (err, salt) {
              bcrypt.hash(newPassword, salt, async (err, hash) => {
                const updateCustomerPassword =
                  await customerModel.findOneAndUpdate(
                    { _id: req.params.customerSelfPasswordUpdate },
                    { password: hash },
                    { new: true }
                  );
                res.redirect("/customerreviews");
              });
            });
          } else {
            res.send("Existing Password Does Not Match");
          }
        }
      );
    } else {
      res.send("Make sure you have enterd same password");
    }
  }
);

// Edit review
route.get("/customerSelfReviewEdit/:customerSelfEditID", async (req, res) => {
  let customerSelfReviewEdit = await reviewModel.findOne({
    _id: req.params.customerSelfEditID,
  });
  res.render("customerSelfReviewEdit", { customerSelfReviewEdit });
});

route.post("/customerSelfReviewEdit/:customerSelfEditID", async (req, res) => {
  let { reviewRating, reviewTitle, reviewDesc, reviewImage } = req.body;
  let customerSelfReviewEdit = await reviewModel.findOneAndUpdate(
    {
      _id: req.params.customerSelfEditID,
    },
    { reviewRating, reviewTitle, reviewDesc, reviewImage },
    { new: true }
  );
  res.redirect("/customerreviews");
});

// Delete review
route.get(
  "/customerSelfReviewDelete/:customerSelfDeleteID",
  async (req, res) => {
    let customerSelfReviewDelete = await reviewModel.findOneAndDelete({
      _id: req.params.customerSelfDeleteID,
    });
    res.redirect("/customerReviews");
  }
);

module.exports = route;
