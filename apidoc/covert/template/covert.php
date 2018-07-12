<?php
/**
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
    <link rel="stylesheet" href="<?php echo API_COVERT_JS ?>/plug/bootstrap-3.3.7-dist/css/bootstrap.css">
    <link rel="stylesheet" href="<?php echo API_COVERT_CSS ?>/main.css">
</head>
<body>
<!-- 配置数据 -->
<div>
    <input type="hidden" name="api_root_name" value="<?php echo API_ROOT_NAME ?>">
    <input type="hidden" name="page_covert" value="<?php echo API_COVERT ?>">
    <input type="hidden" name="page_dist" value="<?php echo API_DIST ?>">
    <input type="hidden" name="page_covert_img" value="<?php echo API_COVERT_IMG ?>">
</div>

<!-- 功能列表 -->
<div class="div-box" >
    <div class="bs-callout bs-callout-danger footer" >
        <!-- 工具信息 -->
        版本: <a><?php echo $info['version']?></a>
    </div>
    <div class="bs-callout bs-callout-warning header">
        <div>
            <span class="title">文档生成</span>
        </div>

        <hr/>
        <!--  操作列表  -->
        <div>
            <div class="btn-group ">
                <button class="btn btn-sm btn-primary" id="doc_refresh"><span class="glyphicon glyphicon-refresh"> 生成文档</span></button>
                <button class="btn btn-sm btn-success" id="modules_url"><span class="glyphicon glyphicon-random"> 指定模块生成链接</span></button>
                <button class="btn btn-sm btn-danger" id="test"><span class="glyphicon "> 待定</span></button>
            </div>
        </div>
        <hr/>
        <!--  显示状态消息 -->
        <div class="message"></div>
    </div>
    <div class="bs-callout bs-callout-info container module">
        <div>
            <span class="title">模块列表</span>&emsp;
            <span style="background: red;width: 10px;height: 10px;display: inline-block"> </span> 错误
            <span style="background: green;width: 10px;height: 10px;display: inline-block"> </span> 成功
            &emsp;<span class="covert-status"></span>
        </div>
        <hr/>
        <div class="modules_status">

        </div>
        <div class="tab-container" style="background:no-repeat url(<?= API_COVERT_IMG?>/xhr25_1366.png);background-size:100% 100%">
            <!-- tabs 标题区-->
            <ul class="nav nav-tabs" role="tablist">
               <!-- <li role="presentation" class="active"><a href="#home" role="tab" data-toggle="tab">Home</a></li>-->
            </ul>
            <!-- tabs 面板区 -->
            <div class="tab-content">
              <!--   <div role="tabpanel" class="tab-pane active" id="home">1111</div>-->
            </div>
        </div>


    </div>
    <script src="<?php echo API_COVERT_JS ?>/plug/jquery.js"></script>
    <script src="<?php echo API_COVERT_JS ?>/plug/layer-v3.1.1/layer/layer.js"></script>
    <script src="<?php echo API_COVERT_JS ?>/plug/bootstrap-3.3.7-dist/js/bootstrap.js"></script>
    <!-- 生成文档主要逻辑 -->
    <script src="<?php echo API_COVERT_JS ?>/init.js"></script>
    <script src="<?php echo API_COVERT_JS ?>/ApiHelper.js"></script>
    <script src="<?php echo API_COVERT_JS ?>/main.js"></script>
</body>
</html>