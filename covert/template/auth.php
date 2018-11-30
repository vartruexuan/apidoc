<?php
/**
 * 权限验证页面
 * Created by PhpStorm.
 * User: 小昭昭
 * Date: 2018/7/9
 * Time: 11:21
 */
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>权限验证</title>
    <link rel="icon" type="image/png" href="./favicon-32x32.png" sizes="32x32" />
    <link rel="icon" type="image/png" href="./favicon-16x16.png" sizes="16x16" />
    <link rel="stylesheet" href="<?php echo API_COVERT_JS ?>/plug/bootstrap-3.3.7-dist/css/bootstrap.css">

    <style>
        .main{
          /*  text-align: center; *//*让div内部文字居中*/
           /* background-color: #fff;*/
         /*   border-radius: 20px;*/
            width: 400px;
            height: 350px;
            margin: auto;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
        }
    </style>
</head>
<body style="background: #2d4a69;">
<div>
    <input type="hidden" name="api_root_name" value="<?php echo API_ROOT_NAME ?>">
    <input type="hidden" name="page_covert" value="<?php echo API_COVERT ?>">
    <input type="hidden" name="page_dist" value="<?php echo API_DIST ?>">
    <input type="hidden" name="page_covert_img" value="<?php echo API_COVERT_IMG ?>">
</div>
<div class="contain">
    <div class="row main">
        <div class="col-md-12">
            <div class="bs-example" data-example-id="contextual-panels">
                <div class="panel panel-primary">
                    <div class="panel-heading">
                        <h3 class="panel-title">权限验证</h3>
                    </div>
                    <div class="panel-body" style="min-height: 200px;">
                        <span>如果您是第一次使用,密码：123</span>
                        <div class="input-group">
                            <input type="password" name="pwd" class="form-control" placeholder="请输入密码..">
                            <span class="input-group-btn">
                            <button class="btn btn-default btn-auth" type="button">Go!</button>
                        </div>
                        <br>
                        <span  id="msg"></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<script src="<?php echo API_COVERT_JS ?>/plug/jquery.js"></script>
<script src="<?php echo API_COVERT_JS ?>/plug/bootstrap-3.3.7-dist/js/bootstrap.js"></script>
<script src="<?php echo API_COVERT_JS ?>/plug/layer-v3.1.1/layer/layer.js"></script>
<script src="<?php echo API_COVERT_JS ?>/init.js"></script>
<script src="<?php echo API_COVERT_JS ?>/auth.js"></script>
</body>
</html>

