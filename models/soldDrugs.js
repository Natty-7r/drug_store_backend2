// sold drugs

const { Schema, model } = require("mongoose");
const SoldDrugsSchema = new Schema(
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
    soldDate: { type: Date, required: true },
  },
  { timestamps: false }
);
const SoldDrug = model("SoldDrugs", SoldDrugsSchema);

module.exports = SoldDrug;
