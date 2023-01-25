var mongoose = require("mongoose");
const taskSchema = mongoose.Schema(
  {
    taskname: { type: String, required: true },
    subject: { type: String },
    workplace_id: {
      type: String,
      required: true,
    },
    description: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    endTime: { type: String, required: false },
    createdBy: {
      type: String,
      ref: "Users",
    },
    priority: {
      type: String,
      enum: ["High", "Medium", "Low", "Average"],
      default: "Average",
    },
    followers: [{ type: String }],
    leader: { type: String, required: true },
    beneficiary: [{ type: mongoose.Schema.ObjectId, ref: "Users" }],
    endTime: {
      type: String,
      required: true,
    },
    completed: { type: Boolean, default: false },
    files: { type: Array },
  },
  {
    timestamps: true,
  }
);
// taskSchema.virtual('followerslist',{
//   ref:'Users',
//   localField:'followers',
//   foreignField:'_id',
// })
// taskSchema.virtual('leaderinfo',{
//   ref:'Users',
//   localField:'leader',
//   foreignField:'_id',
// })
// taskSchema.virtual('beneficiaryinfo',{
//   ref:'Users',
//   localField:'beneficiary',
//   foreignField:'_id',
// })
// taskSchema.set('toObject', { virtuals: true });
// taskSchema.set('toJSON', { virtuals: true });
var Tasks = mongoose.model("Tasks", taskSchema);
module.exports = { Tasks };
