const jwt = require("jsonwebtoken");
async function authenticateWithJwt(req, res, next) {
 
  try{
  if (!req.cookies.token) {
    throw new Error("Unauthorized");
  }
  let cookie = req.cookies;
  let { token } = cookie;
  const { _id } = await jwt.verify(token, "inshallah11!A");
  res.locals.id = _id;
  //find user;;
  next();
}
catch(error){
    res.status(400).send(error.message);
  }
}

module.exports = authenticateWithJwt;
