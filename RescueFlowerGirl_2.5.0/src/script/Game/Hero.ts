import { Admin, TimerAdmin, Tools, _SceneName } from "../Frame/Lwg";
import { _GameEvent } from "./_GameEvent";
import { HeroWeapon } from "./HeroWeapon";
import { _Res } from "../Frame/_PreLoad";
import BloodBase from "./BloodBase";
export default class Hero extends BloodBase {
    bloodSum: number;
    bloodPresnt: number;
    bloodPic: Laya.Image;
    bloodWidth: number;
    /**攻击间隔*/
    attackInterval: number;
    /**弹道数量*/
    ballisticNum: number;
    /**弹道数量对应弹道位置*/
    ballisticPos: number[][][];
    /**发射次数*/
    time: number;
    lwgOnAwake(): void {
        this.bloodInit(50);
        this.attackInterval = 10;
        this.ballisticNum = 1;
        this.ballisticPos = [
            [[0, 0]],
            [[-20, 0], [20, 0]],
            [[-20, 0], [0, 0], [20, 0]],
            [[-30, 0], [-10, 0], [10, 0], [30, 0]],
            [[-40, 0], [-20, 0], [0, 0], [20, 0], [40, 0]],
            [[-50, 0], [-30, 0], [-10, 0], [10, 0], [30, 0], [50, 0]],
            [[-60, 0], [-40, 0], [-20, 0], [0, 0], [20, 0], [40, 0], [60, 0]],
        ]
        this.time = 0;
    }
    lwgOnStart(): void {
        TimerAdmin._frameLoop(this.attackInterval, this, () => {
            if (this.mouseP) {
                for (let index = 1; index < this.ballisticPos[this.ballisticNum].length; index++) {
                    const pos = this.ballisticPos[this.ballisticNum][index];
                    if (pos) {
                        this.createWeapon(Tools._Array.randomGetOne(['blue', 'yellow', 'red']), this._Owner.x + pos[0], this._Owner.y + pos[1]);
                    }
                }
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
                    this.ballisticNum++;
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
    createWeapon(color: string, x: number, y: number): Laya.Image {
        const Weapon = Tools._Node.createPrefab(_Res._list.prefab2D.Weapon.prefab) as Laya.Image;
        this._SceneImg('WeaponParent').addChild(Weapon);
        Weapon.addComponent(HeroWeapon);
        Weapon.pos(x, y);
        const Pic = Weapon.getChildByName('Pic') as Laya.Image;
        Pic.skin = `Game/UI/Game/Hero/Hero_01_weapon_${color}.png`;
        Weapon.name = color;
        return Weapon;
    };
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