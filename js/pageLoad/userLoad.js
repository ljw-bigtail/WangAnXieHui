$(function() {
    document.title="个人会员入会-陕西省信息网络安全协会";
    
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

        //下载信息
        var joinIndex = findChannelIndex(configMenu, "加入协会")
        var linkIndex = findChannelIndex(configMenu[joinIndex].children, "个人会员入会");
        var linkListIndex = findChannelIndex(configMenu[joinIndex].children[linkIndex].children[0].children, "个人会员入会终审申请表");
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

    var //uesrNameRight = false,
        nameRight = false,
        // sexDictionaryRight = false,
        professionRight = false,
        mobileRight = false,
        eMaileRight = false,
        idNumberRight = false,
        webSiteRight = false,
        introRight = false;

    $(".sendUserMes input").on("change",function(){
        switch($(this).attr("id")){
            /*case "uesrName":
                if($(this).val().replace(/\S/,"")==''){
                    $(this).parent("div").find(".tips").text("用户名不能为空");
                    uesrNameRight = false;
                }else{
                    $(this).parent("div").find(".tips").text("");
                    uesrNameRight = true;
                };
                break;*/
            case "name":
                if($(this).val()==''){
                    $(this).parent("div").find(".tips").text("真实姓名不能为空");
                    nameRight = false;
                }else{
                    $(this).parent("div").find(".tips").text("");
                    nameRight = true;
                };
                break;
            case "sexDictionary":
                if($(this).val()==''){
                    $(this).parent("div").find(".tips").text("性别不能为空");
                    // sexDictionaryRight = false;
                }else{
                    $(this).parent("div").find(".tips").text("");
                    // sexDictionaryRight = true;
                };
                break;
            case "profession":
                if($(this).val()==''){
                    $(this).parent("div").find(".tips").text("职业不能为空");
                    professionRight = false;
                }else{
                    $(this).parent("div").find(".tips").text("");
                    professionRight = true;
                };
                break;
            case "mobile":
                if(!isPhone($(this).val())){
                    $(this).parent("div").find(".tips").text("手机号格式不正确");
                    mobileRight = false;
                }else{
                    $(this).parent("div").find(".tips").text("");
                    mobileRight = true;
                }
                break;
            case "eMaile":
                if(!isEmail($(this).val())){
                    $(this).parent("div").find(".tips").text("邮箱格式不正确");
                    eMaileRight = false;
                }else{
                    $(this).parent("div").find(".tips").text("");
                    eMaileRight = true;
                }
                break;
            case "idNumber":
                if(!isCardNo($(this).val())){
                    $(this).parent("div").find(".tips").text("身份证格式不正确");
                    idNumberRight = false;
                }else{
                    $(this).parent("div").find(".tips").text("");
                    idNumberRight = true;
                }
                break;
            case "webSite":
                if(!isHref($(this).val())){
                    $(this).parent("div").find(".tips").text("个人网站格式不正确");
                    // webSiteRight = false;
                }else{
                    $(this).parent("div").find(".tips").text("");
                    // webSiteRight = true;
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
        if(nameRight&&professionRight&&mobileRight&&eMaileRight&&idNumberRight&&introRight){
            var oName = {
                name: $("#name").val(),
                groupName: "个人"
            };
            var oMobile = {
                mobile: $("#mobile").val()
            };
            var oNumber = {
                number: $("#idNumber").val()
            };
            var option = {
                // name: $("#uesrName").val(),
                realName: $("#name").val(),
                sex: $("#sexDictionary").val(),
                idnumber: $("#idNumber").val(),
                phone: $("#mobile").val(),
                email: $("#eMaile").val(),
                web: $("#webSite").val(),
                profession: $("#profession").val(),
                intro: $("#intro").val()
            };
            validateMemberName(oName,function(jsonA){
                if(jsonA.status == "ok"){
                    validateMemberMobile(oMobile,function(jsonB){
                        if(jsonB.status == "ok"){
                            validateMemberIdNumber(oNumber,function(jsonC){
                                if(jsonC.status == "ok"){
                                    addMember(option, function(){
                                        if(jsonC.status == "ok"){
                                            alert('申请已提交成功，请等待初审结果');
                                            $(".sendUserMes > div > input").val("");
                                        }else{
                                            alert('申请提交失败，请稍后再试');
                                        }
                                    });
                                }else{
                                    alert(jsonC.message);
                                }
                            });
                        }else{
                            alert(jsonB.message);
                        }
                    });
                }else{
                    alert(jsonA.message);
                }
            });
        }else{
            alert("信息校验失败，请正确填入信息再进行提交。");
        }
    });
});