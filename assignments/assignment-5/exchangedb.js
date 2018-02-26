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

function populateDB() {
  var countries = [
    {country: "India", notation: "Rs", currency: "Rupees", commission:"0.02", multiplier:"65"},
    {country: "Thailand", notation: "thb", currency: "Baht", commission:"0.02", multiplier:"35.5"}
  ];
  db.collection('rates', function(err, collection) {
    collection.insert(countries, {safe:true}, function(err, result) {
      if (err) console.log("ERROR");
      else console.log("Collection populated.");
    });
  });
}

//get all data from DB
exports.findAll = function(req,res) {
  var cursor = db.collection('rates').find( ).toArray(function (err, result) {
    if (!err) {
      res.send(result);
    }
    res.end();
  });
};

//get all countries from DB
exports.getAllCountries = function(req,res) {
  console.log("in getAllCountries");
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
  returnCountryRates(req, res, id, amt);
};

//return country rates in usd
function returnCountryRates(req, res, id, amt) {
  db.collection('rates', function(err, collection) {
    collection.findOne({'country':id}, function(err, item) {
      if (item) {
        var notation = item.notation;
        console.log("notation = " + notation);
        var multiplier = item.multiplier;
        var myresp = "{\"usd \":\"" + amt + "\",\"" + notation + "\":\"" + multiplier*amt + "\"}";
        res.send(myresp);
      } else {
        res.send('{"error":"No entry found for country '+id+'"}');
      }
    });
  });
}

//run the currency exchange - needs work
exports.runExchange = function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  var id1 = req.params.country1;
  var id2 = req.params.country2;
  var amt = req.params.amount;
  console.log('params:' + id1 + ', ' + id2 + ' ' + amt);
  var result1 = returnCountryData(req, res, id1, amt);
  var result2 = returnCountryData(req, res, id2, amt);
  console.log('result1: ' + result1);
  console.log('result2: ' + result2);
  calculateExchange(result1, result2, amt, req, res);
}

//needs work
function returnCountryData(req, res, id, amt) {
  var multiplier = 0;
  db.collection('rates', function(err, collection, multiplier) {
    collection.findOne({'country':id}, function(err, item, multiplier) {
      if (item) {
        multiplier = item.multiplier;
        console.log('multiplier: ' + multiplier);
        return multiplier;
        res.end();
      } else {
        console.log(err);
      }
    });
  });
}

//needs work
function calculateExchange(result1, result2, amt, req, res) {
  var calculation = amt * result2;
  console.log('calculation: '+ calculation);
  var finalCalculation = calculation.toString();
  res.send(finalCalculation);
}

//insert a new country
exports.createCountry = function(req, res) {
  db.collection('rates', function(err, collection) {
    collection.insert({
      "country": req.body.country.country,
      "currency": req.body.country.currency,
      "notation": req.body.country.notation,
      "rate": req.body.country.rate,
      "commission": req.body.country.commission
    });
    res.send('success!');
  });
}
