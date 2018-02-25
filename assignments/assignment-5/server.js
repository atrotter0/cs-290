var http = require("http");
var mydb = require("./exchangedb.js");
var bodyParser = require('body-parser');
var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

app.get("/", function(req, res) {
  res.sendfile('index.html');
});

app.get('/exchange/findall', mydb.findAll);

app.get('/exchange/:country', mydb.findByCountry);

app.get('/exchange/:country1/:country2/:amount', mydb.runExchange);

var server = app.listen(process.env.PORT, function () {
  console.log("Server listening at "+ process.env.PORT);
})