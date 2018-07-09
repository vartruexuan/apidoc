//*********ApiHelper.js 核心操作对象************
var ApiHelper = {
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
        this.bind_build__url();
        return this;
    },
    //设置生成文档状态
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
     * @param count 总数量
     * @param error 失败数量
     * @param success 成功数量
     * @returns {ApiHelper}
     */
    set_module_status: function (modules) {
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
        if(error_count>0){
            this.blink('.module_error');

        }
        return this;
    },
    //添加模块列表
    append_module: function (modules) {
        this.set_module_status(modules);
        var id_index = 0;
        for (var i in modules) {
            id_index += 1
            var id = "c" + id_index;


            //添加返回信息
            var dd_con = "<div style='padding:10px;'>";
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
    //展示版本信息
    show_info: function (info) {
        $('.footer').html('');
        $('.footer').append('版本: <a>' + info['version'] + "</a>");
        $('.footer').append('生成时间: <a>' + info['date'] + "</a>");
    },

    //生成文档
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
                $('.modules_status').html('<a><img src="' + api_covert_img + '/load.gif"/> 正在加载中...</a>');
            },
            success: function (jsonData) {
                self.module_url = jsonData.data.url;
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
    //绑定生成链接事件
    bind_build__url: function () {

        var self = this;
        //绑定选中事件
        $('body').delegate('.modules-div button', 'click', function () {
            $(this).toggleClass('active');
        });
        //绑定跳转事件
        $('body').delegate('.module .go_url', 'click', function () {

            var url = $('input[name=modules_url]').val();
            if (url) {
                window.open(url);
            }
        })

        // 绑定事件
        $('#modules_url').on('click', function () {
            //获取模块名称
            if (!self.module_url) {
                layer.msg('未发现对应的模块,可能是文档并未生成成功', {icon: 2, time: 3000});
                return;
            }
            $ms = self.module_url.split('num=');
            //获取接口模块json 并解析
            self.ajax({
                url: api_dist + '/json/module/' + $ms[1] + '.json',
                type: 'get',
                dataType: "json",
                success: function (jsonData) {
                    if (!jsonData) {
                        layer.msg('未发现对应的模块...', {icon: 2})
                    }
                    //拼接模板 并展示
                    var html = "<div style='padding:10px;' class='module'>";
                    //url框
                    html += '<div class="input-group ">\n' +
                        '          <span class="input-group-addon" id="sizing-addon1">url:</span>' +
                        '          <input type="text" class="form-control" name="modules_url" aria-label="Text input with multiple buttons" readonly>\n' +
                        '          <div class="input-group-btn">\n' +
                        '            <button type="button" class="btn btn-default go_url">跳转</button>\n' +
                        '          </div>\n' +
                        '      </div>';
                    html += "<hr/>";
                    //已有链接列表
                    html += '<div style="float: left;width: 50%;">';
                    html += "<h3>已有链接</h3>";
                    html += '<ul class="list-group" >\n' +
                        '  <li class="list-group-item" title="分校小程序,测试1">http://www.swaggertest.com/apidoc/dist?num=module_37d8840a6834ae2f04b028076a8bfaf4</li>\n' +
                        '  <li class="list-group-item" title="分校小程序,测试1">http://www.swaggertest.com/apidoc/dist?num=module_37d8840a6834ae2f04b028076a8bfaf4</li>\n' +
                        '  <li class="list-group-item" title="分校小程序,测试1">http://www.swaggertest.com/apidoc/dist?num=module_37d8840a6834ae2f04b028076a8bfaf4</li>\n' +

                        '</ul>';
                    html += '</div>';
                    html += "<hr class='dri'  style='float:left; height: 360px'/>";

                    //模块列表(可生成链接)
                    html += '<div style="float: right;width: 40%;">';
                    html += "<h3>模块列表</h3>";
                    html += '<div class="list-group modules-div ">';
                    for (var i in jsonData) {
                        html += '<button type="button" style="margin-bottom: 2px;" class="list-group-item">' + jsonData[i]['title'] + '</button>';
                    }
                    html += "</div></div>";
                    html+="<div style='clear: both'></div>"
                    html += "</div>"
                    layer.closeAll();
                    layer.open({
                        type: 1,
                        title: '模块列表选择',
                        shade: 0.4,
                        btn: ['生成链接'],
                        btn1: function (index, layero) {
                            // 获取选中的模块
                            var div_m = $('.modules-div button.active');
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
                            self.ajax({
                                url: "",
                                type: 'POST',
                                dataType: 'json',
                                data: {
                                    type: 1,
                                    modules: modules
                                },
                                success: function (jsonData) {
                                    if (jsonData['status'] == 0) {

                                        $('input[name=modules_url]').val(window.location.protocol + "//" + window.location.host + jsonData['data']['url']);
                                    }
                                },
                                error: function () {
                                    layer.msg('服务器或网络异常');
                                }

                            });

                            //获取选中的列表
                            //生成链接
                        },
                        //offset: 'c',
                        // maxmin: true,
                        skin: 'layui-layer-rim', //没有背景色
                        area: ['800px'], //宽高
                        content: html
                    });
                },
                error: function (xr) {
                    layer.msg('未发现对应的模块...', {icon: 2})
                }
            });

        })
    },
    /**
     *  指定元素闪烁
     * @param selector 选择器 ".mo"
     */
    blink: function (selector) {
        var self=this;
        $(selector).fadeOut('slow', function () {
            $(this).fadeIn('slow', function () {
                self.blink(this);
            });
        });
    },
    ajax:function (params) {

        //过滤成功回调
        var fun=params['success'];
        params['success']=function (jsonData) {
                //说明权限验证未通过
                if(jsonData.status=='1001'){
                    window.location.reload();
                    return;
                }
                fun(jsonData);
        };
        //发送ajax请求
        $.ajax(params);
    },
    //获取模块列表
    get_module_list: function () {

    }

};
window.ApiHelper = ApiHelper.init();
