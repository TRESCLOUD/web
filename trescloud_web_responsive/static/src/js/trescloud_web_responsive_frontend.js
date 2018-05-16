/* Copyright 2016 LasLabs Inc.
 * License LGPL-3.0 or later (http://www.gnu.org/licenses/lgpl). */

$(document).ready(function(){
	if(/iPhone|iPad|iPod/i.test(navigator.userAgent) ) {
		$('ul#oe_applications').click(function(){
			$(this).parent().toggleClass('display_website_menu');
		});
	}
});

