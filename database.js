const mongoose = require('mongoose')
mongoose.connect('mongodb://31.220.58.92:27017/nodedemo',{useNewUrlParser:true, useUnifiedTopology:true},
// mongoose.connect("mongodb://admin:ahgei8Eisuqu4t@31.220.58.92:27017/greymetredb", { useUnifiedTopology: true, useNewUrlParser: true },
err => {
    if(!err)
        console.log('Mongodb connecting succeeded')
    else
    console.log('Error while connectting MongoDB : '.JSON.stringify(err.undefined, 2))
})