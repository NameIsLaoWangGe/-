import { Admin, Setting, _SceneName } from "./Lwg";
import { _Defeated } from "./_Defeated";
import { _Game } from "../Game/_Game";

/**测试模块,每个模块分开，默认导出一个类，这个类是默认挂载的脚本类，如果有多个脚本，
 * 那么在这个默认类中进行添加，或者在其他地方动态添加*/
export module _Start {
    export function _init(): void {
        console.log(_Start);
    }
    export class Start extends Admin._SceneBase {
        lwgOnAwake(): void {
            Setting._bgMusic.switch = false;
        }
        lwgButton(): void {
            this._btnUp(this._ImgVar('BtnStart'), () => {
                let levelName = _SceneName.Game + 1;
                this._openScene(levelName, true, false, () => {
                    if (!Admin._SceneControl[levelName].getComponent(_Game.Game)) {
                        Admin._SceneControl[levelName].addComponent(_Game.Game);
                    }
                });
            })
        }
    }
    export class StartItem extends Admin._ObjectBase {

    }
}
export default _Start.Start;


