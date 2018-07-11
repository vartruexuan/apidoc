/**
 * Created by PhpStorm.
 * User: 小昭昭
 * Date: 2018/7/11
 * Time: 16:10
 */
//*********** 链接管理主要逻辑js***********//
$(function () {
    //跳转链接
    $('.go_url').on('click', function () {
        var url = $('input[name=input_url]').val().trim();
        if (url) {
            top.window.open(url);
        }
    });
    //模块列表点击样式切换
    $('.module-list a').on('click', function () {
        $(this).toggleClass('active');
    });
    //链接列表点击切换样式
    $('.urls-list').delegate('a', 'click', function () {
        $('.urls-list a,.module-list a').removeClass('active');

        //让对应的模块选中
        var module_names = $(this).find('.module_names').text().trim();
        module_names = module_names.split(',');
        for (var i in module_names) {
            var module_name = module_names[i];
            $('.module-list a').each(function () {
                if ($(this).find('.module_name:eq(0)').text() == module_name) {
                    $(this).addClass('active');
                    return;
                }
            })
        }

        //选中的数量和模块数量不一致报错
        if ($('.module-list a.active').length != module_names.length) {
            $(this).addClass('list-group-item-danger');
            //找到则选中
        } else {
            $(this).addClass('active');
        }

        //展示链接
        var module = $(this).data('url');
        $('input[name=input_url]').val(parent.ApiHelper.splicing_url(parent.page_dist + '?num=' + module));

    })

    //绑定生成链接事件
    $('.btn-bulid_url').on('click', function () {
        bulid_url();
    })
    //删除链接
    $('.urls-list').delegate('a >span.url-del', 'click', function () {

        var self=this;
        parent.layer.confirm('你确定要删除该链接？', {
            btn: ['确定', '取消'] //按钮
        }, function (index) {
            parent.layer.close(index);
            //获取对应data-url
            var url=$(self).parent('a').data('url');
            //进行删除操作
            del_url(url);
        });


    });

})


/**
 * 删除链接
 * @param num 链接名
 */
function del_url(num) {

    parent.ApiHelper.ajax({
        url:"" ,
        type: "post",
        dataType: "json",
        data: {
            type:3,
            num: num
        },
        success: function (jsonData) {

            if(jsonData.status==0){
                //成功移除对应的链接
                $('.urls-list a[data-url='+num+']').remove();
            }else{
                parent.layer.msg('删除失败:'+jsonData['message'],{icon:2});
            }
        }
    })
}

/**
 * 生成链接
 */
function bulid_url() {

    // 获取选中的模块
    var div_m = $('.module-list a.active');
    if (div_m.length < 1) {
        parent.layer.msg('请选择要生成链接的模块');
        return;
    }
    //拼接模块
    var m = [];
    div_m.each(function () {
        m.push($(this).text())
    });
    modules = m.join(',');
    parent.ApiHelper.ajax({
        url: "",
        type: 'POST',
        dataType: 'json',
        data: {
            type: 1,
            modules: modules
        },
        success: function (jsonData) {
            if (jsonData['status'] == 0) {
                //往链接列表中插入 如果已经存在 则选中
                var url = (jsonData['data']['url'].split('?num='))[1];
                var a = $('.urls-list a[data-url=' + url + ']');
                console.log(a);
                //如果已经存在让他选中(触发点击事件)
                if (a.length < 1) {
                    a = $('<a href="#" class="list-group-item" data-url="' + url + '"><span class="module_names">' + modules + '</span></a>');
                    $('.urls-list').prepend(a);

                }
                a.trigger('click');
                //$('input[name=input_url]').val(parent.ApiHelper.splicing_url(jsonData['data']['url']));
            }
        },
        error: function () {
            parent.layer.msg('服务器或网络异常');
        }

    });
}