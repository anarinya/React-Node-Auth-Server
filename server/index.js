const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const router = require('./router');
const mongoose = require('mongoose');

// db setup --------------------------------------------------------
mongoose.connect('mongodb://localhost:auth/auth');

// app setup -------------------------------------------------------
const app = express();

// setup middleware
// morgan: logs incoming requests
app.use(morgan('combined'));

// parse incoming requests as json, regardless of the request type
app.use(bodyParser.json({ type: '*/*' }));

// use CORS - allow connections from anywhere
// TBD: change for only particular domain
app.use(cors());

// link defined routes to the app
router(app);

// server setup -----------------------------------------------------
const port = process.env.PORT || 3090;

// forward http requests to our app
const server = http.createServer(app);
server.listen(port);

console.log('server listening on port', port);