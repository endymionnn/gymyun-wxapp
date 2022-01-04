var app = getApp();

Page({
    data: {
        title: '绑定手机号码',
        show: 0,
        code: '',
    },

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

    getPhoneNumber(e) {
        var that = this;

        if (e.detail.encryptedData) {

            wx.request({
                url: app.globalData.domain + '/user/mobile.html',
                method: 'POST',
                data: {
                    app_id: app.globalData.app_id,
                    member_id: app.globalData.app_id,
                    uid: wx.getStorageSync('userId'),
                    session_key: wx.getStorageSync('session_key'),
                    encryptedData: e.detail.encryptedData,
                    iv: e.detail.iv
                },
                success(r) {
                    if (r.data.state) {
                        that.pageReturn();
                    } else {
                        wx.setStorageSync('userId', 0);
                        wx.showToast({
                            title: r.data.msg,
                            icon: 'none',
                            duration: 3000
                        });
                        return false;
                    }
                }
            })
        }
    },
    pageReturn() {

        if (wx.getStorageSync('mobile_redirect')) {
            wx.redirectTo({
                url: wx.getStorageSync('mobile_redirect'),
            });
        } else {
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
                    wx.redirectTo({
                        url: '/' + prevPage.route + '?' + options_str,
                    });
                }
            }
        }
    },
});
