import { LwgScene, LwgTools } from "../Lwg/Lwg";
import { _EnemyBullet } from "./EnemyAttack/_EnemyBullet";
import { _Res } from "./General/_Res";
import { _Game, _Role } from "./General/_GameGlobal";
import { Tree } from "./Levels_Buff";
import Levels_Land from "./Levels_Land";
import Levels_Enemy from "./Levels_Enemy";
import Levels_Hero from "./Levels_Hero";
import { Levels_EnemyHouse } from "./Levels_EnemyHouse";

export default class Levels extends LwgScene.SceneBase {
    lwgOnAwake(): void {
        // 创建主角
        this._Owner['Hero'] = LwgTools.Node.createPrefab(_Res.$prefab2D.Hero.prefab2D, this._Owner, [Laya.stage.width / 2, Laya.stage.height * 2 / 3]);
        this._ImgVar('Hero').addComponent(Levels_Hero);
        // 树
        for (let index = 0; index < this._ImgVar('MiddleScenery').numChildren; index++) {
            const element = this._ImgVar('MiddleScenery').getChildAt(index);
            if (element.name == 'Tree') {
                element.addComponent(Tree);
            }
        }
        // 陆地
        this._ImgVar('Land').addComponent(Levels_Land);
        // 房子
        this._ImgVar('EnemyHouse').addComponent(Levels_EnemyHouse);
        // 敌人子弹父节点
        _EnemyBullet.Parent = this._ImgVar('EBparrent');
    }
    lwgOnStart(): void {
        this._evNotify(_Game._Event.enemyStage);
    }
    _Enemy: _Role._Enemy;
    lwgEvent(): void {
        //敌人控制
        this._evReg(_Game._Event.enemyStage, () => {
            this._Enemy = new _Role._Enemy(this._ImgVar('EnemyParent'));
            const num = this._Enemy.quantity >= 10 ? 10 : this._Enemy.quantity;
            for (let index = 0; index < num; index++) {
                this._Enemy.createEnmey(Levels_Enemy);
            }
        });

        this._evReg(_Game._Event.addEnemy, () => {
            if (this._Enemy.quantity > 0) {
                this._Enemy.createEnmey(Levels_Enemy);
            } else {
                if (this._ImgVar('EnemyParent').numChildren <= 1) {
                    this._evNotify(_Game._Event.enemyLandStage);
                }
            }
        });

        // 清除贴图，关闭场景
        this._evReg(_Game._Event.closeScene, () => {
            for (let index = 0; index < _Game._texArr.length; index++) {
                const element = _Game._texArr[index] as Laya.Texture;
                element.destroy(true);
                _Game._texArr.splice(index, 1);
                index--;
            }
            for (let index = 0; index < _Game._arrowParentArr.length; index++) {
                const element = _Game._arrowParentArr[index] as Laya.Texture;
                element.destroy(true);
                _Game._arrowParentArr.splice(index, 1);
                index--;
            }
            this._closeScene();
        });
    }
}

export class Levels1 extends Levels {

}



