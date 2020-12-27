import { Admin, DataAdmin, Effects2D, EventAdmin, TimerAdmin, Tools, _SceneBase, _SceneName } from "./Lwg";
import { _LwgEvent } from "./LwgEvent";
import { _Boss } from "./_Boss";
import { _Res } from "./_PreLoad";
import { _PropTry } from "./_PropTry";

/**游戏场景模块*/
export module _Game {
    export class _Weapon extends Admin._ObjectBase {
        launchAcc: number = 0;
        dropAcc: number = 0;
        get state(): string {
            return this['Statevalue'] ? this['Statevalue'] : 'launch';
        };
        set state(_state: string) {
            this['Statevalue'] = _state;
        };
        stateType = {
            launch: 'launch',
            free: 'free',
        }
        getSpeed(): number {
            return 20 + 0.1;
        }
        getDropSpeed(): number {
            return this.dropAcc += 0.5;
        }
        lwgOnAwake(): void {
            TimerAdmin._frameLoop(1, this, () => {
                this.move();
            })
        }
        move(): void {
            if (this.getSpeed() > 0) {
                let p = Tools._Point.angleAndLenByPoint(this._Owner.rotation - 90, this.getSpeed()); this._Owner.x += p.x;
                this._Owner.y += p.y;
            } else {
                this._Owner.y += this.getDropSpeed();
            }
            !Tools._Node.leaveStage(this._Owner, () => {
                this._Owner.removeSelf();
            }) && this.checkEnemy();
        }
        drop(): void {
            this.state = this.stateType.free;
            Laya.timer.clearAll(this);
            TimerAdmin._frameLoop(1, this, () => {
                this._Owner.y += 40;
                this._Owner.rotation += 10;
                Tools._Node.leaveStage(this._Owner, () => {
                    this._Owner.removeSelf();
                });
            })
        }
        skill(Enemy: Laya.Image): void {
            this._evNotify(_LwgEvent.Game.enemyBlood, [Enemy, 1]);
            this._Owner.removeSelf();
        }
        checkEnemy(): void {
            if (this.state === this.stateType.free) {
                return;
            }
            // 先判断有没有石头，然后再for循环，减少内存开销
            if (this._SceneImg('FrontScenery').getChildByName('Stone')) {
                for (let index = 0; index < this._SceneImg('FrontScenery').numChildren; index++) {
                    const element = this._SceneImg('FrontScenery').getChildAt(index) as Laya.Image;
                    if (element.name == 'Stone') {
                        let gPStone = this._SceneImg('FrontScenery').localToGlobal(new Laya.Point(element.x, element.y))
                        if (gPStone.distance(this._gPoint.x, this._gPoint.y) < 30) {
                            this.drop();
                            return;
                        }
                    }
                }
            }
            for (let index = 0; index < this._SceneImg('EnemyParent').numChildren; index++) {
                const Enemy = this._SceneImg('EnemyParent').getChildAt(index) as Laya.Image;
                let gPEnemy = this._SceneImg('EnemyParent').localToGlobal(new Laya.Point(Enemy.x, Enemy.y));
                if (gPEnemy.distance(this._gPoint.x, this._gPoint.y) < 50) {
                    // 通过倾斜角度计算是否可以打到，有头盔的在头向下的时候打不到
                    let Shell = Enemy.getChildByName('Shell') as Laya.Image;
                    if (Shell) {
                        const landContentGP = this._SceneImg('Content').localToGlobal(new Laya.Point(this._SceneImg('Land').x, this._SceneImg('Land').y));
                        let angle = Tools._Point.pointByAngle(landContentGP.x - this._gPoint.x, landContentGP.y - this._gPoint.y) + 90;
                        if (210 < angle && angle < 330) {
                            this.drop();
                        } else {
                            this.skill(Enemy);
                        }
                    } else {
                        this.skill(Enemy);
                    }
                    return;
                }
            }
            //什么都没有打中时，会停在地面上，不会穿透地面
            const LandContentGP = this._SceneImg('Content').localToGlobal(new Laya.Point(this._SceneImg('Land').x, this._SceneImg('Land').y));
            if (LandContentGP.distance(this._gPoint.x, this._gPoint.y) < 155) {
                Laya.timer.clearAll(this);
                this.state = this.stateType.free;
                const lP = this._SceneImg('Land').globalToLocal(this._gPoint);
                this._SceneImg('Land').addChild(this._Owner);
                this._Owner.pos(lP.x, lP.y);
                this._Owner.rotation -= this._SceneImg('Land').rotation;
                const mask = new Laya.Sprite;
                mask.size(200, 300);
                mask.pos(0, Tools._Number.randomOneBySection(20, 30));
                mask.loadImage('Lwg/UI/ui_l_orthogon_white.png');
                this._Owner.mask = mask;
                // 注意层级关系，这样有层次感
                this._Owner.zOrder = Tools._Number.randomOneBySection(0, 5);
                TimerAdmin._frameOnce(600, this, () => {
                    this._Owner.removeSelf();
                })
            }
        }
    }
    export class Game extends Admin._SceneBase {
        EnemyData: _Boss._EnemyData;
        lwgOnAwake(): void {
            //设置敌人
            this.EnemyData = new _Boss._EnemyData(this._ImgVar('EnemyParent'));
            this.EnemyData.createEnmey();
            _Boss._BossData._ins().createLevelBoss(this._ImgVar('EnemyParent'));
        }
        lwgOnStart(): void {
            TimerAdmin._frameLoop(1, this, () => {
                this._ImgVar('Land').rotation += 0.1;
            })
        }
        lwgEvent(): void {
            let bloodNum = 20;
            let _width = 100;
            this._evReg(_LwgEvent.Game.heroBlood, (number: number) => {
                let Blood = this._ImgVar('Blood').getChildAt(0) as Laya.Image;
                Blood.width = Blood.width - _width / 20;
                bloodNum -= number;
                if (!this['bloodNumSwitch']) {
                    if (bloodNum <= 0) {
                        this['bloodNumSwitch'] = true
                        this._openScene(_SceneName.Defeated, false);
                    }
                }
            });
            this._evReg(_LwgEvent.Game.closeScene, () => {
                this._closeScene();
            });
        }
        Hero = {
            mouseP: null as Laya.Point,
            move: (e: Laya.Event) => {
                if (this.Hero.mouseP) {
                    let diffX = e.stageX - this.Hero.mouseP.x;
                    let diffY = e.stageY - this.Hero.mouseP.y;
                    this._ImgVar('HeroContent').x += diffX;
                    this._ImgVar('HeroContent').y += diffY;
                    this.Hero.mouseP = new Laya.Point(e.stageX, e.stageY);
                    if (this._ImgVar('HeroContent').x > Laya.stage.width) {
                        this._ImgVar('HeroContent').x = Laya.stage.width;
                    }
                    if (this._ImgVar('HeroContent').x < 0) {
                        this._ImgVar('HeroContent').x = 0;
                    }
                    if (this._ImgVar('HeroContent').y <= 0) {
                        this._ImgVar('HeroContent').y = 0;
                    }
                    if (this._ImgVar('HeroContent').y > Laya.stage.height) {
                        this._ImgVar('HeroContent').y = Laya.stage.height;
                    }
                }
            },
            createWeapon: (color: string, x: number, y: number): Laya.Image => {
                const Weapon = Tools._Node.createPrefab(_Res._list.prefab2D.Weapon.prefab) as Laya.Image;
                this._ImgVar('WeaponParent').addChild(Weapon);
                Weapon.addComponent(_Weapon);
                Weapon.pos(x, y);
                const Pic = Weapon.getChildByName('Pic') as Laya.Image;
                Pic.skin = `Game/UI/Game/Hero/Hero_01_weapon_${color}.png`;
                Weapon.name = color;
                return Weapon;
            }
        }
        lwgOnStageDown(e: Laya.Event): void {
            this.Hero.mouseP = new Laya.Point(e.stageX, e.stageY);
        }
        lwgOnStageMove(e: Laya.Event) {
            this.Hero.move(e);
        }
        time = 0;
        lwgOnStageUp(): void {
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
            this.Hero.createWeapon(color, this._ImgVar('HeroContent').x, this._ImgVar('HeroContent').y);
            this.Hero.mouseP = null;
        }
    }
}
export default _Game.Game;



