import { Admin, DataAdmin, Effects2D, TimerAdmin, Tools } from "./Lwg";
import { _LwgEvent } from "./LwgEvent";
import { _Res } from "./_PreLoad";
export module _Boss {
    export class _Enemy extends Admin._ObjectBase {
        blood: number;
        bloodPresnt: number;
        bloodPic: Laya.Image;
        bloodWidth: number;
        Shell: Laya.Image;
        Pic: Laya.Image;
        speed: number;
        lwgOnAwake(): void {
            this.generalProInit();
        }
        generalProInit(): void {
            const shell = this._Owner['_EnemyData']['shell'];
            this.Shell = this._Owner.getChildByName('Shell') as Laya.Image;
            !shell && this.Shell.removeSelf();

            this.Pic = this._Owner.getChildByName('Pic') as Laya.Image;
            this.Pic.skin = `Game/UI/Game/Enemy/enemy_01_${this._Owner['_EnemyData']['color']}.png`;

            this.blood = this._Owner['_EnemyData']['blood'];
            this.bloodPresnt = this.blood;
            this.bloodPic = this._Owner.getChildByName('Blood').getChildByName('Pic') as Laya.Image;
            this.bloodWidth = this.bloodPic.width;

            const angle = this._Owner['_EnemyData']['angle'];
            this._Owner.rotation = angle;

            this.speed = this._Owner['_EnemyData']['speed'];
        }
        lwgOnStart(): void {
            this.attack();
            this.move();
        }
        attack(): void {
            // TimerAdmin._frameRandomLoop(100, 1000, this, () => {
            //     let bullet = Tools._Node.createPrefab(_Res._list.prefab2D.EnemyBullet.prefab)
            //     bullet.addComponent(_EnemyBullet);
            //     this._SceneImg('EBparrent').addChild(bullet);
            //     bullet.pos(this._gPoint.x, this._gPoint.y);
            // })
        }
        move(): void {
            TimerAdmin._frameLoop(1, this, () => {
                let point = Tools._Point.getRoundPos(this._Owner.rotation += this.speed, this._SceneImg('MobileFrame').width / 2 + this._Owner.height / 2, new Laya.Point(this._SceneImg('Land').width / 2, this._SceneImg('Land').height / 2))
                this._Owner.x = point.x;
                this._Owner.y = point.y;
            })
        }
        lwgEvent(): void {
            this._evReg(_LwgEvent.Game.enemyBlood, (Enemy: Laya.Image, num: number) => {
                if (Enemy === this._Owner) {
                    this.bloodPresnt -= num;
                    this.bloodPic.width = this.bloodWidth * this.bloodPresnt / this.blood;
                    if (this.bloodPresnt <= 0) {
                        for (let index = 0; index < 20; index++) {
                            Effects2D._Particle._spray(Laya.stage, this._gPoint, [10, 30])
                        }
                        if (this._Owner.parent.numChildren == 1) {
                            this._openScene('Victory', false);
                        }
                        this._Owner.removeSelf();
                    }
                }
            })
        }
    }
    export class _EnemyBullet extends Admin._ObjectBase {
        speed = 2;
        lwgOnStart(): void {
            this.move();
            this.checkHero();
        }
        move(): void {
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
        }
        checkHero(): void {
            TimerAdmin._frameLoop(1, this, () => {
                Tools._Node.checkTwoDistance(this._Owner, this._SceneImg('Hero'), 50, () => {
                    this._Owner.removeSelf();
                    this._evNotify(_LwgEvent.Game.heroBlood, [1]);
                })
            })
        }
    }

    export class _BossData extends DataAdmin._Table {
        private static ins: _BossData;
        static _ins() {
            if (!this.ins) {
                this.ins = new _BossData();
                this.ins._arr = _Res._list.json.Boss.dataArr;
                this.ins.levelData = this.ins._getObjByName(`Boss${Admin._game.level}`);
            }
            return this.ins;
        }
        constructor() {
            super();
            this._arr = _Res._list.json.Boss.dataArr;
        }
        _otherPro = {
            blood: 'blood',
            specials: 'specials',
            speed: 'speed',
            skills: 'skills',
            bulletPower: 'bulletPower',
        }
        levelData: any;
        getLevelSkill(): string[] {
            return this.levelData['skills'];
        }
        getLevelSpeed(): number[] {
            return this.levelData['speed'];
        }
        getLevelblood(): number {
            return this.levelData['blood'];
        }

