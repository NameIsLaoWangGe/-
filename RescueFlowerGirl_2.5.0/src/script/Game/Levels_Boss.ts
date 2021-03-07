import { LwgScene, LwgData, LwgEff2D, LwgTimer, LwgTools } from "../Lwg/Lwg";
import { _EnemyAttack } from "./EnemyAttack/_EnemyAttack";
import Levels_Enemy from "./Levels_Enemy";
export class Levels_Boss extends Levels_Enemy {
    lwgOnAwake(): void {
        this.generalProInit();
        this._Owner.pos(this._SceneImg('Content').x, this._SceneImg('Content').y);
        this._Owner.rotation = 0;
        this._SceneImg('Content').removeSelf();
        this.bloodInit(20);
    }
    lwgOnStart(): void {
        this.attack();
        this.move();
    }
    move(): void {
        let dir = 'left';
        LwgTimer._frameLoop(1, this, () => {
            if (dir == 'right') {
                this._Owner.x++;
                if (this._Owner.x > Laya.stage.width - 100) {
                    dir = 'left';
                }
            } else {
                this._Owner.x--;
                if (this._Owner.x < 100) {
                    dir = 'right';
                }
            }
        })
    }
    appear(): void {
    }
    attack(): void {
        _EnemyAttack.Level1.boss(this._Owner as any);
    }
}
