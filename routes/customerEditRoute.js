const express = require("express");
const route = express.Router();
const customerModel = require("../models/customerRegModel");

route.get("/:customerEdit", async (req, res) => {
  let customerUpdate = await customerModel.findOne({
    _id: req.params.customerEdit,
  });
  res.render("customerEdit", { customerUpdate });
});

route.post("/:customerEdit", async (req, res) => {
  let { profileImage, firstName, lastName, email } = req.body;
  let customerUpdate = await customerModel.findOneAndUpdate(
    { _id: req.params.customerEdit },
    { profileImage, firstName, lastName, email },
    { new: true }
  );
  res.redirect("/customerList");
});
module.exports = route;
