
import Lwg, { LwgEvent, LwgTimer, LwgTools } from "../../Lwg/Lwg";
import { _EnemyBullet } from "./_EnemyBullet";

/**子节点运动参数*/
export type _ChildMove = {
    /**运动类型，也就是运动函数*/
    type: string,
    /**延时，两个区间内随机延时，一样则不随机*/
    delay: [number, number],
    /**速度*/
    speed?: number,
    /**旋转速度*/
    rSpeed?: number,
}

/**每帧依然可以执行的函数，一般用在运动时还可以创建子弹*/
export type _FrameFunc = {
    /**执行间隔*/
    interval: number,
    /**执行函数*/
    func: Function,
}

/**
 * 通用子弹移动
 * @export
 * @class _General
 */
export class _General {

    /**
     * 按角度移动
     * @param {Lwg.NodeAdmin._Image} Bullet 子弹
     * @param {number} diffX X轴偏移，初始位置必须先设置
     * @param {number} angle 角度
     * @param {number} speed 移动速度
     * @param {number} _rSpeed 旋转速度
     * @param {Function} func 每帧还可以添加的行为
     */
    private static moveByAngle(Bullet: Lwg.NodeAdmin._Image, diffX: number, angle: number, speed: number, rSpeed: number, FrameFunc: _FrameFunc, ChildMove: _ChildMove): void {
        let time = 0;
        let _childMoveDelay: number;
        if (ChildMove) {
            _childMoveDelay = ChildMove.delay ? LwgTools._Number.randomOneInt(ChildMove.delay[0], ChildMove.delay[1]) : null;
        }
        const _rSpeed = LwgTools._Number.randomOneHalf() === 0 ? rSpeed : -rSpeed;
        Bullet.rotation = angle - 90;
        let _baseRadius = 0;
        const pos = new Laya.Point(Bullet.x += diffX, Bullet.y);
        LwgTimer._frameLoop(1, Bullet, () => {
            const point = LwgTools._Point.getRoundPosNew(angle, _baseRadius += speed, pos);
            Bullet.pos(point.x, point.y);
            Bullet.rotation += _rSpeed;
            // 按间隔执行的函数，可以用来创建一些更加复杂的子弹
            if (FrameFunc && FrameFunc.func && FrameFunc.interval) {
                if (time % FrameFunc.interval === 0) {
                    FrameFunc.func();
                }
            }
            if (ChildMove && ChildMove.type) {
                if (_childMoveDelay && time > _childMoveDelay) {
                    this[ChildMove.type](Bullet);
                }
            }
        })
    }


    /**
     * 根据x,y的速度移动
     * @private
     * @param {Lwg.NodeAdmin._Image} Bullet 子弹
     * @param {number} diffX X轴偏移
     * @param {number} speedX x速度
     * @param {number} speedY y速度
     * @param {number} rSpeed 旋转速度
     * @param {_FrameFunc} FrameFunc 每帧还可以添加的行为
     * @param {_ChildMove} ChildMove 子节点的移动
     * @memberof _General
     */
    private static moveByXY(Bullet: Lwg.NodeAdmin._Image, diffX: number, speedX: number, speedY: number, rSpeed: number, FrameFunc: _FrameFunc, ChildMove: _ChildMove): void {
        let time = 0;
        let _childMoveDelay: number;
        if (ChildMove) {
            _childMoveDelay = ChildMove.delay ? LwgTools._Number.randomOneInt(ChildMove.delay[0], ChildMove.delay[1]) : null;
        }
        Bullet.x += diffX;
        const _rSpeed = LwgTools._Number.randomOneHalf() === 0 ? rSpeed : -rSpeed;
        LwgTimer._frameLoop(1, Bullet, () => {
            time++;
            Bullet.x += speedX;
            Bullet.y += speedY;
            Bullet.rotation += _rSpeed;
            // 按间隔执行的函数，可以用来创建一些更加复杂的子弹
            if (FrameFunc && FrameFunc.func && FrameFunc.interval) {
                if (time % FrameFunc.interval === 0) {
                    FrameFunc.func();
                }
            }
            if (ChildMove && ChildMove.type) {
                if (_childMoveDelay && time > _childMoveDelay) {
                    this[ChildMove.type](Bullet);
                }
            }
        })
    }

