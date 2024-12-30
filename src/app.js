const express = require("express");
const connFunc = require("./mongodbConnect");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const authenticateWithJwt = require("./middlewares/auth");

const User = require("./model");
const { error } = require("joi/lib/types/alternatives");
app = express();

app.use(express.json());
app.use(cookieParser());

//#region error handling and middleware cahnges

// app.use(
//   "/sa",
//   (req, res, next) => {

//     next();
//   },
//   (req, res, next) => {
//     console.log("second middleware called");
//     next();
//   },
//   (req, res) => {
//     throw Error("test Error");
//   }
// );

// app.use("/sa", (err, req, res, next) => { //error handler
//   if (err)
//       res.status(401).send("test send");
// });
//#endregion

//#region path formats
// app.use("/routeParam/:h", (req, res, next) => {
//   console.log(req.params);
//   res.send(`route params ${req.params?.h}`);

// });

// app.use("/queryParam", (req, res, next) => {
//   console.log(req.query);
//   res.send(`query params ${req.query?.h}`);

// });

// app.use("/abc+d", (req, res, next) => {
//   res.send("first middlewre with +");

//   next();
// });

// app.use("/abc*d", (req, res, next) => {
//   res.send("first middlewre with *");
//   next();
// });

// app.use("/ab(c)?d", (req, res, next) => {
//   res.send("first middlewre with ?");
//   next();
// });

// app.use(/\/abc|\/xyz/, (req, res, next) => {
//   res.send("first middlewre with regular expression");
//   next();
// });
//#endregion path formats

//#region dev tinder api's
app.post("/signUp", async (req, res, next) => {
  try {
    const documentToINsert = new User(req.body);

    await documentToINsert.save();

    res.status(200).send("data inserted successfully");
  } catch (error) {
    res.status(404).send(error.message);
  }
});

app.get("/user", authenticateWithJwt, async (req, res, next) => {
  try {
    const email = req.body;

    let searchedData = await User.findOne(email);
    if (searchedData.length == 0) {
      res.status(404).send("user not found");
    }
    res.status(200).send("searched Data" + searchedData);
  } catch (error) {
    res.status(404).send("error searching user : " + error.message);
  }
});

app.get("/feed", authenticateWithJwt, async (req, res, next) => {
  try {
    let serachedDocument = await User.find();
    res.status(200).send("All Users" + serachedDocument);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.delete("/user",authenticateWithJwt, async (req, res, next) => {
  try {
    let serachedDocument = await User.findByIdAndDelete(req.body);
    res.status(200).send("All Users" + serachedDocument);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.patch("/user", authenticateWithJwt, async (req, res, next) => {
  try {
    let _id = req.body._id;
    let serachedDocument = await User.findByIdAndUpdate({ _id }, req.body, {
      returnDocument: "after",
      runValidators: true,
    });
    res.status(200).send("All Users" + serachedDocument);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

//#endregion dev tinder api's end

// connFunc()
//   .then((data, err) => {
//     console.log("db Connected successfully");
//     app.listen(3000, () => {
//       console.log("server running on port: 3000");
//     });
//   })
//   .catch((error) => {
//     console.log("error connecting to db");
//   });

app.get("/token", async (req, res, next) => {
  //afterlogin is successfull create token

  const token = await jwt.sign(
    { _id: "677161eaea377d717e069f70" },
    "inshallah11!A",{

      expiresIn: '15s' // expires in 365 days

 }
  );
  res.cookie("token", token);
  res.send(token);

  // res.cookie("token","2365472gbsdasdfsdf");
  // res.send("cookie sent");
});

app.get("/access", authenticateWithJwt, (req, res, next) => {
  try { 
    console.log("logged in user is : " + res.locals.id); 
    res.send(res.locals.id);
  } catch (error) {
    res.send("Error : " + error.message);
  }
});

app.listen(3000, () => {
  console.log("server running on port: 3000");
});
