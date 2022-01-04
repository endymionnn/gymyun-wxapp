var app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {

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
            url: app.globalData.domain + '/pay/index.html',
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
                        title: res.data.data.title,
                        copyright: res.data.data.copyright,
                        pay: res.data.data.pay,
                        user: res.data.data.user,
                        shop: res.data.data.shop,
                    });

                    if (res.data.data.pay.total == 0) {
                        that.dopay();

                        that.setData({
                            show: 0,
                        });
                    } else {
                        that.setData({
                            show: 1,
                        });
                    }
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
    pay: function () {
        var that = this;
        that.dopay();
    },
    dopay() {
        var that = this;

        wx.showLoading({
            title: '加载中...',
        });

        wx.request({
            url: app.globalData.domain + '/pay/handle.html',
            method: 'POST',
            data: {
                app_id: app.globalData.app_id,
                uid: wx.getStorageSync('userId'),
                id: that.data.pay.id,
            },
            success: function (res) {
                wx.hideLoading();
                if (res.data.state == 0) {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                        duration: 3000
                    });
                    return false;
                } else {

                    var jump_url = '';

                    if (that.data.pay.type == 'vip') {
                        jump_url = '/pages/card/my';
                    }
                    if (that.data.pay.type == 'groupcard') {
                        jump_url = '/pages/groupcard/my';
                    }
                    if (that.data.pay.type == 'coach') {
                        jump_url = '/pages/member/pt';
                    }
                    if (that.data.pay.type == 'group') {
                        jump_url = '/pages/member/gt';
                    }
                    if (that.data.pay.type == 'money') {
                        jump_url = '/pages/member/money';
                    }
                    if (that.data.pay.type == 'gym') {
                        jump_url = '/pages/member/gym';
                    }
                    if (that.data.pay.type == 'mall_credit') {
                        jump_url = '/pages/mall/creditorder';
                    }
                    if (that.data.pay.type == 'space') {
                        jump_url = '/pages/space/my';
                    }
                    if (that.data.pay.type == 'deposit_gym') {
                        jump_url = '/pages/deposit/index';
                    }
                    if (that.data.pay.type == 'buffet') {
                        jump_url = '/pages/buffet/order';
                    }
                }

                if (res.data.data.online == 0) {
                    wx.redirectTo({
                        url: jump_url,
                    });
                } else {

                    wx.requestPayment({
                        'appId': res.data.data.jsapi.appId,
                        'timeStamp': res.data.data.jsapi.timeStamp,
                        'nonceStr': res.data.data.jsapi.nonceStr,
                        'package': res.data.data.jsapi.package,
                        'signType': res.data.data.jsapi.signType,
                        'paySign': res.data.data.jsapi.paySign,
                        'success': function (res) {
                            wx.showToast({
                                title: '支付成功',
                                icon: 'none',
                                duration: 3000
                            });

                            setTimeout(function () {
                                wx.redirectTo({
                                    url: jump_url,
                                });
                            }, 3000);
                            return false;
                        },
                        'fail': function (res) {
                            wx.showToast({
                                title: '支付失败',
                                icon: 'none',
                                duration: 3000
                            });

                            setTimeout(function () {
                                wx.navigateBack({
                                    delta: 1
                                })
                            }, 3000);

                            return false;
                        }
                    });
                }
            },
        });
    }
})
