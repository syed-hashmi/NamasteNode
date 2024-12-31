const jwt = require("jsonwebtoken");
const User = require("../model")
async function authenticateWithJwt(req, res, next) {
 
  try{
  if (!req.cookies.token) {
    throw new Error("Unauthorized");
  }
  let cookie = req.cookies;
  let { token } = cookie;
  const { _id } = await jwt.verify(token, "inshallah11!A");

  let fetchedUser = await User.findById(_id);
  
  res.user= fetchedUser;
  //find user;;
  next();
}
catch(error){
    res.status(400).send(error.message);
  }
}

module.exports = authenticateWithJwt;
