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
          message:res.user.firstName+" "+status+ " "+toUserExist.firstName,
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

module.exports = requestRouter;
