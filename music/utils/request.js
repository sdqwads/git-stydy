//import { resolve } from "path"
import config from "./config";
export default (url, data = {}, method = 'GET') => {
    return new Promise((resolve, reject) => {
        //1.new Promise初始化promise实例状态为pending
        //

        wx.request({
            url: config.host + url,
            data,
            method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
                cookie: wx.getStorageSync('cookies')?wx.getStorageSync('cookies').find(item => item.indexOf('MUSIC_U') !== -1):''
            }, // 设置请求的 header
            success: (res) => {
                // console.log('请求成功：', res);
                if (data.isLogin) {//登录请求
                    //将用户的cookie存入本地
                    wx.setStorage({
                        key: 'cookies',
                        data: res.cookies
                    })
                }
                resolve(res.data);
                // success
            },
            fail: (err) => {
                // console.log('请求失败:', err);
                reject(err);
                // fail
            }
        })
    })
}
