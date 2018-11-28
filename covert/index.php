<?php
/**
 * Created by PhpStorm.
 * User: 小昭昭
 * Date: 2018/6/4
 * Time: 14:42
 */
require __DIR__ . '/bin/ApiDocument.php';

$apiobj = ApiDocument::getObj();

# 获取配置 权限验证

# get 展示生成页面
$method=strtolower($_SERVER['REQUEST_METHOD']);
if ( $method== 'get') {
    $page=isset($_GET['page'])?$_GET['page']:0;
    if ($page == 0) {//主页面生成文档
        $apiobj->showCovertPage();
    } else if ($page == 1) {//生成链接
        $apiobj->showBulidPage();
    }else if($page==2){//配置设置
        $apiobj->showSetConfig();
    }else if($page==3){//注释协助
        $apiobj->showCommentPage();
    }else if($page==4){//历史版本页面
        $apiobj->showHistoryPage(false);
    }

#post 生成文档 并返回数据
} elseif($method == 'post') {
    /*
     *      type
     *              0.生成文档
     *              1.生成模块链接
     *              2.验证权限
     *              3.删除指定模块链接
     *              4.获取配置信息
     *              5.保存配置信息
     */
    # 需要验证权限的操作
    $auth_types = [0, 1, 3,4,5];
    $type = isset($_GET['type']) ? $_GET['type'] : 0;
    # 验证权限
    $return_data = $apiobj->returnSuccess();
    if (in_array($type, $auth_types)) {
        if (!$apiobj->checkAuth()) {
            $return_data['status'] = ErrorCode::AUTH_ERROR;
            $return_data['message'] = "权限验证失败";
            $apiobj->asJson($return_data);
            return;
        }
        # 验证通过
    }
    # 生成文档
    if ($type==0) {
        $return_data = $apiobj->module_fromat_json();
    # 生成链接
    }elseif ($type == 1) {
        $modules = $_POST['modules'];
        if ($modules) {
            $modules = explode(',', $modules);
            $ms = [];
            foreach ($modules as $m) {
                $ms[] = array('title' => $m);
            }

            $url = $apiobj->bulid_module_url($ms);
            $data['url'] = $url;
            $return_data = $apiobj->returnSuccess($data);
        }
    # 权限验证
    } elseif ($type == 2) {
        $pwd = isset($_POST['pwd']) ? $_POST['pwd'] : '';
        $return_data = $apiobj->returnSuccess();
        if (!$apiobj->checkPwd($pwd)) {
            $return_data['status'] = ErrorCode::AUTH_ERROR;
            $return_data['message'] = "密码验证失败";
        }
    # 删除链接
    }else if($type == 3){
        $num=isset($_POST['num'])?$_POST['num']:'';
        $return_data=  $apiobj->del_module_url($num);
    # 获取配置信息
    }elseif($type==4){
        $return_data['data']['config']=$apiobj->getAllConfig();
        unset( $return_data['data']['config']['config']['covert_password']);
    # 保存配置信息
    }elseif($type==5){
        $params=$_POST;
        $params["config"]["module"]=!isset($params["config"]["module"])||!$params["config"]["module"]?[]:$params["config"]["module"];
        # 验证配置
        foreach ($params["config"]["module"] as &$module){
            if(isset($module['path'])){
              foreach ($module['path'] as &$path){
                  $path=str_replace('\\',"/",$path);
              }
            }
        }
        #1.拼接配置
        $config=$apiobj->getAllConfig();
        $params['server_info']=array_merge($config['server_info'],$params['server_info']);
        if(isset($params['config']['covert_password'])){
            unset($params['config']['covert_password']);
        }
        $params['config']=array_merge($config['config'],$params['config']);
        $params=array_merge($config,$params);
        #2.写入文件中l
        if(!$apiobj->writeConfig($params)){
            $return_data['status']=ErrorCode::PARAM_ERROR;
            $return_data['message']="写入配置失败";
        }
    # 注释生成与逆向
    }elseif($type==6){
        $params=$_POST;
        # 是否逆向
        $is_reverse=isset($params['is_reverse'])&&$params['is_reverse']?1:0;

        # 参数验证
        try{

            # 逆向
            if($is_reverse){
                $params=$params['comment'];
                $return_data['data']['result']=$apiobj->comment_covert_reverse($params,$is_reverse,2);

                # 生成注释
            }else{
                # 语法1
                $return_data['data']['result'][]=$apiobj->comment_covert_reverse($params,$is_reverse,1);
                # 语法2
                $return_data['data']['result'][]=$apiobj->comment_covert_reverse($params,$is_reverse,2);
            }



        }catch (\Exception $e){
            $return_data['status']=500;
            $return_data['message']=$e->getMessage();
        }
    }
    # 获取工具版本信息
    $return_data['data']['info'] = $apiobj->getApiDocmentInfo();
    $apiobj->asJson($return_data);
}