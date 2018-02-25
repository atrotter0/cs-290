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
  console.log("in findall");
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

//run the currency exchange
exports.runExchange = function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  var id1 = req.params.country1;
  var id2 = req.params.country2;
  var amt = req.params.amount;
  console.log('params:' + id1 + ', ' + id2 + ' ' + amt);
  calculateExchange(id1, id2, amt, req, res);
}

function calculateExchange(id1, id2, amt, req, res) {
  
}

function findExchangeData(req, res, id1, id2, amt) {
  var item1, item2;
}
