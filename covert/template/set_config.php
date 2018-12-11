<?php
/**
 * 配置设置页面
 * Created by PhpStorm.
 * User: 小昭昭
 * Date: 2018/8/9
 * Time: 15:40
 */
?>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <link rel="stylesheet" href="<?php echo API_COVERT_JS ?>/plug/layui-v2.3.0/layui/css/layui.css">
    <style>
        div {
            /* border:1px solid red;*/
        }
    </style>
</head>

<body>
<div class="layui-container">
    <div class="layui-tab layui-tab-brief tab-config" lay-filter="tab-config">
        <ul class="layui-tab-title">
            <li class="layui-this">主配置</li>
            <li>模块配置</li>
        </ul>
        <div class="layui-tab-content">
            <!-- 主配置-->
            <div class="layui-tab-item layui-show">
                <fieldset class="layui-elem-field server_info">
                    <legend>主配置</legend>
                    <div class="layui-field-box">
                        <form class="layui-form">
                            <div class="layui-form-item">
                                <label class="layui-form-label">主机域名:</label>
                                <div class="layui-input-block">
                                    <div class="layui-input-inline">
                                        <select name="host_type" lay-verify="host_type">
                                            <option value="1" selected >部署环境域名</option>
                                            <option value="2">自定义</option>
                                        </select>
                                    </div>
                                    <div class="layui-input-inline">
                                        <input type="text" name="custom_host" placeholder="自定义域名:例如:www.baidu.com"
                                               autocomplete="off"
                                               class="layui-input">
                                        <input type="hidden" name="host" value="">
                                    </div>

                                </div>
                            </div>
                            <div class="layui-form-item">
                                <!-- # API的传输协议。值必须来自列表：“HTTP”、“HTTPS”、“WS”、“WSS”。如果不包括方案，则要使用的默认方案是用于访问规范的方案。  -->
                                <label class="layui-form-label">接口协议:</label>
                                <div class="layui-input-block">
                                    <input type="checkbox" name="schemes" title="HTTP">
                                    <input type="checkbox" name="schemes" title="HTTPS">
                                    <input type="checkbox" name="schemes" title="WS">
                                    <input type="checkbox" name="schemes" title="WSS">
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <label class="layui-form-label">注释定界符:</label>
                                <div class="layui-input-block">
                                    <input type="text" name="delimiter" placeholder="有此定界符的注释才会被解析" autocomplete="off"
                                           class="layui-input">
                                </div>
                            </div>
                        </form>
                    </div>
                </fieldset>
            </div>
            <!-- 模块配置 -->
            <div class="layui-tab-item">
                <fieldset class="layui-elem-field">
                    <legend>
                        模块配置 <i class="layui-icon btn-add-module" style="color:#0f7faa;cursor: pointer;font-size: 24px;"
                                title="添加模块">&#xe61f;</i>
                    </legend>
                    <div class="layui-field-box">
                        <form class="layui-form" id="config_form" action="">
                            <div class="layui-tab layui-tab-brief tab-modules" lay-filter="tab-modules"
                                 style="width:900px;">
                                <ul class="layui-tab-title" style="padding-right: 30px;height: auto!important;white-space: normal!important;">
                                    <!-- 模块标题-->
                                   <!--<li>模块样例</li>-->
                                </ul>
                                <div class="layui-tab-content"
                                     style="background: #f9feff;overflow-y: auto;height: 60%;">
                                    <!-- 模块配置 -->
                             <!--       <div class="layui-tab-item">
                                        <blockquote class="">
                                            <div class="layui-row layui-col-space10">
                                                <div class="layui-col-md3">
                                                    <fieldset class="layui-elem-field layui-field-title">
                                                        <legend>模块名</legend>
                                                        <div class="layui-field-box">
                                                            <input type="text" placeholder="模块名称"
                                                                   autocomplete="off" class="layui-input" value="物料平台">
                                                        </div>
                                                    </fieldset>
                                                </div>
                                                <div class="layui-col-md3">
                                                    <fieldset class="layui-elem-field layui-field-title">
                                                        <legend>版本</legend>
                                                        <div class="layui-field-box">
                                                            <input type="text"  placeholder="版本号：v1.0"
                                                                   autocomplete="off" class="layui-input" value="v1.0">
                                                        </div>
                                                    </fieldset>
                                                </div>
                                                <div class="layui-col-md6">
                                                    <fieldset class="layui-elem-field layui-field-title">
                                                        <legend>描述</legend>
                                                        <div class="layui-field-box">
                                                            <input type="text" name="" placeholder="描述下这个模块"
                                                                   autocomplete="off" class="layui-input" value="这个是物料平台的项目接口文档">
                                                        </div>
                                                    </fieldset>
                                                </div>
                                            </div>
                                            <div class="layui-form-item" style="position: relative;">
                                                <fieldset class="layui-elem-field">
                                                    <legend>路径<i class="layui-icon btn-add-path"
                                                                 style="color:#0f7faa;cursor: pointer;font-size: 24px;"
                                                                 title="添加路径">&#xe61f;</i></legend>
                                                    <div class="layui-field-box module-path">

                                                        <div class="layui-row">

                                                            <div class="layui-col-md2">
                                                                <select name="relative"  >
                                                                    <option value="{{web_root_top}}">根目录上一级</option>
                                                                    <option value="{{web_root_top2}}">根目录上二级</option>
                                                                    <option value="{{web_root}}">根目录</option>
                                                                    <option value="">绝对地址</option>
                                                                </select>
                                                            </div>
                                                            <div class="layui-col-md8">
                                                                <input type="text" name="" placeholder="目录/文件路径" autocomplete="off" class="layui-input" value="d://www/wuliao/controllers">
                                                            </div>
                                                            <div class="layui-col-md1">
                                                                <button class="layui-btn layui-btn-fluid layui-btn-primary" type="button"><i class="layui-icon" title="选择路径">&#xe621;</i></button>
                                                            </div>
                                                            <div class="layui-col-md1">
                                                                <button class="layui-btn layui-btn-fluid layui-btn-primary btn-del-path" type="button"><i class="layui-icon " style="color:red" title="删除">&#xe640;</i></button>
                                                            </div>
                                                        </div>

                                                        <div class="layui-row">
                                                            <div class="layui-col-md2">
                                                                <select name="relative" >
                                                                    <option value="{{web_root_top}}">根目录上一级</option>
                                                                    <option value="{{web_root_top2}}">根目录上二级</option>
                                                                    <option value="{{web_root}}">根目录</option>
                                                                    <option value="">绝对地址</option>
                                                                </select>
                                                            </div>
                                                            <div class="layui-col-md8">
                                                                <input type="text" name="" placeholder="目录/文件路径" autocomplete="off" class="layui-input" value="d://www/wuliao/controllers/CommentController.php">
                                                            </div>
                                                            <div class="layui-col-md1">
                                                                <button class="layui-btn layui-btn-fluid layui-btn-primary" type="button"><i class="layui-icon" title="选择路径">&#xe621;</i></button>
                                                            </div>
                                                            <div class="layui-col-md1">
                                                                <button class="layui-btn layui-btn-fluid layui-btn-primary btn-del-path" type="button"><i class="layui-icon " style="color:red" title="删除">&#xe640;</i></button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </fieldset>
                                            </div>
                                            <div class="layui-form-item">
                                                <fieldset class="layui-elem-field">
                                                    <legend>标签<i class="layui-icon btn-add-label"
                                                                 style="color:#0f7faa;cursor: pointer;font-size: 24px;"
                                                                 title="添加标签说明">&#xe61f;</i></legend>
                                                    <div class="layui-field-box module-label">
                                                        <div class="layui-row ">
                                                            <div class="layui-col-md3">
                                                                <input type="text" name="" placeholder="标签名" autocomplete="off" class="layui-input" value="评价-模板">
                                                            </div>
                                                            <div class="layui-col-md8">
                                                                <input type="text" name="" placeholder="标签描述" autocomplete="off" class="layui-input" value="评价模板的增删改查">
                                                            </div>
                                                            <div class="layui-col-md1">
                                                                <button class="layui-btn layui-btn-fluid layui-btn-primary btn-del-label " type="button">
                                                                    <i class="layui-icon" style="color:red" title="删除">&#xe640;</i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </fieldset>
                                            </div>
                                        </blockquote>
                                    </div>-->
                                </div>
                            </div>
                        </form>
                    </div>
                </fieldset>
            </div>
        </div>
    </div>
</div>
<script src="<?php echo API_COVERT_JS ?>/plug/jquery.js"></script>
<script src="<?php echo API_COVERT_JS ?>/plug/layui-v2.3.0/layui/layui.js"></script>
<script src="<?php echo API_COVERT_JS ?>/set_config.js"></script>
</body>
</html>


