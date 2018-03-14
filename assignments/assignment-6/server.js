var http = require("http");
var mydb = require("./jeopardydb.js");
var bodyParser = require('body-parser');
var express = require('express');
var app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

app.get("/", function(req, res) {
  res.sendfile('public/index.html');
});

app.get("/login", function(req, res) {
  res.sendfile('public/login.html');
});

app.get("/admin", function(req, res) {
  res.sendfile('public/admin.html');
});

app.post('/login', mydb.findAndLogin);

app.get('/jeopardy/findall', mydb.findAll);

//do not run unless you want to drop your existing db and start from scratch
app.get('/nuke', mydb.nuke);

var server = app.listen(process.env.PORT, function () {
  console.log("Server listening at "+ process.env.PORT);
})
