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
        $('input[name=input_url]').val('');
        $(this).toggleClass('active');
        //让对应的链接选中
        $('.urls-list a').removeClass('active');
        $('.urls-list a').each(function () {
            var modules_names = [];
            $(this).find('.module_names >.module-item').each(function () {
                modules_names.push($(this).text().trim());
            });
            var modules_names2 = [];
            $('.module-list a.active').each(function () {
                modules_names2.push($(this).find('.module_name:eq(0)').text())
            })

            //求选中的模块和链接中模块的交集(如果交集与数组长度一致,说明找到了对应的链接)
            var array_int = parent.ApiHelper.array_intersect(modules_names, modules_names2);
            if (array_int && array_int.length == modules_names.length && modules_names.length == modules_names2.length) {

                $(this).trigger('click');
                //选中 并让滚动条移动到该位置
                console.log($(this).index() + '|' + $(this).height())
                $(this).parent().scrollTop($(this).index() * $(this).height())
            }
        });


    });
    //链接列表点击切换样式，并让对应的模块选中
    $('.urls-list').delegate('a', 'click', function () {
        $('.urls-list a,.module-list a').removeClass('active');
        $('input[name=input_url]').val('');
        //让对应的模块选中
        $(this).find('.module_names >.module-item').each(function () {

            var module_name = $(this).text().trim();
            var is_active = false;
            $('.module-list a').each(function () {
                if ($(this).find('.module_name:eq(0)').text() == module_name) {
                    $(this).addClass('active');
                    is_active = true;
                    return;
                }
            })
            if (!is_active) {

                parent.ApiHelper.blink($(this).addClass('label label-danger'));
            }

        });
        $(this).addClass('active');
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
        var self = this;
        parent.layer.confirm('你确定要删除该链接？', {
            btn: ['确定', '取消'] //按钮
        }, function (index) {
            parent.layer.close(index);
            //获取对应data-url
            var url = $(self).parent('a').data('url');
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
        url: parent.post_del_url,
        type: "post",
        dataType: "json",
        data: {
            type: 3,
            num: num
        },
        success: function (jsonData) {

            if (jsonData.status == 0) {
                //成功移除对应的链接
                $('.urls-list a[data-url=' + num + ']').remove();
            } else {
                parent.layer.msg('删除失败:' + jsonData['message'], {icon: 2});
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
        url: parent.post_bulid_url,
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
                    var a_html = '<a href="#" class="list-group-item" data-url="' + url + '">';
                    a_html += '<span class="btn url-del" style="background: white; color: black" title="删除链接">';
                    a_html += '<span class="glyphicon glyphicon-trash"style="color:red;"></span>';
                    a_html += '</span> ';
                    a_html += '<span class="module_names">';
                    for (var j in m) {
                        a_html += '<span class="module-item label label-primary">' + m[j] + '</span> '
                    }
                    a_html += '</span>'
                    a_html += '</a>';
                    a = $(a_html);
                    console.log(a);
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