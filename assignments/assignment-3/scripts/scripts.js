const IMAGE_LIST = ['death-star-slide-1.png', 'death-star-slide-2.png', 'death-star-slide-3.png', 'death-star-slide-4.png'];
var POSITION = 0;
var MAX = IMAGE_LIST.length - 1;

/* paragraph content editor */
function enterEditMode(sectionId) {
  var paragraphDisplay = document.getElementById(sectionId + '-display');
  var textEditor = document.getElementById(sectionId + '-editor');
  loadTextInEditor(sectionId, paragraphDisplay);
  show(textEditor);
  hide(paragraphDisplay);
}

function loadTextInEditor(sectionId, element) {
  document.getElementById(sectionId + '-text').value = element.textContent;
}

function loadTextInParagraph(sectionId, element) {
  document.getElementById(sectionId + '-display').innerHTML = element.value;
}

function show(element) {
  element.style.display = 'block';
}

function hide(element) {
  element.style.display = 'none';
}

function submitData(sectionId) {
  var paragraphDisplay = document.getElementById(sectionId + '-display');
  var textEditor = document.getElementById(sectionId + '-editor');
  var editorText = document.getElementById(sectionId + '-text');
  loadTextInParagraph(sectionId, editorText);
  show(paragraphDisplay);
  hide(textEditor);
}

/* left slideshow */
function initSlideshow() {
  startSlideshow();
}

function startSlideshow() {
  if (POSITION >= MAX) {
    POSITION = 0;
    nextImage();
  } else {
    POSITION++;
    nextImage();
  }
}

function nextImage(list) {
  document.getElementById('left-image').src = 'images/' + IMAGE_LIST[POSITION];
}

/* image tiles */
function hideTile(id) {
  document.getElementById(id).style.display = 'none';
}

function restoreTiles() {
  var tileList = document.getElementsByClassName('tile');
  for(i = 0; i < tileList.length; i++) {
    tileList[i].style.display = 'inline-block';
  }
}

function clearTiles() {
  var tileList = document.getElementsByClassName('tile');
  for(i = 0; i < tileList.length; i++) {
    hideTile(tileList[i].id);
  }
}

