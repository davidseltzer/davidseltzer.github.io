$(document).ready(function () {

	$("iframe.progressive-iframe").each(function() {

		var srcValue = $(this).data('src');
		$(this).prop('src', srcValue);
	});
});