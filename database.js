const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();

async function db_connect() {
    try {
        const is_connect = await mongoose.connect(process.env.MONGO_DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        return is_connect;
    } catch (e) {
        console.log(e);
        return false;
    }
}

module.exports = db_connect;
