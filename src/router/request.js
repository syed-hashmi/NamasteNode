const express = require("express");
const userAuth = require("../middlewares/auth");
const User = require("../model");


var requestRouter = express.Router();

requestRouter.get("/sendConnectionRequest", userAuth, async (req, res, next) => {
  try {
    const email = req.body;

    let searchedData = await User.findOne(email);
    if (searchedData.length == 0) {
      res.status(404).send("user not found");
    }
    res.status(200).send("searched Data" + searchedData);
  } catch (error) {
    res.status(404).send("error searching user : " + error.message);
  }
});

module.exports = requestRouter;