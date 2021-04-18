import { LwgPreLoad } from "../../Lwg/Lwg";
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

