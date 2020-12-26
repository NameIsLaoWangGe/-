import { Admin, Animation2D, Click, Effects, EventAdmin, TimerAdmin, Tools, _SceneName } from "./Lwg";
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
            let GPoint = this._SceneImg('Aim').localToGlobal(new Laya.Point(this._SceneImg('Hero').x, this._SceneImg('Hero').y));
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
                    this._SceneImg('EBparrent').addChild(bullet);
                    bullet.pos(GPoint.x, GPoint.y);
                }
            })
            let rotate = Tools._Number.randomOneHalf() == 1 ? -0.5 : 0.5;
            TimerAdmin._frameLoop(1, this, () => {
                let point = Tools._Point.getRoundPos(this._Owner.rotation += rotate, this._SceneImg('MobileFrame').width / 2 + this._Owner.height / 2, new Laya.Point(this._SceneImg('LandContent').width / 2, this._SceneImg('LandContent').height / 2))
                this._Owner.x = point.x;
                this._Owner.y = point.y;

                // let Shell = this._Owner.getChildByName('Shell') as Laya.Image;
                // if (Shell) {
                //     const gPShell = this._Owner.localToGlobal(new Laya.Point(Shell.x, Shell.y));
                //     console.log(Tools._Point.angleByPoint(this._SceneImg('LandContent').x - this._gPoint.x, this._SceneImg('LandContent').y - this._gPoint.y) + 90);
                //     // if (gPShell.distance(this._gPoint.x, this._gPoint.y) < 30 || gPShell.y > gPEnemy.y) {
                //     //     drop();
                //     // } else {
                //     //     skill(Enemy);
                //     // }
                // } else {
                //     // skill(Enemy);
                // }
            })
        }
    }
    export class _Weapon extends Admin._ObjectBase {
        dynamics: number = 0;
        launchAcc: number = 0;
        dropAcc: number = 0;
        fGP: Laya.Point;
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
            const acc = (1 - this.dynamics) * 2;
            this.launchAcc -= acc;
            return 80 + this.launchAcc;
        }
        getDropSpeed(): number {
            return this.dropAcc += 0.5;
        }
        lwgOnAwake(): void {
        }
        lwgEvent(): void {
            var move = () => {
                if (!this.fGP) {
                    this.fGP = new Laya.Point(this._Owner.x, this._Owner.y);
                }
                if (this.getSpeed() > 0) {
                    let p = Tools._Point.angleAndLenByPoint(this._Owner.rotation - 90, this.getSpeed()); this._Owner.x += p.x;
                    this._Owner.y += p.y;
                } else {
                    this._Owner.y += this.getDropSpeed();
                }
                !Tools._Node.leaveStage(this._Owner, () => {
                    this._Owner.removeSelf();
                }) && checkEnemy();
            }
            var drop = () => {
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
            var skill = (Enemy: Laya.Image) => {
                this._evNotify(_Event.skillEnemy, [1]);
                for (let index = 0; index < 20; index++) {
                    Effects._Particle._spray(Laya.stage, this._gPoint, [0, 0], [10, 35], null, null, null, null, null, null, [30, 100], null, [5, 20])
                }
                Enemy.removeSelf();
                this._Owner.removeSelf();
            }
            var checkEnemy = () => {
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
                            // 通过倾斜角度计算是否可以打到，有头盔的在头向下的时候打不到
                            let Shell = Enemy.getChildByName('Shell') as Laya.Image;
                            if (Shell) {
                                const landContentGP = this._SceneImg('Content').localToGlobal(new Laya.Point(this._SceneImg('LandContent').x, this._SceneImg('LandContent').y));
                                let angle = Tools._Point.angleByPoint(landContentGP.x - this._gPoint.x, landContentGP.y - this._gPoint.y) + 90;
                                if (210 < angle && angle < 330) {
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
                    mask.pos(0, 80);
                    mask.loadImage('Lwg/UI/ui_l_orthogon_white.png');
                    this._Owner.mask = mask;
                }
            }
            this._evReg(_Event.launch, (dynamics: number) => {
                if (this.state !== this.stateType.free) {
                    TimerAdmin._frameLoop(1, this, () => {
                        this.dynamics = dynamics;
                        move();
                    })
                }
            })
        }
    }
    export class Game extends Admin._SceneBase {

        lwgOnAwake(): void {
            // this._Owner.width = Laya.stage.width + 400;
            // this._Owner.height = Laya.stage.height + 400;
            this.Hero.init();
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
            let QuiverArr = [this._ImgVar('Quiver_blue'), this._ImgVar('Quiver_yellow'), this._ImgVar('Quiver_red')]
            for (let index = 0; index < QuiverArr.length; index++) {
                const element = QuiverArr[index] as Laya.Image;
                this._btnFour(element,
                    (e: Laya.Event) => {
                        e.stopPropagation();
                        this.Weapon.create(element.name.substr(7), e.stageX, e.stageY);
                    },
                    null,
                    () => {
                        this.Weapon.remove();
                    },
                    () => {
                    }, 'null');
            }
        }

        Weapon = {
            state: 'checkinAim',
            stateType: {
                checkinAim: 'checkinAim',
                direction: 'direction',
            },
            ins: null as Laya.Image,
            Tail: null as Laya.Image,
            Pic: null as Laya.Image,
            /**当前拉力*/
            dynamics: 0,
            /**最小拉伸位置，根据弓箭的长度判断*/
            minPullDes: 0,
            /**当前拉伸位置*/
            pullDes: 0,
            /**最大拉伸位置*/
            maxPullDes: null as number,
            /**英雄最初的位置*/
            heroFP: null as Laya.Point,
            /**左弓弦的最初长度，每个弓箭可能不一样*/
            lBowstringW: null as number,
            /**右弓弦的最初长度，每个弓箭可能不一样*/
            rBowstringW: null as number,
            /**取出弓箭时，在手上的偏移量*/
            diffY: -150,
            create: (color: string, x: number, y: number) => {
                this.Weapon.ins = Tools._Node.createPrefab(_Res._list.prefab2D.Weapon.prefab) as Laya.Image;
                this._ImgVar('WeaponParent').addChild(this.Weapon.ins);
                this.Weapon.ins.name = color;
                this.Weapon.ins.addComponent(_Weapon);
                this.Weapon.ins.pos(x, y + this.Weapon.diffY);
                this.Weapon.Pic = this.Weapon.ins.getChildByName('Pic') as Laya.Image;
                this.Weapon.Pic.skin = `Game/UI/Game/Hero/Hero_01_weapon_${color}.png`;
                this.Weapon.lBowstringW = this._ImgVar('LBowstring').width;
                this.Weapon.rBowstringW = this._ImgVar('RBowstring').width;
                this.Weapon.heroFP = new Laya.Point(this._ImgVar('Hero').x, this._ImgVar('Hero').y);
                this.Weapon.minPullDes = this.Weapon.ins.height - 20;
                this.Weapon.maxPullDes = this.Weapon.minPullDes + 40;
                this.Weapon.pullDes = 0;
                this.Weapon.Tail = this.Weapon.ins.getChildByName('Tail') as Laya.Image;
                this._ImgVar('Quiver').visible = false;
            },
            remove: () => {
                if (this.Weapon.ins) {
                    this.Weapon.ins.removeSelf();
                    this.Weapon.ins = null;
                    this.Weapon.state = this.Weapon.stateType.checkinAim;
                }
            },
            /**获取弓的世界坐标*/
            getAimGP: (): Laya.Point => {
                return this._ImgVar('Aim').localToGlobal(new Laya.Point(this._ImgVar('Fulcrum').x, this._ImgVar('Fulcrum').y));
            },
            getTailGP: (): Laya.Point => {
                return this.Weapon.ins.localToGlobal(new Laya.Point(this.Weapon.Tail.x, this.Weapon.Tail.y))
            },
            getWeaponGP: (): Laya.Point => {
                return new Laya.Point(this.Weapon.ins.x, this.Weapon.ins.y);
            },
            /**检测是否在弓箭上*/
            checkinAim: (e: Laya.Event): void => {
                const dis = this.Weapon.getAimGP().distance(e.stageX, e.stageY);
                if (dis < 150 && e.stageY >= this.Weapon.getAimGP().y) {
                    this.Weapon.state = this.Weapon.stateType.direction;
                    this.Weapon.ins.pivotX = this.Weapon.ins.width / 2;
                    this.Weapon.ins.pivotY = this.Weapon.ins.height / 2;
                    this.Weapon.ins.pos(this.Weapon.getAimGP().x, this.Weapon.getAimGP().y);
                    this._ImgVar('Bow').skin = `Game/UI/Game/Hero/Hero_01_bow_${this.Weapon.ins.name}.png`;
                    this.Weapon.dirBy = this.Weapon.dirByType.weapon;
                    this.Weapon.direction(e);
                } else {
                    this.Weapon.restore();
                    this.Weapon.ins.rotation = 0;
                    this.Weapon.ins.pos(e.stageX, e.stageY + this.Weapon.diffY);
                    this._ImgVar('Bow').skin = `Game/UI/Game/Hero/Hero_01_bow_normalc.png`;
                }
            },
            getAimStageDis: (e: Laya.Event): number => {
                return this.Weapon.getAimGP().distance(e.stageX, e.stageY);
            },
            dirBy: 'weapon',//根据触摸点或者是弓箭进行转向
            //防止刚开始进入的时候就旋转角度，导致角度过大
            dirByType: {
                weapon: 'weapon',
                stage: 'stage',
            },
            /**调整方向*/
            direction: (e: Laya.Event): number => {
                if (e.stageY < this.Weapon.getAimGP().y) {
                    this.Weapon.state = this.Weapon.stateType.checkinAim;
                    this.Weapon.checkinAim(e);
                } else {
                    // 弓箭的方位
                    let angle = 0;
                    if (this.Weapon.dirBy === this.Weapon.dirByType.weapon) {
                        if (e.stageY - this.Weapon.getAimGP().y > 80) {//缓冲防止至二级转向
                            this.Weapon.dirBy = this.Weapon.dirByType.stage;//根据舞台进行转向
                        }
                        angle = Tools._Point.angleByPoint(this.Weapon.getAimGP().x - this.Weapon.ins.x, this.Weapon.getAimGP().y - this.Weapon.ins.y);
                    } else if (this.Weapon.dirBy === this.Weapon.dirByType.stage) {
                        angle = Tools._Point.angleByPoint(e.stageX - this.Weapon.ins.x, e.stageY - this.Weapon.ins.y);
                    }
                    this.Weapon.ins.rotation = this._ImgVar('Aim').rotation = angle;
                    this.Weapon.ins.pos(this.Weapon.getAimGP().x, this.Weapon.getAimGP().y);
                    // 拉力表现
                    this.Weapon.pullDes = this.Weapon.getWeaponGP().distance(e.stageX, e.stageY);
                    if (this.Weapon.pullDes >= this.Weapon.minPullDes && this.Weapon.pullDes <= this.Weapon.maxPullDes) {
                        this.Weapon.Tail.y = this.Weapon.pullDes;
                        this.Weapon.Pic.y = this.Weapon.pullDes - this.Weapon.minPullDes;//这个恰好是拉了多少距离
                        // 拉力进度条代表发射力度
                        const ratio = this.Weapon.Pic.y / (this.Weapon.maxPullDes - this.Weapon.minPullDes);
                        this._ImgVar('DynamicsBar').mask.y = this._ImgVar('DynamicsBar').height * (1 - ratio);
                        this.Weapon.dynamics = ratio;
                        // 英雄也会移动
                        this._ImgVar('Hero').y = this.Weapon.heroFP.y + this.Weapon.Pic.y;
                    }
                    this.Weapon.bowstring();
                    return angle;
                }
            },
            /**弓弦拉伸*/
            bowstring: () => {
                const angle = Tools._Point.angleByPoint(this.Weapon.getTailGP().x - this.Weapon.ins.x, this.Weapon.getTailGP().y - this.Weapon.ins.y);
                const lBowstringGP = this._ImgVar('Aim').localToGlobal(new Laya.Point(this._ImgVar('LBowstring').x, this._ImgVar('LBowstring').y));
                const lBowstringAngle = Tools._Point.angleByPoint(lBowstringGP.x - this.Weapon.getTailGP().x, lBowstringGP.y - this.Weapon.getTailGP().y);
                this._ImgVar('LBowstring').rotation = lBowstringAngle - 90 - angle;
                this._ImgVar('LBowstring').width = this.Weapon.getTailGP().distance(lBowstringGP.x, lBowstringGP.y);

                const rBowstringGP = this._ImgVar('Aim').localToGlobal(new Laya.Point(this._ImgVar('RBowstring').x, this._ImgVar('RBowstring').y));
                const rBowstringAngle = Tools._Point.angleByPoint(rBowstringGP.x - this.Weapon.getTailGP().x, rBowstringGP.y - this.Weapon.getTailGP().y);
                this._ImgVar('RBowstring').rotation = rBowstringAngle + 90 - angle;
                this._ImgVar('RBowstring').width = this.Weapon.getTailGP().distance(rBowstringGP.x, rBowstringGP.y);
            },
            // 还原弓箭样式
            restore: () => {
                this._ImgVar('LBowstring').width = this.Weapon.lBowstringW;
                this._ImgVar('RBowstring').width = this.Weapon.rBowstringW;
                this._ImgVar('RBowstring').rotation = this._ImgVar('LBowstring').rotation = 0;
                this._ImgVar('Aim').rotation = 0;
                this._ImgVar('Hero').y = this.Weapon.heroFP.y;
            },
            checkLuanch: () => {
                if (this.Weapon.ins) {
                    if (this.Weapon.state === this.Weapon.stateType.direction) {
                        this._evNotify(_Event.launch, [this.Weapon.dynamics]);
                        Tools._Node.changePivot(this.Weapon.ins, this.Weapon.ins.pivotX + this.Weapon.Pic.x, this.Weapon.ins.pivotY);
                    } else {
                        this.Weapon.ins.removeSelf();
                    }
                    this._ImgVar('Quiver').visible = true;
                    this.Weapon.restore();
                    this.Weapon.ins = null;
                    this.Weapon.state = this.Weapon.stateType.checkinAim;
                }
            },
            move: (e: Laya.Event) => {
                this.Weapon[this.Weapon.state](e);
            }
        }

        Hero = {
            mouseP: null as Laya.Point,
            ContentFP: null as Laya.Point,
            expand: 250,
            onoff: false,
            init: () => {
                this.Hero.ContentFP = new Laya.Point(this._ImgVar('Content').x, this._ImgVar('Content').y);
            },
            move: () => {

            }
        }

        lwgOnStageDown(e: Laya.Event): void {
            this.Hero.mouseP = new Laya.Point(e.stageX, e.stageY);
        }
        lwgOnStageMove(e: Laya.Event) {
            if (this.Weapon.ins) {
                this.Weapon.move(e);
            } else {
                if (this.Hero.mouseP) {
                    let diffX = e.stageX - this.Hero.mouseP.x;
                    let diffY = e.stageY - this.Hero.mouseP.y;
                    this._ImgVar('HeroContent').x += diffX;
                    if (this.Hero.onoff) {
                        if (this._ImgVar('Content').y > this.Hero.ContentFP.y) {
                            this.Hero.onoff = false;
                        } else {
                            this._ImgVar('Content').y -= diffY;
                        }
                    } else {
                        this._ImgVar('HeroContent').y += diffY;
                    }
                    this.Hero.mouseP = new Laya.Point(e.stageX, e.stageY);
                    if (this._ImgVar('HeroContent').x > Laya.stage.width) {
                        this._ImgVar('HeroContent').x = Laya.stage.width;
                        this._ImgVar('Content').x -= diffX;
                        if (this._ImgVar('Content').x < this.Hero.ContentFP.x - this.Hero.expand) {
                            this._ImgVar('Content').x = this.Hero.ContentFP.x - this.Hero.expand;
                        }
                    }
                    if (this._ImgVar('HeroContent').x < 0) {
                        this._ImgVar('HeroContent').x = 0;
                        this._ImgVar('Content').x -= diffX;
                    }
                    if (this._ImgVar('HeroContent').y <= 0) {
                        this._ImgVar('HeroContent').y = 0;
                    }
                    if (this._ImgVar('HeroContent').y > Laya.stage.height - 200) {
                        this._ImgVar('HeroContent').y = Laya.stage.height - 200;
                        this._ImgVar('Content').y -= diffY;
                        this.Hero.onoff = true;
                    }
                    if (this._ImgVar('Content').x > this.Hero.ContentFP.x + this.Hero.expand) {
                        this._ImgVar('Content').x = this.Hero.ContentFP.x + this.Hero.expand;
                    }
                    if (this._ImgVar('Content').y < this.Hero.ContentFP.y - this.Hero.expand) {
                        this._ImgVar('Content').y = this.Hero.ContentFP.y - this.Hero.expand;
                    }
                }
            }
        }
        lwgOnStageUp(): void {
            this.Weapon.checkLuanch();
            this.Hero.mouseP = null;
        }
    }
}
export default _Game.Game;



