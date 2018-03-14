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
    url: "/login",
    method: "post",
    data: {
      username: username,
      password: password
    },
    success: function(data) {
      console.log('auth success!')
      window.location = '/admin.html';
    },
    error: function(err, data) {
      alert('Error authenticating');
    }
  })
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
});
