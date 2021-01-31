import BloodBase from "./BloodBase";
import { EnemyAttack } from "./EnemyAttack";
import { _Game, _Role } from "../_GameData";
import { Boss } from "./Boss";

export class EnemyHouse extends BloodBase {
    lwgOnAwake(): void {
        this.bloodInit(100);
        this._ImgChild('Blood').visible = false;
    }
    enemyHouseStage = false;
    lwgEvent(): void {
        this._evReg(_Game._Event.enemyHouseStage, () => {
            this.enemyHouseStage = true;
            this._ImgChild('Blood').visible = true;
            EnemyAttack.attackType6(this._Owner);
        })
        this._evReg(_Game._Event.enemyHouseCheckWeapon, (Weapon: Laya.Image, numBlood: number) => {
            this.checkOtherRule(Weapon, 50, this.enemyHouseStage ? numBlood : 0);
        })
    }
    deathFunc(): void {
        new _Role._Boss(this._SceneImg('BossParent'), Boss);
    }
}