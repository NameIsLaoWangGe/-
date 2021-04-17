import { LwgScene, LwgAni2D, LwgEff2D, LwgTimer, LwgTools, LwgPlatform } from "../../Lwg/Lwg";
import { GameAni } from "./_GameAni";
/**裁剪界面的层级必须在最上面*/
export default class _Guide extends LwgScene.SceneBase {
    lwgOpenAni(): number {
        return 200;
    }
    lwgOnAwake(): void {
        this._ImgVar('Hand').scale(0, 0);
        this._ImgVar('Slide').scale(0, 0);
    }
    clickEffcet(): void {
        LwgEff2D.Aperture.continuous(this._Owner, [this._ImgVar('Hand').x, this._ImgVar('Hand').y + 28], [6, 6], null, null, [LwgEff2D.SkinUrl.圆形小光环], null, this._ImgVar('Hand').zOrder - 1, [1.2, 1.2], [0.6, 0.6], [0.01, 0.01]);
    }
    /**
      * 在一个节点上绘制一个圆形反向遮罩,可以绘制很多个,但是不要同时存在多个interactionArea，清除直接删除node中的interactionArea节点即可
      * @param arr 数量信息数组[[x位置，y位置，radius半径]]
      * @param handX 手的位置
      * @param handY 手的位置
      * @param func 回调函数
      */
    boreholeCircle(arr: Array<[number, number, number]>, handX?: number, handY?: number, func?: Function): void {
        for (let index = 0; index < arr.length; index++) {
            const time = 80 / 8;
            let radiusBase = 15;
            const element = arr[index];
            const speed = (arr[index][2] - radiusBase) / time;
            LwgTimer.frameNumLoop(1, time, this, () => {
                radiusBase += speed;
                element[2] = radiusBase;
                LwgTools.Draw.reverseCircleMask(this._ImgVar('Background'), arr, true);
            }, () => {
                func && func();
            }, true)
        }
        handX && this._ImgVar('Hand').pos(handX, handY - 30);
    }
    /**
      * 在一个节点上绘制一个圆形反向遮罩,可以绘制很多个，清除直接删除node中的子节点即可
      * 圆角矩形的中心点在节点的中间
      * @param arr  数量信息数组[[x位置，y位置，width宽，height高，round圆角角度]]
      * @param handX 手的位置
      * @param handY 手的位置
      */
    boreholeRoundrect(arr: Array<[number, number, number, number, number]>, handX?: number, handY?: number, func?: Function): void {
        handX && this._ImgVar('Hand').pos(handX, handY);
        for (let index = 0; index < arr.length; index++) {
            let widthBase = 0;
            let heightBase = 0;
            let radiuBase = 0;
            const element = arr[index];
            // 时间为长宽的平均值然后计算
            const time = 20;
            const speedX = (element[2] - widthBase) / time;
            const speedY = (element[3] - heightBase) / time;
            const speedR = (element[4] - radiuBase) / time;
            LwgTimer.frameNumLoop(1, time, this, () => {
                widthBase += speedX;
                heightBase += speedY;
                radiuBase += speedR;
                element[2] = widthBase;
                element[3] = heightBase;
                element[4] = radiuBase;
                LwgTools.Draw.reverseRoundrectMask(this._ImgVar('Background'), arr, true);
            }, () => {
                func && func();
            }, true)
        }
        handX && this._ImgVar('Hand').pos(handX, handY);
    }

