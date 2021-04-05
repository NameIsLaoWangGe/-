import { LwgScene, LwgSet } from "../Lwg/Lwg";
import { _SceneName } from "./General/_SceneName";
import Game from "./Levels";
/**测试模块,每个模块分开，默认导出一个类，这个类是默认挂载的脚本类，如果有多个脚本，
 * 那么在这个默认类中进行添加，或者在其他地方动态添加*/
export default class Start extends LwgScene._SceneBase {
    lwgOnAwake(): void {
        LwgSet._bgMusic.switch = false;
    }
    lwgButton(): void {
        this._btnUp(this._ImgVar('BtnStart'), () => {
            this._openScene(_SceneName.Levels);
        })
    }
}


