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

function updateCountry(updatedCountry) {
  $.ajax({
    url: "/exchange/country",
    method: "POST",
    data: { country: updatedCountry },
    success: function(data) {
      resetFields();
      alert('Successfully updated country: ' + updatedCountry.country);
    },
    error: function(err, data) {
      console.log('Error creating new country: ' + JSON.stringify(err));
    }
  })
}

function getCountryData(country) {
  $.ajax({
    url:"/exchange/" + country,
    success: function(data) {
      loadUpdateFields(data);
    },
    error: function(err) {
      console.log('Error updating new country: ' + JSON.stringify(err));
   }
  })
}

function loadUpdateFields(country) {
  $("#currency-update").val(country.currency);
  $("#notation-update").val(country.notation);
  $("#rate-update").val(country.multiplier);
  $("#commission-update").val(country.commission);
}

function buildCountryObject(idPart) {
  var country = {
    "country": $('#country' + idPart).val(),
    "notation": $('#notation' + idPart).val(),
    "currency": $('#currency' + idPart).val(),
    "multiplier": $('#rate' + idPart).val(),
    "commission": $('#commission' + idPart).val()
  };
  return country;
}

function addCountryElements() {
  elementList = ['#country-add', '#currency-add', '#notation-add', '#rate-add', '#commission-add'];
  return elementList;
}

function updateCountryElements() {
  elementList = ['#country-update', '#currency-update', '#notation-update', '#rate-update', '#commission-update'];
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

function countrySelected() {
  var optionVal = $('#country-update-select').val();
  if (optionVal == "") {
    return false;
  } else {
    return true;
  }
}

$(document).ready(function() {
  getData();
  
  $('#exchange, #update').click(function() {
    getData();
  });
  
  $('#add-country').click(function(e) {
    e.preventDefault();
    var elements = addCountryElements();
    if (noEmptyFields(elements)) {
      var countryObject = buildCountryObject('-add');
      addCountry(countryObject);
    } else {
      alert('Please fill out all fields to submit a new country.');
    }
  });
  
  $('#country-update-select').change(function() {
    var option = $(this).val();
    if (option != "") {
      getCountryData(option);
    } else {
      resetFields();
    }
  });
  
  $('#update-country').click(function(e) {
    e.preventDefault();
    var elements = updateCountryElements();
    if (noEmptyFields(elements) && countrySelected()) {
      var countryObject = buildCountryObject('-update');
      countryObject.country = $('#country-update-select').val();
      updateCountry(countryObject);
    } else {
      alert('Please fill out all fields to update a country.');
    }
  });
  
  $('.resetBtn').click(function() {
    resetFields();
  });
});
