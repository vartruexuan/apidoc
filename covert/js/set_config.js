/**
 * Created by PhpStorm.
 * User: 小昭昭
 * Date: 2018/9/10
 * Time: 14:28
 */
var config = {

        //初始化
        init: function () {
            var self = this;
            //初始化 layui
            layui.use(['form', 'element', 'tree'], function () {
                window.element = layui.element;
                window.layform= layui.form;
                //第一次获取配置信息
                self.initConfig();
                //绑定事件
                self.bind_event();
            })

            return this;
        },
        /**
         *  初始化配置数据
         */
        initConfig: function () {
            var self = this;
            this.get_config(function (jsonData) {
                //*****初始化配置数据****//
                var host = jsonData.data.config.server_info.host;
                var delimiter = jsonData.data.config.config.delimiter;
                var schemes = jsonData.data.config.server_info.schemes;
                var modules = jsonData.data.config.config.module;
                //主域名
                if(host=='{{local_host}}'){
                    var host_type=1;
                    $('input[name=custom_host]').hide();
                    $('select[name=host_type]').find('option[value=1]').prop('selected','selected');
                }else{
                    $('select[name=host_type]').find('option[value=2]').prop('selected','selected');
                    $('input[name=custom_host]').val(host);
                }
                //让对应选中
                $('input[name=host]').val(host);
                //定界符
                $('input[name=delimiter]').val(delimiter);
                //接口协议
                $('input[name=schemes]').each(function () {
                    for (var i in schemes) {
                        if (schemes[i].toLowerCase() == $(this).attr("title").toLowerCase()) {
                            $(this).prop("checked", true);
                            return true;
                        }
                    }
                });
                //模块列表
                for (var i in modules) {
                    self.add_module(modules[i]);
                }
            });
            return this;
        },
        /**
         * 绑定事件
         */
        bind_event: function () {
            var self = this;
            //取消
            $('.btn-cancel').on('click', function () {
                self.cancel();
            })
            //保存
            $('.btn-save').on('click', function () {
                self.save();
            });
            //添加模块
            $('.btn-add-module').on('click', function () {
                self.add_module();
            });
            //模块删除
            self.delete_module();
            //模块路径-添加
            $('body').delegate('.btn-add-path', 'click', function () {
                self.add_path($(this).parents('.layui-form-item:eq(0)').find('.module-path:eq(0)'));
            });
            //模块路径-删除
            self.del_path();
            //模块标签-添加
            $('body').delegate('.btn-add-label', 'click', function () {
                self.add_label($(this).parents('.layui-form-item:eq(0)').find('.module-label:eq(0)'));
            });
            //模块标签-删除
            self.del_label();
            //模块名和tab同步
            $('.tab-modules').delegate("input[name=title]", 'change', function () {
                $('.tab-modules .layui-tab-title li:eq(' + $(this).parents('.layui-tab-item:eq(0)').index() + ')').html($(this).val()+'<i class="layui-icon btn-del-module" style="color: red" title="删除" >&#xe640;</i>')

            });
            // 域名操作
            layform.on('select', function(data){
                var select_obj=data.elem;
                var val=data.value;
                if(val==1){
                    $(select_obj).parent().next().find('input[name=custom_host]').hide();
                    $(select_obj).parent().next().find('input[name=host]').val("{{local_host}}");
                }else if(val==2){
                    $(select_obj).parent().next().find('input[name=custom_host]').show();
                    $(select_obj).parent().next().find('input[name=host]').val($(this).parent().next().find('input[name=custom_host]').val());
                }
            });

            $('input[name=custom_host]').on('change',function () {
                $(this).next().val($(this).val());
            });

            return this;
        },
        /**
         * 获取配置信息
         */
        get_config: function (sunccess_fun) {

            //初始配置
            parent.ApiHelper.ajax({
                url: parent.post_get_config,
                type: 'post',
                dataType: 'json',
                data: {},
                success: sunccess_fun
            })
            return this;
        },

//*********************** 模块内部操作**********************//
        /**
         * 添加模块
         */
        add_module: function (module) {

            var titles = [];
            $("input[name=title]").each(function () {
                titles.push($(this).val())
            });
            var self = this;
            var title = "module";
            //生成一个唯一的模块名
            while (true) {
                var random = Math.ceil(Math.random() * 100);
                title1 = title + random;
                if (titles.indexOf(title1) < 0) {
                    title = title1;
                    break;
                }
            }
            var version = "v1.0";
            var description = "";
            var template = "";
            //单模块html模板
            template += '<blockquote class="layui-form">';
            template += '    <div class="layui-row layui-col-space10">';
            template += '         <div class="layui-col-md3">';
            template += '             <fieldset class="layui-elem-field layui-field-title">';
            template += '                 <legend>名称</legend>';
            template += '                 <div class="layui-field-box">';
            template += '                      <input type="text" name="title" placeholder="模块名称" autocomplete="off" class="layui-input" value="#title#">';
            template += '                 </div>';
            template += '             </fieldset>';
            template += '         </div>';
            template += '         <div class="layui-col-md3">';
            template += '             <fieldset class="layui-elem-field layui-field-title">';
            template += '                 <legend>版本</legend>';
            template += '                 <div class="layui-field-box">';
            template += '                      <input type="text" name="version"  placeholder="版本号：v1.0" autocomplete="off" class="layui-input" value="#version#">';
            template += '                 </div>';
            template += '             </fieldset>';
            template += '         </div>';
            template += '         <div class="layui-col-md6">';
            template += '              <fieldset class="layui-elem-field layui-field-title">';
            template += '                  <legend>描述</legend>';
            template += '                  <div class="layui-field-box">';
            template += '                       <input type="text" name="description" placeholder="描述下这个模块" autocomplete="off" class="layui-input" value="#description#">';
            template += '                  </div>';
            template += '              </fieldset>';
            template += '         </div>';
            template += '   </div>';
            template += '    <div class="layui-form-item" style="position: relative;">';
            template += '         <fieldset class="layui-elem-field">';
            template += '             <legend>' +
                '                           路径 <i class="layui-icon btn-add-path" style="color:#0f7faa;cursor: pointer;font-size: 24px;"title="添加路径">&#xe61f;</i>' +
                '                           自定义注释 <i class="layui-icon btn-add-comment-path" style="color:#0f7faa;cursor: pointer;font-size: 24px;"title="自定义注释">&#xe61f;</i>' +
                '                       </legend>';
            template += '             <div class="layui-field-box module-path">#path#</div>';
            template += '         </fieldset>';
            template += '     </div>';
            template += '     <div class="layui-form-item">';
            template += '         <fieldset class="layui-elem-field">';
            template += '              <legend>标签 <i class="layui-icon btn-add-label" style="color:#0f7faa;cursor: pointer;font-size: 24px;" title="添加标签说明">&#xe61f;</i></legend>';
            template += '              <div class="layui-field-box module-label">#tag#</div>';
            template += '          </fieldset>';
            template += '     </div>';
            template += ' </blockquote>';
            var paths = [];
            var tags = [];
            if (module) {
                title = module.title;
                version = module.version;
                description = module.description;
                if (module.path) {
                    for (var i = 0; i < module.path.length; i++) {
                        paths.push(self.add_path(null, module.path[i]));
                    }
                }
                if (module.tags) {
                    for (var i = 0; i < module.tags.length; i++) {
                        tags.push(self.add_label(null, module.tags[i].name, module.tags[i].description));
                    }
                }

            }
            template = template.replace('#title#', title);
            template = template.replace('#version#', version);
            template = template.replace('#description#', description);
            template = template.replace('#path#', paths.join('')).replace("#tag#", tags.join(""));
            //添加模块
            var id = new Date().getTime();
            window.element.tabAdd('tab-modules', {
                title: title + ' <i class="layui-icon btn-del-module" style="color: red" title="删除" >&#xe640;</i>'
                , content: template
                , id: id
            });
            //让该模块选中
            window.element.tabChange('tab-modules', id);
            layui.form.render();
            return this;
        },
        /**
         * 删除模块
         */
        delete_module: function () {
            $('body').delegate('.btn-del-module', 'click', function (event) {
                //阻止事件冒泡
                event.stopPropagation();
                var id = $(this).parent().attr('lay-id');

                layer.confirm("确定删除此模块", {icon: 3, title: "提示"}, function (index) {
                    //删除当前模块
                    window.element.tabDelete('tab-modules', id);
                    layer.close(index);
                })
            })
            /*     window.element.on('tabDelete(tab-modules)', function(data){
                     alert(this.getAttribute('lay-id'));
                     return false;
                 });*/
        },
        /**
         * 路径添加
         */
        add_path: function (parent_obj, val) {
            val = val ? val : '';
            var btn = '<div class="layui-row">';

            // <!-- 相对地址 -->
            btn += '       <div class="layui-col-md2">';
            btn += '                <select name="relative" lay-verify="">';
            btn += '                     <option value="" #null# >绝对地址</option>';
            btn += '                     <option value="{{web_root_top}}" #web_root_top# >根目录上一级</option>';
            btn += '                     <option value="{{web_root_top2}}" #web_root_top2# >根目录上二级</option>';
            btn += '                     <option value="{{web_root}}" #web_root# >根目录</option>';

            btn += '                </select>';
            btn += '       </div>';

            btn += '       <div class="layui-col-md9">';
            btn += '            <input type="text" name="path" placeholder="目录/文件路径" autocomplete="off" class="layui-input" value="#value#">';
            btn += '       </div>';
            btn += '       <div class="layui-col-md1">';
            btn += '            <button class="layui-btn layui-btn-fluid layui-btn-primary btn-del-path" type="button"><i class="layui-icon " style="color:red" title="删除">&#xe640;</i></button>';
            btn += '       </div>';
            btn += '   </div>';

            //地址相对类型处理
            if (val.indexOf("{{web_root_top2}}") > -1) {
                val = val.replace("{{web_root_top2}}", "");
                btn = btn.replace("#web_root_top2#", "selected")
            } else if (val.indexOf("{{web_root_top}}") > -1) {
                val = val.replace("{{web_root_top}}", "");
                btn = btn.replace("#web_root_top#", "selected")
            } else if (val.indexOf("{{web_root}}") > -1) {
                val = val.replace("{{web_root}}", "");
                btn = btn.replace("#web_root#", "selected")
            } else {
                btn = btn.replace("#null#", "selected")
            }
            btn = btn.replace("#web_root_top2#", "").replace("#web_root_top#", "").replace("#web_root#", "").replace("#null#", "");
            //地址
            btn = btn.replace('#value#', val);
            if (parent_obj) {
                parent_obj.append($(btn));
            }
            layui.form.render("select");
            return btn;
        },
        del_path: function () {

            $('body').delegate('.btn-del-path', 'click', function () {

                $(this).parents('div.layui-row').remove();
            });
        },
        /**
         * 标签添加
         */
        add_label: function (parent_obj, name, description) {
            name = name ? name : '';
            description = description ? description : '';
            var html = '  <div class="layui-row ">';
            html += '           <div class="layui-col-md3">';
            html += '                <input type="text" name="name" placeholder="标签名" autocomplete="off" class="layui-input" value="#name#">';
            html += '            </div>';
            html += '            <div class="layui-col-md8">';
            html += '                <input type="text" name="description" placeholder="标签描述" autocomplete="off" class="layui-input" value="#description#">';
            html += '            </div>';
            html += '            <div class="layui-col-md1">';
            html += '                 <button class="layui-btn layui-btn-fluid layui-btn-primary btn-del-label " type="button">';
            html += '                       <i class="layui-icon" style="color:red" title="删除">&#xe640;</i>';
            html += '                 </button>';
            html += '            </div>';
            html += '     </div>';
            html = html.replace("#name#", name).replace("#description#", description);

            if (parent_obj) {
                parent_obj.append($(html));
            }
            return html;
        },
        /**
         * 标签删除
         */
        del_label: function () {
            $('body').delegate('.btn-del-label', 'click', function () {
                $(this).parents('div.layui-row').remove();
            });

        }
        ,

//********************************8*********dd****************************//
        /**
         *  保存
         */
        save: function () {


            //*** 模块配置 ***//

            try {
                //***  主配置 ***//
                var server_info = $(".server_info");//主配置对象
                var host = server_info.find("input[name=host]").val();//主机域名
                var delimiter = server_info.find("input[name=delimiter]").val();//定界符
                var schemes = [];//支持协议
                server_info.find('input[name=schemes]:checked').each(function () {
                    schemes.push($(this).attr("title"));
                });
                var modules = [];
                $('#config_form').find('.layui-tab-item').each(function () {
                    //标题
                    var title = $.trim($(this).find("input[name=title]").val());
                    //版本
                    var version = $(this).find('input[name=version]').val();
                    //描述
                    var description = $(this).find('input[name=description]').val();
                    //路径
                    var paths = [];
                    $(this).find('.module-path .layui-row').each(function () {
                        //拼接类型 和相对地址
                        var p = $(this).find('input[name=path]').val();
                        var type = $(this).find('select[name=relative]').val();
                        var path=type + p;
                        if(path){
                            paths.push(path);
                        }
                    })
                    //标签
                    var labels = [];
                    $(this).find('.module-label .layui-row').each(function () {
                        var name = $(this).find("input[name=name]").val();//标签名
                        var description = $(this).find("input[name=description]").val();//标签描述
                        labels.push({
                            "name": name,
                            "description": description,
                        });
                    });

                    //##### 验证参数 #######
                    if(!schemes){
                        throw "必须选中一种协议";
                    }
                    //验证模块标题
                    if(!title){
                        throw "模块名称不能为空";
                    }
                    for(var i in modules){
                        if(title==modules[i]['title']){
                            throw "模块名称不能重复";
                        }
                    }
                    //验证地址
                    if(paths.length<=0){
                        throw "模块下至少保证有一个路径";
                    }
                    //加入模块列表
                    modules.push({
                        title: title,
                        version: version,
                        description: description,
                        path: paths,
                        tags: labels
                    });
                });
            }catch (e){

                //处理错误
                layer.msg(e);
                return
            }




            //****  拼接配置  ****//
            var data = {

                // 主json配置
                server_info: {
                    //域名
                    host: host,
                    //传输协议
                    schemes: schemes,
                },
                config: {
                    //定界符
                    delimiter: delimiter,
                    module: modules,
                }


            };
            //console.log(JSON.stringify(data));
            //**** 发送请求 ****//
            //2.提交代码
            $.ajax({
                url: parent.post_save_config,
                type: "post",
                dataType: 'json',
                data: data,
                success: function (jsonData) {
                    if (jsonData.status == 0) {
                        parent.layer.msg('保存成功');
                    } else {
                        layer.msg("保存失败", {icon: 2});
                    }

                }
            });
            return this;
        }
        ,
        /**
         * 取消
         */
        cancel: function () {
            parent.layer.closeAll();
            return this;
        }


    }
;
window.setConfig = config.init();