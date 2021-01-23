import { Admin, DataAdmin, TimerAdmin, Tools, _LwgInit } from "../Frame/Lwg";
import { _GameEvent } from "./_GameEvent";
import { _Res } from "../Frame/_PreLoad";
import BloodBase from "./BloodBase";
export class _BuffData extends DataAdmin._Table {
    private static ins: _BuffData;
    static _ins() {
        if (!this.ins) {
            this.ins = new _BuffData();
        }
        return this.ins;
    }
    type = {
        ballisticNum: 'ballisticNum',
    }
    /**
     * 创建一个buff
     * @param type 类型
     * @param Parent 父节点
     * @param x 坐标x
     * @param y 坐标y
     * */
    createBuff(type: number, Parent: Laya.Sprite, x: number, y: number): Laya.Image {
        const Buff = Tools._Node.createPrefab(_Res._list.prefab2D.Buff.prefab, Parent, [x, y]) as Laya.Image;
        Buff['buffType'] = type;
        Buff.addComponent(_Buff);
        return Buff;
    }
}
export default class _Buff extends Admin._ObjectBase {
    lwgOnStart(): void {
        this.checkHero();
    }
    checkHero(): void {
        TimerAdmin._frameLoop(1, this, () => {
            this._Owner.y += 5;
            !Tools._Node.leaveStage(this._Owner, () => {
                this._Owner.removeSelf();
            }) && Tools._Node.checkTwoDistance(this._Owner, this._SceneImg('Hero'), 60, () => {
                this._Owner.removeSelf();
                this._evNotify(_GameEvent.Game.checkBuff, [this._Owner['buffType']]);
            })
        })
    }
}
export class Tree extends BloodBase {
    lwgOnAwake(): void {
        this.bloodInit(20);
    }
    lwgEvent(): void {
        this._evReg(_GameEvent.Game.treeCheckWeapon, (Weapon: Laya.Image, numBlood: number) => {
            this.checkOtherRule(Weapon, 50, numBlood);
        })
        // this._evReg(_GameEvent.Game.treeBlood, (Tree: Laya.Sprite, num: number) => {
        //     this.subBlood(Tree, num, null, () => {
        //         _BuffData._ins().createBuff(0, this._Scene, this._gPoint.x, this._gPoint.y);
        //     })
        // })
    }
    deathFunc(): void {
        _BuffData._ins().createBuff(0, this._Scene, this._gPoint.x, this._gPoint.y);
    }
}