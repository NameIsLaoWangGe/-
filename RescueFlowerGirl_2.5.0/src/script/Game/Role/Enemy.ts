import Lwg, { LwgScene, LwgData, LwgEff2D, LwgEvent, LwgTimer, LwgTools } from "../../Lwg/Lwg";
import BloodBase from "./BloodBase";
import { Heroine } from "./Heroine";
import { _Res } from "../_Res";
import { _Game } from "../_GameData";
import { _EnemyAttack } from "../EnemyAttack/_EnemyAttack";
export default class Enemy extends BloodBase {
    speed: number;
    groundRadius: number;
    ranAttackNum: number;
    lwgOnAwake(): void {
        this.generalProInit();
        this.bloodInit(this._Owner['_EnemyData']['blood']);
        this.ranAttackNum = LwgTools._Number.randomOneBySection(1, 3, true);
    }
    generalProInit(): void {
        this._Owner.pos(Laya.stage.width / 2, 300);
        // !shell && this.Shell.removeSelf();
        this._ImgChild('Shell').removeSelf();
        if (this._Owner['_EnemyData']['color']) {
            this._ImgChild('Pic').skin = `Game/UI/Game/Enemy/enemy_01_${this._Owner['_EnemyData']['color']}.png`;
        }
        const angle = this._Owner['_EnemyData']['angle'];
        this._Owner.rotation = angle;

        this.speed = this._Owner['_EnemyData']['speed'];
        this.groundRadius = 200;
    }
    lwgOnStart(): void {
        this.attack();
        this.appear(() => {
            this.move();
        });
    }
    appear(func: Function): void {
        let radius = 0;
        const radiusSpeed = 2;
        const time = 220 / radiusSpeed;
        LwgTimer._frameNumLoop(1, time, this, () => {
            radius += radiusSpeed;
            let point = LwgTools._Point.getRoundPosNew(this._Owner.rotation, radius, new Laya.Point(this._SceneImg('Land').width / 2, this._SceneImg('Land').height / 2))
            this._Owner.x = point.x;
            this._Owner.y = point.y;
        }, () => {
            func();
        })
    }
    attack(): void {
        _EnemyAttack.Level1.enemy(this._Owner as Lwg.NodeAdmin._Image);
    }
    move(): void {
        LwgTimer._frameLoop(1, this, () => {
            let point = LwgTools._Point.getRoundPosNew(this._Owner.rotation += this.speed, 220, new Laya.Point(this._SceneImg('Land').width / 2, this._SceneImg('Land').height / 2))
            this._Owner.x = point.x;
            this._Owner.y = point.y;
        })
    }
    lwgEvent(): void {
        this._evReg(_Game._Event.enemyCheckWeapon, (Weapon: Laya.Image, numBlood: number) => {
            this.checkOtherRule(Weapon, 30, numBlood);
        })
    }
    deathFunc(): void {
        // 最后一个为boss
        if (this._Owner.name === 'Boss') {
            LwgTools._Node.createPrefab(_Res.$prefab2D.Heroine.prefab2D, this._Parent, [this._Owner.x, this._Owner.y], Heroine);
        } else {
            this._evNotify(_Game._Event.addEnemy);
        }
    }
}
