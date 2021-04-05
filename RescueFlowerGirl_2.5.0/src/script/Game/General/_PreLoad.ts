import { LwgPreLoad } from "../../Lwg/Lwg";
import { _Res } from "./_Res";
import { _SceneName } from "./_SceneName";
export default class _PreLoad extends LwgPreLoad._PreLoadScene {
    lwgOnAwake(): void {
    }
    lwgOnStart(): void {
        this.lwgStartLoding(_Res);
    }
    lwgStepComplete(): void {
    }
    lwgAllComplete(): number {
        this._openScene(_SceneName.Start);
        return 2000;
    }
    lwgOnDisable(): void {
    }
}


