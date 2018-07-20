//******* 核心帮助对象(模块化) ********
var DistHelper = {
    //展示地址
    dist_url: "",
    //模块地址(json)
    module_url: "",
    //生成文档地址
    covert_url: "",
    http_protocol: "http:",//协议
    query_params: [],
    init: function () {
        // 获取相对地址
        var urls = this.get_relative_url().split('/');
        for (var i = 0; i < urls.length; i++) {
            if (urls[i] == "" || typeof(urls[i]) == "undefined") {
                urls.splice(i, 1);
                i--;
            }
        }
        //获取对应参数
        this.query_params = this.getQueryString();
        // 拼接地址
        var host = window.location.host;
        this.http_protocol = window.location.protocol;
        //初始化地址()
        this.dist_url = this.http_protocol + '//' + host + '/' + [urls[0], urls[1]].join('/');
        var module_json_name = this.query_params['num'];
        this.module_url = this.dist_url + "/json/module/" + module_json_name + ".json";
        this.covert_url = this.http_protocol + '//' + host + '/' + [urls[0], "covert"].join("/");


        var index = layer.open({
            type: 1,
            closeBtn: false,
            title: '<a href="#" class="link"><img height="30" width="30" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAkCAMAAADfNcjQAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAxBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QTAzM0MwQzA4NUQ5MTFFOEExN0I5MzlGRjREQzE3QzMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QTAzM0MwQkY4NUQ5MTFFOEExN0I5MzlGRjREQzE3QzMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiBXaW5kb3dzIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9IkU0NjkyMDI1RjE1MTJBNDhFMjk4RjkzODE5QzUwMzIwIiBzdFJlZjpkb2N1bWVudElEPSJFNDY5MjAyNUYxNTEyQTQ4RTI5OEY5MzgxOUM1MDMyMCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PqAerqcAAAMAUExURb2+vvLOOCUiIsnJySIMDkZFQwcHB4yLi+PGS6qXSNTEf/rrsfXWSvLy8ra2tvfZVmdcRYODg/HPQuvGRei6RdmpPP3rpZJ5Qu3NQ+m5PXh4eNzAT2hlXOK8QNHR0eLi4puamf79+f788vLRQhwaG5aFOPz11fTZfejo6LO1rO7u7oV2Qt3d3S4tLFtbXHV1dVRUU5GRkTo8RG1udPTSQ8bGxtu9PvX19Y9LURQTE+rMS7Gxsci6dW1tbGgVGebm5v/dQ9q1RvTURz09PFlQNvr6+msjJvfsvH19ffHu7XxuRP3bRaKCPfjdZzo5NpWRgsHCwmhZOu/PPenLR+vKPe/PRNvb29TU1Kamp/jnmyUnNa6urjcyMXoYHff39zY2NcywPaOjozExN/fmm/rXQujOYkEOECgnJzg3NhEQERERGv7+/vz8/P39/fTTQfj4+JSUlPPTR9u+SOvERd/e3Q8OD+fReVVRQ+zs8auGiA0MDLiys7y1mt6uQfjoqNbZ3tXHivbUROi+SNza2Pb29BgYGJmVhsC1g6+NP/by14yNkHN0d4V4PKiFhv7//////uTXjK6tpPHnv/b3+fntvV0gIfvvxefHRJ+Yf/jz2efIRvn37ufKTPPz86Sik7eujn+Aibq7ju/ASO3gqIOOao6Lf42ae9XTyHRpO/v7+/rnoOPYoc21X+7MQ+zq6ItgYuvs7B8eHs/DcTMuIfjjkPzrnFlUU+S0Rnp7e8vL0cfJrei3RLKWmN/OwZ+ck9vd3bS0tMWie9zMfoA7Pw0RERwTFBUYFyAgIfLRPUZHTxcVFlBLTJOQjp+aiNW5RzMuHd3AR8K9ns/MyczMzPfdg39zSmJWKsitRKaMPf/meeXMb/3//6CdkfTy67CIivz57IRtPbqeM5RbXqSko9/FUpOSlTEwL3FwcPvaQ9/BPrGoeL2yfYJwPezr5o59P/vxzaWEhq2Ki7+bnmVmbZCPjGpqaOrDPzIyM3d5fu3Xf+m/OP7cSunHOwAAAP////////ojcmwAAAEAdFJOU////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wBT9wclAAAC6UlEQVR42mL4jwQU1dzdZyr+RwEMSNLcPCEvzcykFytiV6C0xVd5+oWiogtmT+5jU6BYx+0rNIuDg+Pc9QQOJUwF/6ZM4+YXsprj+KZcRsaL6x+GAqW696v4lYMdA0927buzQOYuhgI1MbGbvxu/+Zx8WsN1qH3HAQwF3LfWcL676uXSPfH1pgmr/fVzQYLZDP9ACjbkANln/ZKiooyMvrNrLllWv/PL13yQAmtmsAl89kB2m8uKHlXOG4HGmgt3Lb84z7gFKGZvCLFCB6jufzLPCwfvlF8dRjvm29i8+jED6I0cqZUQBeYRQDrSySQvT0hW9IHR56X+xgJlQCGFMKgjcwuAypMLQQqaakV9AgUExGvV//9ntv0H84V1DkxBcdNukd3bRRZJ/vyvZeBhDlMQHv7//1YeoALltcLCwsVA8OtKrpQUqylMgQKQaAj2dnjRKBQKBmsZUzcIbrRMhCrIif8qz3t88zXVBIkUxhMmQSFBjIwP9UpsVXSgCrJZvzvrnMrMylI5r/0z1epPkFXZpLce2fp6cEdK/Q3QqPrLVnqqNKkie3bnwb3//gUYROs2w+PiQGtu3F8gqFJJb145+bbFp+y5O/6eep4NVyDH7noZqqDkX/+/R3v+5Xh8t89GxKZpZnoVG1hBzLp///5ZfPj3jz09Gym641gNCsAKTm3LBio43Pvvn+FfXuT0kPtfCyjPlnlKASgf5/bx37+Cv3yoCSYcrIDVE6hgrlslSEF6DoqCaKCC0phLQPl/nnb3/v17/Pfvjn/ICgSB8hvPyOuU6OyvtlvPEGEqp3cq8R+KglLLqtbjlpatx4/apR35G/b/X3Y2soJ8Zj0V3XSm4xs3bmSKncqmh5kv/s/VZfLzy8iIz4iJTUufiy1v8hqUMqWnMzFtZDltjj13/7NmK31mkN56TAtH9v+f7WwZ8f8L00Z5XAr+GVgy/7dnz2Dj+4ddwcpSKRCVI8+Qg8ME5vz/GAAgwAC+bi2BfSJ4jAAAAABJRU5ErkJggg==" alt="Swagger UI"><span>apidoc</span></a>',
            shade: false,
            offset: 'lt',
           // resize: false,
            id: "api_main",
            btn: ['显示模块列表'],
            btn1: function (index, layero) {

            },
            maxmin: true,
            // skin: 'layer-self', //加上边框
            area: ['80%', '98%'], //宽高
            content: '<div id="apidoc-ui2"></div>'
        });
        //绑定模块点击事件
        this.module_bind_click();
        return this;
    },
    /**
     * 获取模块列表
     * @returns {DistHelper}
     */
    get_module: function () {
        //获取接口模块json 并解析
        self = this;
        $.ajax({
            url: this.module_url,
            type: 'get',
            dataType: "json",
            beforeSend: function (xmlHttp) {
                xmlHttp.setRequestHeader("If-Modified-Since", "0");
                xmlHttp.setRequestHeader("Cache-Control", "no-cache");
            },
            success: function (jsonData) {
                if (!jsonData) {
                    this.show_error('未发现对应的模块数据:(' + xr.status + ')' + '<a href="#" onclick="window.location.reload()">刷新</a>')
                }
                //拼接模板 并展示
                var html = "";
                html += "<div class='module' style='overflow-y: auto;padding:4px;background: #F2EEE6;min-height:140px;'>";
                for (var i in jsonData) {
                    html += "<div class='module-div' style='border-radius: 5px;text-align: center;border: 1px solid black;background: #89bf04;color:white;margin-bottom: 4px;cursor: pointer' data-json-name='" + $.md5(jsonData[i]['title']) + "' >" + jsonData[i]['title'] + "</div>";
                }
                html += "</div>";
                //layer.closeAll();
                layer.open({
                    type: 1,
                    closeBtn: false,
                    title: '模块列表选择',
                    shade: false,
                    id:"api_module_list",
                    offset: 'rb',
                    maxmin: true,
                    //  skin: 'layer-self', //加上边框
                    area: ['14%', '240px'], //宽高
                    content: html
                });
                $('div.module-div:eq(0)').trigger('click');
            },
            error: function (xr) {
                self.show_error('未发现对应的模块数据:(' + xr.status + ')' + '<a href="#" onclick="window.location.reload()">刷新</a>')
            }
        });

        return this;
    },
    /**
     *  显示错误信息
     * @param message
     * @returns {DistHelper}
     */
    show_error: function (message) {
        $('.apidoc-message').css('padding', '20px').html(message);
        return this;
    },
    /**
     * 模块绑定事件(点击展示对应模块接口)
     * @returns {DistHelper}
     */
    module_bind_click: function () {

        var self = this;
        //模块列表点击事件
        $("body").delegate("div.module-div", 'click', function () {
            var json_name = $(this).attr('data-json-name');
            //拼接json地址
            var url = self.dist_url + "/json/" + json_name + ".json";
            $("div.module-div").css('background', '#89bf04').css('fontSize','16px');
            $(this).css('background', '#2aabd2').css('fontSize','22px');
            // 生成接口文档列表
            window.ui = SwaggerUIBundle({
                url: url,
                validatorUrl: false,
                dom_id: '#apidoc-ui2',// '#apidoc-ui',
                deepLinking: true,
                presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIStandalonePreset
                ],
                plugins: [
                    SwaggerUIBundle.plugins.DownloadUrl
                ],
                layout: "StandaloneLayout"
            })
            //触发窗体resize事件 以兼容内部内容大小
            $('#api_main').trigger('resize');
            //隐藏地址
            // $('.download-url-wrapper').css('display', 'none');
            $('#apidoc-ui2 .topbar:eq(0)').css('display', 'none');
            //$(".opblock-tag-section").trigger('click')
        });
        return this;

    },
    /**
     *  获取相对地址(http://xxx.com(此处地址)?a=1)
     * @returns {string|*}
     */
    get_relative_url: function () {
        var url = document.location.toString();
        var arrUrl = url.split("//");
        var start = arrUrl[1].indexOf("/");
        var relUrl = arrUrl[1].substring(start);//stop省略，截取从start开始到结尾的所有字符
        if (relUrl.indexOf("?") != -1) {
            relUrl = relUrl.split("?")[0];
        }
        return relUrl;
    },
    /**
     * 获取url中的参数
     * @returns {{}}
     */
    getQueryString: function () {
        var qs = location.search.substr(1), // 获取url中"?"符后的字串
            args = {}, // 保存参数数据的对象
            items = qs.length ? qs.split("&") : [], // 取得每一个参数项,
            item = null,
            len = items.length;

        for (var i = 0; i < len; i++) {
            item = items[i].split("=");
            var name = decodeURIComponent(item[0]),
                value = decodeURIComponent(item[1]);
            if (name) {
                args[name] = value;
            }
        }
        return args;
    }
}
//初始化对象
window.DistHelper = DistHelper.init();