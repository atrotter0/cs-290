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
      var update = confirm('An entry already exists for ' + newCountry.country + '. Would you like to update?');
      if (update) {
        updateCountry(newCountry);
      }
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
  alertMsg('Please fill out all fields to submit a new country.', flag);
  return flag;
}

function resetFields() {
  $('input[type=text]').each(function() {
    $(this).val('');
  });
  $('.country-select :nth-child(1)').prop('selected', true);
  clearLog();
  resetBorders();
}

function clearLog() {
  $('#result-1').text("");
  $('#result-2').text("");
  $('#final-result').text("");
}

function countrySelected() {
  var optionVal = $('#country-update-select').val();
  if (optionVal == "") {
    return false;
  } else {
    return true;
  }
}

function getExchangeData(country1, country2, amt) {
  $.ajax({
    url:"/exchange/" + country1 + "/" + country2 + "/" + amt,
    success: function(data) {
      console.log(data);
      displayResults(data);
    },
    error: function(err) {
      console.log('Error retrieving new country: ' + JSON.stringify(err));
   }
  })
}

function displayResults(results) {
  var firstResult = 'Exchange rate for ' + results.name1 + ' for ' + results.amount + ' USD: ' +  results.usd1;
  var secondResult = 'Exchange rate for ' + results.name2 + ' for '  + results.amount + ' USD: ' +  results.usd2;
  var finalResult = 'Exchanging ';
  $('#result-1').text(firstResult);
  $('#result-2').text(secondResult);
  $('#final-result').text(finalResult);
  $('#final-result').append('<span id="currency-span">' + JSON.parse(results.usd1) + '</span>')
    .append(' ' + results.notation1 + ' will give you ').append('<span id="currency-span">' + JSON.parse(results.usd2) + '</span>')
      .append(' ' + results.notation2 + '.');
}

function exchangeCheck() {
  c1 = $('#from-country').val();
  c2 = $('#to-country').val();
  amt = $('#amount').val();
  if( c1 != c2 && amt != "") {
    return true;
  }
  else {
    return false;
  }
}

function onlyLetters() {
  resetBorders();
  var flag = true;
  $('.only-letters').each(function() {
    if ($(this).val().match(/[^a-zA-Z]/)) {
      $(this).css('border', '1px solid red');
      flag = false;
    }
  });
  alertMsg('Please fix the red fields. Only Letters are allowed.', flag);
  return flag;
}

function onlyNumbersAndDecimal() {
  resetBorders();
  var flag = true;
  $('.only-numbers').each(function() {
    if ($(this).val().match(/[^0-9..]/)) {
      $(this).css('border', '1px solid red');
      flag = false;
    }
  });
  alertMsg('Please fix the red fields. Only numbers are allowed.', flag);
  return flag;
}

function resetBorders() {
  $('.only-letters, .only-numbers').each(function() {
    $(this).css('border', '1px solid #ccc');
  });
}

function alertMsg(msg, flag) {
  if (!flag) alert(msg);
}

$(document).ready(function() {
  getData();
  
  $('#exchange, #update').click(function() {
    getData();
    resetFields();
  });
  
  $('#add-country').click(function(e) {
    e.preventDefault();
    var elements = addCountryElements();
    if (noEmptyFields(elements) && onlyLetters() && onlyNumbersAndDecimal()) {
      var countryObject = buildCountryObject('-add');
      addCountry(countryObject);
    }
  });
  
  $('#country-update-select').change(function() {
    var option = $(this).val();
    if (option != "") {
      getCountryData(option);
      resetBorders();
    } else {
      resetFields();
    }
  });
  
  $('#update-country').click(function(e) {
    e.preventDefault();
    var elements = updateCountryElements();
    if (noEmptyFields(elements) && countrySelected() && onlyLetters() && onlyNumbersAndDecimal()) {
      var countryObject = buildCountryObject('-update');
      countryObject.country = $('#country-update-select').val();
      updateCountry(countryObject);
    }
  });
  
  $('.resetBtn').click(function() {
    resetFields();
  });
  
  $('#exchangeBtn').click(function(e) {
    e.preventDefault();
    var country1 = $('#from-country').val();
    var country2 = $('#to-country').val();
    var amt = $('#amount').val();
    if (exchangeCheck()) {
      getExchangeData(country1, country2, amt);
    } else {
      alert('Please enter a valid amount, and select two unique countries.'); 
    }
  });
});
