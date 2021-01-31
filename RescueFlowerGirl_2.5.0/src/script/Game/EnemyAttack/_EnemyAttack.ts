import Lwg from "../../Lwg/Lwg";
import { Sector } from "./Sector";
export interface _Whom {
    enemy: (enemy: Lwg.NodeAdmin._Image) => void;
    boss: (enemy: Lwg.NodeAdmin._Image) => void;
    enemyLand: (enemy: Lwg.NodeAdmin._Image) => void;
    heroine: (enemy: Lwg.NodeAdmin._Image) => void;
}
export class _EnemyAttack {
    static Sector = Sector;
}