var app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        day: 0,
        time: [],
        position_check_key: 10000,
        position_check: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;

        if (!options.id) {
            wx.navigateTo({
                url: '/pages/index/index',
            });
            return false;
        }

        that.setData({
            opentype: app.getOpentype(),
            id: options.id,
        });

        wx.showLoading({
            title: '加载中...',
        });

        wx.request({
            url: app.globalData.domain + '/space/view.html',
            method: 'POST',
            data: {
                app_id: app.globalData.app_id,
                id: options.id,
                day: that.data.day,
                uid: wx.getStorageSync('userId'),
            },
            success: function (res) {
                wx.hideLoading();
                if (res.data.state) {
                    that.setData({
                        title: res.data.data.title,
                        copyright: res.data.data.copyright,
                        data: res.data.data.data,
                        order_day: res.data.data.order_day,
                        order_time: res.data.data.order_time,
                        day_str: res.data.data.day_str,
                        position_list: res.data.data.position_list,
                        space_free_num: res.data.data.space_free_num,
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
    bindDay: function (e) {
        var that = this;

        that.setData({
            day: e.detail.value,
            time: [],
            position_check_key: 10000,
            position_check: [],
        });

        wx.request({
            url: app.globalData.domain + '/space/view.html',
            method: 'POST',
            data: {
                app_id: app.globalData.app_id,
                id: that.data.id,
                day: e.detail.value,
                uid: wx.getStorageSync('userId'),
            },
            success: function (res) {
                if (res.data.state) {
                    that.setData({
                        title: res.data.data.title,
                        copyright: res.data.data.copyright,
                        data: res.data.data.data,
                        order_day: res.data.data.order_day,
                        order_time: res.data.data.order_time,
                        day_str: res.data.data.day_str,
                        position_list: res.data.data.position_list,
                        space_free_num: res.data.data.space_free_num,
                    });
                }
            },
        });
    },
    bindTime: function (e) {
        var that = this;

        var index = e.currentTarget.dataset.index;
        var item = that.data.order_time[index];
        item.selected = !item.selected;

        that.setData({
            order_time: this.data.order_time,
            position_check_key: 10000,
            position_check: [],
        });

        var time = that.data.order_time.filter(it => it.selected).map(it => it.key);

        that.setData({
            time: time,
        });

        if (that.data.data.position) {
            wx.request({
                url: app.globalData.domain + '/space/view.html',
                method: 'POST',
                data: {
                    app_id: app.globalData.app_id,
                    id: that.data.id,
                    day: that.data.day,
                    time: time,
                    uid: wx.getStorageSync('userId'),
                },
                success: function (res) {
                    if (res.data.state) {
                        that.setData({
                            title: res.data.data.title,
                            copyright: res.data.data.copyright,
                            data: res.data.data.data,
                            order_day: res.data.data.order_day,
                            order_time: res.data.data.order_time,
                            day_str: res.data.data.day_str,
                            position_list: res.data.data.position_list,
                            space_free_num: res.data.data.space_free_num,
                        });
                    }
                },
            });
        }
    },
    bindPosition: function (e) {
        var that = this;
        if (!that.data.time.length) {
            wx.showToast({
                title: '请选择预约时间',
                icon: 'none',
                duration: 3000
            });
            return false;
        }

        var c_key = e.currentTarget.dataset.index;

        that.setData({
            position_check_key: c_key,
            position_check: that.data.position_list[c_key],
        });

        return false;
    },
    buy: function () {
        var that = this;

        if (!that.data.time.length) {
            wx.showToast({
                title: '请选择预约时间',
                icon: 'none',
                duration: 3000
            });
            return false;
        }

        if (that.data.position_list.length && !that.data.position_check.id) {
            wx.showToast({
                title: '请选择位置',
                icon: 'none',
                duration: 3000
            });
            return false;
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
            url: app.globalData.domain + '/space/order.html',
            method: 'POST',
            data: {
                app_id: app.globalData.app_id,
                uid: wx.getStorageSync('userId'),
                id: that.data.data.id,
                day: that.data.day,
                time: that.data.time,
                position_id: that.data.position_check.id,
            },
            success: function (res) {
                wx.hideLoading();
                if (res.data.state == 100) {
                    wx.navigateTo({
                        url: '/pages/user/mobile',
                    });
                    return false;
                }

                if (res.data.state == 1) {
                    if (res.data.data.id) {
                        wx.navigateTo({
                            url: '/pages/pay/index?id=' + res.data.data.id,
                        });
                    } else {
                        wx.navigateTo({
                            url: '/pages/space/my',
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
    },
})
