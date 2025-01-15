const express = require("express");
const userAuth = require("../middlewares/auth");
const ConnectionRequest = require("../model/connectionRequest");
const User = require("../model/model");

var requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res, next) => {
    try {
      const fromUser = res.user?._id?.toString();
      const toUser = req.params.toUserId;
      const status = req.params?.status;

      //#region written in pre
      //connection request to same user start
      // if (fromUser == toUser) {
      //   return res.status(400).json({ message: "cant send req to self" });
      // }
      //connection request to same user end
      //#endregion

      //check if person is there or not in database to which we are sending connection request start
      if (!(await User.findById(toUser))) {
        return res.status(400).json({ message: "user not found" });
      }
      //check if person is there or not in database to which we are sending connection request end

      const allowedStatus = ["ignored", "interested"];

      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "invalid status type " + status });
      }

      const toUserExist = await User.findById(toUser);

      if (!toUserExist) {
        return res.status(400).json({ message: "user not present" });
      }

      //if there is an existing connection request

      const existingConnRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUser, toUser },
          { fromUser: toUser, toUser: fromUser },
        ],
      });

      if (existingConnRequest) {
        return res
          .status(400)
          .json({ message: "connection req already exist" });
      }

      const connectionRequest = new ConnectionRequest({
        fromUser,
        toUser,
        status,
      });
      const data = await connectionRequest.save();
      if (status?.toLowerCase() == "ignored")
        res.send({
          message:
            res.user.firstName + " " + status + " " + toUserExist.firstName,
          data,
        });
      else
        res.send({
          message:
            res.user.firstName +
            " is " +
            status +
            " in " +
            toUserExist.firstName,
          data,
        });
    } catch (error) {
      res.status(400).send("error: " + error.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res, next) => {
    try {
      const loggedInUser = res.user;
      const {requestId,status} = req.params;

      // only accepted and rejected is allowed in status (status =["accepted"] or status = ["rejected"])
      const allowedStatus = ["accepted", "rejected"];

      if (!allowedStatus.includes(status)) {
        res.status(400).json({ message: "status is not allowed" });
      }

      //akshay => Elon
      //is elon logged in user  (logged in user should be toUser)

     const connecReq = await ConnectionRequest.findOne({_id:requestId,
        toUser : loggedInUser?._id,
        status: "interested"
      }) 
      //if the request is interested then only user can review request (status is interested)
      //req id should be presend in the database
      if(!connecReq){
        return res.status(400).json({message:"connection request not found"})
      }

      connecReq.status = status;
      connecReq.save();
      res.json({message:"request" + status})


    } catch (error) {
      console.log("Error" + error);
    }
  }
);

module.exports = requestRouter;
