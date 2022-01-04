var app = getApp();

var startX, endX;

var moveFlag = true;// 判断执行滑动事件

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

        that.setData({
            shop_id: options.id,
        });

        wx.showLoading({
            title: '加载中...',
        });

        wx.request({
            url: app.globalData.domain + '/group/index.html',
            method: 'POST',

            data: {
                app_id: app.globalData.app_id,
                id: options.id,
                at_week: app.getStorageSync('group_at_week'),
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
                        list: res.data.data.list,
                        is_list: res.data.data.is_list,
                        shop: res.data.data.shop,
                        show_faxian: res.data.data.show_faxian,
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

        app.setStorageSync('group_at_week', that.data.at_week, 1);

        wx.request({
            url: app.globalData.domain + '/group/index.html',
            method: 'POST',
            data: {
                app_id: app.globalData.app_id,
                id: that.data.shop_id,
                at_week: that.data.at_week,
            },
            success: function (res) {
                wx.hideLoading();
                if (res.data.state) {
                    that.setData({
                        title: res.data.data.title,
                        list: res.data.data.list,
                        is_list: res.data.data.is_list,
                    });
                }
            },
        });
    }
})
