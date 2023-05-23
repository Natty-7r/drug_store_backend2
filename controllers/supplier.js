const Comment = require("../models/comments");

const StoreOrder = require("../models/storeOrder");

const Request = require("../models/request");

const RequestDrug = require("../models/requestedDrugs");

exports.getIndex = async (req, res, next) => {
  try {
    const pendingOrders = await Request.find({
      status: "pending",
      sender: "manager",
    });
    const acceptedOrders = await Request.find({
      status: "accepted",
      sender: "manager",
    });
    const rejectedOrders = await Request.find({
      status: "rejected",
      sender: "manager",
    });
    const comments = await Comment.find({ sender: "supplier" });

    if (!pendingOrders || !rejectedOrders || !acceptedOrders) {
      const error = new Error("unable to load drugs");
      error.statusCode = 500;
      throw error;
    }

    res.json({
      status: "success",
      orders: {
        pendingOrders,
        acceptedOrders,
        rejectedOrders,
        comments,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "fail",
      orders: {
        pendingOrders: [],
        acceptedOrders: [],
        rejectedOrders: [],
        comments: [],
      },
    });
  }
};

exports.addComment = async (req, res, next) => {
  let { message, username } = req.body;
  try {
    const comment = Comment.create({
      name: username,
      sender: "supplier",
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
    res.json({
      status: "fail",
      message: "error while sending requst to manager",
    });
  }
};

exports.chageOrderStatus = async (req, res, next) => {
  const { requestId, status } = req.body;

  try {
    await Request.updateOne({ id: requestId }, { status: status });
    res.json({ status: "success" });
  } catch (error) {
    res.json({ status: "fail" });
  }
};

exports.sendOrder = async (req, res, next) => {
  const { orders } = req.body;
  try {
    const savedDrug = await StoreOrder.insertMany(orders);
    // const savedDrug = await StoreOrder.insertMany(orders, { validate: true });
    if (!savedDrug) {
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

exports.clearOrder = async (req, res, next) => {
  const requestId = req.params.requestId;
  try {
    const result = await Request.deleteOne({ id: requestId });

    if (!result) {
      const error = new Error("deleting unsuccesfull");
      error.statusCode = 500;
      throw error;
    }
    res.json({ status: "success" });
  } catch (error) {
    res.json({ status: "fail" });
  }
};