    /**
     * 子节点运动函数类型
     */
    static _ChildMoveType = {
        childExplodebyAngle: 'childExplodebyAngle',
    }

    /**
     * 子节点根据自身中心点进行角度爆炸移动
     * @param {Lwg.NodeAdmin._Image} Bullet
     * @memberof _General
     */


    /**
     * 子节点根据自身中心点进行角度爆炸移动
     * @param {Lwg.NodeAdmin._Image} ParentBullet 父节点
     * @param {number} [speed=10] 速度[speed=10]
     * @param {number} [rSpeed=5] 旋转角度[rSpeed=5]
     */
    private static childExplodebyAngle(ParentBullet: Lwg.NodeAdmin._Image, speed: number = 10, rSpeed: number = 5): void {
        Laya.timer.clearAll(ParentBullet);
        _EnemyBullet.checkNumChild(ParentBullet);
        const gPosBullet = new Laya.Point(ParentBullet._lwg.gPoint.x, ParentBullet._lwg.gPoint.y);
        for (let index = 0; index < ParentBullet.numChildren; index++) {
            const ChildB = ParentBullet.getChildAt(index) as Lwg.NodeAdmin._Image;
            Lwg.NodeAdmin._addProperty(ChildB);
            const gPosChildB = new Laya.Point(ChildB._lwg.gPoint.x, ChildB._lwg.gPoint.y);
            const angle = LwgTools._Point.pointByAngleNew(gPosChildB.x - gPosBullet.x, gPosChildB.y - gPosBullet.y);
            this.moveByAngle(ChildB, 0, angle, speed, rSpeed, null, null);
        }
    }

    /**
    * 匀速下落一颗子弹，可以旋转方向
    * @static
    * @param {Lwg.NodeAdmin._Image} Enemy 敌人
    * @param {number} interval1 间隔1
    * @param {number} interval2 间隔2
    * @param {number} [speedY=10] 速度[speed=10]
    * @param {number} [rSpeed=10] 旋转速度[speed=10]
    * @param {string} [style=_EnemyBullet.Type.single] 子弹样式
    * @param {number} [delay=0] 延时[delay=0]
    * @param {number} [diffX=0] X轴偏移位置[diffX=0]
    * @param {_FrameFunc} FrameFunc 每帧还可以添加的行为
    * @param {_ChildMove} ChildMove 子节点的移动
    */
    static _fall(Enemy: Lwg.NodeAdmin._Image, interval1: number, interval2: number, speedY: number = 10, rSpeed: number = 0, style: string = _EnemyBullet.Type.three_Across, delay: number = 0, diffX: number = 0, frameFunc?: _FrameFunc, ChildMove?: _ChildMove): void {
        LwgTimer._frameOnce(delay, Enemy, () => {
            LwgTimer._frameRandomLoop(interval1, interval2, Enemy, () => {
                this.moveByXY(_EnemyBullet[style](Enemy), diffX, 0, speedY, rSpeed, frameFunc, ChildMove);
            })
        })
    }

    /**
     *均匀发射的环形弹幕
     * @static
     * @param {Lwg.NodeAdmin._Image} Enemy 敌人
     * @param {number} interval 子弹发射间隔,基于帧
     * @param {number} [num=10] 子弹数量[num=10]
     * @param {number} [speed=10] 速度[speed=10]
     * @param {number} [rSpeed=0] 旋转速度[speed=10]
     * @param {string} style 子弹样式
     * @param {number} [delay=0] 延时 [delay=0]
     * @param {number} [diffX=0] X轴偏移位置 [diffX=0]
     * @param {_FrameFunc} FrameFunc 每帧还可以添加的行为
     * @param {_ChildMove} ChildMove 子节点的移动
     * @memberof _General
     */
    static _annular(Enemy: Lwg.NodeAdmin._Image, interval: number, num: number = 10, speed: number = 10, rSpeed: number = 0, style: string, delay: number = 0, diffX: number = 0, frameFunc?: _FrameFunc, ChildMove?: _ChildMove): void {
        LwgTimer._frameOnce(delay, Enemy, () => {
            LwgTimer._frameLoop(interval, Enemy, () => {
                for (let index = 0; index < num; index++) {
                    this.moveByAngle(_EnemyBullet[style](Enemy), diffX, 360 / num * index, speed, rSpeed, frameFunc, ChildMove);
                }
            })
        })
    }

