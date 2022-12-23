const mongoose = require('mongoose')
// mongoose.connect('mongodb://31.220.58.92:27017/nodedemo',{useNewUrlParser:true, useUnifiedTopology:true},
// // mongoose.connect("mongodb://admin:ahgei8Eisuqu4t@31.220.58.92:27017/greymetredb", { useUnifiedTopology: true, useNewUrlParser: true },
// err => {
//     if(!err)
//         console.log('Mongodb connecting succeeded')
//     else
//     console.log('Error while connectting MongoDB : '.JSON.stringify(err.undefined, 2))
// })


async function db_connect(){
    try{
        const is_connect= await mongoose.connect('mongodb+srv://Sumit:2146255sb8@cluster0.0wij2.mongodb.net/tasks',{useNewUrlParser:true, useUnifiedTopology:true})
        return is_connect
    }
    catch(e){
        console.log(e)
        return false
    }
}

module.exports = db_connect