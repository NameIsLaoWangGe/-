import { Adaptive, Admin, Click, Platform, SceneAnimation, _LwgInit, _LwgInitScene } from "./Lwg";
import { _Game } from "./_Game";
import { _Guide } from "./_Guide";
import { _PreLoad } from "./_PreLoad";
import { _PreLoadCutIn } from "./_PreLoadCutIn";
import { _Start } from "./_Start";
import { _Victory } from "./_Victory";
export default class LwgInit extends _LwgInitScene {
    lwgOnAwake(): void {

        _LwgInit._pkgInfo = [
            // { name: "sp1", root: "res" },
            // { name: "sp2", root: "3DScene" },
            // { name: "sp3", root: "3DPrefab" },
        ];

        Platform._Ues.value = Platform._Tpye.Web;
        Laya.Stat.show();
        SceneAnimation._Use.value = SceneAnimation._Type.shutters.randomshutters;
        SceneAnimation._closeSwitch = true;
        SceneAnimation._openSwitch = false;

        Click._Use.value = Click._Type.reduce;
        Adaptive._Use.value = [1280, 720];
        Admin._GuideControl.switch = false;
        Admin._Moudel = {
            _PreLoad: _PreLoad,
            _PreLoadCutIn: _PreLoadCutIn,
            _Guide: _Guide,
            _Start: _Start,
            _Game: _Game,
            // _Settle: _Settle,
            _Victory: _Victory,
            // _Share: _Share,
            // _Special: _Special,
            // _PropTry: _PropTry,
            // _AdsHint: _AdsHint,
            // _Compound: _Compound,
        };
        // new ZJADMgr();
    }
}


