import { Admin, EventAdmin, _SceneName } from "./Lwg";
import { _LwgEvent } from "./LwgEvent";
import { _Game } from "./_Game";

export module _Defeated {
    export class _data {
    }
    export function _init(): void {
    }
    export class Defeated extends Admin._SceneBase {
        lwgButton(): void {
            this._btnUp(this._ImgVar('BtnBack'), () => {
                this._openScene(_SceneName.Start);
                EventAdmin._notify(_LwgEvent.Game.closeScene);
            })
        }
    }
}
export default _Defeated.Defeated;