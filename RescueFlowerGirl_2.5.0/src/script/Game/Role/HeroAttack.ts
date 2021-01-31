import { LwgTools } from "../../Lwg/Lwg";
import { _Res } from "../_Res";
import { HeroWeapon } from "./HeroWeapon";

export class HeroAttack {
    constructor(_WeaponParent: Laya.Image, _Hero: Laya.Sprite) {
        this.WeaponParent = _WeaponParent;
        this.Hero = _Hero;
    }
    /**子弹父节点*/
    WeaponParent: Laya.Image;
    /**英雄*/
    Hero: Laya.Sprite;
    /**弹道数量*/
    ballisticNum = 1;
    /**创建一个子弹*/ 
    private createWeapon(style: string, x: number, y: number): Laya.Image {
        const Weapon = LwgTools._Node.createPrefab(_Res._list.prefab2D.Weapon.prefab) as Laya.Image;
        this.WeaponParent.addChild(Weapon);
        Weapon.addComponent(HeroWeapon);
        Weapon.pos(x, y);
        const Pic = Weapon.getChildByName('Pic') as Laya.Image;
        Pic.skin = style ? `Game/UI/Game/Hero/Hero_01_weapon_${style}.png` : `Lwg/UI/ui_circle_c_007.png`;
        Weapon.name = style;
        return Weapon;
    };
    private ballisticPos = [
        [[0, 0]],
        [[-20, 0], [20, 0]],
        [[-20, 0], [0, 0], [20, 0]],
        [[-30, 0], [-10, 0], [10, 0], [30, 0]],
        [[-40, 0], [-20, 0], [0, 0], [20, 0], [40, 0]],
        [[-50, 0], [-30, 0], [-10, 0], [10, 0], [30, 0], [50, 0]],
        [[-60, 0], [-40, 0], [-20, 0], [0, 0], [20, 0], [40, 0], [60, 0]],
    ]
    /**普通弹幕*/
    attack_General(): void {
        const posArr = this.ballisticPos[this.ballisticNum - 1];
        for (let index = 1; index < posArr.length; index++) {
            const pos = posArr[index];
            if (pos) {
                this.createWeapon(null, this.Hero.x + pos[0], this.Hero.y + pos[1]);
            }
        }
    }
    private attack_S_Angle = [
        [0],
        [-5, 5],
        [-10, 0, 10],
        [-15, -5, 5, 15],
        [-20, -10, 0, 10, 20],
        [-25, -15, -5, 5, 15, 25],
        [-30, -20, -10, 0, 10, 20, 30],
        [-35, -25, -15, 5, 5, 15, 25, 35],
    ];
    /**S型弹幕*/
    attack_S(): void {
        const angleArr = this.attack_S_Angle[this.ballisticNum - 1];
        for (let index = 0; index < angleArr.length; index++) {
            const weapon = this.createWeapon(null, this.Hero.x, this.Hero.y);
            weapon.rotation = angleArr[index];
        }
    }
}