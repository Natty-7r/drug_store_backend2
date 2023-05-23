const fs = require("fs");
const Stock = require("../models/stock");
const StockOrder = require("../models/stockOrder");
const SoldDrugs = require("../models/soldDrugs");

const Request = require("../models/request");
const RequestDrug = require("../models/requestedDrugs");
const Prescription = require("../models/prescription");

const { mainRoot } = require("../util/mainRoot");

exports.getDrugs = async (req, res, next) => {
  try {
    const stockDrugs = await Stock.find({});
    if (!stockDrugs) {
      const error = new Error("unable to load drugs");
      error.statusCode = 500;
      throw error;
    }
    const now = new Date();
    const expiredDrugs = stockDrugs.filter((drug) => {
      return now > drug.expireDate;
    });
    const availbleStockDrugs = stockDrugs.filter((drug) => {
      return now < drug.expireDate;
    });
    const stockOrders = await StockOrder.find({});
    if (!stockDrugs) {
      const error = new Error("unable to load drugs");
      error.statusCode = 500;
      throw error;
    }
    res.json({
      status: "success",
      drugs: {
        availbleStockDrugs,
        expiredDrugs,
        stockOrders,
      },
    });
  } catch (error) {}
};
exports.requestDrug = async (req, res, next) => {
  let { stockRequest: stockRequests } = req.body;

  try {
    await Request.create(
      {
        sender: "pharmacist",
        status: "pending",
        requestDate: new Date(),
        requestedDrugs: stockRequests,
      },
      {
        include: [RequestDrug],
      }
    );
    res.json({ status: "success" });
  } catch (error) {
    res.json({
      status: "fail",
      message: "error while sending requst to manager",
    });
  }
};
exports.acceptOrders = async (req, res, next) => {
  try {
    await Stock.destroy({ truncate: true });
    const newDrugs = req.body.newDrugs.map((drug) => {
      delete drug.id;
      return drug;
    });
    await Stock.bulkCreate(newDrugs, { validate: true });
    await StockOrder.destroy({ truncate: true });
  } catch (error) {}
};

exports.sellDrug = async (req, res, next) => {
  const { drugCode, newAmount } = req.body;
  const today = new Date();
  try {
    let drugSold = await Stock.findOne({ drugCode: drugCode });
    drugSold = drugSold.dataValues;
    drugSold.soldDate = today;
    drugSold.amount -= newAmount;
    delete drugSold.id;

    if (newAmount == 0) result = await Stock.deleteOne({ drugCode: drugCode });
    else
      result = await Stock.findOneAndUpdate(
        { amount: newAmount },
        { drugCode: drugCode }
      );
    drugSold = new SoldDrugs(drugSold);
    await drugSold.save();
    if (!result) {
      const error = new Error("updating unsuccesfull");
      error.statusCode = 500;
      throw error;
    }
    res.json({ status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ status: "fail" });
  }
};
exports.deleteDrug = async (req, res, next) => {
  const drugCode = req.params.drugCode;
  try {
    const result = await Stock.deleteOne({ drugCode: drugCode });
    if (!result.acknowledged) {
      const error = new Error("deleting unsuccesfull");
      error.statusCode = 500;
      throw error;
    }
    res.json({ status: "success" });
  } catch (error) {
    res.json({ status: "fail" });
  }
};

exports.deleteDrugs = async (req, res, next) => {
  const drugsCode = req.params.drugsCode;
  const drugCodes = drugsCode.split(":");
  drugCodes.shift();
  try {
    const result = await Stock.deleteMany({ drugCode: { $in: drugCodes } });
    if (!result.acknowledged)
      return res.json({
        status: "fail",
      });
    return res.json({
      status: "success",
    });
  } catch (error) {
    return res.json({
      status: "fail",
    });
  }
};
exports.searchDrug = async (req, res, next) => {
  const searchKey = req.params.searchKey;
  try {
    let searchResult = await Stock.find({
      name: { $regex: searchKey, $options: "i" },
    });
    if (!searchResult)
      return res.json({
        status: "fail",
        message: "unable to fetch data",
        searchResult: [],
      });
    return res.json({
      status: "success",
      searchResult,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: "fail",
      message: "unable to fetch data",
      searchResult: [],
    });
  }
};
exports.searchDrugByPrescription = async (req, res, next) => {
  const { socket, io } = require("../util/socket").socketConnection(null);
  const { drugNames: searchedDrugs, imageName, mimeType } = req.body;
  try {
    const filePath = `${mainRoot}/data/images/${imageName}.${mimeType}`;
    return fs.unlink(filePath, async (err) => {
      if (err)
        return res.json({
          status: "fail",
        });
      else {
        await Prescription.deleteOne({ filename: imageName });

        const searchedDrugsArray = searchedDrugs.split(",");
        const searchResult = await Stock.find({
          name: { $in: searchedDrugsArray },
        }).exec();
        if (!searchResult) {
          io.emit("prescriptionSearchResult", {
            status: "fail",
            imageName,
            message: "no related drug is found with your prescription!",
          });
          return res.json({
            status: "success",
          });
        } else if (searchResult.length == 0) {
          io.emit("prescriptionSearchResult", {
            status: "fail",
            imageName,
            message: "no related drug is found with your prescription!",
          });
          return res.json({
            status: "success",
          });
        }
        io.emit("prescriptionSearchResult", {
          status: "success",
          searchResult,
          imageName,
        });
        return res.json({
          status: "success",
        });
      }
    });
  } catch (error) {
    return res.json({
      status: "fail",
    });
  }
};
exports.cancelSearchDrugByPrescription = async (req, res, next) => {
  const { imageName, mimeType } = req.body;
  const { socket, io } = require("../util/socket").socketConnection(null);
  try {
    const filePath = `${mainRoot}/data/images/${imageName}.${mimeType}`;
    return fs.unlink(filePath, async (err) => {
      if (err) {
        return res.json({
          status: "fail",
        });
      } else {
        await Prescription.deleteOne({ filename: imageName });
        io.emit("prescriptionSearchResult", {
          status: "fail",
          imageName,
          message: "no related drug is found with your prescription!",
        });
        return res.json({
          status: "success",
        });
      }
    });
  } catch (error) {
    return res.json({
      status: "fail",
    });
  }
};
exports.findPrescription = async (req, res, next) => {
  const { socket, io } = require("../util/socket").socketConnection(null);
  try {
    const prescription = await Prescription.findOne()
      .sort({ date: 1 }) // Sorting in descending order based on dateField
      .exec();
    if (prescription) {
      const filePath = prescription.filepath;
      return fs.readFile(filePath, async (err, image) => {
        if (err) {
          return res.json({
            status: "fail",
          });
        } else {
          const base64String = image.toString("base64");
          const imageData = {
            imageName: prescription.filename,
            mimeType: prescription.mimetype,
            image: base64String,
          };
          io.emit("prescriptionForPharmacist", imageData);
          return res.json({
            status: "success",
          });
        }
      });
    }
  } catch (error) {
    return res.json({
      status: "fail",
    });
  }
};
