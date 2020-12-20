$.ajaxPrefilter(function(option) {
    option.url = "http://ajax.frontend.itheima.net" + option.url;
    //统一为headrr设置
    if (option.url.indexOf("/my/") !== -1) {
        option.headers = {
            //从本地存储那token请求字段
            Authorization: localStorage.getItem('token') || ''
        }
    }
    //全谈统一挂载complate  函数
    option.complete = function(res) {
        // console.log('执行了 complete 回调：')
        // console.log(res)
        // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 1. 强制清空 token
            localStorage.removeItem('token')
                // 2. 强制跳转到登录页面
            location.href = '/login.html'
        }
    }
})