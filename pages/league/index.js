var app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        title: '加盟申请',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {

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
    post: function (e) {
        var that = this;

        var post = e.detail.value;

        if (!post.realname) {
            wx.showToast({
                title: '联系人不能为空',
                icon: 'none',
                duration: 3000
            });
            return false;
        }
        if (!post.phone) {
            wx.showToast({
                title: '联系电话不能为空',
                icon: 'none',
                duration: 3000
            });
            return false;
        }
        wx.request({
            url: app.globalData.domain + '/league/post.html',
            method: 'POST',
            data: {
                app_id: app.globalData.app_id,
                realname: post.realname,
                phone: post.phone,
                weixin: post.weixin,
                company: post.company,
                address: post.address,
                remark: post.remark,
            },
            success: function (res) {
                wx.showToast({
                    title: '申请成功',
                    icon: 'none',
                    duration: 5000
                });
            }
        });
    }
})
