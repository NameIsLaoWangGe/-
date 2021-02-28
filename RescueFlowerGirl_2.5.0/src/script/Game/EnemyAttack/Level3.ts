import Lwg, { LwgTimer, LwgTools } from "../../Lwg/Lwg";
import { _CreateBullet } from "./_CreateBullet";
import { _Whom } from "./_Whom";
import { _General } from "./_General";

/**单个子弹攻击*/
export class Level3 implements _Whom {
    enemy(enemy: Lwg.NodeAdmin._Image): void {
        _General._randomAngleDown(enemy, 50, 200, 12, 0, _CreateBullet._bulletType.single);
    }
    land(enemy: Lwg.NodeAdmin._Image): void {
        _General._spiral(enemy, 3, 1, 11, 12, 0, _CreateBullet._bulletType.single);
    }
    house(enemy: Lwg.NodeAdmin._Image): void {
        _General._spiral(enemy, 3, 3, 11, 12, 0, _CreateBullet._bulletType.single);
    }
    boss(enemy: Lwg.NodeAdmin._Image): void {
        _General._spiral(enemy, 3, 3, 11, 10, 0, _CreateBullet._bulletType.single);
        _General._randomAngleDown(enemy, 3, 5, 12, 0, _CreateBullet._bulletType.single);
    }
    heroine(enemy: Lwg.NodeAdmin._Image): void {
        _General._spiral(enemy, 3, 3, 11, 10, 0, _CreateBullet._bulletType.single);
        _General._annular(enemy, 20, 15, 12, 0, _CreateBullet._bulletType.single);
    }
}