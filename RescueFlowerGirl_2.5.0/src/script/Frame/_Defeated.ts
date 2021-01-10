import { Admin, EventAdmin, _SceneName } from "./Lwg";
import { _GameEvent } from "../Game/_GameEvent";
import { _Game } from "../Game/_Game";

export module _Defeated {
    export class _data {
    }
    export function _init(): void {
    }
    export class Defeated extends Admin._SceneBase {
        lwgButton(): void {
            this._btnUp(this._ImgVar('BtnBack'), () => {
                this._openScene(_SceneName.Start);
                EventAdmin._notify(_GameEvent.Game.closeScene);
            })
        }
    }
}
export default _Defeated.Defeated;