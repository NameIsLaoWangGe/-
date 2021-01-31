import Lwg, { LwgTimer, LwgTools } from "../../Lwg/Lwg";
import { CreateBullet } from "./_CreateBullet";
import { _Whom } from "./_EnemyAttack";

/**类似扇形的攻击方式*/
export class Sector implements _Whom {
    private static ins: Sector;
    static _ins(): Sector {
        if (!this.ins) this.ins = new Sector;
        return this.ins;
    }
    /**向下发射均匀的三个子弹*/
    enemy(enemy: Lwg.NodeAdmin._Image): void {
        const angleSpacing = 15;
        const speed = 5;
        LwgTimer._frameRandomLoop(120, 300, enemy, () => {
            for (let index = 0; index < 3; index++) {
                const bullet = CreateBullet.create(enemy);
                let _speedAdd = 0;
                LwgTimer._frameLoop(1, bullet, () => {
                    const point = LwgTools._Point.getRoundPos(index * angleSpacing + 180 - angleSpacing, _speedAdd += speed, enemy._lwg.gPoint);
                    bullet.pos(point.x, point.y);
                })
            }
        })
    }
    /**向下发射均匀发射10个子弹和8个子弹交错，并且速度不一样，角度也会错开*/
    enemyLand(enemy: Lwg.NodeAdmin._Image): void {
        const angleSpacing = 15;
        let time = 0;
        const speed = 5;
        LwgTimer._frameLoop(30, enemy, () => {
            time++;
            let num = time % 2 == 0 ? 12 : 10;
            for (let index = 0; index < num; index++) {
                const bullet = CreateBullet.create(enemy);
                let _speedAdd = 0;
                LwgTimer._frameLoop(1, bullet, () => {
                    const unit = (180 - angleSpacing * 2) / num;
                    const point = LwgTools._Point.getRoundPos(unit * index + angleSpacing * 2 + 90 - unit / 2, _speedAdd += speed, enemy._lwg.gPoint);
                    bullet.pos(point.x, point.y);
                })
            }
        })
    }

    /**交差两个扇形在boss的两边*/
    boss(enemy: Lwg.NodeAdmin._Image): void {
        const angleSpacing = 30;
        let time = 0;
        const speed = 5;
        const num = 6;
        LwgTimer._frameLoop(30, enemy, () => {
            time++;
            const unit = (180 - angleSpacing * 2) / num;
            for (let index = 0; index < num; index++) {
                const bullet = CreateBullet.create(enemy);
                let _speedAdd = 0;
                LwgTimer._frameLoop(1, bullet, () => {
                    const unit = (180 - angleSpacing * 2) / num;
                    const point = LwgTools._Point.getRoundPos(unit * index + angleSpacing * 2 + 90, _speedAdd += speed, new Laya.Point(enemy._lwg.gPoint.x + 100, enemy._lwg.gPoint.y));
                    bullet.pos(point.x, point.y);
                })
            }
            for (let index = 0; index < num; index++) {
                const bullet = CreateBullet.create(enemy);
                let _speedAdd = 0;
                LwgTimer._frameLoop(1, bullet, () => {
                    const point = LwgTools._Point.getRoundPos(unit * index + angleSpacing * 2, _speedAdd += speed, new Laya.Point(enemy._lwg.gPoint.x - 100, enemy._lwg.gPoint.y));
                    bullet.pos(point.x, point.y);
                })
            }
        })
    }

    /**向下发射均匀的三个子弹*/
    heroine(enemy: Lwg.NodeAdmin._Image): void {
        const angleSpeed = 15;
        LwgTimer._frameRandomLoop(120, 300, enemy, () => {
            for (let index = 0; index < 3; index++) {
                const bullet = CreateBullet.create(enemy);
                let speed = 0;
                LwgTimer._frameLoop(1, bullet, () => {
                    const point = LwgTools._Point.getRoundPos(index * angleSpeed + 180 - angleSpeed, speed += 2, bullet._lwg.gPoint);
                    bullet.pos(point.x, point.y);
                })
            }
        })
    }

}