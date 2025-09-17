const express = require("express");
const route = express.Router();
const customerModel = require("../models/customerRegModel");
const jwt = require("jsonwebtoken");

route.get("/", async (req, res) => {
  const token = req.cookies.token;
  const decoded = jwt.verify(token, "DxMdeA@Wa3FjKGXu");
  const adminUserID = decoded.customerID;
  let [currentAdmin, adminDisplay] = await Promise.all([
    customerModel.findById({ _id: adminUserID }),

    customerModel.find({ role: "admin" }),
  ]);

  res.render("adminList", { currentAdmin, adminDisplay });
});

route.get("/adminEdit/:editAdmin", async (req, res) => {
  let adminUpdate = await customerModel.findOne({
    _id: req.params.editAdmin,
  });
  res.render("adminEdit", { adminUpdate });
});

route.post("/adminEdit/:editAdmin", async (req, res) => {
  let { profileImage, firstName, lastName, email } = req.body;
  let adminUpdate = await customerModel.findOneAndUpdate(
    {
      _id: req.params.editAdmin,
    },
    { profileImage, firstName, lastName, email },
    { new: true }
  );
  res.redirect("/adminList");
});

route.get("/adminDelete/:deleteAdmin", async (req, res) => {
  let adminRemove = await customerModel.findOneAndDelete({
    _id: req.params.deleteAdmin,
  });
  res.redirect("/adminList");
});
module.exports = route;
