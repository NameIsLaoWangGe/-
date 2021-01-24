import { Admin, DataAdmin, Effects2D, EventAdmin, TimerAdmin, Tools } from "../Frame/Lwg";
import { _GameEvent } from "./_GameEvent";
import _EnemyBullet from "./EnemyBullet";
import { _Res } from "../Frame/_PreLoad";
import BloodBase from "./BloodBase";
import { _Game } from "./_Game";
import { Heroine } from "./Heroine";
export default class Enemy extends BloodBase {
    speed: number;
    groundRadius: number;
    ranAttackNum: number;
    lwgOnAwake(): void {
        this.generalProInit();
        this.bloodInit(this._Owner['_EnemyData']['blood']);
        this.ranAttackNum = Tools._Number.randomOneBySection(1, 3, true);
    }
    generalProInit(): void {
        this._Owner.pos(this._SceneImg('Land').width / 2, this._SceneImg('Land').height / 2);
        // !shell && this.Shell.removeSelf();
        this._ImgChild('Shell').removeSelf();
        if (this._Owner['_EnemyData']['color']) {
            this._ImgChild('Pic').skin = `Game/UI/Game/Enemy/enemy_01_${this._Owner['_EnemyData']['color']}.png`;
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
        this._evNotify(_GameEvent.Game.addEnemy);
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
    // private attackType3(): void {
    //     TimerAdmin._frameLoop(80, this, () => {
    //         const bullet = this.createBullet();
    //         const gPoint = new Laya.Point(this._gPoint.x, this._gPoint.y);
    //         const angle = Tools._Number.randomOneBySection(45, 135) + 90;
    //         let speed = 5;
    //         TimerAdmin._frameLoop(1, bullet, () => {
    //             let point = Tools._Point.getRoundPos(angle, speed += 5, gPoint);
    //             bullet.pos(point.x, point.y);
    //         })
    //     })
    // }
}
