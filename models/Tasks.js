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
  },{
    timestamps:true
});
taskSchema.set('toObject', { virtuals: true });
taskSchema.set('toJSON', { virtuals: true });
var Tasks = mongoose.model('Tasks', taskSchema);
module.exports = { Tasks };
