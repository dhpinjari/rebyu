const express = require("express");
const route = express.Router();
const customerModel = require("../models/customerRegModel");
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

route.get("/delete/:deleteCustomer", async (req, res) => {
  let customerRemove = await customerModel.findOneAndDelete({
    _id: req.params.deleteCustomer,
  });
  res.redirect("/customerList");
});
module.exports = route;
