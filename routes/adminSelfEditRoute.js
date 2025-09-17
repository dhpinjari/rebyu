const express = require("express");
const route = express.Router();
const customerModel = require("../models/customerRegModel");
const bcrypt = require("bcrypt");

route.get("/:adminId", async (req, res) => {
  let adminDetails = await customerModel.findOne({ _id: req.params.adminId });
  res.render("adminSelfEdit", { adminDetails });
});

route.post("/:adminId", async (req, res) => {
  let { profileImage, firstName, lastName, email } = req.body;
  let updateAdminDetails = await customerModel.findOneAndUpdate(
    { _id: req.params.adminId },
    { profileImage, firstName, lastName, email },
    { new: true }
  );
  res.redirect("/adminList");
});

route.get("/adminSelfPasswordReset/:adminId", async (req, res) => {
  let adminDetails = await customerModel.findOne({ _id: req.params.adminId });
  res.render("adminSelfPasswordReset", { adminDetails });
});
route.post("/adminSelfPasswordReset/:adminId", async (req, res) => {
  let { oldPassword, newPassword, confirmPassword } = req.body;
  if (confirmPassword === newPassword) {
    const adminDetails = await customerModel.findOne({
      _id: req.params.adminId,
    });
    bcrypt.compare(oldPassword, adminDetails.password, (err, result) => {
      if (result) {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newPassword, salt, async (err, hash) => {
            let updateAdminPassword = await customerModel.findOneAndUpdate(
              { _id: req.params.adminId },
              {
                password: hash,
              },
              { new: true }
            );
            res.redirect("/adminList");
          });
        });
      } else {
        res.send("Existing Password Does Not Match");
      }
    });
  } else {
    res.send("Make sure you have enterd same password");
  }
});

module.exports = route;
