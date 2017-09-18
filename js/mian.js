$(function() {
    var list = $('#list');
    var prev = $('#prev');
    var next = $('#next');
    var index = 1;
    var len = 4;
    var interval = 3000;
    var timer;
    var _width = $(document).width();

    function animate(offset) {
        var left = parseInt(list.css('left')) + offset;
        if (offset > 0) {
            offset = '+=' + offset;
        } else {
            offset = '-=' + Math.abs(offset);
        }
        list.animate({ 'left': offset }, interval / 6, function() {
            if (left < (-_width * len)) {
                list.css('left', -_width);
            }
            if (left > -200) {
                list.css('left', -_width * len);
            }
        });
    }

    function play() {
        timer = setTimeout(function() {
            next.trigger('click');
            play();
        }, interval);
    }

    next.bind('click', function() {
        if (list.is(':animated')) {
            return;
        }
        if (index == len) {
            index = 1;
        } else {
            index += 1;
        }
        animate(-_width);
    });

    prev.bind('click', function() {
        if (list.is(':animated')) {
            return;
        }
        if (index == 1) {
            index = len;
        } else {
            index -= 1;
        }
        animate(_width);
    });

	//左右滑动事件
	var startX_1,moveEndX_1;
	$("#list").on("touchstart", function(e) {
	    startX_1 = e.originalEvent.changedTouches[0].pageX;
	});
	$("#list").on("touchend", function(e) {                  
	    moveEndX_1 = e.originalEvent.changedTouches[0].pageX;
	    X_1 = moveEndX_1 - startX_1;
	    if ( X_1 <0 ) {
	    	//左
	        console.log('左滑'+X_1);
	        if (list.is(':animated')) {
	            return;
	        }
	        if (index == len) {
	            index = 1;
	        } else {
	            index += 1;
	        }
	        animate(-_width);
	    }else if ( X_1 > 0 ) {
	    	//右
	    	console.log('右滑'+X_1);
	        if (list.is(':animated')) {
	            return;
	        }
	        if (index == 1) {
	            index = len;
	        } else {
	            index -= 1;
	        }
	        animate(_width);
	    }
	});
	
    play();


    /*-=-------------------------------*/
    /*tab*/
    function changeTab(a) {
        a.find(".tabNewsTit").find("li").each(function(index) {
            $(this).on("mouseover", function() {
                a.find(".tabNewsList").children("div").hide();
                a.find(".tabNewsList").children("div").eq(index).show();
                a.find(".tabNewsTit").find("li").each(function(index) {
                    $(this).attr('class', '');
                })
                $(this).attr('class', 'active');
                $(this).parents(".tabNews").find(".more a").attr("href", $(this).attr('data-href'));
            });
            $(this).on("mouseout", function() {
                a.find(".tabNewsList").children("div").hide();
                a.find(".tabNewsList").children("div").eq(index).show();
                a.find(".tabNewsTit").find("li").each(function(index) {
                    $(this).attr('class', '');
                })
                $(this).attr('class', 'active');
            });
        });
    }
    changeTab($(".tabNews1"));
    changeTab($(".tabNews2"));

    /*nav*/
    $("nav").off().on("mouseover", ".menuLev_1", function() {
        $(this).children("ul").show();
        $(this).children("a").css("background", "#0066c0");
        $(this).children("a").css("color", "#fff");
    }).on("mouseout", ".menuLev_1", function() {
        $(this).children("ul").hide();
        $(this).children("a").css("background", "#EEEEEE");
        $(this).children("a").css("color", "#3f3f3f");
    }).on("mouseover", ".menuLev_2,.menuLev_3", function() {
        $(this).children("ul").show();
        $(this).children("a").css("background", "#005199");
    }).on("mouseout", ".menuLev_2,.menuLev_3", function() {
        $(this).children("ul").hide();
        $(this).children("a").css("background", "rgba(0,102,192,0.6)");
    });
});


$(window).resize(function() {
    var _width = $(document).width();

    $("#list").eq(0).css("left", -_width);

    $("#list").find("div").each(function() {
        $(this).css("width", _width);
    });
});