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
    {category: "html", pointValue: "100", questionText: "What is on the first line of an HTML document?", answerText:"<!DOCTYPE html>"},
    {category: "html", pointValue: "200", questionText: "Another question2", answerText:"some answer2"},
    {category: "html", pointValue: "300", questionText: "Another question3", answerText:"some answer3"},
    {category: "html", pointValue: "400", questionText: "Another question4", answerText:"some answer4"},
    {category: "html", pointValue: "500", questionText: "Another question5", answerText:"some answer5"}
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
        res.status(400).send();
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
    res.status(400).send();
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

//find question based on category
exports.getDataForCategory = function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  var id = req.params.category;
  console.log('our category param: ' + id);
  returnCategory(req, res, id);
}

function returnCategory(req, res, id) {
  var cursor = db.collection('questions').find({ category: id }).toArray(function (err, result) {
    if (!err) {
      var item = result;
      res.send(item);
    }
    res.end();
  });
}

//return question for a given category and point value
exports.questionByCategoryAndPtVal = function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  var id = req.params.category;
  var ptVal = req.params.pointValue;
  console.log('our params: ' + id + ' ' + ptVal);
  returnQuestion(req, res, id, ptVal);
}

function returnQuestion(req, res, id, ptVal) {
  var cursor = db.collection('questions').find({ category: id, pointValue: ptVal }).toArray(function (err, result) {
    if (!err) {
      var item = result;
      res.send(item);
    }
    res.end();
  });
}

//update a question
exports.updateQuestion = function(req, res) {
  if (req.cookies.loggedIn) {
    console.log('user is logged in');
    runUpdateQuestion(req, res);
  } else {
    res.send('You cannot perform this action unless you are logged in.');
  }
}

function runUpdateQuestion(req, res) {
  var safeCategory = decodeURIComponent(req.body.question.category);
  var safePtVal = decodeURIComponent(req.body.question.pointValue);
  var safeQuestion = decodeURIComponent(req.body.question.questionText);
  var safeAnswer = decodeURIComponent(req.body.question.answerText);
  db.collection('questions', function(err, collection) {
    collection.findAndModify(
      { category: safeCategory, pointValue: safePtVal },
      { rating: 1 },
      { $set: {
        questionText: safeQuestion,
        answerText: safeAnswer
      }},
      { new: true, upsert: false},
      function(err, doc) {
        console.log('updated question: ' + JSON.stringify(doc));
      }
    );
    res.send('updated question!');
  });
}

//drop db
exports.nuke = function(req, res) {
  console.log('dropping db...');
  db.collection('questions').drop();
  db.collection('users').drop();
  res.send('db dropped. Restart your server to repopulate your db.');
}
