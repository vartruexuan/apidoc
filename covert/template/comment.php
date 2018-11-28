<?php
/**
 * 生成注释--注释测试
 * Created by PhpStorm.
 * User: 小昭昭
 * Date: 2018/11/11
 * Time: 18:11
 */
?>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>生成注释</title>
    <link rel="stylesheet" href="<?php echo API_COVERT_JS ?>/plug/layui-v2.3.0/layui/css/layui.css">
    <link rel="stylesheet" href="<?php echo API_COVERT_JS ?>/plug/json/jquery.json-viewer.css">

</head>
<body>
<div><!--  class="layui-container"  -->
    <!-- 注释协助功能 -->
    <div class="layui-tab layui-tab-brief" lay-filter="docDemoTabBrief">
        <ul class="layui-tab-title">
            <li class="layui-this">注释生成互转</li>
            <li>json数据格式化</li>

        </ul>
        <div class="layui-tab-content">
            <!-- 注释生成互转 -->
            <div class="layui-tab-item layui-show">
                <div class="layui-row">
                    <div class="layui-col-xs7 layui-col-sm7 layui-col-md7 layui-layer-border"
                         style="padding: 10px;height: 520px;overflow-y: auto">
                        <!-- 注释属性填写 -->
                        <form class="layui-form layui-form-pane form-comment" action="">
                            <div class="layui-form-item">
                                <div class="layui-inline">
                                    <label class="layui-form-label">接口名</label>
                                    <div class="layui-input-inline">
                                        <input type="text" name="title" required lay-verify="required"
                                               placeholder="请输入标题" autocomplete="off" class="layui-input">
                                    </div>
                                </div>
                                <div class="layui-inline">
                                    <label class="layui-form-label">请求方式</label>
                                    <div class="layui-input-inline">
                                        <select name="method">
                                            <option value="get">get</option>
                                            <option value="post" selected="">post</option>
                                            <option value="put">put</option>
                                            <option value="delete">delete</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <label class="layui-form-label">url</label>
                                <div class="layui-input-block">
                                    <input type="text" name="url" required lay-verify="required"
                                           placeholder="接口地址" autocomplete="off" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <label class="layui-form-label">接口描述</label>
                                <div class="layui-input-block">
                                    <input type="text" name="description" required lay-verify="required"
                                           placeholder="描述下这个接口吧" autocomplete="off" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-form-item ">
                                <label class="layui-form-label">标签</label>
                                <div class="layui-input-block">
                                    <input type="text" name="tags" required lay-verify="required"
                                           placeholder="多个空格分隔" autocomplete="off" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <fieldset class="layui-elem-field">
                                    <legend>请求参数 <i class="layui-icon btn-add-params"
                                                    style="color:#0f7faa;cursor: pointer;font-size: 24px;"
                                                    title="添加参数">&#xe61f;</i></legend>
                                    <div class="layui-field-box api-params">
                                        <table class="layui-table table-params" lay-size="sm">
                                            <colgroup>

                                            </colgroup>
                                            <thead>
                                            <tr>
                                                <th>名称</th>
                                                <th>类型</th>
                                                <th>位置</th>
                                                <th>默认值</th>
                                                <th>说明</th>
                                                <th>是否必填</th>
                                                <th>空是否发送</th>
                                                <th width="44">操作</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <!--<tr>
                                                <td>
                                                    <input type="text" value="name" class="layui-input">
                                                </td>
                                                <td>
                                                    <select name="type">
                                                        <option value="string">string</option>
                                                        <option value="number">number</option>
                                                        <option value="integer">integer</option>
                                                        <option value="boolean">boolean</option>
                                                        <option value="array">array</option>
                                                        <option value="file">file</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <select name="in" lay-filter="params_type">
                                                        <option value="query">query</option>
                                                        <option value="header">header</option>
                                                        <option value="path">path</option>
                                                        <option value="formData">formData</option>
                                                        <option value="body">body</option>
                                                    </select></td>
                                                <td>
                                                    <input type="text" value="default" class="layui-input">
                                                </td>
                                                <td>
                                                    <input type="text" value="name" class="layui-input">

                                                </td>
                                                <td>
                                                    <select name="required" lay-filter="required">
                                                        <option value="false">否</option>
                                                        <option value="true">是</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <select name="allowEmptyValue" lay-filter="allowEmptyValue">
                                                        <option value="false">否</option>
                                                        <option value="true">是</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <div class="layui-btn-group">
                                                        <button type="button"
                                                                class="layui-btn layui-btn-primary layui-btn-sm del-params">
                                                            <i class="layui-icon">&#xe640;</i>
                                                        </button>
                                                    </div>

                                                </td>
                                            </tr>-->
                                            </tbody>
                                        </table>

                                    </div>
                                </fieldset>

                            </div>
                            <div class="layui-form-item">
                                <fieldset class="layui-elem-field">
                                    <legend>响应数据 <i class="layui-icon btn-add-responses"
                                                    style="color:#0f7faa;cursor: pointer;font-size: 24px;" title="添加响应">&#xe61f;</i>
                                    </legend>
                                    <div class="layui-field-box api-params">
                                        <table class="layui-table table-responses" lay-size="sm">
                                            <colgroup>

                                            </colgroup>
                                            <thead>
                                            <tr>
                                                <th>状态</th>
                                                <th>类型</th>
                                                <th>结果</th>
                                                <th width="44">操作</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <!--<tr>
                                                <td>
                                                    <input type="text" name="status" class="layui-input" value="" placeholder="例如:200">
                                                </td>
                                                <td>
                                                    <select name="data_type" id="">
                                                        <option value="application/json">application/json</option>
                                                        <option value="application/xml">application/xml</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <textarea name="examples" class="layui-textarea layui-bg-black" cols="40" style="height: 30px;"></textarea>
                                                </td>
                                                <td>
                                                    <button type="button" class="layui-btn layui-btn-primary layui-btn-sm del-params" style="color: red;">
                                                        <i class="layui-icon">&#xe640;</i>
                                                    </button>
                                                </td>
                                            </tr>-->
                                            </tbody>
                                        </table>

                                    </div>
                                </fieldset>

                            </div>

                        </form>
                    </div>
                    <div class="layui-col-xs1 layui-col-sm1 layui-col-md1 ">

                        <ul style="padding: 18px;">
                            <li>
                                <!-- 生成注释 -->
                                <button class="layui-btn btn-covert-comment" title="生成注释">
                                    <i class="layui-icon">&#xe65b;</i>
                                </button>
                            </li>
                            <li style="margin-top: 10px;">
                                <!-- 逆向注释 -->
                                <button class="layui-btn btn-reverse-comment" title="注释逆向">
                                    <i class="layui-icon">&#xe65a;</i>
                                </button>
                            </li>
                        </ul>

                    </div>
                    <div class="layui-col-xs4 layui-col-sm4 layui-col-md4 layui-layer-border" style="height: 520px;">
                        <form class="layui-form layui-form-pane" action="">
                            <div class="comment-type">
                                <input type="radio" name="comment-type" title="语法1">
                                <input type="radio" name="comment-type" title="语法2">
                            </div>
                            <!-- 注释结果 -->
                            <textarea name="comment-result" placeholder="注释" class="layui-textarea layui-bg-black"
                                      style="color:green;height:100%;overflow-y: auto;"></textarea>

                        </form>
                    </div>
                </div>
            </div>
            <div class="layui-tab-item">
                <div class="layui-btn-group">
                    <button class="layui-btn" id="btn-format-json">格式化</button>
                </div>
                <div class="layui-row">
                    <div class="layui-col-xs6 layui-col-sm6 layui-col-md6">
                        <textarea name="" id="text-json" class="layui-textarea layui-bg-black"
                                  style="height: 400px;"  placeholder="请放入json数据"></textarea>
                    </div>
                    <div class="layui-col-xs6 layui-col-sm6 layui-col-md6" style="height: 400px; overflow-y: auto;">
                        <!-- json视图 -->
                        <pre id="view-json">

                        </pre>
                    </div>
                </div>

            </div>
        </div>
    </div>

</div>
</body>

<!--  模板列表  -->
<div class="templates layui-hide">

</div>

<!-- js 文件-->
<script src="<?php echo API_COVERT_JS ?>/plug/jquery.js"></script>
<script src="<?php echo API_COVERT_JS ?>/plug/layui-v2.3.0/layui/layui.js"></script>
<script src="<?php echo API_COVERT_JS ?>/plug/json/jquery.json-viewer.js"></script>
<script src="<?php echo API_COVERT_JS ?>/plug/json/jquery.json-editor.min.js"></script>
<script src="<?php echo API_COVERT_JS ?>/plug/json.format.js"></script>
<script src="<?php echo API_COVERT_JS ?>/comment.js"></script>
</html>