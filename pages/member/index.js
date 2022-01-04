var app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        title: '个人中心',
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

        that.setData({
            show_faxian: wx.getStorageSync('footerFaxian'),
            lesson_coach: wx.getStorageSync('footerCoach'),
            lesson_group: wx.getStorageSync('footerGroup'),
            shop_id: wx.getStorageSync('shopId'),
        });

        wx.showLoading({
            title: '加载中...',
        });

        wx.request({
            url: app.globalData.domain + '/member/index.html',
            method: 'POST',
            data: {
                app_id: app.globalData.app_id,
                uid: wx.getStorageSync('userId'),
            },
            success: function (res) {
                wx.hideLoading();
                if (res.data.state) {
                    that.setData({
                        copyright: res.data.data.copyright,
                        wxapp_global: res.data.data.wxapp_global,
                        coach: res.data.data.coach,
                        staff: res.data.data.staff,
                        manage: res.data.data.manage,
                        show_phone: res.data.data.show_phone,
                        show_lesson: res.data.data.show_lesson,
                        show_bodyfit: res.data.data.show_bodyfit,
                        show_fans: res.data.data.show_fans,
                        show_follow: res.data.data.show_follow,
                        show_gym: res.data.data.show_gym,
                        show_activity: res.data.data.show_activity,
                        credits: res.data.data.credits,
                        show_mall_credit: res.data.data.show_mall_credit,
                        show_face: res.data.data.show_face,
                        show_groupcard: res.data.data.show_groupcard,
                        show_space: res.data.data.show_space,
                        show_deposit: res.data.data.show_deposit,
                        show_buffet: res.data.data.show_buffet,
                        show_consume: res.data.data.show_consume,
                        invisible: res.data.data.invisible,
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
    phoneCall: function (e) {
        wx.makePhoneCall({
            phoneNumber: e.currentTarget.dataset.phone,
        });
    },
    invisibleChange: function () {
        var that = this;
        if (!wx.getStorageSync('userId')) {
            wx.navigateTo({
                url: '/pages/user/login',
            });
            return false;
        }
        wx.request({
            url: app.globalData.domain + '/user/invisible.html',
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
                if (res.data.state) {
                    that.setData({
                        invisible: res.data.invisible,
                    });
                }
            },
        });
    }
})
