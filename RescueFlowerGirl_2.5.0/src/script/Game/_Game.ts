import { Admin, DataAdmin, Effects2D, EventAdmin, TimerAdmin, Tools, _SceneBase, _SceneName } from "../Frame/Lwg";
import { _GameEvent } from "./_GameEvent";
import { _EnemyData } from "./Enemy";
import Hero from "./Hero";
import { _Res } from "../Frame/_PreLoad";
import { Tree } from "./Buff";
import EnemyLand from "./EnemyLand";
import { EnemyHouse } from "./EnemyHouse";
/**游戏场景模块*/
export module _Game {
    /**剩余贴图的集合，游戏结束时一并销毁*/
    export let _texArr = [];
    /**箭的容器集合，这缓存为位图的bitmap节点，必须手动销毁*/
    export let _arrowParentArr = [];
    export class Game extends Admin._SceneBase {
        EnemyData: _EnemyData;
        lwgOnAwake(): void {
            // 创建主角
            this._Owner['Hero'] = Tools._Node.createPrefab(_Res._list.prefab2D.Hero.prefab, this._Owner, [Laya.stage.width / 2, Laya.stage.height * 2 / 3]);
            this._ImgVar('Hero').addComponent(Hero);
            // 树
            for (let index = 0; index < this._ImgVar('MiddleScenery').numChildren; index++) {
                const element = this._ImgVar('MiddleScenery').getChildAt(index);
                if (element.name == 'Tree') {
                    element.addComponent(Tree);
                }
            }
            // 陆地
            this._ImgVar('Land').addComponent(EnemyLand);
            // 房子
            this._ImgVar('EnemyHouse').addComponent(EnemyHouse);
        }
        lwgOnStart(): void {
            this._evNotify(_GameEvent.Game.enemyStage);
        }
        lwgEvent(): void {
            this._evReg(_GameEvent.Game.enemyStage, () => {
                //设置敌人
                this.EnemyData = new _EnemyData(this._ImgVar('EnemyParent'));
                this.EnemyData.createEnmey();
            });

            // this._evReg(_GameEvent.Game.bossStage, () => {
            //     _BossData._ins().createLevelBoss(this._ImgVar('BossParent'));
            // });
            // this._evReg(_GameEvent.Game.heroineStage, () => {
            //     _BossData._ins().createLevelBoss(this._ImgVar('BossParent'));
            // });

            this._evReg(_GameEvent.Game.closeScene, () => {
                for (let index = 0; index < _texArr.length; index++) {
                    const element = _texArr[index] as Laya.Texture;
                    element.destroy(true);
                    _texArr.splice(index, 1);
                    index--;
                }
                for (let index = 0; index < _arrowParentArr.length; index++) {
                    const element = _arrowParentArr[index] as Laya.Texture;
                    element.destroy(true);
                    _arrowParentArr.splice(index, 1);
                    index--;
                }
                this._closeScene();
            });
        }
    }
}
export default _Game.Game;



