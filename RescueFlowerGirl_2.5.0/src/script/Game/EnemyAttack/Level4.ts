import Lwg, { LwgTimer, LwgTools } from "../../Lwg/Lwg";
import { _CreateBullet } from "./_CreateBullet";
import { _Whom } from "./_Whom";
import { _General } from "./_General";

export class Level4 implements _Whom {
    enemy(enemy: Lwg.NodeAdmin._Image): void {
        _General._fall(enemy, 50, 200, 5, 0, _CreateBullet._bulletType.three_Triangle);
    }
    land(enemy: Lwg.NodeAdmin._Image): void {
        _General._evenDowByCenter(enemy, 20, 3, 45, 12, 0, _CreateBullet._bulletType.three_Triangle);
        _General._spiral(enemy, 3, 1, 11, 10, 0, _CreateBullet._bulletType.single);
    }
    house(enemy: Lwg.NodeAdmin._Image): void {
        _General._spiral(enemy, 3, 2, 11, 12, 0, _CreateBullet._bulletType.three_Triangle);
        _General._evenDowByCenter(enemy, 20, 8, 30, 12, 0, _CreateBullet._bulletType.single);
    }
    boss(enemy: Lwg.NodeAdmin._Image): void {
        _General._evenDowByCenter(enemy, 20, 4, 30, 12, 0, _CreateBullet._bulletType.three_Triangle);
        _General._annular(enemy, 30, 25, 8, 0, _CreateBullet._bulletType.single);
        _General._annular(enemy, 30, 12, 8, 0, _CreateBullet._bulletType.single, 15);
    }
    heroine(enemy: Lwg.NodeAdmin._Image): void {
        _General._spiral(enemy, 3, 4, 11, 12, 0, _CreateBullet._bulletType.single, -100);
        _General._evenDowByCenter(enemy, 20, 5, 30, 12, 0, _CreateBullet._bulletType.three_Triangle);
    }
}