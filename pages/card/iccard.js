var app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        title: '我的入场码',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
        var that = this;

        that.setData({
            opentype: app.getOpentype(),
        });

        if (!wx.getStorageSync('userId')) {
            wx.navigateTo({
                url: '/pages/user/login',
            });
            return false;
        }

        if (!wx.getStorageSync('shopId') && app.globalData.app_id == 0) {
            wx.navigateTo({
                url: '/pages/index/index',
            });
            return false;
        }

        wx.showLoading({
            title: '加载中...',
        });

        wx.request({
            url: app.globalData.domain + '/card/iccard.html',
            method: 'POST',
            data: {
                app_id: app.globalData.app_id,
                shop_id: wx.getStorageSync('shopId'),
                uid: wx.getStorageSync('userId'),
            },
            success: function (res) {
                wx.hideLoading();
                if (res.data.state == 100) {
                    wx.navigateTo({
                        url: '/pages/user/mobile',
                    });
                    return false;
                }
                if (res.data.state == 200) {
                    wx.navigateTo({
                        url: '/pages/member/face',
                    });
                    return false;
                }
                if (res.data.state) {
                    that.setData({
                        copyright: res.data.data.copyright,
                        iccard: res.data.data.iccard,
                        qrcode_1: res.data.data.qrcode_1,
                        qrcode_2: res.data.data.qrcode_2,
                    });
                }
            },
        });
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

    },
})
