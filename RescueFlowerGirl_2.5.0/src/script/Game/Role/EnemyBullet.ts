import { LwgScene, LwgTimer, LwgTools } from "../../Lwg/Lwg";
import { _Game } from "../_GameData";
export default class EnemyBullet extends LwgScene._ObjectBase {
    lwgOnStart(): void {
        this.checkHeroAndLevel();
    }
    checkHeroAndLevel(): void {
        LwgTimer._frameLoop(1, this, () => {
            !LwgTools._Node.leaveStage(this._Owner, () => {
                this._Owner.removeSelf();
            }) && this._evNotify(_Game._Event.checkEnemyBullet, [this._Owner, 1]);
        })
    }
}