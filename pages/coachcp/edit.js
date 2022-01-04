var app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        title: '个人资料',
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

        wx.showLoading({
            title: '加载中...',
        });

        wx.request({
            url: app.globalData.domain + '/coachcp/edit.html',
            method: 'POST',
            data: {
                app_id: app.globalData.app_id,
                uid: wx.getStorageSync('userId'),
            },
            success: function (res) {
                wx.hideLoading();
                if (res.data.state) {
                    if (!res.data.data.coach) {
                        wx.navigateTo({
                            url: '/pages/index/index',
                        });
                    }
                    that.setData({
                        copyright: res.data.data.copyright,
                        coach: res.data.data.coach,
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
    genderChange: function (e) {
        var that = this;

        var up = "coach.gender";
        that.setData({
            [up]: e.detail.value
        });
    },
    edit: function (e) {
        var that = this;

        var edit = e.detail.value;

        if (!edit.realname) {
            wx.showToast({
                title: '姓名不能为空',
                icon: 'none',
                duration: 3000
            });
            return false;
        }
        wx.request({
            url: app.globalData.domain + '/coachcp/edit.html',
            method: 'POST',
            data: {
                app_id: app.globalData.app_id,
                uid: wx.getStorageSync('userId'),
                edit: 1,
                realname: edit.realname,
                gender: that.data.coach.gender,
                mobile: edit.mobile,
                description: edit.description,
                content: edit.content,
            },
            success: function (res) {
                wx.showToast({
                    title: '保存成功',
                    icon: 'none',
                    duration: 5000
                });
            }
        });
    }
})
