/**
 * Created by PhpStorm.
 * User: 小昭昭
 * Date: 2018/11/26
 * Time: 12:17
 */

var comment_help = {
    /**
     *  初始化
     */
    init: function () {
        var self = this;
        layui.use(['element', 'layer', 'code', 'form', 'table'], function () {
            window.element = layui.element;
            window.layer = layui.layer;
            window.form = layui.form;
            window.table = layui.table;
            //始化绑定事件
            self.bind_event();
        });
        return this;
    },
    /**
     * 初始绑定事件
     */
    bind_event: function () {
        var self = this;
        //添加参数
        $('.btn-add-params').on('click', function () {
            self.add_params();
        });
        //删除参数
        $(document).delegate('.del-params', 'click', function () {
            $(this).parents('tr:eq(0)').remove();
            layer.closeAll();
        });
        // 添加响应
        $(document).delegate(".btn-add-responses", 'click', function () {
            self.add_response();
        });
        //添加mime
        $(document).delegate('.btn-add-mime','click',function () {
            layer.prompt({title:"自定义mime"},function(val, index){
                $(".div-consumes").append('<input type="checkbox" name="consumes" title="'+val+'">');
                form.render();
                layer.close(index);
            });

        })
        //生成注释
        $(document).delegate(".btn-covert-comment", "click", function () {
            self.comment_covert();
        })
        //逆向注释
        $(document).delegate(".btn-reverse-comment", "click", function () {
            self.comment_reverse();
        })
        //json格式化
        $("#btn-format-json").on('click',function () {
            //格式化
             $("#text-json").val(formatJson($("#text-json").val()));
            //解析验证语法
            try {
                var input = eval('(' + $('#text-json').val() + ')');
            }
            catch (error) {
                return layer.msg("Cannot eval JSON: " + error,{icon:2});
            }
            //加载json视图
            var editor = new JsonEditor('#view-json',input);
             editor.load(input);
        });
        //语法类型切换


        $('div.comment-type').delegate('.layui-form-radio',"click",function () {
            $("textarea[name=comment-result]").val($(this).prev('input[name=comment-type]').attr("value"));
        });
    },
    /**
     * 添加参数
     * */
    add_params: function (param) {

        var template_params={
            //参数名
            name:"",
            //类型
            type_string:"",
            type_number:"",
            type_integer:"",
            type_boolean:"",
            type_array:"",
            type_file:"",
            //位置
            in_query:"",
            in_header:"",
            in_path:"",
            in_formData:"",
            in_body:"",
            //默认值
            default:"",
            //描述
            description:"",
            //必填
            required_false:"",
            required_true:"",
            //空是否允许发送
            allowEmptyValue_false:"",
            allowEmptyValue_true:"",
        };
        //有参数的话
        if(param){
            template_params.name=param["name"];
            template_params["type_"+param["type"]]="selected";
            template_params["in_"+param["in"]]="selected";
            template_params["default"]=param["default"];
            template_params["description"]=param["description"];
            if(typeof param[" required"]!=undefined ){
                template_params["required_"+param["required"]]="selected";
            }
            if(typeof param["allowEmptyValue"]!=undefined ){
                template_params["allowEmptyValue_"+param["allowEmptyValue"]]="selected";
            }
        }
        console.log(template_params);
        //1. tr 模板
        var tr_template = ' <tr>\n' +
            '            <td>\n' +
            '                <input type="text" name= "name" placeholder="参数名" value="{{name}}" class="layui-input">\n' +
            '            </td>\n' +
            '            <td>\n' +
            '                <select name="type">\n' +
            '                    <option value="string"  {{type_string}}>string</option>\n' +
            '                    <option value="number"  {{type_number}}>number</option>\n' +
            '                    <option value="integer" {{type_integer}}>integer</option>\n' +
            '                    <option value="boolean" {{type_boolean}}>boolean</option>\n' +
            '                    <option value="array"   {{type_array}}>array</option>\n' +
            '                    <option value="file"    {{type_file}}>file</option>\n' +
            '                </select>\n' +
            '            </td>\n' +
            '            <td>\n' +
            '                <select name="in" lay-filter="params_type">\n' +
            '                    <option value="query"    {{in_query}}>query</option>\n' +
            '                    <option value="header"   {{in_header}}>header</option>\n' +
            '                    <option value="path"     {{in_path}}>path</option>\n' +
            '                    <option value="formData" {{in_formData}}>formData</option>\n' +
            '                    <option value="body"     {{in_body}}>body</option>\n' +
            '                </select></td>\n' +
            '            <td>\n' +
            '                <input type="text" name="default"  class="layui-input" value="{{default}}">\n' +
            '            </td>\n' +
            '            <td>\n' +
            '                <input type="text" name="description" class="layui-input" value="{{description}}">\n' +
            '\n' +
            '            </td>\n' +
            '            <td>\n' +
            '                <select name="required" lay-filter="required">\n' +
            '                    <option value="false" {{required_false}}>否</option>\n' +
            '                    <option value="true"  {{required_true}}>是</option>\n' +
            '                </select>\n' +
            '            </td>\n' +
            '            <td>\n' +
            '                <select name="allowEmptyValue" lay-filter="allowEmptyValue">\n' +
            '                    <option value="false" {{allowEmptyValue_false}}>否</option>\n' +
            '                    <option value="true"  {{allowEmptyValue_true}}>是</option>\n' +
            '                </select>\n' +
            '            </td>\n' +
            '            <td >\n' +
            '                <div class="layui-btn-group">\n' +
            '                    <button type="button" class="layui-btn layui-btn-primary layui-btn-sm del-params" style="color: red;">\n' +
            '                        <i class="layui-icon">&#xe640;</i>\n' +
            '                    </button>\n' +
            '                </div>\n' +
            '\n' +
            '            </td>\n' +
            '        </tr>';

        //替换模板
        for(var param in template_params){
            tr_template=tr_template.replace(new RegExp("{{"+param+"}}","g"),template_params[param]);
        }
        //2.插入导参数列表中
        $('.table-params tbody').append(tr_template);

        form.render();
    },
    /**
     * 添加响应
     */
    add_response: function (response) {

        var template_params={
            "status":"",
            "application/json":"",
            "application/xml":"",
            "description":"",
            "examples":""
        };

        //如有响应数据
        if(response){
            template_params["status"]=response["status"];
            template_params[response["produces"]]="selected";
            template_params["description"]=response["description"];
            template_params["examples"]=JSON.stringify(response["examples"]);
        }
        console.log(template_params);
        var response_template = '                                            <tr>\n' +
            '                                                <td>\n' +
            '                                                    <input type="text" name="status" class="layui-input" value="{{status}}" placeholder="例如:200">\n' +
            '                                                </td>\n' +
            '                                                <td>\n' +
            '                                                    <select name="produces" id="">\n' +
            '                                                        <option value="application/json" {{application/json}}>application/json</option>\n' +
            '                                                        <option value="application/xml"  {{application/xml}}>application/xml</option>\n' +
            '                                                    </select>\n' +
            '                                                </td>\n' +
            '                                                <td>\n' +
            '                                                    <input type="text" name="description" class="layui-input" value="{{description}}" placeholder="描述">\n' +
            '                                                </td>\n' +
            '                                                <td>\n' +
            '                                                    <textarea name="examples" class="layui-textarea layui-bg-black" cols="40" style="height: 30px;">{{examples}}</textarea>\n' +
            '                                                </td>\n' +
            '                                                <td>\n' +
            '                                                    <button type="button" class="layui-btn layui-btn-primary layui-btn-sm del-params" style="color: red;">\n' +
            '                                                        <i class="layui-icon">&#xe640;</i>\n' +
            '                                                    </button>\n' +
            '                                                </td>\n' +
            '                                            </tr>\n';

        //替换模板
        for(var param in template_params){
            response_template=response_template.replace(new RegExp("{{"+param+"}}","g"),template_params[param]);
        }
        $('table.table-responses tbody').append(response_template);
        form.render();


    },
    // 注释生成
    comment_covert: function () {
        var error_obj=null;
        try {
            $('form.form-comment')
            //#### 获取参数拼接 ####
            //接口名称
            var titleObj=$('form.form-comment').find("input[name=title]");
            var title =titleObj .val();
            //请求方式
            var methodObj=$('form.form-comment').find("select[name=method]");
            var method = methodObj.val();
            //url
            var urlObj=$('form.form-comment').find("input[name=url]");
            var url = $('form.form-comment').find("input[name=url]").val();
            //mime
            var consumes = [];//支持协议
            $('.div-consumes').find('input[name=consumes]:checked').each(function () {
                consumes.push($(this).attr("title"));
            });
            //描述
            var descriptionObj =$('form.form-comment').find("input[name=description]");
            var description = descriptionObj.val();
            //标签
            var tagsObj=$('form.form-comment').find("input[name=tags]");
            var tags = tagsObj.val();
            if(!title){
                error_obj=titleObj;
                throw "接口名称不能为空";

            }
            if(!url){
                error_obj=urlObj;
                throw "url不能为空";
            }

            //参数
            var parameters = [];
            $('table.table-params tbody').find('tr').each(function () {
                var params_name = $(this).find("input[name=name]").val();//参数名
                var params_type = $(this).find("select[name=type]").val();//类型
                var params_in = $(this).find("select[name=in]").val();//位置
                var params_default = $(this).find("input[name=default]").val();//默认值
                var params_description = $(this).find("input[name=description]").val();//描述
                var params_required = $(this).find("select[name=required]").val();//是否必填
                var params_allowEmptyValue = $(this).find("select[name=allowEmptyValue]").val();//空值是否发送
                if(!params_name){
                    error_obj= $(this).find("input[name=name]");
                    throw "参数名称不能为空";
                }
                parameters.push({
                    "name": params_name,
                    "type": params_type,
                    "in": params_in,
                    "default": params_default,
                    "description": params_description,
                    "required": params_required,
                    "allowEmptyValue": params_allowEmptyValue
                });
            });
            //响应数据
            var responses = [];
            $('table.table-responses tbody').find("tr").each(function () {
                var status = $(this).find("input[name=status]").val();
                var produces=$(this).find("select[name=produces]").val();
                var examples=$(this).find("textarea[name=examples]").val();
                var description=$(this).find("input[name=description]").val();

                if(!status){
                    error_obj= $(this).find("input[name=status]");

                    throw "响应状态不能为空";
                }
                //console.log(JSON.parse(examples));return;
                if(!examples){
                    error_obj= $(this).find("textarea[name=examples]");
                    throw "结果json数据不正确";
                }
                responses.push({
                    "status":status,
                    "produces":produces,
                    "examples":examples,
                    "description":description
                });
            });
        }catch (ex){
            if(error_obj&&error_obj.length>0){
                error_obj.focus();
                layer.tips(ex, error_obj, {
                    tips: [4, '#78BA32']
                });

            }else{
                layer.msg(ex,{icon:2});
            }

            return;
        }

        console.log(responses);

        // 发送后台生成注释返回
        parent.ApiHelper.ajax({
            url:parent.post_comment_covert,
            type:"post",
            dataType:"json",
            data:{
                "title":title,
                "method":method,
                "url":url,
                "method":method,
                "consumes":consumes.join(" "),
                "description":description,
                "tags":tags,
                "parameters":parameters,
                "responses":responses
            },
            success:function (jsonData) {
                if(jsonData.status!=0){
                    layer.msg(jsonData.message,{icon:2});
                }else {
                    //语法1
                    $("div.comment-type").find('input[name=comment-type]:eq(0)').attr("value", jsonData.data.result[0]).next().trigger("click");
                    //语法2
                    $("div.comment-type").find('input[name=comment-type]:eq(1)').attr("value", jsonData.data.result[1]);
                }
            }
        })
    },
    //注释逆向
    comment_reverse: function () {

        var self=this;
        //获取注释 发送后台
        var comment= $("textarea[name=comment-result]").val().trim();
        if(!comment){
            layer.msg("注释不能为空",{icon:2});
            return;
        }
        parent.ApiHelper.ajax({
            url:parent.post_comment_covert,
            type:"post",
            dataType:"json",
            data:{
                comment:comment,
                is_reverse:1
            },
            success:function (jsonData) {
                if(jsonData.status!=0){
                    layer.msg(jsonData.message,{icon:2});
                }else{
                    console.log(jsonData);

                    $('.table-params tbody').html('');
                    $('.table-responses tbody').html('');
                    // 解析数据到列表中
                    for(var i in jsonData.data.result){
                        var v=jsonData.data.result[i];
                        $('form.form-comment').find("input[name=title]").val(v.title);
                        $('form.form-comment').find("input[name=url]").val(v.url);
                        $('form.form-comment').find("input[name=description]").val(v.description);
                        $('form.form-comment').find("select[name=method]").find("option[value="+v.method+"]").attr("selected",true);
                        $('form.form-comment').find("input[name=tags]").val(v.tags.join(" "));

                        //参数
                        if(v.parameters){
                            // 添加参数
                            for(var j in v.parameters){
                                self.add_params(v.parameters[j]);
                            }
                        }
                        //响应
                        if(v.responses){
                            // 添加响应
                            for(var j in v.responses){
                                for(var i in v.responses[j]["examples"]){
                                    self.add_response({
                                        status:j,
                                        produces:i,
                                        description:v.responses[j]["description"],
                                        examples:v.responses[j]["examples"][i]
                                    });
                                }

                            }
                        }
                    }
                    form.render();


                }
            }
        })

    },
    json_format:function () {

    }

}
window.comment_help = comment_help.init();