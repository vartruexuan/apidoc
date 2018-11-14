<?php
/**
 * Created by PhpStorm.
 * User: 小昭昭
 * Date: 2018/4/24
 * Time: 9:38
 */
require __DIR__ . '/ErrorCode.php';
require __DIR__ . '/CommentParser.php';
require __DIR__ . '/ApiDocumentException.php';
require __DIR__ . '/Session.php';

class ApiDocument
{
    private $secret = "+++++****++++";
    /**
     * 解析注释对象
     * @var CommentParser
     */
    private $doc_parser;
    /**
     *  一个方法多种请求的分隔符
     * @var string
     */
    private $explode_str = '@------------';
    /**
     * 定界标识
     * @var string
     */
    private $delimiter = "SUNLANDS";
    /**
     * 版本
     * @var string
     */
    private $version = "php-apidoc 1.0";
    /**
     * 公共配置
     * @var array
     */
    private $config = array(
        #公共参数--所有接口
        "public_params" => array(),
        #公共提示消息--当showMessage时显示的消息
        "public_message" => array(),
        # 文档模块化[title:文档标题,"path"=>"需要生成文档的注释文件所在目录"]
        "module" => array(// ["title" => '分校小程序', "path" => "D:\www\shangdejigou\wifi\cronus"]
        ),
    );
    /** 占位符
     * @var array
     */
    public $path_placeholder=array(
        # 路径地址占位符
        "path"=>[
            "{{web_root}}"=>"",//根目录
            "{{web_root_top}}"=>"",//根目录上一级别
            "{{web_root_top2}}"=>"",//根目录上二级
        ],
    );
    /** 模块生成后状态消息队列
     * @var array
     */
    public $moduleMessage = [];

    /**
     * swagger.json 储存对象
     * @var array
     */
    private $json = array(
        'swagger' => '2.0',
        //文档的一些信息
        'info' => array(
            'version' => "1.0.0",
            'title' => '接口文档',
            'description' => '文档描述',
            'contact' => array('name' => 'xxx'),
            'license' => array('name' => 'MIT'),
        ),
        //主机地址
        'host' => 'http://localhost',
        //父地址，可以是模块名 : /api
        'basePath' => '',
        //API的传输协议。值必须来自列表：“HTTP”、“HTTPS”、“WS”、“WSS”。如果不包括方案，则要使用的默认方案是用于访问规范的方案。
        'schemes' => array(
            'http',
        ),
        //API可以使用的MIME类型列表。这对所有API都是全局的，但可以在特定API调用上重写。值必须按照Mime Types的描述。
        'consumes' => array(
            'application/json',
        ),
        //API可以产生的MIME类型列表。这对所有API都是全局的，但可以在特定API调用上重写。值必须按照Mime Types的描述。
        'produces' => array(
            'application/json',
        ),
        'tags' => array(),
        //API的可用路径和操作,接口注释生成都在此处。[核心]
        'paths' => array(),
        'definitions' => array()
    );
    private static $obj = null;

    #################### 初始化操作 ##########################

    /**
     * 初始化数据 (常量)
     */
    private function init()
    {
        ### 定义常量 ### (根据实际情况使用该常量)
        $dirs = explode(DIRECTORY_SEPARATOR, dirname(__DIR__));
        define('WEB_ROOT', dirname(dirname(dirname(__DIR__))));//部署项目的根目录
        define("API_ROOT_NAME", $dirs[count($dirs) - 2]);//顶级目录名称
        define("API_COVERT", implode("/", array("/" . API_ROOT_NAME, "covert")));//生成文档路径
        define("API_DIST", implode("/", array("/" . API_ROOT_NAME, "dist")));//展示文档路径

        define("API_COVERT_IMG", implode("/", array(API_COVERT, "img")));//img目录地址
        define("API_COVERT_JS", implode("/", array(API_COVERT, "js")));//js目录地址
        define("API_COVERT_CSS", implode("/", array(API_COVERT, "css")));//css目录地址
        define("API_DIST_JSON", implode("/", array(API_DIST, 'json')));//dist/json
        ### 默认设置 ###
        ini_set('max_execution_time', '0');//不限制页面执行时间
        date_default_timezone_set("Asia/Shanghai");//设置时区

        ### 加载config.php 并配置初始化json,config ###
        # 加载配置文件
        $params = require(__DIR__ . '/../config/Config.php');

        $this->json = array_merge($this->json, $params['server_info']);//合并json配置
        $this->config = array_merge($this->config, $params['config']);//合并公共配置
        # 定界符
        $this->delimiter = (isset($this->config['delimiter']) && $this->config['delimiter']) ? $this->config['delimiter'] : 'APIDOC';
        ### 添加公共提示信息 ###

        $this->addPublicMessage("注释中请定义指定定界符:" . $this->delimiter . ',否则将不会被解析');
        ### 创建初始化需要的目录###
        //$dir = $this->mk_json_dir();//创建json根目录
        ### 初始化 路径占位符 ###
        $this->placeholder["path"]=array(
            "{{web_root}}"=>WEB_ROOT,//根目录
            "{{web_root_top}}"=>dirname(WEB_ROOT),//根目录上一级别
            "{{web_root_top2}}"=>dirname(dirname(WEB_ROOT)),//根目录上二级
        );;
        ### 开启session ###
        session_start();
    }

