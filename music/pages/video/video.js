// pages/video/video.js
import request from "../../utils/request";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [],//推荐的数据
    navId: '',//导航的标识
    videoList: [],//视频列表数据
    videoId: [],//视频id标识
    videoUpdateTime: [],//记录video播放时长
    isTriggered: false,//表示下拉刷新是否被触发
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getVideoGroupListData();
  },

  //获取导航数据
  async getVideoGroupListData() {
    let videoGroupListData = await request('/video/group/list');
    this.setData({
      videoGroupList: videoGroupListData.data.slice(0, 14),
      navId: videoGroupListData.data[0].id
    })
    this.getVideoList(this.data.navId);

  },
  //获取视频列表数据
  async getVideoList(navId) {
    if (!navId) { return; }
    let videoListData = await request('/video/group', { id: navId });
    //关闭消息提示框
    wx.hideLoading();

    let index = 0;
    let videoList = videoListData.datas.map(item => {
      item.id = index++;
      return item;
    })


    this.setData({
      videoList,
      isTriggered: false //关闭下拉树新
    })
  },

  //点击切换导航的回调
  changeNav(event) {
    let navId = event.currentTarget.id;// 通过id向event传参的时候如果传的是number会自动转换为string
    this.setData({
      navId,
      videopList: [],
    })
    //显示正在加载
    wx.showLoading({
      title: '正在加载'
    })
    //动态获取当前导航的视频数据
    this.getVideoList(this.data.navId);
  },

  //点击播放、继续播放的回调
  handlePlay(event) {
    // 关闭上一个视频播放下一个视频
    //重点，怎么找到上一个视频对象

    let vid = event.currentTarget.id;
    //关闭上一个的视频
    // this.vid !== vid && this.videoContext && this.videoContext.stop();
    // if (this.vid !== vid) {
    //   if (this.videoContext) {
    //     this.videoContext.stop()
    //   }
    // }
    this.vid = vid;
    //更新data中的videoId状态数据
    this.setData({
      videoId: vid
    })
    //创建控制video标签的实例对象
    this.videoContext = wx.createVideoContext(vid);
    //判断当前视频之前是否播放过
    let { videoUpdateTime } = this.data;
    let videoItem = videoUpdateTime.find(item => item.vid === vid);
    if (videoItem) {
      this.videoContext.seek(videoItem.currentTime);
    }
    // this.videoContext.play();
  },
  //监听视屏播放进度的回调
  handleTimeUpdate(event) {
    let videoTimeObj = { vid: event.currentTarget.id, currentTime: event.detail.currentTime };
    let { videoUpdateTime } = this.data;
    // 判断有没有播放记录，如果有修改记录，没有添加记录
    let videoItem = videoUpdateTime.find(item => item.vid === videoTimeObj.vid);
    if (videoItem) {//之前有
      videoItem.currentTime = event.detail.currentTime;
    } else {//之前没有
      videoUpdateTime.push(videoTimeObj);
    }
    //更新videoUpdateTime的状态
    this.setData({
      videoUpdateTime
    })
  },
  //视频播放结束回调
  handleEnded(event) {
    let { videoUpdateTime } = this.data;
    //移出记录播放的时长
    videoUpdateTime.splice(videoUpdateTime.findIndex(item => item.vid === event.currentTarget.id), 1);
    this.setData({
      videoUpdataTime
    })


  },
  //自定义下la刷新的回调
  handleRefresher() {
    //再次发请求获取最新的列表数据
    this.getVideoList(this.data.navId);
  },
  //页面相关事件处理函---监听用户下拉动作
  // onPullDownrefresh:function(){},
  //上拉触底
  // onReachBottom:function(){}
  //自定义上拉触底的回调 scroll-view
  handleToLower() {
    let newVideoList = [
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_C71119707717DAE53FF2A746EDE7FB64",
          "coverUrl": "https://p1.music.126.net/774PxRhJE1xCPlU7epmGeQ==/109951163572743245.jpg",
          "height": 720,
          "width": 1280,
          "title": "小哥架子鼓炫酷演奏《Don't Let Me Down》这节奏实在是太棒了！",
          "description": "国外小哥架子鼓炫酷演奏The Chainsmokers - Don't Let Me Down，这节奏实在是太棒了！",
          "commentCount": 132,
          "shareCount": 739,
          "resolutions": [
            {
              "resolution": 240,
              "size": 26157577
            },
            {
              "resolution": 480,
              "size": 37403662
            },
            {
              "resolution": 720,
              "size": 59820422
            }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 1000000,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/0fqTn4VpqjyX7iqUe41xhA==/109951166086321221.jpg",
            "accountStatus": 0,
            "gender": 0,
            "city": 1010000,
            "birthday": 883929600000,
            "userId": 347267113,
            "userType": 207,
            "nickname": "Dennnnnniel",
            "signature": ":(",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 109951166086321220,
            "backgroundImgId": 109951166285210370,
            "backgroundUrl": "http://p1.music.126.net/B_krR6XmlOPkkwAFIh51CA==/109951166285210360.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": [
              "电子",
              "欧美"
            ],
            "experts": {
              "1": "音乐视频达人",
              "2": "电子|欧美音乐资讯达人"
            },
            "djStatus": 10,
            "vipType": 11,
            "remarkName": null,
            "avatarImgIdStr": "109951166086321221",
            "backgroundImgIdStr": "109951166285210360"
          },
          "urlInfo": {
            "id": "C71119707717DAE53FF2A746EDE7FB64",
            "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/fwiRpLYB_70602177_shd.mp4?ts=1651327111&rid=435512358C46151BAB4686DD22C35FE9&rl=3&rs=pNUtTanPTAbGhAbSxJIVXhWPFtDwIDVe&sign=9494a36cfb4b0ec3bfadc2d375fca91b&ext=a%2FcPg%2BKMnoVJyqQHSJK4AC6n7oj8c1poooercmvYkaHfhz48M0p4f6k4ZQ6OwpGlnqaBBqHZxMpEF5MaBU%2BQjphgf3R9xZ4clhb9gSKqSIEQeCI8V0cWumxNTo3VaNW%2FHERX5Pyux9vGo5oW1AtzKyM%2F07tJYN6srUZPXfSEWmuQZRHewpaB1devfPnJuOJmWJTzDD7h%2F%2BfggdnUEyn9VeUzSHsK3mHHEElld28Zd%2B63C8jVoWqLosXC5ob%2FImUi",
            "size": 59820422,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 720
          },
          "videoGroup": [
            {
              "id": 4103,
              "name": "演奏",
              "alg": null
            },
            {
              "id": 9104,
              "name": "电子",
              "alg": null
            },
            {
              "id": 4104,
              "name": "电音",
              "alg": null
            },
            {
              "id": 5100,
              "name": "音乐",
              "alg": null
            },
            {
              "id": 14242,
              "name": "伤感",
              "alg": null
            },
            {
              "id": 13251,
              "name": "The Chainsmokers",
              "alg": null
            },
            {
              "id": 16131,
              "name": "英文",
              "alg": null
            },
            {
              "id": 23116,
              "name": "音乐推荐",
              "alg": null
            },
            {
              "id": 13213,
              "name": "架子鼓",
              "alg": null
            }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": null,
          "relateSong": [
            {
              "name": "Don't Let Me Down",
              "id": 402070862,
              "pst": 0,
              "t": 0,
              "ar": [
                {
                  "id": 893484,
                  "name": "The Chainsmokers",
                  "tns": [],
                  "alias": []
                },
                {
                  "id": 1081186,
                  "name": "Daya",
                  "tns": [],
                  "alias": []
                }
              ],
              "alia": [],
              "pop": 100,
              "st": 0,
              "rt": null,
              "fee": 8,
              "v": 39,
              "crbt": null,
              "cf": "",
              "al": {
                "id": 34477274,
                "name": "Don't Let Me Down",
                "picUrl": "http://p3.music.126.net/J_ah6CaUIuH6w1v8khrcHQ==/109951165973655958.jpg",
                "tns": [],
                "pic_str": "109951165973655958",
                "pic": 109951165973655950
              },
              "dt": 208373,
              "h": {
                "br": 320000,
                "fid": 0,
                "size": 8337284,
                "vd": -61012
              },
              "m": {
                "br": 192000,
                "fid": 0,
                "size": 5002387,
                "vd": -61012
              },
              "l": {
                "br": 128000,
                "fid": 0,
                "size": 3334939,
                "vd": -61012
              },
              "a": null,
              "cd": "1",
              "no": 1,
              "rtUrl": null,
              "ftype": 0,
              "rtUrls": [],
              "djId": 0,
              "copyright": 1,
              "s_id": 0,
              "mst": 9,
              "cp": 7001,
              "mv": 5323117,
              "rtype": 0,
              "rurl": null,
              "publishTime": 1454601600007,
              "privilege": {
                "id": 402070862,
                "fee": 8,
                "payed": 0,
                "st": 0,
                "pl": 128000,
                "dl": 0,
                "sp": 7,
                "cp": 1,
                "subp": 1,
                "cs": false,
                "maxbr": 999000,
                "fl": 128000,
                "toast": false,
                "flag": 4,
                "preSell": false
              }
            }
          ],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "C71119707717DAE53FF2A746EDE7FB64",
          "durationms": 221564,
          "playTime": 326711,
          "praisedCount": 2091,
          "praised": false,
          "subscribed": false
        }
      },
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_B8DC81AE094EF37F395B6B10A6C47002",
          "coverUrl": "https://p1.music.126.net/DWVno7chsnQ7mVH9Kt4MIQ==/109951164916286265.jpg",
          "height": 360,
          "width": 640,
          "title": "Home (feat. Niko Athanasatos) (Nurko Remix)",
          "description": "Shattered EP (The Remixes) OUT NOW via Ophelia Records on all streaming platforms!\n\nShattered EP (The Remixes)现已通过Ophelia Records在全平台上线！",
          "commentCount": 22,
          "shareCount": 6,
          "resolutions": [
            {
              "resolution": 240,
              "size": 1900310
            }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 310000,
            "authStatus": 1,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/xnCx4rXKZneSia30WWL_Xg==/109951165921432099.jpg",
            "accountStatus": 0,
            "gender": 1,
            "city": 310101,
            "birthday": -2209017600000,
            "userId": 1676243490,
            "userType": 2,
            "nickname": "MitiS_Music",
            "signature": "美国DJ/电音制作人，他用其独特的Melodic Dubstep与Chillstep使大家熟知。",
            "description": "美国DJ/电音制作人",
            "detailDescription": "美国DJ/电音制作人",
            "avatarImgId": 109951165921432100,
            "backgroundImgId": 109951164190507280,
            "backgroundUrl": "http://p1.music.126.net/ouShHBOFa0gsgU5_X49NGA==/109951164190507285.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": null,
            "djStatus": 0,
            "vipType": 0,
            "remarkName": null,
            "avatarImgIdStr": "109951165921432099",
            "backgroundImgIdStr": "109951164190507285"
          },
          "urlInfo": {
            "id": "B8DC81AE094EF37F395B6B10A6C47002",
            "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/3lHbWr21_2941518678_sd.mp4?ts=1651327111&rid=435512358C46151BAB4686DD22C35FE9&rl=3&rs=uQcIruQOvmZIAhqPhVXrmCTzODhxEJYg&sign=c45d4155b6581974a969d10b8e534ea9&ext=a%2FcPg%2BKMnoVJyqQHSJK4AC6n7oj8c1poooercmvYkaHfhz48M0p4f6k4ZQ6OwpGlnqaBBqHZxMpEF5MaBU%2BQjphgf3R9xZ4clhb9gSKqSIEQeCI8V0cWumxNTo3VaNW%2FHERX5Pyux9vGo5oW1AtzKyM%2F07tJYN6srUZPXfSEWmuQZRHewpaB1devfPnJuOJmWJTzDD7h%2F%2BfggdnUEyn9VeUzSHsK3mHHEElld28Zd%2B63C8jVoWqLosXC5ob%2FImUi",
            "size": 1900310,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 240
          },
          "videoGroup": [
            {
              "id": 9104,
              "name": "电子",
              "alg": null
            },
            {
              "id": 4104,
              "name": "电音",
              "alg": null
            },
            {
              "id": 5100,
              "name": "音乐",
              "alg": null
            },
            {
              "id": 14212,
              "name": "欧美音乐",
              "alg": null
            },
            {
              "id": 23116,
              "name": "音乐推荐",
              "alg": null
            }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": null,
          "relateSong": [
            {
              "name": "Home (feat. Niko Athanasatos) (Nurko Remix)",
              "id": 1429601884,
              "pst": 0,
              "t": 0,
              "ar": [
                {
                  "id": 40245,
                  "name": "MitiS",
                  "tns": [],
                  "alias": []
                },
                {
                  "id": 33424925,
                  "name": "Niko Athanasatos",
                  "tns": [],
                  "alias": []
                },
                {
                  "id": 11991089,
                  "name": "Nurko",
                  "tns": [],
                  "alias": []
                }
              ],
              "alia": [],
              "pop": 40,
              "st": 0,
              "rt": "",
              "fee": 8,
              "v": 6,
              "crbt": null,
              "cf": "",
              "al": {
                "id": 86367600,
                "name": "Shattered EP (Remixes)",
                "picUrl": "http://p3.music.126.net/nsdA7wU-AJJ9dyGHdUp8fQ==/109951164787303030.jpg",
                "tns": [],
                "pic_str": "109951164787303030",
                "pic": 109951164787303020
              },
              "dt": 234022,
              "h": {
                "br": 320000,
                "fid": 0,
                "size": 9363374,
                "vd": -72410
              },
              "m": {
                "br": 192000,
                "fid": 0,
                "size": 5618042,
                "vd": -69933
              },
              "l": {
                "br": 128000,
                "fid": 0,
                "size": 3745376,
                "vd": -68568
              },
              "a": null,
              "cd": "01",
              "no": 1,
              "rtUrl": null,
              "ftype": 0,
              "rtUrls": [],
              "djId": 0,
              "copyright": 1,
              "s_id": 0,
              "mst": 9,
              "cp": 743010,
              "mv": 0,
              "rtype": 0,
              "rurl": null,
              "publishTime": 1584028800000,
              "privilege": {
                "id": 1429601884,
                "fee": 8,
                "payed": 0,
                "st": 0,
                "pl": 128000,
                "dl": 0,
                "sp": 7,
                "cp": 1,
                "subp": 1,
                "cs": false,
                "maxbr": 320000,
                "fl": 128000,
                "toast": false,
                "flag": 5,
                "preSell": false
              }
            }
          ],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "B8DC81AE094EF37F395B6B10A6C47002",
          "durationms": 34087,
          "playTime": 9160,
          "praisedCount": 325,
          "praised": false,
          "subscribed": false
        }
      },
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_A24C8DF6283CD4356D86F92652989573",
          "coverUrl": "https://p1.music.126.net/ixCc5NdWsaMnXBhi0ZENpg==/109951165050596015.jpg",
          "height": 720,
          "width": 1694,
          "title": "2018 Destr0yer 作曲_削除(sakuzyo) 演唱_Nikki Simmons",
          "description": "",
          "commentCount": 86,
          "shareCount": 76,
          "resolutions": [
            {
              "resolution": 240,
              "size": 16244790
            },
            {
              "resolution": 480,
              "size": 25628976
            },
            {
              "resolution": 720,
              "size": 30046804
            }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 420000,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/oEuvgZJXIFHsa6rOgsJDfA==/109951165711524083.jpg",
            "accountStatus": 0,
            "gender": 2,
            "city": 420100,
            "birthday": 1018627200000,
            "userId": 1617779867,
            "userType": 0,
            "nickname": "F-Forristsis_as_霜落",
            "signature": "有点冷呢，来杯咖啡？",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 109951165711524080,
            "backgroundImgId": 109951165711522620,
            "backgroundUrl": "http://p1.music.126.net/dC5-99ELOWUNVUtPpY6Hzg==/109951165711522616.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": null,
            "djStatus": 0,
            "vipType": 0,
            "remarkName": null,
            "avatarImgIdStr": "109951165711524083",
            "backgroundImgIdStr": "109951165711522616"
          },
          "urlInfo": {
            "id": "A24C8DF6283CD4356D86F92652989573",
            "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/wQ83dPLE_3025218398_shd.mp4?ts=1651327111&rid=435512358C46151BAB4686DD22C35FE9&rl=3&rs=NdBlrWPCJSjPqlqPisuDYKdLlsRydhVm&sign=f662f0911d9f4d9b19cb92676256b886&ext=a%2FcPg%2BKMnoVJyqQHSJK4AC6n7oj8c1poooercmvYkaHfhz48M0p4f6k4ZQ6OwpGlnqaBBqHZxMpEF5MaBU%2BQjphgf3R9xZ4clhb9gSKqSIEQeCI8V0cWumxNTo3VaNW%2FHERX5Pyux9vGo5oW1AtzKyM%2F07tJYN6srUZPXfSEWmuQZRHewpaB1devfPnJuOJmWJTzDD7h%2F%2BfggdnUEyn9VeUzSHsK3mHHEElld28Zd%2B63C8jVoWqLosXC5ob%2FImUi",
            "size": 30046804,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 720
          },
          "videoGroup": [
            {
              "id": 1105,
              "name": "最佳饭制",
              "alg": null
            },
            {
              "id": 9104,
              "name": "电子",
              "alg": null
            },
            {
              "id": 4104,
              "name": "电音",
              "alg": null
            },
            {
              "id": 5100,
              "name": "音乐",
              "alg": null
            },
            {
              "id": 14212,
              "name": "欧美音乐",
              "alg": null
            },
            {
              "id": 15241,
              "name": "饭制",
              "alg": null
            },
            {
              "id": 23116,
              "name": "音乐推荐",
              "alg": null
            }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": null,
          "relateSong": [
            {
              "name": "Destr0yer",
              "id": 1403449766,
              "pst": 0,
              "t": 0,
              "ar": [
                {
                  "id": 12073277,
                  "name": "削除",
                  "tns": [],
                  "alias": []
                },
                {
                  "id": 29785818,
                  "name": "Nikki Simmons",
                  "tns": [],
                  "alias": []
                }
              ],
              "alia": [],
              "pop": 90,
              "st": 0,
              "rt": "",
              "fee": 0,
              "v": 8,
              "crbt": null,
              "cf": "",
              "al": {
                "id": 83327894,
                "name": "Destr0yer",
                "picUrl": "http://p4.music.126.net/3jE-6EXSL3wLp3hVURfCyw==/109951164487140323.jpg",
                "tns": [],
                "pic_str": "109951164487140323",
                "pic": 109951164487140320
              },
              "dt": 180741,
              "h": null,
              "m": null,
              "l": {
                "br": 128000,
                "fid": 0,
                "size": 2892321,
                "vd": -64556
              },
              "a": null,
              "cd": "01",
              "no": 0,
              "rtUrl": null,
              "ftype": 0,
              "rtUrls": [],
              "djId": 0,
              "copyright": 0,
              "s_id": 0,
              "mst": 9,
              "cp": 0,
              "mv": 14299953,
              "rtype": 0,
              "rurl": null,
              "publishTime": 0,
              "privilege": {
                "id": 1403449766,
                "fee": 0,
                "payed": 0,
                "st": 0,
                "pl": 128000,
                "dl": 128000,
                "sp": 7,
                "cp": 1,
                "subp": 1,
                "cs": false,
                "maxbr": 128000,
                "fl": 128000,
                "toast": false,
                "flag": 128,
                "preSell": false
              }
            }
          ],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "A24C8DF6283CD4356D86F92652989573",
          "durationms": 183329,
          "playTime": 59275,
          "praisedCount": 1021,
          "praised": false,
          "subscribed": false
        }
      },
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_13F63BCA47CC3594DA2F94B45AD2003E",
          "coverUrl": "https://p1.music.126.net/_K1EwIf6otZPdZFMnUm7tA==/109951164738445550.jpg",
          "height": 1080,
          "width": 1920,
          "title": "【文豪野犬全员】ECHO",
          "description": "文豪x文豪野犬全员向手书w\n\n原曲：Crusher-P《ECHO》\n原作：朝雾卡夫卡《文豪野犬》\n人设：春河35\n主唱：墨清弦；和声：乐正龙牙\n词/调/绘/视：洛阳雨寒",
          "commentCount": 156,
          "shareCount": 296,
          "resolutions": [
            {
              "resolution": 240,
              "size": 15811824
            },
            {
              "resolution": 480,
              "size": 23184352
            },
            {
              "resolution": 720,
              "size": 31749405
            },
            {
              "resolution": 1080,
              "size": 32034823
            }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 510000,
            "authStatus": 1,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/SA7MTZyq2z7zyWaWYjL4uw==/109951165626844467.jpg",
            "accountStatus": 0,
            "gender": 2,
            "city": 510100,
            "birthday": 965836800000,
            "userId": 360487537,
            "userType": 4,
            "nickname": "雨寒Ester",
            "signature": "我有一座花园",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 109951165626844460,
            "backgroundImgId": 109951166185109310,
            "backgroundUrl": "http://p1.music.126.net/K6FBepC2E51Z9op-MnGUCg==/109951166185109314.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": null,
            "djStatus": 10,
            "vipType": 0,
            "remarkName": null,
            "avatarImgIdStr": "109951165626844467",
            "backgroundImgIdStr": "109951166185109314"
          },
          "urlInfo": {
            "id": "13F63BCA47CC3594DA2F94B45AD2003E",
            "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/c37sG6Jq_2915731549_uhd.mp4?ts=1651327111&rid=435512358C46151BAB4686DD22C35FE9&rl=3&rs=aIKojPisRZgFTXJdotxNwIvukCHtKdCz&sign=e9364274b392434529dc653b03353883&ext=a%2FcPg%2BKMnoVJyqQHSJK4AC6n7oj8c1poooercmvYkaHfhz48M0p4f6k4ZQ6OwpGlnqaBBqHZxMpEF5MaBU%2BQjphgf3R9xZ4clhb9gSKqSIEQeCI8V0cWumxNTo3VaNW%2FHERX5Pyux9vGo5oW1AtzKyM%2F07tJYN6srUZPXfSEWmuQZRHewpaB1devfPnJuOJmWJTzDD7h%2F%2BfggdnUEyn9VeUzSHsK3mHHEElld28Zd%2B74i0aUam%2F1Kqo5lvZeObxq",
            "size": 32034823,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 1080
          },
          "videoGroup": [
            {
              "id": 60100,
              "name": "翻唱",
              "alg": null
            },
            {
              "id": 9104,
              "name": "电子",
              "alg": null
            },
            {
              "id": 4104,
              "name": "电音",
              "alg": null
            },
            {
              "id": 5100,
              "name": "音乐",
              "alg": null
            },
            {
              "id": 3102,
              "name": "二次元",
              "alg": null
            }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": null,
          "relateSong": [
            {
              "name": "【文豪野犬】ECHO",
              "id": 1424475152,
              "pst": 0,
              "t": 0,
              "ar": [
                {
                  "id": 34368408,
                  "name": "雨寒Ester",
                  "tns": [],
                  "alias": []
                },
                {
                  "id": 0,
                  "name": "墨清弦",
                  "tns": [],
                  "alias": []
                }
              ],
              "alia": [],
              "pop": 60,
              "st": 0,
              "rt": "",
              "fee": 0,
              "v": 18,
              "crbt": null,
              "cf": "",
              "al": {
                "id": 85598174,
                "name": "【文豪野犬】ECHO",
                "picUrl": "http://p4.music.126.net/ihcD4nVBTGvaDlmjS1Vm8A==/109951164722046494.jpg",
                "tns": [],
                "pic_str": "109951164722046494",
                "pic": 109951164722046500
              },
              "dt": 230668,
              "h": {
                "br": 320000,
                "fid": 0,
                "size": 9229485,
                "vd": -13785
              },
              "m": {
                "br": 192000,
                "fid": 0,
                "size": 5537709,
                "vd": -11179
              },
              "l": {
                "br": 128000,
                "fid": 0,
                "size": 3691821,
                "vd": -9428
              },
              "a": null,
              "cd": "01",
              "no": 1,
              "rtUrl": null,
              "ftype": 0,
              "rtUrls": [],
              "djId": 0,
              "copyright": 0,
              "s_id": 0,
              "mst": 9,
              "cp": 0,
              "mv": 0,
              "rtype": 0,
              "rurl": null,
              "publishTime": 0,
              "privilege": {
                "id": 1424475152,
                "fee": 0,
                "payed": 0,
                "st": 0,
                "pl": 320000,
                "dl": 999000,
                "sp": 7,
                "cp": 1,
                "subp": 1,
                "cs": false,
                "maxbr": 999000,
                "fl": 320000,
                "toast": false,
                "flag": 128,
                "preSell": false
              }
            }
          ],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "13F63BCA47CC3594DA2F94B45AD2003E",
          "durationms": 230143,
          "playTime": 125416,
          "praisedCount": 3440,
          "praised": false,
          "subscribed": false
        }
      },
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_55FEA6A73B5A45C1FBA57359D22516A1",
          "coverUrl": "https://p1.music.126.net/qrXknAbKvHHrxfRBRw8fkw==/109951163572726721.jpg",
          "height": 540,
          "width": 960,
          "title": "堵车怎么办，车上一秒变 D 厅！美国翻唱达人串烧翻唱《Selfie》",
          "description": "堵车怎么办，车上一秒变 D 厅！美国翻唱达人 Kurt Schneider 带着小伙伴们一起玩转出游，高能翻唱 The Chainsmokers（烟鬼乐队，代表作「Selfie」）歌曲串烧，教你在堵车的时候照样 high 翻。",
          "commentCount": 431,
          "shareCount": 1249,
          "resolutions": [
            {
              "resolution": 240,
              "size": 23313375
            },
            {
              "resolution": 480,
              "size": 33169273
            }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 1000000,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/0fqTn4VpqjyX7iqUe41xhA==/109951166086321221.jpg",
            "accountStatus": 0,
            "gender": 0,
            "city": 1010000,
            "birthday": 883929600000,
            "userId": 347267113,
            "userType": 207,
            "nickname": "Dennnnnniel",
            "signature": ":(",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 109951166086321220,
            "backgroundImgId": 109951166285210370,
            "backgroundUrl": "http://p1.music.126.net/B_krR6XmlOPkkwAFIh51CA==/109951166285210360.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": [
              "电子",
              "欧美"
            ],
            "experts": {
              "1": "音乐视频达人",
              "2": "电子|欧美音乐资讯达人"
            },
            "djStatus": 10,
            "vipType": 11,
            "remarkName": null,
            "avatarImgIdStr": "109951166086321221",
            "backgroundImgIdStr": "109951166285210360"
          },
          "urlInfo": {
            "id": "55FEA6A73B5A45C1FBA57359D22516A1",
            "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/hb2mJhJ6_56064339_hd.mp4?ts=1651327111&rid=435512358C46151BAB4686DD22C35FE9&rl=3&rs=OsRBlhuONihKrPneRapynBKmXbEoKrwM&sign=c5ea65e0dddf55a7e951d6683483df22&ext=a%2FcPg%2BKMnoVJyqQHSJK4AC6n7oj8c1poooercmvYkaHfhz48M0p4f6k4ZQ6OwpGlnqaBBqHZxMpEF5MaBU%2BQjphgf3R9xZ4clhb9gSKqSIEQeCI8V0cWumxNTo3VaNW%2FHERX5Pyux9vGo5oW1AtzKyM%2F07tJYN6srUZPXfSEWmuQZRHewpaB1devfPnJuOJmWJTzDD7h%2F%2BfggdnUEyn9VeUzSHsK3mHHEElld28Zd%2B63C8jVoWqLosXC5ob%2FImUi",
            "size": 33169273,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 480
          },
          "videoGroup": [
            {
              "id": 60100,
              "name": "翻唱",
              "alg": null
            },
            {
              "id": 58109,
              "name": "国外达人",
              "alg": null
            },
            {
              "id": 9104,
              "name": "电子",
              "alg": null
            },
            {
              "id": 4104,
              "name": "电音",
              "alg": null
            },
            {
              "id": 5100,
              "name": "音乐",
              "alg": null
            },
            {
              "id": 16131,
              "name": "英文",
              "alg": null
            },
            {
              "id": 13164,
              "name": "快乐",
              "alg": null
            }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": [
            109
          ],
          "relateSong": [
            {
              "name": "Selfie",
              "id": 28530970,
              "pst": 0,
              "t": 0,
              "ar": [
                {
                  "id": 893484,
                  "name": "The Chainsmokers",
                  "tns": [],
                  "alias": []
                },
                {
                  "id": 29809563,
                  "name": "Alexis Killacam",
                  "tns": [],
                  "alias": []
                }
              ],
              "alia": [],
              "pop": 95,
              "st": 0,
              "rt": "",
              "fee": 8,
              "v": 149,
              "crbt": null,
              "cf": "",
              "al": {
                "id": 2822209,
                "name": "Absolute Running 2014",
                "picUrl": "http://p3.music.126.net/wo68osTke1PwLUwVcfc-ig==/6052811511263732.jpg",
                "tns": [],
                "pic": 6052811511263732
              },
              "dt": 183000,
              "h": {
                "br": 320000,
                "fid": 0,
                "size": 7347918,
                "vd": -66352
              },
              "m": {
                "br": 192000,
                "fid": 0,
                "size": 4408829,
                "vd": -66352
              },
              "l": {
                "br": 128000,
                "fid": 0,
                "size": 2939285,
                "vd": -66352
              },
              "a": null,
              "cd": "1",
              "no": 1,
              "rtUrl": null,
              "ftype": 0,
              "rtUrls": [],
              "djId": 0,
              "copyright": 2,
              "s_id": 0,
              "mst": 9,
              "cp": 7003,
              "mv": 0,
              "rtype": 0,
              "rurl": null,
              "publishTime": 1399478400007,
              "privilege": {
                "id": 28530970,
                "fee": 8,
                "payed": 0,
                "st": 0,
                "pl": 128000,
                "dl": 0,
                "sp": 7,
                "cp": 1,
                "subp": 1,
                "cs": false,
                "maxbr": 999000,
                "fl": 128000,
                "toast": false,
                "flag": 260,
                "preSell": false
              }
            }
          ],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "55FEA6A73B5A45C1FBA57359D22516A1",
          "durationms": 207099,
          "playTime": 613088,
          "praisedCount": 4353,
          "praised": false,
          "subscribed": false
        }
      },
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_DAEC00324DE081DC072B09BD90AAAE4D",
          "coverUrl": "https://p1.music.126.net/rdhHaWkYEZ_NCF1OltaG1A==/109951163572664380.jpg",
          "height": 540,
          "width": 540,
          "title": "Cutting Shapes",
          "description": null,
          "commentCount": 104,
          "shareCount": 203,
          "resolutions": [
            {
              "resolution": 240,
              "size": 5501895
            },
            {
              "resolution": 480,
              "size": 10802400
            }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 1000000,
            "authStatus": 1,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/quZDugF38jzIX_laZwIxJA==/109951166340556153.jpg",
            "accountStatus": 0,
            "gender": 1,
            "city": 1003000,
            "birthday": 320428800000,
            "userId": 487218777,
            "userType": 2,
            "nickname": "DonDiablo",
            "signature": "The official account of Dutch DJ/producer Don Diablo.",
            "description": "知名荷兰DJ、电子音乐制作人",
            "detailDescription": "知名荷兰DJ、电子音乐制作人",
            "avatarImgId": 109951166340556160,
            "backgroundImgId": 109951166376436580,
            "backgroundUrl": "http://p1.music.126.net/-pTvnwBpu94G4g3HSnq9BA==/109951166376436581.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": null,
            "djStatus": 10,
            "vipType": 0,
            "remarkName": null,
            "avatarImgIdStr": "109951166340556153",
            "backgroundImgIdStr": "109951166376436581"
          },
          "urlInfo": {
            "id": "DAEC00324DE081DC072B09BD90AAAE4D",
            "url": "http://vodkgeyttp9.vod.126.net/cloudmusic/fwm2TveM_3130841446_hd.mp4?ts=1651327111&rid=435512358C46151BAB4686DD22C35FE9&rl=3&rs=lbSMNcgobbPjFgwkwcRyGzwPKqQaDzWC&sign=cf1b4fa8998e921a29e9ef835978b5f1&ext=a%2FcPg%2BKMnoVJyqQHSJK4AC6n7oj8c1poooercmvYkaHfhz48M0p4f6k4ZQ6OwpGlnqaBBqHZxMpEF5MaBU%2BQjphgf3R9xZ4clhb9gSKqSIEQeCI8V0cWumxNTo3VaNW%2FHERX5Pyux9vGo5oW1AtzKyM%2F07tJYN6srUZPXfSEWmuQZRHewpaB1devfPnJuOJmWJTzDD7h%2F%2BfggdnUEyn9VeUzSHsK3mHHEElld28Zd%2B74i0aUam%2F1Kqo5lvZeObxq",
            "size": 10802400,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 480
          },
          "videoGroup": [
            {
              "id": 58100,
              "name": "现场",
              "alg": null
            },
            {
              "id": 1100,
              "name": "音乐现场",
              "alg": null
            },
            {
              "id": 9104,
              "name": "电子",
              "alg": null
            },
            {
              "id": 4104,
              "name": "电音",
              "alg": null
            },
            {
              "id": 5100,
              "name": "音乐",
              "alg": null
            },
            {
              "id": 16131,
              "name": "英文",
              "alg": null
            },
            {
              "id": 13164,
              "name": "快乐",
              "alg": null
            }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": [
            109
          ],
          "relateSong": [
            {
              "name": "Cutting Shapes",
              "id": 427542143,
              "pst": 0,
              "t": 0,
              "ar": [
                {
                  "id": 139072,
                  "name": "Don Diablo",
                  "tns": [],
                  "alias": []
                }
              ],
              "alia": [],
              "pop": 100,
              "st": 0,
              "rt": null,
              "fee": 1,
              "v": 16,
              "crbt": null,
              "cf": "",
              "al": {
                "id": 34855075,
                "name": "Cutting Shapes",
                "picUrl": "http://p3.music.126.net/jp4h_qjO-ZpPCPLa22zB3Q==/109951163789250446.jpg",
                "tns": [],
                "pic_str": "109951163789250446",
                "pic": 109951163789250450
              },
              "dt": 179047,
              "h": {
                "br": 320000,
                "fid": 0,
                "size": 7164909,
                "vd": -74570
              },
              "m": {
                "br": 192000,
                "fid": 0,
                "size": 4298963,
                "vd": -74570
              },
              "l": {
                "br": 128000,
                "fid": 0,
                "size": 2865990,
                "vd": -74570
              },
              "a": null,
              "cd": "1",
              "no": 1,
              "rtUrl": null,
              "ftype": 0,
              "rtUrls": [],
              "djId": 0,
              "copyright": 1,
              "s_id": 0,
              "mst": 9,
              "cp": 1419024,
              "mv": 5461179,
              "rtype": 0,
              "rurl": null,
              "publishTime": 1478188800000,
              "privilege": {
                "id": 427542143,
                "fee": 1,
                "payed": 0,
                "st": 0,
                "pl": 0,
                "dl": 0,
                "sp": 0,
                "cp": 0,
                "subp": 0,
                "cs": false,
                "maxbr": 999000,
                "fl": 0,
                "toast": false,
                "flag": 260,
                "preSell": false
              }
            }
          ],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "DAEC00324DE081DC072B09BD90AAAE4D",
          "durationms": 59000,
          "playTime": 132630,
          "praisedCount": 1368,
          "praised": false,
          "subscribed": false
        }
      },
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_9171379F76944CBDB5D76FF3FC74EFFC",
          "coverUrl": "https://p1.music.126.net/k-5b5Iz2-E2x95_9pUMx2w==/109951164988692608.jpg",
          "height": 1080,
          "width": 1920,
          "title": "Dancer In The Dark|但愿殊途同归",
          "description": "若能避开猛烈的欢喜，\n自然也不会有悲痛的来袭。\n#超燃计划#",
          "commentCount": 17,
          "shareCount": 56,
          "resolutions": [
            {
              "resolution": 240,
              "size": 26649848
            },
            {
              "resolution": 480,
              "size": 44878140
            },
            {
              "resolution": 720,
              "size": 65506549
            },
            {
              "resolution": 1080,
              "size": 121271789
            }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 0,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/SUeqMM8HOIpHv9Nhl9qt9w==/109951165647004069.jpg",
            "accountStatus": 30,
            "gender": 0,
            "city": 100,
            "birthday": -2209017600000,
            "userId": 3325837972,
            "userType": 204,
            "nickname": "帐号已注销",
            "signature": "",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 109951165647004060,
            "backgroundImgId": 109951162868128400,
            "backgroundUrl": "http://p1.music.126.net/2zSNIqTcpHL2jIvU6hG0EA==/109951162868128395.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": {
              "1": "影视视频达人"
            },
            "djStatus": 0,
            "vipType": 0,
            "remarkName": null,
            "avatarImgIdStr": "109951165647004069",
            "backgroundImgIdStr": "109951162868128395"
          },
          "urlInfo": {
            "id": "9171379F76944CBDB5D76FF3FC74EFFC",
            "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/1p0Dtd7N_3001226265_uhd.mp4?ts=1651327111&rid=435512358C46151BAB4686DD22C35FE9&rl=3&rs=KbHMsftUJqolpvUDOAIFnrWxAxBTmqUt&sign=a8c5db7693cab6ee9a2820c3d702ef58&ext=a%2FcPg%2BKMnoVJyqQHSJK4AC6n7oj8c1poooercmvYkaHfhz48M0p4f6k4ZQ6OwpGlnqaBBqHZxMpEF5MaBU%2BQjphgf3R9xZ4clhb9gSKqSIEQeCI8V0cWumxNTo3VaNW%2FHERX5Pyux9vGo5oW1AtzKyM%2F07tJYN6srUZPXfSEWmuQZRHewpaB1devfPnJuOJmWJTzDD7h%2F%2BfggdnUEyn9VeUzSHsK3mHHEElld28Zd%2B63C8jVoWqLosXC5ob%2FImUi",
            "size": 121271789,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 1080
          },
          "videoGroup": [
            {
              "id": 1105,
              "name": "最佳饭制",
              "alg": null
            },
            {
              "id": 9104,
              "name": "电子",
              "alg": null
            },
            {
              "id": 4104,
              "name": "电音",
              "alg": null
            },
            {
              "id": 5100,
              "name": "音乐",
              "alg": null
            },
            {
              "id": 14146,
              "name": "兴奋",
              "alg": null
            },
            {
              "id": 14212,
              "name": "欧美音乐",
              "alg": null
            },
            {
              "id": 15241,
              "name": "饭制",
              "alg": null
            },
            {
              "id": 23116,
              "name": "音乐推荐",
              "alg": null
            },
            {
              "id": 13172,
              "name": "欧美",
              "alg": null
            },
            {
              "id": 72116,
              "name": "短片",
              "alg": null
            }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": null,
          "relateSong": [
            {
              "name": "Dancer In The Dark (Original Mix)",
              "id": 1334059163,
              "pst": 0,
              "t": 0,
              "ar": [
                {
                  "id": 30476593,
                  "name": "GRABOTE",
                  "tns": [],
                  "alias": []
                },
                {
                  "id": 0,
                  "name": "Marc Philippe",
                  "tns": [],
                  "alias": []
                }
              ],
              "alia": [],
              "pop": 100,
              "st": 0,
              "rt": null,
              "fee": 8,
              "v": 30,
              "crbt": null,
              "cf": "",
              "al": {
                "id": 74896143,
                "name": "Dancer In The Dark (Original Mix)",
                "picUrl": "http://p4.music.126.net/9BETsV4GpvIeKb2ydyVXFg==/109951163731656042.jpg",
                "tns": [],
                "pic_str": "109951163731656042",
                "pic": 109951163731656050
              },
              "dt": 247132,
              "h": {
                "br": 320000,
                "fid": 0,
                "size": 9887913,
                "vd": -34312
              },
              "m": {
                "br": 192000,
                "fid": 0,
                "size": 5932765,
                "vd": -34312
              },
              "l": {
                "br": 128000,
                "fid": 0,
                "size": 3955191,
                "vd": -34312
              },
              "a": null,
              "cd": "01",
              "no": 1,
              "rtUrl": null,
              "ftype": 0,
              "rtUrls": [],
              "djId": 0,
              "copyright": 0,
              "s_id": 0,
              "mst": 9,
              "cp": 0,
              "mv": 0,
              "rtype": 0,
              "rurl": null,
              "publishTime": 1544976000000,
              "privilege": {
                "id": 1334059163,
                "fee": 8,
                "payed": 0,
                "st": 0,
                "pl": 128000,
                "dl": 0,
                "sp": 7,
                "cp": 1,
                "subp": 1,
                "cs": false,
                "maxbr": 999000,
                "fl": 128000,
                "toast": false,
                "flag": 132,
                "preSell": false
              }
            }
          ],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "9171379F76944CBDB5D76FF3FC74EFFC",
          "durationms": 212074,
          "playTime": 134125,
          "praisedCount": 583,
          "praised": false,
          "subscribed": false
        }
      },
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_7143FC54E68CA17DC1BAB10CCC665016",
          "coverUrl": "https://p1.music.126.net/fu6CqXZPhlkCszZ-3y7xDA==/109951164971230529.jpg",
          "height": 1080,
          "width": 1920,
          "title": "最近超火的《Tuesday》太洗脑！音乐一响，老娘自己都怕",
          "description": "最近超火的《Tuesday》太洗脑！音乐一响，老娘拽起来自己都害怕",
          "commentCount": 132,
          "shareCount": 122,
          "resolutions": [
            {
              "resolution": 240,
              "size": 17040860
            },
            {
              "resolution": 480,
              "size": 27777613
            },
            {
              "resolution": 720,
              "size": 40132557
            },
            {
              "resolution": 1080,
              "size": 73654882
            }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 210000,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/nEkh8k3JFqK54dlHVUwrHA==/109951163910951928.jpg",
            "accountStatus": 0,
            "gender": 2,
            "city": 210200,
            "birthday": -2209017600000,
            "userId": 1771079078,
            "userType": 204,
            "nickname": "下饭音乐music",
            "signature": "邀请你来我的音乐party，抓取全球最in音乐给你",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 109951163910951940,
            "backgroundImgId": 109951162868126480,
            "backgroundUrl": "http://p1.music.126.net/_f8R60U9mZ42sSNvdPn2sQ==/109951162868126486.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": {
              "1": "视频达人"
            },
            "djStatus": 0,
            "vipType": 0,
            "remarkName": null,
            "avatarImgIdStr": "109951163910951928",
            "backgroundImgIdStr": "109951162868126486"
          },
          "urlInfo": {
            "id": "7143FC54E68CA17DC1BAB10CCC665016",
            "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/7mNEYqBl_2921324496_uhd.mp4?ts=1651327111&rid=435512358C46151BAB4686DD22C35FE9&rl=3&rs=GwaMSBUbsRqAhrSYdxBoXukAVxuyQChr&sign=6da0f5cda06d8ec7d043d5951a88dbe9&ext=a%2FcPg%2BKMnoVJyqQHSJK4AC6n7oj8c1poooercmvYkaHfhz48M0p4f6k4ZQ6OwpGlnqaBBqHZxMpEF5MaBU%2BQjphgf3R9xZ4clhb9gSKqSIEQeCI8V0cWumxNTo3VaNW%2FHERX5Pyux9vGo5oW1AtzKyM%2F07tJYN6srUZPXfSEWmuQZRHewpaB1devfPnJuOJmWJTzDD7h%2F%2BfggdnUEyn9VeUzSHsK3mHHEElld28Zd%2B63C8jVoWqLosXC5ob%2FImUi",
            "size": 73654882,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 1080
          },
          "videoGroup": [
            {
              "id": 1105,
              "name": "最佳饭制",
              "alg": null
            },
            {
              "id": 9104,
              "name": "电子",
              "alg": null
            },
            {
              "id": 4104,
              "name": "电音",
              "alg": null
            },
            {
              "id": 5100,
              "name": "音乐",
              "alg": null
            },
            {
              "id": 14212,
              "name": "欧美音乐",
              "alg": null
            },
            {
              "id": 15241,
              "name": "饭制",
              "alg": null
            },
            {
              "id": 23116,
              "name": "音乐推荐",
              "alg": null
            }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": null,
          "relateSong": [
            {
              "name": "Tuesday (Original Mix)",
              "id": 506726178,
              "pst": 0,
              "t": 0,
              "ar": [
                {
                  "id": 963635,
                  "name": "Burak Yeter",
                  "tns": [],
                  "alias": []
                },
                {
                  "id": 12583018,
                  "name": "Danelle Sandoval",
                  "tns": [],
                  "alias": []
                }
              ],
              "alia": [],
              "pop": 100,
              "st": 0,
              "rt": null,
              "fee": 1,
              "v": 13,
              "crbt": null,
              "cf": "",
              "al": {
                "id": 36247630,
                "name": "Tuesday",
                "picUrl": "http://p4.music.126.net/zzhT8GLndGKskSP1keVs3w==/18190320370490889.jpg",
                "tns": [],
                "pic_str": "18190320370490889",
                "pic": 18190320370490890
              },
              "dt": 241874,
              "h": {
                "br": 320000,
                "fid": 0,
                "size": 9677889,
                "vd": -59536
              },
              "m": {
                "br": 192000,
                "fid": 0,
                "size": 5806751,
                "vd": -59536
              },
              "l": {
                "br": 128000,
                "fid": 0,
                "size": 3871182,
                "vd": -59536
              },
              "a": null,
              "cd": "01",
              "no": 1,
              "rtUrl": null,
              "ftype": 0,
              "rtUrls": [],
              "djId": 0,
              "copyright": 1,
              "s_id": 0,
              "mst": 9,
              "cp": 526012,
              "mv": 0,
              "rtype": 0,
              "rurl": null,
              "publishTime": 1468684800007,
              "privilege": {
                "id": 506726178,
                "fee": 1,
                "payed": 0,
                "st": 0,
                "pl": 0,
                "dl": 0,
                "sp": 0,
                "cp": 0,
                "subp": 0,
                "cs": false,
                "maxbr": 999000,
                "fl": 0,
                "toast": false,
                "flag": 260,
                "preSell": false
              }
            }
          ],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "7143FC54E68CA17DC1BAB10CCC665016",
          "durationms": 187520,
          "playTime": 640151,
          "praisedCount": 3255,
          "praised": false,
          "subscribed": false
        }
      }
    ]
    let videoList = this.data.videoList;
    //将视频最新的数据更新原有数据列表数据中
    videoList.push(...newVideoList);
    this.setData({
      ideoList
    })
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
  onShareAppMessage: function (from) {
    if (from === 'button') {
      return {
        title: '来自button的转发'
        , page: '/pages/video/video',
        imageUrl: '/static/image/nvsheng.jpg'
      }
    } else {
      return {
        title: '来自button的转发'
        , page: '/pages/video/video',
        imageUrl: '/static/image/nvsheng.jpg'
      }
    }
  
  }
})