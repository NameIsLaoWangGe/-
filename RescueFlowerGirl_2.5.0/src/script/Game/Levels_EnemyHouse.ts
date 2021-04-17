import { EnemyAttackControl } from "./EnemyAttack/EnemyAttackControl";
import { BossData } from "./General/_GameData";
import { _GameEvent } from "./General/_GameEvent";
import { Levels_Boss } from "./Levels_Boss";
import Levels_RoleBase from "./Levels_RoleBase";

export class Levels_EnemyHouse extends Levels_RoleBase {
    lwgOnAwake(): void {
        this.bloodInit(20);
        this._ImgChild('Blood').visible = false;
    }
    enemyHouseStage = false;
    lwgEvent(): void {
        this._evReg(_GameEvent.enemyHouseStage, () => {
            this.enemyHouseStage = true;
            this._ImgChild('Blood').visible = true;
            EnemyAttackControl.Level1.house(this._Owner as any);
        })
        this._evReg(_GameEvent.enemyHouseCheckWeapon, (Weapon: Laya.Image, numBlood: number) => {
            this.checkOtherRule(Weapon, 50, this.enemyHouseStage ? numBlood : 0);
        })
    }
    deathFunc(): void {
        new BossData(this._SceneImg('BossParent'), Levels_Boss);
    }
}