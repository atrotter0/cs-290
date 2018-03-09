function startGame() {
  loadCategoryTitles();
  displayGameBoard();
}

function loadCategoryTitles() {
  //set each div text to title of category selected
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