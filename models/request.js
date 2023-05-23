//  request from store coordinatore to manager

const { Schema, model, ObjectId } = require("mongoose");
const { requestedDrugSchema } = require("./requestedDrugs");
const RequestSchema = new Schema(
  {
    sender: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    requestDate: { type: Date, required: true },
    requestedDrugs: [requestedDrugSchema],
  },
  { timeStamps: false }
);
const Request = model("requests", RequestSchema);
module.exports = Request;
