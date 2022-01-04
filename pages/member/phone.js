var app = getApp();

var interval  = null;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        post: 0,
        time: 0,
        time_str: '获取验证码',
        disabled: true,
        phone: '',
        code: '',
        title: '手机号码绑定',
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
            url: app.globalData.domain + '/member/phone.html',
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
                        user: res.data.data.user,
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
    fast: function () {
        wx.navigateTo({
            url: '/pages/user/mobile',
        });
        return false;
    },
    post: function () {
        var that = this;

        that.setData({
            post: 1,
        });
    },
    inputTel: function(e) {
        this.setData({
            phone: e.detail.value
        })
    },
    inputCode: function(e) {
        this.setData({
            code: e.detail.value
        })
    },
    getCode: function () {
        var that = this;

        if (that.data.time) {
            wx.showToast({
                title: '操作太频繁了',
                icon: 'none',
                duration: 3000
            });
            return false;
        }

        if (that.data.phone == "") {
            wx.showToast({
                title: '请输入手机号',
                icon: 'none',
                duration: 3000
            });
            return false;
        }

        if (!(/^1[3|4|5|6|7|8|9]\d{9}$/.test(that.data.phone))) {
            wx.showToast({
                title: '手机号输入错误',
                icon: 'none',
                duration: 3000
            });
            return false;
        }

        if (interval != null) {
            clearInterval(interval);
            interval = null;
        }

        wx.request({
            url: app.globalData.domain + '/member/getcode.html',
            method: 'POST',
            data: {
                app_id: app.globalData.app_id,
                uid: wx.getStorageSync('userId'),
                phone: that.data.phone,
            },
            success: function (res) {
                wx.showToast({
                    title: res.data.msg,
                    icon: 'none',
                    duration: 3000
                });
                if (res.data.state == 10) {
                    wx.navigateTo({
                        url: '/pages/user/login',
                    });
                    return false;
                }
                if (res.data.state == 1) {
                    var currentTime = 60;
                    interval = setInterval(function () {
                        currentTime--;
                        that.setData({
                            time: currentTime,
                            time_str: currentTime + '秒后重发'
                        });
                        if (currentTime <= 0) {
                            that.setData({
                                time_str: '获取验证码',
                            });
                            clearInterval(interval);
                        }
                    }, 1000);
                }
            },
        });
    },
    postHandle: function (e) {

        var that = this;

        if (that.data.phone == "") {
            wx.showToast({
                title: '请输入手机号',
                icon: 'none',
                duration: 3000
            });
            return false;
        }

        if (!(/^1[3|4|5|6|7|8|9]\d{9}$/.test(that.data.phone))) {
            wx.showToast({
                title: '手机号输入错误',
                icon: 'none',
                duration: 3000
            });
            return false;
        }

        if (that.data.code == "") {
            wx.showToast({
                title: '请输入验证码',
                icon: 'none',
                duration: 3000
            });
            return false;
        }

        wx.showLoading({
            title: '加载中...',
        });

        wx.request({
            url: app.globalData.domain + '/member/bindphone.html',
            method: 'POST',
            data: {
                app_id: app.globalData.app_id,
                uid: wx.getStorageSync('userId'),
                phone: that.data.phone,
                code: that.data.code,
            },
            success: function (res) {

                wx.showToast({
                    title: res.data.msg,
                    icon: 'none',
                    duration: 3000
                });
                if (res.data.state == 1) {
                    wx.navigateTo({
                        url: '/pages/member/index',
                    });
                }
            },
        });
    }
})
