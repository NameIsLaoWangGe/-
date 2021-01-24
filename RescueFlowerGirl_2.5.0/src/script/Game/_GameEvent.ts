export module _GameEvent {
    export enum PreLoad {

    }
    export enum Guide {

    }
    export enum Game {
        checkEnemyBullet = 'Game' + '_bulletCheckHero',
        closeScene = 'Game' + '_closeScene',
        checkBuff = 'Game' + 'checkBuff',

        //攻击检测
        treeCheckWeapon = 'Game' + 'treeCheckWeapon',
        enemyCheckWeapon = 'Game' + 'enemyCheckWeapon',
        enemyLandCheckWeapon = 'Game' + 'enemyLandCheckWeapon',
        enemyHouseCheckWeapon = 'Game' + 'enemyHouseCheckWeapon',
        bossCheckWeapon = 'Game' + 'bossCheckWeapon',
        heroineCheckWeapon = 'Game' + 'heroineCheckWeapon',

        // 阶段
        enemyStage = 'Game' + 'enemyStage',
        enemyLandStage = 'Game' + 'landStage',
        enemyHouseStage = 'Game' + 'enemyHouseStage',
        bossStage = 'Game' + 'bossStage',
        heroineStage = 'Game' + 'heroineStage',

        //敌人
        addEnemy = 'Game' + 'addEnemy',
    }
    export enum Task {

    }
}