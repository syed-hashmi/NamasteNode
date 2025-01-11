const mongoose = require("mongoose");

const connRequestModel = new mongoose.Schema(
  {
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      required:true,
    },
    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      required:true

    },
    status: {
      type: String,
      required:true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `${"VALUE"} is incorrect`,
      },
    },
  },
  {
    timestamps: true,
  }
);

//ConnectionRequest.find({fromUser:"2dkhf47ryhiwedkjs", toUser:"ajdshf4973349sdkjhsk"}); //if we are ginding in db with 2 parameters 
//we need to use compound index to make our query optimised

connRequestModel.index({fromUser : 1, toUser : 1});

connRequestModel.pre("save",function(next){
const connectionRequest = this;
// check if fromuserid is to userID start
if(connectionRequest.fromUser.equals(connectionRequest.toUser))
{
  throw new Error("Cannot send connection request to yourself");
}
next();
// check if fromuserid is to userID end 

});

const connReqModel = new mongoose.model("connectRequest",connRequestModel);
module.exports = connReqModel;
