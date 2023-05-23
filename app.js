const http = require("http");

const express = require("express");
const mongoose = require("mongoose");
const socketio = require("socket.io");
const bodyParser = require("body-parser");
const cors = require("cors");
const pdfmake = require("pdfmake");

const addDrug = async () => {
  const Drug = require("./models/soldDrugs");
  const drug = await Drug.create({
    drugCode: 123,
    name: "natinole",
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

const pdfSave = async () => {
  const puppeteer = require("puppeteer");

  async function convertToPdf(htmlContent, outputPath) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(htmlContent);
    await page.pdf({ path: outputPath });

    await browser.close();
  }

  // Usage
  convertToPdf(
    "<html><body><h1>Hello, World!</h1></body></html>",
    "output.pdf"
  );
};

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const customerRoutes = require("./routes/customer");
const managerRoutes = require("./routes/manager");
const pharmacistRoutes = require("./routes/pharmacist");
const cashierRoutes = require("./routes/casher");

const { socketConnection } = require("./util/socket");
const prescriptionSearch = require("./controllers/customer").prescriptionSearch;

require("dotenv").config();
const app = express();
const server = http.createServer(app);

app.use((req, res, next) => {
  console.log(req.path);
  console.log(req.method);
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
