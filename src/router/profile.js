const express = require("express");
const userAuth = require("../middlewares/auth");
const validator = require("../util/validation");
const { findByIdAndUpdate } = require("../model/model");
const User = require("../model/model");

var profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, (req, res, next) => {
  try {
    res.send(res.user);
  } catch (error) {
    res.send("Error : " + error.message);
  }
});

profileRouter.get("/profile/edit", userAuth, async (req, res, next) => {
  try {
    validator.validateProfileEditData(req.body);
   await User.findByIdAndUpdate(res.user?._id, req.body);
    
    //#region second method start
    // Object.keys(req.body).forEach((key)=>{
    //   res.user[key] = req.body[key]
    // }) 
    // await res.user.save(); 
    //#endregion second method update
    
     

    res.json({
      message:`${res.user.firstName} your profile is edited`,
      data:res.user
    })
  } catch (error) {
    res.send("Error : " + error.message);
  }
});

module.exports = profileRouter;
