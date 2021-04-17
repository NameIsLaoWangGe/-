import { LwgEvent, LwgNode, LwgTimer, LwgTools } from "../../Lwg/Lwg";
import { _GameEvent } from "../General/_GameEvent";
import { _Res } from "../General/_Res";

export class EnemyBullet {
    /**
     * 父节点
     */
    static Parent: Laya.Image;

    /**
     * 子弹样式
     */
    static Type = {
        /**一个子弹*/
        single: 'EB_single',
        /**两个子弹*/
        two: 'EB_two',
        /**三个子弹在一起的三角形*/
        three_Triangle: 'EB_three_Triangle',
        /**三个子弹在一起的横排*/
        three_Across: 'EB_three_Across',
        /**三个子弹在一起的竖排*/
        three_Vertical: 'EB_three_Vertical',
        /**四个子弹在一起的方形*/
        four_Square: 'EB_Four_Square',
    }

    /**
     * 子弹检测主角的类型
     */
    private static ChekType = {
        /**子弹自己检测主角*/
        bullet: 'bullet',
        /**子弹的子节点检测主角*/
        child: 'child',
        /**子弹和其子节点都检测主角*/
        bulletAndchild: 'bulletAndchild',
    }

    /**
      * 清零
      * @param {type} Bullet: 子弹 
      */
    static clearBullet(Bullet: LwgNode.Image): void {
        Laya.timer.clearAll(Bullet);
        Laya.Tween.clearAll(Bullet);
        Bullet.destroy(true);
        
    }
    
    /**
     * 子弹检测主角和检测离开舞台
     * @param {type} Bullet: 子弹 
     */
    static checkStageAndHero(Bullet: LwgNode.Image, checkHero: boolean = true): void {
        LwgTimer.frameLoop(1, Bullet, () => {
            const bool = LwgTools.Node.leaveStage(Bullet, () => {
                this.clearBullet(Bullet);
            })
            // 是否检测主角，大部分时候子弹容器是不检测主角的
            if (!bool && checkHero) {
                LwgEvent.notify(_GameEvent.checkEnemyBullet, [Bullet, 1]);
            }
        })
    }

    /**
     * 检测器子节点是否没有了，没有了则删除自己，因为有子节点的父节点没有图片，也不检测主角
     * @param {LwgNode.Image} Bullet 子弹 
     */
    static checkNumChild(Bullet: LwgNode.Image) {
        LwgTimer.frameLoop(1, Bullet, () => {
            if (Bullet.numChildren === 0) {
                // console.log('清除自身');
                this.clearBullet(Bullet);
            }
        })
    };

    /**
     * 为多子节点的子弹增加检测主角脚本
     * @param {*} bullet 
     */
    static checkHeroByChild(bullet: LwgNode.Image): void {
        this.checkStageAndHero(bullet, false);
        for (let index = 0; index < bullet.numChildren; index++) {
            const element = bullet.getChildAt(index) as LwgNode.Image;
            this.checkStageAndHero(element);
            element.name = this.Type.single;
        }
    }

    /**
     * 创建子弹
     * @private 
     * @static
     * @param {LwgNode.Image} enemy
     * @param {string} type
     * @return {*}  {LwgNode.Image}
     * @memberof _EnemyBullet
     */
    private static createBase(enemy: LwgNode.Image, type: string, checkType: string): LwgNode.Image {
        let prefab: Laya.Prefab = _Res.$prefab2D[type]['prefab2D'];
        const bullet = LwgTools.Node.createPrefab(prefab, this.Parent, [enemy._lwg.gPoint.x, enemy._lwg.gPoint.y]) as LwgNode.Image;
        bullet.name = type;
        switch (checkType) {
            case this.ChekType.bullet:
                this.checkStageAndHero(bullet);
                break;
            case this.ChekType.child:
                this.checkHeroByChild(bullet);
                break;
            case this.ChekType.bulletAndchild:
                this.checkStageAndHero(bullet);
                this.checkHeroByChild(bullet);
                break;
            default:
                break;
        }
        return bullet;
    }

    /**创建子弹的单个样式*/
    static EB_single(enemy: LwgNode.Image): LwgNode.Image {
        const bullet = this.createBase(enemy, this.Type.single, this.ChekType.bullet);
        return bullet;
    }
    /**创建子弹的两个在一起样式*/
    static EB_two(enemy: LwgNode.Image): LwgNode.Image {
        const bullet = this.createBase(enemy, this.Type.two, this.ChekType.child);
        return bullet;
    }

    /**
     * 三个子弹在一起的样式
     * @param {type} enemy: LwgNode.Image I am argument enemy: LwgNode.Image. 
     */
    static EB_three_Triangle(enemy: LwgNode.Image): LwgNode.Image {
        const bullet = this.createBase(enemy, this.Type.three_Triangle, this.ChekType.child);
        return bullet;
    }

    /**
      * 三个子弹在一起的横排
      * @param {type} enemy: LwgNode.Image I am argument enemy: LwgNode.Image. 
      */
    static EB_three_Across(enemy: LwgNode.Image): LwgNode.Image {
        const bullet = this.createBase(enemy, this.Type.three_Across, this.ChekType.child);
        return bullet;
    }

    /**
      * 三个子弹在一起的横排
      * @param {type} enemy: LwgNode.Image I am argument enemy: LwgNode.Image. 
      */
    static EB_three_Vertical(enemy: LwgNode.Image): LwgNode.Image {
        const bullet = this.createBase(enemy, this.Type.three_Vertical, this.ChekType.child);
        return bullet;
    }

    /**
      * 四个子弹组成的方形
      * @param {type} enemy: LwgNode.Image I am argument enemy: LwgNode.Image. 
      */
    static EB_Four_Square(enemy: LwgNode.Image): LwgNode.Image {
        const bullet = this.createBase(enemy, this.Type.four_Square, this.ChekType.child);
        return bullet;
    }

}
