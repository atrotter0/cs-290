function getData() {
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
  $('.country-select').empty();
  $('.country-select').append($('<option>', {
    value: '',
    text: 'Select Country'
  }));
  for(i = 0; i < data.length; i++) {
    $('.country-select').append($('<option>', {
      value: data[i].country,
      text: data[i].country
    }));
  }
}

function addCountry(newCountry) {
  $.ajax({
    url:"/exchange/country",
    method:"PUT",
    data: { country: newCountry },
    success: function(data) {
      resetFields();
      alert('Successfully created new country: ' + newCountry.country);
    },
    error: function(err, data) {
      console.log('Error creating new country: ' + JSON.stringify(err));
    }
  })
}

function buildCountryObject() {
  var country = {
    "country": $('#country-add').val(),
    "notation": $('#notation-add').val(),
    "currency": $('#currency-add').val(),
    "rate": $('#rate-add').val(),
    "commission": $('#commission-add').val()
  };
  return country;
}

function resetFields() {
  $('input[type=text]').each(function() {
    $(this).val('');
  });
}

function addCountryElements() {
  elementList = ['#country-add', '#currency-add', '#notation-add', '#rate-add', '#commission-add'];
  return elementList;
}

function noEmptyFields(myElements) {
  var flag = true;
  for(var i = 0; i < myElements.length; i++) {
    if ($(myElements[i]).val() == '') {
      flag = false;
    }
  };
  return flag;
}

$(document).ready(function() {
    getData();
    
    $('#exchange').click(function() {
      getData();
    });
    
    $('#add-country').click(function(e) {
      e.preventDefault();
      var elements = addCountryElements();
      if (noEmptyFields(elements)) {
        var countryObject = buildCountryObject();
        addCountry(countryObject);
      } else {
        alert('Please fill out all input fields to submit a new country.');
      }
    });
    
    $('.resetBtn').click(function() {
      resetFields();
    });
});
