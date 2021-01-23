import { TimerAdmin, Tools } from "../Frame/Lwg";
import _EnemyBullet from "./EnemyBullet";
import { _Res } from "../Frame/_PreLoad";
export class BossBullet extends _EnemyBullet {
    lwgOnStart(): void {
        this.move();
        this.checkHeroAndLevel();
    }
    move(): void {
        TimerAdmin._frameLoop(1, this, () => {
            let point = Tools._Point.getRoundPos(this._Owner.rotation, this.speed += 2, this._fGPoint);
            this._Owner.x = point.x;
            this._Owner.y = point.y;
        })
    }
}

