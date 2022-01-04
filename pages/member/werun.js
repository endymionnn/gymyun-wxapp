var app = getApp();

var page = 1;
var load_more = true;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        is_list: 1,
        title: '微信运动',
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

        if (wx.getStorageSync('session_key')) {

            wx.getWeRunData({
                success(res) {
                    wx.showLoading({
                        title: '数据更新中',
                    });
                    wx.request({
                        url: app.globalData.domain + '/werun/post.html',
                        method: 'POST',
                        data: {
                            app_id: app.globalData.app_id,
                            uid: wx.getStorageSync('userId'),
                            session_key: wx.getStorageSync('session_key'),
                            encryptedData: res.encryptedData,
                            iv: res.iv,
                        },
                        success(r) {
                            wx.hideLoading();

                            if (r.data.state == 100) {
                                wx.navigateTo({
                                    url: '/pages/user/mobile',
                                });
                                return false;
                            }

                            if (r.data.state == 0) {
                                wx.setStorageSync('userId', 0);
                                wx.setStorageSync('session_key', '');

                                wx.navigateTo({
                                    url: '/pages/user/login',
                                });
                                return false;
                            } else {
                                var timestamp = Date.parse(new Date());
                                timestamp = timestamp / 1000;

                                if (wx.getStorageSync('weruntime') < timestamp) {
                                    timestamp = timestamp + 300;

                                    wx.setStorageSync("weruntime", timestamp);

                                    wx.navigateTo({
                                        url: '/pages/member/werun',
                                    });
                                    return false;
                                }
                            }
                        },
                    })
                }
            });
        }

        page = 1;
        load_more = true;

        wx.showLoading({
            title: '加载中...',
        });

        wx.request({
            url: app.globalData.domain + '/werun/get.html',
            method: 'POST',
            data: {
                app_id: app.globalData.app_id,
                uid: wx.getStorageSync('userId'),
                page: 1,
            },
            success: function (res) {
                wx.hideLoading();
                if (res.data.state) {
                    that.setData({
                        copyright: res.data.data.copyright,
                        list: res.data.data.list,
                        is_list: res.data.data.is_list,
                    });
                    if (res.data.data.more) {
                        page++;
                    } else {
                        load_more = false;
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
        if (load_more == false) {
            return false;
        }
        this.getList();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    getList() {
        var that = this;

        wx.showLoading({
            title: '加载中...',
        });

        wx.request({
            url: app.globalData.domain + '/werun/get.html',
            method: 'POST',
            data: {
                app_id: app.globalData.app_id,
                uid: wx.getStorageSync('userId'),
                page: page,
            },
            success: function (res) {
                wx.hideLoading();

                if (res.data.state == 100) {
                    wx.navigateTo({
                        url: '/pages/user/mobile',
                    });
                    return false;
                }
                
                if (res.data.state) {
                    if (page == 1) {
                        var list = res.data.data.list;
                    } else {
                        var list = that.data.list.concat(res.data.data.list);
                    }

                    that.setData({
                        list: list,
                    });

                    if (res.data.data.more) {
                        page++;
                    } else {
                        load_more = false;
                    }
                }
            },
        });
    },
    redeem: function (e) {
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
            url: app.globalData.domain + '/werun/redeem.html',
            method: 'POST',
            data: {
                app_id: app.globalData.app_id,
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
                
                var credits = that.data.list[e.currentTarget.dataset.index].credits;
                if (res.data.state) {
                    credits = 0;
                }
                var up = "list[" + e.currentTarget.dataset.index + "].credits";
                that.setData({
                    [up]: credits
                });
                wx.showToast({
                    title: res.data.msg,
                    icon: 'none',
                    duration: 3000
                });
            },
        });
    },
})
