const express = require("express");
const route = express.Router();
const customerModel = require("../models/customerRegModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

route.get("/", (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    res.render("login");
  } else {
    res.redirect("/customerreviews");
  }
});

route.post("/", async (req, res) => {
  let { email, password } = req.body;
  let customer = await customerModel.findOne({ email });
  if (customer) {
    bcrypt.compare(password, customer.password, (err, result) => {
      if (result) {
        let token = jwt.sign(
          { email: email, customerID: customer._id, role: customer.role },
          "DxMdeA@Wa3FjKGXu"
        );
        res.cookie("token", token);
        if (customer.role === "admin" || customer.role === "superAdmin") {
          res.redirect("/customerlist");
        } else {
          res.redirect("/customerReviews");
        }
      } else {
        res.status(200).send("Password is incorrect");
      }
    });
  } else {
    res.send("email not found");
  }
});
module.exports = route;