    private function __construct($config = array())
    {
        ### 初始化###
        $this->init();
    }

    /**
     * 获取注释解析对象(行解析 ,块解析 )
     * @return CommentParser
     */
    private function getDocParserObj()
    {
        $deparser = new CommentParser();
        $deparser->params_parse_block = array_merge($deparser->params_parse_block, array('examples'));
        $deparser->params_array_keys = array_merge($deparser->params_array_keys, array('param'));
        return $deparser;
    }

    /**
     * 获取当前Swagger_Helper实例对象
     * @return null|ApiDocument
     */
    public static function getObj($config = array())
    {

        if (!self::$obj instanceof self) {
            self::$obj = new self();
        }
        self::$obj->doc_parser = new CommentParser();
        return self::$obj;
    }

    ###################  配置操作  #####################

    /**
     * 添加公共参数
     * @param array $param ['name'=>'参数名','in'=>'参数位置','default'=>"默认值","description"=>"描述","required"=> 是否必传（true/false）,"not_add_url=>array('不需要该参数的url')"]
     * @return $this
     */
    public function addPublicParams($params)
    {
        if (!is_array($params)) {
            return $this;
        }
        foreach ($params as $param) {
            $p["name"] = array_key_exists('name', $param) ? $param["name"] : "";//参数名字
            $p["in"] = array_key_exists('in', $param) ? $param["in"] : "formData";//位置
            $p["default"] = array_key_exists('default', $param) ? $param["default"] : "";//默认值
            $p["description"] = array_key_exists('description', $param) ? $param["description"] : "";//描述
            $p["required"] = array_key_exists('required', $param) ? $param["required"] : false;//是否必填
            $p["not_add_url"] = array_key_exists('not_add_url', $param) && is_array($param['not_add_url']) ? $param['not_add_url'] : array();//不添加该参数的url集合
            $this->config['public_params'][] = $p;
        }
        return $this;
    }

    /**
     * 添加公共消息
     */
    public function addPublicMessage($message)
    {
        $this->config['public_message'][] = $message;
        return $this;
    }

    /**
     * 将注释分割符分割后在拼成完整的注释
     * @param $com
     * @return array
     */
    private function parse_method($com)
    {
        $coms = explode($this->explode_str, $com);
        if (count($coms) > 1) {
            foreach ($coms as $k => &$v) {
                if ($k == 0) {
                    $coms[$k] = $v . '*/';
                } else {
                    $coms[$k] = '/**' . $v;
                }
            }
        }
        return $coms;
    }

#####################  注释格式化操作 #####################################
    #json数据缓冲区
    private $json_cache = [];

    /**
     * 初始化缓冲区
     * @param null $module 模块信息
     */
    private function json_cache_init($module = null)
    {

        # 初始化配置
        $this->json_cache = $this->json;
        # 设置模块标题
        $this->json_cache['info']['title'] = $module && array_key_exists('title', $module) ? $module['title'] : '';
        # 设置版本信息
        $this->json_cache['info']['version'] = $module && array_key_exists('version', $module) ? $module['version'] : '1.0.0';
        # 设置此模块的描述
        $this->json_cache['info']['description'] = $module && array_key_exists('description', $module) ? $module['description'] : '';

        # 设置模块host
        if (array_key_exists('host', $module) && $module['host']) {
            $this->json_cache['host'] = $module['host'];
        }
        # 设置模块标签
        if (array_key_exists('tags', $module) && $module['tags'] && is_array($module['tags'])) {
            $this->json_cache['tags'] = array_merge($this->json_cache['tags'], $module['tags']);
        }
    }

