> # 概要 #
 1. 这是一个php注释生成接口文档调试工具
 2. 支持模块化
 3. 生成文档支持权限验证
 4. 可指定模块生成链接


> ## 安装 ##
* **先把代码克隆到项目根目录下**
```git
git clone https://github.com/XiaoGuoZhaoXuan/apidoc.git
```
或者composer安装
```composer
composer require guozhaoxuan/php-apidoc
```
> ## 使用 ##
1. 修改 apidoc/covert/config/config.php 可看文件有详细注释
  * 增加一个模块(这里以yii框架为案例)
```php
 'config' => [
        # 模块列表,可多个
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
                    dirname(WEB_ROOT)."/module/livebk",
                    dirname(WEB_ROOT)."/module/live",
                    dirname(WEB_ROOT).'/module/school/v1/admin/controllers/IndexController.php'
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
            ]
```
  * 修改host(无特殊需求无需修改)
  ```php
   # 主json配置信息
    'server_info' => [
      'swagger' => '2.0',
        # 文档的一些信息
        'info' => array(
            'version' => "1.0.0",//版本信息
            'title' => 'cronus系统接口文档',//文档名称()
            'description' => '访问每个接口都必须在请求头加入该头部： token:访问token',
            'contact' => array('name' => 'aaa'),
            'license' => array('name' => 'MIT'),
        ),
        # 主机地址(接口访问地址)
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
            #['name'=>'分校小程序-首页','description'=>'(顶部banner,附近校区,推荐课程)'],
            #['name'=>'分校后台-素材管理','description'=>'(素材管理,)'],
        ),
    ],
  ```
   2. 浏览器中直接访问 http://项目域名.com/apidoc/covert
   
