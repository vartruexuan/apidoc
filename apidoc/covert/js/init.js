//***********初始化js*************
//1.加载配置
const root_name=$('input[name=api_root_name]').val();//根目录文件名
//url get
const page_covert=$('input[name=page_covert]').val();//生成文档页面
const page_dist=$('input[name=page_dist]').val();//展示文档页面
const page_bulid_url=page_covert+'?page=1';//生成模块链接页面
const page_covert_img=$('input[name=page_covert_img]').val();//图片地址

window.page_dist=page_dist;
window.page_covert=page_covert;
window.page_bulid_url=page_bulid_url;
window.page_covert_img=page_covert_img;