    /**
     * 目录文件注释格式化
     * @param  $from_dir 要获取注释的类文件目录
     * @param  $to_dir   生成json文件存放目录（false 则不保存到文件中）
     * @param  $is_depath 递归层级  (0 不递归 ,<0 无限制递归  >0 递归层级 )
     */
    private function dir_format_json($from_dir, $is_depath = -1, $module = null)
    {
        try {
            if (!is_dir($from_dir)) {
                throw new \ApiDocumentException("({$from_dir})不是正确目录路径");
            }
            #读取目录获取文件
            $hande = opendir($from_dir);
            while ($file = readdir($hande)) {
                if (in_array($file, ['.', '..'])) {
                    continue;
                }
                #如果是目录 递归获取文件
                $fullpath = $from_dir . '/' . $file;
                if (is_dir($fullpath) && $is_depath != 0) {
                    $result = $this->dir_format_json($fullpath, $is_depath--, $module);
                    if (!$result) {
                        return false;
                    }
                }
                #如果是文件
                if (is_file($fullpath)) {
                    $result = $this->file_format_json($fullpath, $com);
                    if (!$result) {
                        return false;
                    }
                }
            }
            closedir($hande);
        } catch (ApiDocumentException $se) {
            $this->moduleMessage[$module['title']]['status'] = ErrorCode::COMMENT_ERROR;
            $this->moduleMessage[$module['title']]['file_name'] = $fullpath;
            $this->moduleMessage[$module['title']]['com'] = $com;
            $this->moduleMessage[$module['title']]['status_message'] = $se->getMessage();

            return false;

        } catch (\Exception $e) {
            $this->moduleMessage[$module['title']]['status'] = ErrorCode::SERVER_ERROR;
            $this->moduleMessage[$module['title']]['file_name'] = $fullpath;
            $this->moduleMessage[$module['title']]['com'] = $com;
            $this->moduleMessage[$module['title']]['status_message'] = $e->getMessage();
            return false;

        }
        return true;
    }

    /**
     * 单文件注释格式化
     * @param $path 具体文件地址
     * @param &$comment 当前注释
     * @param string $ext_filter 过滤指定文件
     * @return array
     */
    private function file_format_json($path, &$comment = null, $ext_filter = "*")
    {
        if (!file_exists($path)) {
            throw new ApiDocumentException("{$path}文件不存在");
        }
        $info = pathinfo($path);
        #针对于PHP文件 正则获取注释
        if (is_array($info) && array_key_exists('extension', $info) && $info['extension'] == 'php') {
            $contents = file_get_contents($path);
            $matchs = [];
            preg_match_all('@/\*\*' . preg_quote($this->delimiter) . '.*?\*/@s', $contents, $matchs);
            foreach ($matchs[0] as $com) {
                $comment = $com;
                #格式化注释 到json数组中
                $result = $this->comment_format($com, $path);
                if ($result !== true) {
                    return $result;
                }
            }
        }
        return true;
    }

    /**
     *  将数据转为json写入到指定文件中
     */
    private function putFile($file_name, $data)
    {
        try {
            if (!@file_put_contents($file_name, json_encode($data, 2))) {
                $error = error_get_last();
                throw new ApiDocumentException($error['message']);
            }
        } catch (\Exception $e) {
            throw new ApiDocumentException('写入json文件失败:' . $e->getMessage());
        }
    }

