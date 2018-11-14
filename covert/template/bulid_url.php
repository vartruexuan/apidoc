<?php
/**
 * 模块链接生成
 * Created by PhpStorm.
 * User: 小昭昭
 * Date: 2018/7/10
 * Time: 13:24
 */
?>
<html>
<head>
    <meta charset="UTF-8">
   <meta name="viewport"
            content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <link rel="stylesheet" href="<?php echo API_COVERT_JS ?>/plug/bootstrap-3.3.7-dist/css/bootstrap.css">
    <script src="<?php echo API_COVERT_JS ?>/plug/jquery.js"></script>
    <script src="<?php echo API_COVERT_JS ?>/plug/bootstrap-3.3.7-dist/js/bootstrap.js"></script>
    <script src="<?php echo API_COVERT_JS ?>/bulid_url.js"></script>
    <style>
        .urls-list>a,.module-list >a{
            margin-bottom: 4px;
        }
        .urls-list,.module-list{
            height: 260px;
            overflow-y: auto;
        }
    </style>
</head>
<body>
<div class="container-fluid" style="margin: 10px 10px 40px 10px;">
    <div class="row">
        <!-- url 列表 -->
        <div class="col-md-6 col-xs-6 col-sm-6">
            <h2 class="page-header">已有链接
                <span class="label label-danger" style="font-size: 12px"> 错误</span>
                <span class="label label-primary" style="font-size: 12px">成功 </span>
            </h2>
            <div class="list-group urls-list">
                <!-- 遍历模块列表-->
                <?php foreach ($urls as $k=>$u){   ?>
                <a href="#" class="list-group-item" data-url="<?= $k ?>">
                    <span class="btn url-del" style="background: white; color: black" title="删除链接">
                        <span class="glyphicon glyphicon-trash"style="color:red;"></span>
                    </span>
                    <span class="module_names">
                                   <?php
                                         $titles=array_column($u,'title');
                                         $all_module=array_column($modules,'title');
                                        foreach ( $titles as $t){ ?>
                                       <span class="module-item label <?= (in_array($t,$all_module)?'label-primary':'label-danger')?>"><?=$t?></span>
                                   <?php }?>

                    </span>
                </a>
                <?php } ?>
            </div>
        </div>
        <!-- 模块列表 -->
        <div class="col-md-6 col-xs-6 col-sm-6">
            <h2 class="page-header">模块列表</h2>
            <div class="list-group module-list">
                <!-- 遍历模块列表-->
                <?php foreach ($modules as $m){   ?>
                <a href="#" class="list-group-item"><span class="module_name"><?php echo $m['title']?></span></a>
                <?php } ?>
            </div>
        </div>
    </div>

</div>
<!-- 尾部 -->
<nav class="navbar navbar-default navbar-fixed-bottom" style="padding: 6px;">
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-11 col-md-11 col-md-11">
                <div class="input-group ">
                    <span class="input-group-addon" id="sizing-addon1">url:</span>
                    <input type="text" class="form-control" name="input_url" aria-label="Text input with multiple buttons"
                           readonly placeholder="点击链接列表..">
                    <div class="input-group-btn">
                        <button type="button" class="btn btn-default go_url"><span>跳转</span></button>
                        <button class="btn btn-info btn-bulid_url"><span class="glyphicon glyphicon-random"></span>&nbsp;生成链接</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</nav>
</body>
</html>

