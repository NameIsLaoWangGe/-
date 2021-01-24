import { Admin, DataAdmin, EventAdmin, Tools } from "../Frame/Lwg";
import { _Res } from "../Frame/_PreLoad";
import { Boss } from "./Boss";
import Enemy from "./Enemy";
import { _GameEvent } from "./_GameEvent";

export module _GameData {
    export class _Buff extends DataAdmin._Table {
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
        createBuff(type: number, Parent: Laya.Sprite, x: number, y: number, script: any): Laya.Image {
            const Buff = Tools._Node.createPrefab(_Res._list.prefab2D.Buff.prefab, Parent, [x, y], script) as Laya.Image;
            Buff['buffType'] = type;
            return Buff;
        }
    }

    export class _Enemy extends DataAdmin._Table {
        constructor(_Parent: Laya.Image) {
            super();
            this._arr = _Res._list.json.Enemy.dataArr;
            this.levelData = this._getObjByName(`level${Admin._game.level}`);
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
        createEnmey(): void {
            this.quantity--;
            const shellNum = this.levelData[this._otherPro.shellNum];
            let shellNumTime = 0;
            const element = Tools._Node.createPrefab(_Res._list.prefab2D.Enemy.prefab, this.Parent) as Laya.Image;
            shellNumTime++;
            const color = Tools._Array.randomGetOne(['blue', 'yellow', 'red']);
            element.name = `${color}${color}`;
            let speed = Tools._Number.randomOneBySection(this.levelData[this._otherPro.speed][0], this.levelData[this._otherPro.speed][1]);
            speed = Tools._Number.randomOneHalf() == 0 ? -speed : speed;
            element['_EnemyData'] = {
                shell: shellNumTime <= shellNum ? true : false,
                blood: this.levelData['blood'],
                angle: Tools._Number.randomOneBySection(0, 360),
                speed: speed,
                color: color,
            };
            element.addComponent(Enemy);
        }
    }
    export class _Boss extends DataAdmin._Table {
        constructor(Parent: Laya.Image) {
            super();
            this._arr = _Res._list.json.Boss.dataArr;
            this.levelData = this._getObjByName(`Boss${Admin._game.level}`);
            this.skills = this.levelData['skills'];
            this.speed = this.levelData['speed'];
            this.blood = this.levelData['blood'];
            this.createLevelBoss(Parent);
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
        createLevelBoss(Parent: Laya.Sprite): Laya.Sprite {
            const element = Tools._Node.createPrefab(_Res._list.prefab2D.Enemy.prefab, Parent) as Laya.Image;
            element.name = `Boss`;
            let speed = Tools._Number.randomOneBySection(this.speed[0], this.speed[1]);
            speed = Tools._Number.randomOneHalf() == 0 ? -speed : speed;
            element['_EnemyData'] = {
                blood: this.blood,
                angle: Tools._Number.randomOneBySection(0, 360),
                speed: speed,
                sikllNameArr: this.skills,
            };
            element.addComponent(Boss);
            return element;
        }
    }
}