var mongoose = require("mongoose");
const taskSchema = mongoose.Schema(
  {
    taskname: { type: String, required: true },
    subject: { type: String },
    description: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    createdBy: {
      type: String,
      ref: "Users",
    },
    priority: {
      type: String,
      enum: ["High", "Medium", "Low", "Average"],
      default: "Average",
    },
    followers: [{ type: mongoose.Schema.ObjectId, ref: "Users" }],
    leader: [{ type: mongoose.Schema.ObjectId, ref: "Users" }],
    beneficiary: [{ type: mongoose.Schema.ObjectId, ref: "Users" }],
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
