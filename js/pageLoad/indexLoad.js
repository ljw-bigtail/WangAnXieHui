;
$(function() {
    document.title="陕西省信息网络安全协会";
    searchBtnFun();
    // 获取公共导航菜单
    getMenu(function(menu) {
        $(".topLogo a").attr("href", menu[0].enName+'.html');
        var configMenu = menu[0].children[0].children;
        // console.log(configMenu)
        // 获取导航
        initMenu(menu, $("nav ul"), 1);
        initXhdtDom(menu, "协会动态", "xhdt" ,"slideBox");
        initTabNews(menu, "行业动态", "hydt", 6);
        initTabNews(menu, "交流活动", "jlhd", 6);
        initTabNews(menu, "国内法律法规", "flfg", 6);
        initTabNews(menu, "会员动态", "hydt1", 5);
        initTabNews(menu, "协会文件", "xhwj", 5);
        initSpecialLink(menu, "专题专栏", "picPart");
        initFriendLink(menu, "友情链接", "yqdt");
        initBannerB(menu, "首页轮播大图", "bigBanner");
//      initBannerS(menu, "协会动态", "slideBox");

        // 关于协会、加入协会
        configMenuIndexGyxh = findChannelIndex(configMenu, "关于协会");
        configMenuIndexrxh = findChannelIndex(configMenu, "加入协会");
        initFixedLink(configMenu[configMenuIndexGyxh],$(".linkPart:nth-child(1) div.linkPartCon"),1);
        initFixedLink(configMenu[configMenuIndexrxh],$(".linkPart:nth-child(2) div.linkPartCon"),2);

        // 关于协会、网站地图、联系我们
        initBottomLink(configMenu);
    });
});