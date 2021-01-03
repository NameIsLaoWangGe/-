import { Admin } from "../Frame/Lwg";

export default class _ObjGeneral extends Admin._ObjectBase {
    bloodSum: number;
    bloodPresnt: number;
    bloodPic: Laya.Image;
    bloodWidth: number;
    bloodInit(bloodSum: number): void {
        this.bloodPresnt = this.bloodSum = bloodSum;
        this.bloodPic = this._Owner.getChildByName('Blood').getChildByName('Pic') as Laya.Image;
        this.bloodWidth = this.bloodPic.width;
    }
    /**
     * 血量减少
     * @param num 减少多少
     * @param func 每次减少回调
     * @param deathFunc 死亡回调
     * */
    subBlood(Obj: Laya.Sprite, num: number, func: Function, deathFunc: Function): void {
        if (Obj == this._Owner) {
            this.bloodPresnt -= num;
            this.bloodPic.width = this.bloodWidth * this.bloodPresnt / this.bloodSum;
            if (this.bloodPresnt <= 0) {
                deathFunc && deathFunc();
                this._Owner.destroy();
            } else {
                func && func();
            }
        }
    }
}