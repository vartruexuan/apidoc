> ## 概要 ##
 1. 这是一个php注释生成接口文档调试工具
 2. 支持模块化
 3. 生成文档支持权限验证
 4. 可指定模块生成链接


> ## 安装 ##
* **github克隆到项目根目录下**
```git
git clone https://github.com/XiaoGuoZhaoXuan/apidoc.git
```
**或者composer安装**
```composer
composer require guozhaoxuan/php-apidoc
```
> ## 注释规范 ##
```php
 /**SUNLANDS
  * @url    url地址
  * @method 请求方式
  * @tags   标签1 标签2
  * @description 接口具体描述
  * @summary     接口总结概括
  * @param 参数类型 参数名 默认值(无写/) 所在位置 参数描述 是否必填(true/false) 值为空时是否发送(true/false)
  * @examples{
    "application/json":{

      此处放接口返回的数据案例
    }
  }
  *
  */
```
案例
```php
 /**SUNLANDS
  * @url    url地址
  * @method 请求方式
  * @tags   标签1 标签2
  * @description 接口具体描述
  * @summary     接口总结概括
  * @param 参数类型 参数名 默认值(无写/) 所在位置 参数描述 是否必填(true/false) 值为空时是否发送(true/false)
  * @examples{
    "application/json":{

      此处放接口返回的数据案例
    }
  }
  *
  */
```
> ## 使用 ##
1. 修改 apidoc/covert/config/config.php 可看文件有详细注释
  * 增加一个模块(这里以yii框架为案例)
```php
     #apidoc 公共配置
    'config' => [
        # 进入生成文档页面进行权限验证(不加验证留空即可)
        "covert_password" => "1234567",
        # 模块列表
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
                    dirname(WEB_ROOT)."/module/m1",
                    dirname(WEB_ROOT)."/module/m2",
                    dirname(WEB_ROOT).'/module/v1/controllers/IndexController.php'
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
                "title" => '前台接口',
                # 版本
                'version' => "1.0.0",
                "description"=>"模块描述",
                #注释文件所在目录(1. path=>"文件地址" 2.path=>"目录地址" 3. path=>["文件地址","目录地址"..])
                "path"=>dirname(WEB_ROOT)."/module/frontend",
                # 主机地址(接口访问地址)[不配置则是使用主配置的host]
                "host" => "www.baidu.com",
                # 标签说明(针对于此模块tags说明)
                "tags" => array(
                  /*  ['name'=>'标签名称','description'=>'标签描述'],*/
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
                    "/backend/v1/frontend/*"
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
]
```
  * 全局配置(无特殊需求无需修改)
  ```php
       # 主json配置信息
    'server_info' => [
        # 文档的一些信息
        'info' => array(
            'version' => "1.0.0",//版本信息
            'title' => '全局模块标题',//模块中有则覆盖该字段
            'description' => '全局模块描述',//模块中有则覆盖该字段
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

        # 标签信息-(全局模块的标签描述)
        'tags' => array(
            #['name'=>'分校小程序-首页','description'=>'(顶部banner,附近校区,推荐课程)'],
            #['name'=>'分校后台-素材管理','description'=>'(素材管理,)'],
        ),
    ],
  ```
   2. 浏览器中直接访问 ## 项目域名.com/apidoc/covert
   ![生成页面](https://github.com/XiaoGuoZhaoXuan/apidoc/blob/master/covert/img/domo/covert.jpg "生成页面") 
   3. 可指定模块生成链接
   ![指定模块生成链接](https://github.com/XiaoGuoZhaoXuan/apidoc/blob/master/covert/img/domo/module_url.jpg "指定模块生成链接") 
   
   
