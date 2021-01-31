import { LwgAdaptive, LwgScene, LwgClick, LwgPlatform, LwgSceneAni, LwgAdmin } from "./Lwg";
import SubPkg from "./SubPkg";
import PreLoad from "../Game/PreLoad";
import Start from "../Game/Start";
import Defeated from "../Game/Defeated";
import Victory from "../Game/Victory";
export default class LwgInit extends LwgAdmin._InitScene {
    lwgOnAwake(): void {
        LwgPlatform._Ues.value = LwgPlatform._Tpye.OPPOTest;
        Laya.Stat.show();
        Laya.MouseManager.multiTouchEnabled = false;
        LwgSceneAni._openSwitch.value = true;
        LwgSceneAni._Use.value = {
            class: LwgSceneAni._fadeOut.Open,
            type: null,
        };
        LwgClick._Use.value = LwgClick._Type.reduce;
        LwgAdaptive._Use.value = [1280, 720];
        LwgScene._SceneScript = {
            PreLoad: PreLoad,
            Start: Start,
            Defeated: Defeated,
            Victory: Victory,
        };
    }
    lwgOnStart(): void {
        this._openScene('PreLoad');
    }
}


