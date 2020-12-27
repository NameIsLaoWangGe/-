import ADManager from "../TJ/Admanager";
import { Admin, EventAdmin, _SceneName } from "./Lwg";
import { _LwgEvent } from "./LwgEvent";
import { _Game } from "./_Game";
import { _Share } from "./_Share";
export module _Victory {
    export class _data {
    }
    export function _init(): void {
    }
    export class Victory extends Admin._SceneBase {

        lwgButton(): void {
            this._btnUp(this._ImgVar('BtnGet'), () => {
                this._openScene(_SceneName.Start);
                EventAdmin._notify(_LwgEvent.Game.closeScene);
            })
        }
    }
}
export default _Victory.Victory;


