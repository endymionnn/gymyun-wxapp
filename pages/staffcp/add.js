var app = getApp();

Page({

    data: {
        genderIndex: 1,
        sourceIndex: 1,
        saleIndex: 1,
        gymIndex: 1,
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

        wx.showLoading({
            title: '加载中...',
        });

        wx.request({
            url: app.globalData.domain + '/staffcp/add.html',
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
                        gender_type: res.data.data.gender_type,
                        source_type: res.data.data.source_type,
                        sale_type: res.data.data.sale_type,
                        gym_type: res.data.data.gym_type,
                        data: res.data.data.data,
                        genderIndex: res.data.data.data.gender,
                        sourceIndex: res.data.data.data.source_type,
                        saleIndex: res.data.data.data.sale_type,
                        date: res.data.data.data.b,
                        coupon: res.data.data.coupon,
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
    bindGenderChange: function(e) {
        this.setData({
            genderIndex: e.detail.value
        })
    },
    bindDateChange: function (e) {
        this.setData({
            date: e.detail.value
        })
    },
    bindSourceChange: function(e) {
        this.setData({
            sourceIndex: e.detail.value
        })
    },
    bindSaleChange: function(e) {
        this.setData({
            saleIndex: e.detail.value
        })
    },
    bindGymChange: function(e) {
        this.setData({
            gymIndex: e.detail.value
        })
    },
    couponChange: function(e) {

        var coupon = this.data.coupon, values = e.detail.value;
        for (var i = 0, lenI = coupon.length; i < lenI; ++i) {
            coupon[i].checked = 0;
            for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
                if (coupon[i].id == values[j]) {
                    coupon[i].checked = 1;
                    break;
                }
            }
        }

        this.setData({
            coupon: coupon
        });
    },
    handle: function (e) {
        var that = this;
        var data = e.detail.value;

        if (!data.realname) {
            wx.showToast({
                title: '请输入真实姓名',
                icon: 'none',
                duration: 3000
            });
            return false;
        }

        if (!data.phone) {
            wx.showToast({
                title: '请输入联系电话',
                icon: 'none',
                duration: 3000
            });
            return false;
        }

        if (that.data.data.phone && data.phone != that.data.data.phone) {
            wx.showToast({
                title: '联系电话不可修改',
                icon: 'none',
                duration: 3000
            });
            return false;
        }

        wx.request({
            url: app.globalData.domain + '/staffcp/add.html',
            method: 'POST',
            data: {
                app_id: app.globalData.app_id,
                uid: wx.getStorageSync('userId'),
                op: 'post',
                id: that.data.data.id,
                realname: data.realname,
                gender: that.data.genderIndex,
                b: that.data.date,
                phone: data.phone,
                source_type: that.data.sourceIndex,
                sale_type: that.data.saleIndex,
                gym_type: that.data.gymIndex,
                remark: data.remark,
                coupon: that.data.coupon,
            },
            success: function (res) {

                if (res.data.state) {
                    wx.showModal({
                        title: '提示',
                        content: '添加客户成功',
                        confirmText: "继续添加",
                        cancelText: "返回上页",
                        success: function (res) {
                            if (res.confirm) {
                                wx.redirectTo({
                                    url: '/pages/staffcp/add',
                                });
                            } else {
                                wx.navigateBack({
                                    delta: 1
                                });
                            }
                        }
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
