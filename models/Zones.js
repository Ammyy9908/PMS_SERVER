var mongoose = require("mongoose");
const zoneSchema = mongoose.Schema({
    zonename : {type: String , unique : true, required : true },
    active:{ type:Boolean, required: true , default:1},
  },{
    timestamps:true
});
zoneSchema.set('toObject', { virtuals: true });
zoneSchema.set('toJSON', { virtuals: true });
var Zones = mongoose.model('Zones', zoneSchema);
module.exports = { Zones };
