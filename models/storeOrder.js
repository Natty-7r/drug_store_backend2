//  drug order accepted from supplier  to coordinator

const { Schema, model } = require("mongoose");
const StoreOrderSchema = new Schema(
  {
    drugCode: {
      type: String,
      allowNull: false,
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
  { timeStamps: false }
);
const StoreOrder = model("storeOrder", StoreOrderSchema);
module.exports = StoreOrder;
