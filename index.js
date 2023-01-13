
const express = require('express')
const bodyParser = require('body-parser')
const connect_db = require('./database')
const cors = require('cors')
const fileUpload = require('express-fileupload');
var apiRouter = require("./routes/api");
require("dotenv").config();
var app = express()
// enable files upload
app.use(fileUpload({
    createParentPath: true
}));
app.use(express.json())
app.use(cors())
app.use("/api/", apiRouter);
app.get("/" , (req , res) => {
    res.send({ message: "Node Project connected"});
});
app.listen(5001,async () => {
    console.log('Server started at :5001')
    if(await connect_db()){
        console.log("Database connected")
    }
    else{
        console.log("Database not connected")
    }
})
