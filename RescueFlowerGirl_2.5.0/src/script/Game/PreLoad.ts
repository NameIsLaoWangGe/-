import { _Res } from "./_Res";
import { LwgPreLoad } from "../Lwg/Lwg";

export default class PreLoad extends LwgPreLoad._PreLoadScene {
    lwgOnStart(): void {
        this._evNotify(LwgPreLoad._Event.importList, [_Res._list]);
    }
    lwgOpenAni(): number { return 1; }
    lwgStepComplete(): void {
    }
    lwgAllComplete(): number {
        return 1000;
    }
}


