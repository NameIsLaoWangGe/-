import { LwgScene, LwgTools } from "../Lwg/Lwg";
import Hero from "./Role/Hero";
import EnemyLand from "./Role/EnemyLand";
import { EnemyHouse } from "./Role/EnemyHouse";
import { EnemyAttack } from "./Role/EnemyAttack";
import { _Game, _Role } from "./_GameData";
import { _Res } from "./_Res";
import { Tree } from "./Role/Buff";
import Enemy from "./Role/Enemy";
import { CreateBullet } from "./EnemyAttack/_CreateBullet";

export default class Game extends LwgScene._SceneBase {
    lwgOnAwake(): void {
        // 创建主角
        this._Owner['Hero'] = LwgTools._Node.createPrefab(_Res._list.prefab2D.Hero.prefab, this._Owner, [Laya.stage.width / 2, Laya.stage.height * 2 / 3]);
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
        // 敌人子弹父节点
        EnemyAttack.EBParent = this._ImgVar('EBparrent');
        CreateBullet.EBParent = this._ImgVar('EBparrent');
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
                this._Enemy.createEnmey(Enemy);
            }
        });

        this._evReg(_Game._Event.addEnemy, () => {
            if (this._Enemy.quantity > 0) {
                this._Enemy.createEnmey(Enemy);
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



