export module _GameControl {
    /**剩余贴图的集合，游戏结束时一并销毁*/
    export const _texArr = [];
    /**箭的容器集合，这缓存为位图的bitmap节点，必须手动销毁*/
    export const _arrowParentArr = [];
}