$(document).ready(function () {

	$(".lazy-style").each(function() {

		var styleValue = $(this).data('style');
		$(this).prop('style', styleValue);
	});
});