    btnComX = Laya.stage.width - 250;
    btnComY = 70;
    handAppear(delay?: number, func?: Function): void {
        const time = 200;
        LwgAni2D.scale(this._ImgVar('Hand'), 0, 0, 1, 1, time, delay ? delay : 0, () => {
            func && func();
        })
        this._ImgVar('HandPic').rotation = -17;
    }
    bgAppear(delay?: number, func?: Function): void {
        LwgTools.Node.destroyAllChildren(this._ImgVar('Background'));
        const time = 300;
        this._ImgVar('HandPic').rotation = -17;
        LwgAni2D.fadeOut(this._ImgVar('Background'), 0, 1, time, delay ? delay : 0, () => {
            func && func();
        });
    }
    handVanish(delay?: number, func?: Function): void {
        const time = 300;
        this._ImgVar('HandPic').rotation = -17;
        LwgAni2D.scale(this._ImgVar('Hand'), 1, 1, 0, 0, time, delay ? delay : 0, () => {
            func && func();
        })
    }
    bgVanish(delay?: number, func?: Function): void {
        const time = 300;
        LwgAni2D.fadeOut(this._ImgVar('Background'), 1, 0, time, delay ? delay : 0, () => {
            func && func();
        });
    }
    bgType = {
        present: 'present',
        vanish: 'vanish',
        appear: 'appear',
    }
    handMove(x: number, y: number, func?: Function, bgType?: string): void {
        this.handClear();
        const _y = y - 30;
        const point = new Laya.Point(this._ImgVar('Hand').x, this._ImgVar('Hand').y);
        const time = point.distance(x, _y);
        LwgAni2D.move(this._ImgVar('Hand'), x, _y, time, () => {
            func && func();
        })
        this._ImgVar('Hand').scale(1, 1);
        LwgAni2D.move(this._ImgVar('HandPic'), 75, 56, time);
        switch (bgType) {
            case this.bgType.vanish:
                this.bgVanish();
                break;
            case this.bgType.appear:
                this.bgAppear();
                break;
            default:
                break;
        }
    }
    handClear(): void {
        LwgTimer.clearAll([this._ImgVar('Hand')]);
        LwgAni2D.clearAll([this._ImgVar('Hand')]);
        this._AniVar('Frame').stop();
        this._AniVar('Click').stop();
        this._AniVar('ClickOne').stop();
        this._ImgVar('Hand').visible = true;
        this._ImgVar('HandPic').scale(1, 1);
        this._ImgVar('HandPic').rotation = -17;
        this._ImgVar('Hand').pos(this._ImgVar('HandPic')._lwg.gPoint.x - 75, this._ImgVar('HandPic')._lwg.gPoint.y - 56);
        this._ImgVar('HandPic').pos(75, 56);
    }
    /**
     * 单个矩形的出现，滑动动作出现
     * @param {number} x x位置
     * @param {number} y y位置
     * @param {number} width 宽度
     * @param {number} height 高度
     * @param {number} radius 圆角角度
     * @memberof Guide
     */
    slideUpAppear(x: number, y: number, width: number, height: number, radius: number, delay?: number): void {
        this.bgAppear(delay ? delay : 0, () => {
            this.boreholeRoundrect([[x, y, width, height, radius]], null, null, () => {
                this._ImgVar('Hand').scale(0, 0);
                this._ImgVar('Slide').scale(1, 1);
                this._ImgVar('Slide').pos(x, y);
                this._AniVar('SlideUp').play();
            });
        });
    }

    /**
     * 单个矩形的出现
     * @param {number} x x位置
     * @param {number} y y位置
     * @param {number} width 宽度
     * @param {number} height 高度
     * @param {number} radius 圆角角度
     * @memberof Guide
     */
    noMoveRoundrect(x: number, y: number, width: number, height: number, radius: number, delay?: number, handX?: number, handY?: number): void {
        this.bgAppear(delay ? delay : 0, () => {
            this.boreholeRoundrect([[x, y, width, height, radius]], handX ? handX : x, handY ? handY : y - 30, () => {
                this.handAppear(null, () => {
                    this._AniVar('Click').play();
                });
            });
        });
    }

    moveRoundrectNoBg(x: number, y: number, width: number, height: number, radius: number): void {
        this.boreholeRoundrect([[x, y, width, height, radius]], null, null, () => {
            this.handMove(x, y, () => {
                this._AniVar('Click').play();
            });
        });
    }

    /**
    * 引导开始时单个圆形的出现
    * @param {number} x x坐标
    * @param {number} y y坐标
    * @param {number} radius 半径
    * @memberof Guide
    */
    noMoveCircle(x: number, y: number, radius: number): void {
        this.bgAppear(0, () => {
            this.boreholeCircle([[x, y, radius]], x, y, () => {
                this.handAppear(200, () => {
                    this._AniVar('Click').play();
                });
            });
        })
    }

    /** 
     * 移动到另一个创建的圆上
     * @param {number} x x坐标
     * @param {number} y y坐标
     * @param {number} radius 半径
     * @memberof Guide
     */
    moveCircleBg(x: number, y: number, radius: number): void {
        this.bgAppear(0, () => {
            this.boreholeCircle([[x, y, radius]], null, null, () => {

                this.handMove(x, y, () => {
                    this._AniVar('Click').play();
                });
            });
        });
    }
    /** 
     * 移动到另一个创建的圆上
     * @param {number} x x坐标
     * @param {number} y y坐标
     * @param {number} radius 半径
     * @memberof Guide
     */
    moveCircleNoBg(x: number, y: number, radius: number): void {
        this.boreholeCircle([[x, y, radius]], null, null, () => {
            this.handMove(x, y, () => {
                this._AniVar('Click').play();
            });
        });
    }
    lwgEvent(): void {
        // this._evReg($Guide.Event.vanishGuide, () => {
        //     this._AniVar('Click').stop();
        //     this.handVanish();
        //     this.bgVanish();
        // })

        // this._evReg($Guide.Event.closeGuide, () => {
        //     this._closeScene();
        // })
    }
    lwgCloseAni(): number {
        return GameAni._dialogCloseFadeOut(this._ImgVar('Hand'), this._ImgVar('Background'));
    }
    lwgOnDisable(): void {
        // Background被缓存成位图后续手动销毁
        this._ImgVar('Background').destroy();
    }
}



