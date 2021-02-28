import Lwg, { LwgEvent, LwgScene, LwgTimer, LwgTools } from "../../Lwg/Lwg";
import { _Game } from "../_GameData";
import { _Res } from "../_Res";

export class _CreateBullet {
    /**
     * 父节点
     */
    static Parent: Laya.Image;

    /**
     * 子弹样式
     */
    static _bulletType = {
        single: 'EB_single',
        two: 'EB_two',
        three_Triangle: 'EB_three_Triangle',
        three_Across: 'EB_three_Across',
        three_Vertical: 'EB_three_Vertical',
    }

    /**
     * 子弹检测主角
     * @param {type} bullet: 子弹 
     */
    static checkHero(bullet: Lwg.NodeAdmin._Image): void {
        LwgTimer._frameLoop(1, bullet, () => {
            const bool = LwgTools._Node.leaveStage(bullet, () => {
                bullet.removeSelf();
            })
            // 发送事件检测主角
            if (!bool && bullet.name === _CreateBullet._bulletType.single) {
                LwgEvent._notify(_Game._Event.checkEnemyBullet, [bullet, 1]);
            }
        })
    }

    /**
     * 通用创建
     * @private 
     * @static
     * @param {Lwg.NodeAdmin._Image} enemy
     * @param {string} type
     * @return {*}  {Lwg.NodeAdmin._Image}
     * @memberof _CreateBullet
     */
    private static createBase(enemy: Lwg.NodeAdmin._Image, type: string): Lwg.NodeAdmin._Image {
        let prefab: Laya.Prefab = _Res.$prefab2D[type]['prefab2D'];
        const bullet = LwgTools._Node.createPrefab(prefab, this.Parent, [enemy._lwg.gPoint.x, enemy._lwg.gPoint.y]) as Lwg.NodeAdmin._Image;
        bullet.name = type;
        this.checkHero(bullet);
        return bullet;
    }

    /**创建子弹的单个样式*/
    static EB_single(enemy: Lwg.NodeAdmin._Image): Lwg.NodeAdmin._Image {
        const bullet = this.createBase(enemy, this._bulletType.single);
        return bullet;
    }
    /**创建子弹的两个在一起样式*/
    static EB_two(enemy: Lwg.NodeAdmin._Image): Lwg.NodeAdmin._Image {
        const bullet = this.createBase(enemy, this._bulletType.two);
        for (let index = 0; index < bullet.numChildren; index++) {
            const element = bullet.getChildAt(index) as Lwg.NodeAdmin._Image;
            this.checkHero(element);
            element.name = this._bulletType.single;
        }
        return bullet;
    }

    /**
     * 三个子弹在一起的样式
     * @param {type} enemy: Lwg.NodeAdmin._Image I am argument enemy: Lwg.NodeAdmin._Image. 
     */
    static EB_three_Triangle(enemy: Lwg.NodeAdmin._Image): Lwg.NodeAdmin._Image {
        const bullet = this.createBase(enemy, this._bulletType.three_Triangle);
        bullet.name = this._bulletType.three_Triangle;
        for (let index = 0; index < bullet.numChildren; index++) {
            const element = bullet.getChildAt(index) as Lwg.NodeAdmin._Image;
            this.checkHero(element);
            element.name = this._bulletType.single;
        }
        return bullet;
    }

    /**
      * 三个子弹在一起的横排央视
      * @param {type} enemy: Lwg.NodeAdmin._Image I am argument enemy: Lwg.NodeAdmin._Image. 
      */
    static EB_three_Across(enemy: Lwg.NodeAdmin._Image): Lwg.NodeAdmin._Image {
        const bullet = this.createBase(enemy, this._bulletType.three_Across);
        bullet.name = this._bulletType.three_Across;
        for (let index = 0; index < bullet.numChildren; index++) {
            const element = bullet.getChildAt(index) as Lwg.NodeAdmin._Image;
            this.checkHero(element);
            element.name = this._bulletType.single;
        }
        return bullet;
    }
    /**
      * 三个子弹在一起的横排央视
      * @param {type} enemy: Lwg.NodeAdmin._Image I am argument enemy: Lwg.NodeAdmin._Image. 
      */
     static EB_three_Vertical(enemy: Lwg.NodeAdmin._Image): Lwg.NodeAdmin._Image {
        const bullet = this.createBase(enemy, this._bulletType.three_Vertical);
        bullet.name = this._bulletType.three_Vertical;
        for (let index = 0; index < bullet.numChildren; index++) {
            const element = bullet.getChildAt(index) as Lwg.NodeAdmin._Image;
            this.checkHero(element);
            element.name = this._bulletType.single;
        }
        return bullet;
    }
}
