import { Admin, Animation2D, Click, EventAdmin, TimerAdmin, Tools, _Gold, _SceneName } from "./Lwg";
import { _PreloadUrl } from "./_PreLoad";
import { _PropTry } from "./_PropTry";

/**游戏场景模块*/
export module _Game {
    export class _Data {
        static _property = {
            color: 'color',
            index: 'index',
        }
        static _arr = [
            {
                index: 1,
                color: 'blue',
            },
            {
                index: 2,
                color: 'red',
            },
            {
                index: 3,
                color: 'yellow',
            }, {
                index: 4,
                color: 'red',
            }, {
                index: 5,
                color: 'yellow',
            }, {
                index: 6,
                color: 'red',
            }, {
                index: 7,
                color: 'blue',
            }, {
                index: 8,
                color: 'yellow',
            },

        ]
    }
    export enum _Label {
        trigger = 'trigger',
        weapon = 'weapon',
    }
    export let _fireControl = {
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
        parent: Laya.Image;
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
            this.parent = this.Owner.parent as Laya.Image;
            this.weapon.distance = this.parent.width / 2;
        }
        lwgOnStart(): void {
        }
        lwgEventRegister(): void {
            var move = (rSpeed: number, radius: number) => {
                let point = Tools.Point.getRoundPos(rSpeed ? this.Owner.rotation += rSpeed : this.Owner.rotation, radius, new Laya.Point(this.parent.width / 2, this.parent.height / 2))
                this.Owner.x = point.x;
                this.Owner.y = point.y;
            }
            EventAdmin._register(_Event._Game_WeaponSate, this, (type: string) => {
                if (this.weapon.state == _WeaponSateType.launch) {
                    return;
                }
                Laya.timer.clearAll(this);
                if (type == _WeaponSateType.rotate) {
                    TimerAdmin._frameLoop(1, this, () => {
                        move(_fireControl.moveRotateSpeed > 0 ? 0.1 : -0.1, this.parent.width / 2 - 50);
                    })
                } else if (type == _WeaponSateType.mouseMove) {
                    move(_fireControl.moveRotateSpeed, this.parent.width / 2 - 50);
                } else if (type == _WeaponSateType.launch) {
                    if (this.Owner.scaleX == 1.2) {
                        this.weapon.state = _WeaponSateType.free;
                        TimerAdmin._frameLoop(1, this, () => {
                            this.weapon.state = _WeaponSateType.launch;
                            move(null, this.weapon.speed());
                        })
                    } else {
                        TimerAdmin._frameLoop(1, this, () => {
                            move(_fireControl.moveRotateSpeed > 0 ? 0.1 : -0.1, this.parent.width / 2 - 50);
                        })
                    }
                }
            })

        }
        onTriggerEnter(other: Laya.BoxCollider, self: Laya.BoxCollider, contact: any): void {
            let otherLabel = other.label;
            switch (otherLabel) {
                case _Label.trigger:
                    this.Owner.scale(1.2, 1.2);
                    break;
                default:
                    break;
            }
        }
        onTriggerExit(other: Laya.BoxCollider, self: Laya.BoxCollider, contact: any): void {
            let otherLabel = other.label;
            switch (otherLabel) {
                case _Label.trigger:
                    this.Owner.scale(1, 1);
                    break;

                default:
                    break;
            }
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
                Weapon.skin = `Game/UI/Game/Hero/Hero_01_weapon_${_Data._arr[index]['color']}.png`;
                Weapon.addComponent(_Weapon);
            }

            EventAdmin._notify(_Event._Game_WeaponSate, [_WeaponSateType.rotate]);
        }

        lwgOnStart(): void {
            TimerAdmin._frameLoop(1, this, () => {
                this.ImgVar('LandContent').rotation += 0.1;
            })
            for (let index = 0; index < this.ImgVar('EnemyParent').numChildren; index++) {
                const element = this.ImgVar('EnemyParent').getChildAt(index) as Laya.Image;
                let rotate = Tools.randomOneHalf() == 1 ? -0.5 : 0.5;
                TimerAdmin._frameLoop(1, this, () => {
                    let point = Tools.Point.getRoundPos(element.rotation += rotate, this.ImgVar('MobileFrame').width / 2, new Laya.Point(this.ImgVar('LandContent').width / 2, this.ImgVar('LandContent').height / 2))
                    element.x = point.x;
                    element.y = point.y;
                })
            }
        }

        aimControl = {
            firstP: null as number,
            firstP: null as number,
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
        }

    }
}
export default _Game.Game;



