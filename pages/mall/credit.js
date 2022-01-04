var app = getApp();

var page = 1;
var load_more = true;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        is_list: 1,
        title: '微商城',
        cate_id: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;

        that.setData({
            opentype: app.getOpentype(),
        });

        that.setData({
            shop_id: options.shop_id,
        });

        page = 1;
        load_more = true;

        wx.showLoading({
            title: '加载中...',
        });

        wx.request({
            url: app.globalData.domain + '/mall/credit.html',
            method: 'POST',
            data: {
                app_id: app.globalData.app_id,
                shop_id: options.shop_id,
                page: 1,
            },
            success: function (res) {
                wx.hideLoading();
                if (res.data.state) {
                    that.setData({
                        copyright: res.data.data.copyright,
                        list: res.data.data.list,
                        is_list: res.data.data.is_list,
                        cate: res.data.data.cate,
                        is_cate: res.data.data.is_cate,
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
    change: function (e) {
        var that = this;
        that.setData({
            cate_id: e.currentTarget.dataset.id,
        });
        this.getList();
    },
    getList() {
        var that = this;

        wx.showLoading({
            title: '加载中...',
        });

        wx.request({
            url: app.globalData.domain + '/mall/credit.html',
            method: 'POST',
            data: {
                app_id: app.globalData.app_id,
                shop_id: that.data.shop_id,
                cate_id: that.data.cate_id,
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
