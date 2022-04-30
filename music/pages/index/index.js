import request from '../../utils/request.js'
// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [],//轮播图数组
    recommendList: [],//推荐歌单
    topList: [],//排行榜
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let bannerListData = await request('/banner', { type: 2 });
    this.setData({
      bannerList: bannerListData.banners
    })

    //获取推荐歌单数据
    let recommendListData = await request('/personalized', { limit: 10 })
    this.setData({
      recommendList: recommendListData.result
    })

    //获取排行榜数据
    // idx范围是0-20，我们需要0-4，发送五次请求
    let index = 0;
    let resultArr = [];
    while (index < 5) {
      let topListData = await request('/top/list', { idx: index++ });
      //splice(会修改原数组)   slice不会修改原数组
      let topListItem = { name: topListData.playlist.name, tracks: topListData.playlist.tracks.slice(0, 3) };
      resultArr.push(topListItem);
      this.setData({
        topList: resultArr
      })
    }
    //更新topList的状态值
    // this.setData({
    //   topList: resultArr
    // })
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