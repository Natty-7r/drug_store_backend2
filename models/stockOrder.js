//   drug order accepted from coordinator to pharamacist

const { Schema, model } = require("mongoose");

const StockOrderSchema = new Schema(
  {
    drugCode: {
      type: String,
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
  { timestamps: false }
);
const StockOrder = model("StockOrder", StockOrderSchema);
module.exports = StockOrder;
