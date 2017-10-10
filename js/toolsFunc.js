// 格式化日期
Date.prototype.format = function(fmt) { 
     var o = { 
        "M+" : this.getMonth()+1,                 //月份 
        "d+" : this.getDate(),                    //日 
        "h+" : this.getHours(),                   //小时 
        "m+" : this.getMinutes(),                 //分 
        "s+" : this.getSeconds(),                 //秒 
        "q+" : Math.floor((this.getMonth()+3)/3), //季度 
        "S"  : this.getMilliseconds()             //毫秒 
    }; 
    if(/(y+)/.test(fmt)) {
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
    }
     for(var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
             fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
         }
     }
    return fmt; 
}
// 获取当前年月日
var myDate = new Date().format("yyyy-MM-dd");

jQuery.support.cors = true;

/*获取公共导航栏*/
function initMenu(oList, $con, level) {
    var list = [];
    // 筛选显示的数据
    for(var a in oList){
        if(oList[a].isShow == true){
            list.push(oList[a]);
        }
    }
    for(var index in list){
        var menu = list[index];
        var $menu = $('<li class="menuLev_'+level+'"><a>'+menu.name+'</a></li>');
        if(menu.children.length == 0){
            switch(menu.channelType){
                case "主页":
                    $menu.children("a").attr("href", menu.enName + ".html");
                    break;
                case "文章列表":
                    if(level != 1){
                        $menu.children("a").attr("href", './list.html?id=' + menu.id);
                    }
                    break;
                case "图文列表":
                    if(level != 1){
                        $menu.children("a").attr("href", './piclist.html?id=' + menu.id);
                    }
                    break;
                case "单篇文章":
                    if(level != 1){
                        $menu.children("a").attr("href", './content.html?cId=' + menu.id);
                    }
                    break;
                case "图片列表":
                    if(level != 1){
                        $menu.children("a").attr("href", './specialList.html?id=' + menu.id);                
                    }
                    break;
                case "外部链接":
                    if(level != 1){
                        $menu.children("a").attr("href", menu.url);                
                    }
                    break;
            }
        }else{
            switch(menu.channelType){
                case "主页":
                    $menu.children("a").attr("href", menu.enName + ".html");
                    break;
            }
        }
        /*特殊栏目*/
        if(menu.name=="专题专栏"){
            $menu.children("a").attr("href", './specialList.html?id=' + menu.id);                
        }
        if(menu.name=="专家答疑"){
            $menu.children("a").attr("href", 'ask.html');                
        }
        if(menu.children && menu.children.length){
            var $ul = $('<ul></ul>').appendTo($menu);
            initMenu(menu.children,  $ul, level+1);
        }
        $menu.appendTo($con);
    }    
}

//Link
function initFixedLink(menu, $con){
    if (!menu || !menu.children) return;
    var newList = menu.children;
    var dom = '<ul>';
    for(var a in newList){
        switch(newList[a].channelType){
            case "主页":
                dom += ('<li><a href="'+ newList[a].enName + '.html">'+ newList[a].name +'></a></li>');
                break;
            case "文章列表":
                dom += ('<li><a href="./list.html?id=' + newList[a].id + '">'+ newList[a].name +'></a></li>');
                break;
            case "单篇文章":
                dom += ('<li><a href="./content.html?cId=' + newList[a].id + '">'+ newList[a].name +'></a></li>');
                break;
            case "图片列表":
                dom += ('<li><a href="./specialList.html?id=' + newList[a].id + '">'+ newList[a].name +'></a></li>');
                break;
            case "外部链接":
                dom += ('<li><a href="'+ newList[a].url +'">'+ newList[a].name +'></a></li>');
                break;
            case "图文列表":
                dom += ('<li><a href="./piclist.html?id=' + newList[a].id +'">'+ newList[a].name +'></a></li>');
                break;
        }
    }
    dom += "</ul>";
    $(dom).appendTo($con);
}