    /**
     * 均匀旋转发射的弹幕
     * @param Enemy 敌人
     * @param interval 子弹发射间隔,基于帧
     * @param num 条数，会被均匀分开
     * @param spacingAngle 角度间隔
     * @param speed 速度
     * @param style 子弹样式
     * @param {number} [delay=0] 延时[delay=0]
     * @param {number} [diffX=0] X轴偏移位置[diffX=0]
     * @param {_FrameFunc} FrameFunc 每帧还可以添加的行为
     * @param {_ChildMove} ChildMove 子节点的移动
    */
    static _spiral(Enemy: Lwg.NodeAdmin._Image, interval: number, num: number, spacingAngle: number, speed: number = 10, rSpeed: number = 0, style: string = _EnemyBullet.Type.single, delay: number = 0, diffX: number = 0, frameFunc?: _FrameFunc, ChildMove?: _ChildMove): void {
        let time = 0;
        LwgTimer._frameOnce(delay, Enemy, () => {
            LwgTimer._frameLoop(interval, Enemy, () => {
                time++;
                const fA = 0;
                const ep = new Laya.Point(Enemy._lwg.gPoint.x + diffX, Enemy._lwg.gPoint.y);
                for (let index = 0; index < num; index++) {
                    let angle = fA + time * spacingAngle;
                    angle += index * 360 / num;
                    this.moveByAngle(_EnemyBullet[style](Enemy), diffX, angle, speed, rSpeed, frameFunc, ChildMove);
                }
            })
        })
    }

    /**
     * 在两个角度范围内扫射
     * @param {Lwg.NodeAdmin._Image} Enemy 敌人
     * @param {number} [interval=5] 间隔[interval=5]
     * @param {number} [startAngle=0] 起始角度[interval=5]
     * @param {number} [endAngle=180] 最大角度[endAngle=180] 
     * @param {number} [spacingAngle=10] 角度间隔[spacing=10]
     * @param {number} [speed=10] 移动速度[speed=10]
     * @param {number} [rSpeed=0] 旋转速度 [rSpeed=0]
     * @param {*} [style=_EnemyBullet.Type.three_Triangle]  子弹样式
     * @param {number} [delay=0] 延时[delay=0]
     * @param {number} [diffX=0] X轴偏移位置[diffX=0]
     * @param {_FrameFunc} FrameFunc 每帧还可以添加的行为
     * @param {_ChildMove} ChildMove 子节点的移动
     * @memberof _General
     */
    static _slapDown(Enemy: Lwg.NodeAdmin._Image, interval: number = 3, startAngle: number = 0, endAngle: number = 180, spacingAngle: number = 15, speed: number = 10, rSpeed: number = 0, style: string = _EnemyBullet.Type.single, delay: number = 0, diffX: number = 0, frameFunc?: _FrameFunc, ChildMove?: _ChildMove): void {
        LwgTimer._frameOnce(delay, Enemy, () => {
            let time = 0;
            LwgTimer._frameLoop(interval, Enemy, () => {
                let angle = time * spacingAngle;
                if (angle > endAngle) {
                    Enemy['angleState'] = 'sub';
                }
                if (angle <= startAngle) {
                    Enemy['angleState'] = 'add';
                }
                if (Enemy['angleState'] === 'sub') {
                    time--;
                } else {
                    time++;
                }
                this.moveByAngle(_EnemyBullet[style](Enemy), diffX, angle, speed, rSpeed, frameFunc, ChildMove);
            })
        })
    }

