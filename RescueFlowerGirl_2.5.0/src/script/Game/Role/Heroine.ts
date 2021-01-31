import BloodBase from "./BloodBase";
import { EnemyAttack } from "./EnemyAttack";
import { LwgTimer } from "../../Lwg/Lwg";
import { _Game } from "../_GameData";

export class Heroine extends BloodBase {

    lwgOnAwake(): void {
        this.bloodInit(100);
        EnemyAttack.attackType8(this._Owner);
        this.move();
    }
    move(): void {
        let dir = 'left';
        LwgTimer._frameLoop(1, this, () => {
            if (dir == 'right') {
                this._Owner.x++;
                if (this._Owner.x > Laya.stage.width - 100) {
                    dir = 'left';
                }
            } else {
                this._Owner.x--;
                if (this._Owner.x < 100) {
                    dir = 'right';
                }
            }
        })
    }
    heroineStage = true;
    lwgEvent(): void {
        this._evReg(_Game._Event.heroineCheckWeapon, (Weapon: Laya.Image, numBlood: number) => {
            this.checkOtherRule(Weapon, 50, this.heroineStage ? numBlood : 0);
        })
    }
    deathFunc(): void {
        // 最后一个为boss
        this._openScene('Victory', false);
    }
}