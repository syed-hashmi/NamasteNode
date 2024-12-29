const express = require("express");

const connFunc = require("./mongodbConnect");

const User = require("./model");
app = express();

app.use(express.json());

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

app.get("/user", async (req, res, next) => {
  try {
    const email = req.body;

    let searchedData = await User.findOne(email)
     if(searchedData.length == 0){
      res.status(404).send("user not found");
     }
    res.status(200).send("searched Data"+ searchedData);
  } catch (error) {
    res.status(404).send("error searching user : "+error.message);
  }
}); 

app.get("/feed", async (req, res, next) => {
  try {  
    let serachedDocument = await User.find();
    res.status(200).send("All Users" + serachedDocument);

  } catch (error) {
    res.status(400).send(error.message);
  }
}); 

app.delete("/user", async (req, res, next) => {
  try {  
    let serachedDocument = await User.findByIdAndDelete(req.body);
    res.status(200).send("All Users" + serachedDocument);

  } catch (error) {
    res.status(400).send(error.message);
  }
}); 

app.patch("/user", async (req, res, next) => {
  try {  
    let _id=req.body._id
    let serachedDocument = await User.findByIdAndUpdate({_id},req.body,{
      returnDocument:"after",
      runValidators:true
    });
    res.status(200).send("All Users" + serachedDocument);

  } catch (error) {
    res.status(400).send(error.message);
  }
}); 


//#endregion dev tinder api's end



connFunc().then((data,err) => {
  console.log("db Connected successfully");
  app.listen(3000, () => {
    console.log("server running on port: 3000");
  });
});
