$(document).ready(function () {

	$("iframe[data-src]").each(function() {

		var srcValue = $(this).data('src');
		$(this).prop('src', srcValue);
	});
});