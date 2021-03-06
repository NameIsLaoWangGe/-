
import Lwg, { LwgTimer, LwgTools } from "../../Lwg/Lwg";
import { _EnemyBullet } from "./_EnemyBullet";

/**
 * 通用子弹移动
 * @export
 * @class _General
 */
export class _General {



    /**
     * 按角度移动的基础
     * @param {Lwg.NodeAdmin._Image} enemy 敌人
     * @param {number} diffX X轴偏移
     * @param {Lwg.NodeAdmin._Image} bullet 子弹
     * @param {number} angle 角度
     * @param {number} speed 移动速度
     * @param {number} _rSpeed 旋转速度
     * @param {Function} func 每帧还可以添加的行为
     */
    private static moveByAngle(enemy: Lwg.NodeAdmin._Image, diffX: number, bullet: Lwg.NodeAdmin._Image, angle: number, speed: number, rSpeed: number, func: Function): void {
        const enemyPos = new Laya.Point(enemy._lwg.gPoint.x += diffX, enemy._lwg.gPoint.y);
        bullet.pos(enemyPos.x, enemyPos.y);
        let _speedAdd = 0;
        const _rSpeed = LwgTools._Number.randomOneHalf() === 0 ? rSpeed : -rSpeed;
        bullet.rotation = angle - 90;
        LwgTimer._frameLoop(1, bullet, () => {
            const point = LwgTools._Point.getRoundPosNew(angle, _speedAdd += speed, enemyPos);
            bullet.pos(point.x, point.y);
            bullet.rotation += _rSpeed;
            func && func();
        })
    }


