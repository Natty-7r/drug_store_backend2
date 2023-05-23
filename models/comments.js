//comments

const { Schema, model } = require("mongoose");
const CommentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    sender: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      default: "unread",
      type: String,
      required: true,
    },

    commentDate: { type: Date, required: true },
  },
  { timeStamp: false }
);
const Comment = model("comments", CommentSchema);
module.exports = Comment;
