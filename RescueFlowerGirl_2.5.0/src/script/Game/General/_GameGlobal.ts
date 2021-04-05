import Lwg, { LwgData, LwgGame, LwgTools } from "../../Lwg/Lwg";
import { _Res } from "./_Res";

export module $Guide {
    export enum Event { }
    export enum Data { }
}

export module _Game {
    export enum _Event {
        checkEnemyBullet = 'Game' + '_bulletCheckHero',
        closeScene = 'Game' + '_closeScene',
        checkBuff = 'Game' + 'checkBuff',

        //攻击检测
        treeCheckWeapon = 'Game' + 'treeCheckWeapon',
        enemyCheckWeapon = 'Game' + 'enemyCheckWeapon',
        enemyLandCheckWeapon = 'Game' + 'enemyLandCheckWeapon',
        enemyHouseCheckWeapon = 'Game' + 'enemyHouseCheckWeapon',
        bossCheckWeapon = 'Game' + 'bossCheckWeapon',
        heroineCheckWeapon = 'Game' + 'heroineCheckWeapon',

        // 阶段
        enemyStage = 'Game' + 'enemyStage',
        enemyLandStage = 'Game' + 'landStage',
        enemyHouseStage = 'Game' + 'enemyHouseStage',
        bossStage = 'Game' + 'bossStage',
        heroineStage = 'Game' + 'heroineStage',

        //敌人
        addEnemy = 'Game' + 'addEnemy',
    }
    /**剩余贴图的集合，游戏结束时一并销毁*/
    export let _texArr = [];
    /**箭的容器集合，这缓存为位图的bitmap节点，必须手动销毁*/
    export let _arrowParentArr = [];
}
export module _Role {
    export class _Buff extends LwgData._Table {
        private static ins: _Buff;
        static _ins() {
            if (!this.ins) {
                this.ins = new _Buff();
            }
            return this.ins;
        }
        type = {
            Num: 'Num',
            S: 'S',
        }
        /**
         * 创建一个buff
         * @param type 类型
         * @param Parent 父节点
         * @param x 坐标x
         * @param y 坐标y
         * */
        createBuff(type: number, Parent: Laya.Sprite, x: number, y: number, script: any): Lwg.NodeAdmin._Image {
            const Buff = LwgTools._Node.createPrefab(_Res.$prefab2D.Buff.prefab2D, Parent, [x, y], script);
            Buff['buffType'] = type;
            return Buff as Lwg.NodeAdmin._Image;
        }
    }
    export class _Enemy extends LwgData._Table {
        constructor(_Parent: Laya.Image) {
            super();
            this._arr = _Res.$json.Enemy.dataArr;
            this.levelData = this._getObjByName(`level${LwgGame.level.value}`);
            this.quantity = this.levelData['quantity'];
            this.Parent = _Parent;
        }
        _otherPro = {
            quantity: "quantity",
            shellNum: "shellNum",
            blood: 'blood',
            boss: 'boss',
            speed: 'speed',
        }
        Parent: Laya.Image;
        levelData: any;
        /**剩余可创建怪物数量，初始化时也是本关敌人总数*/
        quantity: number;
        /**当前有头盔的怪物数量*/
        shellNum: number;
        createEnmey(Script: any): void {
            this.quantity--;
            const shellNum = this.levelData[this._otherPro.shellNum];
            let shellNumTime = 0;
            const element = LwgTools._Node.createPrefab(_Res.$prefab2D.Enemy.prefab2D, this.Parent) as Lwg.NodeAdmin._Image;
            shellNumTime++;
            const color = LwgTools._Array.randomGetOne(['blue', 'yellow', 'red']);
            element.name = `${color}${color}`;
            let speed = LwgTools._Number.randomOneBySection(this.levelData[this._otherPro.speed][0], this.levelData[this._otherPro.speed][1]);
            speed = LwgTools._Number.randomOneHalf() == 0 ? -speed : speed;
            element['_EnemyData'] = {
                shell: shellNumTime <= shellNum ? true : false,
                blood: this.levelData['blood'],
                angle: LwgTools._Number.randomOneBySection(0, 360),
                speed: speed,
                color: color,
            };
            element.addComponent(Script);
        }
    }
    export class _Boss extends LwgData._Table {
        constructor(Parent: Laya.Image, BossScript: any) {
            super();
            this._arr = _Res.$json.Boss.dataArr;
            this.levelData = this._getObjByName(`Boss${LwgGame.level.value}`);
            this.skills = this.levelData['skills'];
            this.speed = this.levelData['speed'];
            this.blood = this.levelData['blood'];
            this.createLevelBoss(Parent, BossScript);
        }
        _otherPro = {
            blood: 'blood',
            specials: 'specials',
            speed: 'speed',
            skills: 'skills',
            bulletPower: 'bulletPower',
        }
        levelData: any;
        skills: string[];
        speed: number[];
        blood: number;
        createLevelBoss(Parent: Laya.Image, BossScript: any): Laya.Sprite {
            const element = LwgTools._Node.createPrefab(_Res.$prefab2D.Boss.prefab2D, Parent) as Lwg.NodeAdmin._Image;
            element.name = `Boss`;
            let speed = LwgTools._Number.randomOneBySection(this.speed[0], this.speed[1]);
            speed = LwgTools._Number.randomOneHalf() == 0 ? -speed : speed;
            element['_EnemyData'] = {
                blood: this.blood,
                angle: LwgTools._Number.randomOneBySection(0, 360),
                speed: speed,
                sikllNameArr: this.skills,
            };
            element.addComponent(BossScript);
            return element;
        }
    }
}