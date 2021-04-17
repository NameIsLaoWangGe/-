import { EnemyBullet } from "./EnemyBullet";
import { EnemyAttackBase } from "./EnemyAttackBase";
import { LwgNode } from "../../Lwg/Lwg";
import { Whom } from "../General/_GameInterface";

export class Level5 implements Whom {
    enemy(enemy: LwgNode.Image): void {
        EnemyAttackBase._fall(enemy, 50, 200, 5, 5, EnemyBullet.Type.three_Across);
    }
    land(enemy: LwgNode.Image): void {
        EnemyAttackBase._spiral(enemy, 3, 1, 11, 10, 0, EnemyBullet.Type.two);
        EnemyAttackBase._evenDowByCenter(enemy, 25, 6, 45, 8, 3, EnemyBullet.Type.three_Vertical);
    }
    house(enemy: LwgNode.Image): void {
        EnemyAttackBase._spiral(enemy, 5, 2, 11, 10, 5, EnemyBullet.Type.three_Vertical);
        EnemyAttackBase._evenDowByCenter(enemy, 20, 8, 30, 12, 0, EnemyBullet.Type.single);
    }
    boss(enemy: LwgNode.Image): void {
        EnemyAttackBase._evenDowByCenter(enemy, 20, 2, 30, 10, 5, EnemyBullet.Type.three_Across);
        EnemyAttackBase._annular(enemy, 30, 10, 8, 5, EnemyBullet.Type.three_Vertical);
        EnemyAttackBase._annular(enemy, 30, 12, 8, 0, EnemyBullet.Type.two, 15);
    }
    heroine(enemy: LwgNode.Image): void {
        EnemyAttackBase._spiral(enemy, 5, 3, 11, 10, 8, EnemyBullet.Type.three_Across, -100);
        EnemyAttackBase._evenDowByCenter(enemy, 20, 5, 15, 12, 5, EnemyBullet.Type.two);
    }
}