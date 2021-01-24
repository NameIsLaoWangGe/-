import { Admin, DataAdmin, Effects2D, TimerAdmin, Tools } from "../Frame/Lwg";
import { _GameEvent } from "./_GameEvent";
import { _Res } from "../Frame/_PreLoad";
import Enemy from "./Enemy";
import { BossBullet } from "./BossBullet";
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
        TimerAdmin._frameLoop(1, this, () => {
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
        let time = 0;
        const num = 20;
        TimerAdmin._frameRandomLoop(50, 100, this, () => {
            time++;
            for (let index = 0; index < num; index++) {
                const bullet = Tools._Node.createPrefab(_Res._list.prefab2D.EnemyBullet.prefab) as Laya.Image;
                this._SceneImg('EBparrent').addChild(bullet);
                bullet.pos(this._gPoint.x, this._gPoint.y);
                bullet.rotation = 360 / num * index + time * 10;
                bullet.addComponent(BossBullet);
            }
        }, true);
    }
}
