
import Lwg, { LwgTimer, LwgTools } from "../../Lwg/Lwg";
import { _CreateBullet } from "./_CreateBullet";

/**
 * 通用子弹移动
 * @export
 * @class _General
 */
export class _General {

    /**
     *均匀发射的环形弹幕
     * @static
     * @param {Lwg.NodeAdmin._Image} enemy 敌人
     * @param {number} interval 子弹发射间隔,基于帧
     * @param {number} [num=10] 子弹数量[num=10]
     * @param {number} [speed=10] 速度[speed=10]
     * @param {number} [rSpeed=0] 旋转速度[speed=10]
     * @param {string} style 子弹样式
     * @param {number} [delay=0] 延时 [delay=0]
     * @param {number} [diffX=0] X轴偏移位置 [diffX=0]
     * @memberof _General
     */
    static _annular(enemy: Lwg.NodeAdmin._Image, interval: number, num: number = 10, speed: number = 10, rSpeed: number = 0, style: string, delay: number = 0, diffX: number = 0): void {
        LwgTimer._frameOnce(delay, this, () => {
            LwgTimer._frameLoop(interval, enemy, () => {
                for (let index = 0; index < num; index++) {
                    const ep = new Laya.Point(enemy._lwg.gPoint.x += diffX, enemy._lwg.gPoint.y);
                    const bullet: Lwg.NodeAdmin._Image = _CreateBullet[style](enemy);
                    const angle = 360 / num * index;
                    let _speedAdd = 0;
                    bullet.rotation = angle - 90;
                    const _rSpeed = LwgTools._Number.randomOneHalf() === 0 ? rSpeed : -rSpeed;
                    LwgTimer._frameLoop(1, bullet, () => {
                        const point = LwgTools._Point.getRoundPosNew(angle, _speedAdd += speed, ep);
                        bullet.pos(point.x, point.y);
                        bullet.rotation += _rSpeed;
                    })
                }
            })
        })
    }

    /**
     * 均匀旋转发射的弹幕
     * @param enemy 敌人
     * @param interval 子弹发射间隔,基于帧
     * @param num 条数，会被均匀分开
     * @param spacing 角度间隔
     * @param speed 速度
     * @param style 子弹样式
     * @param {number} [delay=0] 延时[delay=0]
     * @param {number} [diffX=0] X轴偏移位置[diffX=0]
    */
    static _spiral(enemy: Lwg.NodeAdmin._Image, interval: number, num: number, spacing: number, speed: number = 10, rSpeed: number = 0, style: string = _CreateBullet._bulletType.single, delay: number = 0, diffX: number = 0): void {
        let time = 0;
        LwgTimer._frameOnce(delay, this, () => {
            LwgTimer._frameLoop(interval, enemy, () => {
                time++;
                let fA = 0;
                const ep = new Laya.Point(enemy._lwg.gPoint.x + diffX, enemy._lwg.gPoint.y);
                for (let index = 0; index < num; index++) {
                    const bullet: Lwg.NodeAdmin._Image = _CreateBullet[style](enemy);
                    let _speedAdd = 0;
                    let angle = fA + time * spacing;
                    angle += index * 360 / num;
                    bullet.rotation = angle - 90;
                    const _rSpeed = LwgTools._Number.randomOneHalf() === 0 ? rSpeed : -rSpeed;
                    LwgTimer._frameLoop(1, bullet, () => {
                        const point = LwgTools._Point.getRoundPosNew(angle, _speedAdd += speed, ep);
                        bullet.pos(point.x, point.y);
                        bullet.rotation += _rSpeed;
                    })
                }
            })
        })
    }

