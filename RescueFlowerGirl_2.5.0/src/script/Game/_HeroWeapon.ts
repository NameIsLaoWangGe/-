import { Admin, TimerAdmin, Tools } from "../Frame/Lwg";
import { _LwgEvent } from "../Frame/LwgEvent";
import { _BuffData } from "./_Buff";
import { _Game } from "./_Game";

export class _HeroWeapon extends Admin._ObjectBase {
    launchAcc: number = 0;
    dropAcc: number = 0;
    Pic: Laya.Image;
    get state(): string {
        return this['Statevalue'] ? this['Statevalue'] : 'launch';
    };
    set state(_state: string) {
        this['Statevalue'] = _state;
    };
    stateType = {
        launch: 'launch',
        free: 'free',
    }
    getSpeed(): number {
        return 20 + 0.1;
    }
    getDropSpeed(): number {
        return this.dropAcc += 0.5;
    }
    lwgOnAwake(): void {
        this.Pic = this._Owner.getChildByName('Pic') as Laya.Image;
        TimerAdmin._frameLoop(1, this, () => {
            this.move();
        })
    }
    move(): void {
        if (this.getSpeed() > 0) {
            let p = Tools._Point.angleAndLenByPoint(this._Owner.rotation - 90, this.getSpeed()); this._Owner.x += p.x;
            this._Owner.y += p.y;
        } else {
            this._Owner.y += this.getDropSpeed();
        }
        const leave = Tools._Node.leaveStage(this._Owner, () => {
            this._Owner.destroy();
        })
        // 如果到了打boss的时候，则不会
        if (!leave) {
            if (!this._SceneImg('Content').parent) {
                this.checkBoss();
            } else {
                this.checkEnemy();
            }
        }
    }
    checkBoss(): void {
        for (let index = 0; index < this._SceneImg('BossParent').numChildren; index++) {
            const Enemy = this._SceneImg('BossParent').getChildAt(index) as Laya.Image;
            if (this.displayArrow(Enemy, 50)) {
                // 通过倾斜角度计算是否可以打到，有头盔的在头向下的时候打不到
                return;
            }
        }
    }
    drop(): void {
        this.state = this.stateType.free;
        Laya.timer.clearAll(this);
        TimerAdmin._frameLoop(1, this, () => {
            this._Owner.y += 40;
            this._Owner.rotation += 10;
            Tools._Node.leaveStage(this._Owner, () => {
                this._Owner.destroy();
            });
        })
    }

    displayArrow(Ele: Laya.Sprite, dis: number): boolean {
        const EleParent = Ele.parent as Laya.Sprite;
        const elementGP = EleParent.localToGlobal(new Laya.Point(Ele.x, Ele.y));
        if (elementGP.distance(this._gPoint.x, this._gPoint.y) < dis) {
            this.state = this.stateType.free;
            Laya.timer.clearAll(this);
            const lP = Ele.globalToLocal(this._gPoint);
            // let ArrowParent: Laya.Sprite;
            // const ran = Tools._Number.randomOneInt(0, 1);
            // if (ran == 0) {
            //     ArrowParent = Ele.getChildByName('ArrowParentF') as Laya.Sprite;
            //     if (!ArrowParent) {
            //         ArrowParent = new Laya.Sprite;
            //         ArrowParent.name = 'ArrowParentF';
            //         Ele.addChild(ArrowParent);
            //         ArrowParent.size(Ele.width, Ele.height);
            //         // ArrowParent.cacheAs = "bitmap";
            //         ArrowParent.zOrder = 5;
            //         _Game._arrowParentArr.push(ArrowParent);
            //     }
            // } else {
            //     ArrowParent = Ele.getChildByName('ArrowParentR') as Laya.Sprite;
            //     if (!ArrowParent) {
            //         ArrowParent = new Laya.Sprite;
            //         ArrowParent.name = 'ArrowParentR';
            //         Ele.addChild(ArrowParent);
            //         ArrowParent.size(Ele.width, Ele.height);
            //         // ArrowParent.cacheAs = "bitmap";
            //         ArrowParent.zOrder = -5;
            //         _Game._arrowParentArr.push(ArrowParent);
            //     }
            // }
            Ele.addChild(this._Owner);
            this._Owner.pos(lP.x, lP.y);
            if (EleParent == this._SceneImg('Land') || EleParent == this._SceneImg('MiddleScenery') || EleParent == this._SceneImg('EnemyParent')) {
                this._Owner.rotation -= Ele.rotation;
                this._Owner.rotation -= this._SceneImg('Land').rotation;
            } else if (EleParent == this._SceneImg('Land')) {
                this._Owner.rotation -= Ele.rotation;
            }
            this.Pic = this._Owner.getChildByName('Pic') as Laya.Image;
            const mask = new Laya.Sprite;
            mask.size(200, 300);
            mask.loadImage('Lwg/UI/ui_l_orthogon_white.png');
            this._Owner.mask = mask;
            this.Pic.pos(0, -Tools._Number.randomOneBySection(30));
            mask.pos(0, Tools._Number.randomOneBySection(20, 30));
            // 绘制贴图后删除，减少节点数量
            // if (ArrowParent.numChildren > 20) {
            //     const tex = ArrowParent.drawToTexture(ArrowParent.width, ArrowParent.height, 0, 0) as Laya.Texture;
            //     ArrowParent.texture && ArrowParent.texture.destroy(true);
            //     ArrowParent.texture = tex;
            //     for (let index = 0; index < ArrowParent.numChildren; index++) {
            //         const element = ArrowParent.getChildAt(index) as Laya.Image;
            //         element.destroy(true);
            //         index--;
            //     }
            //     _Game._texArr.push(tex);
            // }
            if (Ele.name == 'Tree') {
                // 通过移动图片的位置，表现每支箭的力度略有差别
                this._evNotify(_LwgEvent.Game.treeBlood, [Ele, 1]);
            } else if (EleParent.name == 'EnemyParent' || EleParent.name == 'BossParent') {
                if (this._Owner) {
                    this.Pic.pos(0, -Tools._Number.randomOneBySection(30, 50));
                    mask.pos(0, Tools._Number.randomOneBySection(5, 10));
                }
                this._evNotify(_LwgEvent.Game.enemyBlood, [Ele, 1]);
            }
            Laya.timer.once(200, this, () => {
                this._Owner.destroy();
            })
            return true;
        }
    }

