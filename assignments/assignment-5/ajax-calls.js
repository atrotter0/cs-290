function getData() {
  $.ajax({
    url: "/allCountries",
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
  resetSelect();
  for(i = 0; i < data.length; i++) {
    $('.country-select').append($('<option>', {
      value: data[i],
      text: data[i]
    }));
  }
}

function resetSelect() {
  $('.country-select').empty().append($('<option>', {
    value: '',
    text: 'Select Country'
  }));
  $('.country-select :nth-child(1)').prop('selected', true);
}

function addCountry(newCountry) {
  $.ajax({
    url: "/exchange/country",
    method: "PUT",
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

function resetFields() {
  $('input[type=text]').each(function() {
    $(this).val('');
  });
  $('.country-select :nth-child(1)').prop('selected', true);
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
        alert('Please fill out all fields to submit a new country.');
      }
    });
    
    $('.resetBtn').click(function() {
      resetFields();
    });
});
