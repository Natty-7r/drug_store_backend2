const fs = require("fs");
const path = require("path");

const rootPath = path.dirname(process.mainModule.filename);

const Store = require("../models/store");
const Stock = require("../models/stock");
const Comment = require("../models/comments");
const Prescriptions = require("../models/prescription");

exports.searchDrug = async (req, res, next) => {
  try {
    let searchKey = req.params.searchKey;
    let searchResult = [];

    const searchResultStock = await Stock.find({
      name: { $regex: searchKey, $options: "i" },
    });

    const searchResultStore = await Store.find({
      name: { $regex: searchKey, $options: "i" },
    });
    searchResult = searchResultStock.concat(searchResultStore);
    return res.json({
      status: "success",
      searchResult,
    });
    console.log(searchResult);
  } catch (error) {
    return res.json({
      status: "fail",
      message: "unable to fetch data",
      searchResult: [],
    });
  }
};

exports.addComment = async (req, res, next) => {
  let { name, message, email } = req.body;
  try {
    const comment = await Comment.create({
      name: name,
      sender: "customer",
      email: email,
      message,
      commentDate: new Date(),
      status: "unread",
    });
    const commentSaved = await comment.save();
    if (!commentSaved) {
      const error = new Error("ddd");
      throw error;
    }
    res.json({ status: "success" });
  } catch (error) {
    console.log(error);
    res.json({
      status: "fail",
      message: "error while sending requst to manager",
    });
  }
};

exports.prescriptionSearch = (io, socket, prescriptionData) => {

  const prescription = async (prescriptionData) => {
    const imageName = prescriptionData.imageName;
    const imageType = prescriptionData.mimeType;
    const base64PrescriptionImage = prescriptionData.image.replace(
      /^data:image\/\w+;base64,/,
      ""
    );

    const filePath = `${rootPath}/data/images/${imageName}.${imageType}`;
    const imageBuffer = Buffer.from(base64PrescriptionImage, "base64");

    fs.writeFile(filePath, imageBuffer, async (err, data) => {
      if (err) {
        socket.emit("uploadError", {
          message: "failed to upload Presicription image!",
        });
      } else {
        const prescription = await Prescriptions.create({
          filename: imageName,
          filepath: filePath,
          date: new Date(),
          mimetype: imageType,
        });
        const result =  await prescription.save();
        io.emit("prescriptionForPharmacist", prescriptionData);
      }
    });
  };
  prescription(prescriptionData);
};