    checkEnemy(): void {
        if (this.state == this.stateType.free) {
            return;
        }
        // 检测树，先检测前景树，然后检测后景树，后景树一般矮于前景树，否则这一步穿帮，树一定高于敌人，且不能过多，否则影响效率
        for (let index = 0; index < this._SceneImg('MiddleScenery').numChildren; index++) {
            const element = this._SceneImg('MiddleScenery').getChildAt(index) as Laya.Image;
            if (element.name == 'Tree') {
                if (this.displayArrow(element, 30)) {
                    return;
                }
            }
        }
        // 先判断有没有石头，然后再for循环，减少内存开销
        if (this._SceneImg('FrontScenery').getChildByName('Stone')) {
            for (let index = 0; index < this._SceneImg('FrontScenery').numChildren; index++) {
                const element = this._SceneImg('FrontScenery').getChildAt(index) as Laya.Image;
                if (element.name == 'Stone') {
                    let gPStone = this._SceneImg('FrontScenery').localToGlobal(new Laya.Point(element.x, element.y))
                    if (gPStone.distance(this._gPoint.x, this._gPoint.y) < 30) {
                        this.drop();
                        return;
                    }
                }
            }
        }
        for (let index = 0; index < this._SceneImg('EnemyParent').numChildren; index++) {
            const Enemy = this._SceneImg('EnemyParent').getChildAt(index) as Laya.Image;
            let gPEnemy = this._SceneImg('EnemyParent').localToGlobal(new Laya.Point(Enemy.x, Enemy.y));
            if (gPEnemy.distance(this._gPoint.x, this._gPoint.y) < 20) {
                // 通过倾斜角度计算是否可以打到，有头盔的在头向下的时候打不到
                let Shell = Enemy.getChildByName('Shell') as Laya.Image;
                if (Shell) {
                    const landContentGP = this._SceneImg('Content').localToGlobal(new Laya.Point(this._SceneImg('Land').x, this._SceneImg('Land').y));
                    let angle = Tools._Point.pointByAngle(landContentGP.x - this._gPoint.x, landContentGP.y - this._gPoint.y) + 90;
                    if (210 < angle && angle < 330) {
                        this.drop();
                    } else {
                        this.displayArrow(Enemy, 50);
                    }
                } else {
                    this.displayArrow(Enemy, 50);
                }
                return;
            }
        }
        this.checkLand();
    }
    //什么都没有打中时，会停在地面上，不会穿透地面
    checkLand(): void {
        // 动态创建中后景地面
        let Ground: Laya.Image;
        const ran = Tools._Number.randomOneInt(0, 2);
        const FrontGround = this._SceneImg('Land').getChildByName('FrontGround') as Laya.Image;
        if (ran == 0) {
            Ground = FrontGround;
        } else if (ran == 1) {
            Ground = this._SceneImg('Land').getChildByName('MiddleGround') as Laya.Image;
            if (!Ground) {
                Ground = new Laya.Image;
                Ground.name = 'MiddleGround';
                this._SceneImg('Land').addChild(Ground);
                Ground.zOrder = 14;
            }
        } else if (ran == 2) {
            Ground = this._SceneImg('Land').getChildByName('BehindGround') as Laya.Image;
            if (!Ground) {
                Ground = new Laya.Image;
                Ground.name = 'BehindGround';
                this._SceneImg('Land').addChild(Ground);
                Ground.zOrder = 4;
            }
        }
        Ground.size(FrontGround.width, FrontGround.height);
        Ground.anchorX = Ground.anchorY = 0.5;
        Ground.pos(FrontGround.x, FrontGround.y);
        this.displayArrow(Ground, 160);
    }
}