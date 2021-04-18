import { LwgScene, LwgTimer, LwgTools } from "../Lwg/Lwg";
import { _GameEvent } from "./General/_GameEvent";

export class Levels_HeroWeapon extends LwgScene.ObjectBase {
    launchAcc: number = 0;
    dropAcc: number = 0;
    get state(): string {
        return this['Statevalue'] ? this['Statevalue'] : 'launch';
    };
    set state(_state: string) {
        this['Statevalue'] = _state;
    };
    stateType = {
        launch: 'launch',
        free: 'free',
    }
    getSpeed(): number {
        return 15 + 0.1;
    }
    getDropSpeed(): number {
        return this.dropAcc += 0.5;
    }
    lwgOnAwake(): void {
        LwgTimer.frameLoop(1, this, () => {
            this.move();
        })
    }
    move(): void {
        if (this.getSpeed() > 0) {
            let p = LwgTools.Point.angleAndLenByPoint(this._Owner.rotation - 90, this.getSpeed());
            this._Owner.x += p.x;
            this._Owner.y += p.y;
        } else {
            this._Owner.y += this.getDropSpeed();
        }
        const leave = LwgTools.Node.leaveStage(this._Owner, () => {
            this._Owner.destroy();
        })
        if (!leave) {
            this._evNotify(_GameEvent.treeCheckWeapon, [this._Owner, 1]);
            this._evNotify(_GameEvent.enemyCheckWeapon, [this._Owner, 1]);
            this._evNotify(_GameEvent.enemyLandCheckWeapon, [this._Owner, 1]);
            this._evNotify(_GameEvent.enemyHouseCheckWeapon, [this._Owner, 1]);
            this._evNotify(_GameEvent.heroineCheckWeapon, [this._Owner, 1]);
            this._evNotify(_GameEvent.bossCheckWeapon, [this._Owner, 1]);
        }
    }
    drop(): void {
        this.state = this.stateType.free;
        Laya.timer.clearAll(this);
        LwgTimer.frameLoop(1, this, () => {
            this._Owner.y += 40;
            this._Owner.rotation += 10;
            LwgTools.Node.leaveStage(this._Owner, () => {
                this._Owner.destroy();
            });
        })
    }
}