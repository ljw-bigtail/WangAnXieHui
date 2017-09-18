$(function() {
    document.title="单位会员入会-陕西省信息网络安全协会";
    
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

        
        initBottomLink(configMenu);

        function initBottomLink(menu){
            // 关于协会
            $(".footerLink a:nth-child(1)").attr("href", $(".menuLev_2:nth-child(1) a").attr("href"));
            // 网站地图
            $(".footerLink a:nth-child(2)").attr("href", "map.html");
            // 联系我们
            for(var i in menu){
                if(menu[i].name == "联系我们"){
                    $(".footerLink a:nth-child(3)").attr("href", './content.html?id=' + menu[i].id);
                }
            }
        }

        //下载信息
        var joinIndex = findChannelIndex(configMenu, "加入协会")
        var linkIndex = findChannelIndex(configMenu[joinIndex].children, "单位会员入会");
        var linkListIndex = findChannelIndex(configMenu[joinIndex].children[linkIndex].children[0].children, "单位会员入会终审申请表");
        var linkConId = configMenu[joinIndex].children[linkIndex].children[0].children[linkListIndex].id;
        var contentListOpt = {
            channelId: linkConId,
            search: "",
            orderName: "conDate",
            orderValue: "desc",
            pageSize: 1,
            pageIndex: 1,
            contentType: "content"
        };
        getPubList(contentListOpt, function(json){
        	if(json.list.length != 0){
        		$(".loadMessage").html(json.list[0].mainCon);        		
        	}
        });
    });


    var nameRight = false,
        telNumberRight = false,
        // webSiteRight = false,
        eMailRight = false,
        // zipCodeRight = false,
        addressRight = false,
        phoneNameRight = false,
        phoneNumberRight = false,
        introRight = false;

    $(".sendUserMes input").on("change",function(){
        switch($(this).attr("id")){
            case "name":
                if($(this).val()==''){
                    $(this).parent("div").find(".tips").text("公司名称不能为空");
                    nameRight = false;
                }else{
                    $(this).parent("div").find(".tips").text("");
                    nameRight = true;
                };
                break;
            case "telNumber":
                if(!isTel($(this).val())){
                    $(this).parent("div").find(".tips").text("公司电话格式不正确，例如：123-123456");
                    telNumberRight = false;
                }else{
                    $(this).parent("div").find(".tips").text("");
                    telNumberRight = true;
                }
                break;
            case "eMail":
                if(!isEmail($(this).val())){
                    $(this).parent("div").find(".tips").text("公司邮箱格式不正确，例如：123456@qq.com");
                    eMailRight = false;
                }else{
                    $(this).parent("div").find(".tips").text("");
                    eMailRight = true;
                }
                break;
            case "address":
                if($(this).val()==''){
                    $(this).parent("div").find(".tips").text("公司地址不能为空");
                    addressRight = false;
                }else{
                    $(this).parent("div").find(".tips").text("");
                    addressRight = true;
                };
                break;
            case "zipCode":
                if(!isZip($(this).val())){
                    $(this).parent("div").find(".tips").text("公司邮编格式不正确");
                    // zipCode = false;
                }else{
                    $(this).parent("div").find(".tips").text("");
                    // zipCode = true;
                }
                break;
            case "webSite":
                if(!isHref($(this).val())){
                    $(this).parent("div").find(".tips").text("公司网站格式不正确");
                    // webSiteRight = false;
                }else{
                    $(this).parent("div").find(".tips").text("");
                    // webSiteRight = true;
                }
                break;
            case "phoneName":
                if($(this).val()==''){
                    $(this).parent("div").find(".tips").text("联系人不能为空");
                    phoneNumberRight = false;
                }else{
                    $(this).parent("div").find(".tips").text("");
                    phoneNumberRight = true;
                };
                break;
            case "phoneNumber":
                if(!isPhone($(this).val())){
                    $(this).parent("div").find(".tips").text("手机号格式不正确");
                    phoneNameRight = false;
                }else{
                    $(this).parent("div").find(".tips").text("");
                    phoneNameRight = true;
                }
                break;
        }
    });
    $(".sendUserMes textarea").on("change",function(){
        if($(this).val()==''){
            $(this).parent("div").find(".tips").text("简介不能为空");
            introRight = false;
        }else{
            if($(this).val().length > 2000){
                console.log($(this).val().length)
                $(this).parent("div").find(".tips").text("简介不能超过2000个汉字");
                introRight = false;
            }else{
                $(this).parent("div").find(".tips").text("");
                introRight = true;
            };
        };
    });
    // 提交的信息
    $(".sendUserMes > input").on("click",function(){
        if(nameRight&&telNumberRight&&eMailRight&&addressRight&&phoneNumberRight&&phoneNameRight&&introRight){
            var option = {
                name: $("#name").val(),
                tel: $("#telNumber").val(),
                zip: $("#zipCode").val(),
                address: $("#address").val(),
                contactsMobile: $("#phoneNumber").val(),
                email: $("#eMail").val(),
                web: $("#webSite").val(),
                contacts: $("#phoneName").val(),
                intro: $("#intro").val()
            };
            var oName = {
                name: $("#name").val(),
                groupName: "公司"
            };
            validateMemberName(oName,function(jsonA){
                if(jsonA.status == "ok"){
                        addCompMember(option, function(json){
                    if(json.status == "ok"){
                        alert('申请已提交成功，请等待初审结果');
                        $(".sendUserMes > div > input").val("");
                    }else{
                        alert('申请提交失败，请稍后再试');
                    }
                });
                }else{
                    alert(jsonA.message);
                }
            });
        }else{
            alert("信息校验失败，请正确填入信息再进行提交。")
        }
    });

});