var app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        is_list: 1,
        show: false,
        select_day: 0,
        select_hour: 0,
        show_order: 0,
        title: '私教课程详情',
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
            url: app.globalData.domain + '/member/showpt.html',
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
                        list: res.data.data.list,
                        is_list: res.data.data.is_list,
                        data: res.data.data.data,
                        qrcode: res.data.data.qrcode,
                        exp_time: res.data.data.exp_time,
                        day: res.data.data.day,
                        show_order: res.data.data.show_order,
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

    onTab: function() {
        this.setData({
            show: true
        })
    },

    close: function() {
        this.setData({
            show: false,
        })
    },
    selectDay: function (e) {
        var that = this;

        that.setData({
            select_day: e.currentTarget.dataset.day,
        });

        wx.showLoading({
            title: '加载中...',
        });

        wx.request({
            url: app.globalData.domain + '/member/gethour.html',
            method: 'POST',
            data: {
                app_id: app.globalData.app_id,
                coach_id: that.data.data.coach_id,
                day: e.currentTarget.dataset.day,
            },
            success: function (res) {
                wx.hideLoading();
                if (res.data.state) {
                    that.setData({
                        hour: res.data.data.hour,
                    });
                }
            },
        });
    },
    selectHour: function (e) {
        var that = this;

        that.setData({
            select_hour: e.currentTarget.dataset.hour,
        });
    },
    submit: function (e) {
        var that = this;

        if (!that.data.select_day) {
            wx.showToast({
                title: '请选择预约日期',
                icon: 'none',
                duration: 3000
            });
            return false;
        }

        if (!that.data.select_hour) {
            wx.showToast({
                title: '请选择预约时间段',
                icon: 'none',
                duration: 3000
            });
            return false;
        }

        wx.showLoading({
            title: '加载中...',
        });

        wx.request({
            url: app.globalData.domain + '/member/coachorder.html',
            method: 'POST',
            data: {
                app_id: app.globalData.app_id,
                uid: wx.getStorageSync('userId'),
                order_id: that.data.data.id,
                exp_day: that.data.select_day,
                exp_hour: that.data.select_hour,
            },
            success: function (res) {
                wx.hideLoading();
                wx.showToast({
                    title: res.data.msg,
                    icon: 'none',
                    duration: 3000
                });

                if (res.data.state == 1) {
                    that.setData({
                        list: res.data.data.list,
                        is_list: 1,
                        show_order: res.data.data.show_order,
                    });
                    that.close();
                }
            },
        });
    },
    cancel: function (e) {
        var that = this;
        var key = e.currentTarget.dataset.key;
        var id  = e.currentTarget.dataset.id;

        wx.showActionSheet({
            itemList: ['取消预约'],
            success: function (res) {
                if (!res.cancel) {
                    wx.request({
                        url: app.globalData.domain + '/member/cancelorder.html',
                        method: 'POST',
                        data: {
                            app_id: app.globalData.app_id,
                            uid: wx.getStorageSync('userId'),
                            id: id,
                        },
                        success: function (res) {
                            wx.hideLoading();
                            wx.showToast({
                                title: res.data.msg,
                                icon: 'none',
                                duration: 3000
                            });

                            if (res.data.state == 1) {
                                var status = "list[" + key + "].status";
                                var status_cn = "list[" + key + "].status_cn";
                                that.setData({
                                    [status]: 0,
                                    [status_cn]: '已取消',
                                });
                            }
                        },
                    });
                }
            }
        });
    }
})
