import { LwgScene } from "../Lwg/Lwg";
import { _GameEvent } from "./General/_GameEvent";

export default class Defeated extends LwgScene.SceneBase {
    lwgButton(): void {
        this._btnUp(this._ImgVar('BtnBack'), () => {
            this._openScene('Start');
            this._evNotify(_GameEvent.closeScene);
        })
    }
}