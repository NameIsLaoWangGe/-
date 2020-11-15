import ADManager from "../TJ/Admanager";
import RecordManager from "../TJ/RecordManager";
import { Admin, Click, _Gold, Tools, Dialogue, _SceneName, EventAdmin } from "./Lwg";
import { _Game } from "./_Game";
import { _PreloadUrl } from "./_PreLoad";
export module _Settle {
    export class _data {
    }
    export function _init(): void {
    }
    /**通用类，进行通用初始化，这里有两个作用，第一个是不同游戏通用，另一个是同一个游戏中拥有相同部分的基类*/
    export class SettleBase extends Admin._SceneBase {
    }
    /**可以手动挂在脚本中的类，全脚本唯一的默认导出，也可动态添加，动态添加写在模块内更方便*/
    export class Settle extends _Settle.SettleBase {
        lwgBtnClick(): void {
        }
    }
}
export default _Settle.Settle;


