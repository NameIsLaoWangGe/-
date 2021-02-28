import Lwg from "../../Lwg/Lwg";

export interface _Whom {
    /**
     *普通敌人 
     */
    enemy: (enemy: Lwg.NodeAdmin._Image) => void;
    /**
    *陆地
    */
    land: (enemy: Lwg.NodeAdmin._Image) => void;
    /**
     *房子
     */
    house: (enemy: Lwg.NodeAdmin._Image) => void;
    /**
     * boss
     */
    boss: (enemy: Lwg.NodeAdmin._Image) => void;

    /**
     * 女主角
     */
    heroine: (enemy: Lwg.NodeAdmin._Image) => void;
}