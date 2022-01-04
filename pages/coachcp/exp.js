var app = getApp();

var startX, endX;

var moveFlag = true;// 判断执行滑动事件

Page({

    /**
     * 页面的初始数据
     */
    data: {
        show: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
        var that = this;

        that.setData({
            opentype: app.getOpentype(),
        });

        wx.showLoading({
            title: '加载中...',
        });

        wx.request({
            url: app.globalData.domain + '/coachcp/exp.html',
            method: 'POST',

            data: {
                app_id: app.globalData.app_id,
                uid: wx.getStorageSync('userId'),
                at_week: app.getStorageSync('exp_at_week'),
            },
            success: function (res) {
                wx.hideLoading();
                if (res.data.state) {
                    that.setData({
                        title: res.data.data.title,
                        copyright: res.data.data.copyright,
                        at_month: res.data.data.at_month,
                        time: res.data.data.time,
                        at_week: res.data.data.at_week,
                        index_week: res.data.data.index_week,
                        list: res.data.data.coach_time,
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
    change: function (e) {
        var that = this;
        that.setData({
            at_week: e.currentTarget.dataset.week,
            index_week: e.currentTarget.dataset.index,
        });
        this.getData();
    },

    touchStart: function (e) {

        startX = e.touches[0].pageX; // 获取触摸时的原点

        moveFlag = true;
    },

    // 触摸移动事件
    touchMove: function (e) {

        endX = e.touches[0].pageX; // 获取触摸时的原点

        if (moveFlag) {

            if (endX - startX > 100) {
                this.move2right();
                moveFlag = false;
            }

            if (startX - endX > 100) {
                this.move2left();
                moveFlag = false;
            }
        }
    },

    // 触摸结束事件
    touchEnd: function (e) {
        moveFlag = true; // 回复滑动事件
    },

    //向左滑动操作
    move2left() {
        var that = this;

        var index_week = that.data.index_week - 1;

        if (index_week < 0) {
            index_week = 0;
        }

        if (index_week != that.data.index_week) {
            var time = that.data.time;

            var at_week = time[index_week].week;

            that.setData({
                at_week: at_week,
                index_week: index_week,
            });

            this.getData();
        }
    },

    //向右滑动操作
    move2right() {
        var that = this;

        var index_week = that.data.index_week + 1;

        if (index_week > 6) {
            index_week = 6;
        }

        if (index_week != that.data.index_week) {
            var time = that.data.time;

            var at_week = time[index_week].week;

            that.setData({
                at_week: at_week,
                index_week: index_week,
            });

            this.getData();
        }
    },
    getData() {

        var that = this;

        wx.showLoading({
            title: '加载中...',
        });

        app.setStorageSync('exp_at_week', that.data.at_week, 1);

        wx.request({
            url: app.globalData.domain + '/coachcp/exp.html',
            method: 'POST',
            data: {
                app_id: app.globalData.app_id,
                uid: wx.getStorageSync('userId'),
                at_week: that.data.at_week,
            },
            success: function (res) {
                wx.hideLoading();
                if (res.data.state) {
                    that.setData({
                        list: res.data.data.coach_time,
                    });
                }
            },
        });
    },
    status: function (e) {
        var that = this;

        var id = e.currentTarget.dataset.id;

        wx.showActionSheet({
            itemList: ['取消预约', '标记成已上课'],
            success: function (res) {
                if (!res.cancel) {

                    wx.showLoading({
                        title: '加载中...',
                    });

                    wx.request({
                        url: app.globalData.domain + '/coachcp/exp.html',
                        method: 'POST',
                        data: {
                            app_id: app.globalData.app_id,
                            uid: wx.getStorageSync('userId'),
                            at_week: that.data.at_week,
                            id: id,
                            status: res.tapIndex,
                        },
                        success: function (res) {
                            wx.hideLoading();
                            if (res.data.state == 1) {
                                that.setData({
                                    list: res.data.data.coach_time,
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
    show: function(e) {
        var that = this;

        var k = e.currentTarget.dataset.k;

        var stime = that.data.list[k].stime;
        var stime_str = that.data.list[k].stime_str;

        var timestamp = Date.parse(new Date());
        timestamp = timestamp / 1000;

        if (stime < timestamp) {
            wx.showToast({
                title: '该时间段已过期',
                icon: 'none',
                duration: 3000
            });
            return false;
        }

        wx.showLoading({
            title: '加载中...',
        });

        wx.request({
            url: app.globalData.domain + '/coachcp/getlesson.html',
            method: 'POST',
            data: {
                app_id: app.globalData.app_id,
                uid: wx.getStorageSync('userId'),
            },
            success: function (res) {
                wx.hideLoading();

                that.setData({
                    show: true,
                    stime: stime,
                    stime_str: stime_str,
                    lesson: res.data.data.lesson,
                });
            },
        });
    },
    close: function() {
        this.setData({
            show: false,
        })
    },
    selectLesson: function (e) {
        var that = this;

        that.setData({
            lesson_id: e.currentTarget.dataset.id,
        });

        wx.showLoading({
            title: '加载中...',
        });

        wx.request({
            url: app.globalData.domain + '/coachcp/getcustomer.html',
            method: 'POST',
            data: {
                app_id: app.globalData.app_id,
                uid: wx.getStorageSync('userId'),
                lesson_id: e.currentTarget.dataset.id,
            },
            success: function (res) {
                wx.hideLoading();

                that.setData({
                    membership: res.data.data.membership,
                });
            },
        });
    },
    selectMs: function (e) {
        var that = this;

        that.setData({
            ms_id: e.currentTarget.dataset.id,
        });
    },
    submit: function (e) {
        var that = this;

        if (!that.data.lesson_id) {
            wx.showToast({
                title: '请选择课程',
                icon: 'none',
                duration: 3000
            });
            return false;
        }

        if (!that.data.ms_id) {
            wx.showToast({
                title: '请选择会籍',
                icon: 'none',
                duration: 3000
            });
            return false;
        }

        wx.showLoading({
            title: '加载中...',
        });

        wx.request({
            url: app.globalData.domain + '/coachcp/exp.html',
            method: 'POST',
            data: {
                app_id: app.globalData.app_id,
                uid: wx.getStorageSync('userId'),
                at_week: that.data.at_week,
                stime: that.data.stime,
                lesson_id: that.data.lesson_id,
                ms_id: that.data.ms_id,
            },
            success: function (res) {
                wx.hideLoading();
                if (res.data.state == 1) {
                    that.setData({
                        show: false,
                        list: res.data.data.coach_time,
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
})
