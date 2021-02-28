import Lwg from "../Lwg/Lwg";

type scene3D = {} & Lwg.PreLoadAdmin.scene3D;
type texture2D = {} & Lwg.PreLoadAdmin.texture2D;
type scene2D = {} & Lwg.PreLoadAdmin.scene2D;
type prefab2D = {} & Lwg.PreLoadAdmin.prefab2D;
type json = {} & Lwg.PreLoadAdmin.json;

export module _Res {
    export class $scene3D {
    };
    export class $scene2D {
        // static Start: scene2D = { url: `Scene/${'Start'}.json` };
    };
    export class $prefab2D {
        static LwgGold: prefab2D = {
            url: 'Prefab/LwgGold.json',
            prefab2D: null as Laya.Prefab,
        }
        static Hero: prefab2D = {
            url: 'Prefab/Hero.json',
            prefab2D: null as Laya.Prefab,
        }
        static Weapon: prefab2D = {
            url: 'Prefab/Weapon.json',
            prefab2D: null as Laya.Prefab,
        }
        static Enemy: prefab2D = {
            url: 'Prefab/Enemy.json',
            prefab2D: null as Laya.Prefab,
        }
         
        /**
         * 单个子弹
         * @static 
         */
        static EB_single: prefab2D = {
            url: 'Prefab/EB_single.json',
            prefab2D: null as Laya.Prefab,
        }
        /**
         * 两个子弹
         * @static 
         */
        static EB_two: prefab2D = {
            url: 'Prefab/EB_two.json',
            prefab2D: null as Laya.Prefab,
        }
        /**
         * 三个子弹组成三角形
         * @static 
         */
        static EB_three_Triangle: prefab2D = {
            url: 'Prefab/EB_three_Triangle.json',
            prefab2D: null as Laya.Prefab, 
        }
        /**
         * 三个子弹横向排列
         * @static 
         */
        static EB_three_Across: prefab2D = {
            url: 'Prefab/EB_three_Across.json',
            prefab2D: null as Laya.Prefab,
        }
        /**
         * 三个子弹纵向排列
         * @static 
         */
        static EB_three_Vertical: prefab2D = {
            url: 'Prefab/EB_three_Vertical.json',
            prefab2D: null as Laya.Prefab,
        }

        static Boss: prefab2D = {
            url: 'Prefab/Boss.json',
            prefab2D: null as Laya.Prefab,
        }
        static Buff: prefab2D = {
            url: 'Prefab/Buff.json',
            prefab2D: null as Laya.Prefab,
        }
        static Heroine: prefab2D = {
            url: 'Prefab/Heroine.json',
            prefab2D: null as Laya.Prefab,
        }
    };
    export class $json {
        static Boss: json = {
            url: "_LwgData" + "/_Game/Boss" + ".json",
            dataArr: null as [],
        }
        static Enemy: json = {
            url: "_LwgData" + "/_Game/Enemy" + ".json",
            dataArr: null as [],
        }
        static HeroLevel: json = {
            url: "_LwgData" + "/_Game/HeroLevel" + ".json",
            dataArr: null as [],
        }
        static HeroType: json = {
            url: "_LwgData" + "/_Game/HeroType" + ".json",
            dataArr: null as [],
        }
    };
    export class $prefab3D {
    };
    export class $mesh3D {
    };
    export class $material { };
    export class $texture { };
    export class $pic2D { };
    export class $skeleton { };
    /**图片需要设置成不打包*/
    export class $effectTex2D { };
}

export module _CutInRes {
    export module Start {
    }
    export module MakePattern {
    }
    export module DressingRoom {
    }
}