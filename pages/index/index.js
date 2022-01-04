var app = getApp();

var page = 1;
var load_more = true;

Page({
    data: {
        is_list: 0,
        show: 0,
        msg: '门店歇业中，过会儿再来吧！',
        statusBarHeight: app.globalData.statusBarHeight,
        titleBarHeight: app.globalData.titleBarHeight,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
        var that = this;

        that.setData({
            opentype: app.getOpentype(),
        });

        if (wx.getStorageSync('page_index_index')) {
            var data = wx.getStorageSync('page_index_index');

            if (data.is_list == 1) {
                wx.redirectTo({
                    url: '/pages/shop/index?id=' + data.list[0].id,
                });
                return false;
            }

            that.setData({
                title: data.title,
                copyright: data.copyright,
                list: data.list,
                is_list: data.is_list,
                show: 1,
            });
        } else {
            this.pageLoad();
        }
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
        this.pageLoad();
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
    pageLoad() {
        var that = this;

        page      = 1;
        load_more = true;

        wx.getLocation({
            type: 'gcj02',
            success: function (res) {
                wx.setStorageSync('lat', res.latitude);
                wx.setStorageSync('lng', res.longitude);
                that.getPageLoad(res.latitude, res.longitude);
            },
            fail: function (res) {
                that.getPageLoad(0, 0);
            }
        });
    },
    getPageLoad(lat, lng) {
        var that = this;
        wx.showLoading({
            title: '加载中...',
        });
        wx.request({
            url: app.globalData.domain + '/index/index.html',
            method: 'POST',
            data: {
                app_id: app.globalData.app_id,
                lat: lat,
                lng: lng,
                uid: wx.getStorageSync('userId'),
                page: 1,
            },
            success: function (res) {
                wx.hideLoading();
                if (res.data.state == 100) {
                    wx.navigateTo({
                        url: '/pages/member/phone',
                    });
                    return false;
                }
                if (res.data.state) {
                    if (res.data.state == 200) {
                        that.setData({
                            title: res.data.data.title,
                            msg: res.data.data.msg,
                            is_list: 0,
                            show: 1,
                        });
                    } else {
                        wx.setStorageSync('page_index_index', res.data.data);
                        if (res.data.data.is_list == 1) {
                            wx.redirectTo({
                                url: '/pages/shop/index?id=' + res.data.data.list[0].id,
                            });
                            return false;
                        }

                        that.setData({
                            title: res.data.data.title,
                            copyright: res.data.data.copyright,
                            list: res.data.data.list,
                            is_list: res.data.data.is_list,
                            show: 1,
                        });

                        if (res.data.data.more) {
                            page++;
                        } else {
                            load_more = false;
                        }
                    }
                }
            },
        });
    },
    getList() {
        var that = this;

        wx.showLoading({
            title: '加载中...',
        });

        wx.request({
            url: app.globalData.domain + '/index/index.html',
            method: 'POST',
            data: {
                app_id: app.globalData.app_id,
                lat: wx.getStorageSync('lat'),
                lng: wx.getStorageSync('lng'),
                page: page,
            },
            success: function (res) {
                wx.hideLoading();
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
})
