var app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        title: '预约设置',
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

        wx.showLoading({
            title: '加载中...',
        });

        wx.request({
            url: app.globalData.domain + '/coachcp/settime.html',
            method: 'POST',
            data: {
                app_id: app.globalData.app_id,
                uid: wx.getStorageSync('userId'),
            },
            success: function (res) {
                wx.hideLoading();
                if (res.data.state) {
                    that.setData({
                        copyright: res.data.data.copyright,
                        max_order: res.data.data.max_order,
                        list: res.data.data.list,
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
    checkChange: function(e) {

        var that = this;

        wx.request({
            url: app.globalData.domain + '/coachcp/settime.html',
            method: 'POST',
            data: {
                app_id: app.globalData.app_id,
                uid: wx.getStorageSync('userId'),
                time: e.detail.value,
                post: 1,
            },
            success: function (res) {
                wx.hideLoading();
                if (res.data.state) {
                    that.setData({
                        list: res.data.data.list,
                        max_order: res.data.data.max_order,
                    });
                }
            },
        });
    },
    timeChange: function(e) {
        var that = this;

        wx.request({
            url: app.globalData.domain + '/coachcp/settime.html',
            method: 'POST',
            data: {
                app_id: app.globalData.app_id,
                uid: wx.getStorageSync('userId'),
                max_order: e.detail.value,
                post: 1,
            },
            success: function (res) {
                wx.hideLoading();
                if (res.data.state) {
                    that.setData({
                        list: res.data.data.list,
                        max_order: res.data.data.max_order,
                    });
                }
            },
        });
    }
})
