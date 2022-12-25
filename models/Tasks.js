var mongoose = require("mongoose");
const taskSchema = mongoose.Schema(
  {
    taskname: { type: String, required: true },
    subject: { type: String },
    description: { type: String },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    createdBy: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ["High", "Medium", "Low", "Average"],
      default: "Average",
    },
    followers: {
      type: Array,
      required: true,
    },
    leader: {
      type: String,
      required: true,
    },
    beneficiary: {
      type: Array,
      required: true,
    },
    completed: { type: Boolean, default: false },
    files: { type: Array },
  },
  {
    timestamps: true,
  }
);
// taskSchema.virtual("followerslist", {
//   ref: "Users",
//   localField: "followers",
//   foreignField: "_id",
// });
// taskSchema.virtual("leaderinfo", {
//   ref: "Users",
//   localField: "leader",
//   foreignField: "_id",
// });
// taskSchema.virtual("beneficiaryinfo", {
//   ref: "Users",
//   localField: "beneficiary",
//   foreignField: "_id",
// });
// taskSchema.set("toObject", { virtuals: true });
// taskSchema.set("toJSON", { virtuals: true });
var Tasks = mongoose.model("Tasks", taskSchema);
module.exports = { Tasks };
