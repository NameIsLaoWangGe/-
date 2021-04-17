import { EnemyBullet } from "./EnemyBullet";
import { EnemyAttackBase } from "./EnemyAttackBase";
import { LwgNode } from "../../Lwg/Lwg";
import { Whom } from "../General/_GameInterface";

export class Level6 implements Whom {
    enemy(enemy: LwgNode.Image): void {
        EnemyAttackBase._fall(enemy, 200, 200, 5, 0, EnemyBullet.Type.four_Square, 0, 0, null, { type: EnemyAttackBase.ChildMoveType.childStretch, delay: [1, 1] });
    }
    land(enemy: LwgNode.Image): void {
        EnemyAttackBase._slapDown(enemy, 1, 0, 180, 11, 10, 0, EnemyBullet.Type.single);
        EnemyAttackBase._assignAngle(enemy, 25, 135, 3, 4, 8, 0, EnemyBullet.Type.single, 0, 200);
        EnemyAttackBase._assignAngle(enemy, 25, 45, 3, 4, 8, 0, EnemyBullet.Type.single, 0, -200);
    }
    house(enemy: LwgNode.Image): void {
        EnemyAttackBase._spiral(enemy, 5, 2, 11, 10, 5, EnemyBullet.Type.three_Vertical);
        EnemyAttackBase._assignAngle(enemy, 25, 115, 3, 4, 8, 0, EnemyBullet.Type.two, 0, 200);
        EnemyAttackBase._assignAngle(enemy, 25, 65, 3, 4, 8, 0, EnemyBullet.Type.two, 0, -200);
    }
    boss(enemy: LwgNode.Image): void {
        EnemyAttackBase._evenDowByCenter(enemy, 20, 5, 30, 10, 5, EnemyBullet.Type.three_Across);
        EnemyAttackBase._assignAngle(enemy, 25, 115, 3, 4, 8, 0, EnemyBullet.Type.single, 0, 200);
        EnemyAttackBase._assignAngle(enemy, 25, 90, 3, 4, 8, 0, EnemyBullet.Type.single, 0, 0);
        EnemyAttackBase._assignAngle(enemy, 25, 65, 3, 4, 8, 0, EnemyBullet.Type.single, 0, -200);
    }
    heroine(enemy: LwgNode.Image): void {
        EnemyAttackBase._spiral(enemy, 5, 3, 11, 10, 8, EnemyBullet.Type.two);
        EnemyAttackBase._assignAngle(enemy, 25, 135, 3, 4, 8, 0, EnemyBullet.Type.single, 0, 200);
        EnemyAttackBase._assignAngle(enemy, 25, 45, 3, 4, 8, 0, EnemyBullet.Type.single, 0, -200);
        EnemyAttackBase._assignAngle(enemy, 25, 100, 3, 4, 8, 0, EnemyBullet.Type.single, 0, 100);
        EnemyAttackBase._assignAngle(enemy, 25, 80, 3, 4, 8, 0, EnemyBullet.Type.single, 0, -100);
    }
}