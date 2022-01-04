
App({

    globalData: {
        domain: 'https://gym.0wpt.com/wxapp',
        app_id: 2,
        statusBarHeight: 0,
        titleBarHeight: 0
    },

    onLaunch: function () {

        var that = this;

        wx.getSystemInfo({
            success: function (res) {
                let titleBarHeight = 0
                if (res.model.indexOf('iPhone') !== -1) {
                    titleBarHeight = 44
                } else {
                    titleBarHeight = 48
                }
                that.globalData.statusBarHeight = res.statusBarHeight;
                that.globalData.titleBarHeight  = titleBarHeight;
            },
            failure() {
                that.globalData.statusBarHeight = 0;
                that.globalData.titleBarHeight  = 0;
            }
        });

        wx.getLocation({
            type: 'gcj02',
            success: function (res) {
                wx.setStorageSync("lat", res.latitude);
                wx.setStorageSync("lng", res.longitude);
            }
        });
    },
    setStorageSync(key, value, time = 0) {
        wx.setStorageSync(key, value)
        if (time) {
            var timestamp = Date.parse(new Date());
            timestamp = timestamp / 1000 + time * 3600;
            wx.setStorageSync(key + '_endtime', timestamp);
        }
    },
    getStorageSync(key) {
        var time     = Date.parse(new Date()) / 1000;
        var end_time = wx.getStorageSync(key + '_endtime');
        if (end_time && end_time < time) {
            wx.removeStorageSync(key);
            wx.removeStorageSync(key + '_endtime');
        }
        return wx.getStorageSync(key);
    },
    getOpentype() {

        var opentype = 'navigate';

        if (getCurrentPages().length > 9) {
            opentype = 'reLaunch';
        }

        if (wx.getStorageSync('page_current')) {
            wx.setStorageSync('page_previous', wx.getStorageSync('page_current'));
        }

        var pages = getCurrentPages();

        var prevPage = pages[pages.length - 1];  //当前页

        var options_str = '';

        if (prevPage.options) {
            for (var p in prevPage.options) {
                if (p != 'page') {
                    options_str += p + '=';
                    options_str += prevPage.options[p] + '&';
                }
            }
        }
        wx.setStorageSync('page_current', '/' + prevPage.route + '?' + options_str);

        return opentype;
    },
});
