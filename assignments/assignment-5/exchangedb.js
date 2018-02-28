var mongo = require('mongodb');
var server = new mongo.Server('localhost',27017,{auto_reconnect:true});
var db = new mongo.Db('exchangedb',server);
db.open(function(err,db) {
  if (!err) {
    console.log("Connected to 'exchangedb' database");
    db.collection('rates',{strict:true},function(err,collection){
      if(err) {
        console.log("The rates collection doesn't exist. Lets populate it..");
        populateDB();
      }
    })
  } else {
    console.log("Looks like a db error: " + err);
  }
});

//preload db
function populateDB() {
  var countries = [
    {country: "India", notation: "Rs", currency: "Rupees", commission:"0.02", multiplier:"65"},
    {country: "Thailand", notation: "thb", currency: "Baht", commission:"0.02", multiplier:"35.5"},
    {country: "Noobville", notation: "nob", currency: "Nobo", commission:"0.02", multiplier:"115.5"}
  ];
  db.collection('rates', function(err, collection) {
    collection.insert(countries, {safe:true}, function(err, result) {
      if (err) console.log("ERROR");
      else console.log("Collection populated.");
    });
  });
}

//get all data from db
exports.findAll = function(req,res) {
  var cursor = db.collection('rates').find( ).toArray(function (err, result) {
    if (!err) {
      res.send(result);
    }
    res.end();
  });
};

//get all countries from db
exports.getAllCountries = function(req,res) {
  console.log("Getting all countries...");
  var cursor = db.collection('rates').find( { country : { $exists : true } } ).toArray(function (err, result) {
    if (!err) {
      var countryList = [];
      for(var i = 0; i < result.length; i++) {
        countryList.push(result[i].country);
      }
      result = countryList;
      res.send(result);
    }
    res.end();
  });
};

//find by country name
exports.findByCountry = function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  var id = req.params.country;
  var amt = 1;
  console.log('Retrieving by country: ' + id );
  returnCountry(req, res, id);
};

//return country from db
function returnCountry(req, res, id) {
  db.collection('rates', function(err, collection) {
    collection.findOne({'country':id}, function(err, item) {
      if (item) {
        res.send(item);
      } else {
        res.send('{"error":"No entry found for country '+ id +'"}');
      }
    });
  });
}

//insert a new country
exports.createCountry = function(req, res) {
  db.collection('rates', function(err, collection) {
    collection.insert({
      "country": req.body.country.country,
      "notation": req.body.country.notation,
      "currency": req.body.country.currency,
      "commission": req.body.country.commission,
      "multiplier": req.body.country.multiplier,
    });
    res.send('created country!');
  });
}

//update a country
exports.updateCountry = function(req, res) {
  db.collection('rates', function(err, collection) {
    collection.findAndModify(
      { "country": req.body.country.country },
      { rating: 1 },
      { $set: {
        "notation": req.body.country.notation,
        "currency": req.body.country.currency,
        "commission": req.body.country.commission,
        "multiplier": req.body.country.multiplier
      }},
      { new: true, upsert: true},
      function(err, doc) {
        console.log('updated country: ' + JSON.stringify(doc));
      }
    );
    res.send('updated country!');
  });
}

//drop db
exports.nuke = function(req, res) {
  console.log('dropping db...');
  db.collection('rates').drop();
  res.send('db dropped. Restart your server to repopulate your db.');
}

//run the currency exchange
exports.runExchange = function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  var id1 = req.params.country1;
  var id2 = req.params.country2;
  var amt = req.params.amount;
  console.log('params:' + id1 + ', ' + id2 + ' ' + amt);
  returnCountryData(req, res, id1, id2, amt);
}

//get country data for each country param
function returnCountryData(req, res, id1, id2, amt) {
  db.collection('rates', function(err, collection) {
    var firstObject, secondObject;
    collection.findOne({'country':id1}, function(err, item1, firstObject) {
      if (item1) {
        firstObject = item1;
        collection.findOne({'country':id2}, function(err, item2, secondObject) {
          if(item2) {
            var secondObject = item2;
            buildResponse(firstObject, secondObject, amt, res, req);
          } else {
            res.send('{"error":"No entry found for country '+ id2 +'"}');
          }
        });
      } else {
        res.send('{"error":"No entry found for country '+ id1 +'"}');
      }
    });
  });
}

//build our response object and make final exchange calculations
function buildResponse(object1, object2, amt, res, req) {
  var usd1 = amt / object1.multiplier;
  var usd2 = amt / object2.multiplier;
  var finalResult = usd1 - usd2;
  console.log("final result: " + finalResult);
  finalResult.toString();
  var resultObject = {
    "name1": object1.country,
    "usd1": usd1,
    "notation1": object1.notation,
    "name2": object2.notation,
    "usd2": usd2,
    "notation2": object2.notation,
    "amount": amt,
    "finalResult": finalResult
  }
  res.send(resultObject);
}
