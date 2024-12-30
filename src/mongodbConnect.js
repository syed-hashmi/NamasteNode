const mongoDb = require("mongoose");
const connUrl =
  "mongodb+srv://syed:inshallah11!A@cluster0.u0onb.mongodb.net/devTinder";
async function connectFunc() {
  await mongoDb.connect(connUrl); 
}
module.exports =  connectFunc;
