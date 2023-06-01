const Store = require("../models/store");
const Stock = require("../models/stock");

const StoreOrder = require("../models/storeOrder");
const Request = require("../models/request");
const StockOrder = require("../models/stockOrder");

exports.getDrugs = async (req, res, next) => {
  try {
    const storeDrugs = await Store.find({});
    const stockDrugs = await Stock.find({});
    let stockRequests = await Request.find({ sender: "pharmacist" });

    const storeOrders = await StoreOrder.find({});
    const now = new Date();
    const expiredDrugs = storeDrugs.filter((drug) => {
      return now > drug.expireDate;
    });
    const availbleStoreDrugs = storeDrugs.filter((drug) => {
      return now < drug.expireDate;
    });

    const availbleStockDrugs = stockDrugs.filter((drug) => {
      return now < drug.expireDate;
    });

    if (!storeDrugs) {
      const error = new Error("unable to load drugs");
      error.statusCode = 500;
      throw error;
    }

    res.json({
      status: "success",
      drugs: {
        availbleStockDrugs,
        availbleStoreDrugs,
        expiredDrugs,
        storeOrders,
        stockRequests,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "fail",
      message: "unable to fetch data",
      drugs: {
        availbleStockDrugs: [],
        availbleStoreDrugs: [],
        expiredDrugs: [],
        storeOrders: [],
        stockRequests: [],
      },
    });
  }
};
exports.updateDrug = async (req, res, next) => {
  const { drugCode, newPrice, newAmount, currentSlide } = req.body;
  let result;
  try {
    if (currentSlide == "availableStore")
      result = await Store.findOneAndUpdate(
        { drugCode: drugCode },
        { price: newPrice, amount: newAmount }
      );

    if (currentSlide == "availableStock")
      result = await Stock.findOneAndUpdate(
        { drugCode: drugCode },
       { price: newPrice, amount: newAmount }
      );
    if (!result) {
      const error = new Error("updating unsuccesfull");
      error.statusCode = 500;
      throw error;
    }
    res.json({ status: "success" });
  } catch (error) {
    res.json({ status: "fail" });
  }
};
exports.deleteDrug = async (req, res, next) => {
  const drugCode = req.params.drugCode;
  try {
    const result = await Store.deleteOne({
      drugCode: drugCode,
    });
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
  const drugsCode = req.params.drugCodes;

  const drugCodes = drugsCode.split(":");
  drugCodes.shift();
  try {
    const result = await Store.deleteMany({ drugCode: { $in: drugCodes } });
    if (!result.acknowledged) return res.json({ status: "fail" });
    return res.json({ status: "success" });
  } catch (error) {
    res.json({ status: "fail" });
  }
};
exports.addRequest = async (req, res, next) => {
  let { storeRequest } = req.body;
  try {
    const request = await Request.create({
      sender: "coordinator",
      status: "pending",
      requestDate: new Date(),
      requestedDrugs: storeRequest,
    });
    const result = await request.save();
    if (!result) return res.json({ status: "fail" });
    return res.json({ status: "success" });
  } catch (error) {
    console.log("error while sending requst to manager ");
    return res.json({ status: "fail" });
  }
};
exports.registerDrugs = async (req, res, next) => {
  try {
    await Store.deleteMany({});
    const newDrugs = req.body.newDrugs.map((drug) => {
      delete drug._id;
      return drug;
    });
    await Store.insertMany(newDrugs);
    await StoreOrder.deleteMany({});
    res.json({ status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ status: "fail" });
  }
};
exports.addToStock = async (req, res, next) => {
  let { stockOrders, availbleDrugs } = req.body;
  stockOrders.forEach((stockOrder) => delete stockOrder._id);
  availbleDrugs.forEach((availbleDrug) => delete availbleDrug._id);
  availbleDrugs = availbleDrugs.filter(
    (availbleDrug) => availbleDrug.amount > 0
  );

  try {
    await Store.deleteMany({});
    await Store.insertMany(availbleDrugs);
    await StockOrder.insertMany(stockOrders);
    res.json({ status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ status: "fail" });
  }
};
exports.clearStockRequest = async (req, res, next) => {
  try {
    const result = await Request.deleteMany({
      sender: "pharmacist",
    });
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