    /**
     * 根据x,y的速度移动的基础
     * @param {Lwg.NodeAdmin._Image} enemy
     * @param {number} diffX X轴偏移
     * @param {Lwg.NodeAdmin._Image} bullet 子弹
     * @param {number} speedX x速度
     * @param {number} speedY y速度
     * @param {number} rSpeed 旋转速度
     * @param {Function} func 每帧还可以添加的行为
     */
    private static moveByXY(enemy: Lwg.NodeAdmin._Image, diffX: number, bullet: Lwg.NodeAdmin._Image, speedX: number, speedY: number, rSpeed: number, func: Function): void {
        bullet.pos(enemy._lwg.gPoint.x += diffX, enemy._lwg.gPoint.y);
        const _rSpeed = LwgTools._Number.randomOneHalf() === 0 ? rSpeed : -rSpeed;
        LwgTimer._frameLoop(1, bullet, () => {
            bullet.x += speedX;
            bullet.y += speedY;
            bullet.rotation += _rSpeed;
            func && func();
        })
    }

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
        LwgTimer._frameOnce(delay, enemy, () => {
            LwgTimer._frameLoop(interval, enemy, () => {
                for (let index = 0; index < num; index++) {
                    const ep = new Laya.Point(enemy._lwg.gPoint.x += diffX, enemy._lwg.gPoint.y);
                    const bullet: Lwg.NodeAdmin._Image = _EnemyBullet[style]();
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
     * @param spacingAngle 角度间隔
     * @param speed 速度
     * @param style 子弹样式
     * @param {number} [delay=0] 延时[delay=0]
     * @param {number} [diffX=0] X轴偏移位置[diffX=0]
    */
    static _spiral(enemy: Lwg.NodeAdmin._Image, interval: number, num: number, spacingAngle: number, speed: number = 10, rSpeed: number = 0, style: string = _EnemyBullet.Type.single, delay: number = 0, diffX: number = 0): void {
        let time = 0;
        LwgTimer._frameOnce(delay, enemy, () => {
            LwgTimer._frameLoop(interval, enemy, () => {
                time++;
                const fA = 0;
                const ep = new Laya.Point(enemy._lwg.gPoint.x + diffX, enemy._lwg.gPoint.y);
                for (let index = 0; index < num; index++) {
                    const bullet: Lwg.NodeAdmin._Image = _EnemyBullet[style]();
                    let _speedAdd = 0;
                    let angle = fA + time * spacingAngle;
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
     * 在两个角度范围内扫射
     * @param {Lwg.NodeAdmin._Image} enemy 敌人
     * @param {number} [interval=5] 间隔[interval=5]
     * @param {number} [startAngle=0] 起始角度[interval=5]
     * @param {number} [endAngle=180] 最大角度[endAngle=180] 
     * @param {number} [spacingAngle=10] 角度间隔[spacing=10]
     * @param {number} [speed=10] 移动速度[speed=10]
     * @param {number} [rSpeed=0] 旋转速度 [rSpeed=0]
     * @param {*} [style=_EnemyBullet.Type.three_Triangle]  子弹样式
     * @param {number} [delay=0] 延时[delay=0]
     * @param {number} [diffX=0] X轴偏移位置[diffX=0]
     * @memberof _General
     */
    static _slapDown(enemy: Lwg.NodeAdmin._Image, interval: number = 3, startAngle: number = 0, endAngle: number = 180, spacingAngle: number = 15, speed: number = 10, rSpeed: number = 0, style: string = _EnemyBullet.Type.single, delay: number = 0, diffX: number = 0): void {

        LwgTimer._frameOnce(delay, enemy, () => {
            let time = 0;
            LwgTimer._frameLoop(interval, enemy, () => {
                const ep = new Laya.Point(enemy._lwg.gPoint.x + diffX, enemy._lwg.gPoint.y);
                const bullet: Lwg.NodeAdmin._Image = _EnemyBullet[style]();
                let _speedAdd = 0;
                let angle = time * spacingAngle;
                if (angle > endAngle) {
                    enemy['angleState'] = 'sub';
                }
                if (angle <= startAngle) {
                    enemy['angleState'] = 'add';
                }
                if (enemy['angleState'] === 'sub') {
                    time--;
                } else {
                    time++;
                }
                bullet.rotation = angle - 90;
                const _rSpeed = LwgTools._Number.randomOneHalf() === 0 ? rSpeed : -rSpeed;
                LwgTimer._frameLoop(1, bullet, () => {
                    const point = LwgTools._Point.getRoundPosNew(angle, _speedAdd += speed, ep);
                    bullet.pos(point.x, point.y);
                    bullet.rotation += _rSpeed;
                })
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
    static _randomAngleDown(enemy: Lwg.NodeAdmin._Image, interval1: number, interval2: number, speed: number = 10, rSpeed: number = 0, style: string = _EnemyBullet.Type.single, delay: number = 0, diffX: number = 0): void {
        LwgTimer._frameOnce(delay, enemy, () => {
            LwgTimer._frameRandomLoop(interval1, interval2, enemy, () => {
                let fA = LwgTools._Number.randomOneInt(0, 180);
                const ep = new Laya.Point(enemy._lwg.gPoint.x += diffX, enemy._lwg.gPoint.y);
                const bullet: Lwg.NodeAdmin._Image = _EnemyBullet[style]();
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
     * @param {string} [style=_EnemyBullet.Type.single] 子弹样式
     * @param {number} [delay=0] 延时[delay=0]
     * @param {number} [diffX=0] X轴偏移位置[diffX=0]
     */
    static _fall(enemy: Lwg.NodeAdmin._Image, interval1: number, interval2: number, speed: number = 10, rSpeed: number = 0, style: string = _EnemyBullet.Type.three_Across, delay: number = 0, diffX: number = 0): void {
        LwgTimer._frameOnce(delay, enemy, () => {
            LwgTimer._frameRandomLoop(interval1, interval2, enemy, () => {
                this.moveByXY(enemy, diffX, _EnemyBullet[style](), 0, speed, rSpeed, null);
            })
        })
    }

    /**
     * 从中心点向下均匀发射数条带角度的弹幕
     * @static
     * @param {Lwg.NodeAdmin._Image} enemy 
     * @param {number} [interval=5] 时间间隔[interval=5]
     * @param {number} [num=2] 条数[num=2]
     * @param {number} [spacing=30] 边距[spacing=30]
     * @param {number} [speed=10] 速度[speed=10]
     * @param {string} [style=_EnemyBullet.Type.three]
     * @param {number} [delay=0] 延时[delay=0]
     * @memberof _General
     */
    static _evenDowByCenter(enemy: Lwg.NodeAdmin._Image, interval: number = 5, num: number = 2, spacing: number = 30, speed: number = 10, rSpeed: number = 0, style: string = _EnemyBullet.Type.three_Triangle, delay: number = 0, diffX: number = 0): void {
        LwgTimer._frameOnce(delay, enemy, () => {
            rSpeed = LwgTools._Number.randomOneHalf() === 0 ? rSpeed : -rSpeed;
            LwgTimer._frameLoop(interval, enemy, () => {
                for (let index = 0; index < num; index++) {
                    let angle = index * (180 - spacing * 2) / (num - 1) + spacing;
                    this.moveByAngle(enemy, diffX, _EnemyBullet[style](), angle, speed, rSpeed, null);
                }
            })
        })
    }

    /**
     *
     * 根据固定角度反射数个子弹，并且子弹之间的间隔可控
     * @static
     * @param {Lwg.NodeAdmin._Image} enemy
     * @param {number} [interval=20] 时间间隔[interval=20]
     * @param {number} [angle=30] 角度[angle=30]
     * @param {number} [num=2] 个数[num=2]
     * @param {number} [numFrameInterval=10] 每个之间的时间间隔[numFrameInterval=10] 
     * @param {number} [speed=10] 速度[speed=10] 
     * @param {number} [rSpeed=0] 旋转速度[rSpeed=0]
     * @param {string} [style=_EnemyBullet.Type.single] 子弹类型 [style=_EnemyBullet.Type.single]
     * @param {number} [delay=0] 延时[delay=0]
     * @param {number} [diffX=0] 偏移[diffX=0] 
     * @memberof _General
     */
    static _assignAngle(enemy: Lwg.NodeAdmin._Image, interval: number = 20, angle: number = 30, num: number = 2, numFrameInterval: number = 10, speed: number = 10, rSpeed: number = 0, style: string = _EnemyBullet.Type.single, delay: number = 0, diffX: number = 0): void {
        LwgTimer._frameOnce(delay, enemy, () => {
            LwgTimer._frameLoop(interval, enemy, () => {
                for (let index = 0; index < num; index++) {
                    LwgTimer._frameOnce(numFrameInterval * index, enemy, () => {
                        this.moveByAngle(enemy, diffX, _EnemyBullet[style](), angle, speed, rSpeed, null);
                    })
                }
            })
        })
    }

}