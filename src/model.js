const mongoose = require("mongoose");
const { type } = require("os");

const devTinderUser = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    min:18
  },
  gender: {
    type: String,
    validate:(value)=>{
      if(!["male","female","others"].includes(value)){   //this will not run in the update patch and put api as per documentation we have to give options runValidators:true
        throw Error("gender data is not valid")
      }
    }
  },
  photoUrl: {
    type: String,
    default:
      "https://www.shutterstock.com/image-vector/vector-design-avatar-dummy-sign-collection-1290556063https://www.pnrao.com/wp-content/uploads/2023/06/dummy-user-male.jpg",
  },
  about: {
    type: String,
    default: "this is dummy default about description",
  },
  skills: {
    type: [String],
  },
},{
  timestamps:true
});
const User = mongoose.model("User", devTinderUser);

module.exports = User;
