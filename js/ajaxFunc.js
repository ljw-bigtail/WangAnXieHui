/*---------------------------------------------------------------------------------------*/
// 服务器(网安上线)
var Url = 'http://www.snains.cn:9000';
/*---------------------------------------------------------------------------------------*/

/**
 * 发送ajax请求
 * @param opt 请求参数
 */
function sendAjax(options) {
    var settings = $.extend({
        "url": "",
        "data": {},
        "okAction": null,
        "errorAction": null
    }, options || {});

    $.ajax({
        url: settings.url,
        type: 'post',
        dataType: "json",
        data: settings.data,
        success: function(json) {
            if (settings.okAction && "function" == typeof(settings.okAction)) {
                settings.okAction(json);
            }
        },
        error: function(data) {
            if (settings.errorAction && "function" == typeof(settings.errorAction)) {
                settings.errorAction();
            }
        }
    });
}

/*-----------------------------------获取ajax-----------------------------------*/
/**
 * 获取菜单，提交请求
 * @param callback
 */
function getMenu(callback) {
    sendAjax({
        "url": Url+"/rest/getMenu",
        "okAction": function(json) {
            if ("ok" == json.status) {
                if (callback && typeof(callback) == "function") {
                    callback(json.list);
                }
            } else {
                console.log("获取失败！")
            }
        },
        "errorAction": function() {
            console.log("获取失败！")
        }
    });
}

/**
 * 获取文章列表
 * @param opt 请求参数
 * @param callback
 */
function getPubList(opt, callback) {
    var self = this;
    var url = Url+"/rest/getPubList";
    sendAjax({
        "url": url,
        "data": {
            "channelId": opt.channelId,
            "start": (opt.pageIndex - 1) * opt.pageSize,
            "length": opt.pageSize,
            "search": opt.search,
            "orderName": opt.orderName,
            "orderValue": opt.orderValue,
            "contentType": opt.contentType
        },
        "okAction": function(json) {
            callback && callback(json);
        },
        "errorAction": function() {
            console.log("获取失败！")
        }
    });
}

/**
 * 获取留言列表
 * @param opt 请求参数
 * @param callback
 */
function getWordsList(opt, callback) {
    var self = this;
    var url = Url+"/rest/getWordsList";
    sendAjax({
        "url": url,
        "data": {
            "channelId": opt.channelId,
            "start": (opt.pageIndex - 1) * opt.pageSize,
            "length": opt.pageSize,
            "search": opt.search,
            "orderName": opt.orderName,
            "orderValue": opt.orderValue,
            "contentType": opt.contentType
        },
        "okAction": function(json) {
            callback && callback(json);
        },
        "errorAction": function() {
            console.log("获取失败！")
        }
    });
}

/**
 * 获取获取单篇文章
 * @param opt 请求参数
 * @param callback
 */
function getNewsById(opt, callback) {
    var self = this;
    var url = Url+"/rest/getNewsById";
    sendAjax({
        "url": url,
        "data": opt,
        "okAction": function(json) {
            callback && callback(json);
        },
        "errorAction": function() {
            console.log("获取失败！")
        }
    });
}

/**
 * 获取获取单条留言
 * @param opt 请求参数
 * @param callback
 */
function getWordsById(opt, callback) {
    var self = this;
    var url = Url+"/rest/getWordsById";
    sendAjax({
        "url": url,
        "data": opt,
        "okAction": function(json) {
            callback && callback(json);
        },
        "errorAction": function() {
            console.log("获取失败！")
        }
    });
}

/**
 * 姓名是否唯一
 * @param opt 请求参数
 */
function validateMemberName(opt, callback) {
    var self = this;
    var url = Url+"/rest/validateMemberName";
    sendAjax({
        "url": url,
        "data": {
            "name": opt.name,
            "groupName": opt.groupName
        },
        "okAction": function(json) {
            callback && callback(json);
        },
        "errorAction": function() {
            console.log("获取失败！")
        }
    });
}

/**
 * 电话是否唯一
 * @param opt 请求参数
 */
