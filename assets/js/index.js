$(function() {
    getUserInfo();
    //得到layer
    const layer = layui.layer;
    //实现退出功能
    $("#btnLogout").on("click", function() {
        //先使用layui弹出提示框
        layer.confirm('退出登录?', { icon: 3, title: '提示' }, function(index) {
            //do something
            //先清除本地存储
            localStorage.removeItem("token");
            //跳转到登录页面
            location.href = '/login.html';

            layer.close(index);
        });
    });
})

//封装一个函数用来获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        //响应头
        // headers: {
        //     //从本地存储那token请求字段
        //     Authorization: localStorage.getItem('token') || ''
        // },
        //success回调函数
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg("获取用户信息失败！")
            }
            // console.log(res);
            //封装一个函数用来渲染用户头像文字
            renderAvatar(res.data);
        },

    })
}

//渲染用户头像的函数
// 渲染用户的头像
function renderAvatar(user) {
    // 1. 获取用户的名称
    var name = user.nickname || user.username
        // 2. 设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
        // 3. 按需渲染用户的头像
    if (user.user_pic !== null) {
        // 3.1 渲染图片头像
        $('.layui-nav-img')
            .attr('src', user.user_pic)
            .show()
        $('.text-avatar').hide()
    } else {
        // 3.2 渲染文本头像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar')
            .html(first)
            .show()
    }
}