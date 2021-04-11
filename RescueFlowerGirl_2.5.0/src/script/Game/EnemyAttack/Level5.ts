import { _EnemyBullet } from "./_EnemyBullet";
import { _General } from "./_General";
import { LwgNode } from "../../Lwg/Lwg";
import { Whom } from "./_Whom";

export class Level5 implements Whom {
    enemy(enemy: LwgNode.Image): void {
        _General._fall(enemy, 50, 200, 5, 5, _EnemyBullet.Type.three_Across);
    }
    land(enemy: LwgNode.Image): void {
        _General._spiral(enemy, 3, 1, 11, 10, 0, _EnemyBullet.Type.two);
        _General._evenDowByCenter(enemy, 25, 6, 45, 8, 3, _EnemyBullet.Type.three_Vertical);
    }
    house(enemy: LwgNode.Image): void {
        _General._spiral(enemy, 5, 2, 11, 10, 5, _EnemyBullet.Type.three_Vertical);
        _General._evenDowByCenter(enemy, 20, 8, 30, 12, 0, _EnemyBullet.Type.single);
    }
    boss(enemy: LwgNode.Image): void {
        _General._evenDowByCenter(enemy, 20, 2, 30, 10, 5, _EnemyBullet.Type.three_Across);
        _General._annular(enemy, 30, 10, 8, 5, _EnemyBullet.Type.three_Vertical);
        _General._annular(enemy, 30, 12, 8, 0, _EnemyBullet.Type.two, 15);
    }
    heroine(enemy: LwgNode.Image): void {
        _General._spiral(enemy, 5, 3, 11, 10, 8, _EnemyBullet.Type.three_Across, -100);
        _General._evenDowByCenter(enemy, 20, 5, 15, 12, 5, _EnemyBullet.Type.two);
    }
}