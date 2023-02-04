const { model, Schema } = require("mongoose");

const review_schema = new Schema({
  description: {
    type: String,
    required: true,
  },
  reviwed_by: {
    type: String,
    required: true,
  },
  task: {
    type: String,
    required: true,
  },
});

const Review = model("review", review_schema);

module.exports = Review;
