var app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        title: '会籍管理中心',
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
            url: app.globalData.domain + '/staffcp/index.html',
            method: 'POST',
            data: {
                app_id: app.globalData.app_id,
                uid: wx.getStorageSync('userId'),
            },
            success: function (res) {
                wx.hideLoading();
                if (res.data.state) {
                    if (res.data.data.is_staff == 0) {
                        wx.navigateTo({
                            url: '/pages/index/index',
                        });
                    }
                    that.setData({
                        copyright: res.data.data.copyright,
                        staff: res.data.data.staff,
                        add_y: res.data.data.add_y,
                        add_t: res.data.data.add_t,
                        exp_y: res.data.data.exp_y,
                        exp_t: res.data.data.exp_t,
                        ordered_y: res.data.data.ordered_y,
                        ordered_t: res.data.data.ordered_t,
                        add_total: res.data.data.add_total,
                        exp_total: res.data.data.exp_total,
                        ordered_total: res.data.data.ordered_total,
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
})
