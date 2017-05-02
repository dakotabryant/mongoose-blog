const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

mongoose.Promise = global.Promise;

const {DATABASE_URL, PORT} = require('./config');
const {Blog} = require('./models');

const app = express();
app.use(bodyParser.json());
