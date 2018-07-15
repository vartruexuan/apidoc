//*********ApiHelper.js 核心操作对象************
var ApiHelper = {
    module_name:"",//生成后的第一个链接名
    module_url:"",//生成后的第一个文档链接
    //初始化
    init: function () {
        self = this;
        // 模块列表添加点击事件和样式
        $('.tab-container').delegate('>div>a', 'click', function () {
            $('.tab-container>div>a').css('backgroundColor', '')
            $(this).css('backgroundColor', 'skyblue');
            $('.tab-container .tab-content').addClass('hide');
            $(this).parent().find('.tab-content').removeClass('hide');
        });
        //刷新
        $('#doc_refresh').on('click', function () {
            self.covert();
        });
        //绑定生成指定模块
        this.bind_build_url();
        return this;
    },
    /**
     * 设置生成文档状态
     * @param jsonData 发送生成返回的数据
     * @returns {ApiHelper}
     */
    set_covert_status: function (jsonData) {
        if (jsonData.status == 0 && jsonData.data.url) {//成功
            $('.message').html('<a href="' + jsonData.data.url + '" class="go_to_dist" target="_blank"><span class="glyphicon glyphicon-hand-right"> 访问接口文档</span></a>');
            this.blink('.go_to_dist');
        } else {  //失败
            $('.message').html('<span style="color:red">' + jsonData.message + "</span>");
        }
        return this;
    },
    /**
     *  设置模块生成状态
     * @param modules 生成时返回,模块列表信息
     * @returns {ApiHelper}
     */
    set_module_status: function (modules) {
        $('.covert-status').html('');
        var total_count = 0;
        var error_count = 0;
        var success_count = 0;
        for (var i in modules) {
            total_count += 1
            if (modules[i]['status'] != 0) {
                error_count += 1;
            } else {
                success_count += 1;
            }
        }
        var html = "";
        html += "<span>总数量: <span class=' badge' style='background-color:wheat;color: green;font-size: 18px;'>" + total_count + "</span></span> ";
        html += "<span>成功: <span class='badge'   style='background-color:wheat;color: green;font-size: 18px;'>" + success_count + "</span></span> ";
        html += "<span>失败: <span class='module_error badge'   style='background-color:wheat;color: red;font-size: 18px;'>" + error_count + "</span></span> ";
        $('.covert-status').html(html);
        //错误数量大于0 闪烁提醒
        if (error_count > 0) {
            this.blink('.module_error');
        }
        return this;
    },
    /**
     * 添加模块列表
     * @param modules 生成时返回,模块列表信息
     * @returns {ApiHelper}
     */
    append_module: function (modules) {
        this.set_module_status(modules);
        var id_index = 0;
        for (var i in modules) {
            id_index += 1
            var id = "c" + id_index;

            //添加返回信息
            var dd_con = '<div style="padding:10px;">';
            if (modules[i]['status'] == 0) {
                dd_con += "<pre><p class='title_ok'>(" + i + ")生成成功" + "</p></pre>"
                //模块生成失败
            } else {
                dd_con += "<pre><p class='title_error'>" + modules[i]['status_message'] + "</p></pre>"
                dd_con += "<pre><p><span class='key'>" + "文件地址:</span><br><span class='value ' >" + modules[i]['file_name'] + "</span></p></pre>";
                dd_con += "<pre><p><span class='key'>" + "注释:</span><br><span class='value comment' >" + modules[i]['com'] + "</span></p></pre>";
            }
            dd_con += "</div>"
            //添加tabs 标题
            var html_title = "";
            var html_content = "";
            html_title += '<li role="presentation" class=""><a href="#' + id + '" role="tab" data-toggle="tab"><span class="' + (modules[i]['status'] == 0 ? 'glyphicon glyphicon-ok' : 'glyphicon glyphicon-remove') + '" style="color:' + (modules[i]['status'] == 0 ? 'green' : 'red') + ';"> ' + i + '</span></a></li>';
            html_content += '<div role="tabpanel" class="tab-pane " id="' + id + '">' + dd_con + '</div>';

            $('.tab-container .nav-tabs').append(html_title);
            $('.tab-container .tab-content').append(html_content);
        }
        $('.tab-container .nav-tabs li a:eq(0)').trigger('click');
        return this;
    },
    /**
     * 展示版本信息
     * @param info
     */
    show_info: function (info) {
        $('.footer').html('');
        $('.footer').append('版本: <a>' + info['version'] + "</a>");
        $('.footer').append('生成时间: <a>' + info['date'] + "</a>");
    },

    /**
     * 生成文档
     * @returns {ApiHelper}
     */
    covert: function () {
        var self = this;
        //生成文档
        self.ajax({
            url: "",
            type: "post",
            dataType: "json",
            beforeSend: function () {
                $('.tab-container .nav-tabs').html('');
                $('.tab-container .tab-content').html('');
                $('.modules_status').html('<a style="font-size: 20px;"><img mou height="30px" src="' + page_covert_img + '/load.gif"/> 正在生成文档中.....</a>');
            },
            success: function (jsonData) {
                self.module_url = jsonData.data.url;
                self.module_name= (self.module_url.split('num='))[1];
                //展示生成文档状态
                self.set_covert_status(jsonData);
                //将数据嵌入到页面中
                var modules = jsonData.status == 0 ? jsonData.data.modules : [];
                self.append_module(modules)
                //展示生成工具信息
                self.show_info(jsonData['data']['info']);
            },
            complete: function () {
                $('.modules_status').html('');
            }
        })
        return this;
    },
    /**
     * 绑定生成链接事件
     */
    bind_build_url: function () {
        $('#modules_url').on('click', function () {
            layer.open({
                type: 2,
                title: '指定模块生成链接',
                shadeClose: true,
                shade: [0.5],
                offset:'ct',
               // maxmin: true, //开启最大化最小化按钮
                area: ['900px', '500px'],
                content: page_bulid_url,
                //btn: ['生成'],
                btn1: function (index, layero) {

                    // 获取选中的模块
                    var div_m = $('.module-list a.active');
                    if (div_m.length < 1) {
                        layer.msg('请选择要生成链接的模块');
                        return;
                    }
                    //拼接模块
                    var m = [];
                    div_m.each(function () {
                        m.push($(this).text())
                    });
                    modules = m.join(',');

                    console.log(div_m);
                    alert(modules);return;
                }
            });
        })
    },
    /**
     *  指定元素闪烁
     * @param selector 选择器 ".mo"
     */
    blink: function (selector) {
        var self = this;
        $(selector).fadeOut('slow', function () {
            $(this).fadeIn('slow', function () {
                self.blink(this);
            });
        });
    },
    /**
     * 发送ajax请求（为了过滤）
     * @param params
     */
    ajax: function (params) {

        //过滤成功回调
        var fun = params['success'];
        params['success'] = function (jsonData) {
            //说明权限验证未通过
            if (jsonData.status == '1001') {
                top.window.location.reload();
                return;
            }
            fun(jsonData);
        };
        //发送ajax请求
        $.ajax(params);
    },
    /**
     * 拼接地址
     * @param path
     */
    splicing_url:function(path){
        return window.location.protocol + "//" + window.location.host + path;
    },
    /**
     * 数组取交集
     * @returns {Array}
     */
    array_intersect:function () {
        var result = new Array();
        var obj = {};
        for (var i = 0; i < arguments.length; i++) {
            for (var j = 0; j < arguments[i].length; j++) {
                var str = arguments[i][j];
                if (!obj[str]) {
                    obj[str] = 1;
                }
                else {
                    obj[str]++;
                    if (obj[str] == arguments.length)
                    {
                        result.push(str);
                    }
                }//end else
            }//end for j
        }//end for i
        return result;
    }

};
window.ApiHelper = ApiHelper.init();
