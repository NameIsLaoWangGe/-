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
        launchRange: number;
        fGP: Laya.Point;
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
            var move = (_launchRange: number) => {
                if (!this.fGP) {
                    this.fGP = new Laya.Point(this._Owner.x, this._Owner.y);
                }
                let range = this.fGP.distance(this._Owner.x, this._Owner.y);
                if (range < _launchRange) {
                    let p = Tools._Point.angleAndLenByPoint(this._Owner.rotation - 90, this.baseSpeed);
                    this._Owner.x += p.x;
                    this._Owner.y += p.y;
                } else {
                    drop();
                }
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
            this._evReg(_Event.WeaponSate, (type: string, launchRange: number) => {
                if (type === _WeaponSateType.free) {
                    return;
                } else {
                    if (type === _WeaponSateType.launch) {
                        this.state === _WeaponSateType.free;
                        TimerAdmin._frameLoop(1, this, () => {
                            move(launchRange);
                        })
                    }
                }
            })
        }
    }
    export class Game extends Admin._SceneBase {

        lwgOnAwake(): void {
            this.Weapon.init();
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
                        this.Weapon.present = createWeapon(element.name.substr(7)) as Laya.Image;
                        this.Weapon.present.pos(e.stageX, e.stageY - 50);
                    },
                    (e: Laya.Event) => {
                        // if (this[`${element.name}click`]) {
                        //     this.luanch = false;
                        //     this.Weapon.present = createWeapon(element.name.substr(7)) as Laya.Image;
                        //     this[`${element.name}click`] = false;
                        // }
                    },
                    () => {
                        this.Weapon.weaponRemove()
                    },
                    () => {
                    }, 'null');
            }
        }

        Weapon = {
            present: null as Laya.Image,
            state: null as string,
            launchRange: 0,
            heroFP: null as Laya.Point,
            lBowstringW: null as number,
            rBowstringW: null as number,
            time: 0,//没有拉动时不会改变方向
            init: () => {
                this.Weapon.lBowstringW = this._ImgVar('LBowstring').width;
                this.Weapon.rBowstringW = this._ImgVar('RBowstring').width;
                this.Weapon.heroFP = new Laya.Point(this._ImgVar('Hero').x, this._ImgVar('Hero').y);
            },
            weaponRemove: () => {
                if (this.Weapon.present) {
                    this.Weapon.present.removeSelf();
                    this.Weapon.present = null;
                    this.Weapon.state = null;
                }
            },
            /**获取弓箭的世界坐标*/
            getAimGP: (): Laya.Point => {
                return this._ImgVar('Aim').localToGlobal(new Laya.Point(this._ImgVar('Fulcrum').x, this._ImgVar('Fulcrum').y));
            },
            /**检测是否在弓箭上*/
            checkinAim: (): boolean => {
                if (!this.Weapon.present) {
                    return;
                }
                const gPoint = this.Weapon.getAimGP();
                const dis = gPoint.distance(this.Weapon.present.x, this.Weapon.present.y);
                if (dis < 150) {
                    this.Weapon.state = 'aim';
                    Tools._Node.changePivot(this.Weapon.present, this.Weapon.present.width / 2, this.Weapon.present.height / 2);
                    this.Weapon.present.pos(gPoint.x, gPoint.y);
                    this._ImgVar('Bow').skin = `Game/UI/Game/Hero/Hero_01_bow_${this.Weapon.present.name}.png`;
                    this.Weapon.present.rotation = this._ImgVar('Aim').rotation;
                    return true;
                } else {
                    this._ImgVar('Bow').skin = `Game/UI/Game/Hero/Hero_01_bow_normalc.png`;
                    this.Weapon.present.rotation = 0;
                    return false;
                }
            },
            /**调整方向*/
            direction: (e: Laya.Event): number => {
                if (!this.Weapon.present) {
                    return;
                }
                let angle = 0;
                angle = Tools._Point.angleByPoint(e.stageX - this.Weapon.present.x, e.stageY - this.Weapon.present.y);
                // if (angle > 75) {
                //     angle = 75;
                // }
                // if (angle < - 75) {
                //     angle = -75;
                // }
                if (e.stageY < this.Weapon.present.y + 20) {
                    angle = 0;
                }
                this.Weapon.present.rotation = angle;
                const Tail = this.Weapon.present.getChildByName('Tail') as Laya.Image;
                const Pic = this.Weapon.present.getChildByName('Pic') as Laya.Image;
                // 弓箭的方位
                this._ImgVar('Aim').rotation = angle;
                const gPoint = this.Weapon.getAimGP();
                this.Weapon.present.pos(gPoint.x, gPoint.y);
                // 拉力设置表现
                // 最小值
                const minDes = this.Weapon.present.height - 20;
                const weaponGP = new Laya.Point(this.Weapon.present.x, this.Weapon.present.y);
                const pullDes = weaponGP.distance(e.stageX, e.stageY);
                if (pullDes < minDes) {
                    Tail.y = minDes;
                } else {
                    Tail.y = pullDes;
                    Pic.y = pullDes - minDes;//这个恰好是拉了多少距离
                }
                // 拉力进度条代表发射力度
                this._ImgVar('DynamicsBar').y = this._ImgVar('DynamicsBar').height - Pic.y * 2;
                if (this._ImgVar('DynamicsBar').y < 0) {
                    this._ImgVar('DynamicsBar').y = 0;
                }
                this.Weapon.launchRange = Laya.stage.height * (1 - this._ImgVar('DynamicsBar').y / this._ImgVar('DynamicsBar').height);
                // 英雄也会移动
                this._ImgVar('Hero').y = this.Weapon.heroFP.y + Pic.y;
                // 弓弦长度和连接
                const tailGP = this.Weapon.present.localToGlobal(new Laya.Point(Tail.x, Tail.y));
                const lBowstringGP = this._ImgVar('Aim').localToGlobal(new Laya.Point(this._ImgVar('LBowstring').x, this._ImgVar('LBowstring').y));
                const lBowstringAngle = Tools._Point.angleByPoint(lBowstringGP.x - tailGP.x, lBowstringGP.y - tailGP.y);
                this._ImgVar('LBowstring').rotation = lBowstringAngle - 90 - angle;
                this._ImgVar('LBowstring').width = tailGP.distance(lBowstringGP.x, lBowstringGP.y);

                const rBowstringGP = this._ImgVar('Aim').localToGlobal(new Laya.Point(this._ImgVar('RBowstring').x, this._ImgVar('RBowstring').y));
                const rBowstringAngle = Tools._Point.angleByPoint(rBowstringGP.x - tailGP.x, rBowstringGP.y - tailGP.y);
                this._ImgVar('RBowstring').rotation = rBowstringAngle + 90 - angle;
                this._ImgVar('RBowstring').width = tailGP.distance(rBowstringGP.x, rBowstringGP.y);

                return angle;
            },
            recover: () => {
                this._ImgVar('LBowstring').width = this.Weapon.lBowstringW;
                this._ImgVar('RBowstring').width = this.Weapon.rBowstringW;
                this._ImgVar('RBowstring').rotation = this._ImgVar('LBowstring').rotation = 0;
                this._ImgVar('Aim').rotation = 0;
                this._ImgVar('Hero').y = this.Weapon.heroFP.y;
                this.Weapon.time = 0;
            },
            luanch: () => {
                if (this.Weapon.present) {
                    this._evNotify(_Event.WeaponSate, [_WeaponSateType.launch, this.Weapon.launchRange]);
                }
                this.Weapon.recover();
                this.Weapon.present = null;
                this.Weapon.state = null;
            }
        }

        heroContentFP: Laya.Point = null;
        lwgOnStageDown(e: Laya.Event): void {
            this.heroContentFP = new Laya.Point(e.stageX, e.stageY);
        }
        lwgOnStageMove(e: Laya.Event) {
            if (this.Weapon.present) {
                if (this.Weapon.state) {
                    this.Weapon.direction(e)
                } else {
                    this.Weapon.present.pos(e.stageX, e.stageY - 150);
                    this.Weapon.checkinAim();
                }
            } else {
                if (this.heroContentFP) {
                    let diffX = e.stageX - this.heroContentFP.x;
                    let diffY = e.stageY - this.heroContentFP.y;
                    this._ImgVar('HeroContent').x += diffX;
                    this._ImgVar('HeroContent').y += diffY;
                    this.heroContentFP = new Laya.Point(e.stageX, e.stageY);
                }
            }
        }
        lwgOnStageUp(): void {
            this.Weapon.luanch();
            this.heroContentFP = null;
        }
    }
}
export default _Game.Game;



