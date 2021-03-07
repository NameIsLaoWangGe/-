import { LwgScene, LwgTimer, LwgTools } from "../Lwg/Lwg";
import { _Game } from "./General/_GameData";

export class Levels_HeroWeapon extends LwgScene._ObjectBase {
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
        LwgTimer._frameLoop(1, this, () => {
            this.move();
        })
    }
    move(): void {
        if (this.getSpeed() > 0) {
            let p = LwgTools._Point.angleAndLenByPoint(this._Owner.rotation - 90, this.getSpeed());
            this._Owner.x += p.x;
            this._Owner.y += p.y;
        } else {
            this._Owner.y += this.getDropSpeed();
        }
        const leave = LwgTools._Node.leaveStage(this._Owner, () => {
            this._Owner.destroy();
        })
        if (!leave) {
            this._evNotify(_Game._Event.treeCheckWeapon, [this._Owner, 1]);
            this._evNotify(_Game._Event.enemyCheckWeapon, [this._Owner, 1]);
            this._evNotify(_Game._Event.enemyLandCheckWeapon, [this._Owner, 1]);
            this._evNotify(_Game._Event.enemyHouseCheckWeapon, [this._Owner, 1]);
            this._evNotify(_Game._Event.heroineCheckWeapon, [this._Owner, 1]);
            this._evNotify(_Game._Event.bossCheckWeapon, [this._Owner, 1]);
        }
    }
    drop(): void {
        this.state = this.stateType.free;
        Laya.timer.clearAll(this);
        LwgTimer._frameLoop(1, this, () => {
            this._Owner.y += 40;
            this._Owner.rotation += 10;
            LwgTools._Node.leaveStage(this._Owner, () => {
                this._Owner.destroy();
            });
        })
    }
}