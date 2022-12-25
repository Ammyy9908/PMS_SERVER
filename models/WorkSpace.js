var mongoose = require("mongoose");

const workSpaceSchema = mongoose.Schema(
  {
    name: { type: String, unique: true, required: true },
    active: { type: Boolean, required: true, default: 1 },
    description: { type: String, required: true },
    createdBy: {
      type: "string",
      required: true,
    },
    members: {
      type: Array,
      required: true,
    },
  },
  { timestamp: true }
);

const WorkSpace = mongoose.model("WorkSpace", workSpaceSchema);

module.exports = { WorkSpace };
