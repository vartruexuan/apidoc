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
if (strtolower($_SERVER['REQUEST_METHOD']) == 'get') {

    if (!$apiobj->checkAuth()) {
        $apiobj->showAuthPage();
    } else {
        $apiobj->showCovertPage();
    }

#post 生成文档 并返回数据
} else {
    /*
     *      type
     *              0.生成文档
     *              1.生成模块链接
     *              2.验证权限
     *
     */
    $auth_types = [0, 1];
    $type = isset($_POST['type']) ? $_POST['type'] : 0;
    # 验证权限
    if (in_array($type, $auth_types)) {
        $return_data = $apiobj->returnSuccess();
        if (!$apiobj->checkAuth()) {
            $return_data['status'] = ErrorCode::AUTH_ERROR;
            $return_data['message'] = "权限验证失败";
            $apiobj->asJson($return_data);
            return;
        }
        # 验证通过
    }
    # 生成链接
    if ($type == 1) {
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
    } else {
        # 生成文档
        $return_data = $apiobj->module_fromat_json();
    }

    $return_data['data']['info'] = $apiobj->getApiDocmentInfo();
    $apiobj->asJson($return_data);

}