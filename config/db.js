const mongoose = require("mongoose");
require("dotenv").config();
const config = require('./config');
const { mongo: { db } } = config;

const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            connectTimeoutMS: 20000,
            maxPoolSize: 10,
            socketTimeoutMS: 15000
        });
        console.log("Mongodb connected.. ");
    } catch (error) {
        console.error(error);
        //Exit process with failure
        process.exit(1);
    }
};

module.exports = connectDB;
