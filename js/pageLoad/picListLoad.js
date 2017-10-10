;
var menuTitle = 0;
var menuParentTitle = "";
var pId=-1;
var isShow=true;
var sideBar=[];
// 根据ID获取title
function findChannelTitle(menu, id) {
    for (var a in menu) {
        if (menu[a].id == id) {
            menuTitle = menu[a].name;
            pId = menu[a].parentId;
            isShow = menu[a].isShow;
        }
        if (menu[a].children) {
            findChannelTitle(menu[a].children, id);
        }
    }
    return {
        'menuTitle':menuTitle,
        'pId':pId,
        'isShow':isShow
    };
}
// 根据pId获取title
function findParentChannel(menu, id) {
    for (var a in menu) {
        if (menu[a].id == id) {
            menuParentTitle = menu[a].name;
            sideBar.push(menu[a].children);
        }
        if (menu[a].children) {
            findParentChannel(menu[a].children, id);
        }
    }
    return {
    	"menuTitle":menuParentTitle,
    	"children":sideBar
    };
}
var contentListOpt = {
    channelId: 0,
    search: "",
    orderName: "conDate",
    orderValue: "desc",
    pageSize: 20,
    pageIndex: 1,
    contentType: "content"
};
$(function() {    
    searchBtnFun();
    var thisLink = window.location.search;
    var contentId = thisLink.split("?id=")[1];

    contentListOpt.channelId = contentId;

    getMenu(function(menu) {
        $(".topLogo a").attr("href", menu[0].enName+'.html');
        // 获取导航
        initMenu(menu, $("nav ul"), 1);
        // 关于协会、加入协会
        var configMenu = menu[0].children[0].children;
        configMenuIndexGyxh = findChannelIndex(configMenu, "关于协会");
        configMenuIndexrxh = findChannelIndex(configMenu, "加入协会");
        initFixedLink(configMenu[configMenuIndexGyxh],$(".linkPart:nth-child(2) div.linkPartCon"));
        initFixedLink(configMenu[configMenuIndexrxh],$(".linkPart:nth-child(3) div.linkPartCon"));

        $(".mainCenterRight .linkPart:nth-child(2) .linkPartCon ul").css("height","auto");
        $(".mainCenterRight .linkPart:nth-child(3) .linkPartCon ul").css("height","auto");

        // 关于协会、网站地图、联系我们
        initBottomLink(configMenu);

        var menuTitle = findChannelTitle(menu, contentId).menuTitle;
        document.title= menuTitle+"-陕西省信息网络安全协会";
        
        $(".topTitle span").text(menuTitle);
        var pId=findChannelTitle(menu, contentId).pId;
        var content=findParentChannel(menu, pId);
        /*父级*/
        var parentMenuTitle = content.menuTitle;
        /*祖父级*/
        var grandParentMenuTitle = findParentChannel(menu,findChannelTitle(menu,findChannelId(menu,content.menuTitle)).pId).menuTitle;
        /*一级*/
        $(".breadLink").html('当前位置：<a href="'+menu[0].enName+'.html">首页</a> > <span>'+menuTitle+'</span>');
        if(parentMenuTitle == 'config'){
            $(".breadLink").html('当前位置：<a href="'+menu[0].enName+'.html">首页</a> > <span>'+menuTitle+'</span>');
        }else if(grandParentMenuTitle == 'config'||parentMenuTitle == grandParentMenuTitle){
            $(".breadLink").html('当前位置：<a href="'+menu[0].enName+'.html">首页</a> > <span>'+parentMenuTitle+'</span> > <span>'+menuTitle+'</span>');
        }else{
            $(".breadLink").html('当前位置：<a href="'+menu[0].enName+'.html">首页</a> > <span>'+grandParentMenuTitle+'</span> > <span>'+parentMenuTitle+'</span> > <span>'+menuTitle+'</span>');
        }
        if($(".titleFrom").text().replace(/(^\s+)|(\s+$)/g,"")==''){
            $(".titleFrom").css("margin-bottom","0");
        }
        initSidebar(content,$(".titleFrom"));
        if($(".firLevel").text() != ''){
            $(".titleFrom").css("margin-bottom","62px");
        }
     });
    
    getPubList(contentListOpt,function(list) {
        if(list.currentTotal==0){
            $(".changePage").hide();
            $(".listMain").html("<div class='noData'>无数据</div>");
        }else{
            $(".changePage").show();
            $(".listMain").html("");
            var num=Math.ceil(list.currentTotal/contentListOpt.pageSize);
            initList(list,$(".listMain"),$(".changePage"),num);
        }
        
        turnPage(num,$(".changePage"));
    });

    

});


