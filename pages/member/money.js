var app = getApp();

var page = 1;
var load_more = true;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        op: 'index',
        title: '我的钱包',
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

        page = 1;
        load_more = true;

        wx.showLoading({
            title: '加载中...',
        });

        wx.request({
            url: app.globalData.domain + '/member/money.html',
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
                        member: res.data.data.member,
                        list: res.data.data.list,
                        activity: res.data.data.activity,
                        wxapp_global: res.data.data.wxapp_global,
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
    post: function () {
        var that = this;

        that.setData({
            op: 'post',
        });
    },
    getList() {
        var that = this;

        wx.showLoading({
            title: '加载中...',
        });

        wx.request({
            url: app.globalData.domain + '/member/money.html',
            method: 'POST',
            data: {
                app_id: app.globalData.app_id,
                uid: wx.getStorageSync('userId'),
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
    postHandle: function (e) {

        var that = this;

        var data = e.detail.value;

        if (!data.money) {
            wx.showToast({
                title: '请输入充值金额',
                icon: 'none',
                duration: 3000
            });
            return false;
        }

        wx.showLoading({
            title: '加载中...',
        });

        wx.request({
            url: app.globalData.domain + '/member/money.html',
            method: 'POST',
            data: {
                app_id: app.globalData.app_id,
                uid: wx.getStorageSync('userId'),
                post: 1,
                money: data.money,
            },
            success: function (res) {
                wx.hideLoading();
                if (res.data.state == 1) {
                    wx.navigateTo({
                        url: '/pages/pay/index?id=' + res.data.data.id,
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
})
