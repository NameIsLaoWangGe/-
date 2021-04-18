import { LwgScene } from "../Lwg/Lwg";
import { _GameEvent } from "./General/_GameEvent";

export default class Defeated extends LwgScene.SceneBase {
    lwgOnAwake(): void {

    }
    lwgOnEnable(): void {

    }
    lwgOnStart(): void {

    }
    lwgOpenAni(): number {
        return 10;
    }
    lwgOpenAniAfter(): void {

    }
    lwgEvent(): void {

    }
    lwgButton(): void {
        this._btnUp(this._ImgVar('BtnBack'), () => {
            this._openScene('Start');
            this._evNotify(_GameEvent.closeScene);
        })
    }
    lwgOnStageDown(): void {

    }
    lwgOnStageMove(): void {

    }
    lwgOnStageUp(): void {

    }
    lwgCloseAni(): number {
        return 10;
    }
    lwgOnDisable(): void {

    }
}