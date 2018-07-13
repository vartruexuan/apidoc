<?php
/**
 * Created by PhpStorm.
 * User: 小昭昭
 * Date: 2018/4/25
 * Time: 13:18
 */
return [
    # 主json配置信息
    'server_info' => [

        # 文档的一些信息
        'info' => array(
            'version' => "1.0.0",//全局模块版本
            'description' => '全局模块描述',//全局模块描述
        ),
        # 主机地址(接口访问地址),无特殊需求无需修改
        'host' => $_SERVER['HTTP_HOST'],
        # 父地址，可以是模块名 : /api
        'basePath' => '',
        # API的传输协议。值必须来自列表：“HTTP”、“HTTPS”、“WS”、“WSS”。如果不包括方案，则要使用的默认方案是用于访问规范的方案。
        'schemes' => array(
            'http',
        ),
        # API可以使用的MIME类型列表。这对所有API都是全局的，但可以在特定API调用上重写。值必须按照Mime Types的描述。
        'consumes' => array(
            'application/json',
        ),
        #API可以产生的MIME类型列表。这对所有API都是全局的，但可以在特定API调用上重写。值必须按照Mime Types的描述。
        'produces' => array(
            'application/json',
        ),

        # 标签信息-(针对所有模块)
        'tags' => array(
            #['name'=>'标签名称','description'=>'标签描述'],
        ),
    ],

    #apidoc 公共配置
    'config' => [
        # 进入生成文档页面进行权限验证(不加验证留空即可)
        "covert_password" => "1234567",
        # 文档模块化
        "module" => array(
            [
                #模块名称(不可重复)
                "title" => '后台接口',
                # 版本
                'version' => "1.0.0",
                "description"=>"模块描述",
                #注释文件所在目录(1. path=>"文件地址" 2.path=>"目录地址" 3. path=>["文件地址","目录地址"..])
                "path"=>[
                    # WEB_ROOT 是项目根目录,根据实用情况使用
                    dirname(WEB_ROOT)."/module/wifi",
                    dirname(WEB_ROOT)."/module/live",
                    dirname(WEB_ROOT).'/module/school/v1/admin/controllers/IndexController.php'
                ],
                # 主机地址(接口访问地址)[不配置则是使用主配置的host]
                "host" => "",
                # 标签说明(针对于此模块tags说明)
                "tags" => array(
                    ['name'=>'标签名称','description'=>'标签描述'],
                ),
            ],
            [
                #模块名称(不可重复)
                "title" => '测试8',
                # 版本
                'version' => "1.0.0",
                "description"=>"模块描述",
                #注释文件所在目录(1. path=>"文件地址" 2.path=>"目录地址" 3. path=>["文件地址","目录地址"..])
                "path"=>[
                    # WEB_ROOT 是项目根目录,根据实用情况使用
                    dirname(WEB_ROOT)."/module/live",
                    dirname(WEB_ROOT).'\module\school\v1\admin\controllers\IndexController.php'
                ],
                # 主机地址(接口访问地址)[不配置则是使用主配置的host]
                "host" => "www.baidu.com",
                # 标签说明(针对于此模块tags说明)
                "tags" => array(
                  /*  ['name'=>'标签名称','description'=>'标签描述'],*/
                ),
            ],
            [
                #模块名称(不可重复)
                "title" => '测试9',
                # 版本
                'version' => "1.0.0",
                "description"=>"模块描述",
                #注释文件所在目录(1. path=>"文件地址" 2.path=>"目录地址" 3. path=>["文件地址","目录地址"..])
                "path"=>[
                    # WEB_ROOT 是项目根目录,根据实用情况使用
                    dirname(WEB_ROOT)."/module/live",
                    dirname(WEB_ROOT).'/module/school/v1/admin/controllers/IndexController.php'
                ],
                # 主机地址(接口访问地址)[不配置则是使用主配置的host]
                "host" => "",
                # 标签说明(针对于此模块tags说明)
                "tags" => array(
                    ['name'=>'标签名称','description'=>'标签描述'],
                ),
            ],
            [
                #模块名称(不可重复)
                "title" => '测试456',
                # 版本
                'version' => "1.0.0",
                "description"=>"模块描述",
                #注释文件所在目录(1. path=>"文件地址" 2.path=>"目录地址" 3. path=>["文件地址","目录地址"..])
                "path"=>[
                    # WEB_ROOT 是项目根目录,根据实用情况使用
                    dirname(WEB_ROOT)."/module/live",
                    dirname(WEB_ROOT).'\module\school\v1\admin\controllers\IndexController.php'
                ],

                #递归层级(正数(5):递归最大层级,0:不递归，-1：无限递归[默认] )
                "depath" => -1,
                # 主机地址(接口访问地址)[不配置则是使用主配置的host]
                "host" => "",
                # 标签说明(针对于此模块tags说明)
                "tags" => array(
                    ['name'=>'标签名称','description'=>'标签描述'],
                ),
            ],

        ),
        #公共参数--所有接口
        "public_params" => array(
            # 案例参数
            [
                # 参数名称
                'name' => 'token',
                # 参数所在位置( "query", "header", "path", "formData" , "body")
                'in' => 'header',
                # 默认值
                'default' => '_iZXPgfXGrjHPTjCbxkKPdyIIGyThDjV',
                # 参数描述
                'description' => '访问token(此参数为所有接口的公共参数)',
                # 不需要添加的路由(可写通配符或绝对  /controller/*)
                'not_add_url' => array(
                    "/wifi/v1/frontend/*"
                ),
            ]
        ),
        #公共提示消息--当showMessage时显示的公共消息
        "public_message" => array(
            "啦啦啦"
        ),
        # 定界符
        "delimiter" => "SUNLANDS"
    ],
];