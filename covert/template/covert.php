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
<body class="" id="mydiv" >
<!-- 配置数据 -->
<div>
    <input type="hidden" name="api_root_name" value="<?php echo API_ROOT_NAME ?>">
    <input type="hidden" name="page_covert" value="<?php echo API_COVERT ?>">
    <input type="hidden" name="page_dist" value="<?php echo API_DIST ?>">
    <input type="hidden" name="page_covert_img" value="<?php echo API_COVERT_IMG ?>">
</div>

<div class="div-box layui-fluid " style="padding: 20px;margin: auto;width: 80%" >
    <blockquote class="layui-elem-quote layui-anim layui-anim-up">
        <a class="logo" href="<?php echo API_COVERT ?>">
            <img width="30" src="<?php echo API_COVERT_IMG ?>/favicon-32x32.png" alt="apidoc">
        </a>
        <!-- 工具信息 -->
        <span class="apidoc-info"><label class="layui-label">版本:</label> <a><?php echo $info['version']?></a></span>
        <!-- github 信息-->
        <div style="margin-top: 10px;">
            <iframe style="border: none" src="//ghbtns.com/github-btn.html?user=php-xuan&amp;repo=apidoc&amp;type=watch&amp;count=true" width="100" height="20"></iframe>
            <iframe style="border: none" src="//ghbtns.com/github-btn.html?user=php-xuan&amp;repo=apidoc&amp;type=fork&amp;count=true" width="100" height="20"></iframe>
        </div>
    </blockquote>
    <!-- 功能列表 -->
    <blockquote class="layui-elem-quote layui-anim layui-anim-scaleSpring">
        <div>
            <span class="title"><i class="layui-icon">&#xe653;</i> 功能列表</span>
        </div>
        <hr/>
        <!--  操作列表  -->
        <div>
            <fieldset class="layui-elem-field site-demo-button">
                <div class="layui-btn-group layui-btn-container gongneng">
                    <button class="layui-btn layui-btn-normal layui-btn-sm" id="doc_refresh"><i class="layui-icon ">&#xe9aa;</i> 生成文档</button>
                    <button class="layui-btn layui-btn-sm btn-setConfig" ><i class="layui-icon">&#xe614;</i> 配置</button>
                    <button class="layui-btn layui-btn-sm" id="modules_url"><i class="layui-icon">&#xe64c;</i> 指定模块生成链接</button>
                    <button class="layui-btn layui-btn-sm" id="comment"><i class="layui-icon">&#xe64e;</i> 注释协助</button>
                    <button class="layui-btn layui-btn-sm" id="update_pwd"><i class="layui-icon">&#xe672;</i> 修改密码</button>
                    <button class="layui-btn layui-btn-sm" id="help"><span class="glyphicon ">帮助</span></button>
                    <button class="layui-btn layui-btn-sm" id="version_history"><span class="glyphicon ">版本历史</span></button>
                </div>
            </fieldset>
        </div>
        <hr/>
        <!--  显示状态消息 -->
        <div class="message"></div>
    </blockquote>
    <blockquote class="layui-elem-quote layui-anim layui-anim-up" style="min-height: 400px;">
        <div>
            <span class="title"><i class="layui-icon">&#xe663;</i> 模块列表</span>&emsp;
            <span class="layui-badge-dot layui-bg-red"></span> 错误
            <span class="layui-badge-dot layui-bg-green"></span> 成功
            &emsp;<span class="covert-status"></span>
        </div>
        <hr/>
        <!-- 模块状态信息 -->
        <div class="modules_status">

        </div>
        <div class="layui-tab layui-tab-brief covert_module" lay-filter="docDemoTabBrief">
            <!-- tabs 标题区-->
            <ul class="layui-tab-title ">
               <!-- <li role="presentation" class="active"><a href="#home" role="tab" data-toggle="tab">Home</a></li>-->
            </ul>
            <!-- tabs 面板区 -->
            <div class="layui-tab-content" style="overflow-y: auto;max-height: 360px; ">
              <!--   <div role="tabpanel" class="tab-pane active" id="home">1111</div>-->
            </div>
        </div>

    </blockquote>
    <script type="text/javascript">
        window.onload = function() {
            //配置
            var config = {
                vx: 4,	//小球x轴速度,正为右，负为左
                vy: 4,	//小球y轴速度
                height: 2,	//小球高宽，其实为正方形，所以不宜太大
                width: 2,
                count: 200,		//点个数
                color: "121, 162, 185", 	//点颜色
                stroke: "100,149,237", 		//线条颜色
                dist: 6000, 	//点吸附距离
                e_dist: 20000, 	//鼠标吸附加速距离
                max_conn: 10 	//点到点最大连接数
            }

            //调用
            CanvasParticle(config);
        }
    </script>
    <script type="text/javascript" src="<?php echo API_COVERT_JS ?>/canvas-particle.js"></script>
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