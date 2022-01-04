var app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        title: '教练管理中心',
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

        that.setData({
            show_faxian: wx.getStorageSync('footerFaxian'),
            lesson_coach: wx.getStorageSync('footerCoach'),
            lesson_group: wx.getStorageSync('footerGroup'),
            shop_id: wx.getStorageSync('shopId'),
        });

        wx.showLoading({
            title: '加载中...',
        });

        wx.request({
            url: app.globalData.domain + '/coachcp/index.html',
            method: 'POST',
            data: {
                app_id: app.globalData.app_id,
                uid: wx.getStorageSync('userId'),
            },
            success: function (res) {
                wx.hideLoading();
                if (res.data.state) {
                    if (res.data.data.is_coach == 0) {
                        wx.navigateTo({
                            url: '/pages/index/index',
                        });
                    }
                    that.setData({
                        copyright: res.data.data.copyright,
                        coach: res.data.data.coach,
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

    }
})
