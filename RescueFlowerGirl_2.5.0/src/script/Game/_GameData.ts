import { DataAdmin, Tools } from "../Frame/Lwg";
import { _Res } from "../Frame/_PreLoad";

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
}