//bottomBar-Link
function initBottomLink(menu){
    // 关于协会
    if($(".menuLev_2:nth-child(1) a").attr("href")){
        $(".footerLink a:nth-child(1)").attr("href", $(".menuLev_2:nth-child(1) a").attr("href"));
    }else{
        console.log('关于协会链接异常');
    }
    // 网站地图
    $(".footerLink a:nth-child(2)").attr("href", "map.html");
    // 联系我们
    $("nav li").each(function(){
        if($(this).text() == "联系我们"){
            $(".footerLink a:nth-child(3)").attr("href", $(this).find("a").attr("href"));
        }
    });
}

// 根据title获取栏目index
function findChannelIndex(menu, title) {
    var menuIndex = 0;
    for (var a in menu) {
        if (menu[a].name == title) {
            menuIndex = a;
        }
        if(menu[a].children){
            findChannelId(menu[a].children, title);
        }
    }
    return menuIndex;
}

var menuId = 0;
function findChannelId(menu, title) {
    for (var a in menu) {
        if (menu[a].name == title) {
            menuId = menu[a].id;
        }
        if(menu[a].children){
            findChannelId(menu[a].children, title);
        }
    }
    return menuId;
}

//给搜索按钮绑定方法
function searchBtnFun(){
    $(".topSearch button").on("click",function(){
    	var $url=escape($(".topSearch input").val());
    	if($url !== ''){
    		window.open('./searchList.html?search='+$url, "_self");    		
    	}
    });
    $(".topSearch input").on("click",function(){
        $(document).keydown(function(event){ 
            if(event.keyCode == 13){ 
                $('.topSearch button').click(); 
            } 
        });
    });
}

// 获取协会动态
function initXhdtDom(menu, title, titClassName, sliderClassName) {
    // 根据标题获取Id
    var channelId = findChannelId(menu, title);
    var headOption = {
        channelId: channelId,
        search: "",
        orderName: "conDate",
        orderValue: "desc",
        pageSize: 1,
        pageIndex: 1
    };
    var RecomOption = {
	    channelId: channelId,
	    search: "",
	    orderName: "conDate",
	    orderValue: "desc",
	    pageSize: 6,
	    pageIndex: 1
	};
    //插入标题
    var xhdtTit = '<div class="listTit"><h3><span>'+title+'</span></h3><span class="more"><a href="./list.html?id='+ channelId + '">更多+</a></span></div>';
	$(xhdtTit).appendTo($("div."+titClassName));
	//定义列表,轮播
    var xhdt_head = '',
    	silder = '',
    	silder = '<ul class="items">';
    getHeadList(headOption, function(json) {
    	if(json.status == "ok"){
    		//判断是否有值
    		if(json.list.length != 0){
    			var headData = json.list[0];
		        switch(headData.contentType){
            		case '文章':
            			xhdt_head = '<div class="listFirst"><h4>'+ headData.title +'</h4><p>'+ headData.summary.substr(0,60) + '...</p><span class="more"><a href="./content.html?id=' + headData.id +'">详细 >></a></span></div>';
            			break;
            		case '链接':
            			xhdt_head = '<div class="listFirst"><h4>'+ headData.title +'</h4><p>'+ headData.summary.substr(0,60) + '...</p><span class="more"><a href="' + headData.mainUrl +'">详细 >></a></span></div>';
            			break;
            	}
				//成功插入头条信息
		    	$(xhdt_head).appendTo($("div."+titClassName));
		    	
		    	//组装silder的dom
		    	if(headData.thumbnail){
                	silder += ('<li><a href="./content.html?id=' + headData.id + '" title="'+ headData.title +'"><img src="'+ headData.thumbnail +'"></a></li>');
               }
    		}else{
    			//没有头条
            	$("div."+titClassName).html("<div style='font-size:20px;line-height:160px;text-align:center;color: rgba(0,0,0,.3);'>暂无头条数据</div>");
        		$("div."+sliderClassName).html("<div style='font-size:20px;line-height:360px;text-align:center;color: rgba(0,0,0,.3);'>暂无数据</div>");
    		}
    	}
    	
    	//加载完第一条之后再加载列表
    	getRecomList(RecomOption, function(json) {
    	    var xhdt_headData = json.list;
    	    //判断列表是否有信息
    		if(xhdt_headData.length != 0){
    			xhdt_head ='<div class="listUl"><ul>';
    	        for (var i = 0;i<xhdt_headData.length;i++) {
    	        	//组装列表信息
    	        	switch(xhdt_headData[i].contentType){
	            		case '文章':
	            			xhdt_head += ('<li><a href="./content.html?id=' + xhdt_headData[i].id +'">'+ xhdt_headData[i].title + '</a><span class="newsData">'+ xhdt_headData[i].conDate.split("T")[0] +'</span></li>');
	            			break;
	            		case '链接':
	            			xhdt_head += ('<li><a href="' + xhdt_headData[i].mainUrl +'">'+ xhdt_headData[i].title + '</a><span class="newsData">'+ xhdt_headData[i].conDate.split("T")[0 ] +'</span></li>');
	            			break;
	            	}
	    	        //组装silder
	    	        if(xhdt_headData[i].thumbnail){
	                	silder += ('<li><a href="./content.html?id=' + xhdt_headData[i].id + '" title="'+ xhdt_headData[i].title +'"><img src="'+ xhdt_headData[i].thumbnail +'"></a></li>');                	
		            }
    	        }
    	        xhdt_head+='</ul></div>'
    	        //插入列表
    	        $(xhdt_head).appendTo($("div."+titClassName));
    	        //silder
				silder += "</ul>";
    	    }else{
    	        $(".xhdt").append("<div style='font-size:20px;line-height:200px;text-align:center;color: rgba(0,0,0,.3);'>暂无数据</div>");
    	    }
			//如果只有一张图片，插如图片，如果没有，插入错误
			if($(silder).find("li").length == 0){
        		$("div."+sliderClassName).html("<div style='font-size:20px;line-height:360px;text-align:center;color: rgba(0,0,0,.3);'>暂无数据</div>");
			}else if($(silder).find("li").length == 1){
				$("div."+sliderClassName).html(silder);
				$('<div class="tips" style="opacity: 0.6;"><div class="title"><a href="'+$(silder).find("li a").attr("href")+'">'+$(silder).find("li a").attr("title")+'</a></div></div>').appendTo($("div."+sliderClassName));
			}else{
            	$("div."+sliderClassName).html(silder);
            	jQuery(function($){
		            $("div."+sliderClassName).slideBox({
		                duration : 0.3,//滚动持续时间，单位：秒
		                easing : 'linear',//swing,linear//滚动特效
		                delay : 5,//滚动延迟时间，单位：秒
		                hideClickBar : false,//不自动隐藏点选按键
		                clickBarRadius : 10
		            });
		        });
			}
    	});
    });
}

