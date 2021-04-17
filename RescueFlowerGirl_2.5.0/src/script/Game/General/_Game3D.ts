import { LwgTimer, LwgTools } from "../../Lwg/Lwg";
import { _CutInRes, _Res } from "./_Res";
export class Game3D {
    private static ins: Game3D;
    aniName = {
        Stand: 'Stand',
        Pose1: 'Pose1',
        Pose2: 'Pose2',
        DispalyCloth: 'DispalyCloth',
        Walk: 'Walk',
    }
    static _ins() {
        if (!this.ins) {
            this.ins = new Game3D();
            Laya.stage.addChild(this.ins._Scene);
        }
        return this.ins;
    }
    _Scene: Laya.Scene3D;
    _MainCamara: Laya.Camera;
}

