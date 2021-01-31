export module _Res {
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
                prefab: null as Laya.Prefab,
            },
            Hero: {
                url: 'Prefab/Hero.json',
                prefab: null as Laya.Prefab,
            },
            Weapon: {
                url: 'Prefab/Weapon.json',
                prefab: null as Laya.Prefab,
            },
            Enemy: {
                url: 'Prefab/Enemy.json',
                prefab: null as Laya.Prefab,
            },
            EnemyBullet: {
                url: 'Prefab/EnemyBullet.json',
                prefab: null as Laya.Prefab,
            },
            Boss: {
                url: 'Prefab/Boss.json',
                prefab: null as Laya.Prefab,
            },
            Buff: {
                url: 'Prefab/Buff.json',
                prefab: null as Laya.Prefab,
            },
            Heroine: {
                url: 'Prefab/Heroine.json',
                prefab: null as Laya.Prefab,
            }
        },
        // texture: {
        //     star1: {
        //         url: 'Frame/Effects/hua4.png',
        //         texture: Laya.Texture,
        //     },
        // },
        // texture2D: {
        //     star1: {
        //         url: 'Frame/Effects/hua4.png',
        //         texture: Laya.Texture2D,
        //     },
        // },
        scene2D: {
            UIStart: "Scene/" + 'Start' + '.json',
            GameScene: "Scene/" + 'Game' + '.json',
        },
        json: {
            Boss: {
                url: "_LwgData" + "/_Game/Boss" + ".json",
                dataArr: null as any[],
            },
            Enemy: {
                url: "_LwgData" + "/_Game/Enemy" + ".json",
                dataArr: null as any[],
            },
            HeroLevel: {
                url: "_LwgData" + "/_Game/HeroLevel" + ".json",
                dataArr: null as any[],
            },
            HeroType: {
                url: "_LwgData" + "/_Game/HeroType" + ".json",
                dataArr: null as any[],
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
