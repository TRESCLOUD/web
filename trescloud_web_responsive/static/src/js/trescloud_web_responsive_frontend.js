/* Part of Odoo. See LICENSE file for full copyright and licensing details. */

$(document).ready(function(){
	if(/iPhone|iPad|iPod/i.test(navigator.userAgent) ) {
		$('ul#oe_applications').click(function(){
			$(this).parent().toggleClass('display_website_menu');
		});
	}
});

