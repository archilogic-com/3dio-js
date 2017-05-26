var express = require('express');
var app = express();
var fileserver = require('./fileserver.js');

fileserver(app);

app.listen(3000);