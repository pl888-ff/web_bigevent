$(function() {
    const layer = layui.layer;
    const form = layui.form;
    var laypage = layui.laypage
        //定义一个查询的参数对象，将来请求数据的时候需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }
    initTable();
    initCate();

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    //定义一个函数用来渲染列表数据
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: res => {
                if (res.status !== 0) {
                    return layer.msg("获取文章列表成功！")
                }
                // console.log(res);/
                const htmlstr = template("tpl_table", res);
                $("tbody").html(htmlstr);
                // 调用渲染分页的方法
                renderPage(res.total)
            }
        });
    }

    //初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: res => {
                if (res.status !== 0) {
                    return layer.msg("获取文章分类列表失败！")
                }
                console.log(res);
                const htmlstr = template("tpl_table", res);
                $("[name=cate_id]").html(htmlstr);
                form.render();
                // layer.msg("获取文章分类列表成功！");
            }
        })
    }

    // 为筛选表单绑定 submit 事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault()
            // 获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
            // 为查询参数对象 q 中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
            // 根据最新的筛选条件，重新渲染表格的数据
        initTable()
    });


    // 定义渲染分页的方法
    function renderPage(total, first) {
        // console.log(total);
        laypage.render({
            elem: 'test1', // 分页容器的 Id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            jump: (obj) => {
                q.pagenum = obj.curr
                    // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
                q.pagesize = obj.limit
                    // initTable()
                if (!first) {
                    initTable();
                }
            }
        })
    }

    //通过代理的形式，为删除按钮绑定点击事件处理函数
    $("tbody").on("click", ".btn-delete", function() {
        // 获取到文章的 id
        var id = $(this).attr('data-id');
        // 询问用户是否要删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {

            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1

                    }
                    initTable();

                }
            })
            layer.close(index)
        })
    })


})