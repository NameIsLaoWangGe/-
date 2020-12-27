import { Admin, DataAdmin, Effects2D, TimerAdmin, Tools, _SceneBase, _SceneName } from "./Lwg";
import { _Res } from "./_PreLoad";
import { _PropTry } from "./_PropTry";

/**游戏场景模块*/
export module _Game {
    export class _Data extends DataAdmin._Table {
        static _property = {
            name: 'name',
            index: 'index',
            color: 'color',
        }
    }
    export enum _Label {
        trigger = 'trigger',
        weapon = 'weapon',
        enemy = 'enemy',
    }
    export let _fireControl = {
        EnemyParent: null as Laya.Image,
        rotateSwitch: true,
        moveDownY: 0 as number,
        // get moveRotateSpeed(): number {
        //     return this['_rotateSpeed'] ? this['_rotateSpeed'] : 0;
        // },
        // set moveRotateSpeed(speed: number) {
        //     if (!_fireControl.rotateSwitch) {
        //         this['_rotateSpeed'] = speed;
        //         EventAdmin._notify(_Event.WeaponSate, [_WeaponSateType.mouseMove]);
        //     }
        // },
    }
    export enum _Event {
        WeaponSate = '_Game_WeaponSate',
        EnemyMove = '_Game_EnemyMove',
        calculateBlood = '_Game_calculateBlood',
        skillEnemy = '_Game_skillEnemy',
        closeScene = '_Game_closeScene',
        aimAddColor = '_Game_aimAddColor',
        aimSubColor = '_Game_aimSubColor',
        launch = '_WeaponSateType_launch',
    }
    export enum _EnemySate {
        activity = '_EnemySate_activity',
        death = '_EnemySate_death',
    }
    export function _init(): void {
    }
    export class _Shell extends Admin._ObjectBase {
        lwgOnStart(): void {
            TimerAdmin._frameLoop(1, this, () => {
                // let point = Tools._Point.getRoundPos(this._Owner.rotation += rotate, this._SceneImg('MobileFrame').width / 2 + this._Owner.height / 2, new Laya.Point(this._SceneImg('LandContent').width / 2, this._SceneImg('LandContent').height / 2))
                // this._Owner.x = point.x;
                // this._Owner.y = point.y;
            })
        }
    }
    export class _Stone extends _Shell {
    }
    export class _EnemyBullet extends Admin._ObjectBase {
        speed = 2;
        lwgOnStart(): void {
            let GPoint = this._SceneImg('HeroContent').localToGlobal(new Laya.Point(this._SceneImg('Hero').x, this._SceneImg('Hero').y));
            let p = new Laya.Point(this._gPoint.x - GPoint.x, this._gPoint.y - GPoint.y);
            p.normalize();
            TimerAdmin._frameLoop(1, this, () => {
                this._Owner.x -= p.x * this.speed;
                this._Owner.y -= p.y * this.speed;
                Tools._Node.leaveStage(this._Owner, () => {
                    this._Owner.removeSelf();
                    return;
                });
            })
            TimerAdmin._frameLoop(1, this, () => {
                Tools._Node.checkTwoDistance(this._Owner, this._SceneImg('Hero'), 50, () => {
                    this._Owner.removeSelf();
                    this._evNotify(_Event.calculateBlood, [1]);
                })
            })
        }
    }
    export class _Enemy extends Admin._ObjectBase {
        time = 0;
        state = '';
        lwgOnStart(): void {
            this.state = _EnemySate.activity;
            TimerAdmin._frameRandomLoop(100, 1000, this, () => {
                if (this.state == _EnemySate.activity) {
                    let bullet = Tools._Node.createPrefab(_Res._list.prefab2D.EnemyBullet.prefab)
                    bullet.addComponent(_EnemyBullet);
                    let GPoint = this._Parent.localToGlobal(new Laya.Point(this._Owner.x, this._Owner.y));
                    this._SceneImg('EBparrent').addChild(bullet);
                    bullet.pos(GPoint.x, GPoint.y);
                }
            })
            let rotate = Tools._Number.randomOneHalf() == 1 ? -0.5 : 0.5;
            TimerAdmin._frameLoop(1, this, () => {
                let point = Tools._Point.getRoundPos(this._Owner.rotation += rotate, this._SceneImg('MobileFrame').width / 2 + this._Owner.height / 2, new Laya.Point(this._SceneImg('LandContent').width / 2, this._SceneImg('LandContent').height / 2))
                this._Owner.x = point.x;
                this._Owner.y = point.y;
            })
        }
    }
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
            return 50 + 0.2;
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
            this._evNotify(_Event.skillEnemy, [1]);
            for (let index = 0; index < 20; index++) {
                Effects2D._Particle._spray(Laya.stage, this._gPoint, [0, 0], [10, 35])
            }
            Enemy.removeSelf();
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
            for (let index = 0; index < _fireControl.EnemyParent.numChildren; index++) {
                const Enemy = _fireControl.EnemyParent.getChildAt(index) as Laya.Image;
                let gPEnemy = this._SceneImg('EnemyParent').localToGlobal(new Laya.Point(Enemy.x, Enemy.y));
                if (gPEnemy.distance(this._gPoint.x, this._gPoint.y) < 50) {
                    // 通过倾斜角度计算是否可以打到，有头盔的在头向下的时候打不到
                    let Shell = Enemy.getChildByName('Shell') as Laya.Image;
                    if (Shell) {
                        const landContentGP = this._SceneImg('Content').localToGlobal(new Laya.Point(this._SceneImg('LandContent').x, this._SceneImg('LandContent').y));
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
            const LandContentGP = this._SceneImg('Content').localToGlobal(new Laya.Point(this._SceneImg('LandContent').x, this._SceneImg('LandContent').y));
            if (LandContentGP.distance(this._gPoint.x, this._gPoint.y) < 150) {
                Laya.timer.clearAll(this);
                this.state = this.stateType.free;
                const lP = this._SceneImg('LandContent').globalToLocal(this._gPoint);
                this._SceneImg('LandContent').addChild(this._Owner);
                this._Owner.pos(lP.x, lP.y);
                this._Owner.rotation -= this._SceneImg('LandContent').rotation;
                const mask = new Laya.Sprite;
                mask.size(200, 300);
                mask.pos(0, Tools._Number.randomOneBySection(40, 60));
                mask.loadImage('Lwg/UI/ui_l_orthogon_white.png');
                this._Owner.mask = mask;
            }
        }
    }
    export class Game extends Admin._SceneBase {

        lwgOnAwake(): void {
            this.Hero.init();
        }
        lwgOnStart(): void {
            TimerAdmin._frameLoop(1, this, () => {
                this._ImgVar('LandContent').rotation += 0.1;
            })
            _fireControl.EnemyParent = this._ImgVar('EnemyParent');
            for (let index = 0; index < this._ImgVar('EnemyParent').numChildren; index++) {
                const element = this._ImgVar('EnemyParent').getChildAt(index) as Laya.Image;
                Tools._Node.changePivot(element, element.width / 2, element.height / 2);
                element.addComponent(_Enemy);
            }
        }
        lwgEvent(): void {
            this._evReg(_Event.aimAddColor, (Weapon: Laya.Image) => {
                if (this._ImgVar('Bow')['launch'] !== Weapon) {
                    this._ImgVar('Bow')['launch'] = Weapon;
                    this._ImgVar('Bow').skin = `Game/UI/Game/Hero/Hero_01_bow_${Weapon['_data'][_Data._property.color]}.png`
                }
            });
            this._evReg(_Event.aimSubColor, (Weapon: Laya.Image) => {
                if (this._ImgVar('Bow')['launch'] == Weapon) {
                    this._ImgVar('Bow').skin = `Game/UI/Game/Hero/Hero_01_bow_normalc.png`;
                    this._ImgVar('Bow')['launch'] = null;
                }
            });

            let bloodNum = 20;
            let _width = 100;
            this._evReg(_Event.calculateBlood, (number: number) => {
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

            let enemyNum = this._ImgVar('EnemyParent').numChildren;
            this._evReg(_Event.skillEnemy, () => {
                enemyNum -= 1;
                if (!this['EnemyNumSwitch']) {
                    if (enemyNum <= 0) {
                        this['EnemyNumSwitch'] = true
                        this._openScene(_SceneName.Victory, false);
                    }
                }
            });
            this._evReg(_Event.closeScene, () => {
                this._closeScene();
            });
        }

        lwgButton(): void {
        }
        create(color: string, x: number, y: number): Laya.Image {
            const Weapon = Tools._Node.createPrefab(_Res._list.prefab2D.Weapon.prefab) as Laya.Image;
            this._ImgVar('WeaponParent').addChild(Weapon);
            Weapon.addComponent(_Weapon);
            Weapon.pos(x, y);
            const Pic = Weapon.getChildByName('Pic') as Laya.Image;
            Pic.skin = `Game/UI/Game/Hero/Hero_01_weapon_${color}.png`;
            Weapon.name = color;
            return Weapon;
        }
        Hero = {
            mouseP: null as Laya.Point,
            ContentFP: null as Laya.Point,
            expand: 250,
            onoff: false,
            init: () => {
                this.Hero.ContentFP = new Laya.Point(this._ImgVar('Content').x, this._ImgVar('Content').y);
            },
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
                    if (this._ImgVar('HeroContent').y > Laya.stage.height - 200) {
                        this._ImgVar('HeroContent').y = Laya.stage.height - 200;
                        this.Hero.onoff = true;
                    }
                }
            }
        }

        lwgOnStageDown(e: Laya.Event): void {
            this.Hero.mouseP = new Laya.Point(e.stageX, e.stageY);
        }
        lwgOnStageMove(e: Laya.Event) {
            this.Hero.move(e);
        }
        // time = 0;
        lwgOnStageUp(): void {
            let color: string;
            // this.time++;
            // if (this.time == 1) {
            //     color = 'blue';
            // } else if (this.time == 2) {
            //     color = 'yellow';
            // } else if (this.time == 3) {
            //     color = 'red';
            //     this.time = 0;
            // }
            this.create('blue', this._ImgVar('HeroContent').x, this._ImgVar('HeroContent').y);
            this.Hero.mouseP = null;
        }
    }
}
export default _Game.Game;



