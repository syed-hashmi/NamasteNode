const express = require("express");

app = express();

app.use("/", (err, req, res, next) => {
    if (err) 
        res.status(404).send("test send");
  });

app.use(
  "/",
  (req, res, next) => {
    debugger;
    next();
  },
  (req, res, next) => {
    console.log("second middleware called");
    next();
  },
  (req, res) => {
    throw Error("test Error");
  }
);


//#region path formats
app.use("/abc+d", (req, res, next) => {
  res.send("first middlewre with +");
  next();
});

app.use("/abc*d", (req, res, next) => {
  res.send("first middlewre with *");
  next();
});

app.use("/ab(c)?d", (req, res, next) => {
  res.send("first middlewre with ?");
  next();
});

app.use(/\/abc|\/xyz/, (req, res, next) => {
  res.send("first middlewre with regular expression");
  next();
});
//#endregion path formats

app.listen(3000, () => {
  console.log("server running on port: 3000");
});
