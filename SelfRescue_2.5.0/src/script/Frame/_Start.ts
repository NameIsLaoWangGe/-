import lwg, { Admin, Click, _Gold, _SceneName } from "./Lwg";
import { _Game } from "./_Game";

/**测试模块,每个模块分开，默认导出一个类，这个类是默认挂载的脚本类，如果有多个脚本，
 * 那么在这个默认类中进行添加，或者在其他地方动态添加*/
export module _Start {
    export function _init(): void {
        let name = {
            dsfa: status,
        }
    }
    /**通用类，进行通用初始化，可在每个游戏中重复使用重复*/
    export class _StartScene extends Admin._SceneBase {
        moduleOnAwake(): void {
            _Gold.createGoldNode(38, 68);
        }
    }
    export class Start extends _StartScene {
        lwgOnAwake(): void {
        }
        lwgBtnClick(): void {
            Click._on(Click._Type.largen, this.btnVar('BtnStart'), this, null, null, () => {
                this.lwgOpenScene(_SceneName.SelectLevel);
            })
        }
    }
    export class StartItem extends Admin._Object {

    }
}
export default _Start.Start;