//轮播
function initBannerS(menu, title, className){
    var channelId = findChannelId(menu, title);
    var option = {
        channelId: channelId,
        search: "",
        orderName: "conDate",
        orderValue: "desc",
        pageSize: 5,
        pageIndex: 1,
        contentType: "content"
    };
    getPubList(option, function(json) {
        // 组装DOM
        var oList = json.list;
        var sLi = '<ul class="items">';
        if(oList.length != 0){   
            for (var i = 0;i<oList.length;i++) {
                if(oList[i].thumbnail){
                	sLi += ('<li><a href="./content.html?id=' + oList[i].id + '" title="'+ oList[i].title +'"><img src="'+ oList[i].thumbnail +'"></a></li>');                	
                }
            }
            sLi += "</ul>";
            $(sLi).appendTo($("div."+className));
        }else{
            $("#mainBanner").append("<div style='font-size:20px;line-height:300px;text-align:center;color: rgba(0,0,0,.3);'>暂无数据</div>");
        }

        jQuery(function($){
            $("div."+className).slideBox({
                duration : 0.3,//滚动持续时间，单位：秒
                easing : 'linear',//swing,linear//滚动特效
                delay : 5,//滚动延迟时间，单位：秒
                hideClickBar : false,//不自动隐藏点选按键
                clickBarRadius : 10
            });
        });
    });
}

