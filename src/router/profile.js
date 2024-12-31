const express = require("express");
const userAuth = require("../middlewares/auth");


var profileRouter = express.Router();

profileRouter.get("/profile", userAuth, (req, res, next) => {
    try {
      res.send(res.user);
    } catch (error) {
      res.send("Error : " + error.message);
    }
  });

  module.exports = profileRouter;
  