//  request from store coordinatore to manager
const { Schema, model } = require("mongoose");
const requestedDrugSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "unbilled",
    },
  },
  { timestamps: false }
);
const RequestedDrug = model("requestedDrugs", requestedDrugSchema);
exports.requestedDrugSchema = requestedDrugSchema;
// module.exports = RequestedDrug;