const http = require("http");

const express = require("express");
const mongoose = require("mongoose");
const socketio = require("socket.io");
const bodyParser = require("body-parser");
const cors = require("cors");

const addDrug = async () => {
  const Drug = require("./models/stock");
  const drug = await Drug.create({
    drugCode: 123,
    name: "cloxacilin",
    amount: 100,
    price: 20,
    supplier: "dagi store",
    expireDate: new Date("12/12/25"),
    suppliedDate: new Date("12/12/12"),
    soldDate: new Date("12/12/12"),
  });
  await drug.save();
};
// addDrug();

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const customerRoutes = require("./routes/customer");
const managerRoutes = require("./routes/manager");
const pharmacistRoutes = require("./routes/pharmacist");
const cashierRoutes = require("./routes/casher");
const suppierRoutes = require("./routes/supplier");
const coordinatorRoutes = require("./routes/coordinator");

const { socketConnection } = require("./util/socket");
const prescriptionSearch = require("./controllers/customer").prescriptionSearch;

require("dotenv").config();
const app = express();
const server = http.createServer(app);

app.use((req, res, next) => {
  console.log(req.path)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});
app.use(cors());
app.use(bodyParser.json());

app.use("/admin", adminRoutes);
app.use("/auth", authRoutes);
app.use("/customer", customerRoutes);
app.use("/manager", managerRoutes);
app.use("/pharmacist", pharmacistRoutes);
app.use("/casher", cashierRoutes);
app.use("/supplier", suppierRoutes);
app.use("/coordinator", coordinatorRoutes);
app.use("/manager", managerRoutes);

mongoose
  .connect(`mongodb://0.0.0.0:27017/${process.env.DBNAME}`)
  .then((connected) => {
    server.listen(process.env.PORT);
  })
  .catch((err) => console.log(err));

const io = socketio(server, {
  cors: {
    origin: "*",
  },
});
io.on("connection", (socket) => {
  socketConnection(socket, io);
  socket.on("prescription", (prescriptionImage) => {
    prescriptionSearch(io, socket, prescriptionImage);
  });
});
