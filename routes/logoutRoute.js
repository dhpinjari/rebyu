const express = require("express");
const route = express.Router();

route.get("/", (req, res) => {
  res.cookie("token", "");
  res.redirect("/login");
});

module.exports = route;
