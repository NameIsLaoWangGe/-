import ADManager, { TaT } from "../TJ/Admanager";
import ZJADMgr from "../TJ/ZJADMgr";
import { Admin, Click, EventAdmin, Platform, Tools, _SceneName } from "./Lwg";
import { _Game } from "./_Game";
import { _SelectLevel } from "./_SelectLevel";

export module _PropTry {
    export let _beforeTry: any;
    export class PropTryBase extends Admin._SceneBase {
        moduleOnAwake(): void {
        }
    }
    export class PropTry extends PropTryBase {
        lwgOnAwake(): void {
            ADManager.TAPoint(TaT.BtnShow, 'UIPropTry_BtnGet');
            Tools._Node.showExcludedChild2D(this._ImgVar('Platform'), [Platform._Ues.value], true);
            Tools._Node.showExcludedChild2D(this._ImgVar(Platform._Ues.value), ['High'], true);
            // if (Admin._platform.name == Admin._platform.tpye.Bytedance) {
            //     Tools._Node.showExcludedChild2D(this._ImgVar(Admin._platform.tpye.Bytedance), [ZJADMgr.ins.shieldLevel], true);
            // }
        }

        lwgOnEnable(): void {
            this._ImgVar('BtnClose').visible = false;
            Laya.timer.once(2000, this, () => {
                this._ImgVar('BtnClose').visible = true;
            })
        }

        lwgBtnRegister(): void {
            this._btnUp(this._ImgVar('Bytedance_Low_Select'), this.bytedanceSelectUp);
            this._btnUp(this._ImgVar('Bytedance_Low_BtnGet'), this.bytedanceGetUp);
            this._btnUp(this._ImgVar('Bytedance_Mid_Select'), this.bytedanceGetUp);
            this._btnUp(this._ImgVar('Bytedance_Mid_BtnGet'), this.bytedanceGetUp);
            this._btnUp(this._ImgVar('ClickBg'), this.clickBgtUp);
            this._btnUp(this._ImgVar('Bytedance_High_BtnGet'), this.bytedanceGetUp);
            var close = () => {
                let levelName = _SceneName.Game + '_' + _SelectLevel._data._pich.customs;
                this._openScene(levelName, true, () => {
                    if (!Admin._sceneControl[levelName].getComponent(_Game.Game)) {
                        Admin._sceneControl[levelName].addComponent(_Game.Game);
                    }
                });
                EventAdmin._notify(_SelectLevel._Event._SelectLevel_Close);
            }
            Click._on(Click._Type.largen, this._ImgVar('Bytedance_High_BtnNo'), this, null, null, () => {
                close();
            });
            Click._on(Click._Type.largen, this._ImgVar('OPPO_BtnNo'), this, null, null, () => {
                close();

            });
            Click._on(Click._Type.largen, this._ImgVar('OPPO_BtnGet'), this, null, null, () => {
                this.advFunc();
            });

            Click._on(Click._Type.largen, this._ImgVar('BtnClose'), this, null, null, () => {
                close();
            });
        }
        clickBgtUp(): void {
            if (Platform._Ues.value !== Platform._Ues.value) {
                return;
            }
            let Dot: Laya.Image;
            if (this._ImgVar('Low').visible) {
                Dot = this._ImgVar('Bytedance_Low_Dot');
            } else if (this._ImgVar('Mid').visible) {
                Dot = this._ImgVar('Bytedance_Mid_Dot');
            }
            if (!Dot) {
                return;
            }
            if (Dot.visible) {
                this.advFunc();
            } else {
                this._openScene(_SceneName.Game);
            }
        }

        bytedanceGetUp(e: Laya.Event): void {
            e.stopPropagation();
            this.advFunc();
        }

        bytedanceSelectUp(e: Laya.Event): void {
            e.stopPropagation();
            if (this._ImgVar('Low').visible) {
                if (!this._ImgVar('Low')['count']) {
                    this._ImgVar('Low')['count'] = 0;
                }
                this._ImgVar('Low')['count']++;
                if (this._ImgVar('Low')['count'] >= 4) {
                    if (this._ImgVar('Bytedance_Low_Dot').visible) {
                        this._ImgVar('Bytedance_Low_Dot').visible = false;
                    } else {
                        this._ImgVar('Bytedance_Low_Dot').visible = true;
                    }
                }
                if (ZJADMgr.ins.CheckPlayVideo()) {
                    ADManager.ShowReward(null);
                }
            } else if (this._ImgVar('Mid').visible) {
                if (!this._ImgVar('Mid')['count']) {
                    this._ImgVar('Mid')['count'] = 0;
                }
                this._ImgVar('Mid')['count']++;
                if (this._ImgVar('Mid')['count'] >= 4) {
                    if (this._ImgVar('Bytedance_Mid_Dot').visible) {
                        this._ImgVar('Bytedance_Mid_Dot').visible = false;
                    } else {
                        this._ImgVar('Bytedance_Mid_Dot').visible = true;
                    }
                }
            }
        }

        advFunc(): void {
            ADManager.ShowReward(() => {
                ADManager.TAPoint(TaT.BtnClick, 'UIPropTry_BtnGet');
            })
        }
    }
}
