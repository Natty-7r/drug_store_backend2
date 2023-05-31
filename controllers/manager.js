const Store = require("../models/store");
const Stock = require("../models/stock");
const SoldDrug = require("../models/soldDrugs");
const Comment = require("../models/comments");

const Request = require("../models/request");

exports.getDrugs = async (req, res, next) => {
  try {
    const storeDrugs = await Store.find({});
    const stockDrugs = await Stock.find({});

    const soldDrugs = await SoldDrug.find({});
    const storeRequests = await Request.find({ sender: "coordinator"});
    const comments = await Comment.find({});

    if (!storeDrugs) {
      const error = new Error("unable to load drugs");
      error.statusCode = 500;
      throw error;
    }

    res.json({
      status: "success",
      drugs: {
        availbleStockDrugs: stockDrugs,
        availbleStoreDrugs: storeDrugs,
        soldDrugs,
        storeOrders: [],
        stockRequests: [],
        comments,
        storeRequests,
      },
    });
  } catch (error) {
    res.json({
      status: "fail",
      message: "unable to fetch data",
      drugs: {
        availbleStockDrugs: [],
        availbleStoreDrugs: [],
        soldDrugs: [],
        storeOrders: [],
        stockRequests: [],
      },
    });
  }
};
exports.updateCommentStatus = async (req, res, next) => {
  const { commentId, newStatus } = req.body;
  let result;
  try {
    result = await Comment.findOneAndUpdate(
      { id: commentId },
      { status: newStatus }
    );

    if (!result) {
      const error = new Error("updating unsuccesfull");
      error.statusCode = 500;
      throw error;
    }
    res.json({ status: "success" });
  } catch (error) {
    console.log(error)
    res.json({ status: "fail" });
  }
};
exports.clearComment = async (req, res, next) => {
  const commentId = req.params.commentId;
  try {
    const result = await Comment.deleteOne({ id: commentId });
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

exports.orderDrugs = async (req, res, next) => {
  const { storeOrders } = req.body;
  try {
    const request = await Request.create({
      sender: "manager",
      status: "pending",
      requestDate: new Date(),
      requestedDrugs: storeOrders,
    });
    const result = await request.save();
    if (!result) res.json({ status: "fail" });
    res.json({ status: "success" });
  } catch (error) {
    res.json({ status: "fail" });
  }
};
exports.clearStoreRequest = async (req, res, next) => {
  try {
    const result = await Request.deleteMany({
      sender: "coordinator",
    });
    console.log(result)
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
exports.clearSoldDrug = async (req, res, next) => {
  const{drugCode,currentSlide}=  req.body;
  try {
    let result;
    if(currentSlide=="availableStore")
    result = await Store.deleteOne({ drugCode });
    if(currentSlide=="availableStock")
    result = await Stock.deleteOne({ drugCode });
    if(currentSlide=="soldDrugs")
    result = await SoldDrug.deleteOne({ drugCode });
    if (!result.acknowledged)
      return res.json({
        status: "fail",
      });
    return res.json({
      status: "success",
    });
  } catch (error) {
    console.log(error)
    return res.json({
      status: "fail",
    });
  }
};
exports.clearSoldDrugs = async (req, res, next) => {
  const drugsCode = req.params.drugCodes;
  const drugCodes = drugsCode.split(":");
  console.log(drugCodes);
  drugCodes.shift();
  try {
    const result = await SoldDrug.deleteMany({ drugCode: { $in: drugCodes } });
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
  const { searchKey, from } = req.body;

  try {
    let searchResult = [];
    if (from == "stock")
      searchResult = await Stock.find({
        name: { $regex: searchKey, $options: "i" },
      });
    if (from == "store")
      searchResult = await Store.find({
        name: { $regex: searchKey, $options: "i" },
      });
    console.log(searchResult);
    return res.json({
      status: "success",
      searchResult,
    });
  } catch (error) {
    return res.json({
      status: "fail",
      message: "unable to fetch data",
      searchResult: [],
    });
  }
};
