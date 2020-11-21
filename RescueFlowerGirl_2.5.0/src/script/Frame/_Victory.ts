import ADManager from "../TJ/Admanager";
import lwg, { Admin, Click, Tools, Dialogue, _SceneName, EventAdmin, DateAdmin } from "./Lwg";
import { _Game } from "./_Game";
import { _Share } from "./_Share";
import { _Special } from "./_Special";
export module _Victory {
    export class _data {
    }
    export function _init(): void {
    }
    export class Victory extends Admin._SceneBase {

        lwgBtnRegister(): void {
            this._btnUp(this._ImgVar('BtnGet'), () => {
                this._openScene(_SceneName.Start);
                EventAdmin._notify(_Game._Event.closeScene);
            })
        }
    }
}
export default _Victory.Victory;


