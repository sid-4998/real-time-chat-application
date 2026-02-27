const express = require('express');
const dotenv = require('dotenv');
const connectDatabase = require('./config/database');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const authRoute = require('./routes/AuthRoute');
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);


dotenv.config();

const PORT = process.env.PORT
const app = express();

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));

// Connect to database
connectDatabase();

//Routes
app.use('/api/auth', authRoute);


app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
})

