const express = require("express");
const User = require("../model/model");
const bcrypt = require("bcrypt");
const validatorSignUp = require("../util/validation");

var authRouter = express.Router();

authRouter.post("/signUp", async (req, res, next) => {
  try {
    validatorSignUp.validatorSignUp(req.body);

    var passwordHash = await bcrypt.hash(req.body.password, 10);

    const { firstName, lastName, email, age, gender, skills } = req.body;

    const documentToINsert = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      age,
      gender,
      skills,
    });

    await documentToINsert.save();

    res.status(200).send("data inserted successfully");
  } catch (error) {
    res.status(404).send(error.message);
  }
});

authRouter.post("/login", async (req, res, next) => {
  //afterlogin is successfull create token
  try {
    const { email, password } = req.body;

    const searchedData = await User.findOne({ email: email });

    if (searchedData) {
      const isvalidPassword = await bcrypt.compare(
        password,
        searchedData.password
      );

      if (isvalidPassword) {
        const token = await searchedData.getJwt();

        res.cookie("token", token);
        res.send("User Login SuccessFul");
      } else throw Error("password not valid");
    } else {
      throw Error("email id not presend in db");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

authRouter.post("/logout",  (req, res, next)=> {
  //logout is successfull create token
  try {
    res.cookie("token",null,{expires:new Date(Date.now())}).send("logout successfully");

  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = authRouter;