function initList(list,$dom1,$dom2,num){
    $dom1.empty();
    for(var a in list.list){
    	var $content = $("<li></li>");
    	// 标题图
    	$('<div class="picPart" style="background: url('+list.list[a].thumbnail+') center center no-repeat;background-size: contain;"><img></div>').appendTo($content);
    	// 内容
    	var $currentCon = $("<div class='mesPart'></div>").appendTo($content);
    	// 标题
    	$("<a href='./content.html?id=" + list.list[a].id +"'>"+list.list[a].title+"</a>").appendTo($currentCon);
    	// date
    	$("<span>"+list.list[a].conDate.split(/T/g)[0]+"</span>").appendTo($currentCon);
    	// summary
    	$("<p>"+list.list[a].summary+"</p>").appendTo($currentCon);
    	
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

function turnPage(num,$dom){
    $dom.off().on("click","a",function(){
        var cls=$(this).attr("class");
        switch (cls){
            case "firstPage":
                contentListOpt.pageIndex=1;
                getPubList(contentListOpt,function(list) {
                    if(list.currentTotal==0){
                        $(".changePage").hide();
                    }else{
                        $(".changePage").show();
                    }
                    initList(list,$(".listMain"),$(".changePage"),num);
                });
                break;
            case "prevPage":
                contentListOpt.pageIndex=(contentListOpt.pageIndex-1);
                getPubList(contentListOpt,function(list) {
                    if(list.currentTotal==0){
                        $(".changePage").hide();
                    }else{
                        $(".changePage").show();
                    }
                    initList(list,$(".listMain"),$(".changePage"),num);
                });
                break;
            case "nextPage":
                contentListOpt.pageIndex=(contentListOpt.pageIndex+1);
                getPubList(contentListOpt,function(list) {
                    if(list.currentTotal==0){
                        $(".changePage").hide();
                    }else{
                        $(".changePage").show();
                    }
                    initList(list,$(".listMain"),$(".changePage"),num);
                });
                break;
            case "lastPage":
                contentListOpt.pageIndex=num;
                getPubList(contentListOpt,function(list) {
                    if(list.currentTotal==0){
                        $(".changePage").hide();
                    }else{
                        $(".changePage").show();
                    }
                    initList(list,$(".listMain"),$(".changePage"),num);
                });
                break;
        }
    });
}

function initSidebar(content, $con){
	var $firLevel=$('<a href="#" class="firLevel">'+content.menuTitle+'</a>');
	var $secLevel= $('<div class="secLevel"></div>');
	$("nav .menuLev_1").each(function(i){
		if($(this).children("a").text()==content.menuTitle){
			var $content=$(this).children("ul").clone();
			$content.find(".menuLev_2>a").each(function(){
				if($(this).attr("href")==undefined){
					var $hre=$(this).next().find("a").eq(0).attr("href");
					$(this).attr("href",$hre);
				}
				if($(this).text()==menuTitle){
					$(this).addClass("active");
				}
			})
			$content.find("ul").remove();
			$content.appendTo($secLevel);
		}
	});
	
	if($secLevel.html()==""){
		$("nav .menuLev_2").each(function(i){
			if($(this).children("a").text()==content.menuTitle){
				var $content=$(this).children("ul").clone();
				$content.find("a").each(function(){
					if($(this).text()==menuTitle){
						$(this).addClass("active");
					}
				})
				$content.appendTo($secLevel);
			}
		});
	}
	
	$firLevel.appendTo($con);	
	$secLevel.appendTo($con);
}