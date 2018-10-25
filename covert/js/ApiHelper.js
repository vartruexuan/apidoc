//*********ApiHelper.js 核心操作对象************
var ApiHelper = {
    module_name: "",//生成后的第一个链接名
    module_url: "",//生成后的第一个文档链接
    //初始化
    init: function () {
        var self = this;
        //初始化layer
        layui.use(['element', 'layer', 'code', 'util'], function () {
            var element = layui.element;
            var layer = layui.layer;
            var util = layui.util;
            //展示右下底部按钮
            util.fixbar({
                bar1: true,
                bar2: true,
                click: function (type) {
                    //console.log(type);
                    if (type === 'bar1') {
                        alert('点击了bar1')
                    }else if(type === 'bar2'){
                        alert('点击了bar2')
                    }else if(type === 'top'){
                       // alert('点击了top')
                    }
                }
            });
            //始化绑定事件
            self.bind_event();
        });
        return this;
    },
    /**
     * 初始化绑定事件
     * @returns {ApiHelper}
     */
    bind_event: function () {
        var self = this;
        // 配置事件
        $('.btn-setConfig').on('click', function () {
            self.set_config();
        });
        // 模块列表添加点击事件和样式
        $('.tab-container').delegate('>div>a', 'click', function () {
            $('.tab-container>div>a').css('backgroundColor', '')
            $(this).css('backgroundColor', 'skyblue');
            $('.tab-container .tab-content').addClass('hide');
            $(this).parent().find('.tab-content').removeClass('hide');
        });
        //绑定生成指定模块
        $('#modules_url').on('click', function () {
            self.build_url();
        });
        //刷新
        $('#doc_refresh').on('click', function () {
            self.covert();
        });
        return this;
    },
    /**
     * 设置生成文档状态
     * @param jsonData 发送生成返回的数据
     * @returns {ApiHelper}
     */
    set_covert_status: function (jsonData) {
        if (jsonData.status == 0 && jsonData.data.url) {//成功
            $('.message').html('<a href="' + jsonData.data.url + '" class="go_to_dist" target="_blank"><span><i class="layui-icon">&#xe602;</i> 访问接口文档</span></a>');
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
        html += "<span>总数量: <span class='layui-badge layui-bg-green'>" + total_count + "</span></span> ";
        html += "<span>成功: <span class='layui-badge layui-bg-green'>" + success_count + "</span></span> ";
        html += "<span>失败: <span class='module_error layui-badge'>" + error_count + "</span></span> ";
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
            id_index += 1;
            var id = "c" + id_index;

            //添加返回信息
            var dd_con = '<div style="padding:10px;">';
            if (modules[i]['status'] == 0) {
                dd_con += "<div><pre><p  class='layui-code layui-box layui-code-view' style='color: green;'>(" + i + ") 生成成功" + "</p></pre></div>"
                //模块生成失败
            } else {
                dd_con += "<div><pre class='layui-code layui-box layui-code-view' style='color: red'> " + modules[i]['status_message'] + "</pre></div>"
                dd_con += "<div><pre class='layui-code layui-box layui-code-view'> " + "文件地址: <span class='value ' >" + modules[i]['file_name'] + "</span></p></pre></div>";

                dd_con += "<div><pre class='layui-code layui-box layui-code-view' lay-title='php'> <h3 class='layui-code-h3'>" + "注释</h3><br><ol class='layui-code-ol' style='color: green' ><li>" + modules[i]['com'] + "</li></ol></pre></div>";
            }
            dd_con += "</div>"
            //添加tabs 标题
            var html_title = "";
            var html_content = "";
            html_title += '<li  class=""><a href="#' + id + '" role="tab" data-toggle="tab"><span style="color: ' + (modules[i]['status'] == 0 ? "green" : "red") + ';"><i class="layui-icon">' + (modules[i]['status'] == 0 ? '&#xe605;' : '&#x1006;') + '</i> ' + i + '</span></a></li>';
            html_content += '<div  class="layui-tab-item " id="' + id + '">' + dd_con + '</div>';

            $('.covert_module .layui-tab-title').append(html_title);
            $('.covert_module .layui-tab-content').append(html_content);
        }
        $('.covert_module .layui-tab-title li a:eq(0)').trigger('click');
        return this;
    },
    /**
     * 展示版本信息
     * @param info
     */
    show_info: function (info) {
        $('.apidoc-info').html('');
        $('.apidoc-info').append('<label class="layui-label layui-word-aux">版本:</label> <a>' + info['version'] + "</a> ");
        $('.apidoc-info').append('<label class="layui-label layui-word-aux">生成时间:</label> <a>' + info['date'] + "</a>");
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
                /**
                 *  清空数据
                 */
                $('.covert_module .layui-tab-title').html('');
                $('.covert_module .layui-tab-content').html('');
                $('.modules_status').html('<a style="font-size: 20px;"><img mou height="30px" src="' + page_covert_img + '/load.gif"/> 正在生成文档中.....</a>');
            },
            success: function (jsonData) {
                self.module_url = jsonData.data.url;
                self.module_name = (self.module_url.split('num='))[1];
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
    build_url: function () {
        layer.open({
            type: 2,
            title: '指定模块生成链接',
            shadeClose: true,
            shade: [0.5],
            offset: 't',
            // maxmin: true, //开启最大化最小化按钮
            area: ['900px', '500px'],
            content: page_bulid_url,
        });
    },
    /**
     * 配置
     */
    set_config: function () {
        layer.open({
            type: 2,
            title: '配置',
            shadeClose: true,
            shade: [0.5],
            id: 'layer-set-config',
            //   offset: 't',
            maxmin: true, //开启最大化最小化按钮
            area: ["1000px", "600px"],
            content: page_set_config,

        });
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
        return this;
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
    splicing_url: function (path) {
        return window.location.protocol + "//" + window.location.host + path;
    },
    /**
     * 数组取交集
     * @returns {Array}
     */
    array_intersect: function () {
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
                    if (obj[str] == arguments.length) {
                        result.push(str);
                    }
                }//end else
            }//end for j
        }//end for i
        return result;
    }

};
window.ApiHelper = ApiHelper.init();