// 获取Tab的新闻列表
function initTabNews(menu, title, className, num){
    var channelId = findChannelId(menu, title);
    var option = {
        channelId: channelId,
        search: "",
        orderName: "conDate",
        orderValue: "desc",
        pageSize: num,
        pageIndex: 1,
        contentType: "content"
    };
    getPubList(option, function(json) {
        // 组装DOM
        var oList = json.list;
        var sLi = '<ul>';
        if(oList.length != 0){
            for (var i = 0;i<oList.length;i++) {
            	switch(oList[i].contentType){
            		case '文章':
            			sLi += ('<li><a href="./content.html?id=' + oList[i].id +'">'+ oList[i].title + '</a><span class="newsData">'+ oList[i].conDate.split("T")[0 ] +'</span></li>');
            			break;
            		case '链接':
            			sLi += ('<li><a href="' + oList[i].mainUrl +'">'+ oList[i].title + '</a><span class="newsData">'+ oList[i].conDate.split("T")[0 ] +'</span></li>');
            			break;
            	}
            }
            sLi += "</ul>";
            $(sLi).appendTo($("div."+className));
        }else{
            $("div."+className).append("<div style='font-size:20px;line-height:200px;text-align:center;color: rgba(0,0,0,.3);'>暂无数据</div>");
        }

        // 修改Tab标题与链接
        if(title == '国内法律法规'){
            $("li."+className).text('法律法规');
        }else{
            $("li."+className).text(title);
        }
        $("li."+className).attr("data-href", './list.html?id=' + channelId);
        $("li."+className).parents(".tabNews").find(".more a").attr("href", $("li.active."+className).attr("data-href"));
    });
}

//友情链接
function initFriendLink(menu, title, className){
    var channelId = findChannelId(menu, title);
    var option = {
        channelId: channelId,
        search: "",
        orderName: "conDate",
        orderValue: "desc",
        pageSize: 6,
        pageIndex: 1,
        contentType: "content"
    };
    getPubList(option, function(json) {
        // 组装DOM
        var oList = json.list;
        var sLi = '<div class="listTit"><h3><span>'+title+'</span></h3><span class="more"><a href="./specialList.html?id=' +channelId +'">更多+</a></span></div><div class="listUl"><ul>';
        if(oList.length != 0){
            for (var i = 0;i<oList.length;i++) {
                sLi += ('<li><a target=_blank href="'+ oList[i].mainUrl +'"><img src="'+ oList[i].mainPic +'"></a></li>');
            }
            sLi += "</ul></div>";
            $(sLi).appendTo($("div."+className));
        }else{
            sLi += "</ul></div>";
            $(sLi).appendTo($("div."+className));
            $(".yqdt .listUl").append("<div style='font-size:20px;line-height:50px;text-align:center;color: rgba(0,0,0,.3);'>暂无数据</div>");
        } 
    });
}

//专题
function initSpecialLink(menu, title, className){
    var channelId = findChannelId(menu, title);
    var option = {
        channelId: channelId,
        search: "",
        orderName: "conDate",
        orderValue: "desc",
        pageSize: 3,
        pageIndex: 1,
        contentType: "content"
    };
    getPubList(option, function(json) {
        // 组装DOM
        var oList = json.list;
        var sLi = '<ul>';
        if(oList.length != 0){
            for (var i = 0;i<oList.length;i++) {
                sLi += ('<li><a target=_blank href="'+ oList[i].mainUrl +'"><img src="'+ oList[i].mainPic +'"></a></li>');
            }
            sLi += "</ul>";
            $(sLi).appendTo($("div."+className));
        }else{
            $(".yqdt .listUl").append("<div style='font-size:20px;line-height:300px;text-align:center;color: rgba(0,0,0,.3);'>暂无数据</div>");
        }   
    });
}

//轮播
function initBannerB(menu, title, className){
    var channelId = findChannelId(menu, title);
    var option = {
        channelId: channelId,
        search: "",
        orderName: "conDate",
        orderValue: "desc",
        pageSize: 4,
        pageIndex: 1,
        contentType: "content"
    };
    getPubList(option, function(json) {
        // 组装DOM
        var oList = json.list;
        var sLi = '';

        if(oList.length != 0){   
            sLi += ('<div style="background-image: url('+ oList[oList.length-1].mainPic +');" alt="'+ oList.length +'"></div>')
            for (var i = 0;i<oList.length;i++) {
                sLi += ('<div style="background-image: url('+ oList[i].mainPic +');" alt="'+ (i+1) +'"></div>');
            }
            sLi += ('<div style="background-image: url('+ oList[0].mainPic +');" alt="'+ 1 +'"></div>');
            $(sLi).appendTo($("div."+className));

            var _width = $(document).width();

            $("#list").eq(0).css("left",-_width);

            $("#list").find("div").each(function(){
                $(this).css("width",_width);
            });
        }else{
            $("#container").css({
                "background":"url(img/banner1.png)"
            });
        }
    });
}

