import { Admin, TimerAdmin, Tools } from "../Frame/Lwg";
import { _GameEvent } from "./_GameEvent";
import { _Game } from "./_Game";

export class HeroWeapon extends Admin._ObjectBase {
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
        TimerAdmin._frameLoop(1, this, () => {
            this.move();
        })
    }
    move(): void {
        if (this.getSpeed() > 0) {
            let p = Tools._Point.angleAndLenByPoint(this._Owner.rotation - 90, this.getSpeed());
            this._Owner.x += p.x;
            this._Owner.y += p.y;
        } else {
            this._Owner.y += this.getDropSpeed();
        }
        const leave = Tools._Node.leaveStage(this._Owner, () => {
            this._Owner.destroy();
        })
        // 如果到了打boss的时候，则不会
        if (!leave) {
            this._evNotify(_GameEvent.Game.treeCheckWeapon, [this._Owner, 1]);
            this._evNotify(_GameEvent.Game.enemyCheckWeapon, [this._Owner, 1]);
            this._evNotify(_GameEvent.Game.enemyLandCheckWeapon, [this._Owner, 1]);
            this._evNotify(_GameEvent.Game.enemyHouseCheckWeapon, [this._Owner, 1]);
            this._evNotify(_GameEvent.Game.heroineCheckWeapon, [this._Owner, 1]);
            this._evNotify(_GameEvent.Game.bossCheckWeapon, [this._Owner, 1]);
        }
    }
    drop(): void {
        this.state = this.stateType.free;
        Laya.timer.clearAll(this);
        TimerAdmin._frameLoop(1, this, () => {
            this._Owner.y += 40;
            this._Owner.rotation += 10;
            Tools._Node.leaveStage(this._Owner, () => {
                this._Owner.destroy();
            });
        })
    }
}