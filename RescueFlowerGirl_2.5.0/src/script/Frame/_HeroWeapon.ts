import { Admin, TimerAdmin, Tools } from "./Lwg";
import { _LwgEvent } from "./LwgEvent";

export class _HeroWeapon extends Admin._ObjectBase {
    launchAcc: number = 0;
    dropAcc: number = 0;
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
        !Tools._Node.leaveStage(this._Owner, () => {
            this._Owner.removeSelf();
        }) && this.checkEnemy();
    }
    drop(): void {
        this.state = this.stateType.free;
        Laya.timer.clearAll(this);
        TimerAdmin._frameLoop(1, this, () => {
            this._Owner.y += 40;
            this._Owner.rotation += 10;
            Tools._Node.leaveStage(this._Owner, () => {
                this._Owner.removeSelf();
            });
        })
    }
    skill(Enemy: Laya.Image): void {
        this._evNotify(_LwgEvent.Game.enemyBlood, [Enemy, 1]);
        this._Owner.removeSelf();
    }

    displayArrow(Ele: Laya.Sprite, dis: number): boolean {
        const EleParent = Ele.parent as Laya.Sprite;
        const elementGP = EleParent.localToGlobal(new Laya.Point(Ele.x, Ele.y));
        if (elementGP.distance(this._gPoint.x, this._gPoint.y) < dis) {
            Laya.timer.clearAll(this);
            this.state = this.stateType.free;
            const lP = Ele.globalToLocal(this._gPoint);
            let ArrowParent: Laya.Sprite;
            const ran = Tools._Number.randomOneInt(0, 1);
            if (ran == 0) {
                ArrowParent = Ele.getChildByName('ArrowParentF') as Laya.Sprite;
                if (!ArrowParent) {
                    ArrowParent = new Laya.Sprite;
                    ArrowParent.name = 'ArrowParentF';
                    Ele.addChild(ArrowParent);
                    ArrowParent.size(Ele.width, Ele.height);
                    ArrowParent.zOrder = 5;
                }
            } else {
                ArrowParent = Ele.getChildByName('ArrowParentR') as Laya.Sprite;
                if (!ArrowParent) {
                    ArrowParent = new Laya.Sprite;
                    ArrowParent.name = 'ArrowParentR';
                    Ele.addChild(ArrowParent);
                    ArrowParent.size(Ele.width, Ele.height);
                    ArrowParent.zOrder = -5;
                }
            }
            ArrowParent.cacheAs = "bitmap";
            ArrowParent.addChild(this._Owner);
            this._Owner.pos(lP.x, lP.y);
            this._Owner.rotation -= this._SceneImg('Land').rotation;
            if (EleParent !== this._SceneImg('Land')) {
                this._Owner.rotation -= Ele.rotation;
            }
            // 通过移动图片的位置，表现每支箭的力度略有差别
            const Pic = this._Owner.getChildByName('Pic') as Laya.Image;
            Pic.y -= Tools._Number.randomOneBySection(20);
            const mask = new Laya.Sprite;
            mask.size(200, 300);
            mask.pos(0, Tools._Number.randomOneBySection(20, 30));
            mask.loadImage('Lwg/UI/ui_l_orthogon_white.png');
            this._Owner.mask = mask;
            // 绘制贴图后删除，减少节点数量
            // if (ArrowParent.numChildren > 5) {
            // const tex = ArrowParent.drawToTexture(ArrowParent.width, ArrowParent.height, 0, 0) as Laya.Texture;
            // ArrowParent.texture && ArrowParent.texture.destroy();
            // ArrowParent.texture = tex;
            // Tools._Node.removeAllChildren(ArrowParent);
            // }
            TimerAdmin._frameOnce(120, this, () => {
                this._Owner.removeSelf();
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
        for (let index = 0; index < this._SceneImg('BehindScenery').numChildren; index++) {
            const element = this._SceneImg('BehindScenery').getChildAt(index) as Laya.Image;
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
            if (gPEnemy.distance(this._gPoint.x, this._gPoint.y) < 50) {
                // 通过倾斜角度计算是否可以打到，有头盔的在头向下的时候打不到
                let Shell = Enemy.getChildByName('Shell') as Laya.Image;
                if (Shell) {
                    const landContentGP = this._SceneImg('Content').localToGlobal(new Laya.Point(this._SceneImg('Land').x, this._SceneImg('Land').y));
                    let angle = Tools._Point.pointByAngle(landContentGP.x - this._gPoint.x, landContentGP.y - this._gPoint.y) + 90;
                    if (210 < angle && angle < 330) {
                        this.drop();
                    } else {
                        this.skill(Enemy);
                    }
                } else {
                    this.skill(Enemy);
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