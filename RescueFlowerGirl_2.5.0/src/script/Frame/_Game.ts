import { Admin, Animation2D, Click, EventAdmin, TimerAdmin, Tools, _SceneName } from "./Lwg";
import { _Res } from "./_PreLoad";
import { _PropTry } from "./_PropTry";

/**游戏场景模块*/
export module _Game {
    export class _Data {
        static _property = {
            name: 'name',
            index: 'index',
        }
        static _arr = [
            {
                index: 1,
                name: 'blue',
            },
            {
                index: 2,
                name: 'red',
            },
            {
                index: 3,
                name: 'yellow',
            }, {
                index: 4,
                name: 'red',
            }, {
                index: 5,
                name: 'yellow',
            }, {
                index: 6,
                name: 'red',
            }, {
                index: 7,
                name: 'blue',
            }, {
                index: 8,
                name: 'yellow',
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
        destroyEnemy = '_Game_destroyEnemy',
        closeScene = '_Game_closeScene',
    }
    export enum _WeaponSateType {
        rotate = '_WeaponSateType_rotate',
        mouseMove = '_WeaponSateType_mouseMove',
        launch = '_WeaponSateType_launch',
        free = '_WeaponSateType_free',
    }
    export enum _EnemySate {
        activity = '_EnemySate_activity',
        death = '_EnemySate_death',
    }
    export function _init(): void {
    }
    export class _EnemyBullet extends Admin._ObjectBase {
        speed = 5;
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
                    EventAdmin._notify(_Event.calculateBlood, (1));
                })
            })
        }
    }
    export class _Enemy extends Admin._ObjectBase {
        time = 0;
        state = '';
        lwgOnStart(): void {
            this.state = _EnemySate.activity
            TimerAdmin._frameRandomLoop(60, 100, this, () => {
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
        distance = 0;
        baseSpeed = 60;
        accelerated = 1;
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
        }
        lwgOnStart(): void {

        }
        lwgEventRegister(): void {
            var getAim = () => {
                let Fulcrum = _fireControl.Aim.getChildAt(0) as Laya.Image;
                let point = _fireControl.Aim.localToGlobal(new Laya.Point(Fulcrum.x, Fulcrum.y));
                let g_OwnerXY = this._Parent.localToGlobal(new Laya.Point(this._Owner.x, this._Owner.y));
                if (point.distance(g_OwnerXY.x, g_OwnerXY.y) < 30) {
                    this._Owner.scale(1.2, 1.2);
                } else {
                    this._Owner.scale(1, 1);
                }
            }
            var move = (rSpeed: number, radius: number) => {
                let point = Tools._Point.getRoundPos(rSpeed ? this._Owner.rotation += rSpeed : this._Owner.rotation, radius, new Laya.Point(this._Parent.width / 2, this._Parent.height / 2))
                this._Owner.x = point.x;
                this._Owner.y = point.y;
            }
            EventAdmin._register(_Event.WeaponSate, this, (type: string) => {
                if (this.state == _WeaponSateType.launch || this.state == _WeaponSateType.free) {
                    return;
                }
                Laya.timer.clearAll(this);
                if (type == _WeaponSateType.rotate) {
                    TimerAdmin._frameLoop(1, this, () => {
                        move(_fireControl.moveRotateSpeed > 0 ? 0.1 : -0.1, this._Parent.width / 2 - 50);
                        getAim();
                    })
                } else if (type == _WeaponSateType.mouseMove) {
                    move(_fireControl.moveRotateSpeed, this._Parent.width / 2 - 50);
                    getAim();
                } else if (type == _WeaponSateType.launch) {
                    if (this._Owner.scaleX == 1.2) {
                        this.state = _WeaponSateType.free;
                        TimerAdmin._frameLoop(1, this, () => {
                            this.state = _WeaponSateType.launch;
                            move(null, this.speed());
                            for (let index = 0; index < _fireControl.EnemyParent.numChildren; index++) {
                                const element = _fireControl.EnemyParent.getChildAt(index) as Laya.Image;
                                let point = _fireControl.EnemyParent.localToGlobal(new Laya.Point(element.x, element.y));
                                let g_OwnerXY = this._Parent.localToGlobal(new Laya.Point(this._Owner.x, this._Owner.y));
                                if (point.distance(g_OwnerXY.x, g_OwnerXY.y) < 50) {
                                    this.state = _WeaponSateType.free;
                                    Laya.timer.clearAll(this);
                                    if (this._Owner.name == element.name.substr(5)) {
                                        EventAdmin._notify(_Event.destroyEnemy, (1));
                                        element.removeSelf();
                                        this._Owner.removeSelf();
                                    } else {
                                        TimerAdmin._frameLoop(1, this, () => {
                                            this._Owner.y += 40;
                                            this._Owner.rotation += 10;
                                            if (this._Owner.y > Laya.stage.height) {
                                                this._Owner.removeSelf();
                                            }
                                        })
                                    }
                                    return;
                                }
                            }
                        })
                    } else {
                        TimerAdmin._frameLoop(1, this, () => {
                            move(_fireControl.moveRotateSpeed > 0 ? 0.1 : -0.1, this._Parent.width / 2 - 50);
                            getAim();
                        })
                    }
                }
            })
        }
    }
    export class Game extends Admin._SceneBase {
        lwgOnEnable(): void {
            for (let index = 0; index < _Data._arr.length; index++) {
                let Weapon = Tools._Node.createPrefab(_Res._list.prefab2D.Weapon.prefab) as Laya.Image;
                this._ImgVar('WeaponParent').addChild(Weapon);
                let point = Tools._Point.getRoundPos(index / _Data._arr.length * 360, this._ImgVar('WeaponParent').width / 2 - 50, new Laya.Point(this._ImgVar('WeaponParent').width / 2, this._ImgVar('WeaponParent').height / 2))
                Weapon.x = point.x;
                Weapon.y = point.y;
                Weapon.rotation = index / _Data._arr.length * 360;
                Weapon.skin = `Game/UI/Game/Hero/Hero_01_weapon_${_Data._arr[index]['name']}.png`;
                Weapon.addComponent(_Weapon);
                Weapon.name = _Data._arr[index][_Data._property.name];
            }
            EventAdmin._notify(_Event.WeaponSate, [_WeaponSateType.rotate]);
        }

        lwgEventRegister(): void {
            let bloodNum = 20;
            let _width = 100;
            EventAdmin._register(_Event.calculateBlood, this, (number: number) => {
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
            EventAdmin._register(_Event.destroyEnemy, this, () => {
                enemyNum -= 1;
                if (!this['EnemyNumSwitch']) {
                    if (enemyNum <= 0) {
                        this['EnemyNumSwitch'] = true
                        this._openScene(_SceneName.Victory, false);
                    }
                }
            });
            EventAdmin._register(_Event.closeScene, this, () => {
                this._closeScene();
            });
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

        aimControl = {
            moveDownY: 0 as number,
        }

        lwgBtnRegister(): void {
            this._ImgVar('AimOperation').height = this._ImgVar('WeaponOperation').height = Laya.stage.height;
            this._btnFour(this._ImgVar('WeaponOperation'),
                (e: Laya.Event) => {
                    _fireControl.rotateSwitch = false;
                    _fireControl.moveDownY = e.stageY;
                },
                (e: Laya.Event) => {
                    if (!_fireControl.rotateSwitch && Math.abs(_fireControl.moveDownY - e.stageY) > 10) {
                        if (_fireControl.moveDownY - e.stageY > 10) {
                            _fireControl.moveRotateSpeed = -2;
                        } else {
                            _fireControl.moveRotateSpeed = 2;
                        }
                        _fireControl.moveDownY = e.stageY;
                        EventAdmin._notify(_Event.WeaponSate, [_WeaponSateType.mouseMove]);
                    }
                },
                (e: Laya.Event) => {
                    _fireControl.rotateSwitch = true;
                    _fireControl.moveDownY = 0;
                    EventAdmin._notify(_Event.WeaponSate, [_WeaponSateType.launch]);
                },
                (e: Laya.Event) => {
                    _fireControl.rotateSwitch = true;
                    _fireControl.moveDownY = 0;
                },
            );

            this._btnFour(this._ImgVar('AimOperation'),
                (e: Laya.Event) => {
                    this.aimControl.moveDownY = e.stageY;
                },
                (e: Laya.Event) => {
                    if (this.aimControl.moveDownY && Math.abs(this.aimControl.moveDownY - e.stageY) > 5) {
                        if (this.aimControl.moveDownY - e.stageY > 0) {
                            this._ImgVar('Aim').rotation += 2.5;
                        } else {
                            this._ImgVar('Aim').rotation -= 2.5;
                        }
                        if (this._ImgVar('Aim').rotation < -45) {
                            this._ImgVar('Aim').rotation = -45;
                        }
                        if (45 < this._ImgVar('Aim').rotation) {
                            this._ImgVar('Aim').rotation = 45;
                        }
                        this.aimControl.moveDownY = e.stageY;
                    }
                },
                (e: Laya.Event) => {
                    this.aimControl.moveDownY = null;
                },
                (e: Laya.Event) => {
                    this.aimControl.moveDownY = null;
                },
            );

            this._btnFour(this._ImgVar('Hero'),
                () => {
                    this['HeroMove'] = true;
                },
                null,
                () => {
                    this['HeroMove'] = false;
                },
                null,
            )
        }
        lwgOnStageMove(e: Laya.Event): void {
            if (this['HeroMove']) {
                this._ImgVar('HeroContent').x = e.stageX;
                this._ImgVar('HeroContent').y = e.stageY;
            }
        }

    }
}
export default _Game.Game;



