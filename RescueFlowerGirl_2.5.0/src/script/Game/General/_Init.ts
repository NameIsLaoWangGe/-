import Start from "../Start";
import AdsHint from "../AdsHint";
import CheckIn from "../CheckIn";
import { LwgAdaptive, LwgAdmin, LwgClick, LwgPlatform, LwgScene, LwgSceneAni } from "../../Lwg/Lwg";
import Levels from "../Levels";
import Share from "../Share";
import _SubPkg from "../../Lwg/_SubPkg";
import _PreLoadCutIn from "./_PreLoadCutIn";
import _PreLoad from "./_PreLoad";
import _Guide from "./_Guide";
import Sweep from "../Sweep";
import Assembly, { Assembly_jixieliebao } from "../Assembly";
import Embattle from "../Embattle";
import Workshop from "../Workshop";
import Acquire from "../Acquire";
import _Parameter from "./_Parameter";
import { _SceneName } from "./_SceneName";

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
            AdsHint,
            CheckIn,
            Share,
            Sweep,
            Assembly,
            Assembly_jixieliebao,
            Embattle,
            Workshop,
            Acquire,
        ]
    }
    lwgOnStart(): void {
        if (TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.OPPO_AppRt) {
            let subPkg = new _SubPkg();
            subPkg.init();
            this._Owner.close();
        } else {
            this._openScene(_SceneName._PreLoad);
        }
        // new ZJADMgr();
    }
}


