import { html2json } from '../../static/js/html2json.js';

var app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        week_arr: ['日', '一', '二', '三', '四', '五', '六'],
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
            url: app.globalData.domain + '/sign/index.html',
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
                    var content = res.data.data.setting.content;
                    var regex = new RegExp('<img', 'gi');
                    content = content.replace(regex, `<img style="width: 100%;"`);

                    that.setData({
                        title: res.data.data.year + '年' + res.data.data.month + '月',
                        copyright: res.data.data.copyright,
                        year: res.data.data.year,
                        month: res.data.data.month,
                        week: res.data.data.week,
                        sign: res.data.data.sign,
                        list: res.data.data.list,
                        today_key: res.data.data.today_key,
                        setting: res.data.data.setting,
                        time_sign: res.data.data.time_sign,
                        content: html2json(content),
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
    sign: function (e) {
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
            url: app.globalData.domain + '/sign/sign.html',
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
                        sign: 0,
                    });
                    var up = "list[" + that.data.today_key + "].sign";
                    that.setData({
                        [up]: 2
                    });
                }

                wx.showToast({
                    title: res.data.msg,
                    icon: 'none',
                    duration: 3000
                });
            },
        });
    },
})
