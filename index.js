require('./database')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fileUpload = require('express-fileupload');
var apiRouter = require("./routes/api");
require("dotenv").config();
var app = express()
// enable files upload
app.use(fileUpload({
    createParentPath: true
}));
app.use(bodyParser.json())
app.use(cors({origin:'http://localhost:3000', 
credentials:true,            //access-control-allow-credentials:true
optionSuccessStatus:200}))
app.use("/api/", apiRouter);
app.get("/" , (req , res) => {
    res.send({ message: "Node Project connected"});
});
app.listen(4000,() => console.log('Server started at :4000'))