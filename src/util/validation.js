const validator = require("validator");
function validatorSignUp(reqBody) {
  if (!validator.isEmail(reqBody.email)) {
    throw Error("emmail is not valid");
  }
  if (!validator.isStrongPassword(reqBody.password)) {
    throw Error("Password is not strong");
  }
}

function validateProfileEditData(reqBody) {
  const allowedEDitFields = [
    "firstName",
    "lastName",
    "email",
    "age",
    "gender",
    "photoUrl",
    "about",
    "skills",
  ];

  Object.keys(reqBody).every((data) => {
    if (!allowedEDitFields.includes(data)) {
      throw Error("edit not allowed for fields submitted");
    } else {
      return true;
    }
  });
}

module.exports = { validatorSignUp, validateProfileEditData };
