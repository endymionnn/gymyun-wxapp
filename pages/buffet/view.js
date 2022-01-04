var app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        show: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (query) {
        var that = this;

        that.setData({
            opentype: app.getOpentype(),
        });

        if (query.scene) {
            var scene = decodeURIComponent(query.scene);
        }
        if (query.q) {
            var scene = decodeURIComponent(query.q);
            scene = scene.split("/");
            scene = scene[10];
        }

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
            url: app.globalData.domain + '/buffet/view.html',
            method: 'POST',
            data: {
                app_id: app.globalData.app_id,
                uid: wx.getStorageSync('userId'),
                id: scene,
            },
            success: function (res) {
                wx.hideLoading();
                that.setData({
                    show: 1,
                    title: res.data.title,
                    copyright: res.data.copyright,
                    state: res.data.state,
                    msg: res.data.msg,
                });
                if (res.data.state == 100) {
                    wx.navigateTo({
                        url: '/pages/user/mobile',
                    });
                    return false;
                }
                if (res.data.state) {
                    that.setData({
                        data: res.data.data,
                        order: res.data.order,
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
        var that = this;

        setInterval(function () {
            that.getCost();
        }, 30000);
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

    start: function () {
        var that = this;

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
            url: app.globalData.domain + '/buffet/start.html',
            method: 'POST',
            data: {
                app_id: app.globalData.app_id,
                uid: wx.getStorageSync('userId'),
                id: that.data.data.id,
            },
            success: function (res) {
                wx.hideLoading();
                if (res.data.state == 100) {
                    wx.navigateTo({
                        url: '/pages/user/mobile',
                    });
                    return false;
                }
                if (res.data.state == 0) {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                        duration: 3000
                    });
                } else {
                    that.setData({
                        order: res.data.order
                    });
                }
            },
        });
    },
    end: function () {
        var that = this;

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
            url: app.globalData.domain + '/buffet/end.html',
            method: 'POST',
            data: {
                app_id: app.globalData.app_id,
                uid: wx.getStorageSync('userId'),
                id: that.data.data.id,
            },
            success: function (res) {
                wx.hideLoading();
                if (res.data.state == 100) {
                    wx.navigateTo({
                        url: '/pages/user/mobile',
                    });
                    return false;
                }
                if (res.data.state == 0) {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                        duration: 3000
                    });
                }
                if (res.data.pay_id) {
                    wx.navigateTo({
                        url: '/pages/pay/index?id=' + res.data.pay_id,
                    });
                }
            },
        });
    },
    getCost() {
        var that = this;

        if (that.data.order) {
            wx.request({
                url: app.globalData.domain + '/buffet/cost.html',
                method: 'POST',
                data: {
                    app_id: app.globalData.app_id,
                    id: that.data.order.id,
                },
                success: function (res) {
                    that.setData({
                        order: res.data.order,
                    });
                },
            });
        }
    },
})
