<?php
/**
 * Created by PhpStorm.
 * User: 小昭昭
 * Date: 2018/11/27
 * Time: 10:43
 */
?>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>历史版本</title>
    <link rel="stylesheet" href="<?php echo API_COVERT_JS ?>/plug/layui-v2.3.0/layui/css/layui.css">
</head>
<body>
    <div class="layui-container" style="padding: 20px;">
        <ul class="layui-timeline">
            <li class="layui-timeline-item">
                <i class="layui-icon layui-timeline-axis">&#xe63f;</i>
                <div class="layui-timeline-content layui-text">
                    <h3 class="layui-timeline-title">v3.0</h3>
                    <p>辅助功能</p>
                    <ul>
                        <li>增加注释协助生成</li>
                        <li>增加注释逆向</li>
                        <li>增加页面配置模块</li>
                        <li>修改细节bug</li>
                        <li>页面展示小修改</li>
                        <li>增加语法response(支持多种状态数据)</li>
                        <li>去除语法examples</li>
                    </ul>
                </div>
            </li>
            <li class="layui-timeline-item">
                <i class="layui-icon layui-timeline-axis">&#xe63f;</i>
                <div class="layui-timeline-content layui-text">
                    <h3 class="layui-timeline-title">v2.0</h3>
                    <p>文档模块化</p>
                    <ul>
                        <li>修改可分模块生成注释</li>
                        <li>增加指定模块生成url访问</li>
                        <li>增加模块生成url访问</li>
                        <li>增加权限验证</li>
                    </ul>
                </div>
            </li>
            <li class="layui-timeline-item">
                <i class="layui-icon layui-timeline-axis">&#xe63f;</i>
                <div class="layui-timeline-content layui-text">
                    <h3 class="layui-timeline-title">v1.0</h3>
                    <p>
                        普通注释生成文档
                    </p>
                </div>
            </li>
            <li class="layui-timeline-item">
                <i class="layui-icon layui-timeline-axis">&#xe63f;</i>
                <div class="layui-timeline-content layui-text">
                    <div class="layui-timeline-title">过去</div>
                </div>
            </li>
        </ul>
    </div>
</body>
</html>
