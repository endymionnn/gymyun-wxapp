const app = getApp()
Component({
    properties: {
        navigationBarTitle: {
            type: String,
            value: ''
        },
        navigationBarBackgroundColor: {
            type: String,
            value: ''
        },
        back: {
            type: Boolean,
            value: false
        },
        home: {
            type: Boolean,
            value: false
        }
    },
    data: {
        statusBarHeight: app.globalData.statusBarHeight
    },
    methods: {
        home: function() {
            wx.reLaunch({
                url: '/pages/index/index',
            })
        },
        back: function() {
            let pages = getCurrentPages();
            if (pages.length > 1) {
                wx.navigateBack({
                    delta: 1
                })
            } else {
                if (wx.getStorageSync('page_previous')) {
                    wx.reLaunch({
                        url: wx.getStorageSync('page_previous'),
                    })
                } else {
                    wx.reLaunch({
                        url: '/pages/index/index',
                    })
                }
            }
        }
    }
})
