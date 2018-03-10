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

$(document).ready(function() {
  $('#nextBtn').click(function() {
    console.log('made it here');
    startGame();
  })
});
