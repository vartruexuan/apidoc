<?php
/**
 * 文档生成页面
 * Created by PhpStorm.
 * User: 小昭昭
 * Date: 2018/7/7
 * Time: 14:46
 */
?>
<html>
<head>
    <meta charset="utf-8">
    <title>apidoc文档转化</title>
    <link rel="icon" type="image/png" href="./favicon-32x32.png" sizes="32x32" />
    <link rel="icon" type="image/png" href="./favicon-16x16.png" sizes="16x16" />
    <!-- 主样式 -->
    <link rel="stylesheet" href="<?php echo API_COVERT_CSS ?>/plug/doc.css">
    <link rel="stylesheet" href="<?php echo API_COVERT_JS ?>/plug/layui-v2.3.0/layui/css/layui.css">
    <style>

        body{
          background:url(<?php echo API_COVERT_IMG ?>/bodybg.jpg);
        }
        .title{font-size: 18px;}
    </style>
</head>
<body class="">
<!-- 配置数据 -->
<div>
    <input type="hidden" name="api_root_name" value="<?php echo API_ROOT_NAME ?>">
    <input type="hidden" name="page_covert" value="<?php echo API_COVERT ?>">
    <input type="hidden" name="page_dist" value="<?php echo API_DIST ?>">
    <input type="hidden" name="page_covert_img" value="<?php echo API_COVERT_IMG ?>">
</div>
<!-- 功能列表 -->
<div class="div-box layui-fluid" style="padding: 20px;margin: auto;width: 80%" >
    <blockquote class="layui-elem-quote ">
        <a class="logo" href="/">
            <img width="30" src="<?php echo API_COVERT_IMG ?>/favicon-32x32.png" alt="apidoc">
        </a>
        <!-- 工具信息 -->
        <span class="apidoc-info"><label class="layui-label">版本:</label> <a><?php echo $info['version']?></a></span>
    </blockquote>
    <blockquote class="layui-elem-quote">
        <div>
            <span class="title">功能列表</span>
        </div>

        <hr/>
        <!--  操作列表  -->
        <div>
            <fieldset class="layui-elem-field site-demo-button">
                <div class="layui-btn-group">
                    <button class="layui-btn layui-btn-sm" id="doc_refresh"><i class="layui-icon">&#xe9aa;</i> 生成文档</button>
                    <button class="layui-btn layui-btn-sm btn-setConfig" ><i class="layui-icon">&#xe614;</i> 配置</button>
                    <button class="layui-btn layui-btn-sm" id="modules_url"><i class="layui-icon">&#xe64c;</i> 指定模块生成链接</button>
                    <button class="layui-btn layui-btn-sm" id="test"><span class="glyphicon "> 待定</span></button>
                </div>
            </fieldset>
        </div>
        <hr/>
        <!--  显示状态消息 -->
        <div class="message"></div>
    </blockquote>
    <blockquote class="layui-elem-quote" style="min-height: 400px;">
        <div>
            <span class="title">模块列表</span>&emsp;
            <span style="background: red;width: 10px;height: 10px;display: inline-block"> </span> 错误
            <span style="background: green;width: 10px;height: 10px;display: inline-block"> </span> 成功
            &emsp;<span class="covert-status"></span>
        </div>
        <hr/>
        <div class="modules_status">

        </div>
        <div class="layui-tab layui-tab-brief covert_module" lay-filter="docDemoTabBrief" lay-allowClose="true">
            <!-- tabs 标题区-->
            <ul class="layui-tab-title ">
               <!-- <li role="presentation" class="active"><a href="#home" role="tab" data-toggle="tab">Home</a></li>-->
            </ul>
            <!-- tabs 面板区 -->
            <div class="layui-tab-content" style="overflow-y: auto;max-height: 360px;">
              <!--   <div role="tabpanel" class="tab-pane active" id="home">1111</div>-->
            </div>
        </div>

    </blockquote>

    <!-- js 文件-->
    <script src="<?php echo API_COVERT_JS ?>/plug/jquery.js"></script>
    <script src="<?php echo API_COVERT_JS ?>/plug/layui-v2.3.0/layui/layui.js"></script>
    <!-- 生成文档主要逻辑 -->
    <script src="<?php echo API_COVERT_JS ?>/init.js"></script>
    <script src="<?php echo API_COVERT_JS ?>/ApiHelper.js"></script>
    <script src="<?php echo API_COVERT_JS ?>/main.js"></script>
</div>
</body>
</html>