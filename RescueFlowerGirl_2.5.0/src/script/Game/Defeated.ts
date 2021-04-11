import { LwgScene } from "../Lwg/Lwg";
import { _Game } from "./General/_GameGlobal";

export default class Defeated extends LwgScene.SceneBase {
    lwgButton(): void {
        this._btnUp(this._ImgVar('BtnBack'), () => {
            this._openScene('Start');
            this._evNotify(_Game._Event.closeScene);
        })
    }
}