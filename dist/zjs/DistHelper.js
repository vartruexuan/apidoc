//******* 核心帮助对象(模块化) ********
var DistHelper = {

    closeOpenTime:null,
    //展示地址
    dist_url: "",
    //模块地址(json)
    module_url: "",
    //生成文档地址
    covert_url: "",
    http_protocol: "http:",//协议
    query_params: [],
    //窗口大小初始化
    is_resize: false,
    init: function () {
        var self = this;
        // 获取相对地址
        var urls = this.get_relative_url().split('/');
        for (var i = 0; i < urls.length; i++) {
            if (urls[i] == "" || typeof(urls[i]) == "undefined") {
                urls.splice(i, 1);
                i--;
            }
        }
        //获取对应参数
        this.query_params = this.getQueryString();
        // 拼接地址
        var host = window.location.host;
        this.http_protocol = window.location.protocol;
        //初始化地址()
        this.dist_url = this.http_protocol + '//' + host + '/' + [urls[0], urls[1]].join('/');
        var module_json_name = this.query_params['num'];
        this.module_url = this.dist_url + "/json/module/" + module_json_name + ".json";
        this.covert_url = this.http_protocol + '//' + host + '/' + [urls[0], "covert"].join("/");
        //绑定模块点击事件
        this.module_bind_click();
        //标签点击事件
        $('body').delegate('dd', 'click', function (event) {
            //防止标签点击冒泡事件
            event.stopPropagation();
            $(this).find('>a').css('color', '#6ac1ff');
            $(this).siblings().find('>a').css('color', 'rgba(255,255,255,.7)');//siblings().css('color',;
            var tag = $('#' + $(this).find('a').attr('data-tag'));
            tag.parent().show();
            tag.parent().siblings().hide();
            if (!tag.parent().hasClass('is-open')) {
                tag.trigger('click');
            }
        });
        //强制刷新
        $('.btn-load').on('click',function () {
            top.window.location.reload(true);
        });
        return this;
    },
    /**
     * 获取模块列表
     * @returns {DistHelper}
     */
    get_module: function () {
        //获取接口模块json 并解析
        self = this;
        $.ajax({
            url: this.module_url,
            type: 'get',
            dataType: "json",
            beforeSend: function (xmlHttp) {
                xmlHttp.setRequestHeader("If-Modified-Since", "0");
                xmlHttp.setRequestHeader("Cache-Control", "no-cache");
            },
            success: function (jsonData) {
                if (!jsonData) {
                    this.show_error('未发现对应的模块数据:(' + xr.status + ')' + '<a href="#" onclick="window.location.reload(true)">强制刷新</a>')
                }
                //拼接模板 并展示
                var html = "";
                for (var i in jsonData) {
                    html += '<li class="layui-nav-item module-div" data-json-name="' + $.md5(jsonData[i]['title']) + '"><a href="#">' + jsonData[i]['title'] + '<span class="layui-nav-more"></span></a></li>';
                }
                $('.layui-nav-tree').html(html);
                $('li.module-div:eq(0)').trigger('click');
            },
            error: function (xr) {
                self.show_error('未发现对应的模块数据:(' + xr.status + ')' + '<a href="#" onclick="window.location.reload(true)">强制刷新</a>')
            }
        });

        return this;
    },

    load_api_json: function (url) {
        $.ajax({
            url: url,
            type: 'get',
            dataType: "json",
            beforeSend: function (xmlHttp) {
                xmlHttp.setRequestHeader("If-Modified-Since", "0");
                xmlHttp.setRequestHeader("Cache-Control", "no-cache");
            },
            success: function (jsonData) {
            }
        })

        return this;
    },
    /**
     *  显示错误信息
     * @param message
     * @returns {DistHelper}
     */
    show_error: function (message, time=false, close_all=true) {
        if (close_all) {
            layer.closeAll();
        }
        layer.msg(message, {icon: 2, time: time});

        return this;
    },
    /**
     * 模块绑定事件(点击展示对应模块接口)
     * @returns {DistHelper}
     */
    module_bind_click: function () {


        var self = this;
        //模块列表点击事件
        $("body").delegate("li.module-div", 'click', function () {
            $('#layui-body').hide();
            var moduleObj = this;

            //菜单闭合切换
            if ($(moduleObj).hasClass('layui-nav-itemed')) {
                $(moduleObj).removeClass('layui-nav-itemed');
            } else {

                $(moduleObj).removeClass('layui-this').addClass('layui-nav-itemed');
                $('li.module-div').not(moduleObj).removeClass('layui-nav-itemed');
            }

            $(this).find('>a:eq(0)').css('color', '#6ac1ff');
            $(this).siblings().find('>a').css('color', 'rgba(255,255,255,.7)');//siblings().css('color',;
            var json_name = $(this).attr('data-json-name');
            $('#module_name').html($(this).text());
            //拼接json地址
            var url = self.dist_url + "/json/" + json_name + ".json";
            //预加载json文件（防缓存）
            self.load_api_json(url);
            // 生成接口文档列表
            window.ui = SwaggerUIBundle({
                url: url,
                validatorUrl: false,
                dom_id: '#layui-body',// '#apidoc-ui',
                deepLinking: true,
                presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIStandalonePreset
                ],
                plugins: [
                    SwaggerUIBundle.plugins.DownloadUrl
                ],
                layout: "StandaloneLayout"
            })


            //隐藏地址
            $('#layui-body .topbar:eq(0)').hide();
            //闭合标签

           // if(self.closeOpenTime ){
                clearInterval(self.closeOpenTime);
            //}
            self.closeOpenTime = setInterval(function () {
                console.log('hello');

                //隐藏信息
                $('#layui-body .information-container').hide();
                $('#layui-body .scheme-container').attr('style', 'position:fixed;width:100%');
                if ($('.opblock-tag-section').length > 0) {
                    clearInterval(self.closeOpenTime);
                    $('.opblock-tag-section').parent().css('paddingTop', '100px');
                    $('.opblock-tag-section').each(function () {
                        if ($(this).hasClass('is-open')) {
                            $(this).find('>h4:eq(0)').trigger('click');
                        }
                    });

                    //插入标签到菜单列表中 锚点
                    var html = '';
                    html += '<dl class="layui-nav-child">';
                    $('.opblock-tag-section .opblock-tag a>span').each(function () {
                        html += '<dd><a href="#" data-tag="operations-tag-' + $(this).text() + '">' + $(this).text() + '</a></dd>';
                    });
                    html += '  </dl>';
                    $(moduleObj).find('dl').remove();
                    $(moduleObj).append(html);
                    if($(moduleObj).hasClass('layui-nav-itemed')){
                        $(moduleObj).find('dd:eq(0)').trigger('click');
                    }
                    $('#layui-body').show().addClass('layui-anim layui-anim-fadein');

                }

            }, 300)
        });
        return this;
    },
    /**
     *  获取相对地址(http://xxx.com(此处地址)?a=1)
     * @returns {string|*}
     */
    get_relative_url: function () {
        var url = document.location.toString();
        var arrUrl = url.split("//");
        var start = arrUrl[1].indexOf("/");
        var relUrl = arrUrl[1].substring(start);//stop省略，截取从start开始到结尾的所有字符
        if (relUrl.indexOf("?") != -1) {
            relUrl = relUrl.split("?")[0];
        }
        return relUrl;
    },
    /**
     * 获取url中的参数
     * @returns {{}}
     */
    getQueryString: function () {
        var qs = location.search.substr(1), // 获取url中"?"符后的字串
            args = {}, // 保存参数数据的对象
            items = qs.length ? qs.split("&") : [], // 取得每一个参数项,
            item = null,
            len = items.length;

        for (var i = 0; i < len; i++) {
            item = items[i].split("=");
            var name = decodeURIComponent(item[0]),
                value = decodeURIComponent(item[1]);
            if (name) {
                args[name] = value;
            }
        }
        return args;
    }
}
//初始化对象
window.DistHelper = DistHelper.init();