import { LwgTimer } from "../Lwg/Lwg";
import { _EnemyAttack } from "./EnemyAttack/_EnemyAttack";
import { _Game } from "./General/_GameData";
import Levels_RoleBase from "./Levels_RoleBase";

export class Levels_Heroine extends Levels_RoleBase {

    lwgOnAwake(): void {
        this.bloodInit(100);
        _EnemyAttack.Level1.heroine(this._Owner as any);
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