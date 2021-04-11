import { _EnemyBullet } from "./_EnemyBullet";
import { _General } from "./_General";
import { LwgNode } from "../../Lwg/Lwg";
import { Whom } from "./_Whom";

/**单个子弹攻击*/
export class Level3 implements Whom {
    enemy(enemy: LwgNode.Image): void {
        _General._randomAngleDown(enemy, 50, 200, 12, 0, _EnemyBullet.Type.single);
    }
    land(enemy: LwgNode.Image): void {
        _General._spiral(enemy, 3, 1, 11, 12, 0, _EnemyBullet.Type.single);
    }
    house(enemy: LwgNode.Image): void {
        _General._spiral(enemy, 3, 3, 11, 12, 0, _EnemyBullet.Type.single);
    }
    boss(enemy: LwgNode.Image): void {
        _General._spiral(enemy, 3, 3, 11, 10, 0, _EnemyBullet.Type.single);
        _General._randomAngleDown(enemy, 3, 5, 12, 0, _EnemyBullet.Type.single);
    }
    heroine(enemy: LwgNode.Image): void {
        _General._spiral(enemy, 3, 3, 11, 10, 0, _EnemyBullet.Type.single);
        _General._annular(enemy, 20, 15, 12, 0, _EnemyBullet.Type.single);
    }
}