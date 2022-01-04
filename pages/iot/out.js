var app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        show: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (query) {
        var that = this;

        that.setData({
            opentype: app.getOpentype(),
        });

        if (query.scene) {
            var scene = decodeURIComponent(query.scene);
        }
        if (query.q) {
            var scene = decodeURIComponent(query.q);
            scene = scene.split('/');
            scene = scene[10];
        }

        if (!wx.getStorageSync('userId')) {
            wx.navigateTo({
                url: '/pages/user/login',
            });
            return false;
        }

        wx.getLocation({
            type: 'gcj02',
            success: function (res) {
                that.pageLoad(scene, res.latitude, res.longitude);
            },
            fail: function (res) {
                that.pageLoad(scene, 0, 0);
            }
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

    pageLoad(id, lat, lng) {
        var that = this;
        wx.showLoading({
            title: '加载中...',
        });
        wx.request({
            url: app.globalData.domain + '/iot/out.html',
            method: 'POST',
            data: {
                app_id: app.globalData.app_id,
                uid: wx.getStorageSync('userId'),
                id: id,
                lat: lat,
                lng: lng,
            },
            success: function (res) {
                wx.hideLoading();
                that.setData({
                    show: 1,
                });
                if (res.data.state) {
                    if (res.data.data.pay_id) {
                        wx.navigateTo({
                            url: '/pages/pay/index?id=' + res.data.data.pay_id,
                        });
                        return false;
                    }
                    that.setData({
                        title: res.data.data.title,
                        copyright: res.data.data.copyright,
                        state: res.data.data.state,
                        msg: res.data.data.msg,
                        msg_sub: res.data.data.msg_sub,
                        path: res.data.data.path,
                        bt_info: res.data.data.bt_info,
                    });
                }
            },
        });
    },
})
