import { LwgScene, LwgData, LwgEff2D, LwgTimer, LwgTools } from "../../Lwg/Lwg";
import Enemy from "./Enemy";
import { EnemyAttack } from "./EnemyAttack";
export class Boss extends Enemy {
    lwgOnAwake(): void {
        this.generalProInit();
        this._Owner.pos(this._SceneImg('Content').x, this._SceneImg('Content').y);
        this._Owner.rotation = 0;
        this._SceneImg('Content').removeSelf();
        this.bloodInit(this._Owner['_EnemyData']['blood']);
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
        EnemyAttack.attackType7(this._Owner);
    }
}
