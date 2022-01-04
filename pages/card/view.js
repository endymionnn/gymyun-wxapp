import Poster from '../../components/canvas-poster/poster/poster';

var app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isAgree: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;

        that.setData({
            opentype: app.getOpentype(),
        });

        if (options.scene) {
            var scene = decodeURIComponent(options.scene).split('-');
            options.id      = scene[0];
            options.shop_id = scene[1];

            wx.setStorageSync('shopId', scene[1]);
            wx.setStorageSync('card_'+ options.id, scene[2]);
        }

        if (!options.id || !options.shop_id) {
            wx.navigateTo({
                url: '/pages/index/index',
            });
            return false;
        }

        that.setData({
            shop_id: options.shop_id,
        });

        wx.showLoading({
            title: '加载中...',
        });

        wx.request({
            url: app.globalData.domain + '/card/view.html',
            method: 'POST',

            data: {
                app_id: app.globalData.app_id,
                id: options.id,
                shop_id: options.shop_id,
                uid: wx.getStorageSync('userId'),
            },
            success: function(res) {
                wx.hideLoading();
                if (res.data.state) {
                    that.setData({
                        title: res.data.data.title,
                        copyright: res.data.data.copyright,
                        data: res.data.data.data,
                        list: res.data.data.list,
                        is_list: res.data.data.is_list,
                        poster: res.data.data.poster,
                    });
                }
            },
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
        var that = this;
        return {
            title: that.data.data.name,
            imageUrl: that.data.data.bgimg,
            path: '/pages/card/view?scene='+ that.data.data.id +'-'+ that.data.shop_id +'-'+ wx.getStorageSync('userId'),
        };
    },
    bindAgreeChange: function(e) {
        this.setData({
            isAgree: !!e.detail.value.length
        });
    },
    buy: function() {
        var that = this;

        if (!wx.getStorageSync('userId')) {
            wx.navigateTo({
                url: '/pages/user/login',
            });
            return false;
        }

        if (!that.data.isAgree) {
            wx.showToast({
                title: '您还未同意协议',
                icon: 'none',
                duration: 3000
            });
            return false;
        }

        wx.showActionSheet({
            itemList: ['立即开卡', '到店开卡'],
            success: function(res) {
                if (!res.cancel) {

                    wx.showLoading({
                        title: '加载中...',
                    });

                    if (res.tapIndex == 0) {
                        var jh_type = 1;
                    }

                    if (res.tapIndex == 1) {
                        var jh_type = 3;
                    }

                    wx.request({
                        url: app.globalData.domain + '/card/buy.html',
                        method: 'POST',
                        data: {
                            app_id: app.globalData.app_id,
                            uid: wx.getStorageSync('userId'),
                            level_id: that.data.data.id,
                            shop_id: that.data.shop_id,
                            tui_uid: wx.getStorageSync('card_'+ that.data.data.id),
                            jh_type: jh_type,
                        },
                        success: function(res) {
                            wx.hideLoading();
                            if (res.data.state == 100) {
                                wx.navigateTo({
                                    url: '/pages/user/mobile',
                                });
                                return false;
                            }
                            if (res.data.state == 1) {
                                if (res.data.data.id) {
                                    wx.navigateTo({
                                        url: '/pages/pay/index?id=' + res.data.data.id,
                                    });
                                } else {
                                    wx.navigateTo({
                                        url: '/pages/card/my',
                                    });
                                }
                            } else {
                                wx.showToast({
                                    title: res.data.msg,
                                    icon: 'none',
                                    duration: 3000
                                });
                            }
                        },
                    });
                }
            }
        });
    },
    onPosterSuccess(e) {
        this.setData({
            share_qrcode_img: e.detail,
        });
    },
    onPosterFail(err) {
        console.error(err);
    },
    clearQrcode: function() {
        this.setData({
            share_qrcode_img: '',
        });
    },
    saveQrcode: function() {
        var that = this;
        wx.saveImageToPhotosAlbum({
            filePath: that.data.share_qrcode_img,
            success(res) {
                wx.showToast({
                    title: '已保存到相册',
                    icon: 'none',
                    duration: 3000
                });
            },
            fail(err) {
                wx.openSetting({});
            }
        });
    },
})
