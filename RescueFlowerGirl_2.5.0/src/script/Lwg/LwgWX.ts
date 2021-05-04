import { LwgDialogue } from "./Lwg";

export module LwgWX {

    interface _AdBase {
        onLoad: Function,
        onError: Function,
        show: Function,
        load: Function,
        destroy: Function,
    }
    /**视频广告*/
    interface _VideoAd {
        adUnitId: string,
        onClose: Function,
        onLoad: Function,
        onError: Function,
        offClose: Function,
        offError: Function,
        offLoad: Function,
        show: Function,
        load: Function,
        destroy: Function,
    }

    interface _BannarAd {
        adUnitId: string,
        style: _style,
        hide: Function,
        onLoad: Function,
        onError: Function,
        show: Function,
        load: Function,
        destroy: Function,
    };

    interface _style {
        left: number,
        top: number,
        width: number,
        height: number,
        realWidth: number,
        realHeight: number,
    }

    export class WXAd {
        /**广告位*/
        private static videoIDArr = ['adunit-98a04e2979153945', 'adunit-39ba4bd878bf50af', 'adunit-11a8aeb95d6baaef', 'adunit-0d22e04e91442bfe', 'adunit-8df798c4410ae70d', 'adunit-b732dba0fa71db4b', 'adunit-3e91c1f21d98ba63'];

        // static Video_15: _VideoAd;
        // static Video_30: _VideoAd;
        // static Video_60: _VideoAd;

        static videoArr: _VideoAd[] = [];

        static Bannar: _BannarAd;//视频广告
        private static bannarAdUnitId: string;
        /**Laya中的微信引用，在当前模块可以直接使用，在其他模块需要加上模块名*/

        static videoLode(): void {
            if (!Laya.Browser.onMiniGame) {
                return;
            }
            for (let index = 0; index < this.videoIDArr.length; index++) {
                const id = this.videoIDArr[index];
                console.log(`开始加载视频广告${id}`);
                let video: _VideoAd = null;

                var onLodeFunc = () => {
                    console.log(`激励视频${id}广告加载成功!`);
                    video.offLoad();
                    video.offClose();
                }
                var onCloseFunc = (err: any) => {
                    console.log(`激励视频${id}广告加载失败！错误信息:${err}`);
                    video.offLoad();
                    video.offClose();
                }
                video = Laya.Browser.window.wx.createRewardedVideoAd({
                    adUnitId: id,
                })
                video.onLoad(onLodeFunc);
                video.onError(onCloseFunc);
                this.videoArr.push(video);
            }
        }

        /**
          * 显示视屏激励广告
          * @param type 1.为15秒，2.为30秒，3.为60秒
          * @param watchCompelet 观看完成回调
          * @param watchClose 中途退出回调
          * @returns 
          */
        static showVideo(ad_place: number, watchCompelet: Function, watchClose?: Function): void {
            if (!Laya.Browser.onMiniGame) {
                return;
            }
            let video: _VideoAd = this.videoArr[ad_place];
            if (!video) {
                console.log('当前广告位广告不存在！准备播放第一位的广告');
                if (!this.videoArr[0]) {
                    return;
                } else {
                    video = this.videoArr[0];
                }
            } else {
                console.log(`准备播放第${ad_place + 1}:${this.videoIDArr[ad_place] ? this.videoIDArr[ad_place] : null}位视频广告`);
            }
            var onCloseFunc = (res: any) => {
                // 用户点击了【关闭广告】按钮
                // 小于 2.1.0 的基础库版本，res 是一个 undefined
                if (res && res.isEnded || res === undefined) {
                    // 正常播放结束，可以下发游戏奖励
                    watchCompelet && watchCompelet(res);
                } else {
                    watchClose && watchClose(res);
                    LwgDialogue.showCommonTips('观看完整广告才可以领取奖励!');
                }
                video.offClose(onCloseFunc);
            }
            video.show()
                .catch((err: any) => {
                    console.log(`广告播放失败：${err},准备重新加载`);
                    video.load().then(() => video.show()
                        .catch(() => {
                            LwgDialogue.showCommonTips('暂无广告！!');
                        }))
                })
            video.onClose(onCloseFunc);
        }

        /**
        * 初始化bannar广告
        * @param adUnitId 广告id
        * @param autoUpdateTime 自动刷新时间默认为30秒
        */
        static bannerLode(adUnitId: string, autoUpdateTime?: number, style?: _style, show?: boolean): void {
            // 创建 Banner 广告实例，提前初始化
            if (Laya.Browser.onMiniGame) {
                this.bannarAdUnitId = adUnitId;
                this.Bannar = Laya.Browser.window.wx.createBannerAd({
                    adUnitId: adUnitId,
                    adIntervals: autoUpdateTime ? autoUpdateTime : 30,
                    style: style ? style : {
                        left: 0,
                        top: Laya.Browser.window.wx.getSystemInfoSync().screenHeight - 150,
                        width: 750,
                    }
                })
                this.Bannar.onLoad(() => {
                    console.log(`banner${adUnitId}广告加载成功!`);
                    if (show) {
                        this.Bannar.show();
                    }
                })
                this.Bannar.onError((err: any) => {
                    console.log(`banner广告:${adUnitId}加载失败！错误信息:${err}`);
                })
            }
        }

        /**显示banner广告 */
        static showBanner(): void {
            if (!Laya.Browser.onMiniGame) {
                return;
            }
            this.Bannar && this.Bannar.show()
                .then(() => console.log('banner 广告显示'));
        }

        /**
         * 显示一个新的banner广告,相当于刷新,必须删除原来的banner,还是原来的 adUnitId
        */
        static showNewBanner(adUnitId?: string, autoUpdateTime?: number, style?: _style, show?: boolean) {
            if (!Laya.Browser.onMiniGame || this.Bannar) {
                return;
            }
            this.Bannar.destroy();
            this.Bannar = null;
            this.bannerLode(adUnitId ? adUnitId : this.bannarAdUnitId, autoUpdateTime, style, show);
        }

        /**关闭banner广告 */
        static closeBanner(): void {
            this.Bannar && this.Bannar.hide().then(() => console.log('banner 广告关闭'));;
        }
    }



}