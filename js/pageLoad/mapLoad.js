function initMap(oList, $con){
    var list = [];
    // 筛选显示的数据
    for(var a in oList){
        if(oList[a].isShow == true){
            list.push(oList[a]);
        }
    }
    for(var index in list){
        var menu = list[index];
        var $menu = $('<div class="mapPart"><div class="topTitle"><a>'+menu.name+'</a></div></div>');
        switch(menu.channelType){
            case "主页":
                $menu.children("div").children("a").attr("href", menu.enName + ".html");
                break;
            case "文章列表":
                $menu.children("div").children("a").attr("href", './list.html?id=' + menu.id);
                break;
            case "单篇文章":
                $menu.children("div").children("a").attr("href", './content.html?id=' + menu.id);
                break;
            case "图片列表":
                $menu.children("div").children("a").attr("href", './specialList.html?id=' + menu.id);
                break;
            case "外部链接":
                $menu.children("div").children("a").attr("href", menu.url);
                break;
        }
        if(menu.children){
            var $ul = $('<ul class="mapList"></ul>').appendTo($menu);
            initMenu(menu.children,  $ul);
        }
        $menu.appendTo($con);
    }
}
$(function() {
    document.title= "网站地图-陕西省信息网络安全协会";
    searchBtnFun();
    getMenu(function(menu) {
        $(".topLogo a").attr("href", menu[0].enName+'.html');
        // 获取导航
        initMenu(menu, $("nav ul"), 1);
        initMap(menu, $(".mapCenter"));

        var configMenu = menu[0].children[0].children;
        // 关于协会、网站地图、联系我们
        initBottomLink(configMenu);
        $(".breadLink").html('当前位置：<a href="'+menu[0].enName+'.html">首页</a> > <span>网站地图</span>');
    });
});