var app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        type: 0,
        type_key: 0,
        type_arr: [],
        show_shop: 0,
        shop_id: 0,
        shop_key: 0,
        shop_arr: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
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
            url: app.globalData.domain + '/consume/index.html',
            method: 'POST',
            data: {
                app_id: app.globalData.app_id,
            },
            success: function (res) {
                wx.hideLoading();
                that.setData({
                    title: res.data.title,
                    copyright: res.data.copyright,
                    type_arr: res.data.type_arr,
                });
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
    typeChange: function (e) {
        var that = this;
        that.setData({
            type_key: e.detail.value,
            type: that.data.type_arr[e.detail.value].id
        });
        if (that.data.type_arr[e.detail.value].id == 1) {
            that.setData({
                show_shop: 1
            });
            wx.showLoading({
                title: '加载中...',
            });

            wx.request({
                url: app.globalData.domain + '/consume/shop.html',
                method: 'POST',
                data: {
                    app_id: app.globalData.app_id,
                    type: 1,
                },
                success: function (res) {
                    wx.hideLoading();
                    that.setData({
                        shop_arr: res.data
                    });
                },
            });
        }
    },
    shopChange: function (e) {
        var that = this;
        that.setData({
            shop_key: e.detail.value,
            shop_id: that.data.shop_arr[e.detail.value].id
        });
    },
    post: function (e) {
        var that = this;

        if (!wx.getStorageSync('userId')) {
            wx.navigateTo({
                url: '/pages/user/login',
            });
            return false;
        }

        if (that.data.type == 0) {
            wx.showToast({
                title: '请选择类型',
                icon: 'none',
                duration: 3000
            });
            return false;
        }
        if (that.data.show_shop == 1 && that.data.shop_id == 0) {
            wx.showToast({
                title: '请选择门店',
                icon: 'none',
                duration: 3000
            });
            return false;
        }

        var post = e.detail.value;

        if (!post.code) {
            wx.showToast({
                title: '券码不能为空',
                icon: 'none',
                duration: 3000
            });
            return false;
        }
        if (post.num < 1) {
            wx.showToast({
                title: '兑换数量错误',
                icon: 'none',
                duration: 3000
            });
            return false;
        }
        wx.request({
            url: app.globalData.domain + '/consume/post.html',
            method: 'POST',
            data: {
                app_id: app.globalData.app_id,
                uid: wx.getStorageSync('userId'),
                type: that.data.type,
                shop_id: that.data.shop_id,
                code: post.code,
                num: post.num,
            },
            success: function (res) {
                wx.showToast({
                    title: res.data.msg,
                    icon: 'none',
                    duration: 3000
                });
                return false;
            }
        });
    }
})
