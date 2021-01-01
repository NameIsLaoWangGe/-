import { Admin, DataAdmin, Effects2D, EventAdmin, TimerAdmin, Tools, _SceneBase, _SceneName } from "./Lwg";
import { _LwgEvent } from "./LwgEvent";
import { _Boss } from "./_Boss";
import { _EnemyData } from "./_Enemy";
import _Hero from "./_Hero";
import { _Res } from "./_PreLoad";
import { _PropTry } from "./_PropTry";

/**游戏场景模块*/
export module _Game {
    export class Game extends Admin._SceneBase {
        EnemyData: _EnemyData
        lwgOnAwake(): void {
            //设置敌人
            this.EnemyData = new _EnemyData(this._ImgVar('EnemyParent'));
            this.EnemyData.createEnmey();
            _Boss._BossData._ins().createLevelBoss(this._ImgVar('EnemyParent'));
            this._ImgVar('Hero').addComponent(_Hero);
        }
        lwgOnStart(): void {
            TimerAdmin._frameLoop(1, this, () => {
                this._ImgVar('Land').rotation += 0.1;
            })
        }
        lwgEvent(): void {
            this._evReg(_LwgEvent.Game.closeScene, () => {
                this._closeScene();
            });
        }
    }
}
export default _Game.Game;



