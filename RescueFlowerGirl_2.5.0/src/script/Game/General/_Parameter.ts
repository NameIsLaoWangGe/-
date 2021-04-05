import { LwgScene } from "../../Lwg/Lwg";
import { $Levels, $Parameter } from "./_GameGlobal";

export default class _Parameter extends LwgScene._SceneBase {
    lwgOnAwake(): void {
        this._TextInputVar('BgSpeed').text = $Parameter.Data.bgSpeed.toString();
        this._TextInputVar('EnemySpeed').text = $Parameter.Data.enemySpeed.toString();
    }
    lwgButton(): void {
        this._btnUp(this._ImgVar('BtnClose'), () => {
            $Parameter.Data.bgSpeed = Number(this._TextInputVar('BgSpeed').text);
            $Parameter.Data.enemySpeed = Number(this._TextInputVar('EnemySpeed').text);
            this._closeScene();
        })
        this._TextInputVar('BgSpeed').on(Laya.Event.BLUR, this, () => {
            $Parameter.Data.bgSpeed = Number(this._TextInputVar('BgSpeed').text);
        });

        this._TextInputVar('EnemySpeed').on(Laya.Event.BLUR, this, () => {
            $Parameter.Data.enemySpeed = Number(this._TextInputVar('EnemySpeed').text);
        });
    }
}