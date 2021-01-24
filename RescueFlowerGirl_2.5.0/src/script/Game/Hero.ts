import { Admin, TimerAdmin, Tools, _SceneName } from "../Frame/Lwg";
import { _GameEvent } from "./_GameEvent";
import { HeroWeapon } from "./HeroWeapon";
import { _Res } from "../Frame/_PreLoad";
import BloodBase from "./BloodBase";
import { HeroAttack } from "./HeroAttack";
export default class Hero extends BloodBase {
    /**攻击间隔*/
    attackInterval: number;
    /**攻击控制*/
    _HeroAttack: HeroAttack;
    lwgOnAwake(): void {
        this.bloodInit(50);
        this.attackInterval = 10;
        this._HeroAttack = new HeroAttack(this._SceneImg('WeaponParent'), this._Owner);
        this._HeroAttack.ballisticNum = 1;
    }
    lwgOnStart(): void {
        TimerAdmin._frameLoop(this.attackInterval, this, () => {
            if (this.mouseP) {
                this._HeroAttack.attack_S();
            }
        })
    }
    deathFunc(): void {
        this._openScene(_SceneName.Defeated, false);
    }
    lwgEvent(): void {
        this._evReg(_GameEvent.Game.checkEnemyBullet, (Bullet: Laya.Image, numBlood: number) => {
            this.checkOtherRule(Bullet, 40, numBlood);
        });
        this._evReg(_GameEvent.Game.checkBuff, (type: number) => {
            switch (type) {
                case 0:
                    this._HeroAttack.ballisticNum++;
                    break;
                case 1:

                    break;
                case 2:

                    break;
                case 3:

                    break;
                default:
                    break;
            }
        })
    }

    mouseP: Laya.Point;
    move(e: Laya.Event) {
        if (this.mouseP) {
            let diffX = e.stageX - this.mouseP.x;
            let diffY = e.stageY - this.mouseP.y;
            this._Owner.x += diffX;
            this._Owner.y += diffY;
            this.mouseP = new Laya.Point(e.stageX, e.stageY);
            if (this._Owner.x > Laya.stage.width) {
                this._Owner.x = Laya.stage.width;
            }
            if (this._Owner.x < 0) {
                this._Owner.x = 0;
            }
            if (this._Owner.y <= 0) {
                this._Owner.y = 0;
            }
            if (this._Owner.y > Laya.stage.height) {
                this._Owner.y = Laya.stage.height;
            }
        }
    };
    lwgOnStageDown(e: Laya.Event): void {
        this.mouseP = new Laya.Point(e.stageX, e.stageY);
    }
    lwgOnStageMove(e: Laya.Event) {
        this.move(e);
    }
    lwgOnStageUp(): void {
        this.mouseP = null;
    }

}