function validateMemberMobile(opt, callback) {
    var self = this;
    var url = Url+"/rest/validateMemberMobile";
    sendAjax({
        "url": url,
        "data": {
            "mobile": opt.mobile
        },
        "okAction": function(json) {
            callback && callback(json);
        },
        "errorAction": function() {
            console.log("获取失败！")
        }
    });
}

/**
 * 身份证是否唯一
 * @param opt 请求参数
 */
function validateMemberIdNumber(opt, callback) {
    var self = this;
    var url = Url+"/rest/validateMemberIdNumber";
    sendAjax({
        "url": url,
        "data": {
            "number": opt.number
        },
        "okAction": function(json) {
            callback && callback(json);
        },
        "errorAction": function() {
            console.log("获取失败！")
        }
    });
}

/*-----------------------------------存储ajax-----------------------------------*/
/**
 * 申请会员
 * @param opt 请求参数
 */
function addMember(opt, callback) {
    var self = this;
    var url = Url+"/rest/addMember";
    sendAjax({
        "url": url,
        "data": {
            "name": opt.realName,
            "sex": opt.sex,
            "date": opt.date,
            "idnumber": opt.idnumber,
            "phone": opt.phone,
            "email": opt.email,
            "web": opt.web,
            "profession": opt.profession,
            "intro": opt.intro
        },
        "okAction": function(json) {
            callback && callback(json);
        },
        "errorAction": function() {
            console.log("获取失败！")
        }
    });
}

/**
 * 申请企业会员
 * @param opt 请求参数
 */
function addCompMember(opt, callback) {
    var self = this;
    var url = Url+"/rest/addCompMember";
    sendAjax({
        "url": url,
        "data": {
            "name": opt.name,
            "tel": opt.tel,
            "zip": opt.zip,
            "address": opt.address,
            "contactsMobile": opt.contactsMobile,
            "email": opt.email,
            "web": opt.web,
            "contacts": opt.contacts,
            "intro": opt.intro
        },
        "okAction": function(json) {
            callback && callback(json);
        },
        "errorAction": function() {
            console.log("获取失败！")
        }
    });
}

/**
 * 添加留言
 * @param opt 请求参数
 * @param callback
 */
function addWords(opt, callback) {
    var self = this;
    var url = Url+"/rest/addWords";
    sendAjax({
        "url": url,
        "data": opt,
        "okAction": function(json) {
            callback && callback(json);
        },
        "errorAction": function() {
            console.log("获取失败！")
        }
    });
}

/*-----------------------------------通过但未使用-----------------------------------*/
/**
 * 联系我们
 * @param opt 请求参数
 * @param callback
 */
function contactUs(opt, callback) {
    var self = this;
    var url = Url+"/rest/contactUs";
    sendAjax({
        "url": url,
        "data": opt,
        "okAction": function(json) {
            callback && callback(json);
            console.log("success");
        },
        "errorAction": function() {
            console.log("获取失败！")
        }
    });
}

/**
 * 获取头条文章列表
 * @param opt 请求参数
 * @param callback
 */
function getHeadList(opt, callback) {
    var self = this;
    var url = Url+"/rest/getHeadList";
    sendAjax({
        "url": url,
        "data": {
            "channelId": opt.channelId,
            "start": (opt.pageIndex - 1) * opt.pageSize,
            "length": opt.pageSize,
            "search": opt.search,
            "orderName": opt.orderName,
            "orderValue": opt.orderValue
        },
        "okAction": function(json) {
            callback && callback(json);
        },
        "errorAction": function() {
            console.log("获取失败！")
        }
    });
}

/**
 * 获取推荐列表
 * @param opt 请求参数
 * @param callback
 */
function getRecomList(opt, callback) {
    var self = this;
    var url = Url+"/rest/getRecomList";
    sendAjax({
        "url": url,
        "data": {
            "channelId": opt.channelId,
            "start": (opt.pageIndex - 1) * opt.pageSize,
            "length": opt.pageSize,
            "search": opt.search,
            "orderName": opt.orderName,
            "orderValue": opt.orderValue,
            "searchAttrs": opt.searchAttrs
        },
        "okAction": function(json) {
            callback && callback(json);
        },
        "errorAction": function() {
            console.log("获取失败！")
        }
    });
}