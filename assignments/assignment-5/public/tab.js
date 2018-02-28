function openTab(element) {
    hideAll();
    $('#' + element.id + '-tab').css('display', 'block');
    $('#' + element.id).css('background-color', '#ccc');
}

function hideAll() {
    $('.tabcontent').hide();
    $('.tablinks').css('background-color', '#f1f1f1');
}

function defaultOpen() {
    $('#exchange-tab').css('display', 'block');
    $('#exchange').css('background-color', '#ccc');
}

$(document).ready(function() {
    defaultOpen();

    $('.tablinks').click(function() {
        openTab(this);
    });
});