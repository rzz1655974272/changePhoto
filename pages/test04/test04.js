
Page({

  data: {
    items: [
      {value: 'redToWhite', name: '红底转白底'},
      {value: 'redToBlue', name: '红底转蓝底', checked: 'true'},
      {value: 'whiteToRed', name: '白底转红底'},
      {value: 'whiteToBlue', name: '白底转蓝底'},
      {value: 'blueToRed', name: '蓝底转红底'},
      {value: 'blueToWhite', name: '蓝底转白底'},
    ],
    photos: "",
    imgCount:"",
    method: "blueToWhite",

  },

  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    const items = this.data.items
    for (let i = 0, len = items.length; i < len; ++i) {
      items[i].checked = items[i].value === e.detail.value
    }

    this.setData({
     method:e.detail.value
    })
  },

  /**
   * 选择照片
   */
  chooseImg: function() {
    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        that.setData({
          photos: tempFilePaths
        })
        console.log(that.data.photos)
      }
    })
  },

  /**
   * 上传照片
   */
  uploadImg: function() {
    var that = this
    console.log(that.data.method)
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 500)
    wx.uploadFile({
      url: 'https://lovezf.top/mvc_changeImge_war/user/fileupload2', 
      filePath: that.data.photos[0],
      name: 'upload',
      formData: {
        'flag': that.data.method
      },
      
      success: function (res) {
        var data = JSON.parse(res.data)
        console.log(data)
        that.setData({
          photos:"https://"+data.url,
          imgCount:data.imgCount
        })
      },
      fail:function(res){
        wx.showModal({
          title: '提示',
          content: '请选择本地图片',
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
              that.chooseImg()
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    })
  },
//点击保存图片
save () {
  let that = this
  //若二维码未加载完毕，加个动画提高用户体验
  wx.showToast({
   icon: 'loading',
   title: '正在保存图片',
   duration: 1000
  })
  //判断用户是否授权"保存到相册"
  wx.getSetting({
   success (res) {
    //没有权限，发起授权
    if (!res.authSetting['scope.writePhotosAlbum']) {
     wx.authorize({
      scope: 'scope.writePhotosAlbum',
      success () {//用户允许授权，保存图片到相册
       that.savePhoto();
      },
      fail () {//用户点击拒绝授权，跳转到设置页，引导用户授权
       wx.openSetting({
        success () {
         wx.authorize({
          scope: 'scope.writePhotosAlbum',
          success() {
           that.savePhoto();
          }
         })
        }
       })
      }
     })
    } else {//用户已授权，保存到相册
     that.savePhoto()
    }
   }
  })
 },
//保存图片到相册，提示保存成功
 savePhoto() {
  let that = this
  console.log(that.data.photos)
  wx.downloadFile({
   url: that.data.photos,
   success: function (res) {
    wx.saveImageToPhotosAlbum({
     filePath: res.tempFilePath,
     success(res) {
      wx.showToast({
       title: '保存成功',
       icon: "success",
       duration: 1000
      })
     },
     fail(res) {
      wx.showToast({
       title: '保存成功',
       icon: "success",
       duration: 1000
      })
     }
    })
   }
  })
 },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.request({
      url: 'https://lovezf.top/mvc_changeImge_war/user/getCount', //仅为示例，并非真实的接口地址
      data: {
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res.data)
        that.setData({
          imgCount:res.data
        })
      }
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
  onShareAppMessage: function () {

  }
})