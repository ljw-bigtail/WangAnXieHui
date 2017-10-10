var menuTitle = 0;
var menuParentTitle = "";
var pId=-1;
var sideBar=[];

// 根据ID获取title
function findChannelTitle(menu, id) {
    for (var a in menu) {
        if (menu[a].id == id) {
            menuTitle = menu[a].name;
            pId = menu[a].parentId;
        }
        if (menu[a].children) {
            findChannelTitle(menu[a].children, id);
        }
    }
      return {
      	'menuTitle':menuTitle,
      	'pId':pId
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

function initContent(content, $con){
    // console.log(content.conDate.replace(/T/g,''))
    console.log("1111")
    var contentMain = '<div class="contentMainTit"><h3>'+ content.title +
        '</h3><p><span>时间：'+ content.conDate +
        '</span><span>来源：'+ content.auth +
        '</span></p></div><div class="contentMainCon">'+ content.mainCon +
        '</div><div class="behendNews"></div>'
    $(contentMain).appendTo($con);
}
$(function() {    
    searchBtnFun();
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

        var thisLink = window.location.search;
        
        if(thisLink.split("?id=").length !==0 && thisLink.split("?id=")[1] !== undefined){
            var contentId = thisLink.split("?id=").length ? thisLink.split("?id=")[1].split("&")[0] : "";
        }
        
        if(thisLink.split("?cId=").length !==0 && thisLink.split("?cId=")[1] !== undefined){
            var channelId = thisLink.split("?cId=").length ? thisLink.split("?cId=")[1].split("&")[0] : "";
        }

        if(channelId !== undefined && channelId!==""){
            var optChanl = {                
                "channelId": channelId,
                "search": "",
                "orderName": "conDate",
                "orderValue": "desc",
                "pageSize": 1,
                "pageIndex": 1
            };
            getPubList(optChanl, function(json){
                if(json.status == "ok" && json.list.length){
                    var opt = {
                        id : json.list[0].id
                    };
                    getNewsById(opt, function(content) {
                        if(content.status != "error"){
                            document.title= content.data.title+"-陕西省信息网络安全协会";   

                            content.data.conDate = content.data.conDate.replace(/T/g,' ')

                            initContent(content.data, $(".contentMain"));
                            var changePage='';
                            var prePage='';
                            var nextPage='';
                            if(content.data.nextId != -1){
                                prePage = ('<a href="./content.html?id='+ content.data.nextId +'" class="before">上一篇：<span>'+content.data.nextName+'</span></a>');
                            }
                            if(content.data.prevId != -1){
                                nextPage = ('<a href="./content.html?id='+ content.data.prevId +'" class="after">下一篇：<span>'+content.data.prevName+'</span></a>');
                            }
                            changePage += prePage;
                            changePage += nextPage;
                            $(changePage).appendTo($(".behendNews"));

                            /*插入面包屑*/
                            var menuTitle = findChannelTitle(menu, channelId).menuTitle;
                            var pId=findChannelTitle(menu, contentId).pId;
                            var content=findParentChannel(menu,pId);
                            $(".topTitle span").text(menuTitle);
                            /*父级*/
                            var parentMenuTitle = content.menuTitle;
                            /*祖父级*/
                            var grandParentMenuTitle = findParentChannel(menu,findChannelTitle(menu,findChannelId(menu,content.menuTitle)).pId).menuTitle;
                            /*一级*/
                            $(".breadLink").html('当前位置：<a href="'+menu[0].enName+'.html">首页</a> > <span>'+menuTitle+'</span>');
                            
                            if(parentMenuTitle == grandParentMenuTitle || grandParentMenuTitle == 'config'){
                                /*二级导航*/   
                                $(".breadLink").html('当前位置：<a href="'+menu[0].enName+'.html">首页</a> > <span>'+parentMenuTitle+'</span> > <span>'+menuTitle+'</span>');
                            }else{
                                /*三级导航*/   
                                $(".breadLink").html('当前位置：<a href="'+menu[0].enName+'.html">首页</a> > <span>'+grandParentMenuTitle+'</span> > <span>'+parentMenuTitle+'</span> > <span>'+menuTitle+'</span>');
                            }
                            initSidebar(content,$(".titleFrom"));
                            if($(".firLevel").text() != ''){
                                $(".titleFrom").css("margin-bottom","62px");
                            }
                        }else{
                            $(".contentMain").text("无数据").css({
                                "font-size":"20px",
                                "margin":"60px auto",
                                "text-align":"center"   
                            });
                        }
                    });
                }else{
                    /*插入面包屑*/
                    var menuTitle = findChannelTitle(menu, channelId).menuTitle;
                    var pId=findChannelTitle(menu, contentId).pId;
                    var content=findParentChannel(menu,pId);
                    $(".topTitle span").text(menuTitle);
                    /*父级*/
                    var parentMenuTitle = content.menuTitle;
                    /*祖父级*/
                    var grandParentMenuTitle = findParentChannel(menu,findChannelTitle(menu,findChannelId(menu,content.menuTitle)).pId).menuTitle;                   
                    /*一级*/
                    $(".breadLink").html('当前位置：<a href="'+menu[0].enName+'.html">首页</a> > <span>'+menuTitle+'</span>');
                    
                    if(parentMenuTitle == grandParentMenuTitle || grandParentMenuTitle == 'config'){
                        /*二级导航*/   
                        $(".breadLink").html('当前位置：<a href="'+menu[0].enName+'.html">首页</a> > <span>'+parentMenuTitle+'</span> > <span>'+menuTitle+'</span>');
                    }else{
                        /*三级导航*/   
                        $(".breadLink").html('当前位置：<a href="'+menu[0].enName+'.html">首页</a> > <span>'+grandParentMenuTitle+'</span> > <span>'+parentMenuTitle+'</span> > <span>'+menuTitle+'</span>');
                    }
                    initSidebar(content,$(".titleFrom"));
                    if($(".firLevel").text() != ''){
                        $(".titleFrom").css("margin-bottom","62px");
                    }
                    $(".contentMain").text("无数据").css({
                        "font-size":"20px",
                        "margin":"60px auto",
                        "text-align":"center",
                        "color": "rgba(0,0,0,.3)"
                    });
                }
            });
        } else {
            var optId = {
                id: contentId            
            };
            getNewsById(optId, function(content) {
                if(content.status != "error"){
                    document.title= content.data.title+"-陕西省信息网络安全协会";                
                    
                    content.data.conDate = content.data.conDate.replace(/T/g,' ')

                    initContent(content.data, $(".contentMain"));
                    var changePage='';
                    var prePage='';
                    var nextPage='';
                    if(content.data.nextId != -1){
                        prePage = ('<a href="./content.html?id='+ content.data.nextId +'" class="before">上一篇：<span>'+content.data.nextName+'</span></a>');
                    }
                    if(content.data.prevId != -1){
                        nextPage = ('<a href="./content.html?id='+ content.data.prevId +'" class="after">下一篇：<span>'+content.data.prevName+'</span></a>');
                    }
                    changePage += prePage;
                    changePage += nextPage;
                    $(changePage).appendTo($(".behendNews"));
                    
                    contentId = content.data.cId
                    var menuTitle = findChannelTitle(menu, contentId).menuTitle;
                    var pId=findChannelTitle(menu, contentId).pId;
                    var content=findParentChannel(menu,pId);
                    $(".topTitle span").text(menuTitle);
      
                    var prant_url = "";
                    $.each(content.children[0],function(index){
                    	if(content.children[0][index].name == menuTitle){
                    		$thisData = content.children[0][index];
                    		
                    		switch($thisData.channelType){
				                case "文章列表":
				                    prant_url = '/list.html?id=' + $thisData.id;
				                    break;
				                case "图文列表":
				                    prant_url = '/piclist.html?id=' + $thisData.id;
				                    break;
				                case "单篇文章":
				                    prant_url = '/content.html?cId=' + $thisData.id;
				                    break;
				                case "图片列表":
				                    prant_url = '/specialList.html?id=' + $thisData.id;
				                    break;
				                case "外部链接":
				                    prant_url = $thisData.url;
				                    break;
				            }
                    	}
                    });
                    var parentMenuTitle = content.menuTitle;
                    var grandParentMenuTitle = findParentChannel(menu,findChannelTitle(menu,findChannelId(menu,content.menuTitle)).pId).menuTitle;

                    if(parentMenuTitle == grandParentMenuTitle&&grandParentMenuTitle != 'config'){
                        $(".breadLink").html('当前位置：<a href="'+menu[0].enName+'.html">首页</a> > <span>'+parentMenuTitle+'</span> > <a href="'+prant_url+'">'+menuTitle+'</a> > <span>正文</span>');
                    }
                    if(parentMenuTitle == 'config'){
                    	$(".breadLink").html('当前位置：<a href="'+menu[0].enName+'.html">首页</a> > <a href="'+prant_url+'">'+menuTitle+'</a> > <span>正文</span>');                    	
                    }
                    
                    initSidebar(content,$(".titleFrom"));
                    if($(".firLevel").text() != ''){
                        $(".titleFrom").css("margin-bottom","62px");
                    }
                }else{
                    $(".contentMain").text("无数据").css({
                        "font-size":"20px",
                        "margin":"60px auto",
                        "text-align":"center"   
                    });
                }
            });
        }
        if($(".titleFrom").text().replace(/(^\s+)|(\s+$)/g,"")==''){
            $(".titleFrom").css("margin-bottom","0");
        }
    });
});

function initContent(content, $con){
	var contentMain = '<div class="contentMainTit"><h3>'+ content.title +
        '</h3><p><span>时间：'+ content.conDate + '</span>';
	if(content.auth){
		contentMain += '<span>作者：'+ content.auth + '</span>';
	}
	if(content.source){
		contentMain += '<span>来源：'+ content.source + '</span>';
	}
	contentMain += '</p></div><div class="contentMainCon">'+ content.mainCon + '</div>';
    $(contentMain).appendTo($con);
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
	
	if(content.menuTitle == "config"){
		$(".titleFrom").html(" ")
	}
}