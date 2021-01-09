import { Admin, DataAdmin, Effects2D, EventAdmin, TimerAdmin, Tools } from "../Frame/Lwg";
import { _LwgEvent } from "../Frame/LwgEvent";
import _EnemyBullet from "./_EnemyBullet";
import { _Res } from "../Frame/_PreLoad";
import { BossBullet } from "./_BossBullet";
import _ObjGeneral from "./_ObjGeneral";
export class _EnemyData extends DataAdmin._Table {
    constructor(_EnemyParent: Laya.Image) {
        super();
        this.EnemyParent = _EnemyParent;
        this._arr = _Res._list.json.Enemy.dataArr;
        this.levelData = this._getObjByName(`level${Admin._game.level}`);
        this.quantity = this.levelData['quantity'];
        this.presentQuantity = 0;
        EventAdmin._register('presentQuantity', this, () => {
            this.presentQuantity--;
        })
    }
    _otherPro = {
        quantity: "quantity",
        shellNum: "shellNum",
        blood: 'blood',
        boss: 'boss',
        speed: 'speed',
    }
    EnemyParent: Laya.Image;
    levelData: any;
    /**剩余可创建怪物数量，初始化时也是本关敌人总数*/
    quantity: number;
    /**当前有头盔的怪物数量*/
    shellNum: number;
    /**当前剩余怪物总数*/
    public get presentQuantity(): number {
        return this['_presentQuantity'];
    };
    public set presentQuantity(val: number) {
        this['_presentQuantity'] = val;
        if (val < 10) {
            this.createEnmey();
        }
        if (val === 0 && this.quantity === 0) {
            EventAdmin._notify(_LwgEvent.Game.creatBoss);
        }
    };

    createEnmey(): void {
        this.quantity--;
        if (this.quantity < 0) {
            this.quantity = 0;
            return;
        }
        this.presentQuantity++;
        // const quantity = obj[this._otherPro.quantity];
        const shellNum = this.levelData[this._otherPro.shellNum];
        let shellNumTime = 0;
        const element = Tools._Node.createPrefab(_Res._list.prefab2D.Enemy.prefab, this.EnemyParent) as Laya.Image;
        shellNumTime++;
        const color = Tools._Array.randomGetOne(['blue', 'yellow', 'red'])
        element.name = `${color}${color}`;
        let speed = Tools._Number.randomOneBySection(this.levelData[this._otherPro.speed][0], this.levelData[this._otherPro.speed][1]);
        speed = Tools._Number.randomOneHalf() == 0 ? -speed : speed;
        element['_EnemyData'] = {
            shell: shellNumTime <= shellNum ? true : false,
            blood: this.levelData['blood'],
            angle: Tools._Number.randomOneBySection(0, 360),
            speed: speed,
            color: color,
        };
        element.addComponent(_Enemy);
    }
}

export default class _Enemy extends _ObjGeneral {
    Pic: Laya.Image;
    Shell: Laya.Image;
    speed: number;
    groundRadius: number;
    private ranAttackNum: number;
    lwgOnAwake(): void {
        this.generalProInit();
        this.bloodInit(this._Owner['_EnemyData']['blood']);
        this.ranAttackNum = Tools._Number.randomOneBySection(1, 2, true);
    }
    generalProInit(): void {
        this._Owner.pos(this._SceneImg('Land').width / 2, this._SceneImg('Land').height / 2);

        const shell = this._Owner['_EnemyData']['shell'];
        this.Shell = this._Owner.getChildByName('Shell') as Laya.Image;
        // !shell && this.Shell.removeSelf();
        this.Shell.removeSelf();
        this.Pic = this._Owner.getChildByName('Pic') as Laya.Image;
        if (this._Owner['_EnemyData']['color']) {
            this.Pic.skin = `Game/UI/Game/Enemy/enemy_01_${this._Owner['_EnemyData']['color']}.png`;
        }
        const angle = this._Owner['_EnemyData']['angle'];
        this._Owner.rotation = angle;

        this.speed = this._Owner['_EnemyData']['speed'];
        this.groundRadius = 200;
    }
    lwgOnStart(): void {
        this.attack();
        this.appear(() => {
            this.move();
        });
    }
    appear(func: Function): void {
        let radius = 0;
        const radiusSpeed = 2;
        const time = 220 / radiusSpeed;
        TimerAdmin._frameNumLoop(1, time, this, () => {
            radius += radiusSpeed;
            let point = Tools._Point.getRoundPos(this._Owner.rotation, radius, new Laya.Point(this._SceneImg('Land').width / 2, this._SceneImg('Land').height / 2))
            this._Owner.x = point.x;
            this._Owner.y = point.y;
        }, () => {
            func();
        })
    }
    attack(): void {
        this[`attackType${this.ranAttackNum}`]();
    }
    move(): void {
        TimerAdmin._frameLoop(1, this, () => {
            let point = Tools._Point.getRoundPos(this._Owner.rotation += this.speed, 220, new Laya.Point(this._SceneImg('Land').width / 2, this._SceneImg('Land').height / 2))
            this._Owner.x = point.x;
            this._Owner.y = point.y;
        })
    }
    lwgEvent(): void {
        this._evReg(_LwgEvent.Game.enemyBlood, (Enemy: Laya.Image, num: number) => {
            this.subBlood(Enemy, num, null, () => {
                for (let index = 0; index < 20; index++) {
                    Effects2D._Particle._spray(Laya.stage, this._gPoint, [10, 30])
                }
                this._evNotify('presentQuantity');
                // 最后一个为boss
                if (this._Owner.name === 'Boss') {
                    Admin._openScene('Victory');
                }
            })
        })
    }
    private attackType1(): void {
        const angleSpeed = 15;
        TimerAdmin._frameRandomLoop(120, 300, this, () => {
            for (let index = 0; index < 3; index++) {
                const bullet = Tools._Node.createPrefab(_Res._list.prefab2D.EnemyBullet.prefab)
                this._SceneImg('EBparrent').addChild(bullet);
                bullet.pos(this._gPoint.x, this._gPoint.y);
                bullet.addComponent(_EnemyBullet);
                let speed = 0;
                const gPoint = new Laya.Point(this._gPoint.x, this._gPoint.y);
                TimerAdmin._frameLoop(1, _EnemyBullet, () => {
                    let point = Tools._Point.getRoundPos(index * angleSpeed + 180 - angleSpeed, speed += 2, gPoint);
                    bullet.pos(point.x, point.y);
                })
            }
        })
    }
    private attackType2(): void {
        TimerAdmin._frameRandomLoop(50, 100, this, () => {
            let bullet = Tools._Node.createPrefab(_Res._list.prefab2D.EnemyBullet.prefab)
            this._SceneImg('EBparrent').addChild(bullet);
            bullet.pos(this._gPoint.x, this._gPoint.y);
            bullet.addComponent(_EnemyBullet);
            TimerAdmin._frameLoop(1, _EnemyBullet, () => {
                bullet.y += 3;
            })
        })
    }
    private attack3(): void {
        TimerAdmin._frameRandomLoop(100, 1000, this, () => {
            let bullet = Tools._Node.createPrefab(_Res._list.prefab2D.EnemyBullet.prefab)
            bullet.addComponent(_EnemyBullet);
            this._SceneImg('EBparrent').addChild(bullet);
            bullet.pos(this._gPoint.x, this._gPoint.y);
        })
    }
}
