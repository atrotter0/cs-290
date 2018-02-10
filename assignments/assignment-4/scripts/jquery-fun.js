const IMAGE_LIST = ['death-star-slide-1.png', 'death-star-slide-2.png', 'death-star-slide-3.png', 'death-star-slide-4.png'];
const MAX = IMAGE_LIST.length - 1;
var POSITION = 0;

function startSlideshow() {
  if (POSITION >= MAX) {
    POSITION = 0;
    nextImage();
  } else {
    POSITION++;
    nextImage();
  }
}

function nextImage() {
  var newImage = 'images/' + IMAGE_LIST[POSITION];
  $('.left-image').attr('src', newImage);
}

function enterEditMode(id) {
  var textEditor = id + '-editor';
  loadTextInEditor(id);
  $('#' + textEditor).show();
  $('#' + id).hide();
}

function loadTextInEditor(id) {
  var paragraphContent = $('#' + id).text();
  $('#' + id + '-text').text(paragraphContent);
}

function submitData(object) {
  var textEditor = object.className + '-editor';
  loadTextInParagraph(object.className);
  $('#' + textEditor).hide();
  $('#' + object.className).show();
}

function loadTextInParagraph(elementByClass) {
  var editorContent = $('#' + elementByClass + '-text').val();
  $('#' + elementByClass).text(editorContent);
}

$(document).ready(function(){
  /* slideshow */
  $('.left-image').click(function(){
    startSlideshow();
  });

  /* paragraph editor */
  $('.section').dblclick(function() {
    enterEditMode(this.id);
  });

  $('.section-one, .section-two').click(function() {
    submitData(this);
  });

  /* image tiles */
  $('.tile-x').click(function() {
    $(this).parent('div').parent('div').hide();
  });

  $('#restoreTiles').click(function() {
    $('div').find('.tile').css('display', 'inline-block');
  });

  $('#clearTiles').click(function() {
    $('div').find('.tile').css('display', 'none');
  });
});

