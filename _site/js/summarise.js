$(document).ready(function() {
 // hides the section as soon as the DOM is ready
  $('.hide_this').hide();
  $('.showhide').click(function(e) {
	var div = $(this).attr('href');
	//alert(div);
    $(div).toggle(400);
    return false;
  });
});