    /**
     * @description: 向下随机方向上发射一枚子弹
     * @param {Lwg} Enemy 敌人 
     * @param {number} interval1 间隔1
     * @param {number} interval2 间隔2
     * @param {number} [speed=10] 速度[speed=0]
     * @param {number} [rSpeed=10] 旋转速度[speed=10]
     * @param {string} style 子弹样式
     * @param {number} [delay=0] 延时 [delay=0]
     * @param {number} [diffX=0] X轴偏移位置[diffX=0] 
     * @param {_FrameFunc} FrameFunc 每帧还可以添加的行为
     * @param {_ChildMove} ChildMove 子节点的移动
     */
    static _randomAngleDown(Enemy: Lwg.NodeAdmin._Image, interval1: number, interval2: number, speed: number = 10, rSpeed: number = 0, style: string = _EnemyBullet.Type.single, delay: number = 0, diffX: number = 0, frameFunc?: _FrameFunc, ChildMove?: _ChildMove): void {
        LwgTimer._frameOnce(delay, Enemy, () => {
            LwgTimer._frameRandomLoop(interval1, interval2, Enemy, () => {
                this.moveByAngle(_EnemyBullet[style](Enemy), diffX, LwgTools._Number.randomOneInt(0, 180), speed, rSpeed, frameFunc, ChildMove);
            })
        })
    }



    /**
     * 从中心点向下均匀发射数条带角度的弹幕
     * @static
     * @param {Lwg.NodeAdmin._Image} Enemy 
     * @param {number} [interval=5] 时间间隔[interval=5]
     * @param {number} [num=2] 条数[num=2]
     * @param {number} [spacing=30] 边距[spacing=30]
     * @param {number} [speed=10] 速度[speed=10]
     * @param {string} [style=_EnemyBullet.Type.three]
     * @param {number} [delay=0] 延时[delay=0]
     * @param {_FrameFunc} FrameFunc 每帧还可以添加的行为
     * @param {_ChildMove} ChildMove 子节点的移动
     * @memberof _General
     */
    static _evenDowByCenter(Enemy: Lwg.NodeAdmin._Image, interval: number = 5, num: number = 2, spacing: number = 30, speed: number = 10, rSpeed: number = 0, style: string = _EnemyBullet.Type.three_Triangle, delay: number = 0, diffX: number = 0, frameFunc?: _FrameFunc, ChildMove?: _ChildMove): void {
        LwgTimer._frameOnce(delay, Enemy, () => {
            rSpeed = LwgTools._Number.randomOneHalf() === 0 ? rSpeed : -rSpeed;
            LwgTimer._frameLoop(interval, Enemy, () => {
                for (let index = 0; index < num; index++) {
                    let angle = index * (180 - spacing * 2) / (num - 1) + spacing;
                    this.moveByAngle(_EnemyBullet[style](Enemy), diffX, angle, speed, rSpeed, frameFunc, ChildMove);
                }
            })
        })
    }

    /**
     *
     * 根据固定角度发射数个子弹，并且子弹之间的间隔可控
     * @static
     * @param {Lwg.NodeAdmin._Image} Enemy
     * @param {number} [interval=20] 时间间隔[interval=20]
     * @param {number} [angle=30] 角度[angle=30]
     * @param {number} [num=2] 个数[num=2]
     * @param {number} [numFrameInterval=10] 每个之间的时间间隔[numFrameInterval=10] 
     * @param {number} [speed=10] 速度[speed=10] 
     * @param {number} [rSpeed=0] 旋转速度[rSpeed=0]
     * @param {string} [style=_EnemyBullet.Type.single] 子弹类型 [style=_EnemyBullet.Type.single]
     * @param {number} [delay=0] 延时[delay=0]
     * @param {number} [diffX=0] 偏移[diffX=0] 
     * @param {_FrameFunc} FrameFunc 每帧还可以添加的行为
     * @param {_ChildMove} ChildMove 子节点的移动
     * @memberof _General
     */
    static _assignAngle(Enemy: Lwg.NodeAdmin._Image, interval: number = 20, angle: number = 30, num: number = 2, numFrameInterval: number = 10, speed: number = 10, rSpeed: number = 0, style: string = _EnemyBullet.Type.single, delay: number = 0, diffX: number = 0, frameFunc?: _FrameFunc, ChildMove?: _ChildMove): void {
        LwgTimer._frameOnce(delay, Enemy, () => {
            LwgTimer._frameLoop(interval, Enemy, () => {
                for (let index = 0; index < num; index++) {
                    LwgTimer._frameOnce(numFrameInterval * index, Enemy, () => {
                        this.moveByAngle(_EnemyBullet[style](Enemy), diffX, angle, speed, rSpeed, frameFunc, ChildMove);
                    })
                }
            })
        })
    }
}