const express = require("express");
const route = express.Router();
const customerModel = require("../models/customerRegModel");
const reviewModel = require("../models/reviewmodel");
const jwt = require("jsonwebtoken");

route.get("/", async (req, res) => {
  const token = req.cookies.token;
  const decoded = jwt.verify(token, "DxMdeA@Wa3FjKGXu");
  const adminUserID = decoded.customerID;
  let [adminDisplay, customerDisplay] = await Promise.all([
    customerModel.findById({ _id: adminUserID }),
    customerModel.find({ role: "customer" }),
  ]);

  res.render("customerList", { adminDisplay, customerDisplay });
});

// Regular way
// route.get("/delete/:deleteCustomer", async (req, res) => {
//   let firstDeleteReviews = await reviewModel.deleteMany({
//     customerID: req.params.deleteCustomer,
//   });
//   let customerRemove = await customerModel.findOneAndDelete({
//     _id: req.params.deleteCustomer,
//   });
//   res.redirect("/customerList");
// });

route.get("/delete/:deleteCustomer", async (req, res) => {
  let firstDeleteReviews = reviewModel.deleteMany({
    customerID: req.params.deleteCustomer,
  });
  let customerRemove = customerModel.findOneAndDelete({
    _id: req.params.deleteCustomer,
  });

  await Promise.all([firstDeleteReviews, customerRemove]);
  req.flash("success", "Customer and reviews were deleted successfully.");

  res.redirect("/customerList");
});
module.exports = route;
