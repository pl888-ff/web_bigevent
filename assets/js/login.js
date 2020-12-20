$(function() {
    //注册按钮
    $("#link_reg").on("click", function() {
        // $(".login-box").hide().siblings(".reg-box").children("#link_login").show();
        $(".login-box").hide();
        $(".reg-box").show().children("#link_login").show()
    });
    //登录按钮
    $("#link_login").on("click", function() {
        $(".login-box").show();
        $(".reg-box").hide().children("#link_login").hide()
    });

    //定义密码校验规则
    //从layui中获取form对象
    const form = layui.form;
    //从layui中获取layer对象
    const layer = layui.layer;
    //通过form.verify()函数定义校验规则
    form.verify({
        pass: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        repass: function(value) {
            //先拿到密码框的value
            const repass = $(".reg-box [name=password]").val();
            //比较
            if (repass !== value) {
                return "两次密码不一致"
            }
        }
    });

    //写监听表单提交事件事件
    $("#form_reg").on("submit", function(e) {
        //阻止表单的默认提交行为
        e.preventDefault();
        //发ajax请求
        $.post("/api/reguser", { username: $("#form_reg [name=username]").val(), password: $("#form_reg [name=password]").val() },
            function(res) {
                if (res.status !== 0) {

                    return layer.msg(res.message)
                }
                layer.msg("注册成功，请登录！")
                    // console.log("注册成功");

                //注册成功实现点击跳转登录
                $("#link_login").click();
            });

    });


    //写登录表单提交事件
    // 监听登录表单的提交事件
    $('#form_login').submit(function(e) {
        // 阻止默认提交行为
        e.preventDefault()
        $.ajax({
            url: '/api/login',
            method: 'POST',
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败！')
                }
                layer.msg('登录成功！')
                    // 将登录成功得到的 token 字符串，保存到 localStorage 中
                localStorage.setItem('token', res.token)
                    // 跳转到后台主页
                location.href = '/index.html'
            }
        })
    })
})