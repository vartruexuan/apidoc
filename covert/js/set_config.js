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
                var modules = jsonData.data.config.config.module;
                console.log(modules);
                //主域名
                $('input[name=host]').val(host);
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
            //模块路径-选择
            self.select_path();
            //模块标签-添加
            $('body').delegate('.btn-add-label', 'click', function () {
                self.add_label($(this).parents('.layui-form-item:eq(0)').find('.module-label:eq(0)'));
            });
            //模块标签-删除
            self.del_label();
            return this;
        },
        /**
         * 获取配置信息
         */
        get_config: function (sunccess_fun) {

            //初始配置
            parent.ApiHelper.ajax({
                url:parent.post_get_config ,
                type: 'post',
                dataType: 'json',
                data: {
                },
                success: sunccess_fun
            })
            return this;
        },

//*********************** 模块内部操作**********************//
        /**
         * 添加模块
         */
        add_module: function (module) {
            var self=this;
            var title = "新增模块";
            var version = "v1.0";
            var description = "";
            var template = "";
            //单模块html模板
            template += '<blockquote class="">';
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
            template += '             <legend>路径 <i class="layui-icon btn-add-path" style="color:#0f7faa;cursor: pointer;font-size: 24px;"title="添加路径">&#xe61f;</i></legend>';
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
                version=module.version;
                description=module.description;
                for (var i = 0; i < module.path.length; i++) {
                    paths.push(self.add_path(null, module.path[i]));
                }
                for (var i = 0; i < module.tags.length; i++) {
                    tags.push(self.add_label(null, module.tags[i].name, module.tags[i].description));
                }
            }
            template = template.replace('#title#', title);
            template = template.replace('#version#', version);
            template = template.replace('#description#', description);
            template=template.replace('#path#',paths.join('')).replace("#tag#",tags.join(""));
            //添加模块
            var id = new Date().getTime();
            window.element.tabAdd('tab-modules', {
                title: title + ' <i class="layui-icon btn-del-module" style="color: red" title="删除" >&#xe640;</i>'
                , content: template
                , id: id
            });
            //让该模块选中
            window.element.tabChange('tab-modules', id);
            return this;
        },
        /**
         * 删除
         */
        delete_module: function () {
            $('body').delegate('.btn-del-module', 'click', function (event) {
                //阻止事件冒泡
                event.stopPropagation();
                var id = $(this).parent().attr('lay-id');
                //删除当前模块
                window.element.tabDelete('tab-modules', id);

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
            btn += '        <div class="layui-col-md10">';
            btn += '            <input type="text" name="path" placeholder="目录/文件路径" autocomplete="off" class="layui-input" value="#value#">';
            btn += '       </div>';
            btn += '       <div class="layui-col-md1">';
            btn += '             <button class="layui-btn layui-btn-fluid layui-btn-primary btn-select-path" type="button"><i class="layui-icon" title="选择路径">&#xe655;</i></button>';
            btn += '       </div>';
            btn += '       <div class="layui-col-md1">';
            btn += '            <button class="layui-btn layui-btn-fluid layui-btn-primary btn-del-path" type="button"><i class="layui-icon " style="color:red" title="删除">&#xe640;</i></button>';
            btn += '       </div>';
            btn += '   </div>';

            btn = btn.replace('#value#', val);
            if (parent_obj) {
                parent_obj.append($(btn));
            }
            return btn;
        },
        del_path: function () {

            $('body').delegate('.btn-del-path', 'click', function () {

                $(this).parents('div.layui-row').remove();
            });
        },
        /**
         * 路径选择
         */
        select_path: function () {
            $('body').delegate('.btn-select-path', 'click', function () {

                //1. 获取主配置数据 并验证
                //主机域名
                var host = $("input[name=host]").val();
                //协议
                var schemes = [];
                $('input[name=schemes]:checked').each(function () {
                    schemes.push($(this).val());
                })
                //定界符
                var delimiter = $('input[name=delimiter]').val();
                //2. 获取模块配置信息 并验证


                //边缘弹出
                layer.open({
                    title: "路径选择"
                    , type: 1
                    , offset: 't' //具体配置参考：offset参数项
                    , content: '<div id="path-tree" style="padding: 10px;"></div>'
                    , btnAlign: 'c' //按钮居中
                    , shade: 0 //不显示遮罩
                    , id: "path-win"
                    , yes: function () {
                        layer.closeAll();
                    }
                });
                $('#path-tree').html('');
                layui.tree({
                    elem: '#path-tree'
                    , nodes: [{ //节点数据
                        name: '节点A'
                        , children: [{
                            name: '节点A1'
                        }]
                    }, {
                        name: '节点B'
                        , children: [{
                            name: '节点B1'
                            , alias: 'bb' //可选
                            , id: '123' //可选
                        }, {
                            name: '节点B2'
                        }]
                    }]
                    , click: function (node) {
                        console.log(node) //node即为当前点击的节点数据
                    }
                });
            })
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
            $.ajax({
                url: parent.post_save_config,
                type: "post",
                dataType: 'json',
                data: {
                    "config": {
                        config: {
                            "test": "ddd"
                        },
                        server_info: {},

                    }

                },
                success: function (jsonData) {

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