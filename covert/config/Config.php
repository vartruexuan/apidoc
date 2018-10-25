<?php
return array(
    'server_info' =>
        array(
            'info' =>
                array(
                    'version' => '1.0.0',
                    'description' => '全局模块描述',
                ),
            'host' => 'www.apidoc.com',
            'basePath' => '',
            'schemes' =>
                array(
                    0 => 'http',
                ),
            'consumes' =>
                array(
                    0 => 'application/json',
                ),
            'produces' =>
                array(
                    0 => 'application/json',
                ),
            'tags' =>
                array(),
        ),
    'config' =>
        array(
            'covert_password' => '1234567',
            'module' =>
                array(
                    0 =>
                        array(
                            'title' => '后台接口',
                            'version' => '1.0.0',
                            'description' => 'dsvsdvsdv',
                            'path' =>
                                array(
                                    0 => 'D:\\www\\test\\cronus\\manager/module/wifi',
                                    1 => 'D:\\www\\test\\cronus\\manager/module/live',
                                    2 => 'D:\\www\\test\\cronus\\manager/module/school/v1/admin/controllers/IndexController.php',
                                ),
                            'host' => '',
                            'tags' =>
                                array(
                                    0 =>
                                        array(
                                            'name' => '标签名称',
                                            'description' => '标签描述',
                                        ),
                                ),
                        ),
                    1 =>
                        array(
                            'title' => '测试8',
                            'version' => '1.0.0',
                            'description' => '模块描述',
                            'path' =>
                                array(
                                    0 => 'D:\\www\\test\\cronus\\manager/module/live',
                                    1 => 'D:\\www\\test\\cronus\\manager\\module\\school\\v1\\admin\\controllers\\IndexController.php',
                                ),
                            'host' => 'www.baidu.com',
                            'tags' =>
                                array(),
                        ),
                    2 =>
                        array(
                            'title' => '测试9',
                            'version' => '1.0.0',
                            'description' => '模块描述',
                            'path' =>
                                array(
                                    0 => 'D:\\www\\test\\cronus\\manager/module/live',
                                    1 => 'D:\\www\\test\\cronus\\manager/module/school/v1/admin/controllers/IndexController.php',
                                ),
                            'host' => '',
                            'tags' =>
                                array(
                                    0 =>
                                        array(
                                            'name' => '标签名称',
                                            'description' => '标签描述',
                                        ),
                                ),
                        ),
                    3 =>
                        array(
                            'title' => '测试456',
                            'version' => '1.0.0',
                            'description' => '模块描述',
                            'path' =>
                                array(
                                    0 => 'D:\\www\\test\\cronus\\manager/module/live',
                                    1 => 'D:\\www\\test\\cronus\\manager\\module\\school\\v1\\admin\\controllers\\IndexController.php',
                                ),
                            'depath' => -1,
                            'host' => '',
                            'tags' =>
                                array(
                                    0 =>
                                        array(
                                            'name' => '标签名称',
                                            'description' => '标签描述',
                                        ),
                                ),
                        ),
                ),
            'public_params' =>
                array(
                    0 =>
                        array(
                            'name' => 'token',
                            'in' => 'header',
                            'default' => '_iZXPgfXGrjHPTjCbxkKPdyIIGyThDjV',
                            'description' => '访问token(此参数为所有接口的公共参数)',
                            'not_add_url' =>
                                array(
                                    0 => '/wifi/v1/frontend/*',
                                ),
                        ),
                ),
            'public_message' =>
                array(
                    0 => '啦啦啦',
                ),
            'delimiter' => 'SUNLANDS',
            'test' => 111,
        ),
);
