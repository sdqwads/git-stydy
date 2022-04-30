// pages/login/login.js
// 登录流程
// 收集表单数据
// 前端验证    验证用户信息（账号密码 ）是否合法   前端验证不通过提示用户不需要发请求，后端验证通过了打请求给服务器
// 后端验证    验证用户是否存在  用户存在直接返回告诉前端  用户存在验证密码是否正确 密码不正确返回前段提示 密码正确返回给前端数据，提示用户登录成功
// import { url } from 'inspector';
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    password: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  //表单项内容发生改变的回调
  handleInput(event) {
    // let type = event.currentTarget.id;//id传值 取值：phone//password
    let type = event.currentTarget.dataset.type;//data-type 传值
    this.setData({
      [type]: event.detail.value
    })
  },

  //登录回调
  //手机表单
  async login() {
    let { phone, password } = this.data;
    //前端验证
    //手机号验证
    //1验证内容为空   2手机号格式不正确  3手机号格式正确
    if (!phone) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none'
      })
      return;
    }

    let phoneReg = /^1(3|4|5|6|7|8|9|0)\d{9}$/;
    if (!phoneReg.test(phone)) {
      wx.showToast({
        title: '手机号格式错误',
        icon: 'none'
      })
      return;
    }
    if (!password) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none'
      })
      return;
    }
    //后端验证
    let result = await request('/login/cellphone', { phone, password,isLogin:true })
    if (result.code === 200) {
      wx.showToast({
        title: '登录成功',
      })

      //将用户的信息储存至本地
      wx.setStorageSync('userInfo',JSON.stringify(result.profile))
      
      //跳转至个人中心personal页面
      wx.reLaunch({
          url:'/pages/personal/personal'
      })
    } else if (result.code === 400) {
      wx.showToast({
        title: '手机号错误',
        icon: 'none'
      })
    }else if (result.code === 502) {
      wx.showToast({
        title: '密码错误',
        icon: 'none'
      })
    }else  {
      wx.showToast({
        title: '登录失败,请重新登录',
        icon: 'none'
      })
    }
    // wx.showToast({
    //   title: '前端验证通过',
    //   icon: 'none'
    // })
    // return;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})