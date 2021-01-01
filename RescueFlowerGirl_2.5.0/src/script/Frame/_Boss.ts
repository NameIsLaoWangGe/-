import { Admin, DataAdmin, Effects2D, TimerAdmin, Tools } from "./Lwg";
import { _LwgEvent } from "./LwgEvent";
import { _Res } from "./_PreLoad";
import _Enemy from "./_Enemy";
import { BossBullet } from "./_BossBullet";
export module _Boss {
    export class _BossData extends DataAdmin._Table {
        private static ins: _BossData;
        static _ins() {
            if (!this.ins) {
                this.ins = new _BossData();
                this.ins._arr = _Res._list.json.Boss.dataArr;
                this.ins.levelData = this.ins._getObjByName(`Boss${Admin._game.level}`);
            }
            return this.ins;
        }
        constructor() {
            super();
            this._arr = _Res._list.json.Boss.dataArr;
        }
        _otherPro = {
            blood: 'blood',
            specials: 'specials',
            speed: 'speed',
            skills: 'skills',
            bulletPower: 'bulletPower',
        }
        levelData: any;
        getLevelSkill(): string[] {
            return this.levelData['skills'];
        }
        getLevelSpeed(): number[] {
            return this.levelData['speed'];
        }
        getLevelblood(): number {
            return this.levelData['blood'];
        }

        getOtherBossSkill(): any[] {
            return
        }
        createLevelBoss(Parent: Laya.Image): Laya.Image {
            const element = Tools._Node.createPrefab(_Res._list.prefab2D.Enemy.prefab, Parent) as Laya.Image;
            const color = Tools._Array.randomGetOne(['blue', 'yellow', 'red'])
            element.name = `${color}'Boss`;
            let speed = Tools._Number.randomOneBySection(_BossData._ins().getLevelSpeed()[0], _BossData._ins().getLevelSpeed()[1]);
            speed = Tools._Number.randomOneHalf() == 0 ? -speed : speed;
            console.log(speed);

            element['_EnemyData'] = {
                blood: _BossData._ins().getLevelblood(),
                angle: Tools._Number.randomOneBySection(0, 360),
                speed: speed,
                color: color,
                sikllNameArr: _BossData._ins().getLevelSkill(),
            };
            element.addComponent(Boss);
            return element;
        }
    }
    export class Boss extends _Enemy {
        lwgOnAwake(): void {
            this.generalProInit();
        }
        attack(): void {
            const num = 20;
            TimerAdmin._frameRandomLoop(100, 500, this, () => {
                for (let index = 0; index < num; index++) {
                    const bullet = Tools._Node.createPrefab(_Res._list.prefab2D.EnemyBullet.prefab) as Laya.Image;
                    this._SceneImg('EBparrent').addChild(bullet);
                    bullet.pos(this._gPoint.x, this._gPoint.y);
                    bullet.rotation = 360 / num * index;
                    bullet.addComponent(BossBullet);
                }
            })
        }
    }
}
