import ADManager from "../TJ/Admanager";
import RecordManager from "../TJ/RecordManager";
import { Admin, Click, _Gold, Tools, Dialogue, _SceneName, EventAdmin } from "./Lwg";
import { _Game } from "./_Game";
import { _PreloadUrl } from "./_PreLoad";
export module _Share {
    export class _data {
    }
    export enum _Event {
    }
    export function _init(): void {
    }
    /**通用类，进行通用初始化，这里有两个作用，第一个是不同游戏通用，另一个是同一个游戏中拥有相同部分的基类*/
    export class ShareBase extends Admin._SceneBase {
    }
    /**可以手动挂在脚本中的类，全脚本唯一的默认导出，也可动态添加，动态添加写在模块内更方便*/
    export class Share extends _Share.ShareBase {
        lwgBtnClick(): void {
            var func = () => {
                EventAdmin._notify(_Game._Event.victory);
                this.lwgOpenScene(_SceneName.Victory);
            }
            Click._on(Click._Type.largen, this.btnVar('BtnContinue'), this, null, null, () => {
                func();
            });
            Click._on(Click._Type.largen, this.btnVar('BtnShare'), this, null, null, () => {
                RecordManager._share('award', () => {
                    func();
                });
            });
        }
    }
}
export default _Share.Share;


