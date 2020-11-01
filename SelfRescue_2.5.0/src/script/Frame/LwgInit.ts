import ZJADMgr from "../TJ/ZJADMgr";
import { Admin, DateAdmin, EventAdmin, Setting, _LwgInit, _LwgInitScene, _SceneName } from "./Lwg";
import { _Game } from "./_Game";
import { _Guide } from "./_Guide";
import { _PreLoad } from "./_PreLoad";
import { _PreLoadStep } from "./_PreLoadStep";
import { _PropTry } from "./_PropTry";
import { _SelectLevel } from "./_SelectLevel";
import { _Settle } from "./_Settle";
import { _Share } from "./_Share";
import { _Special } from "./_Special";
import { _Start } from "./_Start";
import { _Task } from "./_Task";
import { _Victory } from "./_Victory";

export default class LwgInit extends _LwgInitScene {
    lwgOnAwake(): void {
        _LwgInit._pkgInfo = [
            // { name: "sp1", root: "res" },
            // { name: "sp2", root: "3DScene" },
            // { name: "sp3", root: "3DPrefab" },
        ];
        Admin._platform.name = Admin._platform.tpye.General;
        Admin._sceneAnimation.presentAni = Admin._sceneAnimation.type.stickIn.upRightDownLeft;
        Setting._bgMusic.switch = false;
        Admin._moudel = {
            _PreLoad: _PreLoad,
            _PreLoadStep: _PreLoadStep,
            _Guide: _Guide,
            _Start: _Start,
            _Game: _Game,
            _Victory: _Victory,
            // _Task: _Task,
            // _SelectLevel: _SelectLevel,
            // _Settle: _Settle,
            // _Share: _Share,
            // _Special: _Special,
            // _PropTry: _PropTry,
        };
        // new ZJADMgr();
    }
}

