import { Admin, Animation2D, Click, EventAdmin, TimerAdmin, Tools, _Gold, _SceneName } from "./Lwg";
import { _PreloadUrl } from "./_PreLoad";
import { _PropTry } from "./_PropTry";

/**游戏场景模块*/
export module _Game {
    export class _Data {

    }
    export function _init(): void {
    }
    export class Enemy extends Admin._Person {

    }
    export class Game extends Admin._SceneBase {
        lwgOnStart(): void {
            TimerAdmin._frameLoop(1, this, () => {
                this.ImgVar('LandContent').rotation += 0.1;
            })
            for (let index = 0; index < this.ImgVar('WeaponParent').numChildren; index++) {
                const element = this.ImgVar('WeaponParent').getChildAt(index) as Laya.Image;
                TimerAdmin._frameLoop(1, this, () => {
                    // let point = new Laya.Point(this.ImgVar('WeaponParent').x, this.ImgVar('WeaponParent').y);
                    let point = Tools.point_GetRoundPos(element.rotation += 0.1, this.ImgVar('WeaponParent').width / 2 - 50, new Laya.Point(this.ImgVar('WeaponParent').width / 2, this.ImgVar('WeaponParent').height / 2))
                    element.x = point.x;
                    element.y = point.y;
                })
            }

            for (let index = 0; index < this.ImgVar('EnemyParent').numChildren; index++) {
                const element = this.ImgVar('EnemyParent').getChildAt(index) as Laya.Image;
                let rotate = Tools.randomOneHalf() == 1 ? -0.5 : 0.5;
                TimerAdmin._frameLoop(1, this, () => {
                    let point = Tools.point_GetRoundPos(element.rotation += rotate, this.ImgVar('MobileFrame').width / 2, new Laya.Point(this.ImgVar('LandContent').width / 2, this.ImgVar('LandContent').height / 2))
                    element.x = point.x;
                    element.y = point.y;
                })
            }
        }
        lwgBtnClick(): void {
        }
    }
}
export default _Game.Game;



