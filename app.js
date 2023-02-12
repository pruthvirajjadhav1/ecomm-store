const express = require('express')
require('dotenv').config();
const app = express();
const morgan = require('morgan');
app.use(morgan("tiny"));
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');


// swaggere documentation
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// regular middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// cookieParser and fileUpload middleware
app.use(cookieParser());
app.use(fileUpload());

// import all routes here
const home = require('./routes/home');

// routes middleware
app.use("/api/v1",home);

// THIS EXPORTS THE APP
module.exports = app;