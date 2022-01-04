import WeCropper from '../../static/we-cropper/we-cropper.js'
import GlobalConfig from '../../static/we-cropper/config';

const globalConfig = new GlobalConfig()

globalConfig.init()

const app = getApp()
const config = globalConfig

const device = wx.getSystemInfoSync()
const width = device.windowWidth
const height = device.windowHeight - 50

Page({
    data: {
        cropperOpt: {
            id: 'cropper',
            targetId: 'targetCropper',
            pixelRatio: device.pixelRatio,
            width,
            height,
            scale: 2.5,
            zoom: 8,
            cut: {
                x: (width - 200) / 2,
                y: (height - 200) / 2,
                width: 200,
                height: 200
            },
            boundStyle: {
                color: config.getThemeColor(),
                mask: 'rgba(0,0,0,0.8)',
                lineWidth: 1
            }
        }
    },
    onLoad(option) {

        var that = this;

        if (!wx.getStorageSync('userId')) {
            wx.navigateTo({
                url: '/pages/user/login',
            });
            return false;
        }

        that.setData({
            show_upload: 1,
        });

        const { cropperOpt } = this.data

        cropperOpt.boundStyle.color = config.getThemeColor()

        this.setData({ cropperOpt })

        if (option.src) {
            cropperOpt.src = option.src
            this.cropper = new WeCropper(cropperOpt)
                .on('ready', (ctx) => {

                })
                .on('beforeImageLoad', (ctx) => {

                    wx.showToast({
                        title: '上传中',
                        icon: 'loading',
                        duration: 20000
                    })
                })
                .on('imageLoad', (ctx) => {
                    wx.hideToast()
                })
                .on('beforeDraw', (ctx, instance) => {

                })
        }
    },
    touchStart(e) {
        this.cropper.touchStart(e)
    },
    touchMove(e) {
        this.cropper.touchMove(e)
    },
    touchEnd(e) {
        this.cropper.touchEnd(e)
    },
    getCropperImage() {

        var that = this;

        that.cropper.getCropperImage(function (path, err) {
            
            wx.uploadFile({
                url: app.globalData.domain + '/coachcp/upload.html',
                filePath: path,
                name: 'avatar',
                formData: {
                    'app_id': app.globalData.app_id,
                    'uid': wx.getStorageSync('userId'),
                },
                success(res) {
                    that.setData({
                        show_upload: 0,
                    });
                    wx.navigateTo({
                        url: '/pages/coachcp/headimg',
                    });
                }
            })
            if (err) {
                wx.showModal({
                    title: '温馨提示',
                    content: err.message
                })
            } else {
                wx.previewImage({
                    current: '', // 当前显示图片的 http 链接
                    urls: [path] // 需要预览的图片 http 链接列表
                })
            }
        })
    },
    uploadTap() {
        const self = this

        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success(res) {
                const src = res.tempFilePaths[0]
                //  获取裁剪图片资源后，给data添加src属性及其值

                self.cropper.pushOrign(src)
            }
        })
    }
})
