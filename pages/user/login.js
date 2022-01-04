var app = getApp();

Page({
    data: {
        show: 0,
        code: '',
        mobile: 0,
        canIUseGetUserProfile: false,
    },

    onLoad: function () {
        var that = this;

        if (wx.getUserProfile) {
            this.setData({
                canIUseGetUserProfile: true
            });
        }

        that.setData({
            opentype: app.getOpentype(),
        });

        wx.request({
            url: app.globalData.domain + '/user/login.html',
            method: 'POST',
            data: {
                app_id: app.globalData.app_id,
            },
            success: function (res) {
                wx.hideLoading();
                wx.setNavigationBarTitle({
                    title: res.data.data.title
                });

                if (res.data.state) {
                    that.setData({
                        title: res.data.data.title,
                        tagline: res.data.data.tagline,
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

    onReady: function () {

    },

    onShow: function () {

        var that = this;

        setTimeout(function () {
            that.setData({
                show: 1,
            });
        }, 2000);
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
    bindGetUserInfo(e) {

        var that = this;

        var submited = false;

        if (submited) {
            return false;
        }

        submited = true;

        wx.showLoading({
            title: '加载中...',
        });

        wx.login({
            success: res => {
                wx.request({
                    url: app.globalData.domain + '/user/login.html',
                    method: 'POST',
                    data: {
                        app_id: app.globalData.app_id,
                        member_id: app.globalData.app_id,
                        nickname: e.detail.userInfo.nickName,
                        gender: e.detail.userInfo.gender,
                        headimgurl: e.detail.userInfo.avatarUrl,
                        code: res.code,
                    },
                    success: function (res) {
                        wx.hideLoading();
                        submited = false;
                        wx.setStorageSync('userId', res.data.data.user.id);
                        wx.setStorageSync('userInfo', res.data.data.user);
                        wx.setStorageSync('session_key', res.data.data.session_key);

                        if (res.data.state == 100) {
                            that.pageReturn(1);
                        } else {
                            that.pageReturn(0);
                        }
                    },
                });
            }
        });
    },
    getUserProfile(e) {
        var that = this;

        var submited = false;

        if (submited) {
            return false;
        }

        submited = true;

        wx.showLoading({
            title: '加载中...',
        });

        wx.getUserProfile({
            desc: '仅用于完善会员资料',
            success: (ee) => {
                wx.login({
                    success: res => {
                        wx.request({
                            url: app.globalData.domain + '/user/login.html',
                            method: 'POST',
                            data: {
                                app_id: app.globalData.app_id,
                                member_id: app.globalData.app_id,
                                nickname: ee.userInfo.nickName,
                                gender: ee.userInfo.gender,
                                headimgurl: ee.userInfo.avatarUrl,
                                code: res.code,
                            },
                            success: function (res) {
                                wx.hideLoading();
                                submited = false;
                                wx.setStorageSync('userId', res.data.data.user.id);
                                wx.setStorageSync('userInfo', res.data.data.user);
                                wx.setStorageSync('session_key', res.data.data.session_key);

                                if (res.data.state == 100) {
                                    that.pageReturn(1);
                                } else {
                                    that.pageReturn(0);
                                }
                            },
                        });
                    }
                });
            }
        })
    },
    pageReturn(e) {

        var pages = getCurrentPages();

        var prevPage = pages[pages.length - 2];  //上一个页面

        if (prevPage) {

            var options_str = '';

            if (prevPage.options) {
                for (var p in prevPage.options) {
                    if (p != 'page') {
                        options_str += p + '=';
                        options_str += prevPage.options[p] + '&';
                    }
                }
            }
            if (prevPage.route) {
                if (e == 1) {
                    wx.setStorageSync('mobile_redirect', '/' + prevPage.route + '?' + options_str);
                    wx.redirectTo({
                        url: '/pages/user/mobile',
                    });
                } else {
                    if (prevPage.route == 'pages/user/login') {
                        wx.redirectTo({
                            url: '/pages/index/index',
                        });
                    } else {
                        wx.redirectTo({
                            url: '/' + prevPage.route + '?' + options_str,
                        });
                    }
                }
            }
        }
    },
});
