import ADManager, { TaT } from "../TJ/Admanager";
import ZJADMgr from "../TJ/ZJADMgr";
import { Admin, Click, EventAdmin, Tools, _SceneName } from "./Lwg";
import { _Game } from "./_Game";
import { _SelectLevel } from "./_SelectLevel";

export module _PropTry {
    export let _beforeTry: any;
    export class PropTryBase extends Admin._SceneBase {
        moduleOnAwake(): void {
            _beforeTry = _Game._Pencils.presentUse;
        }
    }
    export class PropTry extends PropTryBase {
        lwgOnAwake(): void {
            ADManager.TAPoint(TaT.BtnShow, 'UIPropTry_BtnGet');
            Tools.Node.showExcludedChild2D(this.ImgVar('Platform'), [Admin._platform.tpye.Bytedance], true);
            Tools.Node.showExcludedChild2D(this.ImgVar(Admin._platform.tpye.Bytedance), ['High'], true);
            // if (Admin._platform.name == Admin._platform.tpye.Bytedance) {
            //     Tools.Node.showExcludedChild2D(this.ImgVar(Admin._platform.tpye.Bytedance), [ZJADMgr.ins.shieldLevel], true);
            // }
        }

        lwgOnEnable(): void {
            this.ImgVar('BtnClose').visible = false;
            Laya.timer.once(2000, this, () => {
                this.ImgVar('BtnClose').visible = true;
            })
        }

        lwgBtnClick(): void {

            Click._on(Click._Type.noEffect, this.ImgVar('Bytedance_Low_Select'), this, null, null, this.bytedanceSelectUp);
            Click._on(Click._Type.largen, this.ImgVar('Bytedance_Low_BtnGet'), this, null, null, this.bytedanceGetUp);

            Click._on(Click._Type.noEffect, this.ImgVar('Bytedance_Mid_Select'), this, null, null, this.bytedanceSelectUp);
            Click._on(Click._Type.largen, this.ImgVar('Bytedance_Mid_BtnGet'), this, null, null, this.bytedanceGetUp);

            Click._on(Click._Type.noEffect, this.ImgVar('ClickBg'), this, null, null, this.clickBgtUp);
            Click._on(Click._Type.largen, this.ImgVar('Bytedance_High_BtnGet'), this, null, null, this.bytedanceGetUp);

            var close = () => {
                let levelName = _SceneName.Game + '_' + _SelectLevel._data._pich.customs;
                this.lwgOpenScene(levelName, true, () => {
                    if (!Admin._sceneControl[levelName].getComponent(_Game.Game)) {
                        Admin._sceneControl[levelName].addComponent(_Game.Game);
                    }
                });
                EventAdmin._notify(_SelectLevel._Event._SelectLevel_Close);
            }
            Click._on(Click._Type.largen, this.ImgVar('Bytedance_High_BtnNo'), this, null, null, () => {
                close();
            });
            Click._on(Click._Type.largen, this.ImgVar('OPPO_BtnNo'), this, null, null, () => {
                close();

            });
            Click._on(Click._Type.largen, this.ImgVar('OPPO_BtnGet'), this, null, null, () => {
                this.advFunc();
            });

            Click._on(Click._Type.largen, this.ImgVar('BtnClose'), this, null, null, () => {
                close();
            });
        }
        clickBgtUp(): void {
            if (Admin._platform.name !== Admin._platform.tpye.Bytedance) {
                return;
            }
            let Dot: Laya.Image;
            if (this.ImgVar('Low').visible) {
                Dot = this.ImgVar('Bytedance_Low_Dot');
            } else if (this.ImgVar('Mid').visible) {
                Dot = this.ImgVar('Bytedance_Mid_Dot');
            }
            if (!Dot) {
                return;
            }
            if (Dot.visible) {
                this.advFunc();
            } else {
                this.lwgOpenScene(_SceneName.Game);
            }
        }

        bytedanceGetUp(e: Laya.Event): void {
            e.stopPropagation();
            this.advFunc();
        }

        bytedanceSelectUp(e: Laya.Event): void {
            e.stopPropagation();
            if (this.ImgVar('Low').visible) {
                if (!this.ImgVar('Low')['count']) {
                    this.ImgVar('Low')['count'] = 0;
                }
                this.ImgVar('Low')['count']++;
                if (this.ImgVar('Low')['count'] >= 4) {
                    if (this.ImgVar('Bytedance_Low_Dot').visible) {
                        this.ImgVar('Bytedance_Low_Dot').visible = false;
                    } else {
                        this.ImgVar('Bytedance_Low_Dot').visible = true;
                    }
                }
                if (ZJADMgr.ins.CheckPlayVideo()) {
                    ADManager.ShowReward(null);
                }
            } else if (this.ImgVar('Mid').visible) {
                if (!this.ImgVar('Mid')['count']) {
                    this.ImgVar('Mid')['count'] = 0;
                }
                this.ImgVar('Mid')['count']++;
                if (this.ImgVar('Mid')['count'] >= 4) {
                    if (this.ImgVar('Bytedance_Mid_Dot').visible) {
                        this.ImgVar('Bytedance_Mid_Dot').visible = false;
                    } else {
                        this.ImgVar('Bytedance_Mid_Dot').visible = true;
                    }
                }
            }
        }

        advFunc(): void {
            ADManager.ShowReward(() => {
                ADManager.TAPoint(TaT.BtnClick, 'UIPropTry_BtnGet');
                _Game._Pencils.presentUse = _Game._Pencils.type.Colours;
            })
        }
    }
}
