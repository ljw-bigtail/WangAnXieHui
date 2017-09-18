;
var contentListOpt = {
    channelId: -1,
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
    var search = thisLink.split("?search=")[1];
    console.log(unescape(search));
    contentListOpt.search = unescape(search)+'';
    //对于搜索文字做处理放置中文转码

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

        document.title= "搜索结果-陕西省信息网络安全协会";

        $(".mainCenterRight .linkPart:nth-child(2) .linkPartCon ul").css("height","auto");
        $(".mainCenterRight .linkPart:nth-child(3) .linkPartCon ul").css("height","auto");

        // 关于协会、网站地图、联系我们
        initBottomLink(configMenu);
     });
    
    getPubList(contentListOpt,function(list) {
        if(list.list.length==0){
            $(".changePage").hide();
            $(".listMain").html("<div class='noData' style='font-size:20px;margin:60px auto;text-align:center;'>无相关内容</div>");
        }else{
            $(".changePage").show();
            $(".listMain").html("");
            var num=Math.ceil(list.currentTotal/contentListOpt.pageSize);
            initList(list,$(".listMain"),$(".changePage"),num);
        }
        
        turnPage(num,$(".changePage"));
    });
});

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

