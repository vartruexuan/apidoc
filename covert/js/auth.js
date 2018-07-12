/**
 * Created by PhpStorm.
 * User: 小昭昭
 * Date: 2018/7/9
 * Time: 11:26
 */
$(function () {
    //获取焦点
    $('input[name=pwd]').focus()
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
    /**
     * 加上回车确定
     */
    $('body').unbind('keydown').on('keydown', function(e){

        if(e.keyCode == 13){

            $(document).find('.btn-auth').click();

        }

    });
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

/**
 *
 * @param msg
 * @param type error success
 */
function showMsg(msg) {
    $('#msg').html("<span style='color:red'>"+msg+"</span>");
    if(timer){
        clearTimeout(timer);
    }
     timer=setTimeout(function () {
        $('#msg').html('');
    },3000)
}