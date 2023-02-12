const { model, Schema } = require("mongoose");

const alertSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    generated_by: {
      type: String,
      required: true,
    },
    generated_to: {
      type: String,
      required: true,
    },
    start_date: {
      type: String,
      required: true,
    },

    end_date: {
      type: String,
      required: true,
    },

    seen: {
      type: Boolean,
      default: false,
    },
    path: {
      type: String,
      default: "tasks",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("alert", alertSchema);
