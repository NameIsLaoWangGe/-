import { Admin, TimerAdmin, Tools } from "../Frame/Lwg";
import { _GameEvent } from "./_GameEvent";
export default class EnemyBullet extends Admin._ObjectBase {
    speed = 2;
    lwgOnStart(): void {
        // this.move();
        this.checkHeroAndLevel();
    }
    move(): void {
        this[`moveType${this._Owner['_moveType']['moveNum']}`]();
    }
    moveType1(): void {
        TimerAdmin._frameLoop(1, this, () => {
            let point = Tools._Point.getRoundPos(this._Owner['_moveType']['angle'], this.speed += 2, this._Owner['_moveType']['point']);
            this._Owner.pos(point.x, point.y);
        })
    }
    moveType2(): void {
        TimerAdmin._frameLoop(1, this, () => {
            this._Owner.y += 3;
        })
    }
    moveType3(): void {

    }
    checkHeroAndLevel(): void {
        TimerAdmin._frameLoop(1, this, () => {
            !Tools._Node.leaveStage(this._Owner, () => {
                this._Owner.removeSelf();
            }) && this._evNotify(_GameEvent.Game.checkEnemyBullet, [this._Owner, 1]);
        })
    }
}