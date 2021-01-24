import { Animation2D, TimerAdmin, Tools } from "../Frame/Lwg";
import { _Res } from "../Frame/_PreLoad";
import BloodBase from "./BloodBase";
import { BossBullet } from "./BossBullet";
import { _Game } from "./_Game";
import { _GameEvent } from "./_GameEvent";

export default class EnemyLand extends BloodBase {
    lwgOnAwake(): void {
        this.bloodInit(50);
        this._ImgChild('Blood').visible = false;
        TimerAdmin._frameLoop(1, this, () => {
            this._Owner.rotation += 0.1;
        })
    }
    landStage = false;
    lwgEvent(): void {
        this._evReg(_GameEvent.Game.enemyLandStage, () => {
            Laya.timer.clearAll(this);
            this.attack();
            const time = Math.abs(this._Owner.rotation % 360) * 10;
            Animation2D.rotate(this._Owner, 0, time, 0, () => {
                this._Owner.rotation = 0;
                this._ImgChild('Blood').visible = true;
                this.landStage = true;
            })
        })
        this._evReg(_GameEvent.Game.enemyLandCheckWeapon, (Weapon: Laya.Image, numBlood: number) => {
            this.checkOtherRule(Weapon, 160, this.landStage ? numBlood : 0);
        })
    }
    deathFunc(): void {
        this._evNotify(_GameEvent.Game.enemyHouseStage);
    }
}