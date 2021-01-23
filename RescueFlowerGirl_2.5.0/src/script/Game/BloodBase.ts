import { Admin, Effects2D, TimerAdmin, Tools } from "../Frame/Lwg";
import { _Res } from "../Frame/_PreLoad";
import { Boss } from "./Boss";
import { BossBullet } from "./BossBullet";
export default class BloodBase extends Admin._ObjectBase {
    bloodSum: number;
    bloodPresnt: number;
    bloodPic: Laya.Image;
    bloodWidth: number;
    /**和弓箭的距离检测*/
    checkByWDis: number = 30;
    /**检测时候的事件名称*/
    checkEvName: string = '';
    bloodInit(bloodSum: number): void {
        this.bloodPresnt = this.bloodSum = bloodSum;
        this.bloodPic = this._Owner.getChildByName('Blood').getChildByName('Pic') as Laya.Image;
        this.bloodWidth = this.bloodPic.width;
    }
    /**
     * 血量减少
     * @param Weapon 子弹
     * @param dis 距离
     * @param numBlood 血量
     * */
    checkOtherRule(Weapon: Laya.Image, dis: number, numBlood: number): void {
        Tools._Node.checkTwoDistance(Weapon, this._Owner, dis ? dis : 30, () => {
            this.bloodRule(Weapon, numBlood);
        });
    }
    bloodRule(Other: Laya.Image, numBlood: number): void {
        if (!this.bloodPic) return console.log('血量没有初始化！');
        this.bloodPresnt -= numBlood;
        this.bloodPic.width = this.bloodWidth * this.bloodPresnt / this.bloodSum;
        if (this.bloodPresnt <= 0) {
            this.deathFunc();
            this.deathEffect();
            this._Owner.destroy();
        } else {
            this.subOnceFunc();
        }
        Other.destroy();
    }
    /**
     * 每次掉血时执行
     * */
    subOnceFunc(): void {
    }
    /**
     * 死亡时执行
     * */
    deathFunc(): void {
    }
    /**
    * 死亡特效
    * */
    deathEffect(): void {
        for (let index = 0; index < 20; index++) {
            Effects2D._Particle._spray(Laya.stage, this._gPoint, [10, 30])
        }
    }
    attack():void{
        let time = 0;
        const num = 20;
        TimerAdmin._frameRandomLoop(50, 100, this, () => {
            time++;
            for (let index = 0; index < num; index++) {
                const bullet = Tools._Node.createPrefab(_Res._list.prefab2D.EnemyBullet.prefab) as Laya.Image;
                this._SceneImg('EBparrent').addChild(bullet);
                bullet.pos(this._gPoint.x, this._gPoint.y);
                bullet.rotation = 360 / num * index + time * 10;
                bullet.addComponent(BossBullet);
            }
        }, true);
    }
}