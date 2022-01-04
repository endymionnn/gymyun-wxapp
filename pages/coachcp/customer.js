var app = getApp();

var page = 1;
var load_more = true;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        is_list: 1,
        title: '我的客户',
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
            url: app.globalData.domain + '/coachcp/customer.html',
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
                        list: res.data.data.list,
                        is_list: res.data.data.is_list,
                        num: res.data.data.num,
                        use_num: res.data.data.use_num,
                        not_use: res.data.data.not_use,
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
    getList() {
        var that = this;

        wx.showLoading({
            title: '加载中...',
        });

        wx.request({
            url: app.globalData.domain + '/coachcp/customer.html',
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
})
