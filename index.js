const express = require("express");
const bodyParser = require("body-parser");
const connect_db = require("./database");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const path = require("path");
var apiRouter = require("./routes/api");
const sendMail = require("./helpers/mailer");
require("dotenv").config();
var app = express();
// enable files upload
app.use(
  fileUpload({
    createParentPath: true,
  })
);
app.use(express.static("public"));
app.use(express.json({ limit: "15mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.use("/static", express.static(path.join(__dirname, "public")));
app.use("/api/", apiRouter);
app.get("/", (req, res) => {
  res.send({ message: "Node Project connected" });
});

// chron Jobs start from here

// cron.schedule("0 1 * * *", async () => {
//   console.log("running a task every day 1am");
//   await sendMail({
//     to: "sumit@kodnest.com",
//     message: "Hi you got this  alert from cron jobs",
//     subject: "Cron Schedular",
//     template: `<h1>Hi you got this  alert from cron jobs</h1>`,
//   });
// });

// chron Jobs ends here
app.listen(5001, async () => {
  console.log("Server started at :5001");
  if (await connect_db()) {
    console.log("Database connected");
  } else {
    console.log("Database not connected");
  }
});
