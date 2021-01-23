import { Admin, DataAdmin, TimerAdmin, Tools, _LwgInit } from "../Frame/Lwg";
import { _GameEvent } from "./_GameEvent";
import { _Res } from "../Frame/_PreLoad";
import BloodBase from "./BloodBase";
import { _GameData } from "./_GameData";
export default class _Buff extends Admin._ObjectBase {
    lwgOnStart(): void {
        this.checkHero();
    }
    checkHero(): void {
        TimerAdmin._frameLoop(1, this, () => {
            this._Owner.y += 5;
            !Tools._Node.leaveStage(this._Owner, () => {
                this._Owner.removeSelf();
            }) && Tools._Node.checkTwoDistance(this._Owner, this._SceneImg('Hero'), 60, () => {
                this._Owner.removeSelf();
                this._evNotify(_GameEvent.Game.checkBuff, [this._Owner['buffType']]);
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
        this._evReg(_GameEvent.Game.enemyLandStage, () => {
            this.buffState = false;
            this._ImgChild('Blood').visible = false;
            console.log(this._Owner);
            this.attackType3();
        })
        this._evReg(_GameEvent.Game.treeCheckWeapon, (Weapon: Laya.Image, numBlood: number) => {
            if (this.buffState) {
                this.checkOtherRule(Weapon, 50, numBlood);
            }
        })
    }
    deathFunc(): void {
        _GameData._Buff._ins().createBuff(0, this._Scene, this._gPoint.x, this._gPoint.y, _Buff);
    }
}