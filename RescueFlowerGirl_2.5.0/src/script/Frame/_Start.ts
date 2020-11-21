import lwg, { Admin, Click, _SceneName } from "./Lwg";
import { _Game } from "./_Game";

/**测试模块,每个模块分开，默认导出一个类，这个类是默认挂载的脚本类，如果有多个脚本，
 * 那么在这个默认类中进行添加，或者在其他地方动态添加*/
export module _Start {
    export function _init(): void {
    }
    /**通用类，进行通用初始化，可在每个游戏中重复使用重复*/
    export class _StartScene extends Admin._SceneBase {
        moduleOnAwake(): void {
            // _Gold.createGoldNode(38, 68);
        }
    }
    export class Start extends _StartScene {
        lwgOnAwake(): void {
        }
        lwgBtnRegister(): void {
            this._btnUp(this._ImgVar('BtnStart'), () => {
                let levelName = _SceneName.Game + 1;
                this._openScene(levelName, true, false, () => {
                    if (!Admin._sceneControl[levelName].getComponent(_Game.Game)) {
                        Admin._sceneControl[levelName].addComponent(_Game.Game);
                    }
                });
            })
        }
    }
    export class StartItem extends Admin._ObjectBase {

    }
}
export default _Start.Start;


