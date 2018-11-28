//***********初始化js*************
//1.加载配置
const root_name=$('input[name=api_root_name]').val();//根目录文件名
//url get
const page_covert=$('input[name=page_covert]').val()+"/";//生成文档页面
const page_dist=$('input[name=page_dist]').val();//展示文档页面
const page_bulid_url=page_covert+'?page=1';//生成模块链接页面
const page_set_config=page_covert+'?page=2';//配置页面
const page_comment=page_covert+'?page=3';//注释测试页面
const page_history=page_covert+'?page=4';//版本历史页面

const page_covert_img=$('input[name=page_covert_img]').val();//图片地址
window.page_dist=page_dist;
window.page_covert=page_covert;
window.page_bulid_url=page_bulid_url;
window.page_covert_img=page_covert_img;
window.page_set_config=page_set_config;
window.page_comment=page_comment;
window.page_history=page_history;
/*
 *      type
 *              0.生成文档
 *              1.生成模块链接
 *              2.验证权限
 *              3.删除指定模块链接
 *              4.获取配置信息
 *              5.保存配置信息
 *              6.注释生成与逆向
 */
window.post_bulid_url=page_covert+"?type=1";
window.post_auth=page_covert+"?type=2";
window.post_del_url=page_covert+"?type=3";
window.post_get_config=page_covert+"?type=4";
window.post_save_config=page_covert+"?type=5";
window.post_comment_covert=page_covert+"?type=6";