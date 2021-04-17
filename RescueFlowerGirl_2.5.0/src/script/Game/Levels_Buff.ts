import { LwgScene, LwgTimer, LwgTools } from "../Lwg/Lwg";
import { BuffData } from "./General/_GameData";
import { _GameEvent } from "./General/_GameEvent";
import Levels_RoleBase from "./Levels_RoleBase";
export default class Levels_Buff extends LwgScene._ObjectBase {
    lwgOnStart(): void {
        this.checkHero();
    }
    checkHero(): void {
        LwgTimer.frameLoop(1, this, () => {
            this._Owner.y += 5;
            !LwgTools.Node.leaveStage(this._Owner, () => {
                this._Owner.removeSelf();
            }) && LwgTools.Node.checkTwoDistance(this._Owner, this._SceneImg('Hero'), 60, () => {
                this._Owner.removeSelf();
                this._evNotify(_GameEvent.checkBuff, [this._Owner['buffType']]);
            })
        })
    }
}
export class Tree extends Levels_RoleBase {
    /**改变状态，从被攻击产生buff到攻击主角,攻击主角时，没有血量了，也打不死*/
    buffState = true;
    lwgOnAwake(): void {
        this.bloodInit(20);
    }
    lwgEvent(): void {
        this._evReg(_GameEvent.enemyLandStage, () => {
            this.buffState = false;
            this._ImgChild('Blood').visible = false;
        })
        this._evReg(_GameEvent.treeCheckWeapon, (Weapon: Laya.Image, numBlood: number) => {
            if (this.buffState) {
                this.checkOtherRule(Weapon, 50, numBlood);
            }
        })
    }
    deathFunc(): void {
        BuffData._ins().createBuff(0, this._Scene, this._Owner._lwg.gPoint.x, this._Owner._lwg.gPoint.y, Levels_Buff);
    }
}