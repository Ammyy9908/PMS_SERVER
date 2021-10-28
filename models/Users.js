var mongoose = require("mongoose");
const userSchema = mongoose.Schema({
    fullname : {type: String , required:true},
    designation : {type: String },
    organization : {type: String },
    fathername : {type: String },
    mobile : {type: String , unique : true, required : true },
    email : {type: String , unique : true, required : false },
    aadhar : {type: String , unique : true, required : false },
    dateofbirth : {type: String },
    password : {type: String },
    otp : {type: String },
    zoneId: [{ type : mongoose.Schema.ObjectId, ref: 'Zones' }],
    active:{ type:Boolean, required: true , default:1},
  },{
    timestamps:true
});
userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });
var Users = mongoose.model('Users', userSchema);
module.exports = { Users };
