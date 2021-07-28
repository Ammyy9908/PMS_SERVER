var mongoose = require("mongoose");
const userSchema = mongoose.Schema({
    fullname : {type: String , required:true},
    designation : {type: String },
    organization : {type: String },
    fathername : {type: String },
    mobile : {type: String },
    email : {type: String },
    aadhar : {type: String },
    dateofbirth : {type: String },
    password : {type: String },
    active:{ type:Boolean, required: true , default:0},
  },{
    timestamps:true
});
userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });
var Users = mongoose.model('Users', userSchema);
module.exports = { Users };
