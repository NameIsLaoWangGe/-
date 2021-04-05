import { LwgPreLoad } from "../../Lwg/Lwg";
import { _CutInRes } from "./_Res";

export default class _PreLoadCutIn extends LwgPreLoad._PreLoadCutInScene {
    lwgOpenAniAfter(): void {
        // this.lwgStartLoding(_CutInRes[this.$openName] ? _CutInRes[this.$openName] : {});
    }
    lwgAllComplete(): number {
        return 10;
    }
    lwgOnDisable(): void {
        
    }
}

