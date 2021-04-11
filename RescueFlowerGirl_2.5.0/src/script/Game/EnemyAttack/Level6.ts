import { _EnemyBullet } from "./_EnemyBullet";
import { _General } from "./_General";
import { LwgNode } from "../../Lwg/Lwg";
import { Whom } from "./_Whom";

export class Level6 implements Whom {
    enemy(enemy: LwgNode.Image): void {
        _General._fall(enemy, 200, 200, 5, 0, _EnemyBullet.Type.four_Square, 0, 0, null, { type: _General.ChildMoveType.childStretch, delay: [1, 1] });
    }
    land(enemy: LwgNode.Image): void {
        _General._slapDown(enemy, 1, 0, 180, 11, 10, 0, _EnemyBullet.Type.single);
        _General._assignAngle(enemy, 25, 135, 3, 4, 8, 0, _EnemyBullet.Type.single, 0, 200);
        _General._assignAngle(enemy, 25, 45, 3, 4, 8, 0, _EnemyBullet.Type.single, 0, -200);
    }
    house(enemy: LwgNode.Image): void {
        _General._spiral(enemy, 5, 2, 11, 10, 5, _EnemyBullet.Type.three_Vertical);
        _General._assignAngle(enemy, 25, 115, 3, 4, 8, 0, _EnemyBullet.Type.two, 0, 200);
        _General._assignAngle(enemy, 25, 65, 3, 4, 8, 0, _EnemyBullet.Type.two, 0, -200);
    }
    boss(enemy: LwgNode.Image): void {
        _General._evenDowByCenter(enemy, 20, 5, 30, 10, 5, _EnemyBullet.Type.three_Across);
        _General._assignAngle(enemy, 25, 115, 3, 4, 8, 0, _EnemyBullet.Type.single, 0, 200);
        _General._assignAngle(enemy, 25, 90, 3, 4, 8, 0, _EnemyBullet.Type.single, 0, 0);
        _General._assignAngle(enemy, 25, 65, 3, 4, 8, 0, _EnemyBullet.Type.single, 0, -200);
    }
    heroine(enemy: LwgNode.Image): void {
        _General._spiral(enemy, 5, 3, 11, 10, 8, _EnemyBullet.Type.two);
        _General._assignAngle(enemy, 25, 135, 3, 4, 8, 0, _EnemyBullet.Type.single, 0, 200);
        _General._assignAngle(enemy, 25, 45, 3, 4, 8, 0, _EnemyBullet.Type.single, 0, -200);
        _General._assignAngle(enemy, 25, 100, 3, 4, 8, 0, _EnemyBullet.Type.single, 0, 100);
        _General._assignAngle(enemy, 25, 80, 3, 4, 8, 0, _EnemyBullet.Type.single, 0, -100);
    }
}