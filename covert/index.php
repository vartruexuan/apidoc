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
    if ($page == 0) {
        $apiobj->showCovertPage();

    } else if ($page == 1) {
        $apiobj->showBulidPage();
    }else if($page==2){
        $apiobj->showSetConfig();
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

        #1.拼接配置

        #2.写入文件中l

    }

    # 获取工具版本信息
    $return_data['data']['info'] = $apiobj->getApiDocmentInfo();
    $apiobj->asJson($return_data);

}