    /**
     * 格式化注释到json中
     * @param $com 完整注释
     * @param $filename 注释所在文件
     * @return bool
     * @throws ApiDocumentException
     */
    private function comment_format($com, $filename = '')
    {

        //  echo $filename;echo "<br>";
        $docs = $this->parse_method($com);
        foreach ($docs as $doc) {

            #解析注释
            $d = $this->getDocParserObj();
            $info = $d->parse($doc);
            if (!$info) {
                continue;
            }
            $data = array();

            if (!array_key_exists('url', $info)) {
                throw new \ApiDocumentException('注释中未发现必填项:url');
            }
            if (!array_key_exists('method', $info)) {
                throw new \ApiDocumentException('注释中未发现必填项:method');
            }
            # 添加公共参数
            $public_params = $this->config['public_params'];
            if ($public_params) {
                foreach ($public_params as $pp) {
                    $not_add_url = $pp['not_add_url'];
                    unset($pp['not_add_url']);
                    # 如果不在不添加的地址集合中 ,和通配符地址  中 则添加参数
                    $b = true;
                    foreach ($not_add_url as $url) {
                        # 地址等同 或者 匹配通配等同
                        $index = strrpos($url, '/*');
                        if ($info['url'] == $url || ($index && substr($url, 0, $index) == substr($info['url'], 0, $index))) {
                            $b = false;
                            break;
                        }
                    }
                    if ($b) {
                        $data['parameters'][] = $pp;
                    }
                }
            }
            #解析参数
            if (array_key_exists('param', $info)) {
                foreach ($info['param'] as &$param) {
                    $param = trim($param);
                    ### 语法1json ####
                    if (strlen(ltrim($param, "{")) != strlen($param)) {
                        if ($parameters = json_decode($param, true)) {
                            $data['parameters'][] = $parameters;
                        } else {
                            throw new \ApiDocumentException('param json格式数据错误');
                        }
                        #### 语法2 空格分割法 ###
                    } else {
                        $arr = array();
                        #去除空项
                        $p = array_filter(explode(' ', $param), function ($v) {
                            return !(trim($v) === "");
                        });
                        $p = array_splice($p, 0, count($p));
                        $arr['type'] = $p[0];//类型
                        $arr['name'] = $p[1];//名字
                        $arr['default'] = $p[2] == '/' ? '' : $p[2];//默认值
                        $arr['in'] = $p[3];//位置
                        $arr['description'] = isset($p[4]) ? $p[4] : '';//描述*/
                        $arr['required'] = (isset($p[5]) && $p[5] == 'true');//是否必填
                        $arr['allowEmptyValue'] = (isset($p[6]) && $p[6] == 'true');//是否允许为空(空值则也会发送)
                        $data['parameters'][] = $arr;
                    }
                }
            }

            #解析描述信息
            if (array_key_exists('description', $info)) {
                $data['description'] = $info['description'];
            }
            #解析标签
            if (array_key_exists('tags', $info)) {
                $data['tags'] = array_filter(explode(' ', $info['tags']), function ($v) {
                    return !(trim($v) === "");
                });
            }
            #解析标识 operationId
            if (array_key_exists('operationId', $info)) {
                $data['operationId'] = $info['operationId'];
            }
            #解析方法总结
            if (array_key_exists('summary', $info)) {
                $data['summary'] = $info['summary'];
            }
            #解析请求数据类型(重写)
            if (strtolower($info['method']) == 'post') {
                $data['consumes'] = ['application/x-www-form-urlencoded'];
            }
            if (array_key_exists('consumes', $info)) {
                $data['consumes'] = [$info['consumes']];
            }
            #解析响应数据
            if (array_key_exists('return', $info)) {
                $arr = [];
                $return = explode(' ', $info['return']);
                $arr["200"]['description'] = isset($return[1]) ? $return[1] : '';//名字
                //  $arr["200"]['schema']['type']='array';
                $data['responses'] = $arr;
            }
            # 解析案例 说明
            if (array_key_exists('examples', $info)) {
                $v = json_decode($info['examples'], 1);
                if (!$v) {
                    throw new \ApiDocumentException('examples 的数据无法解析,格式可能不正确');
                }
                $data['responses']['200']['examples'] = $v;
            }
            $this->json_cache['paths'][$info['url']][strtolower($info['method'])] = $data;

        }
        return true;
    }

################### 模块操作 ########################
    #创建/dist/json/module 目录
    private function mk_json_dir()
    {
        # 创建json目录
        $json_module = WEB_ROOT . DIRECTORY_SEPARATOR . API_DIST . "/json/module";
        if (!file_exists($json_module)) {
            mkdir($json_module, 0775, true);
        }
        return $json_module;
    }

    # 格式化模块数据(生成json文件)
    private function module_format($modules, $json_name)
    {
        # 创建json根目录
        $dir = $this->mk_json_dir();
        # 删除原有json
        $module_path = $dir . '/' . $json_name . '.json';
        if (is_file($module_path)) {
            unlink($module_path);
        }
        # 过滤 -- 在配置文件存在该模块的,保存 title
        $modules_new = [];
        foreach ($modules as $m) {
            $titles = array_column($this->config['module'], 'title');
            $key = array_search($m['title'], $titles);
            if (is_int($key)) {
                $m1['title'] = $this->config['module'][$key]['title'];
                $modules_new[] = $m1;
            }
        }
        # 写入json
        $this->putFile($module_path, $modules_new);
    }

