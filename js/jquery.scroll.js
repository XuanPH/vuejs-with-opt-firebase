// anchor in page
$(window).bind('load resize',function(){
	"use strict";
	$(function(){
		$('a[href^="#"]').click(function(){
			if ( $( $(this).attr('href') ).length ) {
				var p = $( $(this).attr('href') ).offset();
				if($(window).width() > 768){
					$('html,body').animate({ scrollTop: p.top}, 400);
				}
				else {
					$('html,body').animate({ scrollTop: p.top -60}, 400);
				}
			}
			return false;
		});
	});
});

// anchor top page #
$(window).bind('load resize',function(){
	"use strict";
 var hash = location.hash;
 if(hash){
	  var p1 = $(hash).offset();
	if($(window).width > 768){
		
					$('html,body').animate({ scrollTop: p1.top}, 400);
				}
				else {
					$('html,body').animate({ scrollTop: p1.top -60}, 400);
				}
	}

});

//totop
$(document).ready(function() {
	"use strict";
     $("#toTop").hide();
	$(window).scroll(function () {
	 if ($(this).scrollTop() > 600) {
	 $("#toTop").fadeIn();
	 } else {
	 $("#toTop").fadeOut();
	 }
	});
});


