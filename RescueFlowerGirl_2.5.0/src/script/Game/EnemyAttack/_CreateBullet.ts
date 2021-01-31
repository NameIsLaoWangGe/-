import Lwg, { LwgTools } from "../../Lwg/Lwg";
import EnemyBullet from "../Role/EnemyBullet";
import { _Res } from "../_Res";

export class CreateBullet {
    static EBParent: Laya.Image;
    static create(enemy: Lwg.NodeAdmin._Image): Lwg.NodeAdmin._Image {
        const bullet = LwgTools._Node.createPrefab(_Res._list.prefab2D.EnemyBullet.prefab, this.EBParent, [enemy._lwg.gPoint.x, enemy._lwg.gPoint.y], EnemyBullet) as Lwg.NodeAdmin._Image;
        return bullet;
    }
}