    /**
     * @description: 向下随机方向上发射一枚子弹
     * @param {Lwg} enemy 敌人 
     * @param {number} interval1 间隔1
     * @param {number} interval2 间隔2
     * @param {number} [speed=10] 速度[speed=0]
     * @param {number} [rSpeed=10] 旋转速度[speed=10]
     * @param {string} style 子弹样式
     * @param {number} [delay=0] 延时 [delay=0]
     * @param {number} [diffX=0] X轴偏移位置[diffX=0] 
     */
    static _randomAngleDown(enemy: Lwg.NodeAdmin._Image, interval1: number, interval2: number, speed: number = 10, rSpeed: number = 0, style: string = _CreateBullet._bulletType.single, delay: number = 0, diffX: number = 0): void {
        LwgTimer._frameOnce(delay, this, () => {
            LwgTimer._frameRandomLoop(interval1, interval2, enemy, () => {
                let fA = LwgTools._Number.randomOneInt(0, 180);
                const ep = new Laya.Point(enemy._lwg.gPoint.x += diffX, enemy._lwg.gPoint.y);
                const bullet: Lwg.NodeAdmin._Image = _CreateBullet[style](enemy);
                bullet.x += diffX;
                let _speedAdd = 0;
                bullet.rotation = fA - 90;
                const _rSpeed = LwgTools._Number.randomOneHalf() === 0 ? rSpeed : -rSpeed;
                LwgTimer._frameLoop(1, bullet, () => {
                    const point = LwgTools._Point.getRoundPosNew(fA, _speedAdd += speed, ep);
                    bullet.pos(point.x, point.y);
                    bullet.rotation += _rSpeed;
                })
            })
        })
    }

    /**
     * 匀速下落一颗子弹，可以旋转方向
     * @static
     * @param {Lwg.NodeAdmin._Image} enemy 敌人
     * @param {number} interval1 间隔1
     * @param {number} interval2 间隔2
     * @param {number} [speed=10] 速度[speed=10]
     * @param {number} [rSpeed=10] 旋转速度[speed=10]
     * @param {string} [style=_CreateBullet._bulletType.single] 子弹样式
     * @param {number} [delay=0] 延时[delay=0]
     * @param {number} [diffX=0] X轴偏移位置[diffX=0]
     */
    static _fall(enemy: Lwg.NodeAdmin._Image, interval1: number, interval2: number, speed: number = 10, rSpeed: number = 0, style: string = _CreateBullet._bulletType.three_Across, delay: number = 0, diffX: number = 0): void {
        LwgTimer._frameOnce(delay, this, () => {
            LwgTimer._frameRandomLoop(interval1, interval2, enemy, () => {
                const bullet: Lwg.NodeAdmin._Image = _CreateBullet[style](enemy);
                bullet.x += diffX;
                const _rSpeed = LwgTools._Number.randomOneHalf() === 0 ? rSpeed : -rSpeed;
                LwgTimer._frameLoop(1, bullet, () => {
                    bullet.y += speed;
                    bullet.rotation += _rSpeed;
                })
            })
        })
    }

    /**
     *从中心点向下均匀发射数条带角度的弹幕
     * @static
     * @param {Lwg.NodeAdmin._Image} enemy
     * @param {number} [interval=5] 时间间隔
     * @param {number} [num=2] 条数[num=2]
     * @param {number} [spacing=30] 边距[spacing=30]
     * @param {number} [speed=10] 速度[speed=10]
     * @param {string} [style=_CreateBullet._bulletType.three]
     * @param {number} [delay=0] 延时[delay=0]
     * @memberof _General
     */
    static _evenDowByCenter(enemy: Lwg.NodeAdmin._Image, interval: number = 5, num: number = 2, spacing: number = 30, speed: number = 10, rSpeed: number = 0, style: string = _CreateBullet._bulletType.three_Triangle, delay: number = 0, diffX: number = 0): void {
        LwgTimer._frameOnce(delay, this, () => {
            rSpeed = LwgTools._Number.randomOneHalf() === 0 ? rSpeed : -rSpeed;
            LwgTimer._frameLoop(interval, enemy, () => {
                for (let index = 0; index < num; index++) {
                    const ep = new Laya.Point(enemy._lwg.gPoint.x += diffX, enemy._lwg.gPoint.y);
                    const bullet: Lwg.NodeAdmin._Image = _CreateBullet[style](enemy);
                    let _speedAdd = 0;
                    let angle = index * (180 - spacing * 2) / (num - 1) + spacing;
                    bullet.rotation = angle - 90;
                    const _rSpeed = LwgTools._Number.randomOneHalf() === 0 ? rSpeed : -rSpeed;
                    LwgTimer._frameLoop(1, bullet, () => {
                        const point = LwgTools._Point.getRoundPosNew(angle, _speedAdd += speed, ep);
                        bullet.pos(point.x, point.y);
                        bullet.rotation += _rSpeed;
                    })
                }
            })
        })
    }
}