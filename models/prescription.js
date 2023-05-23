// drugs in the stock

const { Schema, model } = require("mongoose");

const PrescriptionSchema = new Schema(
  {
    filename: {
      type: String,
      required: true,
      primaryKey: true,
    },
    filepath: {
      type: String,
      required: true,
    },
    mimetype: {
      type: String,
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },
  },
  { timeStamp: false }
);

const Account = model("Prescriptions", PrescriptionSchema);
module.exports = Account;
