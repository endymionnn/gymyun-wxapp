var app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        title: '场地预约详情',
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
            url: app.globalData.domain + '/space/myshow.html',
            method: 'POST',
            data: {
                app_id: app.globalData.app_id,
                uid: wx.getStorageSync('userId'),
                id: options.id,
            },
            success: function (res) {
                wx.hideLoading();
                if (res.data.state) {
                    that.setData({
                        copyright: res.data.data.copyright,
                        order: res.data.data.order,
                        list: res.data.data.list,
                        space: res.data.data.space,
                        shop: res.data.data.shop,
                        qrcode: res.data.data.qrcode,
                        join: res.data.data.join,
                        cancel: res.data.data.cancel,
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
        var that = this;
        return {
            title: that.data.space.title,
            imageUrl: that.data.space.pic,
            path: '/pages/space/myshow?id='+ that.data.order.id,
        };
    },
    cancel: function (e) {
        var that = this;
        var key = e.currentTarget.dataset.key;
        var id  = e.currentTarget.dataset.id;

        wx.showActionSheet({
            itemList: ['踢出队伍'],
            success: function (res) {
                if (!res.cancel) {
                    wx.request({
                        url: app.globalData.domain + '/space/cancel.html',
                        method: 'POST',
                        data: {
                            app_id: app.globalData.app_id,
                            uid: wx.getStorageSync('userId'),
                            id: id,
                        },
                        success: function (res) {
                            wx.hideLoading();
                            if (res.data.state) {
                                that.data.list.splice(key, 1);
                                that.setData({
                                    list: that.data.list,
                                });
                            } else {
                                wx.showToast({
                                    title: res.data.msg,
                                    icon: 'none',
                                    duration: 3000
                                });
                            }
                        },
                    });
                }
            }
        });
    },
    join: function () {
        var that = this;
        wx.request({
            url: app.globalData.domain + '/space/myshow.html',
            method: 'POST',
            data: {
                app_id: app.globalData.app_id,
                uid: wx.getStorageSync('userId'),
                id: that.data.order.id,
                join: 1,
            },
            success: function (res) {
                wx.hideLoading();
                if (res.data.state) {
                    that.setData({
                        list: res.data.data.list,
                        qrcode: res.data.data.qrcode,
                        join: res.data.data.join,
                        cancel: res.data.data.cancel,
                    });
                } else {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                        duration: 3000
                    });
                }
            },
        });
    },
    renew: function () {
        var that = this;
        wx.request({
            url: app.globalData.domain + '/space/renew.html',
            method: 'POST',
            data: {
                app_id: app.globalData.app_id,
                uid: wx.getStorageSync('userId'),
                id: that.data.order.id,
            },
            success: function (res) {
                wx.hideLoading();
                if (res.data.state) {
                    if (res.data.data.id) {
                        wx.navigateTo({
                            url: '/pages/pay/index?id=' + res.data.data.id,
                        });
                    } else {
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'none',
                            duration: 3000
                        });
                    }
                } else {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                        duration: 3000
                    });
                }
            },
        });
    }
})
