// drugs in the stock

const mongoose = require("mongoose");
const { Schema } = mongoose;

const AccountSchema = new Schema(
  {
    accountId: {
      type: String,
      required: true,
      primaryKey: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },
    active: {
      default: true,
      type: Boolean,
      required: true,
    },
  },
  { timeStamp: false }
);

const Account = mongoose.model("Accounts", AccountSchema);
module.exports = Account;
