import { LwgNode } from "../../Lwg/Lwg";

export interface Whom {
    /**
     *普通敌人 
     */
    enemy: (enemy: LwgNode.Image) => void;
    /**
    *陆地
    */
    land: (enemy: LwgNode.Image) => void;
    /**
     *房子
     */
    house: (enemy: LwgNode.Image) => void;
    /**
     * boss
     */
    boss: (enemy: LwgNode.Image) => void;
    /**
     * 女主角
     */
    heroine: (enemy: LwgNode.Image) => void;
}