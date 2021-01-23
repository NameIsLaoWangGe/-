import { Admin, DataAdmin, Effects2D, EventAdmin, TimerAdmin, Tools } from "../Frame/Lwg";
import { _GameEvent } from "./_GameEvent";
import _EnemyBullet from "./EnemyBullet";
import { _Res } from "../Frame/_PreLoad";
import { BossBullet } from "./BossBullet";
import BloodBase from "./BloodBase";
import { _Game } from "./_Game";
import { Heroine } from "./Heroine";
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
            EventAdmin._notify(_GameEvent.Game.enemyLandStage);
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
        element.addComponent(Enemy);
    }
}

export default class Enemy extends BloodBase {
    Pic: Laya.Image;
    Shell: Laya.Image;
    speed: number;
    groundRadius: number;
    private ranAttackNum: number;
    lwgOnAwake(): void {
        this.generalProInit();
        this.bloodInit(this._Owner['_EnemyData']['blood']);
        this.ranAttackNum = Tools._Number.randomOneBySection(1, 3, true);
    }
    generalProInit(): void {
        this._Owner.pos(this._SceneImg('Land').width / 2, this._SceneImg('Land').height / 2);
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
        // this[`attackType${3}`]();
    }
    move(): void {
        TimerAdmin._frameLoop(1, this, () => {
            let point = Tools._Point.getRoundPos(this._Owner.rotation += this.speed, 220, new Laya.Point(this._SceneImg('Land').width / 2, this._SceneImg('Land').height / 2))
            this._Owner.x = point.x;
            this._Owner.y = point.y;
        })
    }
    deathFunc(): void {
        this._evNotify('presentQuantity');
        // 最后一个为boss
        if (this._Owner.name === 'Boss') {
            Tools._Node.createPrefab(_Res._list.prefab2D.Heroine.prefab, this._Parent, [this._Owner.x, this._Owner.y], Heroine);
        }
    }
    lwgEvent(): void {
        this._evReg(_GameEvent.Game.enemyCheckWeapon, (Weapon: Laya.Image, numBlood: number) => {
            this.checkOtherRule(Weapon, 30, numBlood);
        })
    }
    createBullet(): Laya.Image {
        const bullet = Tools._Node.createPrefab(_Res._list.prefab2D.EnemyBullet.prefab, this._SceneImg('EBparrent'), [this._gPoint.x, this._gPoint.y], _EnemyBullet) as Laya.Image;
        return bullet;
    }
    private attackType1(): void {
        const angleSpeed = 15;
        TimerAdmin._frameRandomLoop(120, 300, this, () => {
            for (let index = 0; index < 3; index++) {
                const bullet = this.createBullet();
                let speed = 0;
                const gPoint = new Laya.Point(this._gPoint.x, this._gPoint.y);
                TimerAdmin._frameLoop(1, bullet, () => {
                    let point = Tools._Point.getRoundPos(index * angleSpeed + 180 - angleSpeed, speed += 2, gPoint);
                    bullet.pos(point.x, point.y);
                })
            }
        })
    }
    /**
    * 间断的下落一个子弹
    * */
    private attackType2(): void {
        TimerAdmin._frameRandomLoop(50, 100, this, () => {
            const bullet = this.createBullet();
            TimerAdmin._frameLoop(1, bullet, () => {
                bullet.y += 3;
            })
        })
    }
    /**
     * 在随机方向上随意发射一个子弹
     * */
    private attackType3(): void {
        TimerAdmin._frameLoop(80, this, () => {
            const bullet = this.createBullet();
            const gPoint = new Laya.Point(this._gPoint.x, this._gPoint.y);
            const angle = Tools._Number.randomOneBySection(45, 135) + 90;
            let speed = 5;
            TimerAdmin._frameLoop(1, bullet, () => {
                let point = Tools._Point.getRoundPos(angle, speed += 5, gPoint);
                bullet.pos(point.x, point.y);
            })
        })
    }
}
