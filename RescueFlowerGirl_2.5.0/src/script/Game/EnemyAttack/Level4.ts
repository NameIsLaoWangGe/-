import { EnemyBullet } from "./EnemyBullet";
import { EnemyAttackBase } from "./EnemyAttackBase";
import { LwgNode } from "../../Lwg/Lwg";
import { Whom } from "../General/_GameInterface";

export class Level4 implements Whom {
    enemy(enemy: LwgNode.Image): void {
        EnemyAttackBase._fall(enemy, 50, 200, 5, 0, EnemyBullet.Type.three_Triangle);
    }
    land(enemy: LwgNode.Image): void {
        EnemyAttackBase._evenDowByCenter(enemy, 20, 3, 45, 12, 0, EnemyBullet.Type.three_Triangle);
        EnemyAttackBase._spiral(enemy, 3, 1, 11, 10, 0, EnemyBullet.Type.single);
    }
    house(enemy: LwgNode.Image): void {
        EnemyAttackBase._spiral(enemy, 3, 2, 11, 12, 0, EnemyBullet.Type.three_Triangle);
        EnemyAttackBase._evenDowByCenter(enemy, 20, 8, 30, 12, 0, EnemyBullet.Type.single);
    }
    boss(enemy: LwgNode.Image): void {
        EnemyAttackBase._evenDowByCenter(enemy, 20, 4, 30, 12, 0, EnemyBullet.Type.three_Triangle);
        EnemyAttackBase._annular(enemy, 30, 25, 8, 0, EnemyBullet.Type.single);
        EnemyAttackBase._annular(enemy, 30, 12, 8, 0, EnemyBullet.Type.single, 15);
    }
    heroine(enemy: LwgNode.Image): void {
        EnemyAttackBase._spiral(enemy, 3, 4, 11, 12, 0, EnemyBullet.Type.single, -100);
        EnemyAttackBase._evenDowByCenter(enemy, 20, 5, 30, 12, 0, EnemyBullet.Type.three_Triangle);
    }
}