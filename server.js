const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
var path = require('path');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.static(__dirname + '/game'));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

var server = app.listen(2000, function() {
    console.log('Server is running..');
});

app.get('/', function (req, res) {
	res.sendfile('game/index.html');
});
