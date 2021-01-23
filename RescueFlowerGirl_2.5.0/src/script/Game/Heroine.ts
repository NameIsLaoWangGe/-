import BloodBase from "./BloodBase";
import { _Game } from "./_Game";
import { _GameEvent } from "./_GameEvent";

export class Heroine extends BloodBase {

    lwgOnAwake(): void {
        this.bloodInit(50);
        this.attack();
    }
    heroineStage = true;
    lwgEvent(): void {
        this._evReg(_GameEvent.Game.heroineCheckWeapon, (Weapon: Laya.Image, numBlood: number) => {
            this.checkOtherRule(Weapon, 50, this.heroineStage ? numBlood : 0);
        })
    }
    deathFunc(): void {
        // 最后一个为boss
        this._openScene('Victory', false);
    }
}