        getOtherBossSkill(): any[] {
            return
        }
        createLevelBoss(Parent: Laya.Image): Laya.Image {
            const element = Tools._Node.createPrefab(_Res._list.prefab2D.Enemy.prefab, Parent) as Laya.Image;
            const color = Tools._Array.randomGetOne(['blue', 'yellow', 'red'])
            element.name = `${color}'Boss`;
            let speed = Tools._Number.randomOneBySection(_BossData._ins().getLevelSpeed()[0], _BossData._ins().getLevelSpeed()[1]);
            speed = Tools._Number.randomOneHalf() == 0 ? -speed : speed;
            console.log(speed);

            element['_EnemyData'] = {
                blood: _BossData._ins().getLevelblood(),
                angle: Tools._Number.randomOneBySection(0, 360),
                speed: speed,
                color: color,
                sikllNameArr: _BossData._ins().getLevelSkill(),
            };
            element.addComponent(Boss);
            return element;
        }
    }

    export class Boss extends _Enemy {
        lwgOnAwake(): void {
            this.generalProInit();
        }
        attack(): void {
            const num = 20;
            // TimerAdmin._frameRandomLoop(100, 500, this, () => {
            //     for (let index = 0; index < num; index++) {
            //         const bullet = Tools._Node.createPrefab(_Res._list.prefab2D.EnemyBullet.prefab) as Laya.Image;
            //         this._SceneImg('EBparrent').addChild(bullet);
            //         bullet.pos(this._gPoint.x, this._gPoint.y);
            //         bullet.rotation = 360 / num * index;
            //         bullet.addComponent(BossBullet);
            //     }
            // })
        }
    }
    export class BossBullet extends _EnemyBullet {

        lwgOnStart(): void {
            this.move();
            this.checkHero();
        }
        move(): void {
            TimerAdmin._frameLoop(1, this, () => {
                let point = Tools._Point.getRoundPos(this._Owner.rotation, this.speed += 2, this._fPoint)
                this._Owner.x = point.x;
                this._Owner.y = point.y;
            })
        }
    }

    export class Skill {
        private static ins: Skill;
        static _ins() {
            if (!this.ins) {
                this.ins = new Skill();
            }
            return this.ins;
        }
        /**环形弹幕*/
        round(): void {
            for (let index = 0; index < 20; index++) {
                const bullet = Tools._Node.createPrefab(_Res._list.prefab2D.EnemyBullet.prefab) as Laya.Image;
                bullet
            }
        }
    }

    export class _EnemyData extends DataAdmin._Table {
        constructor(_EnemyParent: Laya.Image) {
            super();
            this.EnemyParent = _EnemyParent;
            this._arr = _Res._list.json.Enemy.dataArr;
        }
        _otherPro = {
            quantity: "quantity",
            shellNum: "shellNum",
            blood: 'blood',
            boss: 'boss',
            speed: 'speed',
        }
        EnemyParent: Laya.Image;
        createEnmey(): void {
            const obj = this._getObjByName(`level${Admin._game.level}`);
            const quantity = obj[this._otherPro.quantity];
            const shellNum = obj[this._otherPro.shellNum];
            let shellNumTime = 0;
            for (let index = 0; index < quantity; index++) {
                const element = Tools._Node.createPrefab(_Res._list.prefab2D.Enemy.prefab, this.EnemyParent) as Laya.Image;
                shellNumTime++;
                const color = Tools._Array.randomGetOne(['blue', 'yellow', 'red'])
                element.name = `${color}${index}`;
                let speed = Tools._Number.randomOneBySection(obj[this._otherPro.speed][0], obj[this._otherPro.speed][1]);
                speed = Tools._Number.randomOneHalf() == 0 ? -speed : speed;
                element['_EnemyData'] = {
                    shell: shellNumTime <= shellNum ? true : false,
                    blood: obj['blood'],
                    angle: Tools._Number.randomOneBySection(0, 360),
                    speed: speed,
                    color: color,
                };
                element.addComponent(_Enemy);
            }
        }
    }
}
