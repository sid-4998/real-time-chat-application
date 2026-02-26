const express = require('express');
const dotenv = require('dotenv');
const connectDatabase = require('./config/database');
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);


dotenv.config();

const PORT = process.env.PORT
const app = express();

// Connect to database
connectDatabase();



app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
})

