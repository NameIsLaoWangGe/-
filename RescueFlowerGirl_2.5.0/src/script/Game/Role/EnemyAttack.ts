import lwg, { LwgScene, LwgTimer, LwgTools } from "../../Lwg/Lwg";
import { _Res } from "../_Res";
import EnemyBullet from "./EnemyBullet";

export class EnemyAttack {
    static EBParent: Laya.Image;
    private static createBullet(enemy: Laya.Sprite): Laya.Image {
        const gP = this.getEnemyGp(enemy);
        const bullet = LwgTools._Node.createPrefab(_Res._list.prefab2D.EnemyBullet.prefab, this.EBParent, [gP.x, gP.y], EnemyBullet) as Laya.Image;
        return bullet;
    }

    private static getEnemyGp(enemy: Laya.Sprite): Laya.Point {
        if (enemy.parent) {
            const parent = enemy.parent as Laya.Sprite;
            return parent.localToGlobal(new Laya.Point(enemy.x, enemy.y));
        } else {
            return null;
        }
    }

    /**向下发射均匀的三个子弹*/
    static attackType1(enemy: Laya.Sprite): void {
        const angleSpeed = 15;
        LwgTimer._frameRandomLoop(120, 300, enemy, () => {
            const gPoint = this.getEnemyGp(enemy);
            if (!gPoint) return;
            for (let index = 0; index < 3; index++) {
                const bullet = this.createBullet(enemy);
                let speed = 0;
                LwgTimer._frameLoop(1, bullet, () => {
                    const point = LwgTools._Point.getRoundPos(index * angleSpeed + 180 - angleSpeed, speed += 2, gPoint);
                    bullet.pos(point.x, point.y);
                })
            }
        })
    }
    /**
    * 间断的下落一个子弹
    * */
    static attackType2(enemy: Laya.Sprite): void {
        LwgTimer._frameRandomLoop(50, 100, enemy, () => {
            const bullet = this.createBullet(enemy);
            LwgTimer._frameLoop(1, bullet, () => {
                bullet.y += 3;
            })
        })
    }
    /**
     * 在随机方向上随意发射一个子弹
     * */
    static attackType3(enemy: Laya.Sprite): void {
        LwgTimer._frameLoop(80, enemy, () => {
            const bullet = this.createBullet(enemy);
            const gPoint = this.getEnemyGp(enemy);
            if (!gPoint) return;
            const angle = LwgTools._Number.randomOneBySection(45, 135) + 90;
            let speed = 5;
            LwgTimer._frameLoop(1, bullet, () => {
                const point = LwgTools._Point.getRoundPos(angle, speed += 5, gPoint);
                bullet.pos(point.x, point.y);
            })
        })
    }

    /**环形攻击*/
    static attackType4(enemy: Laya.Sprite): void {
        let time = 0;
        const num = 20;
        LwgTimer._frameRandomLoop(50, 100, this, () => {
            time++;
            const gPoint = this.getEnemyGp(enemy);
            if (!gPoint) return;
            for (let index = 0; index < num; index++) {
                const bullet = this.createBullet(enemy);
                bullet.rotation = 360 / num * index + time * 10;
                let speed = 0;
                LwgTimer._frameLoop(1, bullet, () => {
                    const point = LwgTools._Point.getRoundPos(bullet.rotation, speed += 5, gPoint);
                    bullet.pos(point.x, point.y);
                })
            }
        }, true);
    }

    /**螺旋子弹*/
    static attackType5(enemy: Laya.Sprite): void {
        let time = 0;
        LwgTimer._frameLoop(2, enemy, () => {
            time++;
            const gPoint = this.getEnemyGp(enemy);
            if (!gPoint) return;
            const bullet = this.createBullet(enemy);
            bullet.rotation = time * 10;
            let speed = 0;
            LwgTimer._frameLoop(1, bullet, () => {
                const point = LwgTools._Point.getRoundPos(bullet.rotation, speed += 5, gPoint);
                bullet.pos(point.x, point.y);
            })
        }, true);
    }

    /**3个螺旋子弹*/
    static attackType6(enemy: Laya.Sprite): void {
        let time = 0;
        const num = 3;
        LwgTimer._frameLoop(5, enemy, () => {
            time++;
            for (let index = 0; index < num; index++) {
                const gPoint = this.getEnemyGp(enemy);
                if (!gPoint) return;
                const bullet = this.createBullet(enemy);
                bullet.rotation = index * 360 / num + time * 15;
                let speed = 0;
                LwgTimer._frameLoop(1, bullet, () => {
                    const point = LwgTools._Point.getRoundPos(bullet.rotation, speed += 5, gPoint);
                    bullet.pos(point.x, point.y);
                })
            }
        }, true);
    }

    /**横排发射子弹，每次错开*/
    static attackType7(enemy: Laya.Sprite): void {
        let time = 0;
        const spacing = 60;
        LwgTimer._frameLoop(30, enemy, () => {
            time++;
            let num = 5;
            if (time % 2 == 0) {
                num = 6;
            }
            for (let index = 0; index < num; index++) {
                const gPoint = this.getEnemyGp(enemy);
                if (!gPoint) return;
                const bullet = this.createBullet(enemy);
                bullet.pos(Laya.stage.width / num * index + (Laya.stage.width / num / 2), gPoint.y);
                LwgTimer._frameLoop(1, bullet, () => {
                    bullet.y += 5;
                })
            }
        }, true);
    }

    /**横排发射子弹，每次发射3个*/
    static attackType8(enemy: Laya.Sprite): void {
        const spacing = 70;
        LwgTimer._frameLoop(30, enemy, () => {
            let diff = 0;
            for (let index = 0; index < 5; index++) {
                const gPoint = this.getEnemyGp(enemy);
                if (!gPoint) return;
                const bullet = this.createBullet(enemy);
                switch (index) {
                    case 0:
                        diff = -spacing * 2;
                        break;
                    case 1:
                        diff = -spacing;
                        break;
                    case 2:
                        diff = 0;
                        break;
                    case 3:
                        diff = spacing;
                        break;
                    case 4:
                        diff = spacing * 2;
                        break;
                    default:
                        break;
                }
                bullet.pos(gPoint.x + diff, gPoint.y);
                LwgTimer._frameLoop(1, bullet, () => {
                    bullet.y += 6;
                })
            }
        }, true);
    }
}