$(function() {
    const form = layui.form;
    const layer = layui.layer;

    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return "用户名长度在1-6位之间"
            }
        }
    });
    initUserInfo();
    //初始化用户信息
    function initUserInfo() {
        // console.log(1111);
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("获取用户信息失败！");
                }
                //调用form.val()快速为表单赋值 
                // console.log(res);
                form.val('formUserInfo', res.data);
            }
        });
    }


    //重置表单的数据
    $("#btnReset").on("click", function(e) {
        // console.log(11);
        //阻止默认的表单提交行为
        e.preventDefault();
        //调用函数重新渲染表单
        initUserInfo();
    });


    //更新表单提交事件
    $(".layui-form").on("submit", function(e) {
        //阻止表单默认提交事件
        e.preventDefault();
        //发起ajax请求
        $.ajax({
            method: "POST",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: (res) => {
                if (res.status !== 0) {
                    return layer.msg("更新用户信息失败！")
                }
                layer.msg("更新用户信息成功！");

                //子页面调用父页面的方法
                console.log(11);
                window.parent.getUserInfo();
            }
        })
    })
});