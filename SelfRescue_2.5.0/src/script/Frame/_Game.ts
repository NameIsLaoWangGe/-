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
            }, {
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
        mouseDownY: 0 as number,
        get rotateSpeed(): number {
            return this['_rotateSpeed'] ? this['_rotateSpeed'] : 0;
        },
        set rotateSpeed(speed: number) {
            if (!_fireControl.rotateSwitch) {
                this['_rotateSpeed'] = speed;
                EventAdmin._notify(_Event._Game_move, _fireControl.rotateSpeed);
            }
        },
        get launchSpeed(): number {
            return 10 + _fireControl.launchAccelerated;
        },
        launchAccelerated: 0.1,
    }
    export enum _Event {
        _Game_Rotate = '_Game_Rotate',
        _Game_move = '_Game_move',
        _Game_launch = '_Game_launch',
    }
    export function _init(): void {
    }
    export class _Enemy extends Admin._Person {

    }
    export class _Weapon extends Admin._Person {
        weaponState = {
            type: {
                rotate: 'rotate',
                mouseMove: 'mouseMove',
                launch: 'launch',
            },
            get value(): string {
                return this['Statevalue'];
            },
            set value(val: string) {
                this['Statevalue'] = val;
            }
        }
        parent: Laya.Image;
        lwgOnAwake(): void {
            this.parent = this.Owner.parent as Laya.Image;
        }
        lwgOnStart(): void {
            var move = (rSpeed: number, radius: number) => {
                let point = Tools.point_GetRoundPos(this.Owner.rotation += rSpeed, radius, new Laya.Point(this.parent.width / 2, this.parent.height / 2))
                this.Owner.x = point.x;
                this.Owner.y = point.y;
            }
            let _accelerated = 0;
            TimerAdmin._frameLoop(1, this, () => {
                if (this.Owner.parent) {
                    switch (this.weaponState.value) {
                        case this.weaponState.type.rotate:
                            if (_fireControl.rotateSwitch) {
                                let speed: number = _fireControl.rotateSpeed > 0 ? 0.1 : -0.1;
                                move(speed, this.parent.width / 2 - 50);
                            }
                            _accelerated = 0;
                            break;
                        case this.weaponState.type.mouseMove:
                            _accelerated = 0;
                            move(_fireControl.rotateSpeed, this.parent.width / 2 - 50);
                            break;
                        case this.weaponState.type.launch:
                            _accelerated += _fireControl.launchSpeed;
                            let radius = _fireControl.launchAccelerated + _accelerated;
                            move(_fireControl.rotateSpeed, radius);
                            break;
                        default:
                            break;
                    }
                }
            })
        }
        lwgEventRegister(): void {
            EventAdmin._register(_Event._Game_Rotate, this, () => {
            })
            EventAdmin._register(_Event._Game_move, this, () => {
            })
            EventAdmin._register(_Event._Game_launch, this, () => {
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
                let point = Tools.point_GetRoundPos(index / _Data._arr.length * 360, this.ImgVar('WeaponParent').width / 2 - 50, new Laya.Point(this.ImgVar('WeaponParent').width / 2, this.ImgVar('WeaponParent').height / 2))
                Weapon.x = point.x;
                Weapon.y = point.y;
                Weapon.rotation = index / _Data._arr.length * 360;
                Weapon.skin = `Game/UI/Game/Hero/Hero_01_weapon_${_Data._arr[index]['color']}.png`;
                Weapon.addComponent(_Weapon);
            }
        }

        lwgOnStart(): void {
            TimerAdmin._frameLoop(1, this, () => {
                this.ImgVar('LandContent').rotation += 0.1;
            })
            for (let index = 0; index < this.ImgVar('EnemyParent').numChildren; index++) {
                const element = this.ImgVar('EnemyParent').getChildAt(index) as Laya.Image;
                let rotate = Tools.randomOneHalf() == 1 ? -0.5 : 0.5;
                TimerAdmin._frameLoop(1, this, () => {
                    let point = Tools.point_GetRoundPos(element.rotation += rotate, this.ImgVar('MobileFrame').width / 2, new Laya.Point(this.ImgVar('LandContent').width / 2, this.ImgVar('LandContent').height / 2))
                    element.x = point.x;
                    element.y = point.y;
                })
            }
        }

        onStageMouseDown(e: Laya.Event): void {
            _fireControl.rotateSwitch = false;
            _fireControl.mouseDownY = e.stageY;
        }
        onStageMouseMove(e: Laya.Event): void {
            if (_fireControl.mouseDownY - e.stageY > 0) {
                _fireControl.rotateSpeed = -5;
            } else {
                _fireControl.rotateSpeed = 5;
            }
            _fireControl.mouseDownY = e.stageY;
        }
        onStageMouseUp(e: Laya.Event): void {
            _fireControl.rotateSwitch = true;
            _fireControl.mouseDownY = 0;
        }
        lwgBtnClick(): void {
        }
    }
}
export default _Game.Game;



