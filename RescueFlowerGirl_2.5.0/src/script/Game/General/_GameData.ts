import { LwgData, LwgGame, LwgNode, LwgTools } from "../../Lwg/Lwg";
import { _Res } from "./_Res";


export class BuffData extends LwgData.Table {
    private static ins: BuffData;
    static _ins() {
        if (!this.ins) {
            this.ins = new BuffData();
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
    createBuff(type: number, Parent: Laya.Sprite, x: number, y: number, script: any): LwgNode.Image {
        const Buff = LwgTools.Node.createPrefab(_Res.$prefab2D.Buff.prefab2D, Parent, [x, y], script);
        Buff['buffType'] = type;
        return Buff as LwgNode.Image;
    }
}
export class EnemyData extends LwgData.Table {
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
        const element = LwgTools.Node.createPrefab(_Res.$prefab2D.Enemy.prefab2D, this.Parent) as LwgNode.Image;
        shellNumTime++;
        const color = LwgTools._Array.randomGetOne(['blue', 'yellow', 'red']);
        element.name = `${color}${color}`;
        let speed = LwgTools.Num.randomOneBySection(this.levelData[this._otherPro.speed][0], this.levelData[this._otherPro.speed][1]);
        speed = LwgTools.Num.randomOneHalf() == 0 ? -speed : speed;
        element['_EnemyData'] = {
            shell: shellNumTime <= shellNum ? true : false,
            blood: this.levelData['blood'],
            angle: LwgTools.Num.randomOneBySection(0, 360),
            speed: speed,
            color: color,
        };
        element.addComponent(Script);
    }
}
export class BossData extends LwgData.Table {
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
        const element = LwgTools.Node.createPrefab(_Res.$prefab2D.Boss.prefab2D, Parent) as LwgNode.Image;
        element.name = `Boss`;
        let speed = LwgTools.Num.randomOneBySection(this.speed[0], this.speed[1]);
        speed = LwgTools.Num.randomOneHalf() == 0 ? -speed : speed;
        element['_EnemyData'] = {
            blood: this.blood,
            angle: LwgTools.Num.randomOneBySection(0, 360),
            speed: speed,
            sikllNameArr: this.skills,
        };
        element.addComponent(BossScript);
        return element;
    }
}