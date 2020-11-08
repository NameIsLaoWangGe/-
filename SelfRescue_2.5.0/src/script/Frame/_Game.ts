import { Admin, Animation2D, Click, EventAdmin, TimerAdmin, Tools, _Gold, _SceneName } from "./Lwg";
import { _PreloadUrl } from "./_PreLoad";
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
                EventAdmin._notify(_Event._Game_WeaponSate, [_WeaponSateType.mouseMove]);
            }
        },
    }
    export enum _Event {
        _Game_WeaponSate = '_Game_WeaponSate',
    }
    export enum _WeaponSateType {
        rotate = 'rotate',
        mouseMove = 'mouseMove',
        launch = 'launch',
        free = 'free',
    }
    export function _init(): void {
    }
    export class _Enemy extends Admin._Object {

    }
    export class _Weapon extends Admin._Object {
        Parent: Laya.Image;
        weapon = {
            distance: 0,
            baseSpeed: 60,
            accelerated: 1,
            get state(): string {
                return this['Statevalue'];
            },
            set state(val: string) {
                this['Statevalue'] = val;
            },
            speed: (): number => {
                if (!this['weaponGetTime']) {
                    this['weaponGetTime'] = 0;
                }
                this['weaponGetTime']++;
                this.weapon.baseSpeed += this.weapon.accelerated;
                let speed = this.weapon.baseSpeed * this['weaponGetTime'];
                return this.weapon.distance + speed;
            }
        }
        lwgOnAwake(): void {
            this.Parent = this.Owner.parent as Laya.Image;
            this.weapon.distance = this.Parent.width / 2;
        }
        lwgOnStart(): void {
        }
        lwgEventRegister(): void {
            var getAim = () => {
                let Fulcrum = _fireControl.Aim.getChildAt(0) as Laya.Image;
                let point = _fireControl.Aim.localToGlobal(new Laya.Point(Fulcrum.x, Fulcrum.y));
                let gOwnerXY = this.Parent.localToGlobal(new Laya.Point(this.Owner.x, this.Owner.y));
                if (point.distance(gOwnerXY.x, gOwnerXY.y) < 30) {
                    this.Owner.scale(1.2, 1.2);
                } else {
                    this.Owner.scale(1, 1);
                }
            }
            var move = (rSpeed: number, radius: number) => {
                let point = Tools.Point.getRoundPos(rSpeed ? this.Owner.rotation += rSpeed : this.Owner.rotation, radius, new Laya.Point(this.Parent.width / 2, this.Parent.height / 2))
                this.Owner.x = point.x;
                this.Owner.y = point.y;
            }
            EventAdmin._register(_Event._Game_WeaponSate, this, (type: string) => {
                if (this.weapon.state == _WeaponSateType.launch || this.weapon.state == _WeaponSateType.free) {
                    return;
                }
                Laya.timer.clearAll(this);
                if (type == _WeaponSateType.rotate) {
                    TimerAdmin._frameLoop(1, this, () => {
                        move(_fireControl.moveRotateSpeed > 0 ? 0.1 : -0.1, this.Parent.width / 2 - 50);
                        getAim();
                    })
                } else if (type == _WeaponSateType.mouseMove) {
                    move(_fireControl.moveRotateSpeed, this.Parent.width / 2 - 50);
                    getAim();
                } else if (type == _WeaponSateType.launch) {
                    if (this.Owner.scaleX == 1.2) {
                        this.weapon.state = _WeaponSateType.free;
                        TimerAdmin._frameLoop(1, this, () => {
                            this.weapon.state = _WeaponSateType.launch;
                            move(null, this.weapon.speed());
                            for (let index = 0; index < _fireControl.EnemyParent.numChildren; index++) {
                                const element = _fireControl.EnemyParent.getChildAt(index) as Laya.Image;
                                let point = _fireControl.EnemyParent.localToGlobal(new Laya.Point(element.x, element.y));
                                let gOwnerXY = this.Parent.localToGlobal(new Laya.Point(this.Owner.x, this.Owner.y));
                                if (point.distance(gOwnerXY.x, gOwnerXY.y) < 50) {
                                    this.weapon.state = _WeaponSateType.free;
                                    Laya.timer.clearAll(this);
                                    if (this.Owner.name == element.name.substr(5)) {
                                        element.removeSelf();
                                        this.Owner.removeSelf();
                                    } else {
                                        TimerAdmin._frameLoop(1, this, () => {
                                            this.Owner.y += 10;
                                            this.Owner.rotation += 5;
                                            if (this.Owner.y > Laya.stage.height) {
                                                this.Owner.removeSelf();
                                            }
                                        })
                                    }
                                    return;
                                }
                            }
                        })
                    } else {
                        TimerAdmin._frameLoop(1, this, () => {
                            move(_fireControl.moveRotateSpeed > 0 ? 0.1 : -0.1, this.Parent.width / 2 - 50);
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
                let Weapon = Tools.Node.prefabCreate(_PreloadUrl._list.prefab2D.Weapon.prefab) as Laya.Image;
                this.ImgVar('WeaponParent').addChild(Weapon);
                let point = Tools.Point.getRoundPos(index / _Data._arr.length * 360, this.ImgVar('WeaponParent').width / 2 - 50, new Laya.Point(this.ImgVar('WeaponParent').width / 2, this.ImgVar('WeaponParent').height / 2))
                Weapon.x = point.x;
                Weapon.y = point.y;
                Weapon.rotation = index / _Data._arr.length * 360;
                Weapon.skin = `Game/UI/Game/Hero/Hero_01_weapon_${_Data._arr[index]['name']}.png`;
                Weapon.addComponent(_Weapon);
                Weapon.name = _Data._arr[index][_Data._property.name];
            }
            EventAdmin._notify(_Event._Game_WeaponSate, [_WeaponSateType.rotate]);
        }

        lwgOnStart(): void {
            TimerAdmin._frameLoop(1, this, () => {
                this.ImgVar('LandContent').rotation += 0.1;
            })
            _fireControl.EnemyParent = this.ImgVar('EnemyParent');
            _fireControl.Aim = this.ImgVar('Aim');
            for (let index = 0; index < this.ImgVar('EnemyParent').numChildren; index++) {
                const element = this.ImgVar('EnemyParent').getChildAt(index) as Laya.Image;
                Tools.Node.changePovit(element, element.width / 2, element.height / 2);
                let rotate = Tools.randomOneHalf() == 1 ? -0.5 : 0.5;
                TimerAdmin._frameLoop(1, this, () => {
                    let point = Tools.Point.getRoundPos(element.rotation += rotate, this.ImgVar('MobileFrame').width / 2 + element.height / 2, new Laya.Point(this.ImgVar('LandContent').width / 2, this.ImgVar('LandContent').height / 2))
                    element.x = point.x;
                    element.y = point.y;
                })
            }
        }

        aimControl = {
            moveDownY: 0 as number,
        }

        lwgBtnClick(): void {
            this.ImgVar('AimOperation').height = this.ImgVar('WeaponOperation').height = Laya.stage.height;
            Click._on(Click._Type.noEffect, this.ImgVar('WeaponOperation'), this,
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
                        EventAdmin._notify(_Event._Game_WeaponSate, [_WeaponSateType.mouseMove]);
                    }
                },
                (e: Laya.Event) => {
                    _fireControl.rotateSwitch = true;
                    _fireControl.moveDownY = 0;
                    EventAdmin._notify(_Event._Game_WeaponSate, [_WeaponSateType.launch]);
                },
                (e: Laya.Event) => {
                    _fireControl.rotateSwitch = true;
                    _fireControl.moveDownY = 0;
                },
            );

            Click._on(Click._Type.noEffect, this.ImgVar('AimOperation'), this,
                (e: Laya.Event) => {
                    this.aimControl.moveDownY = e.stageY;
                },
                (e: Laya.Event) => {
                    if (this.aimControl.moveDownY && Math.abs(this.aimControl.moveDownY - e.stageY) > 10) {
                        if (this.aimControl.moveDownY - e.stageY > 0) {
                            this.ImgVar('Aim').rotation += 5;
                        } else {
                            this.ImgVar('Aim').rotation -= 5;
                        }
                        if (this.ImgVar('Aim').rotation < -45) {
                            this.ImgVar('Aim').rotation = -45;
                        }
                        if (45 < this.ImgVar('Aim').rotation) {
                            this.ImgVar('Aim').rotation = 45;
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
        }

    }
}
export default _Game.Game;



