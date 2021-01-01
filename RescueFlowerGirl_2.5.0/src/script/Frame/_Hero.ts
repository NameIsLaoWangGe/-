import { Admin, TimerAdmin, Tools, _SceneName } from "./Lwg";
import { _LwgEvent } from "./LwgEvent";
import { _HeroWeapon } from "./_HeroWeapon";
import { _Res } from "./_PreLoad";
export default class _Hero extends Admin._ObjectBase {
    /**血量图片*/
    Blood: Laya.Image;
    /**血量*/
    bloodNum: number;
    /**攻击间隔*/
    attackInterval: number;
    /**发射次数*/
    time: number;
    lwgOnAwake(): void {
        this.Blood = this._Owner.getChildByName('Blood') as Laya.Image;
        this.bloodNum = 5;
        this.attackInterval = 10;
        this.time = 0;
    }
    lwgOnStart(): void {
        TimerAdmin._frameLoop(this.attackInterval, this, () => {
            if (this.mouseP) {
                let color: string;
                this.time++;
                if (this.time == 1) {
                    color = 'blue';
                } else if (this.time == 2) {
                    color = 'yellow';
                } else if (this.time == 3) {
                    color = 'red';
                    this.time = 0;
                }
                this.createWeapon(color, this._Owner.x, this._Owner.y);
            }
        })
    }
    lwgEvent(): void {
        const Pro = this.Blood.getChildAt(0) as Laya.Image;
        const _Prowidth = Pro.width;
        this._evReg(_LwgEvent.Game.heroBlood, (number: number) => {
            Pro.width = Pro.width - _Prowidth / this.bloodNum;
            this.bloodNum -= number;
            if (!this['bloodNumSwitch']) {
                if (this.bloodNum <= 0) {
                    this['bloodNumSwitch'] = true;
                    this._openScene(_SceneName.Defeated, false);
                }
            }
        });
    }
    createWeapon(color: string, x: number, y: number): Laya.Image {
        const Weapon = Tools._Node.createPrefab(_Res._list.prefab2D.Weapon.prefab) as Laya.Image;
        this._SceneImg('WeaponParent').addChild(Weapon);
        Weapon.addComponent(_HeroWeapon);
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