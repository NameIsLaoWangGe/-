import { TimerAdmin, Tools } from "../Frame/Lwg";
import _EnemyBullet from "./_EnemyBullet";
import { _Res } from "../Frame/_PreLoad";
export class BossBullet extends _EnemyBullet {
    lwgOnStart(): void {
        this.move();
        this.checkHeroAndLevel();
    }
    move(): void {
        TimerAdmin._frameLoop(1, this, () => {
            let point = Tools._Point.getRoundPos(this._Owner.rotation, this.speed += 2, this._fPoint);
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
