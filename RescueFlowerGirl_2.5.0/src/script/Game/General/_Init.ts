import Start from "../Start";
import { LwgAdaptive, LwgAdmin, LwgClick, LwgPlatform, LwgScene, LwgSceneAni } from "../../Lwg/Lwg";
import Levels from "../Levels";
import _SubPkg from "../../Lwg/_SubPkg";
import _PreLoadCutIn from "./_PreLoadCutIn";
import _PreLoad from "./_PreLoad";
import _Guide from "./_Guide";
import _Parameter from "./_Parameter";
import { _SceneName } from "./_SceneName";
import Defeated from "../Defeated";
import Victory from "../Victory";

export default class _Init extends LwgAdmin._InitScene {
    lwgOnAwake(): void {
        LwgPlatform._Ues.value = LwgPlatform._Tpye.Bytedance;
        Laya.Stat.show();
        Laya.MouseManager.multiTouchEnabled = false;
        LwgSceneAni._Use.value = {
            class: LwgSceneAni._fadeOut.Open,
            type: null,
        };
        LwgClick._Use.value = LwgClick._Type.largen;
        LwgAdaptive._Use.value = [720, 120];
        LwgScene._SceneScript = [
            _PreLoad,
            _PreLoadCutIn,
            _Guide,
            _Parameter,
            Start,
            Levels,
            Defeated,
            Victory,
        ]
    }
    lwgOnStart(): void {
        this._openScene(_SceneName._PreLoad)
    }
}


