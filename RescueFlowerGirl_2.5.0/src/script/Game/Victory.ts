import { LwgScene, LwgEvent } from "../Lwg/Lwg";
import { _Game } from "./General/_GameGlobal";

export default class Victory extends LwgScene._SceneBase {
    lwgButton(): void {
        this._btnUp(this._ImgVar('BtnGet'), () => {
            this._openScene('Start');
            LwgEvent._notify(_Game._Event.closeScene);
        })
    }
}


