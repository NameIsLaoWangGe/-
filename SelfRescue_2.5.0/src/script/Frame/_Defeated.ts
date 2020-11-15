import { Admin, Click, EventAdmin, _SceneName } from "./Lwg";
import { _Game } from "./_Game";

export module _Defeated {
    export class _data {
    }
    export function _init(): void {
    }
    export class Defeated extends Admin._SceneBase {
        lwgBtnClick(): void {
            Click._on(Click._Type.largen, this.ImgVar('BtnBack'), this, null, null, () => {
                this.lwgOpenScene(_SceneName.Start);
                EventAdmin._notify(_Game._Event.closeScene);
            })
        }
    }
}
export default _Defeated.Defeated;