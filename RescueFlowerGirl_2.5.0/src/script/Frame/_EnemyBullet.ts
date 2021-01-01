import { Admin, TimerAdmin, Tools } from "./Lwg";
import { _LwgEvent } from "./LwgEvent";
export default class _EnemyBullet extends Admin._ObjectBase {
    speed = 2;
    lwgOnStart(): void {
        this.move();
        this.checkHero();
    }
    move(): void {
        let GPoint = this._SceneImg('Hero').localToGlobal(new Laya.Point(this._SceneImg('Hero').x, this._SceneImg('Hero').y));
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