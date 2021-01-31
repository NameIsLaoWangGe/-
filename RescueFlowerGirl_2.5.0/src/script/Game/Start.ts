import { LwgScene, LwgSet } from "../Lwg/Lwg";
import Game from "./Game";
/**测试模块,每个模块分开，默认导出一个类，这个类是默认挂载的脚本类，如果有多个脚本，
 * 那么在这个默认类中进行添加，或者在其他地方动态添加*/
export default class Start extends LwgScene._SceneBase {
    lwgOnAwake(): void {
        LwgSet._bgMusic.switch = false;
    }
    lwgButton(): void {
        this._btnUp(this._ImgVar('BtnStart'), () => {
            let levelName = 'Game';
            this._openScene(levelName, true, false, () => {
                if (!LwgScene._SceneControl[levelName].getComponent(Game)) {
                    LwgScene._SceneControl[levelName].addComponent(Game);
                }
            });
        })
    }
}


