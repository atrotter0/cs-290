var DATA = [];

function startGame() {
  loadCategoryTitles();
  displayGameBoard();
}

function loadCategoryTitles() {
  var listOfIds = checkboxList();
  for(var i = 0; i < listOfIds.length; i++) {
    var checkbox = listOfIds[i];
    var categoryDiv = listOfIds[i].split('-')[0];
    if ($(checkbox).prop('checked')) {
      $(categoryDiv).css('display', 'inline-block');
      console.log('Showing ' + categoryDiv + ' div');
    }
  }
}

function checkboxList() {
  var list = ['#html-checkbox', '#css-checkbox', '#js-checkbox', '#jquery-checkbox', '#node-checkbox', '#mongo-checkbox'];
  return list;
}

function displayGameBoard() {
  $('.welcome-screen-container').css('display', 'none');
  $('.game-container').css('display', 'block');
}

function authenticate(username, password) {
  $.ajax({
    url: '/login',
    method: 'POST',
    data: {
      username: username,
      password: password
    },
    success: function(data) {
      console.log('auth success!');
      document.cookie = "loggedIn=true; expires=Thu, 18 Dec 2018 12:00:00 UTC; path=/";
      window.location = '/admin';
    },
    error: function(err, data) {
      alert('Username or password is incorrect.');
    }
  })
}

function resetAllFields() {
  $('#admin-question-select-block').css('display', 'none');
  $('#question-block').css('display', 'none')
  $('#admin-submit-block').css('display', 'none');
}

function valueSelected(element) {
  var optionVal = $(element).val();
  if (optionVal == "") {
    hideFormDiv();
    return false;
  } else {
    return true;
  }
}

function loadAdminCategoryData(category) {
  $.ajax({
    url: '/jeopardy/' + category,
    success: function(data) {
      saveData(data);
      displayQuestionSelect(data);
    },
    error: function(err, data) {
      alert('Error retrieving category data.');
    }
  })
}

function saveData(questions) {
  DATA = questions;
}

function displayQuestionSelect(data) {
  $('#admin-question-select-block').css('display', 'block');
  loadAdminQuestions(data);
}

function loadAdminQuestions(data) {
  resetSelect();
  for(var i = 0; i < data.length; i++) {
    $('#admin-question-select').append($('<option>', {
      value: data[i].pointValue,
      text: data[i].questionText
    }));
  }
}

function resetSelect() {
  $('#admin-question-select').empty().append($('<option>', {
    value: "",
    text: '-'
  }));
  $('#admin-question-select :nth-child(1)').prop('selected', true);
}

function loadAdminQuestionForm(question) {
  var questionObject = findQuestion(question);
  loadFormFields(questionObject);
  displayFormDiv();
}

function findQuestion(points) {
  for(var i = 0; i < DATA.length; i++) {
    if (DATA[i].pointValue == points) {
      return DATA[i];
    }
  }
}

function loadFormFields(questionObject) {
  console.log('loading form fields');
  $('#admin-point-value').val(questionObject.pointValue);
  $('#admin-question-text').val(questionObject.questionText);
  $('#admin-answer-text').val(questionObject.answerText);
}

function clearFormFields() {
  $('#admin-point-value').val('');
  $('#admin-question-text').val('');
  $('#admin-answer-text').val('');
}

function displayFormDiv() {
  $('#question-block').css('display', 'block')
  $('#admin-submit-block').css('display', 'block');
}

function hideFormDiv() {
  $('#question-block').css('display', 'none')
  $('#admin-submit-block').css('display', 'none');
  clearFormFields();
}

function fieldsHaveValues() {
  if ($('#admin-point-value').val() != '' || $('#admin-question-text').val() != '' || $('#admin-answer-text').val() != '') {
    return true;
  }
}

function buildQuestionObject() {
  var question = {
    'category': encodeURIComponent($('#admin-category-select').val()),
    'pointValue': encodeURIComponent($('#admin-point-value').val()),
    'questionText': encodeURIComponent($('#admin-question-text').val()),
    'answerText': encodeURIComponent($('#admin-answer-text').val())
  };
  return question;
}

function updateQuestion(updatedQuestion) {
  $.ajax({
    url: "/jeopardy/question",
    method: "POST",
    data: { question: updatedQuestion },
    success: function(data) {
      resetSelect();
      hideFormDiv();
      pullNewData();
      alert('Successfully updated question!');
    },
    error: function(err, data) {
      console.log('Error updating question: ' + JSON.stringify(err));
    }
  })
}

function pullNewData() {
  var option = $('#admin-category-select').val();
  loadAdminCategoryData(option);
}

$(document).ready(function() {
  $('#nextBtn').click(function() {
    console.log('next button clicked!');
    startGame();
  })
  
  $('#loginBtn').click(function() {
    var username = $('#username').val();
    var password = $('#password').val();
    authenticate(username, password);
  });

  $('#admin-category-select').change(function() {
    resetAllFields();
    if (valueSelected($(this))) {
      var option = $(this).val();
      loadAdminCategoryData(option);
    }
  });

  $('#admin-question-select').change(function() {
    if (valueSelected($(this))) {
      var pointValue = $(this).val();
      loadAdminQuestionForm(pointValue);
    }
  });

  $('#updateBtn').click(function() {
    if (fieldsHaveValues()) {
      var questionObject = buildQuestionObject();
      updateQuestion(questionObject);
    } else {
      alert('Please fill out all fields to update a question.');
    }
  });
});
