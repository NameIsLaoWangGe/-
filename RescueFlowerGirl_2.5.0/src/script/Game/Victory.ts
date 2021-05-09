import { LwgScene, LwgEvent } from "../Lwg/Lwg";
import { _GameEvent } from "./General/_GameEvent";

export default class Victory extends LwgScene.SceneBase {
    lwgButton(): void {
        this._btnUp(this._ImgVar('BtnGet'), () => {
            this._openScene('Start');
        })
    }
}


