var app = getApp();

Page({

    data: {

    },

    onLoad: function (options) {
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

        if (!options.id) {
            wx.navigateTo({
                url: '/pages/staffcp/index',
            });
            return false;
        }

        wx.showLoading({
            title: '加载中...',
        });

        wx.request({
            url: app.globalData.domain + '/staffcp/addordered.html',
            method: 'POST',
            data: {
                app_id: app.globalData.app_id,
                uid: wx.getStorageSync('userId'),
                id: options.id,
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
                        title: res.data.data.title,
                        copyright: res.data.data.copyright,
                        staff: res.data.data.staff,
                        ship: res.data.data.ship,
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
    onShow: function (options) {

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
    bindDateChange: function (e) {
        this.setData({
            date: e.detail.value
        })
    },
    bindTimeChange: function (e) {
        this.setData({
            time: e.detail.value
        })
    },
    handle: function (e) {
        var that = this;
        var data = e.detail.value;

        if (!that.data.date) {
            wx.showToast({
                title: '请选择预约日期',
                icon: 'none',
                duration: 3000
            });
            return false;
        }

        if (!that.data.time) {
            wx.showToast({
                title: '请选择预约时间',
                icon: 'none',
                duration: 3000
            });
            return false;
        }

        if (!data.remark) {
            wx.showToast({
                title: '请输入备注说明',
                icon: 'none',
                duration: 3000
            });
            return false;
        }

        wx.request({
            url: app.globalData.domain + '/staffcp/addordered.html',
            method: 'POST',
            data: {
                app_id: app.globalData.app_id,
                uid: wx.getStorageSync('userId'),
                op: 'post',
                id: that.data.ship.id,
                day: that.data.date,
                time: that.data.time,
                remark: data.remark,
            },
            success: function (res) {

                if (res.data.state) {
                    wx.redirectTo({
                        url: '/pages/staffcp/membershipview?id='+ that.data.ship.id,
                    });
                } else {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                        duration: 3000
                    });
                    return false;
                }
            }
        });
    }
})
