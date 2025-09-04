const express = require("express");
const route = express.Router();
const customerModel = require("../models/customerRegModel");
const bcrypt = require("bcrypt");

route.get("/", (req, res) => {
  res.render("adminReg");
});

route.post("/", async (req, res) => {
  let { profileImage, firstName, lastName, email, password } = req.body;
  let emailExist = await customerModel.findOne({ email });
  if (emailExist) {
    res.send("Email Exist");
  } else {
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, async (err, hash) => {
        let createAdmin = await customerModel.create({
          profileImage,
          firstName,
          lastName,
          email,
          password: hash,
          role: "admin",
        });

        res.redirect("/adminList");
      });
    });
  }
});
module.exports = route;
