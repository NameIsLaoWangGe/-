import lwg, { Admin, Click, DataAdmin, _SceneName } from "./Lwg";
import { _Defeated } from "./_Defeated";
import { _Game } from "./_Game";

/**测试模块,每个模块分开，默认导出一个类，这个类是默认挂载的脚本类，如果有多个脚本，
 * 那么在这个默认类中进行添加，或者在其他地方动态添加*/
export module _Start {
    export function _init(): void {
        console.log(_Start);
    }
    export class Start extends Admin._SceneBase {
        lwgOnAwake(): void {
        }
        lwgBtnRegister(): void {
            this._btnUp(this._ImgVar('BtnStart'), () => {
                let levelName = _SceneName.Game + 1;
                this._openScene(levelName, true, () => {
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