    # 模块化生成文档
    public function module_fromat_json()
    {
        $data = $this->returnSuccess();
        try {
            $this->mk_json_dir();
            # 先删除之前生成的json文件
            $this->delFile(WEB_ROOT . API_DIST_JSON);
            # 获取模块列表
            $module = $this->config['module'];

            if (!$module) {
                throw new \ApiDocumentException('Config.php配置文件中未发现module项');
            }

            # 根据模块生成对应的json文件
            foreach ($module as $m) {
                $this->moduleMessage[$m['title']] = array(
                    'status' => 0,//状态
                    'status_message' => '',
                    'message' => [],//消息列表
                    'file_name' => '',//文件地址
                    'com' => '',//注释
                );
                try {
                    # 1.初始化json_cache(模块title\host\tags)
                    $this->json_cache_init($m);
                    # 2.判断是否是数组 字符串(文件,目录)
                    if (is_array($m['path'])) {
                        $path = $m['path'];
                    } else {
                        $path = array();
                        $path[] = $m['path'];
                    }
                    foreach ($path as $p) {

                        # 占位符替换
                        foreach ($this->placeholder["path"] as $k=>$v ){
                            $p=  str_replace($k,$v,$p);
                        }
                        # 判断路径是否存在
                        if (!file_exists($p)) {
                            throw new ApiDocumentException("{$p} 路径不存在");
                        }
                        # 如果是目录
                        if (is_dir($p)) {
                            $this->dir_format_json($p, -1, $m);
                            # 如果是文件
                        } else {
                            $this->file_format_json($p);
                        }

                    }
                    # 3.将json_cache 写入文件 (如果无错)
                    $to_dir = "../dist/json/" . md5($m['title']) . '.json';
                    if ($to_dir && $this->moduleMessage[$m['title']]['status'] == 0) {
                        $this->putFile($to_dir, $this->json_cache);
                    }

                } catch (\Exception $ae) {
                    $this->moduleMessage[$m['title']] = array(
                        'status' => ErrorCode::MODULE_ERROR,//状态
                        'status_message' => $ae->getMessage(),
                        'message' => [],//消息列表
                        'file_name' => '',//文件地址
                        'com' => '',//注释
                    );
                }

            }
        } catch (\Exception $e) {
            $data['status'] = ErrorCode::MODULE_ERROR;
            $data['message'] = $e->getMessage();
            $this->moduleMessage = [];
        }
        # 生成module.json文件 并返回链接
        if ($this->moduleMessage) {
            $build_module = [];
            foreach ($this->moduleMessage as $k => $m) {
                if ($m['status'] == 0) {
                    $build_module[] = array('title' => $k);
                }
            }
            $url = $this->bulid_module_url($build_module, true);
        }
        $data['data']['modules'] = $this->moduleMessage;
        $data['data']['url'] = isset($url) ? $url : '';
        return $data;
    }

    # 所有模块的json文件名(只在生成的是生成一次,用来在比较使用)
    private $module_all_name = "module_all";

    /**
     * 生成模块json文件 并返回dist地址
     * @param $modules 模块列表([[title=>'模块1'],['title'=>'模块2']])
     * @param bool $is_all 是否是所有模块(为后期确保展示比较)
     * @return string 地址链接(/apidoc/dist?num={json_name})
     */
    public function bulid_module_url($modules, $is_all = false)
    {
        if (!$modules) {
            return "";
        }
        # 排序(保证不同顺序，但一样模块集合，生成文件是同一个)
        sort($modules);
        # 生成一个主模块文件
        if ($is_all) {
            $json_name = $this->module_all_name;
            $this->module_format($modules, $json_name);
        }

        # 生成dist展示模块
        $json_name = "module_" . md5(json_encode($modules, 2));

        # 写入json 文件
        $this->module_format($modules, $json_name);

        # 返回链接
        return API_DIST . '?num=' . $json_name;
    }

    /**
     * 获取已经生成的module列表
     * @return array
     */
    public function getAllModule()
    {
        $modules = [];
        # 文件是否存在
        $path = WEB_ROOT . API_DIST . '/json/module/' . $this->module_all_name . '.json';
        if (file_exists($path)) {
            $json = file_get_contents($path);
            $modules = json_decode($json, 1);
        }
        # 读取数据
        return $modules ? $modules : [];
    }

