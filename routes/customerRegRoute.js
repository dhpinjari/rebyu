const express = require("express");
const route = express.Router();
const customerModel = require("../models/customerRegModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

route.get("/", (req, res) => {
  res.render("customerReg");
});

route.post("/", async (req, res) => {
  let { profileImage, firstName, lastName, email, password } = req.body;
  let emailExist = await customerModel.findOne({ email });
  if (emailExist) {
    res.send("Email Exist");
  } else {
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, async (err, hash) => {
        let createCustomer = await customerModel.create({
          profileImage,
          firstName,
          lastName,
          email,
          password: hash,
        });
        let token = jwt.sign(
          { email, customerID: createCustomer._id },
          "DxMdeA@Wa3FjKGXu"
        );
        // res.cookie("token", token);
        res.redirect("/login");
      });
    });
  }
});

module.exports = route;
