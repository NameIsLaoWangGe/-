import { Admin, DataAdmin } from "./Lwg";

/**测试模块,每个模块分开，默认导出一个类，这个类是默认挂载的脚本类，如果有多个脚本，
 * 那么在这个默认类中进行添加，或者在其他地方动态添加*/
export module _Example {
    /**数据表和其中的数据增删改查*/
    export let _Data1: any;
    /**数据表和其中的数据增删改查*/
    export class _Data2 extends DataAdmin._Table {
        _init(): void {
            this._arr = [
                {},
                {},
                {},
                {},
            ]
        }
    }
    /**类模式，用于可继承时，或者多列时，例如商店中的商品种类*/
    export class _Classify1 {
        static _property = {
            pro1: 'pro1',
            pro2: 'pro2',
            pro3: 'pro3',
        };
        static _variable1: string = '';
        static _variable2: string = '';
        static _Data1: Array<any> = [];
        static _init(): void { }
        static _setVariable1(name: string): void {
        }
        static _setVariable2(name: string): void {
        }
        public get variable3(): string {
            return this['_variable3'] ? this['_variable3'] : null;
        };
        public set variable3(v: string) {
            this['_variable3'] = v;
        };
    }
    export class _Classify2 extends _Classify1 {
        static _init(): void {
        }
    }

    /**普通变量必须在场景脚本中初始化*/
    export let _anyVariable: any;
    /**存储值的枚举，*/
    export enum _Store {
        variable1 = 'variable1',
        variable2 = 'variable2',
        variable3 = 'variable3',
    }
    /**事件类型，必须枚举,因为有可能在全局使用,所以命名必须使用模块名称+事件名称*/
    export enum _Event {
        event1 = '_Example_Event1',
        event2 = '_Example_Event2',
    }
    /**全模块中的临时变量可能在其他地方使用，所以在必要的时候枚举*/
    export enum _AnyVariableEnum {
        thisVariable1 = 'thisVariable1',
        thisVariable2 = 'thisVariable2',
    }
    /**模块初始化*/
    export function _init(): void {

    }
    /**可以手动挂在脚本中的类，全脚本唯一的默认导出，也可动态添加，动态添加写在模块内更方便*/
    export class Example extends Admin._SceneBase {
        lwgOnAwake(): void {
            _Data1 = new DataAdmin._Table();
            // 模块中临时变量赋值方法,这种赋值必须只用在当前脚本，否则必须枚举
            _Example['name'] = '大王哥';
            console.log(_Example, parent, _Example['name']);
            // 类中
            this['name'] = '老王哥';
            console.log(this, this['name']);
            // 数据表
            _Data1.getProperty1Func('any');
            _Data1.getProperty2Func('测试设置');
        }
        lwgOnEnable(): void { }
        lwgEventRegister(): void { }
        lwgOnStart(): void { }
        lwgAdaptive(): void { }
        lwgOpenAni(): number { return 100; }
        lwgBtnRegister(): void { }
        lwgVanishAni(): number { return 100; }
        lwgOnUpdate(): void { }
        lwgOnDisable(): void { }
    }
    export class UIExampleItem extends Admin._ObjectBase {

    }
}
export default _Example.Example;


