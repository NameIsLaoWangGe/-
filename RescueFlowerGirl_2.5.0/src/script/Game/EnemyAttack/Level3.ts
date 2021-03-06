import Lwg, { LwgTimer, LwgTools } from "../../Lwg/Lwg";
import { _EnemyBullet } from "./_EnemyBullet";
import { _Whom } from "./_Whom";
import { _General } from "./_General";

/**单个子弹攻击*/
export class Level3 implements _Whom {
    enemy(enemy: Lwg.NodeAdmin._Image): void {
        _General._randomAngleDown(enemy, 50, 200, 12, 0, _EnemyBullet.Type.single);
    }
    land(enemy: Lwg.NodeAdmin._Image): void {
        _General._spiral(enemy, 3, 1, 11, 12, 0, _EnemyBullet.Type.single);
    }
    house(enemy: Lwg.NodeAdmin._Image): void {
        _General._spiral(enemy, 3, 3, 11, 12, 0, _EnemyBullet.Type.single);
    }
    boss(enemy: Lwg.NodeAdmin._Image): void {
        _General._spiral(enemy, 3, 3, 11, 10, 0, _EnemyBullet.Type.single);
        _General._randomAngleDown(enemy, 3, 5, 12, 0, _EnemyBullet.Type.single);
    }
    heroine(enemy: Lwg.NodeAdmin._Image): void {
        _General._spiral(enemy, 3, 3, 11, 10, 0, _EnemyBullet.Type.single);
        _General._annular(enemy, 20, 15, 12, 0, _EnemyBullet.Type.single);
    }
}