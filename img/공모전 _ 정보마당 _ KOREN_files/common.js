var responsive;

function setResponsive() {    
    if($(window).width() >1024) responsive = 0;
    else responsive = 1
}
  
$(window).on('load', function () {
    setResponsive();
});  
$(window).on('resize', function () {
    setResponsive();
});
$(document).ready(function(e) {
	setResponsive();	

	//total menu(max-width:1080px)
	$(".header_menu > button").on("click", function() {
		$(".header-search > .closer").trigger("click");
		$(".header_gnb").addClass("open");
	});
	$(".header_gnb .closer").on("click", function() {
		$(".header_gnb").removeClass("open");
	});
	
	//header gnb
	var gnb_pos =  $("#wrap");	
	if(gnb_pos) {
		if(responsive==0){
			$(".gnb_dep01 > li > a").on("mouseenter focus", function() {
				$(".header_gnb").addClass("active");
				$(".gnb_dep02").show().addClass("active");
				$(".gnb_back").addClass("active");
			});
			$(".gnb_back, .gnb_dep01").on("mouseleave",function() {
				$(".gnb_back").removeClass("active");
				$(".header_gnb").removeClass("active");
				$(".gnb_dep02").removeClass("active");
			});
		}
		var $gnbDepth1MobBtn = $(".gnb_dep01 > li > a.m_only");
		$gnbDepth1MobBtn.on("click", function() {
			if($(this).hasClass("active")) {
				$(this).removeClass("active");
				$(this).next().slideUp();
			} else {
				$(this).addClass("active");
				$(this).next().slideDown();
				$(this).next().delay(100).fadeIn();
			}
		});
	}

	//breadcrumb 
	var $breadcrumb = $(".breadcrumb .depth > button");
	var	$breadcrumbChild = $(".breadcrumb .depth ul li > a");
	if(responsive==0){
		$breadcrumb.on("mouseenter focus", function(e) {		
			$(this).addClass('active');
		});
		$breadcrumbChild.on("mouseenter focus", function(e) {		
			$(this).parents('ul').siblings('button').addClass('active');
		});
		$breadcrumb.on("mouseleave focusout", function(e) {		
			$(this).removeClass('active');
		});
		$breadcrumbChild.on("mouseleave focusout",function() {
			$breadcrumb.removeClass('active');
		});
		$(".breadcrumb .depth ul li:last-child").on("mouseleave focusout", function(){
			$breadcrumb.removeClass('active');
		})
	}
	if(responsive==1){
		$breadcrumb.on("click", function(e) {		
			$(this).toggleClass('active');
		});
		$breadcrumb.on("focusout", function(e) {		
			$(this).removeClass('active');
		});
		$breadcrumbChild.on("click focus", function(e) {		
			$(this).parents('ul').siblings('button').addClass('active');
		});
		$breadcrumbChild.on("focusout ",function() {
			$breadcrumb.removeClass('active');
		});
	}
	
	//(min-width:1081px)
	$(".gnb_dep01 > li:last-child .gnb_dep02 > li:last-child a").on("focusout", function() {
		$(".gnb_dep02").hide();
		$(".gnb_back").removeClass("active");
	});

	//video dimm
	var video = $('.pop_video_wrap video').get(0);

	$('.noti_con .open_dimm, .main .open_dimm').on("click", function(){
		$('.dimm_wrap').toggleClass('active');
	})

	$(document).delegate('.dimm_wrap', "click", function(){
		$(this).toggleClass('active');
		video.pause();
		video.currentTime = 0;
	})

	$(document).delegate('.play_button', 'click', function(e) {
		$(this).hide().next().get(0).play();
	});

	// tabs
	$(function () {
		$(".tab_content").hide();
		$(".tab_content:first").show();	
		$("ul.tabs li").click(function () {			
			var activeTab = $(this).attr("rel");
			$("ul.tabs li").removeClass("active");
			$(this).addClass("active");
			$(".tab_content").hide();
			$("#" + activeTab).show();
		});
		$("ul.tabs li").keydown(function(key){
			if(key.keyCode == 13){
				var activeTab = $(this).attr("rel");
				$("ul.tabs li").removeClass("active");
				$(this).addClass("active");
				$(".tab_content").hide();
				$("#" + activeTab).show();
			}
		})
	});

	//skip
	$(function (){
		var $skip = $(".skip_nav1 a");
		$skip.on("focusin", function(){
			$(this).addClass('focus');
		})
		$skip.on("focusout", function(){
			$(this).removeClass('focus');
		})
	})
});