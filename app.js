const express = require("express");
const mongoose = require("mongoose");

const bodyParser = require("body-parser");

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");

require("dotenv").config();
const app = express();
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});
app.use(bodyParser.json());

app.use("/admin", adminRoutes);
app.use("/auth", authRoutes);

mongoose
  .connect(`mongodb://0.0.0.0:27017/${process.env.DBNAME}`)
  .then((connected) => {
    app.listen(process.env.PORT);
  })
  .catch((err) => console.log(err));
