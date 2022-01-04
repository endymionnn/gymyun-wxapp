var app = getApp();

Page({

    data: {
        get_cost: 1,
    },

    onLoad: function (options) {
        var that = this;

        that.setData({
            opentype: app.getOpentype(),
            show_faxian: wx.getStorageSync('footerFaxian'),
            lesson_coach: wx.getStorageSync('footerCoach'),
            lesson_group: wx.getStorageSync('footerGroup'),
            shop_id: wx.getStorageSync('shopId'),
        });

        if (!options.id) {
            wx.navigateTo({
                url: '/pages/index/index',
            });
            return false;
        }

        wx.setStorageSync('shopId', options.id);

        if (wx.getStorageSync('page_shop_index')) {
            var data = wx.getStorageSync('page_shop_index');

            that.setData({
                title: data.title,
                copyright: data.copyright,
                shop: data.shop,
                member: data.member,
                credit: data.credit,
                width_group: data.width_group,
                show_group: data.show_group,
                group: data.group,
                width_coach: data.width_coach,
                show_coach: data.show_coach,
                coach: data.coach,
                width_lesson: data.width_lesson,
                show_lesson: data.show_lesson,
                lesson: data.lesson,

                width_space: data.width_space,
                show_space: data.show_space,
                space: data.space,

                show_faxian: data.show_faxian,
                lesson_coach: data.shop.lesson_coach,
                lesson_group: data.shop.lesson_group,
                shop_id: data.shop.id,

                show_online: data.show_online,
                online: data.online,
                online_num: data.online_num,

                article: data.article,
                card: data.card,
                width_card: data.width_card,
                card_group: data.card_group,
                w_card_group: data.w_card_group,

                activity_money: data.activity_money,
                free_card: data.free_card,
                order_gym: data.order_gym,
            });

        } else {
            that.pageLoad(options.id);
        }
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
        var that = this;

        that.pageLoad(wx.getStorageSync('shopId'));

        that.setData({
            get_cost: 1,
        });

        setInterval(function () {
            that.getCost(wx.getStorageSync('shopId'), wx.getStorageSync('userId'));
        }, 30000);

        if (that.data.free_card && that.data.free_card.id && !wx.getStorageSync('free_card_'+ wx.getStorageSync('shopId'))) {
            setTimeout(function () {
                wx.showModal({
                    title: '领取体验卡',
                    content: '您有一张'+ that.data.free_card.name +'待领取',
                    confirmText: "立即领取",
                    cancelText: "暂不提醒",
                    success: function (res) {
                        if (res.confirm) {
                            wx.redirectTo({
                                url: '/pages/card/view?id='+ that.data.free_card.id +'&shop_id=' + wx.getStorageSync('shopId'),
                            });
                        } else {
                            wx.setStorageSync('free_card_' + wx.getStorageSync('shopId'), 1);
                        }
                    }
                });
            }, 3000);
        }
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        var that = this;
        that.setData({
            get_cost: 0,
        });
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        var that = this;
        that.setData({
            get_cost: 0,
        });
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

    pageLoad(id) {
        var that = this;

        wx.showLoading({
            title: '加载中...',
        });

        wx.request({
            url: app.globalData.domain + '/shop/index.html',
            method: 'POST',

            data: {
                app_id: app.globalData.app_id,
                uid: wx.getStorageSync('userId'),
                id: id,
                lat: wx.getStorageSync('lat'),
                lng: wx.getStorageSync('lng'),
            },
            success: function (res) {
                wx.hideLoading();
                if (res.data.state) {

                    if (!res.data.data.shop) {
                        wx.navigateTo({
                            url: '/pages/index/index',
                        });
                        return false;
                    }

                    wx.setStorageSync('page_shop_index', res.data.data);

                    that.setData({
                        title: res.data.data.title,
                        copyright: res.data.data.copyright,
                        shop: res.data.data.shop,
                        member: res.data.data.member,
                        credit: res.data.data.credit,
                        width_group: res.data.data.width_group,
                        show_group: res.data.data.show_group,
                        group: res.data.data.group,
                        width_coach: res.data.data.width_coach,
                        show_coach: res.data.data.show_coach,
                        coach: res.data.data.coach,
                        width_lesson: res.data.data.width_lesson,
                        show_lesson: res.data.data.show_lesson,
                        lesson: res.data.data.lesson,

                        width_space: res.data.data.width_space,
                        show_space: res.data.data.show_space,
                        space: res.data.data.space,

                        show_faxian: res.data.data.show_faxian,
                        lesson_coach: res.data.data.shop.lesson_coach,
                        lesson_group: res.data.data.shop.lesson_group,
                        shop_id: res.data.data.shop.id,

                        show_online: res.data.data.show_online,
                        online: res.data.data.online,
                        online_num: res.data.data.online_num,

                        article: res.data.data.article,
                        card: res.data.data.card,
                        width_card: res.data.data.width_card,
                        card_group: res.data.data.card_group,
                        w_card_group: res.data.data.w_card_group,
                        activity_money: res.data.data.activity_money,
                        free_card: res.data.data.free_card,
                        order_gym: res.data.data.order_gym,
                    });

                    wx.setStorageSync('shopId', res.data.data.shop.id);
                    wx.setStorageSync('footerFaxian', res.data.data.show_faxian);
                    wx.setStorageSync('footerCoach', res.data.data.shop.lesson_coach);
                    wx.setStorageSync('footerGroup', res.data.data.shop.lesson_group);
                }
            },
        });
        that.getCost(id, wx.getStorageSync('userId'));
    },

    getCost(id, uid) {
        var that = this

        if (that.data.order_gym && that.data.get_cost) {
            wx.request({
                url: app.globalData.domain + '/shop/cost.html',
                method: 'POST',
                data: {
                    app_id: app.globalData.app_id,
                    uid: uid,
                    id: id,
                },
                success: function (res) {
                    wx.hideLoading();
                    if (res.data.state) {
                        that.setData({
                            time: res.data.data.time,
                            pay: res.data.data.pay,
                            total_time: res.data.data.total_time,
                        });
                    }
                },
            });
        }
    },
    phoneCall: function (e) {
        wx.makePhoneCall({
            phoneNumber: e.currentTarget.dataset.phone,
        });
    },
    openPosition:function (e) {
        wx.openLocation({
            latitude: e.currentTarget.dataset.lat,
            longitude: e.currentTarget.dataset.lng,
            name: e.currentTarget.dataset.name,
            scale: 17
        })
    }
})
