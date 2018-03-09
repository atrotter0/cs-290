var mongo = require('mongodb');
var server = new mongo.Server('localhost',27017,{auto_reconnect:true});
var db = new mongo.Db('jeopardydb',server);
db.open(function(err,db) {
  if (!err) {
    console.log("Connected to 'jeopardydb' database");
    db.collection('questions',{strict:true},function(err,collection){
      if(err) {
        console.log("The jeopardy collection doesn't exist. Lets populate it...");
        populateDB();
      }
    })
  } else {
    console.log("Looks like a db error: " + err);
  }
});

//preload db
function populateDB() {
  var questions = [
    {category: "HTML", pointValue: "100", questionText: "What is on the first line of an HTML document?", answerText:"<!DOCTYPE html>"}
  ];
  db.collection('questions', function(err, collection) {
    collection.insert(questions, {safe:true}, function(err, result) {
      if (err) console.log("ERROR");
      else console.log("Collection populated.");
    });
  });
}

//get all data from db
exports.findAll = function(req,res) {
  var cursor = db.collection('questions').find( ).toArray(function (err, result) {
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
  res.send('db dropped. Restart your server to repopulate your db.');
}
