$(function() {
    initArtCateList();
    const layer = layui.layer;
    var form = layui.form

    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: res => {
                // console.log(res);
                const htmlstr = template('tpl-table', res);
                $("tbody").html(htmlstr);
            }
        })
    }
    var btnADD;
    //为添加按钮添加点击事件
    $("#btnAddCat").on("click", function() {
        btnADD = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $("#diaolog-add").html()
        })
    });


    //表单提交事件需要用到事件代理
    $("body").on("submit", "#form-add", function(e) {
        //阻止m默认行为
        e.preventDefault();
        console.log("ok");
        //发请求
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: res => {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg("新增文章分类失败！")
                }
                initArtCateList();
                layer.msg("新增文章分类成功！");
                layer.close(btnADD);
            }
        });
    });

    // 通过代理的形式，为 btn-edit 按钮绑定点击事件
    var indexEdit = null;
    $("tbody").on("click", ".btn-edit", function() {
        // 弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            area: ["500px", "250px"],
            title: "修改文章分类",
            content: $("#dialog-edit").html(),
        });

        var id = $(this).attr("data-id");
        // 发起请求获取对应分类的数据
        $.ajax({
            method: "GET",
            url: "/my/article/cates/" + id,
            success: res => {
                form.val("form-edit", res.data);
            },
        });
    });

    //通过代理的形式为文章实现提交表单的行为
    $("body").on("submit", '#form-edit', function(e) {
        e.preventDefault();
        // console.log(11);
        //发请求
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: res => {
                if (res.status !== 0) {
                    return layer.msg("更新分类信息失败！")
                }
                layer.msg("更新分类信息成功！");
                //关闭弹出层
                layer.close(indexEdit);
                //更新表格数据
                initArtCateList();
            }
        })
    });

    //通过代理的形式为删除按钮绑定点击事件
    $("tbody").on("click", ".btn-delete", function(e) {
        //先获取id
        const id = $(this).attr("data-id");
        //弹出提示框
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //发请求
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: res => {
                    if (res.status !== 0) {
                        return layer.msg("删除文章分类失败！")
                    }
                    layer.msg("删除文章分类成功！");
                    layer.close(index);
                    initArtCateList();
                }
            });
        });
    })

})