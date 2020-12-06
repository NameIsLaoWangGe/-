import { Admin, Animation2D, Click, EventAdmin, TimerAdmin, Tools, _SceneName } from "./Lwg";
import { _Res } from "./_PreLoad";
import { _PropTry } from "./_PropTry";

/**游戏场景模块*/
export module _Game {
    export class _Data {
        static _property = {
            name: 'name',
            index: 'index',
            color: 'color',
        }
        static _arr = [
            {
                index: 1,
                name: 'yellow',
                color: 'yellow',
            },
            {
                index: 2,
                name: 'yellow',
                color: 'yellow',
            },
            {
                index: 3,
                name: 'blue',
                color: 'blue',
            }, {
                index: 4,
                name: 'blue',
                color: 'blue',
            }, {
                index: 5,
                name: 'red',
                color: 'red',
            }, {
                index: 6,
                name: 'red',
                color: 'red',
            }, {
                index: 7,
                name: 'blue',
                color: 'blue',
            }, {
                index: 8,
                name: 'blue',
                color: 'blue',
            },
            {
                index: 9,
                name: 'blue',
                color: 'blue',
            },
            {
                index: 10,
                name: 'blue',
                color: 'blue',
            },
            {
                index: 11,
                name: 'red',
                color: 'red',
            },
            {
                index: 12,
                name: 'yellow',
                color: 'yellow',
            },
        ]
    }
    export enum _Label {
        trigger = 'trigger',
        weapon = 'weapon',
        enemy = 'enemy',
    }
    export let _fireControl = {
        Aim: null as Laya.Image,
        EnemyParent: null as Laya.Image,
        rotateSwitch: true,
        moveDownY: 0 as number,
        get moveRotateSpeed(): number {
            return this['_rotateSpeed'] ? this['_rotateSpeed'] : 0;
        },
        set moveRotateSpeed(speed: number) {
            if (!_fireControl.rotateSwitch) {
                this['_rotateSpeed'] = speed;
                EventAdmin._notify(_Event.WeaponSate, [_WeaponSateType.mouseMove]);
            }
        },
    }
    export enum _Event {
        WeaponSate = '_Game_WeaponSate',
        EnemyMove = '_Game_EnemyMove',
        calculateBlood = '_Game_calculateBlood',
        skillEnemy = '_Game_skillEnemy',
        closeScene = '_Game_closeScene',
        aimAddColor = '_Game_aimAddColor',
        aimSubColor = '_Game_aimSubColor',
    }
    export enum _WeaponSateType {
        rotate = '_WeaponSateType_rotate',
        mouseMove = '_WeaponSateType_mouseMove',
        launch = '_WeaponSateType_launch',
        free = '_WeaponSateType_free',
        // 障碍物等作废状态，此时无害
        Invalid = '_WeaponSateType_Invalid ',
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
            let p = new Laya.Point(this._Owner.x - GPoint.x, this._Owner.y - GPoint.y);
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
                    this._Scene.addChild(bullet);
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
        distance: number;
        baseSpeed = 60;
        accelerated = 1;
        rotateRadius: number;
        get state(): string {
            return this['Statevalue'];
        };
        set state(_state: string) {
            this['Statevalue'] = _state;
        };
        speed(): number {
            if (!this['weaponGetTime']) {
                this['weaponGetTime'] = 0;
            }
            this['weaponGetTime']++;
            this.baseSpeed += this.accelerated;
            let speed = this.baseSpeed * this['weaponGetTime'];
            return this.distance + speed;
        }
        lwgOnAwake(): void {
            this.distance = this._Parent.width / 2;
            this.rotateRadius = this._Parent.width / 2;
        }
        lwgEvent(): void {
            var move = () => {
                let p = Tools._Point.angleAndLenByPoint(this._Owner.rotation - 90, this.baseSpeed);
                this._Owner.x += p.x;
                this._Owner.y += p.y;
                !Tools._Node.leaveStage(this._Owner, () => {
                    this._Owner.removeSelf();
                }) && checkEnemy();
            }
            var drop = () => {
                Laya.timer.clearAll(this);
                TimerAdmin._frameLoop(1, this, () => {
                    this._Owner.y += 40;
                    this._Owner.rotation += 10;
                    Tools._Node.leaveStage(this._Owner, () => {
                        this._Owner.removeSelf();
                    });
                })
            }
            var skill = (Enemy: Laya.Image) => {
                this._evNotify(_Event.skillEnemy, [1]);
                Enemy.removeSelf();
                this._Owner.removeSelf();
            }
            var checkEnemy = () => {
                // 先判断有没有石头，然后再for循环，减少内存开销
                if (this._SceneImg('FrontScenery').getChildByName('Stone')) {
                    for (let index = 0; index < this._SceneImg('FrontScenery').numChildren; index++) {
                        const element = this._SceneImg('FrontScenery').getChildAt(index) as Laya.Image;
                        if (element.name == 'Stone') {
                            let gPStone = this._SceneImg('FrontScenery').localToGlobal(new Laya.Point(element.x, element.y))
                            if (gPStone.distance(this._gPoint.x, this._gPoint.y) < 50) {
                                drop();
                                return;
                            }
                        }
                    }
                }
                for (let index = 0; index < _fireControl.EnemyParent.numChildren; index++) {
                    const Enemy = _fireControl.EnemyParent.getChildAt(index) as Laya.Image;
                    let gPEnemy = this._SceneImg('EnemyParent').localToGlobal(new Laya.Point(Enemy.x, Enemy.y));
                    if (gPEnemy.distance(this._gPoint.x, this._gPoint.y) < 50) {
                        if (this._Owner.name === Enemy.name.substr(5)) {
                            // 判断有没有头盔,有可能当前帧位置恰好在头盔和敌人之间，那么需要判断，只要头盔位置大于一个高度或者一个角度，则射击有效，反之，则无效
                            let Shell = Enemy.getChildByName('Shell') as Laya.Image;
                            if (Shell) {
                                let gPShell = Enemy.localToGlobal(new Laya.Point(Shell.x, Shell.y));
                                if (gPShell.distance(this._gPoint.x, this._gPoint.y) < 30 || gPShell.y > gPEnemy.y) {
                                    drop();
                                } else {
                                    skill(Enemy);
                                }
                            } else {
                                skill(Enemy);
                            }
                        } else {
                            drop();
                        }
                        return;
                    }
                }
            }
            this._evReg(_Event.WeaponSate, (type: string) => {
                if (type === _WeaponSateType.free) {
                    return;
                } else {
                    if (type === _WeaponSateType.launch) {
                        this.state === _WeaponSateType.free;
                        TimerAdmin._frameLoop(1, this, () => {
                            move();
                        })
                    }
                }
            })
        }
    }
    export class Game extends Admin._SceneBase {
        lwgOnEnable(): void {
            console.log('11');
        }
        lwgOnStart(): void {
            TimerAdmin._frameLoop(1, this, () => {
                this._ImgVar('LandContent').rotation += 0.1;
            })
            _fireControl.EnemyParent = this._ImgVar('EnemyParent');
            _fireControl.Aim = this._ImgVar('Aim');
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
                    this._ImgVar('Bow').skin = `Game/UI/Game/Hero/Hero_01_bow_normalc.png`
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

        aimControl = {
            moveDownY: 0 as number,
        }

        presentWeapon: Laya.Image;
        lwgButton(): void {
            var createWeapon = (color: string): Laya.Image => {
                let Weapon = Tools._Node.createPrefab(_Res._list.prefab2D.Weapon.prefab) as Laya.Image;
                this._ImgVar('WeaponParent').addChild(Weapon);
                let Pic = Weapon.getChildByName('Pic') as Laya.Image;
                Pic.skin = `Game/UI/Game/Hero/Hero_01_weapon_${color}.png`;
                Weapon.name = color;
                Weapon.addComponent(_Weapon);
                return Weapon;
            }
            let QuiverArr = [this._ImgVar('Quiver_blue'), this._ImgVar('Quiver_yellow'), this._ImgVar('Quiver_red')]
            for (let index = 0; index < QuiverArr.length; index++) {
                const element = QuiverArr[index] as Laya.Image;
                this._btnFour(element,
                    (e: Laya.Event) => {
                        e.stopPropagation();
                        this[`${element.name}click`] = true;
                        this[`${element.name}time`] = 0;
                        this.heroFp = null;
                    },
                    (e: Laya.Event) => {
                        if (this[`${element.name}click`]) {
                            this[`${element.name}time`]++;
                            if (this[`${element.name}time`] >= 2) {
                                this.luanch = false;
                                this.presentWeapon = createWeapon(element.name.substr(7)) as Laya.Image;
                                this[`${element.name}click`] = false;
                            }
                        }
                    },
                    () => {
                        this[`${element.name}click`] = false;
                    },
                    () => {
                        this[`${element.name}click`] = false;
                    }, 'null');
            }
            this._btnFour(this._ImgVar('AimL'),
                (e: Laya.Event) => {
                    e.stopPropagation();
                    Animation2D._clearAll([this._ImgVar('Aim')])
                    TimerAdmin._frameLoop(1, this._ImgVar('AimL'), () => {
                        if (this._ImgVar('Aim').rotation > -30) {
                            this._ImgVar('Aim').rotation -= 2;
                        }
                    })
                },
                null,
                () => {
                    TimerAdmin._clearAll([this._ImgVar('AimL')]);
                },
                () => {
                    TimerAdmin._clearAll([this._ImgVar('AimL')]);
                })

            this._btnFour(this._ImgVar('AimR'),
                (e: Laya.Event) => {
                    e.stopPropagation();
                    Animation2D._clearAll([this._ImgVar('Aim')])
                    TimerAdmin._frameLoop(1, this._ImgVar('AimR'), () => {
                        if (this._ImgVar('Aim').rotation < 30) {
                            this._ImgVar('Aim').rotation += 2;
                        }
                    })
                },
                null,
                () => {
                    TimerAdmin._clearAll([this._ImgVar('AimR')]);
                },
                () => {
                    TimerAdmin._clearAll([this._ImgVar('AimR')]);
                })

        }

        /**检测是否在弓箭上*/
        checkinAim(): boolean {
            if (!this.presentWeapon) {
                return;
            }
            let gPoint = this._ImgVar('Aim').localToGlobal(new Laya.Point(this._ImgVar('Fulcrum').x, this._ImgVar('Fulcrum').y));
            let dis = gPoint.distance(this.presentWeapon.x, this.presentWeapon.y);
            if (dis < 100) {
                this._ImgVar('Bow').skin = `Game/UI/Game/Hero/Hero_01_bow_${this.presentWeapon.name}.png`;
                this.presentWeapon.rotation = this._ImgVar('Aim').rotation;
                return true;
            } else {
                this._ImgVar('Bow').skin = `Game/UI/Game/Hero/Hero_01_bow_normalc.png`;
                this.presentWeapon.rotation = 0;
                return false;
            }
        }
        luanch = false;
        heroFp: Laya.Point = null;
        lwgOnStageDown(e: Laya.Event): void {
            this.heroFp = new Laya.Point(e.stageX, e.stageY);
        }
        lwgOnStageMove(e: Laya.Event) {
            if (this.presentWeapon && !this.luanch) {
                this.checkinAim();
                this.presentWeapon.pos(e.stageX, e.stageY);
            } else {
                if (this.heroFp) {
                    let diffX = e.stageX - this.heroFp.x;
                    let diffY = e.stageY - this.heroFp.y;
                    this._ImgVar('HeroContent').x += diffX;
                    this._ImgVar('HeroContent').y += diffY;
                    this.heroFp = new Laya.Point(e.stageX, e.stageY);
                }
            }
        }
        lwgOnStageUp(): void {
            if (this.checkinAim()) {
                if (this.presentWeapon) {
                    this._evNotify(_Event.WeaponSate, [_WeaponSateType.launch]);
                    this.luanch = true;
                    this._ImgVar('Bow').skin = `Game/UI/Game/Hero/Hero_01_bow_normalc.png`;

                    Animation2D._clearAll([this._ImgVar('Aim')])
                    Animation2D.rotate(this._ImgVar('Aim'), 0, 100);
                }
            } else {
                if (this.presentWeapon) {
                    this.presentWeapon.removeSelf();
                }
            }
            this.presentWeapon = null;
            this.heroFp = null;
        }
    }
}
export default _Game.Game;



