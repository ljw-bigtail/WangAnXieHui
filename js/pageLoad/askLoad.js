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
// 根据title获取ID
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

var wordListOpt = {
    channelId: 0,
    search: "",
    orderName: "conDate",
    orderValue: "desc",
    pageSize: 10,
    pageIndex: 1,
    contentType: "content"
};

$(function() {
    document.title="答疑列表-陕西省信息网络安全协会";
    searchBtnFun();
    var askOpt = {
        channelName: "专家答疑",
        ask: "",
        askTime: "",
        askUserName: ""
    };
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
        
        var contentId = findChannelId(menu, "专家答疑");
        var menuTitle = findChannelTitle(menu, contentId).menuTitle;
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
        askOpt.askTime = myDate;
        $(".askPart button").on("click",function(){
            if($(".askPart textarea").val()){
                askOpt.ask = $(".askPart textarea").val();
                // console.log(askOpt)
                addWords(askOpt,function(json){
                    if(json.status=="ok"){
                        alert("提问成功，待解答后可在页面中查看");
                    }
                });
            }else{
                alert("请填写内容后再进行提交！");
            }
        });

        wordListOpt.channelId = contentId;
        //获取列表
        getWordsList(wordListOpt,function(list) {
            if(list.currentTotal==0){
                $(".changePage").hide();
                $(".listMain").html("<div class='noData'>无数据</div>");
            }else{
                $(".changePage").show();
                $(".listMain").html("");
                var num=Math.ceil(list.currentTotal/wordListOpt.pageSize);
                initAskList(list,$(".listMain"),$(".changePage"),num);
            }
            turnPage(num,$(".changePage"));          
        });
    });  
});

function turnPage(num,$dom){
    $dom.off().on("click","a",function(){
        var cls=$(this).attr("class");
        switch (cls){
            case "firstPage":
                wordListOpt.pageIndex=1;
                getWordsList(wordListOpt,function(list) {
                    if(list.currentTotal==0){
                        $(".changePage").hide();
                    }else{
                        $(".changePage").show();
                    }
                    initAskList(list,$(".listMain"),$(".changePage"),num);
                });
                break;
            case "prevPage":
                wordListOpt.pageIndex=(wordListOpt.pageIndex-1);
                getWordsList(wordListOpt,function(list) {
                    if(list.currentTotal==0){
                        $(".changePage").hide();
                    }else{
                        $(".changePage").show();
                    }
                    initAskList(list,$(".listMain"),$(".changePage"),num);
                });
                break;
            case "nextPage":
                wordListOpt.pageIndex=(wordListOpt.pageIndex+1);
                getWordsList(wordListOpt,function(list) {
                    if(list.currentTotal==0){
                        $(".changePage").hide();
                    }else{
                        $(".changePage").show();
                    }
                    initAskList(list,$(".listMain"),$(".changePage"),num);
                });
                break;
            case "lastPage":
                wordListOpt.pageIndex=num;
                getWordsList(wordListOpt,function(list) {
                    if(list.currentTotal==0){
                        $(".changePage").hide();
                    }else{
                        $(".changePage").show();
                    }
                    initAskList(list,$(".listMain"),$(".changePage"),num);
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