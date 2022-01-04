var app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        title: '押金',
        show: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
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
            url: app.globalData.domain + '/deposit/index.html',
            method: 'POST',
            data: {
                app_id: app.globalData.app_id,
                uid: wx.getStorageSync('userId'),
                type: options.type,
                shop_id: options.shop_id,
            },
            success: function (res) {
                wx.hideLoading();
                if (res.data.state) {
                    if (res.data.state == 100) {
                        wx.navigateTo({
                            url: '/pages/user/mobile',
                        });
                        return false;
                    }
                    if (res.data.data.pay_id) {
                        wx.navigateTo({
                            url: '/pages/pay/index?id=' + res.data.data.pay_id,
                        });
                    }
                    that.setData({
                        copyright: res.data.data.copyright,
                        list: res.data.data.list,
                        show: res.data.data.show,
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
    refund: function(e) {
        console.log(e);
        wx.showActionSheet({
            itemList: ['确定'],
            success: function(res) {
                if (!res.cancel) {

                    wx.showLoading({
                        title: '加载中...',
                    });
                    wx.request({
                        url: app.globalData.domain + '/deposit/refund.html',
                        method: 'POST',
                        data: {
                            app_id: app.globalData.app_id,
                            uid: wx.getStorageSync('userId'),
                            id: e.currentTarget.dataset.id,
                        },
                        success: function(res) {
                            wx.hideLoading();
                            wx.showToast({
                                title: res.data.msg,
                                icon: 'none',
                                duration: 3000
                            });
                        },
                    });
                }
            }
        });
    }
})
