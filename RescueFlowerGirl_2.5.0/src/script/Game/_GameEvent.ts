export module _GameEvent {
    export enum PreLoad {

    }
    export enum Guide {

    }
    export enum Game {
        checkEnemyBullet = '_Game_bulletCheckHero',
        closeScene = '_Game_closeScene',
        checkBuff = '_Game_checkBuff',

        //攻击检测
        treeCheckWeapon = '_Game_treeCheckWeapon',
        enemyCheckWeapon = '_Game_enemyCheckWeapon',
        enemyLandCheckWeapon = '_Game_enemyLandCheckWeapon',
        enemyHouseCheckWeapon = '_Game_enemyHouseCheckWeapon',
        bossCheckWeapon = '_Game_bossCheckWeapon',
        heroineCheckWeapon = '_Game_heroineCheckWeapon',

        // 阶段
        enemyStage = '_Game_enemyStage',
        enemyLandStage = '_Game_landStage',
        enemyHouseStage = '_Game_enemyHouseStage',
        bossStage = '_Game_bossStage',
        heroineStage = '_Game_heroineStage',
    }
    export enum Task {

    }
}