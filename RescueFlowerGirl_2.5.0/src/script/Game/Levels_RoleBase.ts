import { LwgEff2D, LwgScene, LwgTools } from "../Lwg/Lwg";

export default class Levels_RoleBase extends LwgScene._ObjectBase {
    BloodNode: Laya.Image;
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
     * 血量的减少判断
     * @param Weapon 子弹
     * @param dis 距离
     * @param numBlood 血量
     * */
    checkOtherRule(Weapon: Laya.Image, dis: number, numBlood: number): void {
        LwgTools._Node.checkTwoDistance(Weapon, this._Owner, dis ? dis : 30, () => {
            this.bloodRule(Weapon, numBlood);
        });
    }
    /**扣血规则*/
    bloodRule(Other: Laya.Image, numBlood: number): void {
        if (!this.bloodPic) return console.log('血量没有初始化！');
        this.bloodPresnt -= numBlood;
        this.bloodPic.width = this.bloodWidth * this.bloodPresnt / this.bloodSum;
        if (this.bloodPresnt <= 0) {
            this.deathFunc();
            this.deathEffect();
            this._lwgDestroyAndClear();
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
            LwgEff2D._Particle._spray(Laya.stage, this._Owner._lwg.gPoint, [10, 30])
        }
    }
}