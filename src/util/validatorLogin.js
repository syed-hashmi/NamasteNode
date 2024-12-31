const validator = require("validator");
function validatorLogin(reqBody) {
  if (!validator.isEmail(reqBody.email)) {
    throw Error ("emmail is not valid")
  }
  if(!validator.isStrongPassword(reqBody.password)){
    throw Error("Password is not strong");
  }
  
}

module.exports = validatorLogin;
