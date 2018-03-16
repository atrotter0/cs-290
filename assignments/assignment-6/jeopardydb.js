var mongo = require('mongodb');
var server = new mongo.Server('localhost',27017,{auto_reconnect:true});
var db = new mongo.Db('jeopardydb',server);
db.open(function(err,db) {
  if (!err) {
    console.log("Connected to 'jeopardydb' database");
    db.collection('questions',{strict:true},function(err,collection){
      if(err) {
        console.log("The jeopardy collection doesn't exist. Lets populate it...");
        populateQuestionsDB();
      }
    })
    db.collection('users',{strict:true},function(err,collection){
      if(err) {
        console.log("The jeopardy collection users doesn't exist. Lets populate it...");
        populateUsersDB();
      }
    })
  } else {
    console.log("Looks like a db error: " + err);
  }
});

//preload questions db
function populateQuestionsDB() {
  var questions = [
    {category: "html", pointValue: "100", questionText: "What is on the first line of an HTML document?", answerText:"<!DOCTYPE html>"}
  ];
  db.collection('questions', function(err, collection) {
    collection.insert(questions, {safe:true}, function(err, result) {
      if (err) console.log("ERROR");
      else console.log("Questions collection populated.");
    });
  });
}

//preload users db
function populateUsersDB() {
  var users = [
    {username: "admin", password: "123"},
    {username: "test1", password: "123"}
  ];
  db.collection('users', function(err, collection) {
    collection.insert(users, {safe:true}, function(err, result) {
      if (err) console.log("ERROR");
      else console.log("Users collection populated.");
    });
  });
}

exports.findAndLogin = function(req, res) {
  console.log(req.session);
  var username = req.body.username;
  var password = req.body.password;
  db.collection('users', function(err, collection) {
    collection.findOne({'username': username}, function(err, result) {
      if (result) {
        console.log('found user');
        checkPassword(result, password, req, res);
      } else {
        console.log("danger will robinson, we did not find a user");
        res.status(500).send();
      }
    })
  });
}

function checkPassword(result, password, req, res) {
  if (result.password == password) {
    console.log('matched password, redirecting...');
    res.send(200);
  } else {
    console.log('bad password');
    res.status(500).send();
  }
}

//get all data from questions db
exports.findAll = function(req,res) {
  var cursor = db.collection('questions').find().toArray(function (err, result) {
    if (!err) {
      res.send(result);
    }
    res.end();
  });
};

//drop db
exports.nuke = function(req, res) {
  console.log('dropping db...');
  db.collection('questions').drop();
  db.collection('users').drop();
  res.send('db dropped. Restart your server to repopulate your db.');
}
