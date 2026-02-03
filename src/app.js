const express = require("express");

const app = express();

app.use("/hello", (req, res) => {
  res.send("Hello!");
});
app.use("/myname", (req, res) => {
  res.send("Manas Nayak!");
});
app.use("/author", (req, res) => {
  res.send("Manas!");
});

app.use("/", (req, res) => {
  res.send("Hello world!  ko");  
});

app.listen(7777, () => {
  console.log("Server running on port 7777");
});
