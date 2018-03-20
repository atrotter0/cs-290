var currentScoreAmount = 300;
var team1Score = 0;
var team2Score = 0;
var team3Score = 0;
var team4Score = 0;
var pointsClicked = false;

var DATA = [];

function startGame() {
  if (checkBoxesCheck() == true && teamNameCheck() == true) {
  loadCategoryTitles();
  displayGameBoard();
  displayTeamNames();
  }
  else {
    alert("Please select 5 categories and provide a team name in the team 1 and 2 fields.");
  }
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

function displayTeamNames() {
  var team1name = $("#team-1-name-input").val() + ": ";
  var team2name = $("#team-2-name-input").val() + ": ";
  var team3name = $("#team-3-name-input").val() + ": ";
  var team4name = $("#team-4-name-input").val() + ": ";
  $(".team-1-name").text(team1name);
  $(".team-2-name").text(team2name);
  $(".team-3-name").text(team3name);
  $(".team-4-name").text(team4name);
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
  
  $(".question-point-block").click(function() {
  if ($(".question-window").css("display") == "none") {
    var pointValue = $(this).text();
    var categoryTemp = $(this).parent();
    var category = $(categoryTemp).attr('id');
    getQuestion(category, pointValue);
  $(this).addClass('answered');
  }
  });
  
  $('.question-close').click(function() {
    $('.question-window').css('display', 'none');
    $('.answer-field').css('display', 'none');
  });

  $('.show-answer').click(function() {
    $('.answer-field').css('display', 'block');
  });
  
  $('#team-1-score-button').click( function() {
    if (pointsClicked == false){
    addPoints(1);
    }
  });
  
  $('#team-2-score-button').click( function() {
    if (pointsClicked == false){
    addPoints(2);
    }
  });
  
  $('#team-3-score-button').click( function() {
    if (pointsClicked == false){
    addPoints(3);
    }
  });
  
  $('#team-4-score-button').click( function() {
    if (pointsClicked == false){
    addPoints(4);
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

function getQuestion(category, pointVal){
    $.ajax({
     url: "/jeopardy/" + category + "/" + pointVal,
    success: function(data) {
      console.log(data);
      displayQuestion(data);
    },
    error: function(err) {
      console.log('Error retrieving question: ' + JSON.stringify(err));
   }
  });
}

function displayQuestion(data){
    currentScoreAmount = parseInt(data[0].pointValue);
    pointsClicked = false;
    console.log(currentScoreAmount);
    $('.question-field').text(data[0].questionText);
    $('.answer-field').text(data[0].answerText);
    $('.question-window').css('display', 'block');
}

function addPoints(val) {
    if (val == 1){
        team1Score += currentScoreAmount;
        console.log(team1Score);
        $(".team1-score-tracker").text(JSON.stringify(team1Score));
    }
    else if (val == 2) {
        team2Score += currentScoreAmount;
        $(".team2-score-tracker").text(JSON.stringify(team2Score));
    }
    else if (val == 3) {
        team3Score += currentScoreAmount;
        $(".team3-score-tracker").text(JSON.stringify(team3Score));
    }
    else if (val == 4){
        team4Score += currentScoreAmount;
        $(".team4-score-tracker").text(JSON.stringify(team4Score));
    }
    else {
        console.log("this function only takes values 1-4 as params");
    }
    pointsClicked = true;
}

function checkBoxesCheck() {
  var counter = 0
  var listOfIds = checkboxList()
  for (var i = 0; i < 6; ++i){
    var checkbox = listOfIds[i];
    if ($(checkbox).prop('checked')) {
      counter++;
    }
  }
  if (counter == 5) {
    return true;
  }
  else {
    return false;
  }
}

function teamNameCheck() {
  if($("#team-1-name-input").val() && $("#team-2-name-input").val() != "" ){
    return true;
  }
  else {
    return false;
  }
}