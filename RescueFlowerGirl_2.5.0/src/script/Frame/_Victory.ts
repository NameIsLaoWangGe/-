import ADManager from "../TJ/Admanager";
import lwg, { Admin, Click, _Gold, Tools, Dialogue, _SceneName, EventAdmin, DateAdmin } from "./Lwg";
import { _Game } from "./_Game";
import { _PreloadUrl } from "./_PreLoad";
import { _Share } from "./_Share";
import { _Special } from "./_Special";
export module _Victory {
    export class _data {
    }
    export function _init(): void {
    }
    export class Victory extends Admin._SceneBase {

        lwgBtnClick(): void {
            Click._on(Click._Type.largen, this.ImgVar('BtnGet'), this, null, null, () => {
                this.lwgOpenScene(_SceneName.Start);
                EventAdmin._notify(_Game._Event.closeScene);
            })
        }
    }
}
export default _Victory.Victory;


