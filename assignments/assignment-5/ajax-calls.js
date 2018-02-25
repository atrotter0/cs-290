function getData() { //get existing data from server
  $.ajax({
    url:"/exchange/findall",
    success: function(data) {
      console.log(data);
      loadData(data);
    },
    error: function(err) {
      console.log(err);
    }
  })
}

function loadData(data) {
  populateCountrySelect(data);
}

function populateCountrySelect(data) {
  for(i = 0; i < data.length; i++) {
    $('.country-select').append($('<option>', {
      value: data[i].country,
      text: data[i].country
    }));
  }
}

$(document).ready(function() {
    getData();
});
