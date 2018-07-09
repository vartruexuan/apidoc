/**
 * Created by PhpStorm.
 * User: 小昭昭
 * Date: 2018/7/9
 * Time: 11:26
 */
$(function () {
    //绑定密码验证
    $('.btn-auth').on('click',function () {
        //获取密码值
        var pwd=$('input[name=pwd]').val().trim();
        if(!pwd){
            showMsg('请输入密码');
            return;
        }
        checkpwd(pwd);

    })
})

function checkpwd(pwd) {
    $.ajax({
        url:"",
        type:'post',
        dataType:"json",
        data:{
            type:2,
            pwd:pwd
        },
        success:function (jsonData) {
            if(jsonData.status!=0){
                showMsg(jsonData.message);
            }else{
                //验证成功刷新页面
                window.location.reload();
            }
        }
    })
}
var timer=null;
function showMsg(msg) {
    $('#msg').text(msg);
    if(timer){
        clearTimeout(timer);
    }
     timer=setTimeout(function () {
        $('#msg').text('');
    },3000)
}