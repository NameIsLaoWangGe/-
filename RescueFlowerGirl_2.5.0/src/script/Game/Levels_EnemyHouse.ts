import { _EnemyAttack } from "./EnemyAttack/_EnemyAttack";
import { _Game, _Role } from "./General/_GameGlobal";
import { Levels_Boss } from "./Levels_Boss";
import Levels_RoleBase from "./Levels_RoleBase";

export class Levels_EnemyHouse extends Levels_RoleBase {
    lwgOnAwake(): void {
        this.bloodInit(20);
        this._ImgChild('Blood').visible = false;
    }
    enemyHouseStage = false;
    lwgEvent(): void {
        this._evReg(_Game._Event.enemyHouseStage, () => {
            this.enemyHouseStage = true;
            this._ImgChild('Blood').visible = true;
            _EnemyAttack.Level1.house(this._Owner as any);
        })
        this._evReg(_Game._Event.enemyHouseCheckWeapon, (Weapon: Laya.Image, numBlood: number) => {
            this.checkOtherRule(Weapon, 50, this.enemyHouseStage ? numBlood : 0);
        })
    }
    deathFunc(): void {
        new _Role._Boss(this._SceneImg('BossParent'), Levels_Boss);
    }
}