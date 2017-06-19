// h5 分享功能 微信 朋友圈 微博 qq好友
var nativeShare = function (elementNode, config) {
    if (!document.getElementById(elementNode)) {
        return false;
    }

    var qApiSrc = {
        lower: "//3gimg.qq.com/html5/js/qb.js",
        higher: "//jsapi.qq.com/get?api=app.share"
    };
    var bLevel = {
        qq: {forbid: 0, lower: 1, higher: 2},
        uc: {forbid: 0, allow: 1}
    };
    var UA = navigator.appVersion;
    var isqqBrowser = (UA.split("MQQBrowser/").length > 1) ? bLevel.qq.higher : bLevel.qq.forbid;
    var isucBrowser = (UA.split("UCBrowser/").length > 1) ? bLevel.uc.allow : bLevel.uc.forbid;
    var version = {
        uc: "",
        qq: ""
    };
    var isWeixin = false;

    config = config || {};
    this.elementNode = elementNode;
    this.url = config.url || document.location.href || '';
    this.title = config.title || document.title || '';
    this.desc = config.desc || document.title || '';
    this.img = config.img || document.getElementsByTagName('img').length > 0 && document.getElementsByTagName('img')[0].src || '';
    this.img_title = config.img_title || document.title || '';
    this.from = config.from || window.location.host || '';
    this.ucAppList = {
        sinaWeibo: ['kSinaWeibo', 'SinaWeibo', 11, '新浪微博'],
        weixin: ['kWeixin', 'WechatFriends', 1, '微信好友'],
        weixinFriend: ['kWeixinFriend', 'WechatTimeline', '8', '微信朋友圈'],
        QQ: ['kQQ', 'QQ', '4', 'QQ好友']
    };

    this.share = function (to_app) {
        var title = this.title, url = this.url, desc = this.desc, img = this.img, img_title = this.img_title, from = this.from;
        if (isucBrowser) {
            to_app = to_app == '' ? '' : (platform_os == 'iPhone' ? this.ucAppList[to_app][0] : this.ucAppList[to_app][1]);
            if (to_app == 'QZone') {
                B = "mqqapi://share/to_qzone?src_type=web&version=1&file_type=news&req_type=1&image_url="+img+"&title="+title+"&description="+desc+"&url="+url+"&app_name="+from;
                k = document.createElement("div"), k.style.visibility = "hidden", k.innerHTML = '<iframe src="' + B + '" scrolling="no" width="1" height="1"></iframe>', document.body.appendChild(k), setTimeout(function () {
                    k && k.parentNode && k.parentNode.removeChild(k)
                }, 5E3);
            }
            if (typeof(ucweb) != "undefined") {
                ucweb.startRequest("shell.page_share", [title, title, url, to_app, "", "@" + from, ""])
            } else {
                if (typeof(ucbrowser) != "undefined") {
                    ucbrowser.web_share(title, title, url, to_app, "", "@" + from, '')
                } else {
                }
            }
        } else {
            if (isqqBrowser && !isWeixin) {
                to_app = to_app == '' ? '' : this.ucAppList[to_app][2];
                var ah = {
                    url: url,
                    title: title,
                    description: desc,
                    img_url: img,
                    img_title: img_title,
                    to_app: to_app,//微信好友1,腾讯微博2,QQ空间3,QQ好友4,生成二维码7,微信朋友圈8,啾啾分享9,复制网址10,分享到微博11,创意分享13
                    cus_txt: "请输入此时此刻想要分享的内容"
                };
                ah = to_app == '' ? '' : ah;
                if (typeof(browser) != "undefined") {
                    if (typeof(browser.app) != "undefined" && isqqBrowser == bLevel.qq.higher) {
                        browser.app.share(ah)
                    }
                } else {
                    if (typeof(window.qb) != "undefined" && isqqBrowser == bLevel.qq.lower) {
                        window.qb.share(ah)
                    } else {
                    }
                }
            } else {
            }
        }
    };

    this.html = function() {

        var position = document.getElementById(this.elementNode);
        if(!position) return false;

        var html = '<ul>'+
            '<li data-app="weixin" class="nativeShare weixin"><img src="http://svn.tech.xingyuanauto.com/svn/UED/xy/MicroShop_MOB/img/wechat_chat2.png"><p>微信好友</p></li>'+
            '<li data-app="weixinFriend" class="nativeShare weixin_timeline"><img src="http://svn.tech.xingyuanauto.com/svn/UED/xy/MicroShop_MOB/img/wechat2.png"><p>微信朋友圈</p></li>'+
            '<li data-app="QQ" class="nativeShare qq"><img src="http://svn.tech.xingyuanauto.com/svn/UED/xy/MicroShop_MOB/img/qq_zone2.jpg"><p>QQ好友</p></li>'+
            '<li data-app="sinaWeibo" class="nativeShare weibo"><img src="http://svn.tech.xingyuanauto.com/svn/UED/xy/MicroShop_MOB/img/sina2.png"><p>新浪微博</p></li>'+
            '</ul>';
        position.innerHTML = html;
    };

    this.isloadqqApi = function () {
        if (isqqBrowser) {
            var b = (version.qq < 5.4) ? qApiSrc.lower : qApiSrc.higher;
            var d = document.createElement("script");
            var a = document.getElementsByTagName("body")[0];
            d.setAttribute("src", b);
            a.appendChild(d)
        }
    };

    this.getPlantform = function () {
        ua = navigator.userAgent;
        if ((ua.indexOf("iPhone") > -1 || ua.indexOf("iPod") > -1)) {
            return "iPhone"
        }
        return "Android"
    };

    this.is_weixin = function () {
        var a = UA.toLowerCase();
        if (a.match(/MicroMessenger/i) == "micromessenger") {
            return true
        } else {
            return false
        }
    };

    this.getVersion = function (c) {
        var a = c.split("."), b = parseFloat(a[0] + "." + a[1]);
        return b
    };
    this.isSupport = function(){
        return this.is_weixin() ? false : (isqqBrowser || isucBrowser)

    }
    this.browsers = function(){

        var u = navigator.userAgent, app = navigator.appVersion;
        var ua = navigator.userAgent.toLowerCase();
        return {
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
            iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
            weixin:u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
            qq: u.match(/\sQQ/i) == "qq", //是否QQ
            isweixin:ua.match(/MicroMessenger/i)=="micromessenger",
            safari:u.toLowerCase().indexOf("safari") > 0,
            qqbrowser:u.indexOf('QQBrowser')>0,
            ucbrowser:u.indexOf('UCBrowser')>0,
            baidubrowser:u.indexOf('baidubrowser')>0,//baidu
            qhbrowser:u.indexOf('QHBrowser')>0//360
        }


    };

    this.render = function(){

        // 判断是否是移动端打开
        
        var browser = this.browsers();
        if(browser.mobile){

            if(this.isSupport()){
                    //uc or qq 中打开 (不用区分移动端设备是androibd还是ios)
                     
                    this.html();
            }else if(browser.weixin){//在微信中打开
                
                $('.share-title').hide();
                $('.share-block').hide();
                return;

            }else if(browser.android){
                 
                //在一般的android手机中打开
                var html = '<ul>'+
                    '<li data-app="sinaWeibo" class="nativeShare weibo"><img src="http://svn.tech.xingyuanauto.com/svn/UED/xy/MicroShop_MOB/img/sina2.png"><p>新浪微博</p></li>'+
                '</ul>';
                $('.share-block').html(html);
                $('.weibo').on('click',function(){
                    shareToSinaWeiBo(config.link,config.title,config.desc,config.imgurl);
                })
                return;


            }else if((browser.iphone || browser.safari) && !browser.baidubrowser && !browser.qhbrowser ){
                //iphone中打开
                var html = '<ul>'+
                '<li data-app="weixin" class="nativeShare weixin"><img src="http://svn.tech.xingyuanauto.com/svn/UED/xy/MicroShop_MOB/img/wechat_chat2.png"><p>微信好友</p></li>'+
                '<li data-app="weixinFriend" class="nativeShare weixin_timeline"><img src="http://svn.tech.xingyuanauto.com/svn/UED/xy/MicroShop_MOB/img/wechat2.png"><p>微信朋友圈</p></li>'+
                '<li data-app="QQ" class="nativeShare qq"><img src="http://svn.tech.xingyuanauto.com/svn/UED/xy/MicroShop_MOB/img/qq_zone2.jpg"><p>QQ好友</p></li>'+
                '<li data-app="sinaWeibo" class="nativeShare weibo"><img src="http://svn.tech.xingyuanauto.com/svn/UED/xy/MicroShop_MOB/img/sina2.png"><p>新浪微博</p></li>'+
                '</ul>';
                $('.share-block').html(html);
                shareWeixinOrFHint();
                $('.weibo').on('click',function(){
                    shareToSinaWeiBo(config.link,config.title,config.desc,config.imgurl);
                })
            }else{
                //其他浏览器
                 var html = '<ul>'+
                        '<li data-app="sinaWeibo" class="nativeShare weibo"><img src="http://svn.tech.xingyuanauto.com/svn/UED/xy/MicroShop_MOB/img/sina2.png"><p>新浪微博</p></li>'+
                    '</ul>';
                $('.share-block').html(html);
                $('.weibo').on('click',function(){
                    shareToSinaWeiBo(config.link,config.title,config.desc,config.imgurl);
                })
                return;
            }
        }
    };


    this.init = function () {
        platform_os = this.getPlantform();
        version.qq = isqqBrowser ? this.getVersion(UA.split("MQQBrowser/")[1]) : 0;
        version.uc = isucBrowser ? this.getVersion(UA.split("UCBrowser/")[1]) : 0;
        isWeixin = this.is_weixin();
        if ((isqqBrowser && version.qq < 5.4 && platform_os == "iPhone") || (isqqBrowser && version.qq < 5.3 && platform_os == "Android")) {
            isqqBrowser = bLevel.qq.forbid
        } else {
            if (isqqBrowser && version.qq < 5.4 && platform_os == "Android") {
                isqqBrowser = bLevel.qq.lower
            } else {
                if (isucBrowser && ((version.uc < 10.2 && platform_os == "iPhone") || (version.uc < 9.7 && platform_os == "Android"))) {
                    isucBrowser = bLevel.uc.forbid
                }
            }
        }
       
       
        this.render();
    };

    this.init();

    

    function shareWeixinOrFHint(){
        var fontSize='12x';
            var dpr=$('html').attr('data-dpr');
            if(dpr==1){
                fontSize='12px'
            }else if(dpr==2){
                fontSize='24x'
            }else if(dpr==3){
                fontSize='36x'
            };
            var div=$('<div class="share_mark"></div>');
            var hint_img=$('<div class="hint_img"></div>');
            var cancel_btn=$('<div class="cancel_btn">我知道了</div>');
            var share_markCss={
                    'display':'none',
                    'position': 'fixed',
                    'top': '0',
                    'left': '0',
                    'z-index': '10000',
                    '-webkit-box-sizing': 'border-box',
                    'box-sizing': 'border-box',
                    'width': '100%',
                    'height': '100%',
                    'background': 'rgba(0, 0, 0, 0.6)'
                };
            var hint_imgCss={
                    'width': '100%',
                    'height': '100%',
                    'background': 'url("http://svn.tech.xingyuanauto.com/svn/UED/xy/MicroShop_MOB/img/init-share.png") no-repeat center',
                    'background-size': 'contain'
                };
            var cancel_btnCss={
                'position': 'absolute',
                'bottom': '0',
                'left': '0',
                'width': '100%',
                'background-color': '#fff',
                'font-size': '24px',
                'padding': ' 0.427rem 0',
                'text-align': 'center'
            };
            div.css(share_markCss);
            hint_img.css(hint_imgCss);
            cancel_btn.css(cancel_btnCss).css('font-size',fontSize);
            div.append(hint_img).append(cancel_btn);
            $('body').append(div);
            //'我知道了按钮'注册点击事件
            bindEvent()
            function bindEvent(){
                $('.share_mark .cancel_btn').on('click',function(){
                    $('.share_mark').css('display','none');
                    $('.zsh_cancel,.cancel_p').trigger('click');
                })
                $('.share_mark ').on('click',function(){
                    $('.share_mark').css('display','none');
                    $('.zsh_cancel,.cancel_p').trigger('click');
                })
            }
            shareFf();
        };

  
    function shareToSinaWeiBo(url, title, content, pic){
        var img = pic || '';
        var urlx = "http://v.t.sina.com.cn/share/share.php?c=&url="+ encodeURIComponent(url) + "&pic="
            + img + "&type=1" + "&title=" + encodeURIComponent(title ) + '&content='+ encodeURIComponent(content) + "&rnd=" + new Date().valueOf();
        window.open(urlx);
    }

    function shareFf(flag){
        // 微信分享
        $('.weixin').on('click',function(){
                $('.share_mark').css('display','block');
            });
        // 微信朋友圈分享点击事件
        $('.weixin_timeline').on('click',function(){
                $('.share_mark').css('display','block');
        });
        $('.qq').on('click',function(){
                $('.share_mark').css('display','block');
        });
       
        if(flag){
            $('.js_kj_share').on('click',function(){
                $('.share_mark').css('display','block');
            })
        }
    };

    

    var share = this;
    var items = document.getElementsByClassName('nativeShare');
    for (var i=0;i<items.length;i++) {
        items[i].onclick = function(){
            share.share(this.getAttribute('data-app'));
        }
    }


    return this;
};