    /**
     * 获取已有的链接列表
     * @return array
     */
    public function getAllModuleUrls()
    {
        # 打开目录 获取文件列表
        $urls = [];
        $dir = WEB_ROOT . API_DIST . '/json/module';
        if (file_exists($dir)) {
            $dirObj = opendir($dir);
            while ($file = readdir($dirObj)) {
                $fullpath = $dir . '/' . $file;
                $info = pathinfo($fullpath);
                $ext = $info['extension'];
                $filename = $info['filename'];
                # 筛选指定文件
                if (!is_file($fullpath) || $ext != 'json' || $filename == $this->module_all_name) {
                    continue;
                }
                # 获取对应的模块列表
                $modules = file_get_contents($fullpath);
                $modules = json_decode($modules, true);
                $modules = $modules ? $modules : [];
                $urls[$filename] = $modules;
            }
        }
        return $urls ? $urls : [];
    }

    /**
     * 删除指定链接
     * @param $num 链接文件名 /dist/json/module/xxxx.json
     */
    public function del_module_url($num)
    {
        $path = WEB_ROOT . API_DIST . '/json/module/' . $num . '.json';
        if ($num == $this->module_all_name || !file_exists($path)) {
            return $this->returnError('文件不存在');
        }
        if (!@unlink($path)) {
            return $this->returnError('删除文件失败');
        }
        return $this->returnSuccess();
    }
    ################### 工具信息操作  ########################

    /**
     * 获取工具信息(版本..)
     * @return array
     */
    public function getApiDocmentInfo()
    {

        return array(
            'version' => $this->version,
            'date' => date('Y-m-d H:i:s', time()),
        );
    }

    /**
     * 转jsons数据并输出
     * @param $data
     */
    public function asJson($data)
    {
        echo json_encode($data, true);
    }

#################### 页面操作 ####################################

    # 显示生成页面
    public function showCovertPage($is_auth = true)
    {
        $this->showPage("covert", null, [], $is_auth);
    }

    # 显示权限验证页面
    public function showAuthPage($is_auth = false)
    {
        $this->showPage('auth', null, [], $is_auth);
    }

    # 显示生成链接页面
    public function showBulidPage($is_auth = true)
    {
        //验证什么方式打开(非窗口跳生成页面)
        $ref = array_key_exists('HTTP_REFERER', $_SERVER) ? $_SERVER['HTTP_REFERER'] : '';
        $upath = substr($ref, strpos($ref, '/', 8));
        if ($ref && in_array($upath, [API_COVERT, API_COVERT . '/'])) {
            //查询模块列表
            $modules = $this->getAllModule();
            //已有链接列表
            $urls = $this->getAllModuleUrls();
            $params['modules'] = $modules;
            $params['urls'] = $urls;
            $this->showPage('bulid_url', 'php', $params, $is_auth);
        } else {
            $this->redirectPage();
        }

    }

    # 显示注释解析测试
    public function showCommentPage($is_auth = true)
    {
        $this->showPage('comment', null, [], $is_auth);

    }

    # 显示帮助页面
    public function showHelpPage($is_auth = true)
    {

        $this->showPage('help', null, [], $is_auth);

    }

    # 显示设置页面
    public function showSetConfig($is_auth = true)
    {
        $this->showPage('set_config', null, [], $is_auth);
    }

    # 跳转指定页面
    public function redirectPage($url = null)
    {
        $url = $url ? $url : API_COVERT;
        header('Location:' . $url);
    }

    /**
     * 显示指定页面
     * @param string $name 模板名
     * @param array $params 需要导入到页面的参数 ['参数名'=>参数值]
     */
    public function showPage($name = "covert", $ext = "php", $params = array(), $is_auth = true)
    {
        $ext = $ext ? $ext : 'php';
        if ($is_auth && !$this->checkAuth()) {
            $this->showAuthPage();
            return;
        }

        header('Content_Type:text/html;charset=utf8');
        # 导入参数
        foreach ($params as $k => $v) {
            $$k = $v;
        }
        # 工具信息
        $info = $this->getApiDocmentInfo();

        # 公共消息
        $public_msg = $this->config['public_message'];
        include("./template/" . $name . "." . $ext);
    }
################  权限操作 start #####################

