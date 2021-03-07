import Lwg, { LwgTimer, LwgTools } from "../../Lwg/Lwg";
import { _EnemyBullet } from "./_EnemyBullet";
import { _Whom } from "./_Whom";
import { _General } from "./_General";

export class Level6 implements _Whom {
    enemy(enemy: Lwg.NodeAdmin._Image): void {
        _General._fall(enemy, 50, 200, 5, 5, _EnemyBullet.Type.four_Square, 0, 0, null, { type: _General._ChildMoveType.childExplodebyAngle, delay: [60, 80] });
    }
    land(enemy: Lwg.NodeAdmin._Image): void {
        _General._slapDown(enemy, 1, 0, 180, 11, 10, 0, _EnemyBullet.Type.single);
        _General._assignAngle(enemy, 25, 135, 3, 4, 8, 0, _EnemyBullet.Type.single, 0, 200);
        _General._assignAngle(enemy, 25, 45, 3, 4, 8, 0, _EnemyBullet.Type.single, 0, -200);
    }
    house(enemy: Lwg.NodeAdmin._Image): void {
        _General._spiral(enemy, 5, 2, 11, 10, 5, _EnemyBullet.Type.three_Vertical);
        _General._assignAngle(enemy, 25, 115, 3, 4, 8, 0, _EnemyBullet.Type.two, 0, 200);
        _General._assignAngle(enemy, 25, 65, 3, 4, 8, 0, _EnemyBullet.Type.two, 0, -200);
    }
    boss(enemy: Lwg.NodeAdmin._Image): void {
        _General._evenDowByCenter(enemy, 20, 5, 30, 10, 5, _EnemyBullet.Type.three_Across);
        _General._assignAngle(enemy, 25, 115, 3, 4, 8, 0, _EnemyBullet.Type.single, 0, 200);
        _General._assignAngle(enemy, 25, 90, 3, 4, 8, 0, _EnemyBullet.Type.single, 0, 0);
        _General._assignAngle(enemy, 25, 65, 3, 4, 8, 0, _EnemyBullet.Type.single, 0, -200);
    }
    heroine(enemy: Lwg.NodeAdmin._Image): void {
        _General._spiral(enemy, 5, 3, 11, 10, 8, _EnemyBullet.Type.two);
        _General._assignAngle(enemy, 25, 135, 3, 4, 8, 0, _EnemyBullet.Type.single, 0, 200);
        _General._assignAngle(enemy, 25, 45, 3, 4, 8, 0, _EnemyBullet.Type.single, 0, -200);
        _General._assignAngle(enemy, 25, 100, 3, 4, 8, 0, _EnemyBullet.Type.single, 0, 100);
        _General._assignAngle(enemy, 25, 80, 3, 4, 8, 0, _EnemyBullet.Type.single, 0, -100);
    }
}