/*组装列表-搜索列表页*/
function initList(list,$dom1,$dom2,num){
    $dom1.empty();
    for(var a in list.list){
    	var $content;
    	switch(list.list[a].contentType){
    		case '文章':
    			$content=$("<li><a href='./content.html?id=" + list.list[a].id +"'>"+list.list[a].title+"</a><span>"+list.list[a].conDate.split(/T/g)[0]+"</span></li>");
    			break;
    		case '链接':
    			$content=$("<li><a href='" + list.list[a].mainUrl +"'>"+list.list[a].title+"</a><span>"+list.list[a].conDate.split(/T/g)[0]+"</span></li>");
    			break;
    	}
        $content.appendTo($dom1);
    }
    	
    if(num>1){
        if(contentListOpt.pageIndex==1){
            $dom2.find(".prevPage").addClass("inActive");
            $dom2.find(".nextPage").attr("class","nextPage");
        }else if(contentListOpt.pageIndex==num){
            $dom2.find(".prevPage").attr("class","prevPage");
            console.log("se");
            $dom2.find(".nextPage").addClass("inActive");
        }else{
            $dom2.find(".nextPage").attr("class","nextPage");
            $dom2.find(".prevPage").attr("class","prevPage");
        }
    }else{
        $dom2.find(".prevPage,.nextPage").addClass("inActive");
    }
    $dom2.find(".current").html(contentListOpt.pageIndex);
    $dom2.find(".totalPage").html(num);
    $dom2.find(".totalNumber").html(list.currentTotal);
}

function initAskList(list,$dom1,$dom2,num){
    $dom1.empty();
    for(var a in list.list){
        var $content=$("<li><a href='./askContent.html?id=" + list.list[a].id +"'>"+list.list[a].ask+"</a><span>"+list.list[a].askTime.split(/ /g)[0]+"</span><p>"+list.list[a].answer+"</p></li>");
        $content.appendTo($dom1);
    }
    
    if(num>1){
        if(wordListOpt.pageIndex==1){
            $dom2.find(".prevPage").addClass("inActive");
            $dom2.find(".nextPage").attr("class","nextPage");
        }else if(wordListOpt.pageIndex==num){
            $dom2.find(".prevPage").attr("class","prevPage");
            console.log("se");
            $dom2.find(".nextPage").addClass("inActive");
        }else{
            $dom2.find(".nextPage").attr("class","nextPage");
            $dom2.find(".prevPage").attr("class","prevPage");
        }
    }else{
        $dom2.find(".prevPage,.nextPage").addClass("inActive");
    }
    $dom2.find(".current").html(wordListOpt.pageIndex);
    $dom2.find(".totalPage").html(num);
    $dom2.find(".totalNumber").html(list.currentTotal);
}



// 验证手机号
function isPhone(phone) { 
    var pattern = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/; 
    return pattern.test(phone); 
}
 
// 验证身份证 
function isCardNo(card) { 
    var pattern = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; 
    return pattern.test(card); 
} 

// 验证域名
function isHref(href) { 
    var pattern = /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i; 
    return pattern.test(href); 
} 

// 验证邮箱
function isEmail(mail) { 
    var pattern = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/; 
    return pattern.test(mail); 
} 

// 验证邮编
function isZip(zip) { 
    var pattern = /^[1-9]\d{5}(?!\d)$/; 
    return pattern.test(zip); 
}

// 验证电话
function isTel(tel) { 
    var pattern = /^([0-9]|[\-])+$/;
    return pattern.test(tel); 
}

// 验证时间
function isDate(date) { 
    var pattern = /^[1-2][0-9][0-9][0-9]-[0-1]{0,1}[0-9]-[0-3]{0,1}[0-9]$/; 
    return pattern.test(date); 
}