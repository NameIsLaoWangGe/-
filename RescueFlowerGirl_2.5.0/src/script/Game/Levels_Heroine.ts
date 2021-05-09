import { LwgTimer } from "../Lwg/Lwg";
import { EnemyAttackControl } from "./EnemyAttack/EnemyAttackControl";
import { _GameEvent } from "./General/_GameEvent";
import _SceneName from "./General/_SceneName";
import Levels_RoleBase from "./Levels_RoleBase";

export class Levels_Heroine extends Levels_RoleBase {

    lwgOnAwake(): void {
        this.bloodInit(100);
        EnemyAttackControl.Level1.heroine(this._Owner as any);
        this.move();
    }
    move(): void {
        let dir = 'left';
        LwgTimer.frameLoop(1, this, () => {
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
        this._evReg(_GameEvent.heroineCheckWeapon, (Weapon: Laya.Image, numBlood: number) => {
            this.checkOtherRule(Weapon, 50, this.heroineStage ? numBlood : 0);
        })
    }
    deathFunc(): void {
        // 最后一个为boss
        this._openScene(_SceneName.Victory, true, null);
    }
}