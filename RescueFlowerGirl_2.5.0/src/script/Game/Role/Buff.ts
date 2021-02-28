import { LwgScene, LwgData, LwgTimer, LwgTools } from "../../Lwg/Lwg";
import { _Role, _Game } from "../_GameData";
import BloodBase from "./BloodBase";
export default class _Buff extends LwgScene._ObjectBase {
    lwgOnStart(): void {
        this.checkHero();
    }
    checkHero(): void {
        LwgTimer._frameLoop(1, this, () => {
            this._Owner.y += 5;
            !LwgTools._Node.leaveStage(this._Owner, () => {
                this._Owner.removeSelf();
            }) && LwgTools._Node.checkTwoDistance(this._Owner, this._SceneImg('Hero'), 60, () => {
                this._Owner.removeSelf();
                this._evNotify(_Game._Event.checkBuff, [this._Owner['buffType']]);
            })
        })
    }
}
export class Tree extends BloodBase {
    /**改变状态，从被攻击产生buff到攻击主角,攻击主角时，没有血量了，也打不死*/
    buffState = true;
    lwgOnAwake(): void {
        this.bloodInit(20);
    }
    lwgEvent(): void {
        this._evReg(_Game._Event.enemyLandStage, () => {
            this.buffState = false;
            this._ImgChild('Blood').visible = false;
        })
        this._evReg(_Game._Event.treeCheckWeapon, (Weapon: Laya.Image, numBlood: number) => {
            if (this.buffState) {
                this.checkOtherRule(Weapon, 50, numBlood);
            }
        })
    }
    deathFunc(): void {
        _Role._Buff._ins().createBuff(0, this._Scene, this._Owner._lwg.gPoint.x, this._Owner._lwg.gPoint.y, _Buff);
    }
}