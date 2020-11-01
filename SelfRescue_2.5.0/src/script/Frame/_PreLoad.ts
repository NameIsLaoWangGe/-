import { Admin, EventAdmin, _LwgPreLoad, _SceneName } from "./Lwg";
export module _PreloadUrl {
    export let _list = {
        // scene3D: {
        //     main3D: {
        //         url: "_Lwg3D/_Scene/LayaScene_GameMain/Conventional/GameMain.ls",
        //         scene: new Laya.Scene3D,
        //     },
        // },
        // prefab3D: {
        //     Level1: {
        //         url: '_Lwg3D/_Prefab/LayaScene_GameMain/Conventional/CardContainer.lh',
        //         prefab: new Laya.Sprite3D,
        //     }
        // },
        // pic2D: {
        //     // "res/atlas/Frame/Effects.png",
        //     // "res/atlas/Frame/UI.png",
        //     // "res/atlas/Game/UI/UISkinQualified.png",
        //     // "res/atlas/Game/UI/UIDrawCard/Card.png",
        // },
        // mesh3D: {},
        // material: {},
        prefab2D: {
            LwgGold: {
                url: 'Prefab/LwgGold.json',
                prefab: new Laya.Prefab,
            },
            PencilsList: {
                url: 'Prefab/PencilsList.json',
                prefab: new Laya.Prefab,
            },
            StepSwitch: {
                url: 'Prefab/StepSwitch.json',
                prefab: new Laya.Prefab,
            },
            BtnPlayAni: {
                url: 'Prefab/BtnPlayAni.json',
                prefab: new Laya.Prefab,
            },
            BtnCompelet: {
                url: 'Prefab/BtnCompelet.json',
                prefab: new Laya.Prefab,
            },
            BtnShare: {
                url: 'Prefab/BtnShare.json',
                prefab: new Laya.Prefab,
            },
        },
        texture: {
            star1: {
                url: 'Frame/Effects/hua4.png',
                texture: Laya.Texture,
            },
        },
        texture2D: {
            star1: {
                url: 'Frame/Effects/hua4.png',
                texture: Laya.Texture2D,
            },
        },
        /**通过直接获取场景的显示和打开，和scene关联，实现，先加载，然后直接切换*/
        scene2D: {
            UIStart: "Scene/" + _SceneName.Start + '.json',
            GameScene: "Scene/" + _SceneName.Game + '.json',
            UIPreLoad: "Scene/" + _SceneName.PreLoad + '.json',
        },
        json: {
            SingleColor: {
                url: "_LwgData" + "/_Game/SingleColor" + ".json",
                data: new Array,
            },
            Colours: {
                url: "_LwgData" + "/_Game/Colours" + ".json",
                data: new Array,
            },
            SelectLevel: {
                url: "_LwgData" + "/_SelectLevel/SelectLevel" + ".json",
                data: new Array,
            }
        },
        // skeleton: {
        //     test: {
        //         url: 'Game/Skeleton/test.sk',
        //         templet: new Laya.Templet,
        //     },
        // }
    }
}

export module _PreLoad {
    export class PreLoad extends _LwgPreLoad._PreLoadScene {
        lwgOnStart(): void {
            this.AniVar('ani1').play(0, false);
            this.AniVar('ani1').on(Laya.Event.LABEL, this, () => {
                EventAdmin._notify(_LwgPreLoad._Event.importList, (_PreloadUrl._list));
            })
        }
        lwgOpenAni(): number { return 1; }
        lwgStepComplete(): void {
        }
        lwgAllComplete(): number {
            return 1000;
        }
    }
}
export default PreLoad;


