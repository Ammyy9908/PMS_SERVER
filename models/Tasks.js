var mongoose = require("mongoose");
const taskSchema = mongoose.Schema({
    taskname : {type: String , required:true},
    subject : {type: String },
    description : {type: String },
    startDate : {type: Date , required:true},
    endDate : {type: Date , required:true},
    createdBy : {
        type: mongoose.Schema.ObjectId,
        ref: 'Users'
    },
    users: [{ type : mongoose.Schema.ObjectId, ref: 'Users' }],
    beneficiary: [{ type : mongoose.Schema.ObjectId, ref: 'Users' }],
    completed:{ type:Boolean, default:false },
  },{
    timestamps:true
});
taskSchema.virtual('userinfo',{
  ref:'Users',
  localField:'users',
  foreignField:'_id',
})
taskSchema.set('toObject', { virtuals: true });
taskSchema.set('toJSON', { virtuals: true });
var Tasks = mongoose.model('Tasks', taskSchema);
module.exports = { Tasks };
