import { Admin, DataAdmin, Effects2D, TimerAdmin, Tools } from "../Frame/Lwg";
import { _LwgEvent } from "../Frame/LwgEvent";
import { _Res } from "../Frame/_PreLoad";
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
        createLevelBoss(Parent: Laya.Sprite): Laya.Sprite {
            const element = Tools._Node.createPrefab(_Res._list.prefab2D.Enemy.prefab, Parent) as Laya.Image;
            element.name = `Boss`;
            let speed = Tools._Number.randomOneBySection(_BossData._ins().getLevelSpeed()[0], _BossData._ins().getLevelSpeed()[1]);
            speed = Tools._Number.randomOneHalf() == 0 ? -speed : speed;
            element['_EnemyData'] = {
                blood: _BossData._ins().getLevelblood(),
                angle: Tools._Number.randomOneBySection(0, 360),
                speed: speed,
                sikllNameArr: _BossData._ins().getLevelSkill(),
            };
            element.addComponent(Boss);
            return element;
        }
    }
    export class Boss extends _Enemy {
        lwgOnAwake(): void {
            this.generalProInit();
            this._Owner.pos(this._SceneImg('Content').x, this._SceneImg('Content').y);
            this._Owner.rotation = 0;
            this._SceneImg('Content').removeSelf();
            this.bloodInit(this._Owner['_EnemyData']['blood']);
        }
        lwgOnStart(): void {
            this.attack();
            this.move();
        }
        move(): void {
            let dir = 'left';
            TimerAdmin._frameLoop(1, this, () => {
                if (dir == 'right') {
                    this._Owner.x++;
                    if (this._Owner.x > Laya.stage.width - 100) {
                        dir = 'left';
                    }
                } else {
                    this._Owner.x--;
                    if (this._Owner.x < 100) {
                        dir = 'right';
                    }
                }
            })
        }
        appear(): void {

        }
        attack(): void {
            let time = 0;
            const num = 20;
            TimerAdmin._frameRandomLoop(50, 100, this, () => {
                time++;
                for (let index = 0; index < num; index++) {
                    const bullet = Tools._Node.createPrefab(_Res._list.prefab2D.EnemyBullet.prefab) as Laya.Image;
                    this._SceneImg('EBparrent').addChild(bullet);
                    bullet.pos(this._gPoint.x, this._gPoint.y);
                    bullet.rotation = 360 / num * index + time * 10;
                    bullet.addComponent(BossBullet);
                }
            }, true);
        }
    }
}
