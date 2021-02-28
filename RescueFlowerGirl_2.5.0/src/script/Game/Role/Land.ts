
import Lwg, { LwgAni2D, LwgTimer, LwgTools } from "../../Lwg/Lwg";
import BloodBase from "./BloodBase";
import { _Game } from "../_GameData";
import { _EnemyAttack } from "../EnemyAttack/_EnemyAttack";

export default class Land extends BloodBase {
    lwgOnAwake(): void {
        this.bloodInit(100);
        this._ImgChild('Blood').visible = false;
        LwgTimer._frameLoop(1, this, () => {
            this._Owner.rotation += 0.1;
        })
    }
    landStage = false;
    lwgEvent(): void {
        this._evReg(_Game._Event.enemyLandStage, () => {
            Laya.timer.clearAll(this);
            const time = Math.abs(this._Owner.rotation % 360) * 10;
            LwgAni2D.rotate(this._Owner, 0, time, 0, () => {
                this._Owner.rotation = 0;
                this._ImgChild('Blood').visible = true;
                this.landStage = true;
                _EnemyAttack.Level1.land(this._Owner as Lwg.NodeAdmin._Image);
            })
        })
        this._evReg(_Game._Event.enemyLandCheckWeapon, (Weapon: Laya.Image, numBlood: number) => {
            this.checkOtherRule(Weapon, 160, this.landStage ? numBlood : 0);
        })
    }
    deathFunc(): void {
        this._evNotify(_Game._Event.enemyHouseStage);
    }
}