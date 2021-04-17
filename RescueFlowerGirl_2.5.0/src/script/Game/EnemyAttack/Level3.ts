import { EnemyBullet } from "./EnemyBullet";
import { EnemyAttackBase } from "./EnemyAttackBase";
import { LwgNode } from "../../Lwg/Lwg";
import { Whom } from "../General/_GameInterface";

/**单个子弹攻击*/
export class Level3 implements Whom {
    enemy(enemy: LwgNode.Image): void {
        EnemyAttackBase._randomAngleDown(enemy, 50, 200, 12, 0, EnemyBullet.Type.single);
    }
    land(enemy: LwgNode.Image): void {
        EnemyAttackBase._spiral(enemy, 3, 1, 11, 12, 0, EnemyBullet.Type.single);
    }
    house(enemy: LwgNode.Image): void {
        EnemyAttackBase._spiral(enemy, 3, 3, 11, 12, 0, EnemyBullet.Type.single);
    }
    boss(enemy: LwgNode.Image): void {
        EnemyAttackBase._spiral(enemy, 3, 3, 11, 10, 0, EnemyBullet.Type.single);
        EnemyAttackBase._randomAngleDown(enemy, 3, 5, 12, 0, EnemyBullet.Type.single);
    }
    heroine(enemy: LwgNode.Image): void {
        EnemyAttackBase._spiral(enemy, 3, 3, 11, 10, 0, EnemyBullet.Type.single);
        EnemyAttackBase._annular(enemy, 20, 15, 12, 0, EnemyBullet.Type.single);
    }
}