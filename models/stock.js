// drugs in the stock

const mongoose = require("mongoose");
const { Schema } = mongoose;

const StockSchema = new Schema(
  {
    drugCode: {
      type: Number,
      required: true,
      primarykey: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    expireDate: {
      type: Date,
      required: true,
    },
    supplier: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "unbilled",
    },
    suppliedDate: { type: Date, required: true },
  },
  { timeStamp: false }
);

const Stock = mongoose.model("Stocks", StockSchema);
module.exports = Stock;