    /**
     * 验证权限
     * @return bool
     */
    public function checkAuth()
    {
        # 未设置密码 直接通过
        if (!array_key_exists('covert_password', $this->config) || !$this->config['covert_password']) {
            return true;
        }

        $apidoc_auth = Session::get('apidoc_auth');
        if (!$apidoc_auth) {
            return false;
        }
        if (md5($this->config['covert_password']) == $apidoc_auth) {
            return true;
        }
        return false;
    }

    /**
     * 验证密码
     * @param $pwd
     */
    public function checkPwd($pwd)
    {
        $pwd = md5($pwd);
        # 未设置密码 直接通过
        if (!array_key_exists('covert_password', $this->config) || !$this->config['covert_password']) {
            return true;
        }
        # 配置中存在密码
        if (md5($this->config['covert_password']) == $pwd) {
            # 添加session
            // $_SESSION['apidoc_auth']=$pwd;
            Session::set('apidoc_auth', $pwd, 3600 * 4);
            return true;
        }
        return false;
    }

    ##################### 返回信息(格式) #######################
    public function returnError($message = '', $code = 500, $data = array())
    {
        $data = array('status' => $code, 'message' => $message, 'data' => $data);
        return $data;
    }

    public function returnSuccess($data = array(), $message = '')
    {
        $data = array('status' => 0, 'message' => $message, 'data' => $data);
        return $data;
    }
##################### 文件操作 #########################

    /**
     * 删除指定目录下的文件，不删除目录文件夹
     * @param $dirName 目录地址
     * @return bool
     */
    public function delFile($dirName, $is_depath = false)
    {
        if (file_exists($dirName) && $handle = opendir($dirName)) {
            while (false !== ($item = readdir($handle))) {
                if ($item != "." && $item != "..") {
                    if (file_exists($dirName . '/' . $item) && is_dir($dirName . '/' . $item) && $is_depath) {
                        $this->delFile($dirName . '/' . $item, $is_depath);
                    } else {
                        @unlink($dirName . '/' . $item);
                    }
                }
            }
            closedir($handle);
        }
    }

###################### 配置操作  #############################

    /**
     * 获取所有配置数据
     * @return mixed
     */
    public function getAllConfig()
    {
        return require(__DIR__ . '/../config/Config.php');
    }

    /**
     * 获取主配置数据
     * @return mixed
     */
    public function getServerInfoConfig()
    {
        $config = $this->getAllConfig();
        return $config['server_info'];
    }

    /**
     * 获取模块配置数据
     * @return mixed
     */
    public function getConfig()
    {
        $config = $this->getAllConfig();
        return $config['config'];
    }

    /**
     * 获取主配置中对应键的值
     * @param $name
     * @return mixed
     */
    public function getServerInfoValue($name)
    {
        $server_info = $this->getServerInfoConfig();
        return $server_info[$name];

    }

    /**
     * 设置主配置
     * @param $name
     * @param $value
     */
    public function setServerInfoValue($name, $value)
    {
        $config = $this->getAllConfig();
        $config['server_info'][$name] = $value;
        # 写入配置
        return $this->writeConfig($config);
    }

    /**
     * 获取模块配置
     * @param $name
     * @return mixed
     */
    public function getConfigValue($name)
    {
        $config = $this->getConfig();
        return $config[$name];

    }

    /**
     * 设置模块配置
     * @param $name
     * @param $value
     */
    public function setConfigValue($name, $value)
    {
        $config = $this->getAllConfig();
        $config['config'][$name] = $value;
        # 写入配置
        return $this->writeConfig($config);
    }

    /**
     * 写入配置
     */
    public function writeConfig($config = array())
    {

        $config_path = __DIR__ . '/../config/Config.php';
        $content = "<?php\n";
        $content .= 'return ';
        $content .= var_export($config, true);
        $content .= ";\n";
        # 创建并打开配置文件
        touch($config_path);
        $filePointer = fopen($config_path, 'r+');

        # 设置文件权限
        chmod($config_path, 0640);

        # 文件不存在
        if (!is_resource($filePointer)) {
            return false;
        }

        # 尝试枷锁
        if (!flock($filePointer, LOCK_EX)) {
            return false;
        }

        # 编写配置并释放锁
        ftruncate($filePointer, 0);
        fwrite($filePointer, $content);
        fflush($filePointer);
        flock($filePointer, LOCK_UN);
        fclose($filePointer);
        return true;
    }
}
