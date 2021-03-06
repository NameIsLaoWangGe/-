(function () {
    'use strict';

    var Lwg;
    (function (Lwg) {
        let PlatformAdmin;
        (function (PlatformAdmin) {
            PlatformAdmin._Tpye = {
                Bytedance: 'Bytedance',
                WeChat: 'WeChat',
                OPPO: 'OPPO',
                OPPOTest: 'OPPOTest',
                VIVO: 'VIVO',
                General: 'General',
                Web: 'Web',
                WebTest: 'WebTest',
                Research: 'Research',
            };
            PlatformAdmin._Ues = {
                get value() {
                    return this['_platform/name'] ? this['_platform/name'] : null;
                },
                set value(val) {
                    this['_platform/name'] = val;
                    switch (val) {
                        case PlatformAdmin._Tpye.WebTest:
                            Laya.LocalStorage.clear();
                            GoldAdmin._num.value = 5000;
                            break;
                        case PlatformAdmin._Tpye.Research:
                            GoldAdmin._num.value = 50000000000000;
                            break;
                        default:
                            break;
                    }
                }
            };
        })(PlatformAdmin = Lwg.PlatformAdmin || (Lwg.PlatformAdmin = {}));
        let GameAdmin;
        (function (GameAdmin) {
            GameAdmin._switch = true;
            GameAdmin.pause = {
                get value() {
                    return GameAdmin._switch;
                },
                set value(bool) {
                    if (bool) {
                        GameAdmin._switch = false;
                        TimerAdmin._switch = false;
                        LwgClick._aniSwitch = true;
                    }
                    else {
                        GameAdmin._switch = true;
                        TimerAdmin._switch = true;
                        LwgClick._aniSwitch = false;
                    }
                }
            };
            GameAdmin.level = {
                get value() {
                    return Laya.LocalStorage.getItem('_Game/Level') ? Number(Laya.LocalStorage.getItem('_Game/Level')) : 1;
                },
                set value(val) {
                    let diff = val - this.level;
                    if (diff > 0) {
                        this.maxLevel += diff;
                    }
                    if (val > this.loopLevel && this.loopLevel != -1) {
                        Laya.LocalStorage.setItem('_Game/Level', (1).toString());
                    }
                    else {
                        Laya.LocalStorage.setItem('_Game/Level', (val).toString());
                    }
                }
            };
            GameAdmin.maxLevel = {
                get value() {
                    return Laya.LocalStorage.getItem('_Game/maxLevel') ? Number(Laya.LocalStorage.getItem('_Game/maxLevel')) : this.level;
                },
                set value(val) {
                    Laya.LocalStorage.setItem('_Game/maxLevel', val.toString());
                }
            };
            GameAdmin.loopLevel = {
                get value() {
                    return this['_Game/loopLevel'] ? this['_Game/loopLevel'] : -1;
                },
                set value(val) {
                    this['_Game/loopLevel'] = val;
                }
            };
            function _createLevel(parent, x, y) {
                let sp;
                Laya.loader.load('prefab/LevelNode.json', Laya.Handler.create(this, function (prefab) {
                    const _prefab = new Laya.Prefab();
                    _prefab.json = prefab;
                    sp = Laya.Pool.getItemByCreateFun('prefab', _prefab.create, _prefab);
                    parent.addChild(sp);
                    sp.pos(x, y);
                    sp.zOrder = 0;
                    const level = sp.getChildByName('level');
                    this.LevelNode = sp;
                }));
            }
            GameAdmin._createLevel = _createLevel;
            ;
        })(GameAdmin = Lwg.GameAdmin || (Lwg.GameAdmin = {}));
        let SceneAdmin;
        (function (SceneAdmin) {
            SceneAdmin._SceneControl = {};
            SceneAdmin._SceneScript = {};
            class _BaseName {
            }
            _BaseName.PreLoad = 'PreLoad';
            _BaseName.PreLoadCutIn = 'PreLoadCutIn';
            _BaseName.Guide = 'Guide';
            _BaseName.Start = 'Start';
            _BaseName.Shop = 'Shop';
            _BaseName.Task = 'Task';
            _BaseName.Set = 'Set';
            _BaseName.Victory = 'Victory';
            _BaseName.Defeated = 'Defeated';
            _BaseName.CheckIn = 'CheckIn';
            _BaseName.LwgInit = 'LwgInit';
            _BaseName.SelectLevel = 'SelectLevel';
            _BaseName.Settle = 'Settle';
            _BaseName.Share = 'Share';
            _BaseName.Ranking = 'Ranking';
            SceneAdmin._BaseName = _BaseName;
            SceneAdmin._PreLoadCutIn = {
                openName: null,
                closeName: null,
            };
            function _preLoadOpenScene(openName, closeName, func, zOrder) {
                SceneAdmin._PreLoadCutIn.openName = openName;
                SceneAdmin._PreLoadCutIn.closeName = closeName;
                _openScene(_BaseName.PreLoadCutIn, closeName, func, zOrder);
            }
            SceneAdmin._preLoadOpenScene = _preLoadOpenScene;
            class _SceneServe {
                static _openZOderUp() {
                    if (SceneAniAdmin._closeSwitch.value) {
                        let num = 0;
                        for (const key in SceneAdmin._SceneControl) {
                            if (Object.prototype.hasOwnProperty.call(SceneAdmin._SceneControl, key)) {
                                const Scene = SceneAdmin._SceneControl[key];
                                if (Scene.parent) {
                                    Scene.zOrder = 0;
                                    num++;
                                }
                            }
                        }
                        if (this._openScene) {
                            this._openScene.zOrder = num;
                            for (let index = 0; index < this._closeSceneArr.length; index++) {
                                const element = this._closeSceneArr[index];
                                if (element) {
                                    element.zOrder = --num;
                                }
                                else {
                                    this._closeSceneArr.splice(index, 1);
                                    index--;
                                }
                            }
                        }
                    }
                }
                ;
                static _closeZOderUP(CloseScene) {
                    if (SceneAniAdmin._closeSwitch.value) {
                        let num = 0;
                        for (const key in SceneAdmin._SceneControl) {
                            if (Object.prototype.hasOwnProperty.call(SceneAdmin._SceneControl, key)) {
                                const Scene = SceneAdmin._SceneControl[key];
                                if (Scene.parent) {
                                    num++;
                                }
                            }
                        }
                        if (CloseScene) {
                            CloseScene.zOrder = num;
                            if (this._openScene) {
                                this._openScene.zOrder = --num;
                            }
                        }
                    }
                }
                ;
                static _open() {
                    if (this._openScene) {
                        if (this._openZOder) {
                            Laya.stage.addChildAt(this._openScene, this._openZOder);
                        }
                        else {
                            Laya.stage.addChild(this._openScene);
                        }
                        if (SceneAdmin._SceneScript[this._openScene.name]) {
                            if (!this._openScene.getComponent(SceneAdmin._SceneScript[this._openScene.name])) {
                                this._openScene.addComponent(SceneAdmin._SceneScript[this._openScene.name]);
                            }
                        }
                        else {
                            console.log(`${this._openScene.name}场景没有同名脚本！,需在LwgInit脚本中导入该脚本！`);
                        }
                        this._openZOderUp();
                        this._openFunc();
                    }
                }
                ;
                static _close() {
                    if (this._closeSceneArr.length > 0) {
                        for (let index = 0; index < this._closeSceneArr.length; index++) {
                            let scene = this._closeSceneArr[index];
                            if (scene) {
                                _closeScene(scene.name);
                                this._closeSceneArr.splice(index, 1);
                                index--;
                            }
                        }
                    }
                    this._remake();
                }
                static _remake() {
                    this._openScene = null;
                    this._openZOder = 1;
                    this._openFunc = null;
                    this._closeZOder = 0;
                }
            }
            _SceneServe._openScene = null;
            _SceneServe._openZOder = 1;
            _SceneServe._openFunc = null;
            _SceneServe._closeSceneArr = [];
            _SceneServe._closeZOder = 0;
            _SceneServe._sceneNum = 1;
            SceneAdmin._SceneServe = _SceneServe;
            function _openScene(openName, closeName, func, zOrder) {
                LwgClick._aniSwitch = false;
                Laya.Scene.load('Scene/' + openName + '.json', Laya.Handler.create(this, function (scene) {
                    const openScene = ToolsAdmin._Node.checkChildren(Laya.stage, openName);
                    if (openScene) {
                        openScene.close();
                        console.log(`场景${openName}重复出现！前面的场景将会被关闭！`);
                    }
                    _SceneServe._openScene = SceneAdmin._SceneControl[scene.name = openName] = scene;
                    if (closeName && SceneAdmin._SceneControl[closeName]) {
                        _SceneServe._closeSceneArr.push(SceneAdmin._SceneControl[closeName]);
                        _SceneServe._closeZOder = SceneAdmin._SceneControl[closeName].zOrder;
                    }
                    _SceneServe._openZOder = zOrder ? zOrder : null;
                    _SceneServe._openFunc = func ? func : () => { };
                    _SceneServe._open();
                }));
            }
            SceneAdmin._openScene = _openScene;
            function _closeScene(closeName, func) {
                if (!SceneAdmin._SceneControl[closeName]) {
                    console.log(`场景${closeName}关闭失败，可能不存在！`);
                    return;
                }
                var closef = () => {
                    func && func();
                    LwgClick._aniSwitch = true;
                    SceneAdmin._SceneControl[closeName].close();
                };
                if (!SceneAniAdmin._closeSwitch.value) {
                    closef();
                }
                else {
                    _SceneServe._closeZOderUP(LwgScene._SceneControl[closeName]);
                    const script = SceneAdmin._SceneControl[closeName][closeName];
                    if (script) {
                        LwgClick._aniSwitch = false;
                        let time0 = script.lwgCloseAni();
                        if (time0 !== null) {
                            SceneAniAdmin._closeAniDelay = time0;
                            script.lwgBeforeCloseAni();
                            Laya.timer.once(time0, this, () => {
                                closef();
                                LwgClick._aniSwitch = true;
                            });
                        }
                        else {
                            const delay = SceneAniAdmin._commonCloseAni(SceneAdmin._SceneControl[closeName]);
                            Laya.timer.once(delay, this, () => {
                                script.lwgBeforeCloseAni();
                                closef();
                            });
                        }
                    }
                }
            }
            SceneAdmin._closeScene = _closeScene;
            class _ScriptBase extends Laya.Script {
                constructor() {
                    super(...arguments);
                    this.ownerSceneName = '';
                }
                getFind(name, type) {
                    if (!this[`_Scene${type}${name}`]) {
                        let Node = ToolsAdmin._Node.findChild2D(this.owner.scene, name);
                        if (Node) {
                            NodeAdmin._addProperty(Node);
                            return this[`_Scene${type}${name}`] = Node;
                        }
                        else {
                            console.log(`场景内不存在节点${name}`);
                        }
                    }
                    else {
                        return this[`_Scene${type}${name}`];
                    }
                }
                _FindImg(name) {
                    return this.getFind(name, '_FindImg');
                }
                _FindSp(name) {
                    return this.getFind(name, '_FindSp');
                }
                _FindBox(name) {
                    return this.getFind(name, '_FindBox');
                }
                _FindTap(name) {
                    return this.getFind(name, '_FindTap');
                }
                _FindLabel(name) {
                    return this.getFind(name, '_FindLabel');
                }
                _FindList(name) {
                    return this.getFind(name, '_FindList');
                }
                _storeNum(name, _func, initial) {
                    return StorageAdmin._num(`${this.owner.name}/${name}`, _func, initial);
                }
                _storeStr(name, _func, initial) {
                    return StorageAdmin._str(`${this.owner.name}/${name}`, _func, initial);
                }
                _storeBool(name, _func, initial) {
                    return StorageAdmin._bool(`${this.owner.name}/${name}`, _func, initial);
                }
                _storeArray(name, _func, initial) {
                    return StorageAdmin._array(`${this.owner.name}/${name}`, _func, initial);
                }
                lwgOnAwake() { }
                ;
                lwgAdaptive() { }
                ;
                lwgEvent() { }
                ;
                _evReg(name, func) {
                    EventAdmin._register(name, this, func);
                }
                _evRegOne(name, func) {
                    EventAdmin._registerOnce(name, this, func);
                }
                _evNotify(name, args) {
                    EventAdmin._notify(name, args);
                }
                lwgOnEnable() { }
                lwgOnStart() { }
                lwgButton() { }
                ;
                _btnDown(target, down, effect) {
                    LwgClick._on(effect == undefined ? LwgClick._Use.value : effect, target, this, (e) => {
                        var func = () => {
                            ClickAdmin._absoluteSwitch && LwgClick._aniSwitch && down && down(e);
                        };
                        if (ClickAdmin._assign.length > 0) {
                            ClickAdmin._checkAssign(target.name) && func();
                        }
                        else {
                            func();
                        }
                    }, null, null, null);
                }
                _btnMove(target, move, effect) {
                    LwgClick._on(effect == undefined ? LwgClick._Use.value : effect, target, this, null, (e) => {
                        var func = () => {
                            ClickAdmin._absoluteSwitch && LwgClick._aniSwitch && move && move(e);
                        };
                        if (ClickAdmin._assign.length > 0) {
                            ClickAdmin._checkAssign(target.name) && func();
                        }
                        else {
                            func();
                        }
                    }, null, null);
                }
                _btnUp(target, up, effect) {
                    LwgClick._on(effect == undefined ? LwgClick._Use.value : effect, target, this, null, null, (e) => {
                        var func = () => {
                            ClickAdmin._absoluteSwitch && LwgClick._aniSwitch && up && up(e);
                        };
                        if (ClickAdmin._assign.length > 0) {
                            ClickAdmin._checkAssign(target.name) && func();
                        }
                        else {
                            func();
                        }
                    }, null);
                }
                _btnOut(target, out, effect) {
                    LwgClick._on(effect == undefined ? LwgClick._Use.value : effect, target, this, null, null, null, (e) => {
                        var func = () => {
                            ClickAdmin._absoluteSwitch && LwgClick._aniSwitch && out && out(e);
                        };
                        if (ClickAdmin._assign.length > 0) {
                            ClickAdmin._checkAssign(target.name) && func();
                        }
                        else {
                            func();
                        }
                    });
                }
                _btnFour(target, down, move, up, out, effect) {
                    LwgClick._on(effect == null ? effect : LwgClick._Use.value, target, this, (e) => {
                        var func = () => {
                            ClickAdmin._absoluteSwitch && LwgClick._aniSwitch && down && down(e);
                        };
                        if (ClickAdmin._assign.length > 0) {
                            ClickAdmin._checkAssign(target.name) && func();
                        }
                        else {
                            func();
                        }
                    }, (e) => {
                        var func = () => {
                            ClickAdmin._absoluteSwitch && LwgClick._aniSwitch && move && move(e);
                        };
                        if (ClickAdmin._assign.length > 0) {
                            ClickAdmin._checkAssign(target.name) && func();
                        }
                        else {
                            func();
                        }
                    }, (e) => {
                        var func = () => {
                            ClickAdmin._absoluteSwitch && LwgClick._aniSwitch && up && up(e);
                        };
                        if (ClickAdmin._assign.length > 0) {
                            ClickAdmin._checkAssign(target.name) && func();
                        }
                        else {
                            func();
                        }
                    }, (e) => {
                        var func = () => {
                            ClickAdmin._absoluteSwitch && LwgClick._aniSwitch && out && out(e);
                        };
                        if (ClickAdmin._assign.length > 0) {
                            ClickAdmin._checkAssign(target.name) && func();
                        }
                        else {
                            func();
                        }
                    });
                }
                _openScene(openName, closeSelf, preLoadCutIn, func, zOrder) {
                    let closeName;
                    if (closeSelf == undefined || closeSelf == true) {
                        closeName = this.ownerSceneName;
                    }
                    if (!preLoadCutIn) {
                        LwgScene._openScene(openName, closeName, func, zOrder);
                    }
                    else {
                        LwgScene._preLoadOpenScene(openName, closeName, func, zOrder);
                    }
                }
                _closeScene(sceneName, func) {
                    LwgScene._closeScene(sceneName ? sceneName : this.ownerSceneName, func);
                }
                lwgOnUpdate() { }
                ;
                lwgOnDisable() { }
                ;
                onStageMouseDown(e) { ClickAdmin._stageSwitch && ClickAdmin._assign.length === 0 && LwgClick._aniSwitch && this.lwgOnStageDown(e); }
                ;
                onStageMouseMove(e) { ClickAdmin._stageSwitch && ClickAdmin._assign.length === 0 && LwgClick._aniSwitch && this.lwgOnStageMove(e); }
                ;
                onStageMouseUp(e) { ClickAdmin._stageSwitch && ClickAdmin._assign.length === 0 && LwgClick._aniSwitch && this.lwgOnStageUp(e); }
                ;
                lwgOnStageDown(e) { }
                ;
                lwgOnStageMove(e) { }
                ;
                lwgOnStageUp(e) { }
                ;
            }
            SceneAdmin._ScriptBase = _ScriptBase;
            class _SceneBase extends _ScriptBase {
                constructor() {
                    super();
                }
                get _Owner() {
                    return this.owner;
                }
                getVar(name, type) {
                    if (!this[`_Scene${type}${name}`]) {
                        if (this._Owner[name]) {
                            NodeAdmin._addProperty(this._Owner[name]);
                            return this[`_Scene${type}${name}`] = this._Owner[name];
                        }
                        else {
                            console.log('场景内不存在var节点：', name);
                            return undefined;
                        }
                    }
                    else {
                        return this[`_Scene${type}${name}`];
                    }
                }
                _SpriteVar(name) {
                    return this.getVar(name, '_SpriteVar');
                }
                _AniVar(name) {
                    return this.getVar(name, '_AniVar');
                }
                _BtnVar(name) {
                    return this.getVar(name, '_BtnVar');
                }
                _BoxVar(name) {
                    return this.getVar(name, '_BoxVar');
                }
                _ImgVar(name) {
                    return this.getVar(name, '_ImgVar');
                }
                _LabelVar(name) {
                    return this.getVar(name, '_LabelVar');
                }
                _ListVar(name) {
                    return this.getVar(name, '_ListVar');
                }
                _TapVar(name) {
                    return this.getVar(name, '_TapVar');
                }
                _TextVar(name) {
                    return this.getVar(name, '_TextVar');
                }
                _TextInputVar(name) {
                    return this.getVar(name, '_TextInputVar');
                }
                _FontClipVar(name) {
                    return this.getVar(name, '_FontClipVar');
                }
                _FontBox(name) {
                    return this.getVar(name, '_FontBox');
                }
                _FontTextInput(name) {
                    return this.getVar(name, '_FontInput');
                }
                onAwake() {
                    this._Owner.width = Laya.stage.width;
                    this._Owner.height = Laya.stage.height;
                    if (this._Owner.getChildByName('Background')) {
                        this._Owner.getChildByName('Background')['width'] = Laya.stage.width;
                        this._Owner.getChildByName('Background')['height'] = Laya.stage.height;
                    }
                    if (!this._Owner.name) {
                        console.log('场景名称失效，脚本赋值失败');
                    }
                    else {
                        this.ownerSceneName = this._Owner.name;
                        this._Owner[this._Owner.name] = this;
                    }
                    this.moduleOnAwake();
                    this.lwgOnAwake();
                    this.lwgAdaptive();
                }
                moduleOnAwake() { }
                onEnable() {
                    this.moduleEvent();
                    this.lwgEvent();
                    this.moduleOnEnable();
                    this.lwgOnEnable();
                }
                moduleOnEnable() { }
                ;
                moduleEvent() { }
                ;
                onStart() {
                    this.moduleOnStart();
                    this.lwgOnStart();
                    this.btnAndOpenAni();
                }
                moduleOnStart() { }
                btnAndOpenAni() {
                    let time = this.lwgOpenAni();
                    if (time !== null) {
                        Laya.timer.once(time, this, () => {
                            LwgClick._aniSwitch = true;
                            this.lwgOpenAniAfter();
                            this.lwgButton();
                            _SceneServe._close();
                        });
                    }
                    else {
                        SceneAniAdmin._commonOpenAni(this._Owner);
                    }
                }
                lwgOpenAni() { return null; }
                ;
                lwgOpenAniAfter() { }
                ;
                _adaHeight(arr) {
                    LwgAdaptive._stageHeight(arr);
                }
                ;
                _adaWidth(arr) {
                    LwgAdaptive._stageWidth(arr);
                }
                ;
                _adaptiveCenter(arr) {
                    LwgAdaptive._center(arr, Laya.stage);
                }
                ;
                onUpdate() { this.lwgOnUpdate(); }
                ;
                lwgBeforeCloseAni() { }
                lwgCloseAni() { return null; }
                ;
                onDisable() {
                    Laya.Tween.clearAll(this);
                    Laya.Tween.clearAll(this._Owner);
                    Laya.timer.clearAll(this);
                    Laya.timer.clearAll(this._Owner);
                    EventAdmin._offCaller(this);
                    EventAdmin._offCaller(this._Owner);
                    this.lwgOnDisable();
                }
            }
            SceneAdmin._SceneBase = _SceneBase;
            class _ObjectBase extends _ScriptBase {
                constructor() {
                    super();
                }
                _ownerDestroy() {
                    this._Owner.destroy();
                    this.clear();
                }
                get _Owner() {
                    return this.owner;
                }
                get _point() {
                    return new Laya.Point(this._Owner.x, this._Owner.y);
                }
                get _Scene() {
                    return this.owner.scene;
                }
                get _Parent() {
                    if (this._Owner.parent) {
                        return this.owner.parent;
                    }
                }
                get _RigidBody() {
                    if (!this._Owner['_OwnerRigidBody']) {
                        this._Owner['_OwnerRigidBody'] = this._Owner.getComponent(Laya.RigidBody);
                    }
                    return this._Owner['_OwnerRigidBody'];
                }
                get _BoxCollier() {
                    if (!this._Owner['_OwnerBoxCollier']) {
                        this._Owner['_OwnerBoxCollier'] = this._Owner.getComponent(Laya.BoxCollider);
                    }
                    return this._Owner['_OwnerBoxCollier'];
                }
                get _CilrcleCollier() {
                    if (!this._Owner['_OwnerCilrcleCollier']) {
                        return this._Owner['_OwnerCilrcleCollier'] = this._Owner.getComponent(Laya.BoxCollider);
                    }
                    return this._Owner['_OwnerCilrcleCollier'];
                }
                get _PolygonCollier() {
                    if (!this._Owner['_OwnerPolygonCollier']) {
                        return this._Owner['_OwnerPolygonCollier'] = this._Owner.getComponent(Laya.BoxCollider);
                    }
                    return this._Owner['_OwnerPolygonCollier'];
                }
                getSceneVar(name, type) {
                    if (!this[`_Scene${type}${name}`]) {
                        if (this._Scene[name].parent) {
                            NodeAdmin._addProperty(this._Scene[name]);
                            return this[`_Scene${type}${name}`] = this._Scene[name];
                        }
                        else {
                            console.log(`场景内不存在var节点${name}`);
                        }
                    }
                    else {
                        return this[`_Scene${type}${name}`];
                    }
                }
                _SceneSprite(name) {
                    return this.getSceneVar(name, '_SceneSprite');
                }
                _SceneAni(name) {
                    return this.getSceneVar(name, '_SceneAni');
                }
                _SceneImg(name) {
                    return this.getSceneVar(name, '_SceneImg');
                }
                _SceneLabel(name) {
                    return this.getSceneVar(name, '_SceneLabel');
                }
                _SceneList(name) {
                    return this.getSceneVar(name, '_SceneList');
                }
                _SceneTap(name) {
                    return this.getSceneVar(name, '_SceneTap');
                }
                _SceneText(name) {
                    return this.getSceneVar(name, '_SceneText');
                }
                _SceneFontClip(name) {
                    return this.getSceneVar(name, '_SceneFontClip');
                }
                _SceneBox(name) {
                    return this.getSceneVar(name, '_SceneBox');
                }
                getChild(name, type) {
                    if (!this[`${type}${name}`]) {
                        const child = this._Owner.getChildByName(name);
                        if (child) {
                            NodeAdmin._addProperty(child);
                            return this[`${type}${name}`] = child;
                        }
                        else {
                            return null;
                        }
                    }
                    else {
                        return this[`${type}${name}`];
                    }
                }
                _ImgChild(name) {
                    return this.getChild(name, '_ImgChild');
                }
                _BoxChild(name) {
                    return this.getChild(name, '_ImgBox');
                }
                _SpriteChild(name) {
                    return this.getChild(name, '_SpriteChild');
                }
                _LableChild(name) {
                    return this.getChild(name, '_LableChild');
                }
                _ListChild(name) {
                    return this.getChild(name, '_ListChild');
                }
                _TapChild(name) {
                    return this.getChild(name, '_TapChild');
                }
                _TapBox(name) {
                    return this.getChild(name, '_TapBox');
                }
                _TapFontClip(name) {
                    return this.getChild(name, '_TapFontClip');
                }
                onAwake() {
                    NodeAdmin._addProperty(this._Owner);
                    this._Owner[this._Owner.name] = this;
                    this.ownerSceneName = this._Scene.name;
                    this.lwgOnAwake();
                    this.lwgAdaptive();
                }
                onEnable() {
                    this.lwgButton();
                    this.lwgEvent();
                    this.lwgOnEnable();
                }
                onStart() {
                    this.lwgOnStart();
                }
                onUpdate() {
                    this.lwgOnUpdate();
                }
                clear() {
                    Laya.Tween.clearAll(this);
                    Laya.Tween.clearAll(this._Owner);
                    Laya.timer.clearAll(this);
                    Laya.timer.clearAll(this._Owner);
                    EventAdmin._offCaller(this);
                    EventAdmin._offCaller(this._Owner);
                }
                onDisable() {
                    this.clear();
                    this.lwgOnDisable();
                }
            }
            SceneAdmin._ObjectBase = _ObjectBase;
        })(SceneAdmin = Lwg.SceneAdmin || (Lwg.SceneAdmin = {}));
        let NodeAdmin;
        (function (NodeAdmin) {
            class _Sprite extends Laya.Sprite {
            }
            NodeAdmin._Sprite = _Sprite;
            class _Image extends Laya.Image {
            }
            NodeAdmin._Image = _Image;
            class _Box extends Laya.Box {
            }
            NodeAdmin._Box = _Box;
            function _addProperty(node, nodeType) {
                if (!node)
                    return;
                let _proType;
                switch (nodeType) {
                    case 'Img':
                        _proType;
                        break;
                    case 'box':
                        _proType;
                        break;
                    default:
                        _proType;
                        break;
                }
                var getGPoint = () => {
                    if (node.parent) {
                        return node.parent.localToGlobal(new Laya.Point(node.x, node.y));
                    }
                    else {
                        return null;
                    }
                };
                const _fPoint = new Laya.Point(node.x, node.y);
                const _fGPoint = getGPoint();
                const _fRotation = node.rotation;
                _proType = {
                    get gPoint() {
                        return getGPoint();
                    },
                    fPoint: _fPoint,
                    fGPoint: _fGPoint,
                    fRotation: _fRotation,
                };
                node['_lwg'] = _proType;
            }
            NodeAdmin._addProperty = _addProperty;
        })(NodeAdmin = Lwg.NodeAdmin || (Lwg.NodeAdmin = {}));
        let Dialogue;
        (function (Dialogue) {
            let Skin;
            (function (Skin) {
                Skin["blackBord"] = "Lwg/UI/ui_orthogon_black_0.7.png";
            })(Skin || (Skin = {}));
            function _middleHint(describe) {
                const Hint_M = Laya.Pool.getItemByClass('Hint_M', Laya.Sprite);
                Hint_M.name = 'Hint_M';
                Laya.stage.addChild(Hint_M);
                Hint_M.width = Laya.stage.width;
                Hint_M.height = 100;
                Hint_M.pivotY = Hint_M.height / 2;
                Hint_M.pivotX = Laya.stage.width / 2;
                Hint_M.x = Laya.stage.width / 2;
                Hint_M.y = Laya.stage.height / 2;
                Hint_M.zOrder = 100;
                const Pic = new Laya.Image();
                Hint_M.addChild(Pic);
                Pic.skin = Skin.blackBord;
                Pic.width = Laya.stage.width;
                Pic.pivotX = Laya.stage.width / 2;
                Pic.height = 100;
                Pic.pivotY = Pic.height / 2;
                Pic.y = Hint_M.height / 2;
                Pic.x = Laya.stage.width / 2;
                Pic.alpha = 0.6;
                const Dec = new Laya.Label();
                Hint_M.addChild(Dec);
                Dec.width = Laya.stage.width;
                Dec.text = describe;
                Dec.pivotX = Laya.stage.width / 2;
                Dec.x = Laya.stage.width / 2;
                Dec.height = 100;
                Dec.pivotY = 50;
                Dec.y = Hint_M.height / 2;
                Dec.bold = true;
                Dec.fontSize = 35;
                Dec.color = '#ffffff';
                Dec.align = 'center';
                Dec.valign = 'middle';
                Dec.alpha = 0;
                Ani2DAdmin.scale_Alpha(Hint_M, 0, 1, 0, 1, 1, 1, 200, 0, f => {
                    Ani2DAdmin.fadeOut(Dec, 0, 1, 150, 0, f => {
                        Ani2DAdmin.fadeOut(Dec, 1, 0, 200, 800, f => {
                            Ani2DAdmin.scale_Alpha(Hint_M, 1, 1, 1, 1, 0, 0, 200, 0, f => {
                                Hint_M.removeSelf();
                            });
                        });
                    });
                });
            }
            Dialogue._middleHint = _middleHint;
            Dialogue._dialogContent = {
                get Array() {
                    return Laya.loader.getRes("GameData/Dialogue/Dialogue.json")['RECORDS'] !== null ? Laya.loader.getRes("GameData/Dialogue/Dialogue.json")['RECORDS'] : [];
                },
            };
            function getDialogContent(useWhere, name) {
                let dia;
                for (let index = 0; index < Dialogue._dialogContent.Array.length; index++) {
                    const element = Dialogue._dialogContent.Array[index];
                    if (element['useWhere'] == useWhere && element['name'] == name) {
                        dia = element;
                        break;
                    }
                }
                const arr = [];
                for (const key in dia) {
                    if (dia.hasOwnProperty(key)) {
                        const value = dia[key];
                        if (key.substring(0, 7) == 'content' || value !== -1) {
                            arr.push(value);
                        }
                    }
                }
                return arr;
            }
            Dialogue.getDialogContent = getDialogContent;
            function getDialogContent_Random(useWhere) {
                let contentArr = [];
                let whereArr = getUseWhere(useWhere);
                let index = Math.floor(Math.random() * whereArr.length);
                for (const key in whereArr[index]) {
                    if (whereArr[index].hasOwnProperty(key)) {
                        const value = whereArr[index][key];
                        if (key.substring(0, 7) == 'content' && value !== "-1") {
                            contentArr.push(value);
                        }
                    }
                }
                return contentArr;
            }
            Dialogue.getDialogContent_Random = getDialogContent_Random;
            function getUseWhere(useWhere) {
                let arr = [];
                for (let index = 0; index < Dialogue._dialogContent.Array.length; index++) {
                    const element = Dialogue._dialogContent.Array[index];
                    if (element['useWhere'] == useWhere) {
                        arr.push(element);
                    }
                }
                return arr;
            }
            Dialogue.getUseWhere = getUseWhere;
            let UseWhere;
            (function (UseWhere) {
                UseWhere["scene1"] = "scene1";
                UseWhere["scene2"] = "scene2";
                UseWhere["scene3"] = "scene3";
            })(UseWhere = Dialogue.UseWhere || (Dialogue.UseWhere = {}));
            let DialogProperty;
            (function (DialogProperty) {
                DialogProperty["name"] = "name";
                DialogProperty["useWhere"] = "useWhere";
                DialogProperty["content"] = "content";
                DialogProperty["max"] = "max";
            })(DialogProperty = Dialogue.DialogProperty || (Dialogue.DialogProperty = {}));
            let PlayMode;
            (function (PlayMode) {
                PlayMode["voluntarily"] = "voluntarily";
                PlayMode["manual"] = "manual";
                PlayMode["clickContent"] = "clickContent";
            })(PlayMode = Dialogue.PlayMode || (Dialogue.PlayMode = {}));
            function createVoluntarilyDialogue(x, y, useWhere, startDelayed, delayed, parent, content) {
                if (startDelayed == undefined) {
                    startDelayed = 0;
                }
                Laya.timer.once(startDelayed, this, () => {
                    let Pre_Dialogue;
                    Laya.loader.load('Prefab/Dialogue_Common.json', Laya.Handler.create(this, function (prefab) {
                        let _prefab = new Laya.Prefab();
                        _prefab.json = prefab;
                        Pre_Dialogue = Laya.Pool.getItemByCreateFun('Pre_Dialogue', _prefab.create, _prefab);
                        if (parent) {
                            parent.addChild(Pre_Dialogue);
                        }
                        else {
                            Laya.stage.addChild(Pre_Dialogue);
                        }
                        Pre_Dialogue.x = x;
                        Pre_Dialogue.y = y;
                        let ContentLabel = Pre_Dialogue.getChildByName('Content');
                        let contentArr;
                        if (content !== undefined) {
                            ContentLabel.text = content[0];
                        }
                        else {
                            contentArr = getDialogContent_Random(useWhere);
                            ContentLabel.text = contentArr[0];
                        }
                        Pre_Dialogue.zOrder = 100;
                        if (delayed == undefined) {
                            delayed = 1000;
                        }
                        Ani2DAdmin.scale_Alpha(Pre_Dialogue, 0, 0, 0, 1, 1, 1, 150, 1000, () => {
                            for (let index = 0; index < contentArr.length; index++) {
                                Laya.timer.once(index * delayed, this, () => {
                                    ContentLabel.text = contentArr[index];
                                    if (index == contentArr.length - 1) {
                                        Laya.timer.once(delayed, this, () => {
                                            Ani2DAdmin.scale_Alpha(Pre_Dialogue, 1, 1, 1, 0, 0, 0, 150, 1000, () => {
                                                Pre_Dialogue.removeSelf();
                                            });
                                        });
                                    }
                                });
                            }
                        });
                        Dialogue.DialogueNode = Pre_Dialogue;
                    }));
                });
            }
            Dialogue.createVoluntarilyDialogue = createVoluntarilyDialogue;
            function createCommonDialog(parent, x, y, content) {
                let Dialogue_Common;
                Laya.loader.load('Prefab/Dialogue_Common.json', Laya.Handler.create(this, function (prefab) {
                    let _prefab = new Laya.Prefab();
                    _prefab.json = prefab;
                    Dialogue_Common = Laya.Pool.getItemByCreateFun('Dialogue_Common', _prefab.create, _prefab);
                    parent.addChild(Dialogue_Common);
                    Dialogue_Common.pos(x, y);
                    let Content = Dialogue_Common.getChildByName('Dialogue_Common');
                    Content.text = content;
                }));
            }
            Dialogue.createCommonDialog = createCommonDialog;
        })(Dialogue = Lwg.Dialogue || (Lwg.Dialogue = {}));
        let GoldAdmin;
        (function (GoldAdmin) {
            GoldAdmin._num = {
                get value() {
                    return Laya.LocalStorage.getItem('GoldNum') ? Number(Laya.LocalStorage.getItem('GoldNum')) : 0;
                },
                set value(val) {
                    Laya.LocalStorage.setItem('GoldNum', val.toString());
                }
            };
            function _createGoldNode(x, y, parent) {
                if (!parent) {
                    parent = Laya.stage;
                }
                if (GoldAdmin.GoldNode) {
                    GoldAdmin.GoldNode.removeSelf();
                }
                let sp;
                Laya.loader.load('Prefab/LwgGold.json', Laya.Handler.create(this, function (prefab) {
                    let _prefab = new Laya.Prefab();
                    _prefab.json = prefab;
                    sp = Laya.Pool.getItemByCreateFun('gold', _prefab.create, _prefab);
                    let Num = sp.getChildByName('Num');
                    Num.text = ToolsAdmin._Format.formatNumber(GoldAdmin._num.value);
                    parent.addChild(sp);
                    sp.pos(x, y);
                    sp.zOrder = 100;
                    GoldAdmin.GoldNode = sp;
                }));
            }
            GoldAdmin._createGoldNode = _createGoldNode;
            function _add(number) {
                GoldAdmin._num.value += Number(number);
                let Num = GoldAdmin.GoldNode.getChildByName('Num');
                Num.text = ToolsAdmin._Format.formatNumber(GoldAdmin._num.value);
            }
            GoldAdmin._add = _add;
            function _addDisPlay(number) {
                let Num = GoldAdmin.GoldNode.getChildByName('Num');
                Num.value = (Number(Num.value) + Number(number)).toString();
            }
            GoldAdmin._addDisPlay = _addDisPlay;
            function _addNoDisPlay(number) {
                GoldAdmin._num.value += Number(number);
            }
            GoldAdmin._addNoDisPlay = _addNoDisPlay;
            function _nodeAppear(delayed, x, y) {
                if (!GoldAdmin.GoldNode) {
                    return;
                }
                if (delayed) {
                    Ani2DAdmin.scale_Alpha(GoldAdmin.GoldNode, 0, 1, 1, 1, 1, 1, delayed, 0, f => {
                        GoldAdmin.GoldNode.visible = true;
                    });
                }
                else {
                    GoldAdmin.GoldNode.visible = true;
                }
                if (x) {
                    GoldAdmin.GoldNode.x = x;
                }
                if (y) {
                    GoldAdmin.GoldNode.y = y;
                }
            }
            GoldAdmin._nodeAppear = _nodeAppear;
            function _nodeVinish(delayed) {
                if (!GoldAdmin.GoldNode) {
                    return;
                }
                if (delayed) {
                    Ani2DAdmin.scale_Alpha(GoldAdmin.GoldNode, 1, 1, 1, 1, 1, 0, delayed, 0, f => {
                        GoldAdmin.GoldNode.visible = false;
                    });
                }
                else {
                    GoldAdmin.GoldNode.visible = false;
                }
            }
            GoldAdmin._nodeVinish = _nodeVinish;
            let SkinUrl;
            (function (SkinUrl) {
                SkinUrl[SkinUrl["Frame/Effects/iconGold.png"] = 0] = "Frame/Effects/iconGold.png";
            })(SkinUrl || (SkinUrl = {}));
            function _createOne(width, height, url) {
                const Gold = Laya.Pool.getItemByClass('addGold', Laya.Image);
                Gold.name = 'addGold';
                let num = Math.floor(Math.random() * 12);
                Gold.alpha = 1;
                Gold.zOrder = 60;
                Gold.width = width;
                Gold.height = height;
                Gold.pivotX = width / 2;
                Gold.pivotY = height / 2;
                if (!url) {
                    Gold.skin = SkinUrl[0];
                }
                else {
                    Gold.skin = url;
                }
                if (GoldAdmin.GoldNode) {
                    Gold.zOrder = GoldAdmin.GoldNode.zOrder + 10;
                }
                return Gold;
            }
            GoldAdmin._createOne = _createOne;
            function _getAni_Single(parent, number, width, height, url, firstPoint, targetPoint, func1, func2) {
                for (let index = 0; index < number; index++) {
                    Laya.timer.once(index * 30, this, () => {
                        let Gold = _createOne(width, height, url);
                        parent.addChild(Gold);
                        Ani2DAdmin.move_Scale(Gold, 1, firstPoint.x, firstPoint.y, targetPoint.x, targetPoint.y, 1, 350, 0, null, () => {
                            AudioAdmin._playSound(AudioAdmin._voiceUrl.huodejinbi);
                            if (index === number - 1) {
                                Laya.timer.once(200, this, () => {
                                    if (func2) {
                                        func2();
                                    }
                                });
                            }
                            else {
                                if (func1) {
                                    func1();
                                }
                            }
                            Gold.removeSelf();
                        });
                    });
                }
            }
            GoldAdmin._getAni_Single = _getAni_Single;
            function _getAni_Heap(parent, number, width, height, url, firstPoint, targetPoint, func1, func2) {
                for (let index = 0; index < number; index++) {
                    let Gold = _createOne(width ? width : 100, height ? height : 100, url ? url : SkinUrl[0]);
                    parent = parent ? parent : Laya.stage;
                    parent.addChild(Gold);
                    firstPoint = firstPoint ? firstPoint : new Laya.Point(Laya.stage.width / 2, Laya.stage.height / 2);
                    targetPoint = targetPoint ? targetPoint : new Laya.Point(GoldAdmin.GoldNode.x, GoldAdmin.GoldNode.y);
                    let x = Math.floor(Math.random() * 2) == 1 ? firstPoint.x + Math.random() * 100 : firstPoint.x - Math.random() * 100;
                    let y = Math.floor(Math.random() * 2) == 1 ? firstPoint.y + Math.random() * 100 : firstPoint.y - Math.random() * 100;
                    Ani2DAdmin.move_Scale(Gold, 0.5, firstPoint.x, firstPoint.y, x, y, 1, 300, Math.random() * 100 + 100, Laya.Ease.expoIn, () => {
                        Ani2DAdmin.move_Scale(Gold, 1, Gold.x, Gold.y, targetPoint.x, targetPoint.y, 1, 400, Math.random() * 200 + 100, Laya.Ease.cubicOut, () => {
                            AudioAdmin._playSound(AudioAdmin._voiceUrl.huodejinbi);
                            if (index === number - 1) {
                                Laya.timer.once(200, this, () => {
                                    if (func2) {
                                        func2();
                                    }
                                });
                            }
                            else {
                                if (func1) {
                                    func1();
                                }
                            }
                            Gold.removeSelf();
                        });
                    });
                }
            }
            GoldAdmin._getAni_Heap = _getAni_Heap;
        })(GoldAdmin = Lwg.GoldAdmin || (Lwg.GoldAdmin = {}));
        let EventAdmin;
        (function (EventAdmin) {
            EventAdmin.dispatcher = new Laya.EventDispatcher();
            function _register(type, caller, listener) {
                if (!caller) {
                    console.error("事件的执行域必须存在!");
                }
                EventAdmin.dispatcher.on(type.toString(), caller, listener);
            }
            EventAdmin._register = _register;
            function _registerOnce(type, caller, listener) {
                if (!caller) {
                    console.error("事件的执行域必须存在!");
                }
                EventAdmin.dispatcher.once(type.toString(), caller, listener);
            }
            EventAdmin._registerOnce = _registerOnce;
            function _notify(type, args) {
                EventAdmin.dispatcher.event(type.toString(), args);
            }
            EventAdmin._notify = _notify;
            function _off(type, caller, listener) {
                EventAdmin.dispatcher.off(type.toString(), caller, listener);
            }
            EventAdmin._off = _off;
            function _offAll(type) {
                EventAdmin.dispatcher.offAll(type.toString());
            }
            EventAdmin._offAll = _offAll;
            function _offCaller(caller) {
                EventAdmin.dispatcher.offAllCaller(caller);
            }
            EventAdmin._offCaller = _offCaller;
        })(EventAdmin = Lwg.EventAdmin || (Lwg.EventAdmin = {}));
        let DateAdmin;
        (function (DateAdmin) {
            DateAdmin._date = {
                get year() {
                    return (new Date()).getFullYear();
                },
                get month() {
                    return (new Date()).getMonth();
                },
                get date() {
                    return (new Date()).getDate();
                },
                get day() {
                    return (new Date()).getDay();
                },
                get hours() {
                    return (new Date()).getHours();
                },
                get minutes() {
                    return (new Date()).getMinutes();
                },
                get seconds() {
                    return (new Date()).getSeconds();
                },
                get milliseconds() {
                    return (new Date()).getMilliseconds();
                },
                get toLocaleDateString() {
                    return (new Date()).toLocaleDateString();
                },
                get toLocaleTimeString() {
                    return (new Date()).toLocaleTimeString();
                }
            };
            function _init() {
                const d = new Date;
                DateAdmin._loginInfo = StorageAdmin._arrayArr('DateAdmin/loginInfo');
                DateAdmin._loginInfo.value.push([d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getDay(), d.getHours(), d.getMinutes(), d.getSeconds()]);
                let arr = [];
                if (DateAdmin._loginInfo.value.length > 0) {
                    for (let index = 0; index < DateAdmin._loginInfo.value.length; index++) {
                        arr.push(DateAdmin._loginInfo.value[index]);
                    }
                }
                arr.push([d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getDay(), d.getHours(), d.getMinutes(), d.getSeconds()]);
                DateAdmin._loginInfo.value = arr;
                DateAdmin._loginCount = StorageAdmin._num('DateAdmin/_loginCount');
                DateAdmin._loginCount.value++;
                DateAdmin._loginToday.num++;
            }
            DateAdmin._init = _init;
            DateAdmin._loginToday = {
                get num() {
                    return Laya.LocalStorage.getItem('DateAdmin/loginToday') ? Number(Laya.LocalStorage.getItem('DateAdmin/loginToday')) : 0;
                },
                set num(val) {
                    if (DateAdmin._date.date == DateAdmin._loginInfo.value[DateAdmin._loginInfo.value.length - 1][2]) {
                        Laya.LocalStorage.setItem('DateAdmin/loginToday', val.toString());
                    }
                }
            };
            DateAdmin._last = {
                get date() {
                    if (DateAdmin._loginInfo.value.length > 1) {
                        return DateAdmin._loginInfo.value[DateAdmin._loginInfo.value.length - 2][2];
                    }
                    else {
                        return DateAdmin._loginInfo.value[DateAdmin._loginInfo.value.length - 1][2];
                    }
                },
            };
            DateAdmin._front = {
                get date() {
                    return DateAdmin._loginInfo.value[DateAdmin._loginInfo.value.length - 1][2];
                },
            };
        })(DateAdmin = Lwg.DateAdmin || (Lwg.DateAdmin = {}));
        let TimerAdmin;
        (function (TimerAdmin) {
            TimerAdmin._switch = true;
            function _frameLoop(delay, caller, method, immediately, args, coverBefore) {
                if (immediately) {
                    if (TimerAdmin._switch) {
                        method();
                    }
                }
                Laya.timer.frameLoop(delay, caller, () => {
                    if (TimerAdmin._switch) {
                        method();
                    }
                }, args, coverBefore);
            }
            TimerAdmin._frameLoop = _frameLoop;
            function _frameRandomLoop(delay1, delay2, caller, method, immediately, args, coverBefore) {
                if (immediately) {
                    if (TimerAdmin._switch) {
                        method();
                    }
                }
                var func = () => {
                    let delay = ToolsAdmin._Number.randomOneInt(delay1, delay2);
                    Laya.timer.frameOnce(delay, caller, () => {
                        if (TimerAdmin._switch) {
                            method();
                            func();
                        }
                    }, args, coverBefore);
                };
                func();
            }
            TimerAdmin._frameRandomLoop = _frameRandomLoop;
            function _frameNumLoop(delay, num, caller, method, compeletMethod, immediately, args, coverBefore) {
                if (immediately) {
                    if (TimerAdmin._switch) {
                        method();
                    }
                }
                let num0 = 0;
                var func = () => {
                    if (TimerAdmin._switch) {
                        num0++;
                        if (num0 >= num) {
                            method();
                            if (compeletMethod) {
                                compeletMethod();
                            }
                            Laya.timer.clear(caller, func);
                        }
                        else {
                            method();
                        }
                    }
                };
                Laya.timer.frameLoop(delay, caller, func, args, coverBefore);
            }
            TimerAdmin._frameNumLoop = _frameNumLoop;
            function _numRandomLoop(delay1, delay2, num, caller, method, compeletMethod, immediately, args, coverBefore) {
                immediately && TimerAdmin._switch && method();
                let num0 = 0;
                var func = () => {
                    let delay = ToolsAdmin._Number.randomOneInt(delay1, delay2);
                    Laya.timer.frameOnce(delay, caller, () => {
                        if (TimerAdmin._switch) {
                            num0++;
                            if (num0 >= num) {
                                method();
                                compeletMethod();
                            }
                            else {
                                method();
                                func();
                            }
                        }
                    }, args, coverBefore);
                };
                func();
            }
            TimerAdmin._numRandomLoop = _numRandomLoop;
            function _frameNumRandomLoop(delay1, delay2, num, caller, method, compeletMethod, immediately, args, coverBefore) {
                immediately && TimerAdmin._switch && method();
                let num0 = 0;
                var func = () => {
                    let delay = ToolsAdmin._Number.randomOneInt(delay1, delay2);
                    Laya.timer.frameOnce(delay, caller, () => {
                        if (TimerAdmin._switch) {
                            num0++;
                            if (num0 >= num) {
                                method();
                                compeletMethod && compeletMethod();
                            }
                            else {
                                method();
                                func();
                            }
                        }
                    }, args, coverBefore);
                };
                func();
            }
            TimerAdmin._frameNumRandomLoop = _frameNumRandomLoop;
            function _frameOnce(delay, caller, afterMethod, beforeMethod, args, coverBefore) {
                beforeMethod && beforeMethod();
                Laya.timer.frameOnce(delay, caller, () => {
                    afterMethod();
                }, args, coverBefore);
            }
            TimerAdmin._frameOnce = _frameOnce;
            function _frameNumOnce(delay, num, caller, afterMethod, beforeMethod, args, coverBefore) {
                for (let index = 0; index < num; index++) {
                    if (beforeMethod) {
                        beforeMethod();
                    }
                    Laya.timer.frameOnce(delay, caller, () => {
                        afterMethod();
                    }, args, coverBefore);
                }
            }
            TimerAdmin._frameNumOnce = _frameNumOnce;
            function _loop(delay, caller, method, immediately, args, coverBefore) {
                if (immediately) {
                    if (TimerAdmin._switch) {
                        method();
                    }
                }
                Laya.timer.loop(delay, caller, () => {
                    if (TimerAdmin._switch) {
                        method();
                    }
                }, args, coverBefore);
            }
            TimerAdmin._loop = _loop;
            function _randomLoop(delay1, delay2, caller, method, immediately, args, coverBefore) {
                if (immediately) {
                    if (TimerAdmin._switch) {
                        method();
                    }
                }
                var func = () => {
                    let delay = ToolsAdmin._Number.randomOneInt(delay1, delay2);
                    Laya.timer.once(delay, caller, () => {
                        if (TimerAdmin._switch) {
                            method();
                            func();
                        }
                    }, args, coverBefore);
                };
                func();
            }
            TimerAdmin._randomLoop = _randomLoop;
            function _numLoop(delay, num, caller, method, compeletMethod, immediately, args, coverBefore) {
                if (immediately) {
                    method();
                }
                let num0 = 0;
                var func = () => {
                    if (TimerAdmin._switch) {
                        num0++;
                        if (num0 > num) {
                            method();
                            if (compeletMethod) {
                                compeletMethod();
                            }
                            Laya.timer.clear(caller, func);
                        }
                        else {
                            method();
                        }
                    }
                };
                Laya.timer.loop(delay, caller, func, args, coverBefore);
            }
            TimerAdmin._numLoop = _numLoop;
            function _once(delay, caller, afterMethod, beforeMethod, args, coverBefore) {
                if (beforeMethod) {
                    beforeMethod();
                }
                Laya.timer.once(delay, caller, () => {
                    afterMethod();
                }, args, coverBefore);
            }
            TimerAdmin._once = _once;
            function _clearAll(arr) {
                for (let index = 0; index < arr.length; index++) {
                    Laya.timer.clearAll(arr[index]);
                }
            }
            TimerAdmin._clearAll = _clearAll;
            function _clear(arr) {
                for (let index = 0; index < arr.length; index++) {
                    Laya.timer.clear(arr[index][0], arr[index][1]);
                }
            }
            TimerAdmin._clear = _clear;
        })(TimerAdmin = Lwg.TimerAdmin || (Lwg.TimerAdmin = {}));
        let AdaptiveAdmin;
        (function (AdaptiveAdmin) {
            AdaptiveAdmin._Use = {
                get value() {
                    return this['Adaptive/value'] ? this['Adaptive/value'] : null;
                },
                set value(val) {
                    this['Adaptive/value'] = val;
                }
            };
            function _stageWidth(arr) {
                for (let index = 0; index < arr.length; index++) {
                    const element = arr[index];
                    if (element.pivotX == 0 && element.width) {
                        element.x = element.x / AdaptiveAdmin._Use.value[0] * Laya.stage.width + element.width / 2;
                    }
                    else {
                        element.x = element.x / AdaptiveAdmin._Use.value[0] * Laya.stage.width;
                    }
                }
            }
            AdaptiveAdmin._stageWidth = _stageWidth;
            function _stageHeight(arr) {
                for (let index = 0; index < arr.length; index++) {
                    const element = arr[index];
                    if (element.pivotY == 0 && element.height) {
                        element.y = element.y / AdaptiveAdmin._Use.value[1] * element.scaleX * Laya.stage.height + element.height / 2;
                    }
                    else {
                        element.y = element.y / AdaptiveAdmin._Use.value[1] * element.scaleX * Laya.stage.height;
                    }
                }
            }
            AdaptiveAdmin._stageHeight = _stageHeight;
            function _center(arr, target) {
                for (let index = 0; index < arr.length; index++) {
                    const element = arr[index];
                    if (element.width > 0) {
                        element.x = target.width / 2 - (element.width / 2 - element.pivotX) * element.scaleX;
                    }
                    else {
                        element.x = target.width / 2;
                    }
                    if (element.height > 0) {
                        element.y = target.height / 2 - (element.height / 2 - element.pivotY) * element.scaleY;
                    }
                    else {
                        element.y = target.height / 2;
                    }
                }
            }
            AdaptiveAdmin._center = _center;
        })(AdaptiveAdmin = Lwg.AdaptiveAdmin || (Lwg.AdaptiveAdmin = {}));
        let SceneAniAdmin;
        (function (SceneAniAdmin) {
            SceneAniAdmin._openSwitch = {
                get value() {
                    return this['openSwitch'] ? this['openSwitch'] : false;
                },
                set value(val) {
                    if (val) {
                        SceneAniAdmin._closeSwitch.value = false;
                    }
                    this['openSwitch'] = val;
                }
            };
            SceneAniAdmin._closeSwitch = {
                get value() {
                    return this['closeSwitch'] ? this['closeSwitch'] : false;
                },
                set value(val) {
                    if (val) {
                        SceneAniAdmin._openSwitch.value = false;
                    }
                    this['closeSwitch'] = val;
                }
            };
            SceneAniAdmin._Use = {
                get value() {
                    return this['SceneAnimation/name'] ? this['SceneAnimation/name'] : null;
                },
                set value(val) {
                    this['SceneAnimation/name'] = val;
                }
            };
            SceneAniAdmin._closeAniDelay = 0;
            SceneAniAdmin._closeAniTime = 0;
            function _commonOpenAni(Scene) {
                var afterAni = () => {
                    LwgScene._SceneServe._close();
                    LwgClick._aniSwitch = true;
                    if (Scene[Scene.name]) {
                        Scene[Scene.name].lwgOpenAniAfter();
                        Scene[Scene.name].lwgButton();
                    }
                };
                if (!SceneAniAdmin._openSwitch.value) {
                    LwgScene._SceneServe._close();
                    Laya.timer.once(SceneAniAdmin._closeAniDelay + SceneAniAdmin._closeAniTime, this, () => {
                        afterAni();
                    });
                    return 0;
                }
                let sumDelay = 0;
                sumDelay = SceneAniAdmin._Use.value.class['_paly'](SceneAniAdmin._Use.value.type, Scene);
                Laya.timer.once(sumDelay, this, () => {
                    afterAni();
                });
                return sumDelay;
            }
            SceneAniAdmin._commonOpenAni = _commonOpenAni;
            function _commonCloseAni(CloseScene) {
                return SceneAniAdmin._Use.value.class['_paly'](SceneAniAdmin._Use.value.type, CloseScene);
            }
            SceneAniAdmin._commonCloseAni = _commonCloseAni;
            let _fadeOut;
            (function (_fadeOut) {
                let _time = 700;
                let _delay = 150;
                class Close {
                    static _paly(type, Scene) {
                        _fadeOut_Close(Scene);
                        SceneAniAdmin._closeAniDelay = _delay;
                        SceneAniAdmin._closeAniTime = _time;
                        return _time + _delay;
                    }
                    ;
                }
                _fadeOut.Close = Close;
                class Open {
                    static _paly(type, Scene) {
                        _fadeOut_Open(Scene);
                        return _time + _delay;
                    }
                    ;
                }
                _fadeOut.Open = Open;
                function _fadeOut_Open(Scene) {
                    let time = 400;
                    let delay = 300;
                    if (Scene['Background']) {
                        Ani2DAdmin.fadeOut(Scene, 0, 1, time / 2, delay);
                    }
                    Ani2DAdmin.fadeOut(Scene, 0, 1, time, 0);
                    return time + delay;
                }
                function _fadeOut_Close(Scene) {
                    let time = 150;
                    let delay = 50;
                    if (Scene['Background']) {
                        Ani2DAdmin.fadeOut(Scene, 1, 0, time / 2);
                    }
                    Ani2DAdmin.fadeOut(Scene, 1, 0, time, delay);
                    return time + delay;
                }
            })(_fadeOut = SceneAniAdmin._fadeOut || (SceneAniAdmin._fadeOut = {}));
            let _shutters;
            (function (_shutters) {
                let _num = 10;
                let _time = 700;
                let _delay = 150;
                function _moveClose(sp, tex, scaleX, scealeY) {
                    Ani2DAdmin.scale(sp, 1, 1, scaleX, scealeY, _time, 0, () => {
                        tex.disposeBitmap();
                        tex.destroy();
                        sp.destroy();
                    });
                }
                function _moveOpen(sp, tex, scaleX, scealeY) {
                    Ani2DAdmin.scale(sp, scaleX, scealeY, 1, 1, _time, 0, () => {
                        tex.disposeBitmap();
                        tex.destroy();
                        sp.destroy();
                    });
                }
                function _moveRule(sp, tex, scaleModul, open) {
                    if (open) {
                        if (scaleModul === 'x') {
                            _moveOpen(sp, tex, 0, 1);
                        }
                        else {
                            _moveOpen(sp, tex, 1, 0);
                        }
                    }
                    else {
                        if (scaleModul === 'x') {
                            _moveClose(sp, tex, 0, 1);
                        }
                        else {
                            _moveClose(sp, tex, 1, 0);
                        }
                    }
                }
                function _createNoMaskSp(x, y, width, height, tex, scaleModul, open) {
                    const sp = new Laya.Sprite;
                    Laya.stage.addChild(sp);
                    sp.name = 'shutters';
                    sp.zOrder = 1000;
                    sp.pos(x, y);
                    sp.size(width, height);
                    ToolsAdmin._Node.changePivot(sp, width / 2, height / 2);
                    sp.texture = tex;
                    _moveRule(sp, tex, scaleModul, open);
                    return sp;
                }
                function _createMaskSp(Scene, scaleModul, open) {
                    const sp = new Laya.Sprite;
                    Laya.stage.addChild(sp);
                    const _width = Laya.stage.width;
                    const _height = Laya.stage.height;
                    sp.size(_width, _height);
                    sp.pos(0, 0);
                    sp.zOrder = 1000;
                    sp.name = 'shutters';
                    const tex = Scene.drawToTexture(_width, _height, 0, 0);
                    sp.texture = tex;
                    _moveRule(sp, tex, scaleModul, open);
                    return sp;
                }
                function _createMask(sp) {
                    const Mask = new Laya.Image;
                    Mask.skin = `Lwg/UI/ui_orthogon_cycn.png`;
                    Mask.sizeGrid = '12,12,12,12';
                    sp.mask = Mask;
                    Mask.anchorX = Mask.anchorY = 0.5;
                    return Mask;
                }
                function _crosswise(Scene, open) {
                    for (let index = 0; index < _num; index++) {
                        const _width = Scene.width / _num;
                        const _height = Laya.stage.height;
                        const tex = Scene.drawToTexture(_width, _height, -_width * index, 0);
                        _createNoMaskSp(_width * index, 0, _width, _height, tex, 'x', open);
                    }
                }
                _shutters._crosswise = _crosswise;
                function _vertical(Scene, open) {
                    for (let index = 0; index < _num; index++) {
                        const _width = Scene.width;
                        const _height = Laya.stage.height / _num;
                        const tex = Scene.drawToTexture(_width, _height, 0, -_height * index);
                        _createNoMaskSp(0, _height * index, _width, _height, tex, 'y', false);
                    }
                }
                _shutters._vertical = _vertical;
                function _croAndVer(Scene, open) {
                    const num = _num - 2;
                    for (let index = 0; index < num; index++) {
                        const _width = Scene.width / num;
                        const _height = Laya.stage.height;
                        const tex = Scene.drawToTexture(_width, _height, -_width * index, 0);
                        _createNoMaskSp(_width * index, 0, _width, _height, tex, 'x', false);
                    }
                    for (let index = 0; index < num; index++) {
                        const _width = Scene.width;
                        const _height = Laya.stage.height / num;
                        const tex = Scene.drawToTexture(_width, _height, 0, -_height * index);
                        _createNoMaskSp(0, _height * index, _width, _height, tex, 'y', open);
                    }
                }
                _shutters._croAndVer = _croAndVer;
                function _rSideling(Scene, open) {
                    for (let index = 0; index < _num; index++) {
                        let addLen = 1000;
                        const sp = _createMaskSp(Scene, 'x', open);
                        const Mask = _createMask(sp);
                        Mask.size(Math.round(Laya.stage.width / _num), Math.round(Laya.stage.height + addLen));
                        Mask.pos(Math.round(Laya.stage.width / _num * index), Math.round(-addLen / 2));
                        ToolsAdmin._Node.changePivot(Mask, Math.round(Mask.width / 2), Math.round(Mask.height / 2));
                        ToolsAdmin._Node.changePivot(sp, Math.round(index * sp.width / _num + sp.width / _num / 2), Math.round(sp.height / 2));
                        Mask.rotation = -10;
                    }
                }
                _shutters._rSideling = _rSideling;
                function _lSideling(Scene, open) {
                    for (let index = 0; index < _num; index++) {
                        const sp = _createMaskSp(Scene, 'x', open);
                        const Mask = _createMask(sp);
                        Mask.size(Math.round(Laya.stage.width / _num), Math.round(Laya.stage.height + 1000));
                        Mask.pos(Math.round(Laya.stage.width / _num * index), -1000 / 2);
                        ToolsAdmin._Node.changePivot(Mask, Math.round(Mask.width / 2), Math.round(Mask.height / 2));
                        ToolsAdmin._Node.changePivot(sp, Math.round(index * sp.width / _num + sp.width / _num / 2), Math.round(sp.height / 2));
                        Mask.rotation = 10;
                    }
                }
                _shutters._lSideling = _lSideling;
                function _sidelingIntersection(Scene, open) {
                    for (let index = 0; index < _num; index++) {
                        let addLen = 1000;
                        const sp1 = _createMaskSp(Scene, 'x', open);
                        const Mask1 = _createMask(sp1);
                        Mask1.width = Math.round(Laya.stage.width / _num);
                        Mask1.height = Math.round(Laya.stage.height + addLen);
                        Mask1.pos(Math.round(Laya.stage.width / _num * index), Math.round(-addLen / 2));
                        ToolsAdmin._Node.changePivot(Mask1, Math.round(Mask1.width / 2), Math.round(Mask1.height / 2));
                        ToolsAdmin._Node.changePivot(sp1, Math.round(index * sp1.width / _num + sp1.width / _num / 2), Math.round(sp1.height / 2));
                        Mask1.rotation = -15;
                        const sp2 = _createMaskSp(Scene, 'x', open);
                        const Mask2 = _createMask(sp2);
                        Mask2.width = Laya.stage.width / _num;
                        Mask2.height = Laya.stage.height + addLen;
                        Mask2.pos(Laya.stage.width / _num * index, -addLen / 2);
                        ToolsAdmin._Node.changePivot(Mask2, Mask2.width / 2, Mask2.height / 2);
                        ToolsAdmin._Node.changePivot(sp2, index * sp2.width / _num + sp2.width / _num / 2, sp2.height / 2);
                        Mask2.rotation = 15;
                    }
                }
                _shutters._sidelingIntersection = _sidelingIntersection;
                function _randomCroAndVer(Scene, open) {
                    const index = ToolsAdmin._Array.randomGetOne([0, 1, 2]);
                    switch (index) {
                        case 0:
                            _crosswise(Scene, open);
                            break;
                        case 1:
                            _vertical(Scene, open);
                            break;
                        case 2:
                            _croAndVer(Scene, open);
                            break;
                        default:
                            _crosswise(Scene, open);
                            break;
                    }
                }
                _shutters._randomCroAndVer = _randomCroAndVer;
                function _random(Scene, open) {
                    const index = ToolsAdmin._Array.randomGetOne([0, 1, 2, 3, 4, 5]);
                    switch (index) {
                        case 0:
                            _crosswise(Scene, open);
                            break;
                        case 1:
                            _vertical(Scene, open);
                            break;
                        case 2:
                            _croAndVer(Scene, open);
                            break;
                        case 3:
                            _sidelingIntersection(Scene, open);
                            break;
                        case 4:
                            _lSideling(Scene, open);
                            break;
                        case 5:
                            _rSideling(Scene, open);
                            break;
                        default:
                            _crosswise(Scene, open);
                            break;
                    }
                }
                _shutters._random = _random;
                class Close {
                    static _paly(type, Scene) {
                        TimerAdmin._once(_delay, this, () => {
                            _shutters[`_${type}`](Scene, false);
                            Scene.visible = false;
                        });
                        SceneAniAdmin._closeAniDelay = _delay;
                        SceneAniAdmin._closeAniTime = _time;
                        return _time + _delay;
                    }
                    ;
                }
                Close._type = {
                    crosswise: 'crosswise',
                    vertical: 'vertical',
                    croAndVer: 'croAndVer',
                    rSideling: 'rSideling',
                    sidelingIntersection: 'sidelingIntersection',
                    randomCroAndVer: 'randomCroAndVer',
                    random: 'random',
                };
                _shutters.Close = Close;
                class Open {
                    static _paly(type, Scene) {
                        TimerAdmin._once(_delay, this, () => {
                            _shutters[`_${type}`](Scene, true);
                            Scene.visible = false;
                            TimerAdmin._once(_time, this, () => {
                                Scene.visible = true;
                            });
                        });
                        return _time + _delay;
                    }
                    ;
                }
                Open._type = {
                    crosswise: 'crosswise',
                    vertical: 'vertical',
                    croAndVer: 'croAndVer',
                    _sidelingIntersection: '_sidelingIntersection',
                    randomCroAndVer: 'randomCroAndVer',
                    random: 'random',
                };
                _shutters.Open = Open;
            })(_shutters = SceneAniAdmin._shutters || (SceneAniAdmin._shutters = {}));
            let _stickIn;
            (function (_stickIn_1) {
                function _stickIn(Scene, type) {
                    let sumDelay = 0;
                    let time = 700;
                    let delay = 100;
                    if (Scene.getChildByName('Background')) {
                        Ani2DAdmin.fadeOut(Scene.getChildByName('Background'), 0, 1, time);
                    }
                    let stickInLeftArr = ToolsAdmin._Node.childZOrderByY(Scene, false);
                    for (let index = 0; index < stickInLeftArr.length; index++) {
                        const element = stickInLeftArr[index];
                        if (element.name !== 'Background' && element.name.substr(0, 5) !== 'NoAni') {
                            let originalPovitX = element.pivotX;
                            let originalPovitY = element.pivotY;
                            let originalX = element.x;
                            let originalY = element.y;
                            element.x = element.pivotX > element.width / 2 ? 800 + element.width : -800 - element.width;
                            element.y = element.rotation > 0 ? element.y + 200 : element.y - 200;
                            Ani2DAdmin.rotate(element, 0, time, delay * index);
                            Ani2DAdmin.move(element, originalX, originalY, time, () => {
                                ToolsAdmin._Node.changePivot(element, originalPovitX, originalPovitY);
                            }, delay * index);
                        }
                    }
                    sumDelay = Scene.numChildren * delay + time + 200;
                    return sumDelay;
                }
            })(_stickIn = SceneAniAdmin._stickIn || (SceneAniAdmin._stickIn = {}));
        })(SceneAniAdmin = Lwg.SceneAniAdmin || (Lwg.SceneAniAdmin = {}));
        let StorageAdmin;
        (function (StorageAdmin) {
            class admin {
                removeSelf() { }
                func() { }
            }
            class _NumVariable extends admin {
            }
            StorageAdmin._NumVariable = _NumVariable;
            class _StrVariable extends admin {
            }
            StorageAdmin._StrVariable = _StrVariable;
            class _BoolVariable extends admin {
            }
            StorageAdmin._BoolVariable = _BoolVariable;
            class _ArrayVariable extends admin {
            }
            StorageAdmin._ArrayVariable = _ArrayVariable;
            class _ArrayArrVariable extends admin {
            }
            StorageAdmin._ArrayArrVariable = _ArrayArrVariable;
            class _Object extends admin {
            }
            StorageAdmin._Object = _Object;
            function _num(name, _func, initial) {
                if (!this[`_num${name}`]) {
                    const obj = {
                        get value() {
                            if (Laya.LocalStorage.getItem(name)) {
                                return Number(Laya.LocalStorage.getItem(name));
                            }
                            else {
                                initial = initial ? initial : 0;
                                Laya.LocalStorage.setItem(name, initial.toString());
                                return initial;
                            }
                        },
                        set value(data) {
                            Laya.LocalStorage.setItem(name, data.toString());
                            this['func']();
                        },
                        removeSelf() {
                            Laya.LocalStorage.removeItem(name);
                        },
                        func() {
                            this['_func'] && this['_func']();
                        }
                    };
                    this[`_num${name}`] = obj;
                }
                if (_func) {
                    this[`_num${name}`]['_func'] = _func;
                }
                return this[`_num${name}`];
            }
            StorageAdmin._num = _num;
            function _str(name, _func, initial) {
                if (!this[`_str${name}`]) {
                    this[`_str${name}`] = {
                        get value() {
                            if (Laya.LocalStorage.getItem(name)) {
                                return Laya.LocalStorage.getItem(name);
                            }
                            else {
                                initial = initial ? initial : null;
                                Laya.LocalStorage.setItem(name, initial.toString());
                                return initial;
                            }
                        },
                        set value(data) {
                            Laya.LocalStorage.setItem(name, data.toString());
                            this['func']();
                        },
                        removeSelf() {
                            Laya.LocalStorage.removeItem(name);
                        },
                        func() {
                            this['_func'] && this['_func']();
                        }
                    };
                }
                if (_func) {
                    this[`_str${name}`]['_func'] = _func;
                }
                return this[`_str${name}`];
            }
            StorageAdmin._str = _str;
            function _bool(name, _func, initial) {
                if (!this[`_bool${name}`]) {
                    this[`_bool${name}`] = {
                        get value() {
                            if (Laya.LocalStorage.getItem(name)) {
                                if (Laya.LocalStorage.getItem(name) === "false") {
                                    return false;
                                }
                                else if (Laya.LocalStorage.getItem(name) === "true") {
                                    return true;
                                }
                            }
                            else {
                                if (initial) {
                                    Laya.LocalStorage.setItem(name, "true");
                                }
                                else {
                                    Laya.LocalStorage.setItem(name, "false");
                                }
                                this['func']();
                                return initial;
                            }
                        },
                        set value(bool) {
                            bool = bool ? "true" : "false";
                            Laya.LocalStorage.setItem(name, bool.toString());
                        },
                        removeSelf() {
                            Laya.LocalStorage.removeItem(name);
                        },
                        func() {
                            _func && _func();
                        }
                    };
                }
                if (_func) {
                    this[`_bool${name}`]['_func'] = _func;
                }
                return this[`_bool${name}`];
            }
            StorageAdmin._bool = _bool;
            function _array(name, _func, initial) {
                if (!this[`_array${name}`]) {
                    this[`_array${name}`] = {
                        get value() {
                            try {
                                let data = Laya.LocalStorage.getJSON(name);
                                if (data) {
                                    return JSON.parse(data);
                                }
                                else {
                                    initial = initial ? initial : [];
                                    Laya.LocalStorage.setJSON(name, JSON.stringify(initial));
                                    this['func']();
                                    return initial;
                                }
                            }
                            catch (error) {
                                return [];
                            }
                        },
                        set value(array) {
                            Laya.LocalStorage.setJSON(name, JSON.stringify(array));
                        },
                        removeSelf() {
                            Laya.LocalStorage.removeItem(name);
                        },
                        func() {
                            _func && _func();
                        }
                    };
                }
                if (_func) {
                    this[`_array${name}`]['_func'] = _func;
                }
                return this[`_array${name}`];
            }
            StorageAdmin._array = _array;
            function _obj(name, _func, initial) {
                if (!this[`_obj${name}`]) {
                    this[`_obj${name}`] = {
                        get value() {
                            try {
                                let data = Laya.LocalStorage.getJSON(name);
                                if (data) {
                                    return JSON.parse(data);
                                }
                                else {
                                    initial = initial ? initial : {};
                                    Laya.LocalStorage.setJSON(name, JSON.stringify(initial));
                                    this['func']();
                                    return initial;
                                }
                            }
                            catch (error) {
                                return {};
                            }
                        },
                        set value(array) {
                            Laya.LocalStorage.setJSON(name, JSON.stringify(array));
                        },
                        removeSelf() {
                            Laya.LocalStorage.removeItem(name);
                        },
                        func() {
                            _func && _func();
                        }
                    };
                }
                if (_func) {
                    this[`_obj${name}`]['_func'] = _func;
                }
                return this[`_obj${name}`];
            }
            StorageAdmin._obj = _obj;
            function _arrayArr(name, _func, initial) {
                if (!this[`_arrayArr${name}`]) {
                    this[`_arrayArr${name}`] = {
                        get value() {
                            try {
                                let data = Laya.LocalStorage.getJSON(name);
                                if (data) {
                                    return JSON.parse(data);
                                    ;
                                }
                                else {
                                    initial = initial ? initial : [];
                                    Laya.LocalStorage.setItem(name, initial.toString());
                                    return initial;
                                }
                            }
                            catch (error) {
                                return [];
                            }
                        },
                        set value(array) {
                            Laya.LocalStorage.setJSON(name, JSON.stringify(array));
                            this['func']();
                        },
                        removeSelf() {
                            Laya.LocalStorage.removeItem(name);
                        },
                        func() {
                            _func && _func();
                        }
                    };
                }
                if (_func) {
                    this[`_arrayArr${name}`]['_func'] = _func;
                }
                return this[`_arrayArr${name}`];
            }
            StorageAdmin._arrayArr = _arrayArr;
        })(StorageAdmin = Lwg.StorageAdmin || (Lwg.StorageAdmin = {}));
        let DataAdmin;
        (function (DataAdmin) {
            class _BaseProperty {
                constructor() {
                    this.name = 'name';
                    this.serial = 'serial';
                    this.sort = 'sort';
                    this.chName = 'chName';
                    this.classify = 'classify';
                    this.unlockWay = 'unlockWay';
                    this.otherUnlockWay = 'otherUnlockWay';
                    this.conditionNum = 'conditionNum';
                    this.otherConditionNum = 'otherConditionNum';
                    this.degreeNum = 'degreeNum';
                    this.otherDegreeNum = 'otherDegreeNum';
                    this.rewardType = 'otherGetAward';
                    this.otherRewardType = 'otherRewardType';
                    this.complete = 'complete';
                    this.otherComplete = 'otherComplete';
                    this.getAward = 'getAward';
                    this.otherGetAward = 'otherGetAward';
                    this.pitch = 'pitch';
                }
            }
            DataAdmin._BaseProperty = _BaseProperty;
            ;
            DataAdmin._unlockWayType = {
                ads: 'ads',
                gold: 'gold',
                diamond: 'diamond',
                customs: 'customs',
                check: 'check',
                free: 'free',
            };
            class _Item extends SceneAdmin._ObjectBase {
                constructor() {
                    super(...arguments);
                    this.$data = null;
                    this.$unlockWayType = DataAdmin._unlockWayType;
                }
                get $dataIndex() { return this['item/dataIndex']; }
                set $dataIndex(_dataIndex) { this['item/dataIndex'] = _dataIndex; }
                get $dataArrName() { return this['item/dataArrName']; }
                set $dataArrName(name) {
                    this['item/dataArrName'] = name;
                }
                $render() { }
                ;
                lwglistRender(data, index) {
                    this.$data = data;
                    this.$dataIndex = index;
                    if (!this.$data)
                        return;
                    this.$render();
                }
                $button() { }
                ;
                $awake() { }
                ;
                lwgOnAwake() {
                    this.$awake();
                    this.$button();
                }
            }
            DataAdmin._Item = _Item;
            class _Table {
                constructor(tableName, _tableArr, localStorage, lastVtableName, lastProArr) {
                    this._unlockWay = DataAdmin._unlockWayType;
                    this._tableName = 'name';
                    this._lastArr = [];
                    this._localStorage = false;
                    this._property = new _BaseProperty;
                    if (tableName) {
                        this._tableName = tableName;
                        if (localStorage) {
                            this._localStorage = localStorage;
                            this._arr = addCompare(_tableArr, tableName, this._property.name);
                            if (lastVtableName) {
                                if (lastProArr) {
                                    this._compareLastInforByPro(lastVtableName, lastProArr);
                                }
                                else {
                                    this._compareLastDefaultPro(lastVtableName);
                                }
                            }
                        }
                        else {
                            this._arr = _tableArr;
                        }
                    }
                }
                get _arr() {
                    return this[`_${this._tableName}arr`];
                }
                set _arr(arr) {
                    this[`_${this._tableName}arr`] = arr;
                    Laya.LocalStorage.setJSON(this._tableName, JSON.stringify(this[`_${this._tableName}arr`]));
                }
                get _List() {
                    return this[`${this._tableName}_List`];
                }
                set _List(list) {
                    this[`${this._tableName}_List`] = list;
                    list.array = this._arr;
                    list.selectEnable = false;
                    list.vScrollBarSkin = "";
                    list.renderHandler = new Laya.Handler(this, (cell, index) => {
                        if (this._listRenderScript) {
                            let _item = cell.getComponent(this._listRenderScript);
                            if (!_item) {
                                _item = cell.addComponent(this._listRenderScript);
                            }
                            _item.lwglistRender(this._listArray[index], index);
                        }
                    });
                    list.selectHandler = new Laya.Handler(this, (index) => {
                        this._listSelect && this._listSelect(index);
                    });
                }
                get _listArray() {
                    return this._List.array;
                }
                set _listArray(arr) {
                    this._List.array = arr;
                    this._List.scrollTo(0);
                    this._refreshAndStorage();
                }
                _refreshAndStorage() {
                    if (this._localStorage) {
                        Laya.LocalStorage.setJSON(this._tableName, JSON.stringify(this._arr));
                    }
                    if (this._List) {
                        this._List.refresh();
                    }
                }
                _compareLastInforByPro(lastVtableName, proArr) {
                    this._lastArr = this._getlastVersion(lastVtableName);
                    for (let index = 0; index < this._lastArr.length; index++) {
                        const elementLast = this._lastArr[index];
                        for (let index = 0; index < this._arr.length; index++) {
                            const element = this._arr[index];
                            if (elementLast.name === element.name) {
                                for (let index = 0; index < proArr.length; index++) {
                                    const proName = proArr[index];
                                    element[proName] = elementLast[proName];
                                }
                            }
                        }
                    }
                    this._refreshAndStorage();
                }
                _compareLastDefaultPro(lastVtableName) {
                    this._lastArr = this._getlastVersion(lastVtableName);
                    if (this._lastArr.length > 0) {
                        for (let i = 0; i < this._lastArr.length; i++) {
                            const _lastelement = this._lastArr[i];
                            for (let j = 0; j < this._arr.length; j++) {
                                const element = this._arr[j];
                                if (_lastelement.complete) {
                                    element.complete = true;
                                }
                                if (_lastelement.getAward) {
                                    element.getAward = true;
                                }
                                if (_lastelement.degreeNum > element.degreeNum) {
                                    element.degreeNum = _lastelement.degreeNum;
                                }
                            }
                        }
                    }
                    this._refreshAndStorage();
                }
                _getlastVersion(lastVtableName) {
                    let dataArr = [];
                    try {
                        if (Laya.LocalStorage.getJSON(lastVtableName)) {
                            dataArr = JSON.parse(Laya.LocalStorage.getJSON(lastVtableName));
                        }
                    }
                    catch (error) {
                        console.log(lastVtableName + '前版本不存在！');
                    }
                    return dataArr;
                }
                _getProperty(name, pro) {
                    let value;
                    for (const key in this._arr) {
                        if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
                            const element = this._arr[key];
                            if (element.name === name) {
                                value = element[pro];
                                break;
                            }
                        }
                    }
                    return value;
                }
                ;
                _geConditionNumByName(name, pro) {
                    let value;
                    for (const key in this._arr) {
                        if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
                            const element = this._arr[key];
                            if (element.name === name) {
                                value = element.conditionNum;
                                break;
                            }
                        }
                    }
                    return value;
                }
                ;
                _getPitchIndexInArr() {
                    for (let index = 0; index < this._arr.length; index++) {
                        const element = this._arr[index];
                        if (element.name === this._pitchName) {
                            return index;
                        }
                    }
                }
                _getPitchIndexInListArr() {
                    if (this._List) {
                        for (let index = 0; index < this._List.array.length; index++) {
                            const element = this._List.array[index];
                            if (element.name === this._pitchName) {
                                return index;
                            }
                        }
                    }
                }
                _listTweenToPitch(time, func) {
                    const index = this._getPitchIndexInListArr();
                    index && this._List.tweenTo(index, time, Laya.Handler.create(this, () => {
                        func && func();
                    }));
                }
                _listTweenToDiffIndexByPitch(diffIndex, time, func) {
                    const index = this._getPitchIndexInListArr();
                    index && this._List.tweenTo(index + diffIndex, time, Laya.Handler.create(this, () => {
                        func && func();
                    }));
                }
                _listScrollToFirstByLast() {
                    const index = this._List.array.length - 1;
                    index && this._List.scrollTo(index);
                }
                _setProperty(name, pro, value) {
                    for (const key in this._arr) {
                        if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
                            const element = this._arr[key];
                            if (element.name == name) {
                                element[pro] = value;
                                this._refreshAndStorage();
                                break;
                            }
                        }
                    }
                    return value;
                }
                ;
                _setCompleteByName(name) {
                    for (const key in this._arr) {
                        if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
                            const element = this._arr[key];
                            if (element.name == name) {
                                element.complete = true;
                                this._refreshAndStorage();
                                return;
                            }
                        }
                    }
                }
                ;
                _setCompleteByNameArr(nameArr) {
                    for (let index = 0; index < this._arr.length; index++) {
                        const element = this._arr[index];
                        for (let index = 0; index < nameArr.length; index++) {
                            const name = nameArr[index];
                            if (element.name === name) {
                                element.complete = true;
                            }
                        }
                    }
                    this._refreshAndStorage();
                }
                ;
                _getObjByName(name) {
                    let obj = null;
                    for (const key in this._arr) {
                        if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
                            const element = this._arr[key];
                            if (element.name == name) {
                                obj = element;
                                break;
                            }
                        }
                    }
                    return obj;
                }
                _setProSoleByClassify(name, pro, value) {
                    const obj = this._getObjByName(name);
                    const objArr = this._getArrByClassify(obj[this._property.classify]);
                    for (const key in objArr) {
                        if (Object.prototype.hasOwnProperty.call(objArr, key)) {
                            const element = objArr[key];
                            if (element.name == name) {
                                element[pro] = value;
                            }
                            else {
                                element[pro] = !value;
                            }
                        }
                    }
                    this._refreshAndStorage();
                }
                _setOneProForAll(pro, value) {
                    for (let index = 0; index < this._arr.length; index++) {
                        const element = this._arr[index];
                        element[pro] = value;
                    }
                    this._refreshAndStorage();
                }
                _setAllComplete() {
                    this._setOneProForAll(this._property.complete, true);
                    this._refreshAndStorage();
                }
                _setCompleteName(name) {
                    this._setProperty(name, this._property.complete, true);
                    this._refreshAndStorage();
                }
                _setOtherCompleteName(name) {
                    this._setProperty(name, this._property.otherComplete, true);
                    this._refreshAndStorage();
                }
                _setAllCompleteDelay(delay, eachFrontFunc, eachEndFunc, comFunc) {
                    for (let index = 0; index < this._arr.length; index++) {
                        TimerAdmin._once(delay * index, this, () => {
                            const element = this._arr[index];
                            eachFrontFunc && eachFrontFunc(element.complete);
                            element.complete = true;
                            eachEndFunc && eachEndFunc();
                            if (index === this._arr.length - 1) {
                                comFunc && comFunc();
                            }
                            this._refreshAndStorage();
                        });
                    }
                }
                _setAllOtherComplete() {
                    this._setOneProForAll(this._property.otherComplete, true);
                    this._refreshAndStorage();
                }
                _setAllOtherCompleteDelay(delay, eachFrontFunc, eachEndFunc, comFunc) {
                    for (let index = 0; index < this._arr.length; index++) {
                        TimerAdmin._once(delay * index, this, () => {
                            const element = this._arr[index];
                            eachFrontFunc && eachFrontFunc(element[this._property.otherComplete]);
                            element[this._property.otherComplete] = true;
                            eachEndFunc && eachEndFunc();
                            if (index === this._arr.length - 1) {
                                comFunc && comFunc();
                            }
                            this._refreshAndStorage();
                        });
                    }
                }
                _addProValueForAll(pro, valueFunc) {
                    for (let index = 0; index < this._arr.length; index++) {
                        const element = this._arr[index];
                        element[pro] += valueFunc();
                    }
                    this._refreshAndStorage();
                }
                _setPitchProperty(pro, value) {
                    const obj = this._getPitchObj();
                    obj[pro] = value;
                    this._refreshAndStorage();
                    return value;
                }
                ;
                _getPitchProperty(pro) {
                    const obj = this._getPitchObj();
                    return obj[pro];
                }
                ;
                _randomOneObjByPro(proName, value) {
                    let arr = [];
                    for (const key in this._arr) {
                        if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
                            const element = this._arr[key];
                            if (value) {
                                if (element[proName] && element[proName] == value) {
                                    arr.push(element);
                                }
                            }
                            else {
                                if (element[proName]) {
                                    arr.push(element);
                                }
                            }
                        }
                    }
                    if (arr.length == 0) {
                        return null;
                    }
                    else {
                        let any = ToolsAdmin._Array.randomGetOne(arr);
                        return any;
                    }
                }
                _randomOneObj() {
                    const index = ToolsAdmin._Number.randomOneBySection(0, this._arr.length - 1, true);
                    return this._arr[index];
                }
                _randomCountObj(count) {
                    const indexArr = ToolsAdmin._Number.randomCountBySection(0, this._arr.length - 1, count, true);
                    const arr = [];
                    for (let i = 0; i < this._arr.length; i++) {
                        for (let j = 0; j < indexArr.length; j++) {
                            if (i === indexArr[j]) {
                                arr.push(this._arr[i]);
                            }
                        }
                    }
                    return arr;
                }
                _getArrByClassify(classify) {
                    let arr = [];
                    for (const key in this._arr) {
                        if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
                            const element = this._arr[key];
                            if (element[this._property.classify] == classify) {
                                arr.push(element);
                            }
                        }
                    }
                    return arr;
                }
                _getArrByUnlockWay(_unlockWay) {
                    let arr = [];
                    for (const key in this._arr) {
                        if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
                            const element = this._arr[key];
                            if (element.unlockWay === _unlockWay) {
                                arr.push(element);
                            }
                        }
                    }
                    return arr;
                }
                _getArrByPitchClassify() {
                    let arr = [];
                    for (const key in this._arr) {
                        if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
                            const element = this._arr[key];
                            if (element[this._property.classify] == this._pitchClassify) {
                                arr.push(element);
                            }
                        }
                    }
                    return arr;
                }
                _getArrByProperty(proName, value) {
                    let arr = [];
                    for (const key in this._arr) {
                        if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
                            const element = this._arr[key];
                            if (element[proName] && element[proName] == value) {
                                arr.push(element);
                            }
                        }
                    }
                    return arr;
                }
                _getPitchClassfiyName() {
                    const obj = this._getObjByName(this._pitchName);
                    return obj[this._property.classify];
                }
                _getArrByNoProperty(proName, value) {
                    let arr = [];
                    for (const key in this._arr) {
                        if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
                            const element = this._arr[key];
                            if (element[proName] && element[proName] !== value) {
                                arr.push(element);
                            }
                        }
                    }
                    return arr;
                }
                _setArrByPropertyName(proName, value) {
                    let arr = [];
                    for (const key in this._arr) {
                        if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
                            const element = this._arr[key];
                            if (element[proName]) {
                                element[proName] == value;
                                arr.push(element);
                            }
                        }
                    }
                    this._refreshAndStorage();
                    return arr;
                }
                _setPropertyByClassify(classify, pro, value) {
                    const arr = this._getArrByClassify(classify);
                    for (const key in arr) {
                        if (Object.prototype.hasOwnProperty.call(arr, key)) {
                            const element = arr[key];
                            element[pro] = value;
                        }
                    }
                    this._refreshAndStorage();
                    return arr;
                }
                _setCompleteByClassify(classify) {
                    let arr = this._getArrByClassify(classify);
                    for (const key in arr) {
                        if (Object.prototype.hasOwnProperty.call(arr, key)) {
                            const element = arr[key];
                            element.complete = true;
                        }
                    }
                    this._refreshAndStorage();
                    return arr;
                }
                _checkCondition(name, number, func) {
                    let com = null;
                    number = number == undefined ? 1 : number;
                    let degreeNum = this._getProperty(name, this._property.degreeNum);
                    let condition = this._getProperty(name, this._property.conditionNum);
                    let complete = this._getProperty(name, this._property.complete);
                    if (!complete) {
                        if (condition <= degreeNum + number) {
                            this._setProperty(name, this._property.degreeNum, condition);
                            this._setProperty(name, this._property.complete, true);
                            com = true;
                        }
                        else {
                            this._setProperty(name, this._property.degreeNum, degreeNum + number);
                            com = false;
                        }
                    }
                    else {
                        com = -1;
                    }
                    if (func) {
                        func();
                    }
                    return com;
                }
                _checkConditionUnlockWay(_unlockWay, num) {
                    let arr = [];
                    for (const key in this._arr) {
                        if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
                            const element = this._arr[key];
                            if (element.unlockWay === _unlockWay) {
                                this._checkCondition(element.name, num ? num : 1);
                            }
                        }
                    }
                    return arr;
                }
                _checkAllCompelet() {
                    let bool = true;
                    for (let index = 0; index < this._arr.length; index++) {
                        const element = this._arr[index];
                        if (!element.complete) {
                            bool = false;
                            return bool;
                        }
                    }
                    return bool;
                }
                get _pitchClassify() {
                    if (!this[`${this._tableName}/pitchClassify`]) {
                        if (this._localStorage) {
                            return Laya.LocalStorage.getItem(`${this._tableName}/pitchClassify`) ? Laya.LocalStorage.getItem(`${this._tableName}/pitchClassify`) : null;
                        }
                        else {
                            return this[`${this._tableName}/pitchClassify`] = null;
                        }
                    }
                    else {
                        return this[`${this._tableName}/pitchClassify`];
                    }
                }
                ;
                set _pitchClassify(str) {
                    this._lastPitchClassify = this[`${this._tableName}/pitchClassify`] ? this[`${this._tableName}/pitchClassify`] : null;
                    this[`${this._tableName}/pitchClassify`] = str;
                    if (this._localStorage) {
                        Laya.LocalStorage.setItem(`${this._tableName}/pitchClassify`, str.toString());
                    }
                    this._refreshAndStorage();
                }
                ;
                get _pitchName() {
                    if (!this[`${this._tableName}/_pitchName`]) {
                        if (this._localStorage) {
                            return Laya.LocalStorage.getItem(`${this._tableName}/_pitchName`) ? Laya.LocalStorage.getItem(`${this._tableName}/_pitchName`) : null;
                        }
                        else {
                            return this[`${this._tableName}/_pitchName`] = null;
                        }
                    }
                    else {
                        return this[`${this._tableName}/_pitchName`];
                    }
                }
                ;
                set _pitchName(str) {
                    this._lastPitchName = this[`${this._tableName}/_pitchName`];
                    this[`${this._tableName}/_pitchName`] = str;
                    if (this._localStorage) {
                        Laya.LocalStorage.setItem(`${this._tableName}/_pitchName`, str.toString());
                    }
                    this._refreshAndStorage();
                }
                ;
                get _lastPitchClassify() {
                    if (!this[`${this._tableName}/_lastPitchClassify`]) {
                        if (this._localStorage) {
                            return Laya.LocalStorage.getItem(`${this._tableName}/_lastPitchClassify`) ? Laya.LocalStorage.getItem(`${this._tableName}/_lastPitchClassify`) : null;
                        }
                        else {
                            return this[`${this._tableName}/_lastPitchClassify`] = null;
                        }
                    }
                    else {
                        return this[`${this._tableName}/_lastPitchClassify`];
                    }
                }
                ;
                set _lastPitchClassify(str) {
                    this[`${this._tableName}/_lastPitchClassify`] = str;
                    if (this._localStorage && str) {
                        Laya.LocalStorage.setItem(`${this._tableName}/_lastPitchClassify`, str.toString());
                    }
                }
                ;
                get _lastPitchName() {
                    if (!this[`${this._tableName}/_lastPitchName`]) {
                        if (this._localStorage) {
                            return Laya.LocalStorage.getItem(`${this._tableName}/_lastPitchName`) ? Laya.LocalStorage.getItem(`${this._tableName}/_lastPitchName`) : null;
                        }
                        else {
                            return this[`${this._tableName}/_lastPitchName`] = null;
                        }
                    }
                    else {
                        return this[`${this._tableName}/_lastPitchName`];
                    }
                }
                set _lastPitchName(str) {
                    this[`${this._tableName}/_lastPitchName`] = str;
                    if (this._localStorage && str) {
                        Laya.LocalStorage.setItem(`${this._tableName}/_lastPitchName`, str.toString());
                    }
                }
                ;
                _setPitch(name) {
                    let _calssify;
                    for (let index = 0; index < this._arr.length; index++) {
                        const element = this._arr[index];
                        if (element.name == name) {
                            element.pitch = true;
                            _calssify = element[this._property.classify];
                        }
                        else {
                            element.pitch = false;
                        }
                    }
                    this._pitchClassify = _calssify;
                    this._pitchName = name;
                    this._refreshAndStorage();
                }
                _getPitchObj() {
                    for (const key in this._arr) {
                        if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
                            const element = this._arr[key];
                            if (element.name === this._pitchName) {
                                return element;
                            }
                        }
                    }
                }
                _addObject(obj) {
                    let _obj = ToolsAdmin._ObjArray.objCopy(obj);
                    for (let index = 0; index < this._arr.length; index++) {
                        const element = this._arr[index];
                        if (element.name === _obj.name) {
                            this._arr[index] == _obj;
                        }
                    }
                    this._refreshAndStorage();
                }
                _addObjectArr(objArr) {
                    const _objArr = ToolsAdmin._ObjArray.arrCopy(objArr);
                    for (let i = 0; i < _objArr.length; i++) {
                        const obj = _objArr[i];
                        for (let j = 0; j < this._arr.length; j++) {
                            const element = this._arr[j];
                            if (obj && obj.name === element.name) {
                                this._arr[j] = obj;
                                _objArr.splice(i, 1);
                                i--;
                                continue;
                            }
                        }
                    }
                    for (let k = 0; k < _objArr.length; k++) {
                        const element = _objArr[k];
                        this._arr.push(element);
                    }
                    this._refreshAndStorage();
                }
                _deleteObjByName(name) {
                    for (let index = 0; index < this._arr.length; index++) {
                        const element = this._arr[index];
                        if (element.name === name) {
                            this._arr.splice(index, 1);
                            index--;
                        }
                    }
                    this._refreshAndStorage();
                }
                _sortByProperty(pro, indexPro, inverted) {
                    ToolsAdmin._ObjArray.sortByProperty(this._arr, pro);
                    if (inverted == undefined || inverted) {
                        for (let index = this._arr.length - 1; index >= 0; index--) {
                            const element = this._arr[index];
                            element[indexPro] = this._arr.length - index;
                        }
                        this._arr.reverse();
                    }
                    else {
                        for (let index = 0; index < this._arr.length; index++) {
                            const element = this._arr[index];
                            element[indexPro] = index + 1;
                        }
                    }
                    this._refreshAndStorage();
                }
            }
            DataAdmin._Table = _Table;
            function addCompare(tableArr, storageName, propertyName) {
                try {
                    Laya.LocalStorage.getJSON(storageName);
                }
                catch (error) {
                    Laya.LocalStorage.setJSON(storageName, JSON.stringify(tableArr));
                    return tableArr;
                }
                let storeArr;
                if (Laya.LocalStorage.getJSON(storageName)) {
                    storeArr = JSON.parse(Laya.LocalStorage.getJSON(storageName));
                    let diffArray = ToolsAdmin._ObjArray.diffProByTwo(tableArr, storeArr, propertyName);
                    console.log(`${storageName}新添加对象`, diffArray);
                    ToolsAdmin._Array.addToarray(storeArr, diffArray);
                }
                else {
                    storeArr = tableArr;
                }
                Laya.LocalStorage.setJSON(storageName, JSON.stringify(storeArr));
                return storeArr;
            }
            function _jsonCompare(url, storageName, propertyName) {
                let dataArr;
                try {
                    Laya.LocalStorage.getJSON(storageName);
                }
                catch (error) {
                    dataArr = Laya.loader.getRes(url)['RECORDS'];
                    Laya.LocalStorage.setJSON(storageName, JSON.stringify(dataArr));
                    return dataArr;
                }
                if (Laya.LocalStorage.getJSON(storageName)) {
                    dataArr = JSON.parse(Laya.LocalStorage.getJSON(storageName));
                    console.log(storageName + '从本地缓存中获取到数据,将和文件夹的json文件进行对比');
                    try {
                        let dataArr_0 = Laya.loader.getRes(url)['RECORDS'];
                        if (dataArr_0.length >= dataArr.length) {
                            let diffArray = ToolsAdmin._ObjArray.diffProByTwo(dataArr_0, dataArr, propertyName);
                            console.log('两个数据的差值为：', diffArray);
                            ToolsAdmin._Array.addToarray(dataArr, diffArray);
                        }
                        else {
                            console.log(storageName + '数据表填写有误，长度不能小于之前的长度');
                        }
                    }
                    catch (error) {
                        console.log(storageName, '数据赋值失败！请检查数据表或者手动赋值！');
                    }
                }
                else {
                    try {
                        dataArr = Laya.loader.getRes(url)['RECORDS'];
                    }
                    catch (error) {
                        console.log(storageName + '数据赋值失败！请检查数据表或者手动赋值！');
                    }
                }
                Laya.LocalStorage.setJSON(storageName, JSON.stringify(dataArr));
                return dataArr;
            }
        })(DataAdmin = Lwg.DataAdmin || (Lwg.DataAdmin = {}));
        let ColorAdmin;
        (function (ColorAdmin) {
            function RGBToHexString(r, g, b) {
                return '#' + ("00000" + (r << 16 | g << 8 | b).toString(16)).slice(-6);
            }
            ColorAdmin.RGBToHexString = RGBToHexString;
            function HexStringToRGB(str) {
                let r, g, b;
                r = (0xff << 16 & str) >> 16;
                g = (0xff << 8 & str) >> 8;
                b = 0xff & str;
                return [r, g, b];
            }
            ColorAdmin.HexStringToRGB = HexStringToRGB;
            function _colour(node, RGBA, vanishtime) {
                let cf = new Laya.ColorFilter();
                node.blendMode = 'null';
                if (!RGBA) {
                    cf.color(ToolsAdmin._Number.randomOneBySection(255, 100, true), ToolsAdmin._Number.randomOneBySection(255, 100, true), ToolsAdmin._Number.randomOneBySection(255, 100, true), 1);
                }
                else {
                    cf.color(RGBA[0], RGBA[1], RGBA[2], RGBA[3]);
                }
                node.filters = [cf];
                if (vanishtime) {
                    Laya.timer.once(vanishtime, this, () => {
                        for (let index = 0; index < node.filters.length; index++) {
                            if (node.filters[index] == cf) {
                                node.filters = [];
                                break;
                            }
                        }
                    });
                }
                return cf;
            }
            ColorAdmin._colour = _colour;
            function _changeOnce(node, RGBA, time, func) {
                if (!node) {
                    return;
                }
                let cf = new Laya.ColorFilter();
                cf.color(0, 0, 0, 0);
                let speedR = RGBA[0] / time;
                let speedG = RGBA[1] / time;
                let speedB = RGBA[2] / time;
                let speedA = 0;
                if (RGBA[3]) {
                    speedA = RGBA[3] / time;
                }
                let caller = {
                    add: true,
                };
                let R = 0, G = 0, B = 0, A = 0;
                TimerAdmin._frameLoop(1, caller, () => {
                    if (R < RGBA[0] && caller.add) {
                        R += speedR;
                        G += speedG;
                        B += speedB;
                        if (speedA !== 0)
                            A += speedA;
                        if (R >= RGBA[0]) {
                            caller.add = false;
                        }
                    }
                    else {
                        R -= speedR;
                        G -= speedG;
                        B -= speedB;
                        if (speedA !== 0)
                            A -= speedA;
                        if (R <= 0) {
                            if (func) {
                                func();
                            }
                            Laya.timer.clearAll(caller);
                        }
                    }
                    cf.color(R, G, B, A);
                    node.filters = [cf];
                });
            }
            ColorAdmin._changeOnce = _changeOnce;
            function _changeConstant(node, RGBA1, RGBA2, frameTime) {
                let cf;
                let RGBA0 = [];
                if (!node.filters) {
                    cf = new Laya.ColorFilter();
                    cf.color(RGBA1[0], RGBA1[1], RGBA1[2], RGBA1[3] ? RGBA1[3] : 1);
                    RGBA0 = [RGBA1[0], RGBA1[1], RGBA1[2], RGBA1[3] ? RGBA1[3] : 1];
                    node.filters = [cf];
                }
                else {
                    cf = node.filters[0];
                    RGBA0 = [node.filters[0]['_alpha'][0], node.filters[0]['_alpha'][1], node.filters[0]['_alpha'][2], node.filters[0]['_alpha'][3] ? node.filters[0]['_alpha'][3] : 1];
                }
                let RGBA = [ToolsAdmin._Number.randomCountBySection(RGBA1[0], RGBA2[0])[0], ToolsAdmin._Number.randomCountBySection(RGBA1[1], RGBA2[1])[0], ToolsAdmin._Number.randomCountBySection(RGBA1[2], RGBA2[2])[0], ToolsAdmin._Number.randomCountBySection(RGBA1[3] ? RGBA1[3] : 1, RGBA2[3] ? RGBA2[3] : 1)[0]];
                let speedR = (RGBA[0] - RGBA0[0]) / frameTime;
                let speedG = (RGBA[1] - RGBA0[1]) / frameTime;
                let speedB = (RGBA[2] - RGBA0[2]) / frameTime;
                let speedA = 0;
                if (RGBA[3]) {
                    speedA = (RGBA[3] - RGBA0[3]) / frameTime;
                }
                if (node['changeCaller']) {
                    Laya.timer.clearAll(node['changeCaller']);
                }
                let changeCaller = {};
                node['changeCaller'] = changeCaller;
                let _time = 0;
                TimerAdmin._frameLoop(1, changeCaller, () => {
                    _time++;
                    if (_time <= frameTime) {
                        RGBA0[0] += speedR;
                        RGBA0[1] += speedG;
                        RGBA0[2] += speedB;
                    }
                    else {
                        Laya.timer.clearAll(changeCaller);
                    }
                    cf.color(RGBA0[0], RGBA0[1], RGBA0[2], RGBA0[3]);
                    node.filters = [cf];
                });
            }
            ColorAdmin._changeConstant = _changeConstant;
        })(ColorAdmin = Lwg.ColorAdmin || (Lwg.ColorAdmin = {}));
        let Eff3DAdmin;
        (function (Eff3DAdmin) {
            Eff3DAdmin._tex2D = {
                爱心2: {
                    url: 'Lwg/Effects/3D/aixin2.png',
                    texture2D: null,
                    name: '爱心2',
                },
                星星8: {
                    url: 'Lwg/Effects/3D/star8.png',
                    texture2D: null,
                    name: '星星8',
                },
                星星5: {
                    url: 'Lwg/Effects/3D/star5.png',
                    texture2D: null,
                    name: '星星5',
                },
                圆形发光: {
                    url: 'Lwg/Effects/3D/yuanfaguang.png',
                    texture2D: null,
                    name: '圆形发光',
                }
            };
            let _Particle;
            (function (_Particle) {
                class _Caller {
                    constructor(_time, _appear, _move, _vinish, _frameFuncInterval, _frameFunc, _endFunc) {
                        this.time = 0;
                        this.appear = true;
                        this.move = false;
                        this.vinish = false;
                        this.frame = {
                            interval: 1,
                            func: null,
                        };
                        this.end = false;
                        this.stateType = {
                            appear: 'appear',
                            move: 'move',
                            vinish: 'vinish',
                            end: 'end',
                        };
                        this._positionByARY_FA = 0;
                        this._positionARXY_FR = 0;
                        this._positionByTimeRecord = 0;
                        this.frame.interval = _frameFuncInterval ? _frameFuncInterval : 1;
                        this.frame.func = _frameFunc ? _frameFunc : null;
                        this.endFunc = _endFunc ? _endFunc : null;
                        this.time = _time ? _time : 0;
                        this.appear = _appear ? _appear : true;
                        this.move = _move ? _move : false;
                        this.vinish = _vinish ? _vinish : false;
                        TimerAdmin._frameLoop(1, this, () => {
                            this.time++;
                            if (this.box) {
                                if (!this.box.parent) {
                                    this.clear();
                                    return;
                                }
                            }
                            this.time % this.frame.interval == 0 && this.frame.func && this.frame.func();
                            this.appear && this.appearFunc && this.appearFunc();
                            this.move && this.moveFunc && this.moveFunc();
                            this.vinish && this.vinishFunc && this.vinishFunc();
                            this.end && this.endFunc && this.endFunc();
                            this.everyFrameFunc && this.everyFrameFunc();
                            this.clear();
                        });
                    }
                    get box() {
                        if (!this['_box']) {
                            console.log('粒子没有初始化！');
                        }
                        return this['_box'];
                    }
                    set box(_box) {
                        this['_box'] = _box;
                    }
                    stateSwitch(str) {
                        if (str == 'a' || str == 'appear') {
                            this.appear = true;
                            this.move = false;
                            this.vinish = false;
                            this.end = false;
                        }
                        if (str == 'm' || str == 'move') {
                            this.appear = false;
                            this.move = true;
                        }
                        else if (str == 'v' || str == 'vinish') {
                            this.move = false;
                            this.vinish = true;
                        }
                        else if (str == 'e' || str == 'end') {
                            this.vinish = false;
                            this.end = true;
                        }
                    }
                    clear() {
                        if (this.end) {
                            this.mat.destroy();
                            this.box.meshFilter.destroy();
                            this.box.destroy();
                            Laya.timer.clearAll(this);
                        }
                    }
                    _boxInit(parent, position, sectionSize, sectionRotation, texArr, colorRGBA) {
                        const _scaleX = sectionSize ? ToolsAdmin._Number.randomOneBySection(sectionSize[0][0], sectionSize[1][0]) : ToolsAdmin._Number.randomOneBySection(0.06, 0.08);
                        const _scaleY = sectionSize ? ToolsAdmin._Number.randomOneBySection(sectionSize[0][1], sectionSize[1][1]) : ToolsAdmin._Number.randomOneBySection(0.06, 0.08);
                        const _scaleZ = sectionSize ? ToolsAdmin._Number.randomOneBySection(sectionSize[0][2], sectionSize[1][2]) : ToolsAdmin._Number.randomOneBySection(0.06, 0.08);
                        this.box = parent.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(_scaleX, _scaleY, _scaleZ)));
                        if (position) {
                            this.box.transform.position = new Laya.Vector3(position[0], position[1], position[2]);
                        }
                        else {
                            this.box.transform.position = new Laya.Vector3(0, 0, 0);
                        }
                        this.fPosition = new Laya.Vector3(this.box.transform.position.x, this.box.transform.position.y, this.box.transform.position.z);
                        this.box.transform.localRotationEulerX = sectionRotation ? ToolsAdmin._Number.randomOneBySection(sectionRotation[0][0], sectionRotation[1][0]) : ToolsAdmin._Number.randomOneBySection(0, 360);
                        this.box.transform.localRotationEulerX = sectionRotation ? ToolsAdmin._Number.randomOneBySection(sectionRotation[0][1], sectionRotation[1][1]) : ToolsAdmin._Number.randomOneBySection(0, 360);
                        this.box.transform.localRotationEulerX = sectionRotation ? ToolsAdmin._Number.randomOneBySection(sectionRotation[0][2], sectionRotation[1][2]) : ToolsAdmin._Number.randomOneBySection(0, 360);
                        this.fEuler = new Laya.Vector3(this.box.transform.localRotationEulerX, this.box.transform.localRotationEulerY, this.box.transform.localRotationEulerZ);
                        const mat = this.box.meshRenderer.material = new Laya.BlinnPhongMaterial();
                        mat.albedoTexture = texArr ? ToolsAdmin._Array.randomGetOne(texArr) : Eff3DAdmin._tex2D.圆形发光.texture2D;
                        mat.renderMode = 2;
                        const R = colorRGBA ? ToolsAdmin._Number.randomOneBySection(colorRGBA[0][0], colorRGBA[1][0]) : ToolsAdmin._Number.randomOneBySection(10, 25);
                        const G = colorRGBA ? ToolsAdmin._Number.randomOneBySection(colorRGBA[0][1], colorRGBA[1][1]) : ToolsAdmin._Number.randomOneBySection(5, 15);
                        const B = colorRGBA ? ToolsAdmin._Number.randomOneBySection(colorRGBA[0][2], colorRGBA[1][2]) : ToolsAdmin._Number.randomOneBySection(5, 10);
                        const A = colorRGBA ? ToolsAdmin._Number.randomOneBySection(colorRGBA[0][3], colorRGBA[1][3]) : ToolsAdmin._Number.randomOneBySection(1, 1);
                        mat.albedoColor = new Laya.Vector4(R, G, B, A);
                        this.mat = mat;
                    }
                    get fPosition() {
                        return this['_fPosition'];
                    }
                    ;
                    set fPosition(fP) {
                        this['_fPosition'] = fP;
                    }
                    get fEuler() {
                        return this['_fEuler'];
                    }
                    set fEuler(fE) {
                        this['_fEuler'] = fE;
                    }
                    get mat() {
                        return this.box.meshRenderer.material;
                    }
                    set mat(m) {
                        this.box.meshRenderer.material = m;
                    }
                    _positionByARY(angleSpeed, radius, speedY, distance, stateSwitch) {
                        const pXZ = ToolsAdmin._Point.getRoundPosOld(this._positionByARY_FA += angleSpeed, radius, new Laya.Point(this.fPosition.x, this.fPosition.z));
                        this.box.transform.position = new Laya.Vector3(pXZ.x, this.box.transform.position.y += speedY, pXZ.y);
                        if (this.box.transform.position.y - this.fPosition.y > distance) {
                            stateSwitch && stateSwitch();
                        }
                    }
                    _positionARXY_R(angle, speedR, distance, stateSwitch) {
                        this._positionARXY_FR += speedR;
                        const point = ToolsAdmin._Point.getRoundPosOld(angle, this._positionARXY_FR, new Laya.Point(0, 0));
                        this.box.transform.position = new Laya.Vector3(this.fPosition.x + point.x, this.fPosition.y + point.y, this.fPosition.z);
                        if (this._positionARXY_FR >= distance) {
                            stateSwitch && stateSwitch();
                        }
                    }
                    _fadeAway(albedoColorASpeed, endNum = 0, stateSwitch) {
                        this.mat.albedoColorA -= albedoColorASpeed;
                        if (this.mat.albedoColorA <= endNum) {
                            this.mat.albedoColorA = endNum;
                            stateSwitch && stateSwitch();
                        }
                    }
                    _fadeIn(albedoColorASpeed, endNum = 1, stateSwitch) {
                        this.mat.albedoColorA += albedoColorASpeed;
                        if (this.mat.albedoColorA >= endNum) {
                            this.mat.albedoColorA = endNum;
                            stateSwitch && stateSwitch();
                        }
                    }
                    _positionByTime(posSpeed, time, stateSwitch) {
                        this._positionByTimeRecord++;
                        this.box.transform.position = new Laya.Vector3(this.box.transform.position.x += posSpeed[0], this.box.transform.position.y += posSpeed[1], this.box.transform.position.z += posSpeed[2]);
                        if (time && this._positionByTimeRecord > time) {
                            stateSwitch && stateSwitch();
                        }
                    }
                    _scaleX(scaleSpeedX, endNum, stateSwitch) {
                        this.box.transform.localScaleX += scaleSpeedX;
                        if (endNum) {
                            if (scaleSpeedX >= 0) {
                                if (this.box.transform.localScaleX >= endNum) {
                                    this.box.transform.localScaleX = endNum;
                                    stateSwitch && stateSwitch();
                                }
                            }
                            else {
                                if (this.box.transform.localScaleX <= endNum) {
                                    this.box.transform.localScaleX = endNum;
                                    stateSwitch && stateSwitch();
                                }
                            }
                        }
                    }
                    _scaleY(scaleSpeedY, endNum, stateSwitch) {
                        this.box.transform.localScaleY += scaleSpeedY;
                        if (endNum) {
                            if (scaleSpeedY >= 0) {
                                if (this.box.transform.localScaleY >= endNum) {
                                    this.box.transform.localScaleY = endNum;
                                    stateSwitch && stateSwitch();
                                }
                            }
                            else {
                                if (this.box.transform.localScaleY <= endNum) {
                                    this.box.transform.localScaleY = endNum;
                                    stateSwitch && stateSwitch();
                                }
                            }
                        }
                    }
                    _scaleZ(scaleSpeedZ, endNum, stateSwitch) {
                        this.box.transform.localScaleZ += scaleSpeedZ;
                        if (endNum) {
                            if (scaleSpeedZ >= 0) {
                                if (this.box.transform.localScaleZ >= endNum) {
                                    this.box.transform.localScaleZ = endNum;
                                    stateSwitch && stateSwitch();
                                }
                            }
                            else {
                                if (this.box.transform.localScaleZ <= endNum) {
                                    this.box.transform.localScaleZ = endNum;
                                    stateSwitch && stateSwitch();
                                }
                            }
                        }
                    }
                    _rotateX(rotateSpeedX, endNum, stateSwitch) {
                        this.box.transform.localRotationEulerX += rotateSpeedX;
                        if (endNum) {
                            if (rotateSpeedX >= 0) {
                                if (this.box.transform.localRotationEulerX >= endNum) {
                                    this.box.transform.localRotationEulerX = endNum;
                                    stateSwitch && stateSwitch();
                                }
                            }
                            else {
                                if (this.box.transform.localRotationEulerX <= endNum) {
                                    this.box.transform.localRotationEulerX = endNum;
                                    stateSwitch && stateSwitch();
                                }
                            }
                        }
                    }
                    _rotateY(rotateSpeedY, endNum, stateSwitch) {
                        this.box.transform.localRotationEulerY += rotateSpeedY;
                        if (endNum) {
                            if (rotateSpeedY >= 0) {
                                if (this.box.transform.localRotationEulerY >= endNum) {
                                    this.box.transform.localRotationEulerY = endNum;
                                    stateSwitch && stateSwitch();
                                }
                            }
                            else {
                                if (this.box.transform.localRotationEulerY <= endNum) {
                                    this.box.transform.localRotationEulerY = endNum;
                                    stateSwitch && stateSwitch();
                                }
                            }
                        }
                    }
                    _rotateZ(rotateSpeedZ, endNum, stateSwitch) {
                        this.box.transform.localRotationEulerZ += rotateSpeedZ;
                        if (endNum) {
                            if (rotateSpeedZ >= 0) {
                                if (this.box.transform.localRotationEulerZ >= endNum) {
                                    this.box.transform.localRotationEulerZ = endNum;
                                    stateSwitch && stateSwitch();
                                }
                            }
                            else {
                                if (this.box.transform.localRotationEulerZ <= endNum) {
                                    this.box.transform.localRotationEulerZ = endNum;
                                    stateSwitch && stateSwitch();
                                }
                            }
                        }
                    }
                    _randomScopeByPosition(scopeSize) {
                        scopeSize = scopeSize ? scopeSize : [[0.1, 0.1, 0.1], [0.3, 0.3, 0.3]];
                        ToolsAdmin._3D.randomScopeByPosition(this.box, scopeSize);
                    }
                    _excludeZ() {
                        this.box.transform.localScaleZ = 0;
                    }
                    _rotateTheZero() {
                        this.box.transform.localRotationEulerZ = 0;
                        this.box.transform.localRotationEulerX = 0;
                        this.box.transform.localRotationEulerY = 0;
                    }
                    _scaleTheZero() {
                        this.box.transform.localRotationEulerZ = 0;
                        this.box.transform.localRotationEulerX = 0;
                        this.box.transform.localRotationEulerY = 0;
                    }
                }
                _Particle._Caller = _Caller;
                function _spiral(parent, position, sectionSize, sectionRotation, texArr, colorRGBA, distance, speedY, angleSpeed, radius) {
                    const caller = new _Caller();
                    caller._boxInit(parent, position, sectionSize, sectionRotation, texArr, colorRGBA);
                    caller._excludeZ();
                    caller._rotateTheZero();
                    const _distance = ToolsAdmin._Number.randomNumerical(distance, [1.5, 1.5]);
                    const _speedY = ToolsAdmin._Number.randomNumerical(speedY, [0.02, 0.02]);
                    const _angleSpeed = ToolsAdmin._Number.randomNumerical(angleSpeed, [6, 6]);
                    const _radius = ToolsAdmin._Number.randomNumerical(radius, [0.5, 0.5]);
                    caller.mat.albedoColorA = 0;
                    caller.stateSwitch('m');
                    caller.moveFunc = () => {
                        caller._fadeIn(0.2);
                        caller._positionByARY(_angleSpeed, _radius, _speedY, _distance, () => {
                            caller.stateSwitch('v');
                        });
                    };
                    caller.vinishFunc = () => {
                        caller._fadeAway(0.15, 0, () => {
                            caller.stateSwitch('e');
                        });
                        caller._positionByTime([0, 0.002, 0]);
                    };
                    return caller;
                }
                _Particle._spiral = _spiral;
                function _explode(parent, position, sectionSize, sectionRotation, texArr, colorRGBA, distance, speedR) {
                    const caller = new _Caller();
                    caller._boxInit(parent, position, sectionSize, sectionRotation, texArr, colorRGBA);
                    caller._excludeZ();
                    caller._rotateTheZero();
                    const _distance = ToolsAdmin._Number.randomNumerical(distance, [0.3, 0.6]);
                    const _speedR = ToolsAdmin._Number.randomNumerical(speedR, [0.008, 0.012]);
                    const _angle = ToolsAdmin._Number.randomNumerical([0, 360]);
                    caller.mat.albedoColorA = 0;
                    caller.stateSwitch('m');
                    caller.moveFunc = () => {
                        caller._fadeIn(0.15);
                        caller._positionARXY_R(_angle, _speedR, _distance, () => {
                            caller.stateSwitch('v');
                        });
                    };
                    caller.vinishFunc = () => {
                        caller._fadeAway(0.15, 0, () => {
                            caller.stateSwitch('e');
                        });
                    };
                    return;
                }
                _Particle._explode = _explode;
                function _fade(parent, position, sectionSize, staytime, vainshASpeed, vainshSSpeed, sectionRotation, texArr, colorRGBA) {
                    const caller = new _Caller();
                    caller._boxInit(parent, position, sectionSize ? sectionSize : [[0.04, 0.04, 0], [0.04, 0.04, 0]], sectionRotation, texArr, colorRGBA);
                    caller._excludeZ();
                    const _staytime = staytime ? staytime : 20;
                    const _vainshASpeed = vainshASpeed ? vainshASpeed : 0.02;
                    const _vainshSSpeed = vainshSSpeed ? vainshSSpeed : 0.02;
                    caller._rotateTheZero();
                    caller.stateSwitch('m');
                    caller.moveFunc = () => {
                        if (caller.time > _staytime) {
                            caller.stateSwitch('v');
                        }
                    };
                    caller.vinishFunc = () => {
                        caller._scaleX(_vainshSSpeed);
                        caller._fadeAway(_vainshASpeed, 0, () => {
                            caller.stateSwitch('e');
                        });
                    };
                    caller.everyFrameFunc = () => {
                        caller.box.transform.localScaleY = caller.box.transform.localScaleX;
                    };
                    return caller;
                }
                _Particle._fade = _fade;
                function _starsShine(parent, position, scopeSize, scaleSpeed, maxScale, angelspeed, ASpeed, texArr, colorRGBA) {
                    const caller = new _Caller();
                    caller._boxInit(parent, position, null, null, texArr ? texArr : [Eff3DAdmin._tex2D.星星5.texture2D], colorRGBA ? colorRGBA : [[15, 15, 15, 1], [30, 30, 30, 1]]);
                    caller._excludeZ();
                    caller._rotateTheZero();
                    caller._scaleTheZero();
                    caller._randomScopeByPosition(scopeSize);
                    caller.mat.albedoColorA = 0;
                    const _maxScale = ToolsAdmin._Number.randomNumerical(maxScale, [1, 2]);
                    const _scaleSpeed = ToolsAdmin._Number.randomNumerical(scaleSpeed, [0.01, 0.05]);
                    const _angelspeed = ToolsAdmin._Number.randomNumerical(angelspeed, [2, 6], true);
                    const _ASpeed = ToolsAdmin._Number.randomNumerical(ASpeed, [0.01, 0.05]);
                    caller.appearFunc = () => {
                        caller._fadeIn(_ASpeed, 1, () => {
                            caller.stateSwitch('m');
                        });
                        caller._scaleX(_scaleSpeed, 1);
                        caller._rotateZ(_angelspeed);
                    };
                    caller.moveFunc = () => {
                        caller._scaleX(_scaleSpeed, _maxScale, () => {
                            caller.stateSwitch('v');
                        });
                        caller._rotateZ(_angelspeed);
                    };
                    caller.vinishFunc = () => {
                        caller._fadeAway(_ASpeed, 0, () => {
                            caller.stateSwitch('e');
                        });
                        caller._scaleX(-_scaleSpeed);
                        caller._rotateZ(-_angelspeed);
                    };
                    caller.everyFrameFunc = () => {
                        caller.box.transform.localScaleY = caller.box.transform.localScaleX;
                    };
                    return caller;
                }
                _Particle._starsShine = _starsShine;
            })(_Particle = Eff3DAdmin._Particle || (Eff3DAdmin._Particle = {}));
        })(Eff3DAdmin = Lwg.Eff3DAdmin || (Lwg.Eff3DAdmin = {}));
        let Eff2DAdmin;
        (function (Eff2DAdmin) {
            let _SkinUrl;
            (function (_SkinUrl) {
                _SkinUrl["\u7231\u5FC31"] = "Lwg/Effects/aixin1.png";
                _SkinUrl["\u7231\u5FC32"] = "Lwg/Effects/aixin2.png";
                _SkinUrl["\u7231\u5FC33"] = "Lwg/Effects/aixin3.png";
                _SkinUrl["\u82B11"] = "Lwg/Effects/hua1.png";
                _SkinUrl["\u82B12"] = "Lwg/Effects/hua2.png";
                _SkinUrl["\u82B13"] = "Lwg/Effects/hua3.png";
                _SkinUrl["\u82B14"] = "Lwg/Effects/hua4.png";
                _SkinUrl["\u661F\u661F1"] = "Lwg/Effects/star1.png";
                _SkinUrl["\u661F\u661F2"] = "Lwg/Effects/star2.png";
                _SkinUrl["\u661F\u661F3"] = "Lwg/Effects/star3.png";
                _SkinUrl["\u661F\u661F4"] = "Lwg/Effects/star4.png";
                _SkinUrl["\u661F\u661F5"] = "Lwg/Effects/star5.png";
                _SkinUrl["\u661F\u661F6"] = "Lwg/Effects/star6.png";
                _SkinUrl["\u661F\u661F7"] = "Lwg/Effects/star7.png";
                _SkinUrl["\u661F\u661F8"] = "Lwg/Effects/star8.png";
                _SkinUrl["\u83F1\u5F621"] = "Lwg/Effects/rhombus1.png";
                _SkinUrl["\u83F1\u5F622"] = "Lwg/Effects/rhombus1.png";
                _SkinUrl["\u83F1\u5F623"] = "Lwg/Effects/rhombus1.png";
                _SkinUrl["\u77E9\u5F621"] = "Lwg/Effects/rectangle1.png";
                _SkinUrl["\u77E9\u5F622"] = "Lwg/Effects/rectangle2.png";
                _SkinUrl["\u77E9\u5F623"] = "Lwg/Effects/rectangle3.png";
                _SkinUrl["\u96EA\u82B11"] = "Lwg/Effects/xuehua1.png";
                _SkinUrl["\u53F6\u5B501"] = "Lwg/Effects/yezi1.png";
                _SkinUrl["\u5706\u5F62\u53D1\u51491"] = "Lwg/Effects/yuanfaguang.png";
                _SkinUrl["\u5706\u5F621"] = "Lwg/Effects/yuan1.png";
                _SkinUrl["\u65B9\u5F62\u5149\u57081"] = "Lwg/Effects/ui_square_guang1.png";
                _SkinUrl["\u65B9\u5F62\u5706\u89D2\u5149\u57081"] = "Lwg/Effects/ui_square_guang2.png";
                _SkinUrl["\u5706\u5F62\u5C0F\u5149\u73AF"] = "Lwg/Effects/xiaoguanghuan.png";
                _SkinUrl["\u5149\u57082"] = "Lwg/Effects/guangquan2.png";
                _SkinUrl["\u4E09\u89D2\u5F621"] = "Lwg/Effects/triangle1.png";
                _SkinUrl["\u4E09\u89D2\u5F622"] = "Lwg/Effects/triangle2.png";
            })(_SkinUrl = Eff2DAdmin._SkinUrl || (Eff2DAdmin._SkinUrl = {}));
            let _Aperture;
            (function (_Aperture) {
                class _ApertureImage extends Laya.Image {
                    constructor(parent, centerPoint, size, rotation, urlArr, colorRGBA, zOrder) {
                        super();
                        if (!parent.parent) {
                            return;
                        }
                        parent.addChild(this);
                        centerPoint ? this.pos(centerPoint[0], centerPoint[1]) : this.pos(0, 0);
                        this.width = size ? size[0] : 100;
                        this.height = size ? size[1] : 100;
                        this.pivotX = this.width / 2;
                        this.pivotY = this.height / 2;
                        this.rotation = rotation ? ToolsAdmin._Number.randomOneBySection(rotation[0], rotation[1]) : ToolsAdmin._Number.randomOneBySection(360);
                        this.skin = urlArr ? ToolsAdmin._Array.randomGetOne(urlArr) : _SkinUrl.花3;
                        this.zOrder = zOrder ? zOrder : 0;
                        this.alpha = 0;
                        let RGBA = [];
                        RGBA[0] = colorRGBA ? ToolsAdmin._Number.randomOneBySection(colorRGBA[0][0], colorRGBA[1][0]) : ToolsAdmin._Number.randomOneBySection(180, 255);
                        RGBA[1] = colorRGBA ? ToolsAdmin._Number.randomOneBySection(colorRGBA[0][1], colorRGBA[1][1]) : ToolsAdmin._Number.randomOneBySection(10, 180);
                        RGBA[2] = colorRGBA ? ToolsAdmin._Number.randomOneBySection(colorRGBA[0][2], colorRGBA[1][2]) : ToolsAdmin._Number.randomOneBySection(10, 180);
                        RGBA[3] = colorRGBA ? ToolsAdmin._Number.randomOneBySection(colorRGBA[0][3], colorRGBA[1][3]) : ToolsAdmin._Number.randomOneBySection(1, 1);
                        ColorAdmin._colour(this, RGBA);
                    }
                }
                _Aperture._ApertureImage = _ApertureImage;
                function _continuous(parent, centerPoint, size, minScale, rotation, urlArr, colorRGBA, zOrder, maxScale, speed, accelerated) {
                    const Img = new _ApertureImage(parent, centerPoint, size, rotation, urlArr, colorRGBA, zOrder);
                    let _speed = speed ? ToolsAdmin._Number.randomOneBySection(speed[0], speed[1]) : 0.025;
                    let _accelerated = accelerated ? ToolsAdmin._Number.randomOneBySection(accelerated[0], accelerated[1]) : 0.0005;
                    if (minScale) {
                        Img.scale(minScale[0], minScale[1]);
                    }
                    else {
                        Img.scale(0, 0);
                    }
                    const _maxScale = maxScale ? ToolsAdmin._Number.randomOneBySection(maxScale[0], maxScale[1]) : 2;
                    let moveCaller = {
                        alpha: true,
                        scale: false,
                        vanish: false
                    };
                    Img['moveCaller'] = moveCaller;
                    let acc = 0;
                    TimerAdmin._frameLoop(1, moveCaller, () => {
                        if (moveCaller.alpha) {
                            Img.alpha += 0.05;
                            acc = 0;
                            if (Img.alpha >= 1) {
                                moveCaller.alpha = false;
                                moveCaller.scale = true;
                            }
                        }
                        if (moveCaller.scale) {
                            acc += _accelerated;
                            if (Img.scaleX >= _maxScale) {
                                moveCaller.scale = false;
                                moveCaller.vanish = true;
                            }
                        }
                        if (moveCaller.vanish) {
                            Img.alpha -= 0.015;
                            if (Img.alpha <= 0) {
                                Img.removeSelf();
                                Laya.timer.clearAll(moveCaller);
                            }
                        }
                        Img.scaleX = Img.scaleY += (_speed + acc);
                    });
                }
                _Aperture._continuous = _continuous;
                function _continuousByDs(parent, centerPoint, size, minScale, rotation, urlArr, colorRGBA, zOrder, maxScale, speed, accelerated) {
                    const Img = new _ApertureImage(parent, centerPoint, size, rotation, urlArr, colorRGBA, zOrder);
                    let _speed = speed ? ToolsAdmin._Number.randomOneBySection(speed[0], speed[1]) : 0.025;
                    let _accelerated = accelerated ? ToolsAdmin._Number.randomOneBySection(accelerated[0], accelerated[1]) : 0.0005;
                    if (minScale) {
                        Img.scale(minScale[0], minScale[1]);
                    }
                    else {
                        Img.scale(0, 0);
                    }
                    const _maxScale = maxScale ? ToolsAdmin._Number.randomOneBySection(maxScale[0], maxScale[1]) : 2;
                    let moveCaller = {
                        alpha: true,
                        scale: false,
                        vanish: false
                    };
                    Img['moveCaller'] = moveCaller;
                    let acc = 0;
                    TimerAdmin._frameLoop(1, moveCaller, () => {
                        if (moveCaller.alpha) {
                            Img.alpha += 0.05;
                            acc = 0;
                            if (Img.alpha >= 1) {
                                moveCaller.alpha = false;
                                moveCaller.scale = true;
                            }
                        }
                        if (moveCaller.scale) {
                            acc += _accelerated;
                            if (Img.scaleX > _maxScale) {
                                moveCaller.scale = false;
                                moveCaller.vanish = true;
                            }
                        }
                        if (moveCaller.vanish) {
                            acc -= _accelerated;
                            if (acc <= 0) {
                                acc = 0;
                                Img.alpha -= 0.015;
                                if (Img.alpha <= 0) {
                                    Img.removeSelf();
                                    Laya.timer.clearAll(moveCaller);
                                }
                            }
                        }
                        Img.scaleX = Img.scaleY += (_speed + acc);
                    });
                }
                _Aperture._continuousByDs = _continuousByDs;
            })(_Aperture = Eff2DAdmin._Aperture || (Eff2DAdmin._Aperture = {}));
            let _Particle;
            (function (_Particle) {
                class _ParticleImgBase extends Laya.Image {
                    constructor(parent, centerPoint, sectionWH, width, height, rotation, urlArr, colorRGBA, zOrder) {
                        super();
                        parent.addChild(this);
                        let sectionWidth = sectionWH ? ToolsAdmin._Number.randomOneBySection(sectionWH[0]) : ToolsAdmin._Number.randomOneBySection(200);
                        let sectionHeight = sectionWH ? ToolsAdmin._Number.randomOneBySection(sectionWH[1]) : ToolsAdmin._Number.randomOneBySection(50);
                        sectionWidth = ToolsAdmin._Number.randomOneHalf() == 0 ? sectionWidth : -sectionWidth;
                        sectionHeight = ToolsAdmin._Number.randomOneHalf() == 0 ? sectionHeight : -sectionHeight;
                        this.x = centerPoint ? centerPoint.x + sectionWidth : sectionWidth;
                        this.y = centerPoint ? centerPoint.y + sectionHeight : sectionHeight;
                        this.width = width ? ToolsAdmin._Number.randomOneBySection(width[0], width[1]) : ToolsAdmin._Number.randomOneBySection(20, 50);
                        this.height = height ? ToolsAdmin._Number.randomOneBySection(height[0], height[1]) : this.width;
                        this.pivotX = this.width / 2;
                        this.pivotY = this.height / 2;
                        this.skin = urlArr ? ToolsAdmin._Array.randomGetOne(urlArr) : _SkinUrl.圆形1;
                        this.rotation = rotation ? ToolsAdmin._Number.randomOneBySection(rotation[0], rotation[1]) : 0;
                        this.alpha = 0;
                        this.zOrder = zOrder ? zOrder : 1000;
                        let RGBA = [];
                        RGBA[0] = colorRGBA ? ToolsAdmin._Number.randomOneBySection(colorRGBA[0][0], colorRGBA[1][0]) : ToolsAdmin._Number.randomOneBySection(180, 255);
                        RGBA[1] = colorRGBA ? ToolsAdmin._Number.randomOneBySection(colorRGBA[0][1], colorRGBA[1][1]) : ToolsAdmin._Number.randomOneBySection(10, 180);
                        RGBA[2] = colorRGBA ? ToolsAdmin._Number.randomOneBySection(colorRGBA[0][2], colorRGBA[1][2]) : ToolsAdmin._Number.randomOneBySection(10, 180);
                        RGBA[3] = colorRGBA ? ToolsAdmin._Number.randomOneBySection(colorRGBA[0][3], colorRGBA[1][3]) : ToolsAdmin._Number.randomOneBySection(1, 1);
                        ColorAdmin._colour(this, RGBA);
                    }
                }
                _Particle._ParticleImgBase = _ParticleImgBase;
                function _snow(parent, centerPoint, sectionWH, width, height, rotation, urlArr, colorRGBA, zOrder, distance, rotationSpeed, speed, windX) {
                    let Img = new _ParticleImgBase(parent, centerPoint, sectionWH, width, height, rotation, urlArr, colorRGBA, zOrder);
                    let _rotationSpeed = rotationSpeed ? ToolsAdmin._Number.randomOneBySection(rotationSpeed[0], rotationSpeed[1]) : ToolsAdmin._Number.randomOneBySection(0, 1);
                    _rotationSpeed = ToolsAdmin._Number.randomOneHalf() == 0 ? _rotationSpeed : -_rotationSpeed;
                    let speed0 = speed ? ToolsAdmin._Number.randomOneBySection(speed[0], speed[1]) : ToolsAdmin._Number.randomOneBySection(1, 2.5);
                    let _windX = windX ? ToolsAdmin._Number.randomOneBySection(windX[0], windX[1]) : 0;
                    let moveCaller = {
                        alpha: true,
                        move: false,
                        vinish: false,
                    };
                    Img['moveCaller'] = moveCaller;
                    let distance0 = 0;
                    let distance1 = distance ? ToolsAdmin._Number.randomOneBySection(distance[0], distance[1]) : ToolsAdmin._Number.randomOneBySection(100, 300);
                    TimerAdmin._frameLoop(1, moveCaller, () => {
                        Img.x += _windX;
                        Img.rotation += _rotationSpeed;
                        if (Img.alpha < 1 && moveCaller.alpha) {
                            Img.alpha += 0.05;
                            distance0 = Img.y++;
                            if (Img.alpha >= 1) {
                                moveCaller.alpha = false;
                                moveCaller.move = true;
                            }
                        }
                        if (distance0 < distance1 && moveCaller.move) {
                            distance0 = Img.y += speed0;
                            if (distance0 >= distance1) {
                                moveCaller.move = false;
                                moveCaller.vinish = true;
                            }
                        }
                        if (moveCaller.vinish) {
                            Img.alpha -= 0.03;
                            Img.y += speed0;
                            if (Img.alpha <= 0 || speed0 <= 0) {
                                Img.removeSelf();
                                Laya.timer.clearAll(moveCaller);
                            }
                        }
                    });
                    return Img;
                }
                _Particle._snow = _snow;
                function _downwardSpray(parent, point, width, height, angle, urlArr, colorRGBA, vanishDistance, moveSpeed, gravity, accelerated, rotationSpeed, scaleRotationSpeed, skewSpeed, zOrder) {
                    const Img = new _ParticleImgBase(parent, point, [0, 0], width, height, null, urlArr, colorRGBA, zOrder);
                    const _angle = angle ? ToolsAdmin._Number.randomOneBySection(angle[0], angle[1]) : ToolsAdmin._Number.randomOneBySection(0, 90);
                    const p = ToolsAdmin._Point.angleByPoint(_angle);
                    const _vanishDistance = vanishDistance ? ToolsAdmin._Number.randomOneBySection(vanishDistance[0], vanishDistance[1]) : ToolsAdmin._Number.randomOneBySection(200, 800);
                    let _speed = moveSpeed ? ToolsAdmin._Number.randomOneBySection(moveSpeed[0], moveSpeed[1]) : ToolsAdmin._Number.randomOneBySection(10, 30);
                    let accelerated0 = accelerated ? ToolsAdmin._Number.randomOneBySection(accelerated[0], accelerated[1]) : ToolsAdmin._Number.randomOneBySection(0.3, 1.5);
                    const _gravity = gravity ? ToolsAdmin._Number.randomOneBySection(gravity[0], gravity[1]) : ToolsAdmin._Number.randomOneBySection(1, 5);
                    let acc = 0;
                    const moveCaller = {
                        appear: true,
                        move: false,
                        dropFp: null,
                        drop: false,
                        vinish: false,
                        scaleSub: true,
                        scaleAdd: false,
                        rotateFunc: null,
                    };
                    moveCaller.rotateFunc = rotatingWay(Img, rotationSpeed, scaleRotationSpeed, skewSpeed);
                    Img['moveCaller'] = moveCaller;
                    TimerAdmin._frameLoop(1, moveCaller, () => {
                        moveCaller.rotateFunc();
                        if (moveCaller.appear) {
                            Img.alpha += 0.5;
                            if (Img.alpha >= 1) {
                                moveCaller.appear = false;
                                moveCaller.move = true;
                            }
                            Img.x += p.x * _speed;
                            Img.y += p.y * _speed;
                        }
                        if (moveCaller.move) {
                            acc -= accelerated0;
                            const speed0 = _speed + acc;
                            Img.x += p.x * speed0;
                            Img.y += p.y * speed0;
                            if (speed0 <= 1) {
                                _speed = 1;
                                moveCaller.dropFp = new Laya.Point(Img.x, Img.y);
                                moveCaller.move = false;
                                moveCaller.drop = true;
                            }
                        }
                        if (moveCaller.drop) {
                            Img.x += p.x * _speed;
                            Img.y += p.y * _speed;
                            if (moveCaller.dropFp.distance(Img.x, Img.y) > _vanishDistance) {
                                moveCaller.drop = false;
                                moveCaller.vinish = true;
                            }
                        }
                        if (moveCaller.vinish) {
                            Img.alpha -= 0.05;
                            if (Img.alpha <= 0.3) {
                                Img.removeSelf();
                                Laya.timer.clearAll(moveCaller);
                            }
                        }
                        Img.y += _gravity;
                    });
                    return Img;
                }
                _Particle._downwardSpray = _downwardSpray;
                function rotatingWay(Img, rotationSpeed, scaleRotationSpeed, skewSpeed) {
                    let _rotationSpeed = rotationSpeed ? ToolsAdmin._Number.randomOneBySection(rotationSpeed[0], rotationSpeed[1]) : ToolsAdmin._Number.randomOneBySection(0, 1);
                    _rotationSpeed = ToolsAdmin._Number.randomOneHalf() == 0 ? _rotationSpeed : -_rotationSpeed;
                    const _scaleSpeed = scaleRotationSpeed ? ToolsAdmin._Number.randomOneBySection(scaleRotationSpeed[0], scaleRotationSpeed[1]) : ToolsAdmin._Number.randomOneBySection(0, 0.25);
                    const _scaleDir = ToolsAdmin._Number.randomOneHalf();
                    let _skewSpeed = skewSpeed ? ToolsAdmin._Number.randomOneBySection(skewSpeed[0], skewSpeed[1]) : ToolsAdmin._Number.randomOneBySection(1, 10);
                    _skewSpeed = ToolsAdmin._Number.randomOneHalf() === 1 ? _skewSpeed : -_skewSpeed;
                    const _skewDir = ToolsAdmin._Number.randomOneHalf();
                    const _scaleOrSkew = ToolsAdmin._Number.randomOneHalf();
                    var rotateFunc = () => {
                        Img.rotation += _rotationSpeed;
                        if (_scaleOrSkew === 1) {
                            if (_skewDir === 1) {
                                Img.skewX += _skewSpeed;
                            }
                            else {
                                Img.skewY += _skewSpeed;
                            }
                        }
                        else {
                            if (_scaleDir === 1) {
                                if (Img['moveCaller']['scaleSub']) {
                                    Img.scaleX -= _scaleSpeed;
                                    if (Img.scaleX <= 0) {
                                        Img['moveCaller']['scaleSub'] = false;
                                    }
                                }
                                else {
                                    Img.scaleX += _scaleSpeed;
                                    if (Img.scaleX >= 1) {
                                        Img['moveCaller']['scaleSub'] = true;
                                    }
                                }
                            }
                            else {
                                if (Img['moveCaller']['scaleSub']) {
                                    Img.scaleY -= _scaleSpeed;
                                    if (Img.scaleY <= 0) {
                                        Img['moveCaller']['scaleSub'] = false;
                                    }
                                }
                                else {
                                    Img.scaleY += _scaleSpeed;
                                    if (Img.scaleY >= 1) {
                                        Img['moveCaller']['scaleSub'] = true;
                                    }
                                }
                            }
                        }
                    };
                    return rotateFunc;
                }
                function _fallingRotate(parent, centerPoint, sectionWH, width, height, urlArr, colorRGBA, distance, moveSpeed, scaleRotationSpeed, skewSpeed, rotationSpeed, zOrder) {
                    const Img = new _ParticleImgBase(parent, centerPoint, sectionWH, width, height, null, urlArr, colorRGBA, zOrder);
                    const _moveSpeed = moveSpeed ? ToolsAdmin._Number.randomOneBySection(moveSpeed[0], moveSpeed[1]) : ToolsAdmin._Number.randomOneBySection(1, 2.5);
                    let _distance0 = 0;
                    const _distance = distance ? ToolsAdmin._Number.randomOneBySection(distance[0], distance[1]) : ToolsAdmin._Number.randomOneBySection(100, 300);
                    const moveCaller = {
                        appear: true,
                        move: false,
                        vinish: false,
                        scaleSub: true,
                        scaleAdd: false,
                        rotateFunc: null,
                    };
                    moveCaller.rotateFunc = rotatingWay(Img, rotationSpeed, scaleRotationSpeed, skewSpeed);
                    Img['moveCaller'] = moveCaller;
                    TimerAdmin._frameLoop(1, moveCaller, () => {
                        moveCaller.rotateFunc();
                        if (moveCaller.appear) {
                            Img.alpha += 0.05;
                            Img.y += _moveSpeed / 2;
                            if (Img.alpha >= 1) {
                                moveCaller.appear = false;
                                moveCaller.move = true;
                            }
                        }
                        if (moveCaller.move) {
                            Img.y += _moveSpeed;
                            _distance0 += _moveSpeed;
                            if (_distance0 >= _distance) {
                                moveCaller.move = false;
                                moveCaller.vinish = true;
                            }
                        }
                        if (moveCaller.vinish) {
                            Img.alpha -= 0.01;
                            Img.y += _moveSpeed;
                            if (Img.alpha <= 0) {
                                Img.removeSelf();
                                Laya.timer.clearAll(moveCaller);
                            }
                        }
                    });
                    return Img;
                }
                _Particle._fallingRotate = _fallingRotate;
                function _fallingVertical(parent, centerPoint, sectionWH, width, height, rotation, urlArr, colorRGBA, zOrder, distance, speed, accelerated) {
                    let Img = new _ParticleImgBase(parent, centerPoint, sectionWH, width, height, rotation, urlArr, colorRGBA, zOrder);
                    let speed0 = speed ? ToolsAdmin._Number.randomOneBySection(speed[0], speed[1]) : ToolsAdmin._Number.randomOneBySection(4, 8);
                    let accelerated0 = accelerated ? ToolsAdmin._Number.randomOneBySection(accelerated[0], accelerated[1]) : ToolsAdmin._Number.randomOneBySection(0.25, 0.45);
                    let acc = 0;
                    let moveCaller = {
                        alpha: true,
                        move: false,
                        vinish: false,
                    };
                    Img['moveCaller'] = moveCaller;
                    let distance1 = distance ? ToolsAdmin._Number.randomOneBySection(distance[0], distance[1]) : ToolsAdmin._Number.randomOneBySection(100, 300);
                    let fY = Img.y;
                    TimerAdmin._frameLoop(1, moveCaller, () => {
                        if (Img.alpha < 1 && moveCaller.alpha) {
                            Img.alpha += 0.04;
                            if (Img.alpha >= 1) {
                                moveCaller.alpha = false;
                                moveCaller.move = true;
                            }
                        }
                        if (!moveCaller.alpha) {
                            acc += accelerated0;
                            Img.y += (speed0 + acc);
                        }
                        if (!moveCaller.alpha && moveCaller.move) {
                            if (Img.y - fY >= distance1) {
                                moveCaller.move = false;
                                moveCaller.vinish = true;
                            }
                        }
                        if (moveCaller.vinish) {
                            Img.alpha -= 0.03;
                            if (Img.alpha <= 0) {
                                Laya.timer.clearAll(moveCaller);
                                Img.removeSelf();
                            }
                        }
                    });
                    return Img;
                }
                _Particle._fallingVertical = _fallingVertical;
                function _fallingVertical_Reverse(parent, centerPoint, sectionWH, width, height, rotation, urlArr, colorRGBA, zOrder, distance, speed, accelerated) {
                    let Img = new _ParticleImgBase(parent, centerPoint, sectionWH, width, height, rotation, urlArr, colorRGBA, zOrder);
                    let speed0 = speed ? ToolsAdmin._Number.randomOneBySection(speed[0], speed[1]) : ToolsAdmin._Number.randomOneBySection(4, 8);
                    let accelerated0 = accelerated ? ToolsAdmin._Number.randomOneBySection(accelerated[0], accelerated[1]) : ToolsAdmin._Number.randomOneBySection(0.25, 0.45);
                    let acc = 0;
                    let moveCaller = {
                        alpha: true,
                        move: false,
                        vinish: false,
                    };
                    Img['moveCaller'] = moveCaller;
                    let distance1 = distance ? ToolsAdmin._Number.randomOneBySection(distance[0], distance[1]) : ToolsAdmin._Number.randomOneBySection(100, 300);
                    let fY = Img.y;
                    TimerAdmin._frameLoop(1, moveCaller, () => {
                        if (Img.alpha < 1 && moveCaller.alpha) {
                            Img.alpha += 0.04;
                            if (Img.alpha >= 1) {
                                moveCaller.alpha = false;
                                moveCaller.move = true;
                            }
                        }
                        if (!moveCaller.alpha) {
                            acc += accelerated0;
                            Img.y += (speed0 + acc);
                        }
                        if (!moveCaller.alpha && moveCaller.move) {
                            if (Img.y - fY <= distance1) {
                                moveCaller.move = false;
                                moveCaller.vinish = true;
                            }
                        }
                        if (moveCaller.vinish) {
                            Img.alpha -= 0.03;
                            if (Img.alpha <= 0) {
                                Laya.timer.clearAll(moveCaller);
                                Img.removeSelf();
                            }
                        }
                    });
                    return Img;
                }
                _Particle._fallingVertical_Reverse = _fallingVertical_Reverse;
                function _slowlyUp(parent, centerPoint, sectionWH, width, height, rotation, urlArr, colorRGBA, zOrder, distance, speed, accelerated) {
                    let Img = new _ParticleImgBase(parent, centerPoint, sectionWH, width, height, rotation, urlArr, colorRGBA, zOrder);
                    let speed0 = speed ? ToolsAdmin._Number.randomOneBySection(speed[0], speed[1]) : ToolsAdmin._Number.randomOneBySection(1.5, 2);
                    let accelerated0 = accelerated ? ToolsAdmin._Number.randomOneBySection(accelerated[0], accelerated[1]) : ToolsAdmin._Number.randomOneBySection(0.001, 0.005);
                    let acc = 0;
                    let moveCaller = {
                        alpha: true,
                        move: false,
                        vinish: false,
                    };
                    Img['moveCaller'] = moveCaller;
                    let fy = Img.y;
                    let distance0 = 0;
                    let distance1 = distance ? ToolsAdmin._Number.randomOneBySection(distance[0], distance[1]) : ToolsAdmin._Number.randomOneBySection(-250, -600);
                    TimerAdmin._frameLoop(1, moveCaller, () => {
                        if (Img.alpha < 1 && moveCaller.alpha) {
                            Img.alpha += 0.03;
                            if (Img.alpha >= 1) {
                                moveCaller.alpha = false;
                                moveCaller.move = true;
                            }
                        }
                        if (distance0 > distance1 && moveCaller.move) {
                        }
                        else {
                            moveCaller.move = false;
                            moveCaller.vinish = true;
                        }
                        if (moveCaller.vinish) {
                            Img.alpha -= 0.02;
                            Img.scaleX -= 0.005;
                            Img.scaleY -= 0.005;
                            if (Img.alpha <= 0) {
                                Img.removeSelf();
                                Laya.timer.clearAll(moveCaller);
                            }
                        }
                        acc += accelerated0;
                        Img.y -= (speed0 + acc);
                        distance0 = fy - Img.y;
                    });
                    return Img;
                }
                _Particle._slowlyUp = _slowlyUp;
                function _sprayRound(parent, centerPoint, width, height, rotation, urlArr, colorRGBA, distance, time, moveAngle, rotationSpeed, zOrder) {
                    let Img = new _ParticleImgBase(parent, centerPoint, [0, 0], width, height, rotation, urlArr, colorRGBA, zOrder);
                    let centerPoint0 = centerPoint ? centerPoint : new Laya.Point(0, 0);
                    let radius = 0;
                    const _time = time ? ToolsAdmin._Number.randomOneBySection(time[0], time[1]) : ToolsAdmin._Number.randomOneBySection(30, 50);
                    const _distance = distance ? ToolsAdmin._Number.randomOneBySection(distance[0], distance[1]) : ToolsAdmin._Number.randomOneBySection(100, 200);
                    const _speed = _distance / _time;
                    const _angle = moveAngle ? ToolsAdmin._Number.randomOneBySection(moveAngle[0], moveAngle[1]) : ToolsAdmin._Number.randomOneBySection(0, 360);
                    let rotationSpeed0 = rotationSpeed ? ToolsAdmin._Number.randomOneBySection(rotationSpeed[0], rotationSpeed[1]) : ToolsAdmin._Number.randomOneBySection(0, 20);
                    rotationSpeed0 = ToolsAdmin._Number.randomOneHalf() == 0 ? rotationSpeed0 : -rotationSpeed0;
                    const vinishTime = ToolsAdmin._Number.randomOneInt(60);
                    const subAlpha = 1 / vinishTime;
                    let moveCaller = {
                        alpha: true,
                        move: false,
                        vinish: false,
                    };
                    Img['moveCaller'] = moveCaller;
                    TimerAdmin._frameLoop(1, moveCaller, () => {
                        Img.rotation += rotationSpeed0;
                        if (Img.alpha < 1 && moveCaller.alpha) {
                            Img.alpha += 0.5;
                            if (Img.alpha >= 1) {
                                moveCaller.alpha = false;
                                moveCaller.move = true;
                            }
                        }
                        else {
                            if (!moveCaller.vinish) {
                                radius += _speed;
                                let point = ToolsAdmin._Point.getRoundPosOld(_angle, radius, centerPoint0);
                                Img.pos(point.x, point.y);
                                if (radius > _distance) {
                                    moveCaller.move = false;
                                    moveCaller.vinish = true;
                                }
                            }
                            else {
                                Img.alpha -= subAlpha;
                                if (Img.alpha <= 0) {
                                    Img.removeSelf();
                                    Laya.timer.clearAll(moveCaller);
                                }
                                radius += _speed / 2;
                                let point = ToolsAdmin._Point.getRoundPosOld(_angle, radius, centerPoint0);
                                Img.pos(point.x, point.y);
                            }
                        }
                    });
                    return Img;
                }
                _Particle._sprayRound = _sprayRound;
                function _spray(parent, centerPoint, width, height, rotation, urlArr, colorRGBA, distance, moveAngle, rotationSpeed, speed, accelerated, zOrder) {
                    let Img = new _ParticleImgBase(parent, centerPoint, [0, 0], width, height, rotation, urlArr, colorRGBA, zOrder);
                    let centerPoint0 = centerPoint ? centerPoint : new Laya.Point(0, 0);
                    let speed0 = speed ? ToolsAdmin._Number.randomOneBySection(speed[0], speed[1]) : ToolsAdmin._Number.randomOneBySection(3, 10);
                    let accelerated0 = accelerated ? ToolsAdmin._Number.randomOneBySection(accelerated[0], accelerated[1]) : ToolsAdmin._Number.randomOneBySection(0.25, 0.45);
                    let acc = 0;
                    let moveCaller = {
                        alpha: true,
                        move: false,
                        vinish: false,
                    };
                    Img['moveCaller'] = moveCaller;
                    let radius = 0;
                    let distance1 = distance ? ToolsAdmin._Number.randomOneBySection(distance[0], distance[1]) : ToolsAdmin._Number.randomOneBySection(100, 200);
                    let angle0 = moveAngle ? ToolsAdmin._Number.randomOneBySection(moveAngle[0], moveAngle[1]) : ToolsAdmin._Number.randomOneBySection(0, 360);
                    let rotationSpeed0 = rotationSpeed ? ToolsAdmin._Number.randomOneBySection(rotationSpeed[0], rotationSpeed[1]) : ToolsAdmin._Number.randomOneBySection(0, 20);
                    rotationSpeed0 = ToolsAdmin._Number.randomOneHalf() == 0 ? rotationSpeed0 : -rotationSpeed0;
                    TimerAdmin._frameLoop(1, moveCaller, () => {
                        Img.rotation += rotationSpeed0;
                        if (Img.alpha < 1 && moveCaller.alpha) {
                            Img.alpha += 0.5;
                            if (Img.alpha >= 1) {
                                moveCaller.alpha = false;
                                moveCaller.move = true;
                            }
                        }
                        else {
                            if (radius < distance1 && moveCaller.move) {
                            }
                            else {
                                moveCaller.move = false;
                                moveCaller.vinish = true;
                            }
                            if (moveCaller.vinish) {
                                Img.alpha -= 0.05;
                                if (Img.alpha <= 0.3) {
                                    Img.removeSelf();
                                    Laya.timer.clearAll(moveCaller);
                                }
                            }
                            acc += accelerated0;
                            radius += speed0 + acc;
                            let point = ToolsAdmin._Point.getRoundPosOld(angle0, radius, centerPoint0);
                            Img.pos(point.x, point.y);
                        }
                    });
                    return Img;
                }
                _Particle._spray = _spray;
                function _outsideBox(parent, centerPoint, sectionWH, width, height, rotation, urlArr, colorRGBA, zOrder, curtailAngle, distance, rotateSpeed, speed, accelerated) {
                    let Img = new _ParticleImgBase(parent, centerPoint, [0, 0], width, height, rotation, urlArr, colorRGBA, zOrder);
                    let _angle = 0;
                    sectionWH = sectionWH ? sectionWH : [100, 100];
                    let fixedXY = ToolsAdmin._Number.randomOneHalf() == 0 ? 'x' : 'y';
                    curtailAngle = curtailAngle ? curtailAngle : 60;
                    if (fixedXY == 'x') {
                        if (ToolsAdmin._Number.randomOneHalf() == 0) {
                            Img.x += sectionWH[0];
                            _angle = ToolsAdmin._Number.randomOneHalf() == 0 ? ToolsAdmin._Number.randomOneBySection(0, 90 - curtailAngle) : ToolsAdmin._Number.randomOneBySection(0, -90 + curtailAngle);
                        }
                        else {
                            Img.x -= sectionWH[0];
                            _angle = ToolsAdmin._Number.randomOneBySection(90 + curtailAngle, 270 - curtailAngle);
                        }
                        Img.y += ToolsAdmin._Number.randomOneBySection(-sectionWH[1], sectionWH[1]);
                    }
                    else {
                        if (ToolsAdmin._Number.randomOneHalf() == 0) {
                            Img.y -= sectionWH[1];
                            _angle = ToolsAdmin._Number.randomOneBySection(180 + curtailAngle, 360 - curtailAngle);
                        }
                        else {
                            Img.y += sectionWH[1];
                            _angle = ToolsAdmin._Number.randomOneBySection(0 + curtailAngle, 180 - curtailAngle);
                        }
                        Img.x += ToolsAdmin._Number.randomOneBySection(-sectionWH[0], sectionWH[0]);
                    }
                    let p = ToolsAdmin._Point.angleByPoint(_angle);
                    let _distance = distance ? ToolsAdmin._Number.randomOneBySection(distance[0], distance[1]) : ToolsAdmin._Number.randomOneBySection(20, 50);
                    let speed0 = speed ? ToolsAdmin._Number.randomOneBySection(speed[0], speed[1]) : ToolsAdmin._Number.randomOneBySection(0.5, 1);
                    let accelerated0 = accelerated ? ToolsAdmin._Number.randomOneBySection(accelerated[0], accelerated[1]) : ToolsAdmin._Number.randomOneBySection(0.25, 0.45);
                    let acc = 0;
                    let rotationSpeed0 = rotateSpeed ? ToolsAdmin._Number.randomOneBySection(rotateSpeed[0], rotateSpeed[1]) : ToolsAdmin._Number.randomOneBySection(0, 20);
                    let firstP = new Laya.Point(Img.x, Img.y);
                    let moveCaller = {
                        alpha: true,
                        move: false,
                        vinish: false,
                    };
                    Img['moveCaller'] = moveCaller;
                    TimerAdmin._frameLoop(1, moveCaller, () => {
                        Img.rotation += rotationSpeed0;
                        if (moveCaller.alpha) {
                            Img.alpha += 0.5;
                            if (Img.alpha >= 1) {
                                moveCaller.alpha = false;
                                moveCaller.move = true;
                            }
                        }
                        else if (moveCaller.move) {
                            if (firstP.distance(Img.x, Img.y) >= _distance) {
                                moveCaller.move = false;
                                moveCaller.vinish = true;
                            }
                        }
                        else if (moveCaller.vinish) {
                            Img.alpha -= 0.05;
                            if (Img.alpha <= 0.3) {
                                Img.removeSelf();
                                Laya.timer.clearAll(moveCaller);
                            }
                        }
                        if (!moveCaller.alpha) {
                            acc += accelerated0;
                            Img.x += p.x * (speed0 + acc);
                            Img.y += p.y * (speed0 + acc);
                        }
                    });
                    return Img;
                }
                _Particle._outsideBox = _outsideBox;
                function _moveToTargetToMove(parent, centerPoint, width, height, rotation, angle, urlArr, colorRGBA, zOrder, distance1, distance2, rotationSpeed, speed, accelerated) {
                    let Img = new _ParticleImgBase(parent, centerPoint, [0, 0], width, height, rotation, urlArr, colorRGBA, zOrder);
                    let centerPoint0 = centerPoint ? centerPoint : new Laya.Point(0, 0);
                    let speed0 = speed ? ToolsAdmin._Number.randomOneBySection(speed[0], speed[1]) : ToolsAdmin._Number.randomOneBySection(5, 6);
                    let accelerated0 = accelerated ? ToolsAdmin._Number.randomOneBySection(accelerated[0], accelerated[1]) : ToolsAdmin._Number.randomOneBySection(0.25, 0.45);
                    let acc = 0;
                    let moveCaller = {
                        alpha: true,
                        move1: false,
                        stop: false,
                        move2: false,
                        vinish: false,
                    };
                    Img['moveCaller'] = moveCaller;
                    let radius = 0;
                    let dis1 = distance1 ? ToolsAdmin._Number.randomOneBySection(distance1[0], distance1[1]) : ToolsAdmin._Number.randomOneBySection(100, 200);
                    let dis2 = distance2 ? ToolsAdmin._Number.randomOneBySection(distance2[0], distance2[1]) : ToolsAdmin._Number.randomOneBySection(100, 200);
                    let angle0 = angle ? ToolsAdmin._Number.randomOneBySection(angle[0], angle[1]) : ToolsAdmin._Number.randomOneBySection(0, 360);
                    Img.rotation = angle0 - 90;
                    let rotationSpeed0 = rotationSpeed ? ToolsAdmin._Number.randomOneBySection(rotationSpeed[0], rotationSpeed[1]) : ToolsAdmin._Number.randomOneBySection(0, 20);
                    TimerAdmin._frameLoop(1, moveCaller, () => {
                        if (moveCaller.alpha) {
                            acc += accelerated0;
                            radius += speed0 + acc;
                            Img.alpha += 0.5;
                            if (Img.alpha >= 1) {
                                moveCaller.alpha = false;
                                moveCaller.move1 = true;
                            }
                        }
                        else if (moveCaller.move1) {
                            acc += accelerated0;
                            radius += speed0 + acc;
                            if (radius >= dis1) {
                                moveCaller.move1 = false;
                                moveCaller.stop = true;
                            }
                        }
                        else if (moveCaller.stop) {
                            acc -= 0.3;
                            radius += 0.1;
                            if (acc <= 0) {
                                moveCaller.stop = false;
                                moveCaller.move2 = true;
                            }
                        }
                        else if (moveCaller.move2) {
                            acc += accelerated0 / 2;
                            radius += speed0 + acc;
                            if (radius >= dis1 + dis2) {
                                moveCaller.move2 = false;
                                moveCaller.vinish = true;
                            }
                        }
                        else if (moveCaller.vinish) {
                            radius += 0.5;
                            Img.alpha -= 0.05;
                            if (Img.alpha <= 0) {
                                Img.removeSelf();
                                Laya.timer.clearAll(moveCaller);
                            }
                        }
                        let point = ToolsAdmin._Point.getRoundPosOld(angle0, radius, centerPoint0);
                        Img.pos(point.x, point.y);
                    });
                    return Img;
                }
                _Particle._moveToTargetToMove = _moveToTargetToMove;
                function _AnnularInhalation(parent, centerPoint, radius, rotation, width, height, urlArr, speed, accelerated, zOrder) {
                    let Img = new Laya.Image();
                    parent.addChild(Img);
                    width = width ? width : [25, 50];
                    Img.width = ToolsAdmin._Number.randomCountBySection(width[0], width[1])[0];
                    Img.height = height ? ToolsAdmin._Number.randomCountBySection(height[0], height[1])[0] : Img.width;
                    Img.pivotX = Img.width / 2;
                    Img.pivotY = Img.height / 2;
                    Img.skin = urlArr ? ToolsAdmin._Array.randomGetOut(urlArr)[0] : _SkinUrl[ToolsAdmin._Number.randomCountBySection(0, 12)[0]];
                    let radius0 = ToolsAdmin._Number.randomCountBySection(radius[0], radius[1])[0];
                    Img.alpha = 0;
                    let speed0 = speed ? ToolsAdmin._Number.randomCountBySection(speed[0], speed[1])[0] : ToolsAdmin._Number.randomCountBySection(5, 10)[0];
                    let angle = rotation ? ToolsAdmin._Number.randomCountBySection(rotation[0], rotation[1])[0] : ToolsAdmin._Number.randomCountBySection(0, 360)[0];
                    let caller = {};
                    let acc = 0;
                    accelerated = accelerated ? accelerated : 0.35;
                    TimerAdmin._frameLoop(1, caller, () => {
                        if (Img.alpha < 1) {
                            Img.alpha += 0.05;
                            acc += (accelerated / 5);
                            radius0 -= (speed0 / 2 + acc);
                        }
                        else {
                            acc += accelerated;
                            radius0 -= (speed0 + acc);
                        }
                        let point = ToolsAdmin._Point.getRoundPosOld(angle, radius0, centerPoint);
                        Img.pos(point.x, point.y);
                        if (point.distance(centerPoint.x, centerPoint.y) <= 20 || point.distance(centerPoint.x, centerPoint.y) >= 1000) {
                            Img.removeSelf();
                            Laya.timer.clearAll(caller);
                        }
                    });
                    return Img;
                }
                _Particle._AnnularInhalation = _AnnularInhalation;
            })(_Particle = Eff2DAdmin._Particle || (Eff2DAdmin._Particle = {}));
            let _Glitter;
            (function (_Glitter) {
                class _GlitterImage extends Laya.Image {
                    constructor(parent, centerPos, radiusXY, urlArr, colorRGBA, width, height, zOder) {
                        super();
                        if (!parent.parent) {
                            return;
                        }
                        parent.addChild(this);
                        this.skin = urlArr ? ToolsAdmin._Array.randomGetOne(urlArr) : _SkinUrl.星星1;
                        this.width = width ? ToolsAdmin._Number.randomOneBySection(width[0], width[1]) : 80;
                        this.height = height ? ToolsAdmin._Number.randomOneBySection(height[0], height[1]) : this.width;
                        this.pivotX = this.width / 2;
                        this.pivotY = this.height / 2;
                        let p = radiusXY ? ToolsAdmin._Point.randomPointByCenter(centerPos, radiusXY[0], radiusXY[1], 1) : ToolsAdmin._Point.randomPointByCenter(centerPos, 100, 100, 1);
                        this.pos(p[0].x, p[0].y);
                        let RGBA = [];
                        RGBA[0] = colorRGBA ? ToolsAdmin._Number.randomOneBySection(colorRGBA[0][0], colorRGBA[1][0]) : ToolsAdmin._Number.randomOneBySection(10, 255);
                        RGBA[1] = colorRGBA ? ToolsAdmin._Number.randomOneBySection(colorRGBA[0][1], colorRGBA[1][1]) : ToolsAdmin._Number.randomOneBySection(200, 255);
                        RGBA[2] = colorRGBA ? ToolsAdmin._Number.randomOneBySection(colorRGBA[0][2], colorRGBA[1][2]) : ToolsAdmin._Number.randomOneBySection(10, 255);
                        RGBA[3] = colorRGBA ? ToolsAdmin._Number.randomOneBySection(colorRGBA[0][3], colorRGBA[1][3]) : ToolsAdmin._Number.randomOneBySection(1, 1);
                        ColorAdmin._colour(this, RGBA);
                        this.alpha = 0;
                        this.zOrder = zOder ? zOder : 1000;
                    }
                }
                _Glitter._GlitterImage = _GlitterImage;
                function _blinkStar(parent, centerPos, radiusXY, urlArr, colorRGBA, width, height, scale, speed, rotateSpeed, zOder) {
                    let Img = new _GlitterImage(parent, centerPos, radiusXY, urlArr, colorRGBA, width, height, zOder);
                    Img.scaleX = 0;
                    Img.scaleY = 0;
                    let _scale = scale ? ToolsAdmin._Number.randomOneBySection(scale[0], scale[1]) : ToolsAdmin._Number.randomOneBySection(0.8, 1.2);
                    let _speed = speed ? ToolsAdmin._Number.randomOneBySection(speed[0], speed[1]) : ToolsAdmin._Number.randomOneBySection(0.01, 0.02);
                    let _rotateSpeed = rotateSpeed ? ToolsAdmin._Number.randomOneInt(rotateSpeed[0], rotateSpeed[1]) : ToolsAdmin._Number.randomOneInt(0, 5);
                    _rotateSpeed = ToolsAdmin._Number.randomOneHalf() == 0 ? -_rotateSpeed : _rotateSpeed;
                    let moveCaller = {
                        appear: true,
                        scale: false,
                        vanish: false,
                    };
                    Img['moveCaller'] = moveCaller;
                    var ani = () => {
                        if (moveCaller.appear) {
                            Img.alpha += 0.1;
                            Img.rotation += _rotateSpeed;
                            Img.scaleX = Img.scaleY += _speed;
                            if (Img.alpha >= 1) {
                                moveCaller.appear = false;
                                moveCaller.scale = true;
                            }
                        }
                        else if (moveCaller.scale) {
                            Img.rotation += _rotateSpeed;
                            Img.scaleX = Img.scaleY += _speed;
                            if (Img.scaleX > _scale) {
                                moveCaller.scale = false;
                                moveCaller.vanish = true;
                            }
                        }
                        else if (moveCaller.vanish) {
                            Img.rotation -= _rotateSpeed;
                            Img.alpha -= 0.015;
                            Img.scaleX -= 0.01;
                            Img.scaleY -= 0.01;
                            if (Img.scaleX <= 0) {
                                Img.removeSelf();
                                Laya.timer.clearAll(moveCaller);
                            }
                        }
                    };
                    Laya.timer.frameLoop(1, moveCaller, ani);
                    return Img;
                }
                _Glitter._blinkStar = _blinkStar;
                function _simpleInfinite(parent, x, y, width, height, zOrder, url, speed) {
                    let Img = new Laya.Image();
                    parent.addChild(Img);
                    Img.width = width;
                    Img.height = height;
                    Img.pos(x, y);
                    Img.skin = url ? url : _SkinUrl.方形光圈1;
                    Img.alpha = 0;
                    Img.zOrder = zOrder ? zOrder : 0;
                    let add = true;
                    let caller = {};
                    let func = () => {
                        if (!add) {
                            Img.alpha -= speed ? speed : 0.01;
                            if (Img.alpha <= 0) {
                                if (caller['end']) {
                                    Laya.timer.clearAll(caller);
                                    Img.removeSelf();
                                }
                                else {
                                    add = true;
                                }
                            }
                        }
                        else {
                            Img.alpha += speed ? speed * 2 : 0.01 * 2;
                            if (Img.alpha >= 1) {
                                add = false;
                                caller['end'] = true;
                            }
                        }
                    };
                    Laya.timer.frameLoop(1, caller, func);
                    return Img;
                }
                _Glitter._simpleInfinite = _simpleInfinite;
            })(_Glitter = Eff2DAdmin._Glitter || (Eff2DAdmin._Glitter = {}));
            let _circulation;
            (function (_circulation) {
                class _circulationImage extends Laya.Image {
                    constructor(parent, urlArr, colorRGBA, width, height, zOrder) {
                        super();
                        parent.addChild(this);
                        this.skin = urlArr ? ToolsAdmin._Array.randomGetOne(urlArr) : _SkinUrl.圆形发光1;
                        this.width = width ? ToolsAdmin._Number.randomOneBySection(width[0], width[1]) : 80;
                        this.height = height ? ToolsAdmin._Number.randomOneBySection(height[0], height[1]) : this.width;
                        this.pivotX = this.width / 2;
                        this.pivotY = this.height / 2;
                        let RGBA = [];
                        RGBA[0] = colorRGBA ? ToolsAdmin._Number.randomOneBySection(colorRGBA[0][0], colorRGBA[1][0]) : ToolsAdmin._Number.randomOneBySection(0, 255);
                        RGBA[1] = colorRGBA ? ToolsAdmin._Number.randomOneBySection(colorRGBA[0][1], colorRGBA[1][1]) : ToolsAdmin._Number.randomOneBySection(0, 255);
                        RGBA[2] = colorRGBA ? ToolsAdmin._Number.randomOneBySection(colorRGBA[0][2], colorRGBA[1][2]) : ToolsAdmin._Number.randomOneBySection(0, 255);
                        RGBA[3] = colorRGBA ? ToolsAdmin._Number.randomOneBySection(colorRGBA[0][3], colorRGBA[1][3]) : ToolsAdmin._Number.randomOneBySection(0, 255);
                        ColorAdmin._colour(this, RGBA);
                        this.zOrder = zOrder ? zOrder : 0;
                        this.alpha = 0;
                        this.scaleX = 0;
                        this.scaleY = 0;
                    }
                }
                _circulation._circulationImage = _circulationImage;
                function _corner(parent, posArray, urlArr, colorRGBA, width, height, zOrder, parallel, speed) {
                    if (posArray.length <= 1) {
                        return;
                    }
                    let Img = new _circulationImage(parent, urlArr, colorRGBA, width, height, zOrder);
                    let Imgfootprint = new _circulationImage(parent, urlArr, colorRGBA, width, height, zOrder);
                    Imgfootprint.filters = Img.filters;
                    Img.pos(posArray[0][0], posArray[0][1]);
                    Img.alpha = 1;
                    let moveCaller = {
                        num: 0,
                        alpha: true,
                        move: false,
                    };
                    Img['moveCaller'] = moveCaller;
                    let _speed = speed ? speed : 3;
                    let index = 0;
                    Img.scale(1, 1);
                    TimerAdmin._frameLoop(1, moveCaller, () => {
                        let Imgfootprint = new _circulationImage(parent, urlArr, colorRGBA, width, height, zOrder);
                        Imgfootprint.filters = Img.filters;
                        Imgfootprint.x = Img.x;
                        Imgfootprint.y = Img.y;
                        Imgfootprint.rotation = Img.rotation;
                        Imgfootprint.alpha = 1;
                        Imgfootprint.zOrder = -1;
                        Imgfootprint.scaleX = Img.scaleX;
                        Imgfootprint.scaleY = Img.scaleY;
                        Ani2DAdmin.fadeOut(Imgfootprint, 1, 0, 200, 0, () => {
                            Imgfootprint.removeSelf();
                        });
                        if (Img.parent == null) {
                            Laya.timer.clearAll(moveCaller);
                        }
                        moveCaller.num++;
                        if (urlArr) {
                            if (moveCaller.num > urlArr.length) {
                                moveCaller.num = 0;
                            }
                            else {
                                Img.skin = urlArr[moveCaller.num];
                            }
                        }
                    });
                    var func = () => {
                        let targetXY = [posArray[index][0], posArray[index][1]];
                        let distance = (new Laya.Point(Img.x, Img.y)).distance(targetXY[0], targetXY[1]);
                        if (parallel) {
                            Img.rotation = ToolsAdmin._Point.pointByAngleOld(Img.x - targetXY[0], Img.y - targetXY[1]) + 180;
                        }
                        let time = speed * 100 + distance / 5;
                        if (index == posArray.length + 1) {
                            targetXY = [posArray[0][0], posArray[0][1]];
                        }
                        Ani2DAdmin.move(Img, targetXY[0], targetXY[1], time, () => {
                            index++;
                            if (index == posArray.length) {
                                index = 0;
                            }
                            func();
                        });
                    };
                    func();
                    return Img;
                }
                _circulation._corner = _corner;
            })(_circulation = Eff2DAdmin._circulation || (Eff2DAdmin._circulation = {}));
        })(Eff2DAdmin = Lwg.Eff2DAdmin || (Lwg.Eff2DAdmin = {}));
        let ClickAdmin;
        (function (ClickAdmin) {
            ClickAdmin._aniSwitch = true;
            ClickAdmin._absoluteSwitch = true;
            ClickAdmin._assign = [];
            ClickAdmin._assignIncludeStage = [];
            ClickAdmin._assignExcludeStage = [];
            ClickAdmin._stageSwitch = true;
            function _checkAssign(name) {
                let assign = false;
                if (LwgClick._assign.length > 0) {
                    for (let index = 0; index < LwgClick._assign.length; index++) {
                        const _name = LwgClick._assign[index];
                        if (_name === name) {
                            assign = true;
                        }
                    }
                }
                return assign;
            }
            ClickAdmin._checkAssign = _checkAssign;
            ClickAdmin._Type = {
                no: 'no',
                largen: 'largen',
                reduce: 'reduce',
            };
            ClickAdmin._Use = {
                get value() {
                    return this['Click/name'] ? this['Click/name'] : null;
                },
                set value(val) {
                    this['Click/name'] = val;
                }
            };
            function _effectSwitch(effectType) {
                let btnEffect;
                switch (effectType) {
                    case ClickAdmin._Type.no:
                        btnEffect = new _NoEffect();
                        break;
                    case ClickAdmin._Type.largen:
                        btnEffect = new _Largen();
                        break;
                    case ClickAdmin._Type.reduce:
                        btnEffect = new _Reduce();
                        break;
                    default:
                        btnEffect = new _NoEffect();
                        break;
                }
                return btnEffect;
            }
            ClickAdmin._effectSwitch = _effectSwitch;
            function _on(effect, target, caller, down, move, up, out) {
                const btnEffect = _effectSwitch(effect);
                target.on(Laya.Event.MOUSE_DOWN, caller, down);
                target.on(Laya.Event.MOUSE_MOVE, caller, move);
                target.on(Laya.Event.MOUSE_UP, caller, up);
                target.on(Laya.Event.MOUSE_OUT, caller, out);
                target.on(Laya.Event.MOUSE_DOWN, caller, btnEffect.down);
                target.on(Laya.Event.MOUSE_MOVE, caller, btnEffect.move);
                target.on(Laya.Event.MOUSE_UP, caller, btnEffect.up);
                target.on(Laya.Event.MOUSE_OUT, caller, btnEffect.out);
            }
            ClickAdmin._on = _on;
            function _off(effect, target, caller, down, move, up, out) {
                const btnEffect = _effectSwitch(effect);
                target._off(Laya.Event.MOUSE_DOWN, caller, down);
                target._off(Laya.Event.MOUSE_MOVE, caller, move);
                target._off(Laya.Event.MOUSE_UP, caller, up);
                target._off(Laya.Event.MOUSE_OUT, caller, out);
                target._off(Laya.Event.MOUSE_DOWN, caller, btnEffect.down);
                target._off(Laya.Event.MOUSE_MOVE, caller, btnEffect.move);
                target._off(Laya.Event.MOUSE_UP, caller, btnEffect.up);
                target._off(Laya.Event.MOUSE_OUT, caller, btnEffect.out);
            }
            ClickAdmin._off = _off;
            class _NoEffect {
                down() { }
                ;
                move() { }
                ;
                up() { }
                ;
                out() { }
                ;
            }
            ClickAdmin._NoEffect = _NoEffect;
            class _Largen {
                down(event) {
                    event.currentTarget.scale(1.1, 1.1);
                    AudioAdmin._playSound(LwgClick._audioUrl);
                }
                move() { }
                ;
                up(event) {
                    event.currentTarget.scale(1, 1);
                }
                out(event) {
                    event.currentTarget.scale(1, 1);
                }
            }
            ClickAdmin._Largen = _Largen;
            class _Reduce {
                down(event) {
                    event.currentTarget.scale(0.9, 0.9);
                    AudioAdmin._playSound(LwgClick._audioUrl);
                }
                move() { }
                ;
                up(event) {
                    event.currentTarget.scale(1, 1);
                }
                out(event) {
                    event.currentTarget.scale(1, 1);
                }
            }
            ClickAdmin._Reduce = _Reduce;
        })(ClickAdmin = Lwg.ClickAdmin || (Lwg.ClickAdmin = {}));
        let Ani3DAdmin;
        (function (Ani3DAdmin) {
            Ani3DAdmin.tweenMap = {};
            Ani3DAdmin.frameRate = 1;
            function moveTo(target, toPos, duration, caller, ease, complete, delay = 0, coverBefore = true, update, frame) {
                let position = target.transform.position.clone();
                if (duration == 0 || duration === undefined || duration === null) {
                    target.transform.position = toPos.clone();
                    complete && complete.apply(caller);
                    return;
                }
                if (frame <= 0 || frame === undefined || frame === null) {
                    frame = Ani3DAdmin.frameRate;
                }
                let updateRenderPos = function () {
                    if (target.transform) {
                        target.transform.position = position;
                    }
                    update && update();
                };
                Laya.timer.once(delay, target, function () {
                    Laya.timer.frameLoop(frame, target, updateRenderPos);
                });
                let endTween = function () {
                    if (target.transform) {
                        target.transform.position = toPos.clone();
                        Laya.timer.clear(target, updateRenderPos);
                    }
                    complete && complete.apply(caller);
                };
                let tween = Laya.Tween.to(position, { x: toPos.x, y: toPos.y, z: toPos.z }, duration, ease, Laya.Handler.create(target, endTween), delay, coverBefore);
                if (!Ani3DAdmin.tweenMap[target.id]) {
                    Ani3DAdmin.tweenMap[target.id] = [];
                }
                Ani3DAdmin.tweenMap[target.id].push(tween);
            }
            Ani3DAdmin.moveTo = moveTo;
            function rotateTo(target, toRotation, duration, caller, ease, complete, delay, coverBefore, update, frame) {
                let rotation = target.transform.localRotationEuler.clone();
                if (duration == 0 || duration === undefined || duration === null) {
                    target.transform.localRotationEuler = toRotation.clone();
                    complete && complete.apply(caller);
                    return;
                }
                if (frame <= 0 || frame === undefined || frame === null) {
                    frame = Ani3DAdmin.frameRate;
                }
                let updateRenderRotation = function () {
                    if (target.transform) {
                        target.transform.localRotationEuler = rotation;
                    }
                    update && update();
                };
                Laya.timer.once(delay, target, function () {
                    Laya.timer.frameLoop(frame, target, updateRenderRotation);
                });
                let endTween = function () {
                    if (target.transform) {
                        target.transform.localRotationEuler = toRotation.clone();
                        Laya.timer.clear(target, updateRenderRotation);
                    }
                    complete && complete.apply(caller);
                };
                let tween = Laya.Tween.to(rotation, { x: toRotation.x, y: toRotation.y, z: toRotation.z }, duration, ease, Laya.Handler.create(target, endTween), delay, coverBefore);
                if (!Ani3DAdmin.tweenMap[target.id]) {
                    Ani3DAdmin.tweenMap[target.id] = [];
                }
                Ani3DAdmin.tweenMap[target.id].push(tween);
            }
            Ani3DAdmin.rotateTo = rotateTo;
            function scaleTo(target, toScale, duration, caller, ease, complete, delay, coverBefore, update, frame) {
                let localScale = target.transform.localScale.clone();
                if (duration == 0 || duration === undefined || duration === null) {
                    target.transform.localScale = toScale.clone();
                    complete && complete.apply(caller);
                    return;
                }
                if (frame <= 0 || frame === undefined || frame === null) {
                    frame = Ani3DAdmin.frameRate;
                }
                let updateRenderPos = function () {
                    target.transform.localScale = localScale.clone();
                    update && update();
                };
                Laya.timer.once(delay, this, function () {
                    Laya.timer.frameLoop(frame, target, updateRenderPos);
                });
                let endTween = function () {
                    target.transform.localScale = toScale.clone();
                    Laya.timer.clear(target, updateRenderPos);
                    complete && complete.apply(caller);
                };
                let tween = Laya.Tween.to(localScale, { x: toScale.x, y: toScale.y, z: toScale.z }, duration, ease, Laya.Handler.create(target, endTween), delay, coverBefore);
                if (!Ani3DAdmin.tweenMap[target.id]) {
                    Ani3DAdmin.tweenMap[target.id] = [];
                }
                Ani3DAdmin.tweenMap[target.id].push(tween);
            }
            Ani3DAdmin.scaleTo = scaleTo;
            function ClearTween(target) {
                let tweens = Ani3DAdmin.tweenMap[target.id];
                if (tweens && tweens.length) {
                    while (tweens.length > 0) {
                        let tween = tweens.pop();
                        tween.clear();
                    }
                }
                Laya.timer.clearAll(target);
            }
            Ani3DAdmin.ClearTween = ClearTween;
            function rock(target, range, duration, caller, func, delayed, ease) {
                if (!delayed) {
                    delayed = 0;
                }
                let v1 = new Laya.Vector3(target.transform.localRotationEulerX + range.x, target.transform.localRotationEulerY + range.y, target.transform.localRotationEulerZ + range.z);
                rotateTo(target, v1, duration / 2, caller, ease, () => {
                    let v2 = new Laya.Vector3(target.transform.localRotationEulerX - range.x * 2, target.transform.localRotationEulerY - range.y * 2, target.transform.localRotationEulerZ - range.z * 2);
                    rotateTo(target, v2, duration, caller, ease, () => {
                        let v3 = new Laya.Vector3(target.transform.localRotationEulerX + range.x, target.transform.localRotationEulerY + range.y, target.transform.localRotationEulerZ + range.z);
                        rotateTo(target, v3, duration / 2, caller, ease, () => {
                            if (func) {
                                func();
                            }
                        });
                    });
                }, delayed);
            }
            Ani3DAdmin.rock = rock;
            function moveRotateTo(Sp3d, Target, duration, caller, ease, complete, delay, coverBefore, update, frame) {
                moveTo(Sp3d, Target.transform.position, duration, caller, ease, null, delay, coverBefore, update, frame);
                rotateTo(Sp3d, Target.transform.localRotationEuler, duration, caller, ease, complete, delay, coverBefore, null, frame);
            }
            Ani3DAdmin.moveRotateTo = moveRotateTo;
        })(Ani3DAdmin = Lwg.Ani3DAdmin || (Lwg.Ani3DAdmin = {}));
        let Ani2DAdmin;
        (function (Ani2DAdmin) {
            function _clearAll(arr) {
                for (let index = 0; index < arr.length; index++) {
                    Laya.Tween.clearAll(arr[index]);
                }
            }
            Ani2DAdmin._clearAll = _clearAll;
            function circulation_scale(node, range, time, delayed, func) {
                Laya.Tween.to(node, { scaleX: 1 + range, scaleY: 1 + range }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { scaleX: 1 - range, scaleY: 1 - range }, time / 2, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { scaleX: 1, scaleY: 1 }, time / 2, null, Laya.Handler.create(this, function () {
                            if (func) {
                                func();
                            }
                        }), 0);
                    }), 0);
                }), delayed ? delayed : 0);
            }
            Ani2DAdmin.circulation_scale = circulation_scale;
            function leftRight_Shake(node, range, time, delayed, func, click) {
                if (!delayed) {
                    delayed = 0;
                }
                if (!click) {
                    LwgClick._aniSwitch = false;
                }
                Laya.Tween.to(node, { x: node.x - range }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { x: node.x + range * 2 }, time, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { x: node.x - range }, time, null, Laya.Handler.create(this, function () {
                            if (func) {
                                func();
                            }
                            if (!click) {
                                LwgClick._aniSwitch = true;
                            }
                        }));
                    }));
                }), delayed);
            }
            Ani2DAdmin.leftRight_Shake = leftRight_Shake;
            function rotate(node, Erotate, time, delayed, func) {
                Laya.Tween.to(node, { rotation: Erotate }, time, null, Laya.Handler.create(node, function () {
                    if (func) {
                        func();
                    }
                }), delayed ? delayed : 0);
            }
            Ani2DAdmin.rotate = rotate;
            function upDown_Overturn(node, time, func) {
                Laya.Tween.to(node, { scaleY: 0 }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { scaleY: 1 }, time, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { scaleY: 0 }, time, null, Laya.Handler.create(this, function () {
                            Laya.Tween.to(node, { scaleY: 1 }, time, null, Laya.Handler.create(this, function () {
                                if (func !== null || func !== undefined) {
                                    func();
                                }
                            }), 0);
                        }), 0);
                    }), 0);
                }), 0);
            }
            Ani2DAdmin.upDown_Overturn = upDown_Overturn;
            function leftRight_Overturn(node, time, func) {
                Laya.Tween.to(node, { scaleX: 0 }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { scaleX: 1 }, time, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { scaleX: 0 }, time, null, Laya.Handler.create(this, function () {
                            Laya.Tween.to(node, { scaleX: 1 }, time, null, Laya.Handler.create(this, function () {
                            }), 0);
                            if (func !== null) {
                                func();
                            }
                        }), 0);
                    }), 0);
                }), 0);
            }
            Ani2DAdmin.leftRight_Overturn = leftRight_Overturn;
            function upDwon_Shake(node, range, time, delayed, func) {
                Laya.Tween.to(node, { y: node.y + range }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { y: node.y - range * 2 }, time, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { y: node.y + range }, time, null, Laya.Handler.create(this, function () {
                            if (func !== null) {
                                func();
                            }
                        }));
                    }));
                }), delayed);
            }
            Ani2DAdmin.upDwon_Shake = upDwon_Shake;
            function fadeOut(node, alpha1, alpha2, time, delayed, func, stageClick) {
                node.alpha = alpha1;
                if (stageClick) {
                    LwgClick._aniSwitch = false;
                }
                Laya.Tween.to(node, { alpha: alpha2 }, time, null, Laya.Handler.create(this, function () {
                    if (func) {
                        func();
                    }
                    if (stageClick) {
                        LwgClick._aniSwitch = true;
                    }
                }), delayed ? delayed : 0);
            }
            Ani2DAdmin.fadeOut = fadeOut;
            function fadeOut_KickBack(node, alpha1, alpha2, time, delayed, func) {
                node.alpha = alpha1;
                Laya.Tween.to(node, { alpha: alpha2 }, time, null, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func();
                    }
                }), delayed);
            }
            Ani2DAdmin.fadeOut_KickBack = fadeOut_KickBack;
            function move_FadeOut(node, firstX, firstY, targetX, targetY, time, delayed, func) {
                node.alpha = 0;
                node.x = firstX;
                node.y = firstY;
                Laya.Tween.to(node, { alpha: 1, x: targetX, y: targetY }, time, null, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func();
                    }
                }), delayed);
            }
            Ani2DAdmin.move_FadeOut = move_FadeOut;
            function move_Fade_Out(node, firstX, firstY, targetX, targetY, time, delayed, func) {
                node.alpha = 1;
                node.x = firstX;
                node.y = firstY;
                Laya.Tween.to(node, { alpha: 0, x: targetX, y: targetY }, time, null, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func();
                    }
                }), delayed);
            }
            Ani2DAdmin.move_Fade_Out = move_Fade_Out;
            function move_FadeOut_Scale_01(node, firstX, firstY, targetX, targetY, time, delayed, func) {
                node.alpha = 0;
                node.targetX = 0;
                node.targetY = 0;
                node.x = firstX;
                node.y = firstY;
                Laya.Tween.to(node, { alpha: 1, x: targetX, y: targetY, scaleX: 1, scaleY: 1 }, time, null, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func();
                    }
                }), delayed);
            }
            Ani2DAdmin.move_FadeOut_Scale_01 = move_FadeOut_Scale_01;
            function move_Scale(node, fScale, fX, fY, tX, tY, eScale, time, delayed, ease, func) {
                node.scaleX = fScale;
                node.scaleY = fScale;
                node.x = fX;
                node.y = fY;
                Laya.Tween.to(node, { x: tX, y: tY, scaleX: eScale, scaleY: eScale }, time, ease ? null : ease, Laya.Handler.create(this, function () {
                    if (func) {
                        func();
                    }
                }), delayed ? delayed : 0);
            }
            Ani2DAdmin.move_Scale = move_Scale;
            function move_rotate(Node, tRotate, tPoint, time, delayed, func) {
                Laya.Tween.to(Node, { rotation: tRotate, x: tPoint.x, y: tPoint.y }, time, null, Laya.Handler.create(Node, () => {
                    if (func) {
                        func();
                    }
                }), delayed ? delayed : 0);
            }
            Ani2DAdmin.move_rotate = move_rotate;
            function rotate_Scale(target, fRotate, fScaleX, fScaleY, eRotate, eScaleX, eScaleY, time, delayed, func) {
                target.scaleX = fScaleX;
                target.scaleY = fScaleY;
                target.rotation = fRotate;
                Laya.Tween.to(target, { rotation: eRotate, scaleX: eScaleX, scaleY: eScaleY }, time, null, Laya.Handler.create(this, () => {
                    if (func) {
                        func();
                    }
                    target.rotation = 0;
                }), delayed ? delayed : 0);
            }
            Ani2DAdmin.rotate_Scale = rotate_Scale;
            function drop_Simple(node, fY, tY, rotation, time, delayed, func) {
                node.y = fY;
                Laya.Tween.to(node, { y: tY, rotation: rotation }, time, Laya.Ease.circOut, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func();
                    }
                }), delayed);
            }
            Ani2DAdmin.drop_Simple = drop_Simple;
            function drop_KickBack(target, fAlpha, firstY, targetY, extendY, time1, delayed, func) {
                target.alpha = fAlpha;
                target.y = firstY;
                if (!delayed) {
                    delayed = 0;
                }
                Laya.Tween.to(target, { alpha: 1, y: targetY + extendY }, time1, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(target, { y: targetY - extendY / 2 }, time1 / 2, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(target, { y: targetY }, time1 / 4, null, Laya.Handler.create(this, function () {
                            if (func) {
                                func();
                            }
                        }), 0);
                    }), 0);
                }), delayed);
            }
            Ani2DAdmin.drop_KickBack = drop_KickBack;
            function drop_Excursion(node, targetY, targetX, rotation, time, delayed, func) {
                Laya.Tween.to(node, { x: node.x + targetX, y: node.y + targetY * 1 / 6 }, time, Laya.Ease.expoIn, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { x: node.x + targetX + 50, y: targetY, rotation: rotation }, time, null, Laya.Handler.create(this, function () {
                        if (func !== null) {
                            func();
                        }
                    }), 0);
                }), delayed);
            }
            Ani2DAdmin.drop_Excursion = drop_Excursion;
            function goUp_Simple(node, initialY, initialR, targetY, time, delayed, func) {
                node.y = initialY;
                node.rotation = initialR;
                Laya.Tween.to(node, { y: targetY, rotation: 0 }, time, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func();
                    }
                }), delayed);
            }
            Ani2DAdmin.goUp_Simple = goUp_Simple;
            function cardRotateX_TowFace(node, time, func1, delayed, func2) {
                Laya.Tween.to(node, { scaleX: 0 }, time, null, Laya.Handler.create(this, function () {
                    ToolsAdmin._Node.childrenVisible2D(node, false);
                    if (func1) {
                        func1();
                    }
                    Laya.Tween.to(node, { scaleX: 1 }, time * 0.9, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { scaleX: 0 }, time * 0.8, null, Laya.Handler.create(this, function () {
                            ToolsAdmin._Node.childrenVisible2D(node, true);
                            Laya.Tween.to(node, { scaleX: 1 }, time * 0.7, null, Laya.Handler.create(this, function () {
                                if (func2) {
                                    func2();
                                }
                            }), 0);
                        }), 0);
                    }), 0);
                }), delayed);
            }
            Ani2DAdmin.cardRotateX_TowFace = cardRotateX_TowFace;
            function cardRotateX_OneFace(node, func1, time, delayed, func2) {
                Laya.Tween.to(node, { scaleX: 0 }, time, null, Laya.Handler.create(this, function () {
                    if (func1 !== null) {
                        func1();
                    }
                    Laya.Tween.to(node, { scaleX: 1 }, time, null, Laya.Handler.create(this, function () {
                        if (func2 !== null) {
                            func2();
                        }
                    }), 0);
                }), delayed);
            }
            Ani2DAdmin.cardRotateX_OneFace = cardRotateX_OneFace;
            function cardRotateY_TowFace(node, time, func1, delayed, func2) {
                Laya.Tween.to(node, { scaleY: 0 }, time, null, Laya.Handler.create(this, function () {
                    ToolsAdmin._Node.childrenVisible2D(node, false);
                    if (func1) {
                        func1();
                    }
                    Laya.Tween.to(node, { scaleY: 1 }, time, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { scaleY: 0 }, time, null, Laya.Handler.create(this, function () {
                            Laya.Tween.to(node, { scaleY: 1 }, time * 1 / 2, null, Laya.Handler.create(this, function () {
                                ToolsAdmin._Node.childrenVisible2D(node, true);
                                if (func2) {
                                    func2();
                                }
                            }), 0);
                        }), 0);
                    }), 0);
                }), delayed);
            }
            Ani2DAdmin.cardRotateY_TowFace = cardRotateY_TowFace;
            function cardRotateY_OneFace(node, func1, time, delayed, func2) {
                Laya.Tween.to(node, { scaleY: 0 }, time, null, Laya.Handler.create(this, function () {
                    if (func1) {
                        func1();
                    }
                    Laya.Tween.to(node, { scaleY: 1 }, time, null, Laya.Handler.create(this, function () {
                        if (func2) {
                            func2();
                        }
                    }), 0);
                }), delayed ? delayed : 0);
            }
            Ani2DAdmin.cardRotateY_OneFace = cardRotateY_OneFace;
            function move_changeRotate(node, targetX, targetY, per, rotation_pe, time, func) {
                let targetPerX = targetX * per + node.x * (1 - per);
                let targetPerY = targetY * per + node.y * (1 - per);
                Laya.Tween.to(node, { x: targetPerX, y: targetPerY, rotation: 45 }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { x: targetX, y: targetY, rotation: 0 }, time, null, Laya.Handler.create(this, function () {
                        if (func !== null) {
                            func();
                        }
                    }), 0);
                }), 0);
            }
            Ani2DAdmin.move_changeRotate = move_changeRotate;
            function bomb_LeftRight(node, MaxScale, time, func, delayed) {
                Laya.Tween.to(node, { scaleX: MaxScale }, time, Laya.Ease.cubicInOut, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { scaleX: 0.85 }, time * 0.5, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { scaleX: MaxScale * 0.9 }, time * 0.55, null, Laya.Handler.create(this, function () {
                            Laya.Tween.to(node, { scaleX: 0.95 }, time * 0.6, null, Laya.Handler.create(this, function () {
                                Laya.Tween.to(node, { scaleX: 1 }, time * 0.65, null, Laya.Handler.create(this, function () {
                                    if (func)
                                        func();
                                }), 0);
                            }), 0);
                        }), 0);
                    }), 0);
                }), delayed);
            }
            Ani2DAdmin.bomb_LeftRight = bomb_LeftRight;
            function bombs_Appear(node, firstAlpha, endScale, maxScale, rotation, time, func, delayed) {
                node.scale(0, 0);
                node.alpha = firstAlpha;
                Laya.Tween.to(node, { scaleX: maxScale, scaleY: maxScale, alpha: 1, rotation: rotation }, time, Laya.Ease.cubicInOut, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { scaleX: endScale, scaleY: endScale, rotation: 0 }, time / 2, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { scaleX: endScale + (maxScale - endScale) / 3, scaleY: endScale + (maxScale - endScale) / 3, rotation: 0 }, time / 3, null, Laya.Handler.create(this, function () {
                            Laya.Tween.to(node, { scaleX: endScale, scaleY: endScale, rotation: 0 }, time / 4, null, Laya.Handler.create(this, function () {
                                if (func) {
                                    func();
                                }
                            }), 0);
                        }), 0);
                    }), 0);
                }), delayed ? delayed : 0);
            }
            Ani2DAdmin.bombs_Appear = bombs_Appear;
            function bombs_AppearAllChild(node, firstAlpha, endScale, scale1, rotation1, time1, interval, func, audioType) {
                let de1 = 0;
                if (!interval) {
                    interval = 100;
                }
                for (let index = 0; index < node.numChildren; index++) {
                    let Child = node.getChildAt(index);
                    Child.alpha = 0;
                    Laya.timer.once(de1, this, () => {
                        Child.alpha = 1;
                        if (index !== node.numChildren - 1) {
                            func == null;
                        }
                        bombs_Appear(Child, firstAlpha, endScale, scale1, rotation1, time1, func);
                    });
                    de1 += interval;
                }
            }
            Ani2DAdmin.bombs_AppearAllChild = bombs_AppearAllChild;
            function bombs_VanishAllChild(node, endScale, alpha, rotation, time, interval, func) {
                let de1 = 0;
                if (!interval) {
                    interval = 100;
                }
                for (let index = 0; index < node.numChildren; index++) {
                    let Child = node.getChildAt(index);
                    Laya.timer.once(de1, this, () => {
                        if (index !== node.numChildren - 1) {
                            func == null;
                        }
                        bombs_Vanish(node, endScale, alpha, rotation, time, func);
                    });
                    de1 += interval;
                }
            }
            Ani2DAdmin.bombs_VanishAllChild = bombs_VanishAllChild;
            function bombs_Vanish(node, scale, alpha, rotation, time, func, delayed) {
                Laya.Tween.to(node, { scaleX: scale, scaleY: scale, alpha: alpha, rotation: rotation }, time, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
                    if (func) {
                        func();
                    }
                }), delayed ? delayed : 0);
            }
            Ani2DAdmin.bombs_Vanish = bombs_Vanish;
            function swell_shrink(node, firstScale, scale1, time, delayed, func) {
                if (!delayed) {
                    delayed = 0;
                }
                Laya.Tween.to(node, { scaleX: scale1, scaleY: scale1, alpha: 1, }, time, Laya.Ease.cubicInOut, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { scaleX: firstScale, scaleY: firstScale, rotation: 0 }, time, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { scaleX: firstScale + (scale1 - firstScale) * 0.5, scaleY: firstScale + (scale1 - firstScale) * 0.5, rotation: 0 }, time * 0.5, null, Laya.Handler.create(this, function () {
                            Laya.Tween.to(node, { scaleX: firstScale, scaleY: firstScale, rotation: 0 }, time, null, Laya.Handler.create(this, function () {
                                if (func) {
                                    func();
                                }
                            }), 0);
                        }), 0);
                    }), 0);
                }), delayed);
            }
            Ani2DAdmin.swell_shrink = swell_shrink;
            function move(node, targetX, targetY, time, func, delayed, ease) {
                Laya.Tween.to(node, { x: targetX, y: targetY }, time, ease ? ease : null, Laya.Handler.create(this, function () {
                    if (func) {
                        func();
                    }
                }), delayed ? delayed : 0);
            }
            Ani2DAdmin.move = move;
            function move_Deform_X(node, firstX, firstR, targetX, scaleX, scaleY, time, delayed, func) {
                node.alpha = 0;
                node.x = firstX;
                node.rotation = firstR;
                Laya.Tween.to(node, { x: targetX, scaleX: 1 + scaleX, scaleY: 1 + scaleY, rotation: firstR / 3, alpha: 1 }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { scaleX: 1, scaleY: 1, rotation: 0 }, time, null, Laya.Handler.create(this, function () {
                        if (func !== null) {
                            func();
                        }
                    }), 0);
                }), delayed);
            }
            Ani2DAdmin.move_Deform_X = move_Deform_X;
            function move_Deform_Y(target, firstY, firstR, targeY, scaleX, scaleY, time, delayed, func) {
                target.alpha = 0;
                if (firstY) {
                    target.y = firstY;
                }
                target.rotation = firstR;
                Laya.Tween.to(target, { y: targeY, scaleX: 1 + scaleX, scaleY: 1 + scaleY, rotation: firstR / 3, alpha: 1 }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(target, { scaleX: 1, scaleY: 1, rotation: 0 }, time, null, Laya.Handler.create(this, function () {
                        if (func !== null) {
                            func();
                        }
                    }), 0);
                }), delayed);
            }
            Ani2DAdmin.move_Deform_Y = move_Deform_Y;
            function blink_FadeOut_v(target, minAlpha, maXalpha, time, delayed, func) {
                target.alpha = minAlpha;
                Laya.Tween.to(target, { alpha: maXalpha }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(target, { alpha: minAlpha }, time, null, Laya.Handler.create(this, function () {
                        if (func !== null) {
                            func();
                        }
                    }), 0);
                }), delayed);
            }
            Ani2DAdmin.blink_FadeOut_v = blink_FadeOut_v;
            function blink_FadeOut(target, minAlpha, maXalpha, time, delayed, func) {
                target.alpha = minAlpha;
                if (!delayed) {
                    delayed = 0;
                }
                Laya.Tween.to(target, { alpha: minAlpha }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(target, { alpha: maXalpha }, time, null, Laya.Handler.create(this, function () {
                        if (func) {
                            func();
                        }
                    }), 0);
                }), delayed);
            }
            Ani2DAdmin.blink_FadeOut = blink_FadeOut;
            function shookHead_Simple(target, rotate, time, delayed, func) {
                let firstR = target.rotation;
                Laya.Tween.to(target, { rotation: firstR + rotate }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(target, { rotation: firstR - rotate * 2 }, time, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(target, { rotation: firstR + rotate }, time, null, Laya.Handler.create(this, function () {
                            Laya.Tween.to(target, { rotation: firstR }, time, null, Laya.Handler.create(this, function () {
                                if (func) {
                                    func();
                                }
                            }), 0);
                        }), 0);
                    }), 0);
                }), delayed ? delayed : 0);
            }
            Ani2DAdmin.shookHead_Simple = shookHead_Simple;
            function HintAni_01(target, upNum, time1, stopTime, downNum, time2, func) {
                target.alpha = 0;
                Laya.Tween.to(target, { alpha: 1, y: target.y - upNum }, time1, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(target, { y: target.y - 15 }, stopTime, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(target, { alpha: 0, y: target.y + upNum + downNum }, time2, null, Laya.Handler.create(this, function () {
                            if (func !== null) {
                                func();
                            }
                        }), 0);
                    }), 0);
                }), 0);
            }
            Ani2DAdmin.HintAni_01 = HintAni_01;
            function scale_Alpha(target, fAlpha, fScaleX, fScaleY, eScaleX, eScaleY, eAlpha, time, delayed, func, ease) {
                if (!delayed) {
                    delayed = 0;
                }
                if (!ease) {
                    ease = null;
                }
                target.alpha = fAlpha;
                target.scaleX = fScaleX;
                target.scaleY = fScaleY;
                Laya.Tween.to(target, { scaleX: eScaleX, scaleY: eScaleY, alpha: eAlpha }, time, ease, Laya.Handler.create(this, function () {
                    if (func) {
                        func();
                    }
                }), delayed);
            }
            Ani2DAdmin.scale_Alpha = scale_Alpha;
            function scale(target, fScaleX, fScaleY, eScaleX, eScaleY, time, delayed, func, ease) {
                target.scaleX = fScaleX;
                target.scaleY = fScaleY;
                Laya.Tween.to(target, { scaleX: eScaleX, scaleY: eScaleY }, time, ease ? ease : null, Laya.Handler.create(this, function () {
                    if (func) {
                        func();
                    }
                }), delayed ? delayed : 0);
            }
            Ani2DAdmin.scale = scale;
            function rotate_Magnify_KickBack(node, eAngle, eScale, time1, time2, delayed1, delayed2, func) {
                node.alpha = 0;
                node.scaleX = 0;
                node.scaleY = 0;
                Laya.Tween.to(node, { alpha: 1, rotation: 360 + eAngle, scaleX: 1 + eScale, scaleY: 1 + eScale }, time1, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { rotation: 360 - eAngle / 2, scaleX: 1 + eScale / 2, scaleY: 1 + eScale / 2 }, time2, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { rotation: 360 + eAngle / 3, scaleX: 1 + eScale / 5, scaleY: 1 + eScale / 5 }, time2, null, Laya.Handler.create(this, function () {
                            Laya.Tween.to(node, { rotation: 360, scaleX: 1, scaleY: 1 }, time2, null, Laya.Handler.create(this, function () {
                                node.rotation = 0;
                                if (func !== null) {
                                    func();
                                }
                            }), 0);
                        }), delayed2);
                    }), 0);
                }), delayed1);
            }
            Ani2DAdmin.rotate_Magnify_KickBack = rotate_Magnify_KickBack;
        })(Ani2DAdmin = Lwg.Ani2DAdmin || (Lwg.Ani2DAdmin = {}));
        let SetAdmin;
        (function (SetAdmin) {
            SetAdmin._sound = {
                get switch() {
                    return Laya.LocalStorage.getItem('Setting/sound') == '0' ? false : true;
                },
                set switch(value) {
                    let val;
                    if (value) {
                        val = 1;
                    }
                    else {
                        val = 0;
                    }
                    Laya.LocalStorage.setItem('Setting/sound', val.toString());
                }
            };
            SetAdmin._bgMusic = {
                get switch() {
                    return Laya.LocalStorage.getItem('Setting/bgMusic') == '0' ? false : true;
                },
                set switch(value) {
                    let val;
                    if (value) {
                        val = 1;
                        Laya.LocalStorage.setItem('Setting/bgMusic', val.toString());
                        AudioAdmin._playMusic();
                    }
                    else {
                        val = 0;
                        Laya.LocalStorage.setItem('Setting/bgMusic', val.toString());
                        AudioAdmin._stopMusic();
                    }
                }
            };
            SetAdmin._shake = {
                get switch() {
                    return Laya.LocalStorage.getItem('Setting/shake') == '0' ? false : true;
                },
                set switch(value) {
                    let val;
                    if (value) {
                        val = 1;
                    }
                    else {
                        val = 0;
                    }
                    Laya.LocalStorage.setItem('Setting/shake', val.toString());
                }
            };
            function _createBtnSet(x, y, width, height, skin, parent, ZOder) {
                let btn = new Laya.Image;
                btn.width = width ? width : 100;
                btn.height = width ? width : 100;
                btn.skin = skin ? skin : 'Frame/UI/icon_set.png';
                if (parent) {
                    parent.addChild(btn);
                }
                else {
                    Laya.stage.addChild(btn);
                }
                btn.pivotX = btn.width / 2;
                btn.pivotY = btn.height / 2;
                btn.x = x;
                btn.y = y;
                btn.zOrder = ZOder ? ZOder : 100;
                var btnSetUp = function (e) {
                    e.stopPropagation();
                    LwgScene._openScene(LwgScene._BaseName.Set);
                };
                LwgClick._on(LwgClick._Type.largen, btn, null, null, btnSetUp, null);
                SetAdmin._BtnSet = btn;
                SetAdmin._BtnSet.name = 'BtnSetNode';
                return btn;
            }
            SetAdmin._createBtnSet = _createBtnSet;
            function btnSetAppear(delayed, x, y) {
                if (!SetAdmin._BtnSet) {
                    return;
                }
                if (delayed) {
                    Ani2DAdmin.scale_Alpha(SetAdmin._BtnSet, 0, 1, 1, 1, 1, 1, delayed, 0, f => {
                        SetAdmin._BtnSet.visible = true;
                    });
                }
                else {
                    SetAdmin._BtnSet.visible = true;
                }
                if (x) {
                    SetAdmin._BtnSet.x = x;
                }
                if (y) {
                    SetAdmin._BtnSet.y = y;
                }
            }
            SetAdmin.btnSetAppear = btnSetAppear;
            function btnSetVinish(delayed) {
                if (!SetAdmin._BtnSet) {
                    return;
                }
                if (delayed) {
                    Ani2DAdmin.scale_Alpha(SetAdmin._BtnSet, 1, 1, 1, 1, 1, 0, delayed, 0, f => {
                        SetAdmin._BtnSet.visible = false;
                    });
                }
                else {
                    SetAdmin._BtnSet.visible = false;
                }
            }
            SetAdmin.btnSetVinish = btnSetVinish;
        })(SetAdmin = Lwg.SetAdmin || (Lwg.SetAdmin = {}));
        let AudioAdmin;
        (function (AudioAdmin) {
            let _voiceUrl;
            (function (_voiceUrl) {
                _voiceUrl["bgm"] = "Lwg/Voice/bgm.mp3";
                _voiceUrl["btn"] = "https://h5.tomatojoy.cn/res/ark/3d04671eec61b1e12a6c02e54c1e7320/1.0.0/3DDressUp/Voice/btn.wav";
                _voiceUrl["victory"] = "https://h5.tomatojoy.cn/res/ark/3d04671eec61b1e12a6c02e54c1e7320/1.0.0/3DDressUp/Voice/guoguan.wav";
                _voiceUrl["defeated"] = "https://h5.tomatojoy.cn/res/ark/3d04671eec61b1e12a6c02e54c1e7320/1.0.0/3DDressUp/Voice/wancheng.wav";
                _voiceUrl["huodejinbi"] = "https://h5.tomatojoy.cn/res/ark/3d04671eec61b1e12a6c02e54c1e7320/1.0.0/3DDressUp/Voice/huodejinbi.wav";
            })(_voiceUrl = AudioAdmin._voiceUrl || (AudioAdmin._voiceUrl = {}));
            function _playSound(url, number, func) {
                if (!url) {
                    url = _voiceUrl.btn;
                }
                if (!number) {
                    number = 1;
                }
                if (SetAdmin._sound.switch) {
                    Laya.SoundManager.playSound(url, number, Laya.Handler.create(this, function () {
                        if (func) {
                            func();
                        }
                    }));
                }
            }
            AudioAdmin._playSound = _playSound;
            function _playDefeatedSound(url, number, func, soundVolume) {
                if (SetAdmin._sound.switch) {
                    Laya.SoundManager.soundVolume = soundVolume ? soundVolume : 1;
                    Laya.SoundManager.playSound(url ? url : _voiceUrl.defeated, number ? number : 1, Laya.Handler.create(this, function () {
                        if (func) {
                            func();
                        }
                        Laya.SoundManager.soundVolume = 1;
                    }));
                }
            }
            AudioAdmin._playDefeatedSound = _playDefeatedSound;
            function _playVictorySound(url, number, func, soundVolume) {
                if (SetAdmin._sound.switch) {
                    Laya.SoundManager.soundVolume = soundVolume ? soundVolume : 1;
                    Laya.SoundManager.playSound(url ? url : _voiceUrl.victory, number ? number : 1, Laya.Handler.create(this, function () {
                        if (func) {
                            func();
                        }
                        Laya.SoundManager.soundVolume = 1;
                    }));
                }
            }
            AudioAdmin._playVictorySound = _playVictorySound;
            function _playMusic(url, number, delayed) {
                if (SetAdmin._bgMusic.switch) {
                    Laya.SoundManager.playMusic(url ? url : _voiceUrl.bgm, number ? number : 0, Laya.Handler.create(this, function () { }), delayed ? delayed : 0);
                }
            }
            AudioAdmin._playMusic = _playMusic;
            function _stopMusic() {
                Laya.SoundManager.stopMusic();
            }
            AudioAdmin._stopMusic = _stopMusic;
        })(AudioAdmin = Lwg.AudioAdmin || (Lwg.AudioAdmin = {}));
        let ToolsAdmin;
        (function (ToolsAdmin) {
            function color_RGBtoHexString(r, g, b) {
                return '#' + ("00000" + (r << 16 | g << 8 | b).toString(16)).slice(-6);
            }
            ToolsAdmin.color_RGBtoHexString = color_RGBtoHexString;
            let _Format;
            (function (_Format) {
                function formatNumber(crc, fixNum = 0) {
                    let textTemp;
                    if (crc >= 1e27) {
                        textTemp = (crc / 1e27).toFixed(fixNum) + "ae";
                    }
                    else if (crc >= 1e24) {
                        textTemp = (crc / 1e24).toFixed(fixNum) + "ad";
                    }
                    else if (crc >= 1e21) {
                        textTemp = (crc / 1e21).toFixed(fixNum) + "ac";
                    }
                    else if (crc >= 1e18) {
                        textTemp = (crc / 1e18).toFixed(fixNum) + "ab";
                    }
                    else if (crc >= 1e15) {
                        textTemp = (crc / 1e15).toFixed(fixNum) + "aa";
                    }
                    else if (crc >= 1e12) {
                        textTemp = (crc / 1e12).toFixed(fixNum) + "t";
                    }
                    else if (crc >= 1e9) {
                        textTemp = (crc / 1e9).toFixed(fixNum) + "b";
                    }
                    else if (crc >= 1e6) {
                        textTemp = (crc / 1e6).toFixed(fixNum) + "m";
                    }
                    else if (crc >= 1e3) {
                        textTemp = (crc / 1e3).toFixed(fixNum) + "k";
                    }
                    else {
                        textTemp = Math.round(crc).toString();
                    }
                    return textTemp;
                }
                _Format.formatNumber = formatNumber;
                function strAddNum(str, num) {
                    return (Number(str) + num).toString();
                }
                _Format.strAddNum = strAddNum;
                function NumAddStr(num, str) {
                    return Number(str) + num;
                }
                _Format.NumAddStr = NumAddStr;
            })(_Format = ToolsAdmin._Format || (ToolsAdmin._Format = {}));
            let _Node;
            (function (_Node) {
                function tieByParent(Node) {
                    const Parent = Node.parent;
                    if (Node.x > Parent.width - Node.width / 2) {
                        Node.x = Parent.width - Node.width / 2;
                    }
                    if (Node.x < Node.width / 2) {
                        Node.x = Node.width / 2;
                    }
                    if (Node.y > Parent.height - Node.height / 2) {
                        Node.y = Parent.height - Node.height / 2;
                    }
                    if (Node.y < Node.height / 2) {
                        Node.y = Node.height / 2;
                    }
                }
                _Node.tieByParent = tieByParent;
                function tieByStage(Node, center) {
                    const Parent = Node.parent;
                    const gPoint = Parent.localToGlobal(new Laya.Point(Node.x, Node.y));
                    if (!center) {
                        if (gPoint.x > Laya.stage.width) {
                            gPoint.x = Laya.stage.width;
                        }
                    }
                    else {
                        if (gPoint.x > Laya.stage.width - Node.width / 2) {
                            gPoint.x = Laya.stage.width - Node.width / 2;
                        }
                    }
                    if (!center) {
                        if (gPoint.x < 0) {
                            gPoint.x = 0;
                        }
                    }
                    else {
                        if (gPoint.x < Node.width / 2) {
                            gPoint.x = Node.width / 2;
                        }
                    }
                    if (!center) {
                        if (gPoint.y > Laya.stage.height) {
                            gPoint.y = Laya.stage.height;
                        }
                    }
                    else {
                        if (gPoint.y > Laya.stage.height - Node.height / 2) {
                            gPoint.y = Laya.stage.height - Node.height / 2;
                        }
                    }
                    if (!center) {
                        if (gPoint.y < 0) {
                            gPoint.y = 0;
                        }
                    }
                    else {
                        if (gPoint.y < Node.height / 2) {
                            gPoint.y = Node.height / 2;
                        }
                    }
                    const lPoint = Parent.globalToLocal(gPoint);
                    Node.pos(lPoint.x, lPoint.y);
                }
                _Node.tieByStage = tieByStage;
                function simpleCopyImg(Target) {
                    let Img = new Laya.Image;
                    Img.skin = Target.skin;
                    Img.width = Target.width;
                    Img.height = Target.height;
                    Img.pivotX = Target.pivotX;
                    Img.pivotY = Target.pivotY;
                    Img.scaleX = Target.scaleX;
                    Img.scaleY = Target.scaleY;
                    Img.skewX = Target.skewX;
                    Img.skewY = Target.skewY;
                    Img.rotation = Target.rotation;
                    Img.x = Target.x;
                    Img.y = Target.y;
                    return Img;
                }
                _Node.simpleCopyImg = simpleCopyImg;
                function leaveStage(_Sprite, func) {
                    let Parent = _Sprite.parent;
                    if (!Parent) {
                        return false;
                    }
                    let gPoint = Parent.localToGlobal(new Laya.Point(_Sprite.x, _Sprite.y));
                    if (gPoint.x > Laya.stage.width + 10 || gPoint.x < -10) {
                        if (func) {
                            func();
                        }
                        return true;
                    }
                    if (gPoint.y > Laya.stage.height + 10 || gPoint.y < -10) {
                        if (func) {
                            func();
                        }
                        return true;
                    }
                }
                _Node.leaveStage = leaveStage;
                function getNodeGP(sp) {
                    if (!sp.parent) {
                        return;
                    }
                    return sp.parent.localToGlobal(new Laya.Point(sp.x, sp.y));
                }
                _Node.getNodeGP = getNodeGP;
                function checkTwoDistance(_Sprite1, _Sprite2, distance, func) {
                    if (!_Sprite1 || !_Sprite2) {
                        return;
                    }
                    let Parent1 = _Sprite1.parent;
                    let Parent2 = _Sprite2.parent;
                    if (!_Sprite1.parent || !_Sprite2.parent) {
                        return;
                    }
                    let gPoint1 = Parent1.localToGlobal(new Laya.Point(_Sprite1.x, _Sprite1.y));
                    let gPoint2 = Parent2.localToGlobal(new Laya.Point(_Sprite2.x, _Sprite2.y));
                    if (gPoint1.distance(gPoint2.x, gPoint2.y) <= distance) {
                        func && func();
                    }
                    return gPoint1.distance(gPoint2.x, gPoint2.y);
                }
                _Node.checkTwoDistance = checkTwoDistance;
                function childZOrderByY(sp, zOrder, along) {
                    let arr = [];
                    if (sp.numChildren == 0) {
                        return arr;
                    }
                    ;
                    for (let index = 0; index < sp.numChildren; index++) {
                        const element = sp.getChildAt(index);
                        arr.push(element);
                    }
                    _ObjArray.sortByProperty(arr, 'y');
                    if (zOrder) {
                        for (let index = 0; index < arr.length; index++) {
                            const element = arr[index];
                            element['zOrder'] = index;
                        }
                    }
                    if (along) {
                        let arr0 = [];
                        for (let index = arr.length - 1; index >= 0; index--) {
                            const element = arr[index];
                            console.log(element);
                            element['zOrder'] = arr.length - index;
                            arr0.push(element);
                        }
                        return arr0;
                    }
                    else {
                        return arr;
                    }
                }
                _Node.childZOrderByY = childZOrderByY;
                function changePivot(sp, _pivotX, _pivotY, int) {
                    let originalPovitX = sp.pivotX;
                    let originalPovitY = sp.pivotY;
                    if (int) {
                        _pivotX = Math.round(_pivotX);
                        _pivotY = Math.round(_pivotY);
                    }
                    if (sp.width) {
                        sp.pivot(_pivotX, _pivotY);
                        sp.x += (sp.pivotX - originalPovitX);
                        sp.y += (sp.pivotY - originalPovitY);
                    }
                }
                _Node.changePivot = changePivot;
                function changePivotCenter(sp, int) {
                    let originalPovitX = sp.pivotX;
                    let originalPovitY = sp.pivotY;
                    let _pivotX;
                    let _pivotY;
                    if (int) {
                        _pivotX = Math.round(sp.width / 2);
                        _pivotY = Math.round(sp.height / 2);
                    }
                    if (sp.width) {
                        sp.pivot(sp.width / 2, sp.height / 2);
                        sp.x += (sp.pivotX - originalPovitX);
                        sp.y += (sp.pivotY - originalPovitY);
                    }
                }
                _Node.changePivotCenter = changePivotCenter;
                function getChildArrByProperty(node, property, value) {
                    let childArr = [];
                    for (let index = 0; index < node.numChildren; index++) {
                        const element = node.getChildAt(index);
                        if (element[property] == value) {
                            childArr.push(element);
                        }
                    }
                    return childArr;
                }
                _Node.getChildArrByProperty = getChildArrByProperty;
                function randomChildren(node, num) {
                    let childArr = [];
                    let indexArr = [];
                    for (let i = 0; i < node.numChildren; i++) {
                        indexArr.push(i);
                    }
                    let randomIndex = ToolsAdmin._Array.randomGetOut(indexArr, num);
                    for (let j = 0; j < randomIndex.length; j++) {
                        childArr.push(node.getChildAt(randomIndex[j]));
                    }
                    return childArr;
                }
                _Node.randomChildren = randomChildren;
                function destroyAllChildren(node) {
                    for (let index = 0; index < node.numChildren; index++) {
                        const element = node.getChildAt(index);
                        element.destroy();
                        index--;
                    }
                }
                _Node.destroyAllChildren = destroyAllChildren;
                function destroyOneChildren(node, nodeName) {
                    for (let index = 0; index < node.numChildren; index++) {
                        const element = node.getChildAt(index);
                        if (element.name == nodeName) {
                            element.destroy();
                            index--;
                        }
                    }
                }
                _Node.destroyOneChildren = destroyOneChildren;
                function removeAllChildren(node) {
                    if (node.numChildren > 0) {
                        node.removeChildren(0, node.numChildren - 1);
                    }
                }
                _Node.removeAllChildren = removeAllChildren;
                function removeOneChildren(node, nodeName) {
                    for (let index = 0; index < node.numChildren; index++) {
                        const element = node.getChildAt(index);
                        if (element.name == nodeName) {
                            element.removeSelf();
                            index--;
                        }
                    }
                }
                _Node.removeOneChildren = removeOneChildren;
                function checkChildren(node, nodeName) {
                    for (let index = 0; index < node.numChildren; index++) {
                        const element = node.getChildAt(index);
                        if (element.name == nodeName) {
                            return element;
                        }
                    }
                }
                _Node.checkChildren = checkChildren;
                function showExcludedChild2D(node, childNameArr, bool) {
                    for (let i = 0; i < node.numChildren; i++) {
                        let Child = node.getChildAt(i);
                        for (let j = 0; j < childNameArr.length; j++) {
                            if (Child.name == childNameArr[j]) {
                                if (bool || bool == undefined) {
                                    Child.visible = true;
                                }
                                else {
                                    Child.visible = false;
                                }
                            }
                            else {
                                if (bool || bool == undefined) {
                                    Child.visible = false;
                                }
                                else {
                                    Child.visible = true;
                                }
                            }
                        }
                    }
                }
                _Node.showExcludedChild2D = showExcludedChild2D;
                function showExcludedChild3D(node, childNameArr, bool) {
                    for (let i = 0; i < node.numChildren; i++) {
                        let Child = node.getChildAt(i);
                        for (let j = 0; j < childNameArr.length; j++) {
                            if (Child.name == childNameArr[j]) {
                                if (bool || bool == undefined) {
                                    Child.active = true;
                                }
                                else {
                                    Child.active = false;
                                }
                            }
                            else {
                                if (bool || bool == undefined) {
                                    Child.active = false;
                                }
                                else {
                                    Child.active = true;
                                }
                            }
                        }
                    }
                }
                _Node.showExcludedChild3D = showExcludedChild3D;
                function createPrefab(prefab, Parent, point, script, zOrder, name) {
                    const Sp = Laya.Pool.getItemByCreateFun(name ? name : prefab.json['props']['name'], prefab.create, prefab);
                    Parent && Parent.addChild(Sp);
                    point && Sp.pos(point[0], point[1]);
                    script && Sp.addComponent(script);
                    NodeAdmin._addProperty(Sp);
                    if (zOrder)
                        Sp.zOrder = zOrder;
                    return Sp;
                }
                _Node.createPrefab = createPrefab;
                function childrenVisible2D(node, bool) {
                    for (let index = 0; index < node.numChildren; index++) {
                        const element = node.getChildAt(index);
                        if (bool) {
                            element.visible = true;
                        }
                        else {
                            element.visible = false;
                        }
                    }
                }
                _Node.childrenVisible2D = childrenVisible2D;
                function childrenVisible3D(node, bool) {
                    for (let index = 0; index < node.numChildren; index++) {
                        const element = node.getChildAt(index);
                        if (bool) {
                            element.active = true;
                        }
                        else {
                            element.active = false;
                        }
                    }
                }
                _Node.childrenVisible3D = childrenVisible3D;
                function findChild3D(parent, name) {
                    var item = null;
                    item = parent.getChildByName(name);
                    if (item != null)
                        return item;
                    var go = null;
                    for (var i = 0; i < parent.numChildren; i++) {
                        go = findChild3D(parent.getChildAt(i), name);
                        if (go != null)
                            return go;
                    }
                    return null;
                }
                _Node.findChild3D = findChild3D;
                function findChild2D(parent, name) {
                    var item = null;
                    item = parent.getChildByName(name);
                    if (item != null)
                        return item;
                    var go = null;
                    for (var i = 0; i < parent.numChildren; i++) {
                        go = findChild2D(parent.getChildAt(i), name);
                        if (go != null)
                            return go;
                    }
                    return null;
                }
                _Node.findChild2D = findChild2D;
                function findChildByName2D(parent, name) {
                    let arr = [];
                    return arr;
                }
                _Node.findChildByName2D = findChildByName2D;
            })(_Node = ToolsAdmin._Node || (ToolsAdmin._Node = {}));
            let _Number;
            (function (_Number) {
                function randomOneHalf() {
                    let number;
                    number = Math.floor(Math.random() * 2);
                    return number;
                }
                _Number.randomOneHalf = randomOneHalf;
                function randomNumerical(numSection, defaultNumSection, randomPlusOrMinus) {
                    let num = numSection ? ToolsAdmin._Number.randomOneBySection(numSection[0], numSection[1]) : ToolsAdmin._Number.randomOneBySection(defaultNumSection[0], defaultNumSection[1]);
                    if (randomPlusOrMinus) {
                        num = ToolsAdmin._Number.randomOneHalf() === 0 ? num : -num;
                    }
                    return num;
                }
                _Number.randomNumerical = randomNumerical;
                function randomOneInt(section1, section2) {
                    if (section2) {
                        return Math.round(Math.random() * (section2 - section1)) + section1;
                    }
                    else {
                        return Math.round(Math.random() * section1);
                    }
                }
                _Number.randomOneInt = randomOneInt;
                function randomCountBySection(section1, section2, count, intSet) {
                    let arr = [];
                    if (!count) {
                        count = 1;
                    }
                    if (section2) {
                        while (count > arr.length) {
                            let num;
                            if (intSet || intSet == undefined) {
                                num = Math.round(Math.random() * (section2 - section1)) + section1;
                            }
                            else {
                                num = Math.random() * (section2 - section1) + section1;
                            }
                            arr.push(num);
                            _Array.unique01(arr);
                        }
                        ;
                        return arr;
                    }
                    else {
                        while (count > arr.length) {
                            let num;
                            if (intSet || intSet == undefined) {
                                num = Math.round(Math.random() * section1);
                            }
                            else {
                                num = Math.random() * section1;
                            }
                            arr.push(num);
                            _Array.unique01(arr);
                        }
                        return arr;
                    }
                }
                _Number.randomCountBySection = randomCountBySection;
                function randomOneBySection(section1, section2, intSet) {
                    let chage;
                    if (section1 > section2) {
                        chage = section1;
                        section1 = section2;
                        section2 = chage;
                    }
                    if (section2) {
                        let num;
                        if (intSet) {
                            num = Math.round(Math.random() * (section2 - section1)) + section1;
                        }
                        else {
                            num = Math.random() * (section2 - section1) + section1;
                        }
                        return num;
                    }
                    else {
                        let num;
                        if (intSet) {
                            num = Math.round(Math.random() * section1);
                        }
                        else {
                            num = Math.random() * section1;
                        }
                        return num;
                    }
                }
                _Number.randomOneBySection = randomOneBySection;
            })(_Number = ToolsAdmin._Number || (ToolsAdmin._Number = {}));
            let _Point;
            (function (_Point) {
                function getOtherLocal(element, Other) {
                    let Parent = element.parent;
                    let gPoint = Parent.localToGlobal(new Laya.Point(element.x, element.y));
                    return Other.globalToLocal(gPoint);
                }
                _Point.getOtherLocal = getOtherLocal;
                function angleByRadian(angle) {
                    return Math.PI / 180 * angle;
                }
                _Point.angleByRadian = angleByRadian;
                function pointByAngleOld(x, y) {
                    const radian = Math.atan2(x, y);
                    let angle = 90 - radian * (180 / Math.PI);
                    if (angle <= 0) {
                        angle = 270 + (90 + angle);
                    }
                    return angle - 90;
                }
                _Point.pointByAngleOld = pointByAngleOld;
                ;
                function pointByAngleNew(x, y) {
                    const radian = Math.atan2(y, x);
                    let angle = radian * (180 / Math.PI);
                    if (angle <= 0) {
                        angle = 360 + angle;
                    }
                    return angle;
                }
                _Point.pointByAngleNew = pointByAngleNew;
                ;
                function angleByPoint(angle) {
                    const radian = (90 - angle) / (180 / Math.PI);
                    const p = new Laya.Point(Math.sin(radian), Math.cos(radian));
                    p.normalize();
                    return p;
                }
                _Point.angleByPoint = angleByPoint;
                ;
                function angleByPointNew(angle) {
                    const rad = angleByRadian(angle);
                    const p = new Laya.Point(Math.cos(rad), Math.sin(rad));
                    p.normalize();
                    return p;
                }
                _Point.angleByPointNew = angleByPointNew;
                ;
                function dotRotatePoint(x0, y0, x1, y1, angle) {
                    let x2 = x0 + (x1 - x0) * Math.cos(angle * Math.PI / 180) - (y1 - y0) * Math.sin(angle * Math.PI / 180);
                    let y2 = y0 + (x1 - x0) * Math.sin(angle * Math.PI / 180) + (y1 - y0) * Math.cos(angle * Math.PI / 180);
                    return new Laya.Point(x2, y2);
                }
                _Point.dotRotatePoint = dotRotatePoint;
                function angleAndLenByPoint(angle, len) {
                    const point = new Laya.Point();
                    point.x = len * Math.cos(angle * Math.PI / 180);
                    point.y = len * Math.sin(angle * Math.PI / 180);
                    return point;
                }
                _Point.angleAndLenByPoint = angleAndLenByPoint;
                function getRoundPosOld(angle, radius, centerPos) {
                    const radian = angleByRadian(angle);
                    const X = centerPos.x + Math.sin(radian) * radius;
                    const Y = centerPos.y - Math.cos(radian) * radius;
                    return new Laya.Point(X, Y);
                }
                _Point.getRoundPosOld = getRoundPosOld;
                function getRoundPosNew(angle, radius, centerPos) {
                    const radian = angleByRadian(angle);
                    if (centerPos) {
                        const x = centerPos.x + Math.cos(radian) * radius;
                        const y = centerPos.y + Math.sin(radian) * radius;
                        return new Laya.Point(x, y);
                    }
                    else {
                        return new Laya.Point(null, null);
                    }
                }
                _Point.getRoundPosNew = getRoundPosNew;
                function randomPointByCenter(centerPos, radiusX, radiusY, count) {
                    if (!count) {
                        count = 1;
                    }
                    let arr = [];
                    for (let index = 0; index < count; index++) {
                        let x0 = ToolsAdmin._Number.randomCountBySection(0, radiusX, 1, false);
                        let y0 = ToolsAdmin._Number.randomCountBySection(0, radiusY, 1, false);
                        let diffX = ToolsAdmin._Number.randomOneHalf() == 0 ? x0[0] : -x0[0];
                        let diffY = ToolsAdmin._Number.randomOneHalf() == 0 ? y0[0] : -y0[0];
                        let p = new Laya.Point(centerPos.x + diffX, centerPos.y + diffY);
                        arr.push(p);
                    }
                    return arr;
                }
                _Point.randomPointByCenter = randomPointByCenter;
                function getPArrBetweenTwoP(p1, p2, num) {
                    let arr = [];
                    let x0 = p2.x - p1.x;
                    let y0 = p2.y - p1.y;
                    for (let index = 0; index < num; index++) {
                        arr.push(new Laya.Point(p1.x + (x0 / num) * index, p1.y + (y0 / num) * index));
                    }
                    if (arr.length >= 1) {
                        arr.unshift();
                    }
                    if (arr.length >= 1) {
                        arr.pop();
                    }
                    return arr;
                }
                _Point.getPArrBetweenTwoP = getPArrBetweenTwoP;
                function reverseVector(Vecoter1, Vecoter2, normalizing) {
                    let p;
                    p = new Laya.Point(Vecoter1.x - Vecoter2.x, Vecoter1.y - Vecoter2.y);
                    if (normalizing) {
                        p.normalize();
                    }
                    return p;
                }
                _Point.reverseVector = reverseVector;
            })(_Point = ToolsAdmin._Point || (ToolsAdmin._Point = {}));
            let _3D;
            (function (_3D) {
                function randomScopeByPosition(sp3D, scopeSize) {
                    let _pX = ToolsAdmin._Number.randomOneBySection(scopeSize[0][0], scopeSize[1][0]);
                    let _pY = ToolsAdmin._Number.randomOneBySection(scopeSize[0][1], scopeSize[1][1]);
                    let _pZ = ToolsAdmin._Number.randomOneBySection(scopeSize[0][2], scopeSize[1][2]);
                    _pX = ToolsAdmin._Number.randomOneHalf() == 0 ? _pX : -_pX;
                    _pY = ToolsAdmin._Number.randomOneHalf() == 0 ? _pY : -_pY;
                    _pZ = ToolsAdmin._Number.randomOneHalf() == 0 ? _pZ : -_pZ;
                    sp3D.transform.position = new Laya.Vector3(sp3D.transform.position.x + _pX, sp3D.transform.position.y + _pY, sp3D.transform.position.z + _pZ);
                }
                _3D.randomScopeByPosition = randomScopeByPosition;
                function getMeshSize(MSp3D) {
                    if (MSp3D.meshRenderer) {
                        let v3;
                        let extent = MSp3D.meshRenderer.bounds.getExtent();
                        return v3 = new Laya.Vector3(extent.x * 2, extent.y * 2, extent.z * 2);
                    }
                }
                _3D.getMeshSize = getMeshSize;
                function getSkinMeshSize(MSp3D) {
                    if (MSp3D.skinnedMeshRenderer) {
                        let v3;
                        let extent = MSp3D.skinnedMeshRenderer.bounds.getExtent();
                        return v3 = new Laya.Vector3(extent.x * 2, extent.y * 2, extent.z * 2);
                    }
                }
                _3D.getSkinMeshSize = getSkinMeshSize;
                function twoNodeDistance(obj1, obj2) {
                    let obj1V3 = obj1.transform.position;
                    let obj2V3 = obj2.transform.position;
                    let p = new Laya.Vector3();
                    Laya.Vector3.subtract(obj1V3, obj2V3, p);
                    let lenp = Laya.Vector3.scalarLength(p);
                    return lenp;
                }
                _3D.twoNodeDistance = twoNodeDistance;
                function twoPositionDistance(v1, v2) {
                    let p = twoSubV3(v1, v2);
                    let lenp = Laya.Vector3.scalarLength(p);
                    return lenp;
                }
                _3D.twoPositionDistance = twoPositionDistance;
                function twoSubV3(V31, V32, normalizing) {
                    let p = new Laya.Vector3();
                    Laya.Vector3.subtract(V31, V32, p);
                    if (normalizing) {
                        let p1 = new Laya.Vector3();
                        Laya.Vector3.normalize(p, p1);
                        return p1;
                    }
                    else {
                        return p;
                    }
                }
                _3D.twoSubV3 = twoSubV3;
                function maximumDistanceLimi(originV3, obj, length) {
                    let subP = new Laya.Vector3();
                    let objP = obj.transform.position;
                    Laya.Vector3.subtract(objP, originV3, subP);
                    let lenP = Laya.Vector3.scalarLength(subP);
                    if (lenP >= length) {
                        let normalizP = new Laya.Vector3();
                        Laya.Vector3.normalize(subP, normalizP);
                        let x = originV3.x + normalizP.x * length;
                        let y = originV3.y + normalizP.y * length;
                        let z = originV3.z + normalizP.z * length;
                        let p = new Laya.Vector3(x, y, z);
                        obj.transform.position = p;
                        return p;
                    }
                }
                _3D.maximumDistanceLimi = maximumDistanceLimi;
                function posToScreen(v3, camera) {
                    let ScreenV4 = new Laya.Vector4();
                    camera.viewport.project(v3, camera.projectionViewMatrix, ScreenV4);
                    let point = new Laya.Vector2();
                    point.x = ScreenV4.x / Laya.stage.clientScaleX;
                    point.y = ScreenV4.y / Laya.stage.clientScaleY;
                    return point;
                }
                _3D.posToScreen = posToScreen;
                function reverseVector(Vecoter1, Vecoter2, normalizing) {
                    let p = new Laya.Vector3(Vecoter1.x - Vecoter2.x, Vecoter1.y - Vecoter2.y, Vecoter1.z - Vecoter2.z);
                    if (normalizing) {
                        let returnP = new Laya.Vector3();
                        Laya.Vector3.normalize(p, returnP);
                        return returnP;
                    }
                    else {
                        return p;
                    }
                }
                _3D.reverseVector = reverseVector;
                function rayScanning(camera, scene3D, vector2, filtrateName) {
                    let _ray = new Laya.Ray(new Laya.Vector3(0, 0, 0), new Laya.Vector3(0, 0, 0));
                    let outs = new Array();
                    const _v2 = new Laya.Vector2(Laya.stage.clientScaleX * vector2.x, Laya.stage.clientScaleY * vector2.y);
                    camera.viewportPointToRay(_v2, _ray);
                    scene3D.physicsSimulation.rayCastAll(_ray, outs);
                    if (filtrateName) {
                        let chek;
                        for (let i = 0; i < outs.length; i++) {
                            let Sp3d = outs[i].collider.owner;
                            if (Sp3d.name == filtrateName) {
                                chek = outs[i];
                            }
                        }
                        return chek;
                    }
                    else {
                        return outs;
                    }
                }
                _3D.rayScanning = rayScanning;
                function rayScanningFirst(camera, scene3D, vector2) {
                    let _ray = new Laya.Ray(new Laya.Vector3(0, 0, 0), new Laya.Vector3(0, 0, 0));
                    let out = new Laya.HitResult();
                    const _v2 = new Laya.Vector2(Laya.stage.clientScaleX * vector2.x, Laya.stage.clientScaleY * vector2.y);
                    camera.viewportPointToRay(_v2, _ray);
                    scene3D.physicsSimulation.rayCast(_ray, out);
                    return out;
                }
                _3D.rayScanningFirst = rayScanningFirst;
                function animatorPlay(Sp3D, aniName, normalizedTime, layerIndex) {
                    let sp3DAni = Sp3D.getComponent(Laya.Animator);
                    if (!sp3DAni) {
                        console.log(Sp3D.name, '没有动画组件');
                        return;
                    }
                    if (!layerIndex) {
                        layerIndex = 0;
                    }
                    sp3DAni.play(aniName, layerIndex, normalizedTime);
                    return sp3DAni;
                }
                _3D.animatorPlay = animatorPlay;
            })(_3D = ToolsAdmin._3D || (ToolsAdmin._3D = {}));
            let _Skeleton;
            (function (_Skeleton) {
                function sk_indexControl(sk, name) {
                    sk.play(name, true);
                    sk.player.currentTime = 15 * 1000 / sk.player.cacheFrameRate;
                }
                _Skeleton.sk_indexControl = sk_indexControl;
            })(_Skeleton = ToolsAdmin._Skeleton || (ToolsAdmin._Skeleton = {}));
            let _Draw;
            (function (_Draw) {
                function drawPieMask(parent, startAngle, endAngle) {
                    parent.cacheAs = "bitmap";
                    let drawPieSpt = new Laya.Sprite();
                    drawPieSpt.blendMode = "destination-out";
                    parent.addChild(drawPieSpt);
                    let drawPie = drawPieSpt.graphics.drawPie(parent.width / 2, parent.height / 2, parent.width / 2 + 10, startAngle, endAngle, "#000000");
                    return drawPie;
                }
                _Draw.drawPieMask = drawPieMask;
                function screenshot(Sp, quality) {
                    const htmlCanvas = Sp.drawToCanvas(Sp.width, Sp.height, Sp.x, Sp.y);
                    const base64 = htmlCanvas.toBase64("image/png", quality ? quality : 1);
                    return base64;
                }
                _Draw.screenshot = screenshot;
                _Draw._texArr = [];
                function cameraToSprite(camera, sprite) {
                    const _camera = camera.clone();
                    camera.scene.addChild(_camera);
                    _camera.transform.position = camera.transform.position;
                    _camera.transform.localRotationEuler = camera.transform.localRotationEuler;
                    _camera.renderTarget = new Laya.RenderTexture(sprite.width, sprite.height);
                    _camera.renderingOrder = -1;
                    _camera.clearFlag = Laya.CameraClearFlags.Sky;
                    const ptex = new Laya.Texture(_camera.renderTarget, Laya.Texture.DEF_UV);
                    sprite.graphics.drawTexture(ptex, sprite.x, sprite.y, sprite.width, sprite.height);
                    _Draw._texArr.push(ptex);
                    if (_Draw._texArr.length > 3) {
                        _Draw._texArr[0].destroy();
                        _Draw._texArr.shift();
                    }
                    TimerAdmin._frameOnce(5, this, () => {
                        _camera.destroy();
                    });
                }
                _Draw.cameraToSprite = cameraToSprite;
                function drawToTex(Sp, quality) {
                    let tex = Sp.drawToTexture(Sp.width, Sp.height, Sp.x, Sp.y);
                    return tex;
                }
                _Draw.drawToTex = drawToTex;
                function reverseCircleMask(sp, circleArr, eliminate) {
                    if (eliminate == undefined || eliminate == true) {
                        _Node.destroyAllChildren(sp);
                    }
                    let interactionArea = sp.getChildByName('reverseRoundMask');
                    if (!interactionArea) {
                        interactionArea = new Laya.Sprite();
                        interactionArea.name = 'reverseRoundMask';
                        interactionArea.blendMode = "destination-out";
                        sp.addChild(interactionArea);
                    }
                    sp.cacheAs = "bitmap";
                    for (let index = 0; index < circleArr.length; index++) {
                        interactionArea.graphics.drawCircle(circleArr[index][0], circleArr[index][1], circleArr[index][2], "#000000");
                    }
                    interactionArea.pos(0, 0);
                    return interactionArea;
                }
                _Draw.reverseCircleMask = reverseCircleMask;
                function reverseRoundrectMask(sp, roundrectArr, eliminate) {
                    if (eliminate == undefined || eliminate == true) {
                        _Node.removeAllChildren(sp);
                    }
                    let interactionArea = sp.getChildByName('reverseRoundrectMask');
                    if (!interactionArea) {
                        interactionArea = new Laya.Sprite();
                        interactionArea.name = 'reverseRoundrectMask';
                        interactionArea.blendMode = "destination-out";
                        sp.addChild(interactionArea);
                    }
                    if (sp.cacheAs !== "bitmap")
                        sp.cacheAs = "bitmap";
                    for (let index = 0; index < roundrectArr.length; index++) {
                        const element = roundrectArr[index];
                        element[0] = Math.round(element[0]);
                        element[1] = Math.round(element[1]);
                        element[2] = Math.round(element[2]);
                        element[3] = Math.round(element[3]);
                        element[4] = Math.round(element[4]);
                        interactionArea.graphics.drawPath(element[0], element[1], [["moveTo", element[4], 0], ["lineTo", element[2] - element[4], 0], ["arcTo", element[2], 0, element[2], element[4], element[4]], ["lineTo", element[2], element[3] - element[4]], ["arcTo", element[2], element[3], element[2] - element[4], element[3], element[4]], ["lineTo", element[3] - element[4], element[3]], ["arcTo", 0, element[3], 0, element[3] - element[4], element[4]], ["lineTo", 0, element[4]], ["arcTo", 0, 0, element[4], 0, element[4]], ["closePath"]], { fillStyle: "#000000" });
                        interactionArea.pivotX = element[2] / 2;
                        interactionArea.pivotY = element[3] / 2;
                        interactionArea.pos(0, 0);
                    }
                }
                _Draw.reverseRoundrectMask = reverseRoundrectMask;
            })(_Draw = ToolsAdmin._Draw || (ToolsAdmin._Draw = {}));
            let _ObjArray;
            (function (_ObjArray) {
                function sortByProperty(array, property) {
                    var compare = function (obj1, obj2) {
                        var val1 = obj1[property];
                        var val2 = obj2[property];
                        if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
                            val1 = Number(val1);
                            val2 = Number(val2);
                        }
                        if (val1 < val2) {
                            return -1;
                        }
                        else if (val1 > val2) {
                            return 1;
                        }
                        else {
                            return 0;
                        }
                    };
                    array.sort(compare);
                    return array;
                }
                _ObjArray.sortByProperty = sortByProperty;
                function diffProByTwo(objArr1, objArr2, property) {
                    var result = [];
                    for (var i = 0; i < objArr1.length; i++) {
                        var obj1 = objArr1[i];
                        var obj1Name = obj1[property];
                        var isExist = false;
                        for (var j = 0; j < objArr2.length; j++) {
                            var obj2 = objArr2[j];
                            var obj2Name = obj2[property];
                            if (obj2Name == obj1Name) {
                                isExist = true;
                                break;
                            }
                        }
                        if (!isExist) {
                            let _obj1 = _ObjArray.objCopy(obj1);
                            result.push(_obj1);
                        }
                    }
                    return result;
                }
                _ObjArray.diffProByTwo = diffProByTwo;
                function identicalPropertyObjArr(data1, data2, property) {
                    var result = [];
                    for (var i = 0; i < data1.length; i++) {
                        var obj1 = data1[i];
                        var obj1Name = obj1[property];
                        var isExist = false;
                        for (var j = 0; j < data2.length; j++) {
                            var obj2 = data2[j];
                            var obj2Name = obj2[property];
                            if (obj2Name == obj1Name) {
                                isExist = true;
                                break;
                            }
                        }
                        if (isExist) {
                            result.push(obj1);
                        }
                    }
                    return result;
                }
                _ObjArray.identicalPropertyObjArr = identicalPropertyObjArr;
                function objArrUnique(arr, property) {
                    for (var i = 0, len = arr.length; i < len; i++) {
                        for (var j = i + 1, len = arr.length; j < len; j++) {
                            if (arr[i][property] === arr[j][property]) {
                                arr.splice(j, 1);
                                j--;
                                len--;
                            }
                        }
                    }
                    return arr;
                }
                _ObjArray.objArrUnique = objArrUnique;
                function getArrByValue(objArr, property) {
                    let arr = [];
                    for (let i = 0; i < objArr.length; i++) {
                        if (objArr[i][property]) {
                            arr.push(objArr[i][property]);
                        }
                    }
                    return arr;
                }
                _ObjArray.getArrByValue = getArrByValue;
                function arrCopy(ObjArray) {
                    var sourceCopy = ObjArray instanceof Array ? [] : {};
                    for (var item in ObjArray) {
                        sourceCopy[item] = typeof ObjArray[item] === 'object' ? objCopy(ObjArray[item]) : ObjArray[item];
                    }
                    return sourceCopy;
                }
                _ObjArray.arrCopy = arrCopy;
                function modifyProValue(objArr, pro, value) {
                    for (const key in objArr) {
                        if (Object.prototype.hasOwnProperty.call(objArr, key)) {
                            const element = objArr[key];
                            if (element[pro]) {
                                element[pro] = value;
                            }
                        }
                    }
                    return objArr;
                }
                _ObjArray.modifyProValue = modifyProValue;
                function objCopy(obj) {
                    var _copyObj = {};
                    for (const item in obj) {
                        if (obj.hasOwnProperty(item)) {
                            const element = obj[item];
                            if (typeof element === 'object') {
                                if (Array.isArray(element)) {
                                    let arr1 = _Array.copy(element);
                                    _copyObj[item] = arr1;
                                }
                                else {
                                    objCopy(element);
                                }
                            }
                            else {
                                _copyObj[item] = element;
                            }
                        }
                    }
                    return _copyObj;
                }
                _ObjArray.objCopy = objCopy;
            })(_ObjArray = ToolsAdmin._ObjArray || (ToolsAdmin._ObjArray = {}));
            let _Array;
            (function (_Array) {
                function addToarray(array1, array2) {
                    for (let index = 0; index < array2.length; index++) {
                        const element = array2[index];
                        array1.push(element);
                    }
                    return array1;
                }
                _Array.addToarray = addToarray;
                function inverted(array) {
                    let arr = [];
                    for (let index = array.length - 1; index >= 0; index--) {
                        const element = array[index];
                        arr.push(element);
                    }
                    array = arr;
                    return array;
                }
                _Array.inverted = inverted;
                function randomGetOut(arr, num) {
                    if (!num) {
                        num = 1;
                    }
                    let arrCopy = _Array.copy(arr);
                    let arr0 = [];
                    if (num > arrCopy.length) {
                        return '数组长度小于取出的数！';
                    }
                    else {
                        for (let index = 0; index < num; index++) {
                            let ran = Math.round(Math.random() * (arrCopy.length - 1));
                            let a1 = arrCopy[ran];
                            arrCopy.splice(ran, 1);
                            arr0.push(a1);
                        }
                        return arr0;
                    }
                }
                _Array.randomGetOut = randomGetOut;
                function randomGetOne(arr) {
                    let arrCopy = copy(arr);
                    let ran = Math.round(Math.random() * (arrCopy.length - 1));
                    return arrCopy[ran];
                }
                _Array.randomGetOne = randomGetOne;
                function copy(arr1) {
                    var arr = [];
                    for (var i = 0; i < arr1.length; i++) {
                        arr.push(arr1[i]);
                    }
                    return arr;
                }
                _Array.copy = copy;
                function unique01(arr) {
                    for (var i = 0, len = arr.length; i < len; i++) {
                        for (var j = i + 1, len = arr.length; j < len; j++) {
                            if (arr[i] === arr[j]) {
                                arr.splice(j, 1);
                                j--;
                                len--;
                            }
                        }
                    }
                    return arr;
                }
                _Array.unique01 = unique01;
                function unique02(arr) {
                    arr = arr.sort();
                    var arr1 = [arr[0]];
                    for (var i = 1, len = arr.length; i < len; i++) {
                        if (arr[i] !== arr[i - 1]) {
                            arr1.push(arr[i]);
                        }
                    }
                    return arr1;
                }
                _Array.unique02 = unique02;
                function unique03(arr) {
                    return Array.from(new Set(arr));
                }
                _Array.unique03 = unique03;
                function oneExcludeOtherOne(arr1, arr2) {
                    let arr1Capy = _Array.copy(arr1);
                    let arr2Capy = _Array.copy(arr2);
                    for (let i = 0; i < arr1Capy.length; i++) {
                        for (let j = 0; j < arr2Capy.length; j++) {
                            if (arr1Capy[i] == arr2Capy[j]) {
                                arr1Capy.splice(i, 1);
                                i--;
                            }
                        }
                    }
                    return arr1Capy;
                }
                _Array.oneExcludeOtherOne = oneExcludeOtherOne;
                function moreExclude(arrays, exclude) {
                    let arr0 = [];
                    for (let i = 0; i < arrays.length; i++) {
                        for (let j = 0; j < arrays[i].length; j++) {
                            arr0.push(arrays[i][j]);
                        }
                    }
                    let arr1 = copy(arr0);
                    let arr2 = copy(arr1);
                    let arrNum = [];
                    for (let k = 0; k < arr2.length; k++) {
                        arrNum.push({
                            name: arr2[k],
                            num: 0,
                        });
                    }
                    for (let l = 0; l < arr0.length; l++) {
                        for (let m = 0; m < arrNum.length; m++) {
                            if (arr0[l] == arrNum[m]['name']) {
                                arrNum[m]['num']++;
                            }
                        }
                    }
                    let arrAllHave = [];
                    let arrDiffHave = [];
                    for (let n = 0; n < arrNum.length; n++) {
                        const element = arrNum[n];
                        if (arrNum[n]['num'] == arrays.length) {
                            arrAllHave.push(arrNum[n]['name']);
                        }
                        else {
                            arrDiffHave.push(arrNum[n]['name']);
                        }
                    }
                    if (!exclude) {
                        return arrAllHave;
                    }
                    else {
                        return arrDiffHave;
                    }
                }
                _Array.moreExclude = moreExclude;
            })(_Array = ToolsAdmin._Array || (ToolsAdmin._Array = {}));
        })(ToolsAdmin = Lwg.ToolsAdmin || (Lwg.ToolsAdmin = {}));
        let PreLoadAdmin;
        (function (PreLoadAdmin) {
            let _Event;
            (function (_Event) {
                _Event["importList"] = "_PreLoad_importList";
                _Event["complete"] = "_PreLoad_complete";
                _Event["stepLoding"] = "_PreLoad_startLoding";
                _Event["progress"] = "_PreLoad_progress";
            })(_Event = PreLoadAdmin._Event || (PreLoadAdmin._Event = {}));
            class _PreLoadScene extends SceneAdmin._SceneBase {
                constructor() {
                    super(...arguments);
                    this._listName = {
                        $scene3D: '$scene3D',
                        $prefab3D: '$prefab3D',
                        $mesh3D: '$mesh3D',
                        $material: '$material',
                        $texture: '$texture',
                        $texture2D: '$texture2D',
                        $pic2D: '$pic2D',
                        $scene2D: '$scene2D',
                        $prefab2D: '$prefab2D',
                        $json: '$json',
                        $skeleton: '$skeleton',
                        $effectTex2D: '$effectTex2D',
                    };
                    this._scene3D = [];
                    this._prefab3D = [];
                    this._mesh3D = [];
                    this._material = [];
                    this._texture = [];
                    this._texture2D = [];
                    this._pic2D = [];
                    this._scene2D = [];
                    this._prefab2D = [];
                    this._json = [];
                    this._skeleton = [];
                    this._effectsTex2D = [];
                    this._sumProgress = 0;
                    this._loadOrder = [];
                    this._loadOrderIndex = 0;
                }
                get _currentProgress() {
                    return this['currentProgress'] ? this['currentProgress'] : 0;
                }
                ;
                set _currentProgress(val) {
                    this['currentProgress'] = val;
                    if (this['currentProgress'] >= this._sumProgress) {
                        if (this._sumProgress == 0) {
                            return;
                        }
                        console.log('当前进度条进度为:', this['currentProgress'] / this._sumProgress);
                        console.log('所有资源加载完成！此时所有资源可通过例如 Laya.loader.getRes("url")获取');
                        EventAdmin._notify(PreLoadAdmin._Event.complete);
                    }
                    else {
                        let number = 0;
                        for (let index = 0; index <= this._loadOrderIndex; index++) {
                            number += this._loadOrder[index].length;
                        }
                        if (this['currentProgress'] == number) {
                            this._loadOrderIndex++;
                        }
                        EventAdmin._notify(PreLoadAdmin._Event.stepLoding);
                    }
                }
                ;
                moduleEvent() {
                    EventAdmin._registerOnce(_Event.importList, this, (listObj) => {
                        console.log(listObj);
                        listObj[this._listName.$effectTex2D] = Eff3DAdmin._tex2D;
                        for (const key in listObj) {
                            if (Object.prototype.hasOwnProperty.call(listObj, key)) {
                                for (const key1 in listObj[key]) {
                                    if (Object.prototype.hasOwnProperty.call(listObj[key], key1)) {
                                        const obj = listObj[key][key1];
                                        switch (key) {
                                            case this._listName.$json:
                                                this._json.push(obj);
                                                break;
                                            case this._listName.$material:
                                                this._material.push(obj);
                                                break;
                                            case this._listName.$mesh3D:
                                                this._mesh3D.push(obj);
                                                break;
                                            case this._listName.$pic2D:
                                                this._pic2D.push(obj);
                                                break;
                                            case this._listName.$prefab2D:
                                                this._prefab2D.push(obj);
                                                break;
                                            case this._listName.$prefab3D:
                                                this._prefab3D.push(obj);
                                                break;
                                            case this._listName.$scene2D:
                                                this._scene2D.push(obj);
                                                break;
                                            case this._listName.$scene3D:
                                                this._scene3D.push(obj);
                                                break;
                                            case this._listName.$texture2D:
                                                this._texture2D.push(obj);
                                                break;
                                            case this._listName.$skeleton:
                                                this._skeleton.push(obj);
                                                break;
                                            case this._listName.$texture:
                                                this._texture.push(obj);
                                                break;
                                            case this._listName.$effectTex2D:
                                                this._effectsTex2D.push(obj);
                                                break;
                                            default:
                                                break;
                                        }
                                    }
                                }
                            }
                        }
                        this._loadOrder = [this._pic2D, this._scene2D, this._prefab2D, this._prefab3D, this._json, this._texture, this._texture2D, this._mesh3D, this._material, this._skeleton, this._scene3D, this._effectsTex2D];
                        for (let index = 0; index < this._loadOrder.length; index++) {
                            this._sumProgress += this._loadOrder[index].length;
                            if (this._loadOrder[index].length <= 0) {
                                this._loadOrder.splice(index, 1);
                                index--;
                            }
                        }
                        let time = this.lwgOpenAni();
                        Laya.timer.once(time ? time : 0, this, () => {
                            EventAdmin._notify(PreLoadAdmin._Event.stepLoding);
                        });
                    });
                    EventAdmin._register(_Event.stepLoding, this, () => { this.start(); });
                    EventAdmin._registerOnce(_Event.complete, this, () => {
                        Laya.timer.once(this.lwgAllComplete(), this, () => {
                            if (this._Owner.name == LwgScene._BaseName.PreLoadCutIn) {
                                this._openScene(LwgScene._PreLoadCutIn.openName);
                            }
                            else {
                                AudioAdmin._playMusic();
                                this._openScene(LwgScene._BaseName.Start);
                            }
                        });
                    });
                    EventAdmin._register(_Event.progress, this, () => {
                        this._currentProgress++;
                        if (this._currentProgress < this._sumProgress) {
                            console.log('当前进度条进度为:', this._currentProgress / this._sumProgress);
                            this.lwgStepComplete();
                        }
                    });
                }
                moduleOnStart() {
                    if (this._Owner.name)
                        LwgScene._SceneControl[this._Owner.name] = this._Owner;
                }
                lwgStartLoding(any) {
                    EventAdmin._notify(PreLoadAdmin._Event.importList, (any));
                }
                start() {
                    if (this._loadOrder.length <= 0) {
                        console.log('没有加载项');
                        EventAdmin._notify(PreLoadAdmin._Event.complete);
                        return;
                    }
                    let alreadyPro = 0;
                    for (let i = 0; i < this._loadOrderIndex; i++) {
                        alreadyPro += this._loadOrder[i].length;
                    }
                    let index = this._currentProgress - alreadyPro;
                    switch (this._loadOrder[this._loadOrderIndex]) {
                        case this._pic2D:
                            Laya.loader.load(this._pic2D[index].url, Laya.Handler.create(this, (any) => {
                                if (typeof this._pic2D[index].url === 'object') {
                                    console.log(`${this._pic2D[index]} 数组加载完成，为数组对象，只能从getRes（url）中逐个获取`);
                                }
                                else {
                                    if (any == null) {
                                        console.log('XXXXXXXXXXX2D资源' + this._pic2D[index] + '加载失败！不会停止加载进程！', '数组下标为：', index, 'XXXXXXXXXXX');
                                    }
                                    else {
                                        console.log('2D图片' + this._pic2D[index] + '加载完成！', '数组下标为：', index);
                                    }
                                }
                                EventAdmin._notify(_Event.progress);
                            }));
                            break;
                        case this._scene2D:
                            Laya.loader.load(this._scene2D[index].url, Laya.Handler.create(this, (any) => {
                                if (typeof this._scene2D[index].url === 'object') {
                                    console.log(`${this._scene2D[index].url} 数组加载完成，为数组对象，只能从getRes（url）中逐个获取`);
                                }
                                else {
                                    if (any == null) {
                                        console.log('XXXXXXXXXXX2D场景' + this._scene2D[index].url + '加载失败！不会停止加载进程！', '数组下标为：', index, 'XXXXXXXXXXX');
                                    }
                                    else {
                                        console.log('2D场景' + this._scene2D[index].url + '加载完成！', '数组下标为：', index);
                                    }
                                }
                                EventAdmin._notify(_Event.progress);
                            }), null, Laya.Loader.JSON);
                            break;
                        case this._scene3D:
                            Laya.Scene3D.load(this._scene3D[index].url, Laya.Handler.create(this, (Scene3D) => {
                                if (Scene3D == null) {
                                    console.log('XXXXXXXXXXX3D场景' + this._scene3D[index].url + '加载失败！不会停止加载进程！', '数组下标为：', index, 'XXXXXXXXXXX');
                                }
                                else {
                                    this._scene3D[index].scene3D = Scene3D;
                                    console.log('3D场景' + this._scene3D[index].url + '加载完成！', '数组下标为：', index);
                                }
                                EventAdmin._notify(_Event.progress);
                            }));
                            break;
                        case this._prefab3D:
                            Laya.Sprite3D.load(this._prefab3D[index].url, Laya.Handler.create(this, (Sp3D) => {
                                if (Sp3D == null) {
                                    console.log('XXXXXXXXXXX3D预设体' + this._prefab3D[index].url + '加载失败！不会停止加载进程！', '数组下标为：', index, 'XXXXXXXXXXX');
                                }
                                else {
                                    this._prefab3D[index].prefab3D = Sp3D;
                                    console.log('3D预制体' + this._prefab3D[index].url + '加载完成！', '数组下标为：', index);
                                }
                                EventAdmin._notify(_Event.progress);
                            }));
                            break;
                        case this._mesh3D:
                            Laya.Mesh.load(this._mesh3D[index].url, Laya.Handler.create(this, (Mesh3D) => {
                                if (Mesh3D == null) {
                                    console.log('XXXXXXXXXXX3D网格' + this._mesh3D[index].url + '加载失败！不会停止加载进程！', '数组下标为：', index, 'XXXXXXXXXXX');
                                }
                                else {
                                    this._mesh3D[index].mesh3D = Mesh3D;
                                    console.log('3D网格' + this._mesh3D[index].url + '加载完成！', '数组下标为：', index);
                                }
                                EventAdmin._notify(_Event.progress);
                            }));
                            break;
                        case this._texture:
                            Laya.loader.load(this._texture[index].url, Laya.Handler.create(this, (tex) => {
                                if (typeof this._texture[index].url === 'object') {
                                    console.log(`${this._texture[index]} 数组加载完成，为数组对象，只能从getRes（url）中逐个获取`);
                                }
                                else {
                                    if (tex == null) {
                                        console.log('XXXXXXXXXXX2D纹理' + this._texture[index].url + '加载失败！不会停止加载进程！', '数组下标为：', index, 'XXXXXXXXXXX');
                                    }
                                    else {
                                        this._texture[index].texture = tex;
                                        console.log('纹理' + this._texture[index].url + '加载完成！', '数组下标为：', index);
                                    }
                                }
                                EventAdmin._notify(_Event.progress);
                            }));
                            break;
                        case this._texture2D:
                            Laya.Texture2D.load(this._texture2D[index].url, Laya.Handler.create(this, (tex2D) => {
                                if (tex2D == null) {
                                    console.log('XXXXXXXXXXX2D纹理' + this._texture2D[index].url + '加载失败！不会停止加载进程！', '数组下标为：', index, 'XXXXXXXXXXX');
                                }
                                else {
                                    this._texture2D[index].texture2D = tex2D;
                                    console.log('3D纹理' + this._texture2D[index].url + '加载完成！', '数组下标为：', index);
                                }
                                EventAdmin._notify(_Event.progress);
                            }));
                            break;
                        case this._effectsTex2D:
                            Laya.Texture2D.load(this._effectsTex2D[index].url, Laya.Handler.create(this, (tex2D) => {
                                if (tex2D == null) {
                                    console.log('XXXXXXXXXXX3D纹理' + this._effectsTex2D[index].url + '加载失败！不会停止加载进程！', '数组下标为：', index, 'XXXXXXXXXXX');
                                }
                                else {
                                    this._effectsTex2D[index].texture2D = tex2D;
                                    console.log('3D纹理' + this._effectsTex2D[index].url + '加载完成！', '数组下标为：', index);
                                }
                                EventAdmin._notify(_Event.progress);
                            }));
                            break;
                        case this._material:
                            Laya.Material.load(this._material[index].url, Laya.Handler.create(this, (Material) => {
                                if (Material == null) {
                                    console.log('XXXXXXXXXXX材质' + this._material[index].url + '加载失败！不会停止加载进程！', '数组下标为：', index, 'XXXXXXXXXXX');
                                }
                                else {
                                    this._material[index].material = Material;
                                    console.log('材质' + this._material[index].url + '加载完成！', '数组下标为：', index);
                                }
                                EventAdmin._notify(_Event.progress);
                            }));
                            break;
                        case this._json:
                            Laya.loader.load(this._json[index].url, Laya.Handler.create(this, (Json) => {
                                if (typeof this._json[index].url === 'object') {
                                    console.log(`${this._json[index]} 数组加载，完成，为数组对象，只能从getRes（url）中逐个获取`);
                                }
                                else {
                                    if (Json == null) {
                                        console.log('XXXXXXXXXXX数据表' + this._json[index].url + '加载失败！不会停止加载进程！', '数组下标为：', index, 'XXXXXXXXXXX');
                                    }
                                    else {
                                        this._json[index].dataArr = Json["RECORDS"];
                                        console.log('数据表' + this._json[index].url + '加载完成！', '数组下标为：', index);
                                    }
                                }
                                EventAdmin._notify(_Event.progress);
                            }), null, Laya.Loader.JSON);
                            break;
                        case this._skeleton:
                            this._skeleton[index].templet.on(Laya.Event.ERROR, this, () => {
                                console.log('XXXXXXXXXXX骨骼动画' + this._skeleton[index] + '加载失败！不会停止加载进程！', '数组下标为：', index, 'XXXXXXXXXXX');
                                EventAdmin._notify(_Event.progress);
                            });
                            this._skeleton[index].templet.on(Laya.Event.COMPLETE, this, () => {
                                console.log('骨骼动画', this._skeleton[index].templet.url, '加载完成！', '数组下标为：', index);
                                EventAdmin._notify(_Event.progress);
                            });
                            this._skeleton[index].templet.loadAni(this._skeleton[index].url);
                            break;
                        case this._prefab2D:
                            Laya.loader.load(this._prefab2D[index].url, Laya.Handler.create(this, (prefab2d) => {
                                if (typeof this._prefab2D[index].url === 'object') {
                                    console.log(`${this._prefab2D[index]} 加载，完成，为数组对象，只能从getRes（url）中逐个获取`);
                                }
                                else {
                                    if (prefab2d == null) {
                                        console.log('XXXXXXXXXXX2D预制体' + this._prefab2D[index].url + '加载失败！不会停止加载进程！', '数组下标为：', index, 'XXXXXXXXXXX');
                                    }
                                    else {
                                        let _prefab = new Laya.Prefab();
                                        _prefab.json = prefab2d;
                                        this._prefab2D[index].prefab2D = _prefab;
                                        console.log('2D预制体' + this._prefab2D[index].url + '加载完成！', '数组下标为：', index);
                                    }
                                }
                                EventAdmin._notify(_Event.progress);
                            }));
                            break;
                        default:
                            break;
                    }
                }
                lwgStepComplete() { }
                lwgAllComplete() { return 0; }
                ;
            }
            PreLoadAdmin._PreLoadScene = _PreLoadScene;
            class _PreLoadCutInScene extends _PreLoadScene {
                moduleOnAwake() {
                    this.$openName = SceneAdmin._PreLoadCutIn.openName;
                    this.$closeName = SceneAdmin._PreLoadCutIn.closeName;
                }
            }
            PreLoadAdmin._PreLoadCutInScene = _PreLoadCutInScene;
        })(PreLoadAdmin = Lwg.PreLoadAdmin || (Lwg.PreLoadAdmin = {}));
        let InitAdmin;
        (function (InitAdmin) {
            class _InitScene extends SceneAdmin._SceneBase {
                lwgOpenAni() {
                    return 100;
                }
                moduleOnStart() {
                    DateAdmin._init();
                }
                ;
            }
            InitAdmin._InitScene = _InitScene;
        })(InitAdmin = Lwg.InitAdmin || (Lwg.InitAdmin = {}));
        let ExecutionAdmin;
        (function (ExecutionAdmin) {
            let maxEx = 15;
            ExecutionAdmin._execution = {
                get value() {
                    if (!this['Execution/executionNum']) {
                        return Laya.LocalStorage.getItem('Execution/executionNum') ? Number(Laya.LocalStorage.getItem('Execution/executionNum')) : maxEx;
                    }
                    return this['Execution/executionNum'];
                },
                set value(val) {
                    console.log(val);
                    this['Execution/executionNum'] = val;
                    Laya.LocalStorage.setItem('Execution/executionNum', val.toString());
                }
            };
            ExecutionAdmin._addExDate = {
                get value() {
                    if (!this['Execution/addExDate']) {
                        return Laya.LocalStorage.getItem('Execution/addExDate') ? Number(Laya.LocalStorage.getItem('Execution/addExDate')) : (new Date()).getDay();
                    }
                    return this['Execution/addExDate'];
                },
                set value(val) {
                    this['Execution/addExDate'] = val;
                    Laya.LocalStorage.setItem('Execution/addExDate', val.toString());
                }
            };
            ExecutionAdmin._addExHours = {
                get value() {
                    if (!this['Execution/addExHours']) {
                        return Laya.LocalStorage.getItem('Execution/addExHours') ? Number(Laya.LocalStorage.getItem('Execution/addExHours')) : (new Date()).getHours();
                    }
                    return this['Execution/addExHours'];
                },
                set value(val) {
                    this['Execution/addExHours'] = val;
                    Laya.LocalStorage.setItem('Execution/addExHours', val.toString());
                }
            };
            ExecutionAdmin._addMinutes = {
                get value() {
                    if (!this['Execution/addMinutes']) {
                        return Laya.LocalStorage.getItem('Execution/addMinutes') ? Number(Laya.LocalStorage.getItem('Execution/addMinutes')) : (new Date()).getMinutes();
                    }
                    return this['Execution/addMinutes'];
                },
                set value(val) {
                    this['Execution/addMinutes'] = val;
                    Laya.LocalStorage.setItem('Execution/addMinutes', val.toString());
                }
            };
            function _createExecutionNode(parent) {
                let sp;
                Laya.loader.load('prefab/ExecutionNum.json', Laya.Handler.create(this, function (prefab) {
                    let _prefab = new Laya.Prefab();
                    _prefab.json = prefab;
                    sp = Laya.Pool.getItemByCreateFun('prefab', _prefab.create, _prefab);
                    parent.addChild(sp);
                    let num = sp.getChildByName('Num');
                    num.value = ExecutionAdmin._execution.value.toString();
                    sp.pos(297, 90);
                    sp.zOrder = 50;
                    ExecutionAdmin._ExecutionNode = sp;
                    ExecutionAdmin._ExecutionNode.name = '_ExecutionNode';
                }));
            }
            ExecutionAdmin._createExecutionNode = _createExecutionNode;
            function _addExecution(x, y, func) {
                let sp;
                Laya.loader.load('prefab/execution.json', Laya.Handler.create(this, function (prefab) {
                    let _prefab = new Laya.Prefab();
                    _prefab.json = prefab;
                    sp = Laya.Pool.getItemByCreateFun('prefab', _prefab.create, _prefab);
                    Laya.stage.addChild(sp);
                    sp.x = Laya.stage.width / 2;
                    sp.y = Laya.stage.height / 2;
                    sp.zOrder = 50;
                    if (ExecutionAdmin._ExecutionNode) {
                        Ani2DAdmin.move(sp, ExecutionAdmin._ExecutionNode.x, ExecutionAdmin._ExecutionNode.y, 800, () => {
                            Ani2DAdmin.fadeOut(sp, 1, 0, 200, 0, () => {
                                Ani2DAdmin.upDwon_Shake(ExecutionAdmin._ExecutionNode, 10, 80, 0, null);
                                if (func) {
                                    func();
                                }
                            });
                        }, 100);
                    }
                }));
            }
            ExecutionAdmin._addExecution = _addExecution;
            function createConsumeEx(subEx) {
                let label = Laya.Pool.getItemByClass('label', Laya.Label);
                label.name = 'label';
                Laya.stage.addChild(label);
                label.text = `${subEx}`;
                label.fontSize = 40;
                label.bold = true;
                label.color = '#59245c';
                label.x = ExecutionAdmin._ExecutionNode.x + 100;
                label.y = ExecutionAdmin._ExecutionNode.y - label.height / 2 + 4;
                label.zOrder = 100;
                Ani2DAdmin.fadeOut(label, 0, 1, 200, 150, () => {
                    Ani2DAdmin.leftRight_Shake(ExecutionAdmin._ExecutionNode, 15, 60, 0, null);
                    Ani2DAdmin.fadeOut(label, 1, 0, 600, 400, () => {
                    });
                });
            }
            ExecutionAdmin.createConsumeEx = createConsumeEx;
            class ExecutionNode extends SceneAdmin._ObjectBase {
                constructor() {
                    super(...arguments);
                    this.timeSwitch = true;
                    this.time = 0;
                    this.countNum = 59;
                }
                lwgOnAwake() {
                    this.Num = this._Owner.getChildByName('Num');
                    this.CountDown = this._Owner.getChildByName('CountDown');
                    this.CountDown_Board = this._Owner.getChildByName('CountDown_Board');
                    this.countNum = 59;
                    this.CountDown.text = '00:' + this.countNum;
                    this.CountDown_Board.text = this.CountDown.text;
                    let d = new Date;
                    if (d.getDate() !== ExecutionAdmin._addExDate.value) {
                        ExecutionAdmin._execution.value = maxEx;
                    }
                    else {
                        if (d.getHours() == ExecutionAdmin._addExHours.value) {
                            console.log(d.getMinutes(), ExecutionAdmin._addMinutes.value);
                            ExecutionAdmin._execution.value += (d.getMinutes() - ExecutionAdmin._addMinutes.value);
                            if (ExecutionAdmin._execution.value > maxEx) {
                                ExecutionAdmin._execution.value = maxEx;
                            }
                        }
                        else {
                            ExecutionAdmin._execution.value = maxEx;
                        }
                    }
                    this.Num.value = ExecutionAdmin._execution.value.toString();
                    ExecutionAdmin._addExDate.value = d.getDate();
                    ExecutionAdmin._addExHours.value = d.getHours();
                    ExecutionAdmin._addMinutes.value = d.getMinutes();
                }
                countDownAddEx() {
                    this.time++;
                    if (this.time % 60 == 0) {
                        this.countNum--;
                        if (this.countNum < 0) {
                            this.countNum = 59;
                            ExecutionAdmin._execution.value += 1;
                            this.Num.value = ExecutionAdmin._execution.value.toString();
                            let d = new Date;
                            ExecutionAdmin._addExHours.value = d.getHours();
                            ExecutionAdmin._addMinutes.value = d.getMinutes();
                        }
                        if (this.countNum >= 10 && this.countNum <= 59) {
                            this.CountDown.text = '00:' + this.countNum;
                            this.CountDown_Board.text = this.CountDown.text;
                        }
                        else if (this.countNum >= 0 && this.countNum < 10) {
                            this.CountDown.text = '00:0' + this.countNum;
                            this.CountDown_Board.text = this.CountDown.text;
                        }
                    }
                }
                lwgOnStart() {
                    TimerAdmin._frameLoop(1, this, () => {
                        if (Number(this.Num.value) >= maxEx) {
                            if (this.timeSwitch) {
                                ExecutionAdmin._execution.value = maxEx;
                                this.Num.value = ExecutionAdmin._execution.value.toString();
                                this.CountDown.text = '00:00';
                                this.CountDown_Board.text = this.CountDown.text;
                                this.countNum = 60;
                                this.timeSwitch = false;
                            }
                        }
                        else {
                            this.timeSwitch = true;
                            this.countDownAddEx();
                        }
                    });
                }
            }
            ExecutionAdmin.ExecutionNode = ExecutionNode;
        })(ExecutionAdmin = Lwg.ExecutionAdmin || (Lwg.ExecutionAdmin = {}));
    })(Lwg || (Lwg = {}));
    var Lwg$1 = Lwg;
    let LwgPlatform = Lwg.PlatformAdmin;
    let LwgGame = Lwg.GameAdmin;
    let LwgScene = Lwg.SceneAdmin;
    let LwgAdaptive = Lwg.AdaptiveAdmin;
    let LwgSceneAni = Lwg.SceneAniAdmin;
    let LwgNode = Lwg.NodeAdmin;
    let LwgDialogue = Lwg.Dialogue;
    let LwgEvent = Lwg.EventAdmin;
    let LwgTimer = Lwg.TimerAdmin;
    let LwgData = Lwg.DataAdmin;
    let LwgStorage = Lwg.StorageAdmin;
    let LwgDate = Lwg.DateAdmin;
    let LwgSet = Lwg.SetAdmin;
    let LwgAudio = Lwg.AudioAdmin;
    let LwgClick = Lwg.ClickAdmin;
    let LwgColor = Lwg.ColorAdmin;
    let LwgEff2D = Lwg.Eff2DAdmin;
    let LwgEff3D = Lwg.Eff3DAdmin;
    let LwgAni2D = Lwg.Ani2DAdmin;
    let LwgAni3D = Lwg.Ani3DAdmin;
    let LwgExecution = Lwg.ExecutionAdmin;
    let LwgGold = Lwg.GoldAdmin;
    let LwgTools = Lwg.ToolsAdmin;
    let LwgPreLoad = Lwg.PreLoadAdmin;
    let LwgAdmin = Lwg.InitAdmin;

    var _Res;
    (function (_Res) {
        class $scene3D {
        }
        _Res.$scene3D = $scene3D;
        ;
        class $scene2D {
        }
        _Res.$scene2D = $scene2D;
        ;
        class $prefab2D {
        }
        $prefab2D.LwgGold = {
            url: 'Prefab/LwgGold.json',
            prefab2D: null,
        };
        $prefab2D.Hero = {
            url: 'Prefab/Hero.json',
            prefab2D: null,
        };
        $prefab2D.Weapon = {
            url: 'Prefab/Weapon.json',
            prefab2D: null,
        };
        $prefab2D.Enemy = {
            url: 'Prefab/Enemy.json',
            prefab2D: null,
        };
        $prefab2D.EB_single = {
            url: 'Prefab/EB_single.json',
            prefab2D: null,
        };
        $prefab2D.EB_two = {
            url: 'Prefab/EB_two.json',
            prefab2D: null,
        };
        $prefab2D.EB_three_Triangle = {
            url: 'Prefab/EB_three_Triangle.json',
            prefab2D: null,
        };
        $prefab2D.EB_three_Across = {
            url: 'Prefab/EB_three_Across.json',
            prefab2D: null,
        };
        $prefab2D.EB_three_Vertical = {
            url: 'Prefab/EB_three_Vertical.json',
            prefab2D: null,
        };
        $prefab2D.EB_Four_Square = {
            url: 'Prefab/EB_Four_Square.json',
            prefab2D: null,
        };
        $prefab2D.Boss = {
            url: 'Prefab/Boss.json',
            prefab2D: null,
        };
        $prefab2D.Buff = {
            url: 'Prefab/Buff.json',
            prefab2D: null,
        };
        $prefab2D.Heroine = {
            url: 'Prefab/Heroine.json',
            prefab2D: null,
        };
        _Res.$prefab2D = $prefab2D;
        ;
        class $json {
        }
        $json.Boss = {
            url: "_LwgData" + "/_Game/Boss" + ".json",
            dataArr: null,
        };
        $json.Enemy = {
            url: "_LwgData" + "/_Game/Enemy" + ".json",
            dataArr: null,
        };
        $json.HeroLevel = {
            url: "_LwgData" + "/_Game/HeroLevel" + ".json",
            dataArr: null,
        };
        $json.HeroType = {
            url: "_LwgData" + "/_Game/HeroType" + ".json",
            dataArr: null,
        };
        _Res.$json = $json;
        ;
        class $prefab3D {
        }
        _Res.$prefab3D = $prefab3D;
        ;
        class $mesh3D {
        }
        _Res.$mesh3D = $mesh3D;
        ;
        class $material {
        }
        _Res.$material = $material;
        ;
        class $texture {
        }
        _Res.$texture = $texture;
        ;
        class $pic2D {
        }
        _Res.$pic2D = $pic2D;
        ;
        class $skeleton {
        }
        _Res.$skeleton = $skeleton;
        ;
        class $effectTex2D {
        }
        _Res.$effectTex2D = $effectTex2D;
        ;
    })(_Res || (_Res = {}));

    class PreLoad extends LwgPreLoad._PreLoadScene {
        lwgOnStart() {
            this.lwgStartLoding(_Res);
        }
        lwgOpenAni() { return 1; }
        lwgStepComplete() {
        }
        lwgAllComplete() {
            return 1000;
        }
    }

    var _Game;
    (function (_Game) {
        let _Event;
        (function (_Event) {
            _Event["checkEnemyBullet"] = "Game_bulletCheckHero";
            _Event["closeScene"] = "Game_closeScene";
            _Event["checkBuff"] = "GamecheckBuff";
            _Event["treeCheckWeapon"] = "GametreeCheckWeapon";
            _Event["enemyCheckWeapon"] = "GameenemyCheckWeapon";
            _Event["enemyLandCheckWeapon"] = "GameenemyLandCheckWeapon";
            _Event["enemyHouseCheckWeapon"] = "GameenemyHouseCheckWeapon";
            _Event["bossCheckWeapon"] = "GamebossCheckWeapon";
            _Event["heroineCheckWeapon"] = "GameheroineCheckWeapon";
            _Event["enemyStage"] = "GameenemyStage";
            _Event["enemyLandStage"] = "GamelandStage";
            _Event["enemyHouseStage"] = "GameenemyHouseStage";
            _Event["bossStage"] = "GamebossStage";
            _Event["heroineStage"] = "GameheroineStage";
            _Event["addEnemy"] = "GameaddEnemy";
        })(_Event = _Game._Event || (_Game._Event = {}));
        _Game._texArr = [];
        _Game._arrowParentArr = [];
    })(_Game || (_Game = {}));
    var _Role;
    (function (_Role) {
        class _Buff extends LwgData._Table {
            constructor() {
                super(...arguments);
                this.type = {
                    Num: 'Num',
                    S: 'S',
                };
            }
            static _ins() {
                if (!this.ins) {
                    this.ins = new _Buff();
                }
                return this.ins;
            }
            createBuff(type, Parent, x, y, script) {
                const Buff = LwgTools._Node.createPrefab(_Res.$prefab2D.Buff.prefab2D, Parent, [x, y], script);
                Buff['buffType'] = type;
                return Buff;
            }
        }
        _Role._Buff = _Buff;
        class _Enemy extends LwgData._Table {
            constructor(_Parent) {
                super();
                this._otherPro = {
                    quantity: "quantity",
                    shellNum: "shellNum",
                    blood: 'blood',
                    boss: 'boss',
                    speed: 'speed',
                };
                this._arr = _Res.$json.Enemy.dataArr;
                this.levelData = this._getObjByName(`level${LwgGame.level.value}`);
                this.quantity = this.levelData['quantity'];
                this.Parent = _Parent;
            }
            createEnmey(Script) {
                this.quantity--;
                const shellNum = this.levelData[this._otherPro.shellNum];
                let shellNumTime = 0;
                const element = LwgTools._Node.createPrefab(_Res.$prefab2D.Enemy.prefab2D, this.Parent);
                shellNumTime++;
                const color = LwgTools._Array.randomGetOne(['blue', 'yellow', 'red']);
                element.name = `${color}${color}`;
                let speed = LwgTools._Number.randomOneBySection(this.levelData[this._otherPro.speed][0], this.levelData[this._otherPro.speed][1]);
                speed = LwgTools._Number.randomOneHalf() == 0 ? -speed : speed;
                element['_EnemyData'] = {
                    shell: shellNumTime <= shellNum ? true : false,
                    blood: this.levelData['blood'],
                    angle: LwgTools._Number.randomOneBySection(0, 360),
                    speed: speed,
                    color: color,
                };
                element.addComponent(Script);
            }
        }
        _Role._Enemy = _Enemy;
        class _Boss extends LwgData._Table {
            constructor(Parent, BossScript) {
                super();
                this._otherPro = {
                    blood: 'blood',
                    specials: 'specials',
                    speed: 'speed',
                    skills: 'skills',
                    bulletPower: 'bulletPower',
                };
                this._arr = _Res.$json.Boss.dataArr;
                this.levelData = this._getObjByName(`Boss${LwgGame.level.value}`);
                this.skills = this.levelData['skills'];
                this.speed = this.levelData['speed'];
                this.blood = this.levelData['blood'];
                this.createLevelBoss(Parent, BossScript);
            }
            createLevelBoss(Parent, BossScript) {
                const element = LwgTools._Node.createPrefab(_Res.$prefab2D.Boss.prefab2D, Parent);
                element.name = `Boss`;
                let speed = LwgTools._Number.randomOneBySection(this.speed[0], this.speed[1]);
                speed = LwgTools._Number.randomOneHalf() == 0 ? -speed : speed;
                element['_EnemyData'] = {
                    blood: this.blood,
                    angle: LwgTools._Number.randomOneBySection(0, 360),
                    speed: speed,
                    sikllNameArr: this.skills,
                };
                element.addComponent(BossScript);
                return element;
            }
        }
        _Role._Boss = _Boss;
    })(_Role || (_Role = {}));

    class BloodBase extends LwgScene._ObjectBase {
        constructor() {
            super(...arguments);
            this.checkByWDis = 30;
            this.checkEvName = '';
        }
        bloodInit(bloodSum) {
            this.bloodPresnt = this.bloodSum = bloodSum;
            this.bloodPic = this._Owner.getChildByName('Blood').getChildByName('Pic');
            this.bloodWidth = this.bloodPic.width;
        }
        checkOtherRule(Weapon, dis, numBlood) {
            LwgTools._Node.checkTwoDistance(Weapon, this._Owner, dis ? dis : 30, () => {
                this.bloodRule(Weapon, numBlood);
            });
        }
        bloodRule(Other, numBlood) {
            if (!this.bloodPic)
                return console.log('血量没有初始化！');
            this.bloodPresnt -= numBlood;
            this.bloodPic.width = this.bloodWidth * this.bloodPresnt / this.bloodSum;
            if (this.bloodPresnt <= 0) {
                this.deathFunc();
                this.deathEffect();
                this._ownerDestroy();
            }
            else {
                this.subOnceFunc();
            }
            Other.destroy();
        }
        subOnceFunc() {
        }
        deathFunc() {
        }
        deathEffect() {
            for (let index = 0; index < 20; index++) {
                LwgEff2D._Particle._spray(Laya.stage, this._Owner._lwg.gPoint, [10, 30]);
            }
        }
    }

    class HeroWeapon extends LwgScene._ObjectBase {
        constructor() {
            super(...arguments);
            this.launchAcc = 0;
            this.dropAcc = 0;
            this.stateType = {
                launch: 'launch',
                free: 'free',
            };
        }
        get state() {
            return this['Statevalue'] ? this['Statevalue'] : 'launch';
        }
        ;
        set state(_state) {
            this['Statevalue'] = _state;
        }
        ;
        getSpeed() {
            return 15 + 0.1;
        }
        getDropSpeed() {
            return this.dropAcc += 0.5;
        }
        lwgOnAwake() {
            LwgTimer._frameLoop(1, this, () => {
                this.move();
            });
        }
        move() {
            if (this.getSpeed() > 0) {
                let p = LwgTools._Point.angleAndLenByPoint(this._Owner.rotation - 90, this.getSpeed());
                this._Owner.x += p.x;
                this._Owner.y += p.y;
            }
            else {
                this._Owner.y += this.getDropSpeed();
            }
            const leave = LwgTools._Node.leaveStage(this._Owner, () => {
                this._Owner.destroy();
            });
            if (!leave) {
                this._evNotify(_Game._Event.treeCheckWeapon, [this._Owner, 1]);
                this._evNotify(_Game._Event.enemyCheckWeapon, [this._Owner, 1]);
                this._evNotify(_Game._Event.enemyLandCheckWeapon, [this._Owner, 1]);
                this._evNotify(_Game._Event.enemyHouseCheckWeapon, [this._Owner, 1]);
                this._evNotify(_Game._Event.heroineCheckWeapon, [this._Owner, 1]);
                this._evNotify(_Game._Event.bossCheckWeapon, [this._Owner, 1]);
            }
        }
        drop() {
            this.state = this.stateType.free;
            Laya.timer.clearAll(this);
            LwgTimer._frameLoop(1, this, () => {
                this._Owner.y += 40;
                this._Owner.rotation += 10;
                LwgTools._Node.leaveStage(this._Owner, () => {
                    this._Owner.destroy();
                });
            });
        }
    }

    class HeroAttack {
        constructor(_WeaponParent, _Hero) {
            this.ballisticNum = 1;
            this.ballisticPos = [
                [[0, 0]],
                [[-20, 0], [20, 0]],
                [[-20, 0], [0, 0], [20, 0]],
                [[-30, 0], [-10, 0], [10, 0], [30, 0]],
                [[-40, 0], [-20, 0], [0, 0], [20, 0], [40, 0]],
                [[-50, 0], [-30, 0], [-10, 0], [10, 0], [30, 0], [50, 0]],
                [[-60, 0], [-40, 0], [-20, 0], [0, 0], [20, 0], [40, 0], [60, 0]],
            ];
            this.attack_S_Angle = [
                [0],
                [-5, 5],
                [-10, 0, 10],
                [-15, -5, 5, 15],
                [-20, -10, 0, 10, 20],
                [-25, -15, -5, 5, 15, 25],
                [-30, -20, -10, 0, 10, 20, 30],
                [-35, -25, -15, 5, 5, 15, 25, 35],
            ];
            this.WeaponParent = _WeaponParent;
            this.Hero = _Hero;
        }
        createWeapon(style, x, y) {
            const Weapon = LwgTools._Node.createPrefab(_Res.$prefab2D.Weapon.prefab2D);
            this.WeaponParent.addChild(Weapon);
            Weapon.addComponent(HeroWeapon);
            Weapon.pos(x, y);
            const Pic = Weapon.getChildByName('Pic');
            Pic.skin = style ? `Game/UI/Game/Hero/Hero_01_weapon_${style}.png` : `Lwg/UI/ui_circle_c_007.png`;
            Weapon.name = style;
            return Weapon;
        }
        ;
        attack_General() {
            const posArr = this.ballisticPos[this.ballisticNum - 1];
            for (let index = 1; index < posArr.length; index++) {
                const pos = posArr[index];
                if (pos) {
                    this.createWeapon(null, this.Hero.x + pos[0], this.Hero.y + pos[1]);
                }
            }
        }
        attack_S() {
            const angleArr = this.attack_S_Angle[this.ballisticNum - 1];
            for (let index = 0; index < angleArr.length; index++) {
                const weapon = this.createWeapon(null, this.Hero.x, this.Hero.y);
                weapon.rotation = angleArr[index];
            }
        }
    }

    class Hero extends BloodBase {
        lwgOnAwake() {
            this.bloodInit(5000);
            this.attackInterval = 10;
            this._HeroAttack = new HeroAttack(this._SceneImg('WeaponParent'), this._Owner);
            this._HeroAttack.ballisticNum = 1;
        }
        lwgOnStart() {
            LwgTimer._frameLoop(this.attackInterval, this, () => {
                if (this.mouseP) {
                    this._HeroAttack.attack_S();
                }
            });
        }
        deathFunc() {
            this._openScene('Defeated', false);
        }
        lwgEvent() {
            this._evReg(_Game._Event.checkEnemyBullet, (Bullet, numBlood) => {
                this.checkOtherRule(Bullet, 40, numBlood);
            });
            this._evReg(_Game._Event.checkBuff, (type) => {
                switch (type) {
                    case 0:
                        this._HeroAttack.ballisticNum++;
                        break;
                    case 1:
                        break;
                    case 2:
                        break;
                    case 3:
                        break;
                    default:
                        break;
                }
            });
        }
        move(e) {
            if (this.mouseP) {
                let diffX = e.stageX - this.mouseP.x;
                let diffY = e.stageY - this.mouseP.y;
                this._Owner.x += diffX;
                this._Owner.y += diffY;
                this.mouseP = new Laya.Point(e.stageX, e.stageY);
                if (this._Owner.x > Laya.stage.width) {
                    this._Owner.x = Laya.stage.width;
                }
                if (this._Owner.x < 0) {
                    this._Owner.x = 0;
                }
                if (this._Owner.y <= 0) {
                    this._Owner.y = 0;
                }
                if (this._Owner.y > Laya.stage.height) {
                    this._Owner.y = Laya.stage.height;
                }
            }
        }
        ;
        lwgOnStageDown(e) {
            this.mouseP = new Laya.Point(e.stageX, e.stageY);
        }
        lwgOnStageMove(e) {
            this.move(e);
        }
        lwgOnStageUp() {
            this.mouseP = null;
        }
    }

    class _EnemyBullet {
        static checkHero(bullet, hero = true) {
            LwgTimer._frameLoop(1, bullet, () => {
                const bool = LwgTools._Node.leaveStage(bullet, () => {
                    Laya.timer.clearAll(bullet);
                    Laya.Tween.clearAll(bullet);
                    bullet.destroy(true);
                });
                if (!bool && hero) {
                    LwgEvent._notify(_Game._Event.checkEnemyBullet, [bullet, 1]);
                }
            });
        }
        static checkHeroByChild(bullet) {
            this.checkHero(bullet, false);
            for (let index = 0; index < bullet.numChildren; index++) {
                const element = bullet.getChildAt(index);
                this.checkHero(element);
                element.name = this.Type.single;
            }
        }
        static createBase(enemy, type, checkType) {
            let prefab = _Res.$prefab2D[type]['prefab2D'];
            const bullet = LwgTools._Node.createPrefab(prefab, this.Parent, [enemy._lwg.gPoint.x, enemy._lwg.gPoint.y]);
            bullet.name = type;
            switch (checkType) {
                case this.ChekType.bullet:
                    this.checkHero(bullet);
                    break;
                case this.ChekType.child:
                    this.checkHeroByChild(bullet);
                    break;
                case this.ChekType.bulletAndchild:
                    this.checkHero(bullet);
                    this.checkHeroByChild(bullet);
                    break;
                default:
                    break;
            }
            return bullet;
        }
        static EB_single(enemy) {
            const bullet = this.createBase(enemy, this.Type.single, this.ChekType.bullet);
            return bullet;
        }
        static EB_two(enemy) {
            const bullet = this.createBase(enemy, this.Type.two, this.ChekType.child);
            return bullet;
        }
        static EB_three_Triangle(enemy) {
            const bullet = this.createBase(enemy, this.Type.three_Triangle, this.ChekType.child);
            return bullet;
        }
        static EB_three_Across(enemy) {
            const bullet = this.createBase(enemy, this.Type.three_Across, this.ChekType.child);
            return bullet;
        }
        static EB_three_Vertical(enemy) {
            const bullet = this.createBase(enemy, this.Type.three_Vertical, this.ChekType.child);
            return bullet;
        }
        static EB_Four_Square(enemy) {
            const bullet = this.createBase(enemy, this.Type.four_Square, this.ChekType.child);
            return bullet;
        }
    }
    _EnemyBullet.Type = {
        single: 'EB_single',
        two: 'EB_two',
        three_Triangle: 'EB_three_Triangle',
        three_Across: 'EB_three_Across',
        three_Vertical: 'EB_three_Vertical',
        four_Square: 'EB_Four_Square',
    };
    _EnemyBullet.ChekType = {
        bullet: 'bullet',
        child: 'child',
        bulletAndchild: 'bulletAndchild',
    };

    class Level1 {
        enemy(enemy) {
            const angleSpacing = 15;
            const speed = 5;
            LwgTimer._frameRandomLoop(120, 300, enemy, () => {
                const ep = new Laya.Point(enemy._lwg.gPoint.x, enemy._lwg.gPoint.y);
                for (let index = 0; index < 3; index++) {
                    const bullet = _EnemyBullet.EB_single(enemy);
                    let _speedAdd = 0;
                    LwgTimer._frameLoop(1, bullet, () => {
                        const point = LwgTools._Point.getRoundPosNew(index * angleSpacing + 90 - angleSpacing, _speedAdd += speed, ep);
                        bullet.pos(point.x, point.y);
                    });
                }
            });
        }
        land(enemy) {
            let time = 0;
            const speed = 5;
            LwgTimer._frameLoop(30, enemy, () => {
                time++;
                let num = 5;
                if (time % 3 == 0) {
                    num = 18;
                }
                else if (time % 2 == 0) {
                    num = 10;
                }
                for (let index = 0; index < num; index++) {
                    const bullet = _EnemyBullet.EB_single(enemy);
                    let _speedAdd = 0;
                    LwgTimer._frameLoop(1, bullet, () => {
                        const unit = 180 / num;
                        const point = LwgTools._Point.getRoundPosNew(unit * index + unit / 2, _speedAdd += speed, enemy._lwg.gPoint);
                        bullet.pos(point.x, point.y);
                    });
                }
            });
        }
        house(enemy) {
            const speed = 5;
            const num = 8;
            const spacing = 20;
            let angle = 0;
            let dir = 'add';
            LwgTimer._frameLoop(20, enemy, () => {
                if (angle > 180 - (num - 1) * spacing) {
                    dir = 'sub';
                }
                else if (angle <= 0) {
                    dir = 'add';
                }
                if (dir === 'add') {
                    angle += 10;
                }
                else {
                    angle -= 10;
                }
                let timeAngle = angle;
                const ep = new Laya.Point(enemy._lwg.gPoint.x, enemy._lwg.gPoint.y);
                for (let index = 0; index < num; index++) {
                    const bullet = _EnemyBullet.EB_single(enemy);
                    let _speedAdd = 0;
                    LwgTimer._frameLoop(1, bullet, () => {
                        const point = LwgTools._Point.getRoundPosNew(spacing * index + timeAngle, _speedAdd += speed, ep);
                        bullet.pos(point.x, point.y);
                    });
                }
            });
        }
        boss(enemy) {
            const speed = 6;
            const num = 8;
            LwgTimer._frameLoop(30, enemy, () => {
                const unit = 180 / num;
                const ep1 = new Laya.Point(enemy._lwg.gPoint.x + 100, enemy._lwg.gPoint.y);
                const ep2 = new Laya.Point(enemy._lwg.gPoint.x - 100, enemy._lwg.gPoint.y);
                for (let index = 0; index < num; index++) {
                    const bullet = _EnemyBullet.EB_single(enemy);
                    let _speedAdd = 0;
                    LwgTimer._frameLoop(1, bullet, () => {
                        const point = LwgTools._Point.getRoundPosNew(unit * index + unit / 2, _speedAdd += speed, ep1);
                        bullet.pos(point.x, point.y);
                    });
                }
                for (let index = 0; index < num; index++) {
                    const bullet = _EnemyBullet.EB_single(enemy);
                    let _speedAdd = 0;
                    LwgTimer._frameLoop(1, bullet, () => {
                        const point = LwgTools._Point.getRoundPosNew(unit * index + unit / 2, _speedAdd += speed, ep2);
                        bullet.pos(point.x, point.y);
                    });
                }
            });
        }
        heroine(enemy) {
            const speed = 10;
            const num = 6;
            const spacing = 8;
            LwgTimer._frameLoop(15, enemy, () => {
                const fA = LwgTools._Number.randomOneInt(360);
                const ep = new Laya.Point(enemy._lwg.gPoint.x, enemy._lwg.gPoint.y);
                for (let index = 0; index < num; index++) {
                    const bullet = _EnemyBullet.EB_single(enemy);
                    let _speedAdd = 0;
                    LwgTimer._frameLoop(1, bullet, () => {
                        const point = LwgTools._Point.getRoundPosNew(fA + spacing * index, _speedAdd += speed, ep);
                        bullet.pos(point.x, point.y);
                    });
                }
                for (let index = 0; index < num; index++) {
                    const bullet = _EnemyBullet.EB_single(enemy);
                    let _speedAdd = 0;
                    LwgTimer._frameLoop(1, bullet, () => {
                        const point = LwgTools._Point.getRoundPosNew(fA + spacing * index + 120, _speedAdd += speed, ep);
                        bullet.pos(point.x, point.y);
                    });
                }
                for (let index = 0; index < num; index++) {
                    const bullet = _EnemyBullet.EB_single(enemy);
                    let _speedAdd = 0;
                    LwgTimer._frameLoop(1, bullet, () => {
                        const point = LwgTools._Point.getRoundPosNew(fA + spacing * index + 240, _speedAdd += speed, ep);
                        bullet.pos(point.x, point.y);
                    });
                }
            });
        }
    }

    class Level2 {
        enemy(enemy) {
            const speed = 8;
            LwgTimer._frameRandomLoop(120, 300, enemy, () => {
                const bullet = _EnemyBullet.EB_two(enemy);
                LwgTimer._frameLoop(1, bullet, () => {
                    bullet.y += speed;
                });
            });
        }
        land(enemy) {
            const speed = 12;
            const num = 2;
            LwgTimer._frameLoop(5, enemy, () => {
                let fA = LwgTools._Number.randomOneInt(0, 180);
                for (let index = 0; index < num; index++) {
                    const ep = new Laya.Point(enemy._lwg.gPoint.x, enemy._lwg.gPoint.y);
                    const bullet = _EnemyBullet.EB_two(enemy);
                    let _speedAdd = 0;
                    bullet.rotation = fA + 90;
                    LwgTimer._frameLoop(1, bullet, () => {
                        const point = LwgTools._Point.getRoundPosNew(fA, _speedAdd += speed, ep);
                        bullet.pos(point.x, point.y);
                    });
                }
            });
        }
        house(enemy) {
            const speed = 15;
            const num = 1;
            const spacing = 12;
            let angle = 0;
            let dir = 'add';
            LwgTimer._frameLoop(3, enemy, () => {
                if (angle > 180 - (num - 1) * spacing) {
                    dir = 'sub';
                }
                else if (angle <= 0) {
                    dir = 'add';
                }
                if (dir === 'add') {
                    angle += 10;
                }
                else {
                    angle -= 10;
                }
                let timeAngle = angle;
                const ep = new Laya.Point(enemy._lwg.gPoint.x, enemy._lwg.gPoint.y);
                for (let index = 0; index < num; index++) {
                    const bullet = _EnemyBullet.EB_two(enemy);
                    bullet.rotation = spacing * index + timeAngle - 90;
                    let _speedAdd = 0;
                    LwgTimer._frameLoop(1, bullet, () => {
                        const point = LwgTools._Point.getRoundPosNew(spacing * index + timeAngle, _speedAdd += speed, ep);
                        bullet.pos(point.x, point.y);
                    });
                }
            });
        }
        boss(enemy) {
            const num = 3;
            let time = 0;
            const spacing1 = 16;
            const spacing2 = 10;
            LwgTimer._frameLoop(3, enemy, () => {
                time++;
                let fA = 0;
                for (let index = 0; index < num; index++) {
                    const ep = new Laya.Point(enemy._lwg.gPoint.x, enemy._lwg.gPoint.y);
                    const bullet = _EnemyBullet.EB_two(enemy);
                    let _speedAdd = 0;
                    let angle = fA + time * spacing1;
                    let speed = 6;
                    if (index === 0) {
                        angle = fA + time * spacing2;
                        speed = 12;
                    }
                    angle += index * 180;
                    bullet.rotation = angle + 90;
                    LwgTimer._frameLoop(1, bullet, () => {
                        const point = LwgTools._Point.getRoundPosNew(angle, _speedAdd += speed, ep);
                        bullet.pos(point.x, point.y);
                    });
                }
            });
        }
        heroine(enemy) {
            const num = 4;
            let time = 0;
            const spacing2 = 10;
            LwgTimer._frameLoop(5, enemy, () => {
                time++;
                let fA = 0;
                for (let index = 0; index < num; index++) {
                    const ep = new Laya.Point(enemy._lwg.gPoint.x, enemy._lwg.gPoint.y);
                    const bullet = _EnemyBullet.EB_two(enemy);
                    let _speedAdd = 0;
                    let angle = 30;
                    let speed = 12;
                    if (index === 0) {
                        angle = fA + time * spacing2;
                    }
                    angle += index * 30;
                    bullet.rotation = angle + 90;
                    LwgTimer._frameLoop(1, bullet, () => {
                        const point = LwgTools._Point.getRoundPosNew(angle, _speedAdd += speed, ep);
                        bullet.pos(point.x, point.y);
                    });
                }
            });
        }
    }

    class _General {
        static moveByAngle(enemy, diffX, bullet, angle, speed, rSpeed, func) {
            const enemyPos = new Laya.Point(enemy._lwg.gPoint.x += diffX, enemy._lwg.gPoint.y);
            bullet.pos(enemyPos.x, enemyPos.y);
            let _speedAdd = 0;
            const _rSpeed = LwgTools._Number.randomOneHalf() === 0 ? rSpeed : -rSpeed;
            bullet.rotation = angle - 90;
            LwgTimer._frameLoop(1, bullet, () => {
                const point = LwgTools._Point.getRoundPosNew(angle, _speedAdd += speed, enemyPos);
                bullet.pos(point.x, point.y);
                bullet.rotation += _rSpeed;
                func && func();
            });
        }
        static moveByXY(enemy, diffX, bullet, speedX, speedY, rSpeed, func) {
            bullet.pos(enemy._lwg.gPoint.x += diffX, enemy._lwg.gPoint.y);
            const _rSpeed = LwgTools._Number.randomOneHalf() === 0 ? rSpeed : -rSpeed;
            LwgTimer._frameLoop(1, bullet, () => {
                bullet.x += speedX;
                bullet.y += speedY;
                bullet.rotation += _rSpeed;
                func && func();
            });
        }
        static _annular(enemy, interval, num = 10, speed = 10, rSpeed = 0, style, delay = 0, diffX = 0) {
            LwgTimer._frameOnce(delay, enemy, () => {
                LwgTimer._frameLoop(interval, enemy, () => {
                    for (let index = 0; index < num; index++) {
                        const ep = new Laya.Point(enemy._lwg.gPoint.x += diffX, enemy._lwg.gPoint.y);
                        const bullet = _EnemyBullet[style](enemy);
                        const angle = 360 / num * index;
                        let _speedAdd = 0;
                        bullet.rotation = angle - 90;
                        const _rSpeed = LwgTools._Number.randomOneHalf() === 0 ? rSpeed : -rSpeed;
                        LwgTimer._frameLoop(1, bullet, () => {
                            const point = LwgTools._Point.getRoundPosNew(angle, _speedAdd += speed, ep);
                            bullet.pos(point.x, point.y);
                            bullet.rotation += _rSpeed;
                        });
                    }
                });
            });
        }
        static _spiral(enemy, interval, num, spacingAngle, speed = 10, rSpeed = 0, style = _EnemyBullet.Type.single, delay = 0, diffX = 0) {
            let time = 0;
            LwgTimer._frameOnce(delay, enemy, () => {
                LwgTimer._frameLoop(interval, enemy, () => {
                    time++;
                    const fA = 0;
                    const ep = new Laya.Point(enemy._lwg.gPoint.x + diffX, enemy._lwg.gPoint.y);
                    for (let index = 0; index < num; index++) {
                        const bullet = _EnemyBullet[style](enemy);
                        let _speedAdd = 0;
                        let angle = fA + time * spacingAngle;
                        angle += index * 360 / num;
                        bullet.rotation = angle - 90;
                        const _rSpeed = LwgTools._Number.randomOneHalf() === 0 ? rSpeed : -rSpeed;
                        LwgTimer._frameLoop(1, bullet, () => {
                            const point = LwgTools._Point.getRoundPosNew(angle, _speedAdd += speed, ep);
                            bullet.pos(point.x, point.y);
                            bullet.rotation += _rSpeed;
                        });
                    }
                });
            });
        }
        static _slapDown(enemy, interval = 3, startAngle = 0, endAngle = 180, spacingAngle = 15, speed = 10, rSpeed = 0, style = _EnemyBullet.Type.single, delay = 0, diffX = 0) {
            LwgTimer._frameOnce(delay, enemy, () => {
                let time = 0;
                LwgTimer._frameLoop(interval, enemy, () => {
                    const ep = new Laya.Point(enemy._lwg.gPoint.x + diffX, enemy._lwg.gPoint.y);
                    const bullet = _EnemyBullet[style](enemy);
                    let _speedAdd = 0;
                    let angle = time * spacingAngle;
                    if (angle > endAngle) {
                        enemy['angleState'] = 'sub';
                    }
                    if (angle <= startAngle) {
                        enemy['angleState'] = 'add';
                    }
                    if (enemy['angleState'] === 'sub') {
                        time--;
                    }
                    else {
                        time++;
                    }
                    bullet.rotation = angle - 90;
                    const _rSpeed = LwgTools._Number.randomOneHalf() === 0 ? rSpeed : -rSpeed;
                    LwgTimer._frameLoop(1, bullet, () => {
                        const point = LwgTools._Point.getRoundPosNew(angle, _speedAdd += speed, ep);
                        bullet.pos(point.x, point.y);
                        bullet.rotation += _rSpeed;
                    });
                });
            });
        }
        static _randomAngleDown(enemy, interval1, interval2, speed = 10, rSpeed = 0, style = _EnemyBullet.Type.single, delay = 0, diffX = 0) {
            LwgTimer._frameOnce(delay, enemy, () => {
                LwgTimer._frameRandomLoop(interval1, interval2, enemy, () => {
                    let fA = LwgTools._Number.randomOneInt(0, 180);
                    const ep = new Laya.Point(enemy._lwg.gPoint.x += diffX, enemy._lwg.gPoint.y);
                    const bullet = _EnemyBullet[style](enemy);
                    bullet.x += diffX;
                    let _speedAdd = 0;
                    bullet.rotation = fA - 90;
                    const _rSpeed = LwgTools._Number.randomOneHalf() === 0 ? rSpeed : -rSpeed;
                    LwgTimer._frameLoop(1, bullet, () => {
                        const point = LwgTools._Point.getRoundPosNew(fA, _speedAdd += speed, ep);
                        bullet.pos(point.x, point.y);
                        bullet.rotation += _rSpeed;
                    });
                });
            });
        }
        static _fall(enemy, interval1, interval2, speed = 10, rSpeed = 0, style = _EnemyBullet.Type.three_Across, delay = 0, diffX = 0) {
            LwgTimer._frameOnce(delay, enemy, () => {
                LwgTimer._frameRandomLoop(interval1, interval2, enemy, () => {
                    this.moveByXY(enemy, diffX, _EnemyBullet[style](enemy), speed, 0, rSpeed, null);
                });
            });
        }
        static _evenDowByCenter(enemy, interval = 5, num = 2, spacing = 30, speed = 10, rSpeed = 0, style = _EnemyBullet.Type.three_Triangle, delay = 0, diffX = 0) {
            LwgTimer._frameOnce(delay, enemy, () => {
                rSpeed = LwgTools._Number.randomOneHalf() === 0 ? rSpeed : -rSpeed;
                LwgTimer._frameLoop(interval, enemy, () => {
                    for (let index = 0; index < num; index++) {
                        let angle = index * (180 - spacing * 2) / (num - 1) + spacing;
                        this.moveByAngle(enemy, diffX, _EnemyBullet[style](enemy), angle, speed, rSpeed, null);
                    }
                });
            });
        }
        static _assignAngle(enemy, interval = 20, angle = 30, num = 2, numFrameInterval = 10, speed = 10, rSpeed = 0, style = _EnemyBullet.Type.single, delay = 0, diffX = 0) {
            LwgTimer._frameOnce(delay, enemy, () => {
                LwgTimer._frameLoop(interval, enemy, () => {
                    for (let index = 0; index < num; index++) {
                        LwgTimer._frameOnce(numFrameInterval * index, enemy, () => {
                            this.moveByAngle(enemy, diffX, _EnemyBullet[style](enemy), angle, speed, rSpeed, null);
                        });
                    }
                });
            });
        }
    }

    class Level6 {
        enemy(enemy) {
            _General._fall(enemy, 50, 200, 5, 5, _EnemyBullet.Type.four_Square);
        }
        land(enemy) {
            _General._slapDown(enemy, 1, 0, 180, 11, 10, 0, _EnemyBullet.Type.single);
            _General._assignAngle(enemy, 25, 135, 3, 4, 8, 0, _EnemyBullet.Type.single, 0, 200);
            _General._assignAngle(enemy, 25, 45, 3, 4, 8, 0, _EnemyBullet.Type.single, 0, -200);
        }
        house(enemy) {
            _General._spiral(enemy, 5, 2, 11, 10, 5, _EnemyBullet.Type.three_Vertical);
            _General._assignAngle(enemy, 25, 115, 3, 4, 8, 0, _EnemyBullet.Type.two, 0, 200);
            _General._assignAngle(enemy, 25, 65, 3, 4, 8, 0, _EnemyBullet.Type.two, 0, -200);
        }
        boss(enemy) {
            _General._evenDowByCenter(enemy, 20, 5, 30, 10, 5, _EnemyBullet.Type.three_Across);
            _General._assignAngle(enemy, 25, 115, 3, 4, 8, 0, _EnemyBullet.Type.single, 0, 200);
            _General._assignAngle(enemy, 25, 90, 3, 4, 8, 0, _EnemyBullet.Type.single, 0, 0);
            _General._assignAngle(enemy, 25, 65, 3, 4, 8, 0, _EnemyBullet.Type.single, 0, -200);
        }
        heroine(enemy) {
            _General._spiral(enemy, 5, 3, 11, 10, 8, _EnemyBullet.Type.two);
            _General._assignAngle(enemy, 25, 135, 3, 4, 8, 0, _EnemyBullet.Type.single, 0, 200);
            _General._assignAngle(enemy, 25, 45, 3, 4, 8, 0, _EnemyBullet.Type.single, 0, -200);
            _General._assignAngle(enemy, 25, 100, 3, 4, 8, 0, _EnemyBullet.Type.single, 0, 100);
            _General._assignAngle(enemy, 25, 80, 3, 4, 8, 0, _EnemyBullet.Type.single, 0, -100);
        }
    }

    class _EnemyAttack {
    }
    _EnemyAttack.Level1 = new Level6;
    _EnemyAttack.lvArr = [Level1, , Level2,];

    class Land extends BloodBase {
        constructor() {
            super(...arguments);
            this.landStage = false;
        }
        lwgOnAwake() {
            this.bloodInit(100);
            this._ImgChild('Blood').visible = false;
            LwgTimer._frameLoop(1, this, () => {
                this._Owner.rotation += 0.1;
            });
        }
        lwgEvent() {
            this._evReg(_Game._Event.enemyLandStage, () => {
                Laya.timer.clearAll(this);
                const time = Math.abs(this._Owner.rotation % 360) * 10;
                LwgAni2D.rotate(this._Owner, 0, time, 0, () => {
                    this._Owner.rotation = 0;
                    this._ImgChild('Blood').visible = true;
                    this.landStage = true;
                    _EnemyAttack.Level1.land(this._Owner);
                });
            });
            this._evReg(_Game._Event.enemyLandCheckWeapon, (Weapon, numBlood) => {
                this.checkOtherRule(Weapon, 160, this.landStage ? numBlood : 0);
            });
        }
        deathFunc() {
            this._evNotify(_Game._Event.enemyHouseStage);
        }
    }

    class Heroine extends BloodBase {
        constructor() {
            super(...arguments);
            this.heroineStage = true;
        }
        lwgOnAwake() {
            this.bloodInit(100);
            _EnemyAttack.Level1.heroine(this._Owner);
            this.move();
        }
        move() {
            let dir = 'left';
            LwgTimer._frameLoop(1, this, () => {
                if (dir == 'right') {
                    this._Owner.x++;
                    if (this._Owner.x > Laya.stage.width - 100) {
                        dir = 'left';
                    }
                }
                else {
                    this._Owner.x--;
                    if (this._Owner.x < 100) {
                        dir = 'right';
                    }
                }
            });
        }
        lwgEvent() {
            this._evReg(_Game._Event.heroineCheckWeapon, (Weapon, numBlood) => {
                this.checkOtherRule(Weapon, 50, this.heroineStage ? numBlood : 0);
            });
        }
        deathFunc() {
            this._openScene('Victory', false);
        }
    }

    class Enemy extends BloodBase {
        lwgOnAwake() {
            this.generalProInit();
            this.bloodInit(this._Owner['_EnemyData']['blood']);
            this.ranAttackNum = LwgTools._Number.randomOneBySection(1, 3, true);
        }
        generalProInit() {
            this._Owner.pos(Laya.stage.width / 2, 300);
            this._ImgChild('Shell').removeSelf();
            if (this._Owner['_EnemyData']['color']) {
                this._ImgChild('Pic').skin = `Game/UI/Game/Enemy/enemy_01_${this._Owner['_EnemyData']['color']}.png`;
            }
            const angle = this._Owner['_EnemyData']['angle'];
            this._Owner.rotation = angle;
            this.speed = this._Owner['_EnemyData']['speed'];
            this.groundRadius = 200;
        }
        lwgOnStart() {
            this.attack();
            this.appear(() => {
                this.move();
            });
        }
        appear(func) {
            let radius = 0;
            const radiusSpeed = 2;
            const time = 220 / radiusSpeed;
            LwgTimer._frameNumLoop(1, time, this, () => {
                radius += radiusSpeed;
                let point = LwgTools._Point.getRoundPosNew(this._Owner.rotation, radius, new Laya.Point(this._SceneImg('Land').width / 2, this._SceneImg('Land').height / 2));
                this._Owner.x = point.x;
                this._Owner.y = point.y;
            }, () => {
                func();
            });
        }
        attack() {
            _EnemyAttack.Level1.enemy(this._Owner);
        }
        move() {
            LwgTimer._frameLoop(1, this, () => {
                let point = LwgTools._Point.getRoundPosNew(this._Owner.rotation += this.speed, 220, new Laya.Point(this._SceneImg('Land').width / 2, this._SceneImg('Land').height / 2));
                this._Owner.x = point.x;
                this._Owner.y = point.y;
            });
        }
        lwgEvent() {
            this._evReg(_Game._Event.enemyCheckWeapon, (Weapon, numBlood) => {
                this.checkOtherRule(Weapon, 30, numBlood);
            });
        }
        deathFunc() {
            if (this._Owner.name === 'Boss') {
                LwgTools._Node.createPrefab(_Res.$prefab2D.Heroine.prefab2D, this._Parent, [this._Owner.x, this._Owner.y], Heroine);
            }
            else {
                this._evNotify(_Game._Event.addEnemy);
            }
        }
    }

    class Boss extends Enemy {
        lwgOnAwake() {
            this.generalProInit();
            this._Owner.pos(this._SceneImg('Content').x, this._SceneImg('Content').y);
            this._Owner.rotation = 0;
            this._SceneImg('Content').removeSelf();
            this.bloodInit(20);
        }
        lwgOnStart() {
            this.attack();
            this.move();
        }
        move() {
            let dir = 'left';
            LwgTimer._frameLoop(1, this, () => {
                if (dir == 'right') {
                    this._Owner.x++;
                    if (this._Owner.x > Laya.stage.width - 100) {
                        dir = 'left';
                    }
                }
                else {
                    this._Owner.x--;
                    if (this._Owner.x < 100) {
                        dir = 'right';
                    }
                }
            });
        }
        appear() {
        }
        attack() {
            _EnemyAttack.Level1.boss(this._Owner);
        }
    }

    class EnemyHouse extends BloodBase {
        constructor() {
            super(...arguments);
            this.enemyHouseStage = false;
        }
        lwgOnAwake() {
            this.bloodInit(20);
            this._ImgChild('Blood').visible = false;
        }
        lwgEvent() {
            this._evReg(_Game._Event.enemyHouseStage, () => {
                this.enemyHouseStage = true;
                this._ImgChild('Blood').visible = true;
                _EnemyAttack.Level1.house(this._Owner);
            });
            this._evReg(_Game._Event.enemyHouseCheckWeapon, (Weapon, numBlood) => {
                this.checkOtherRule(Weapon, 50, this.enemyHouseStage ? numBlood : 0);
            });
        }
        deathFunc() {
            new _Role._Boss(this._SceneImg('BossParent'), Boss);
        }
    }

    class _Buff extends LwgScene._ObjectBase {
        lwgOnStart() {
            this.checkHero();
        }
        checkHero() {
            LwgTimer._frameLoop(1, this, () => {
                this._Owner.y += 5;
                !LwgTools._Node.leaveStage(this._Owner, () => {
                    this._Owner.removeSelf();
                }) && LwgTools._Node.checkTwoDistance(this._Owner, this._SceneImg('Hero'), 60, () => {
                    this._Owner.removeSelf();
                    this._evNotify(_Game._Event.checkBuff, [this._Owner['buffType']]);
                });
            });
        }
    }
    class Tree extends BloodBase {
        constructor() {
            super(...arguments);
            this.buffState = true;
        }
        lwgOnAwake() {
            this.bloodInit(20);
        }
        lwgEvent() {
            this._evReg(_Game._Event.enemyLandStage, () => {
                this.buffState = false;
                this._ImgChild('Blood').visible = false;
            });
            this._evReg(_Game._Event.treeCheckWeapon, (Weapon, numBlood) => {
                if (this.buffState) {
                    this.checkOtherRule(Weapon, 50, numBlood);
                }
            });
        }
        deathFunc() {
            _Role._Buff._ins().createBuff(0, this._Scene, this._Owner._lwg.gPoint.x, this._Owner._lwg.gPoint.y, _Buff);
        }
    }

    class Game extends LwgScene._SceneBase {
        lwgOnAwake() {
            this._Owner['Hero'] = LwgTools._Node.createPrefab(_Res.$prefab2D.Hero.prefab2D, this._Owner, [Laya.stage.width / 2, Laya.stage.height * 2 / 3]);
            this._ImgVar('Hero').addComponent(Hero);
            for (let index = 0; index < this._ImgVar('MiddleScenery').numChildren; index++) {
                const element = this._ImgVar('MiddleScenery').getChildAt(index);
                if (element.name == 'Tree') {
                    element.addComponent(Tree);
                }
            }
            this._ImgVar('Land').addComponent(Land);
            this._ImgVar('EnemyHouse').addComponent(EnemyHouse);
            _EnemyBullet.Parent = this._ImgVar('EBparrent');
        }
        lwgOnStart() {
            this._evNotify(_Game._Event.enemyStage);
        }
        lwgEvent() {
            this._evReg(_Game._Event.enemyStage, () => {
                this._Enemy = new _Role._Enemy(this._ImgVar('EnemyParent'));
                const num = this._Enemy.quantity >= 10 ? 10 : this._Enemy.quantity;
                for (let index = 0; index < num; index++) {
                    this._Enemy.createEnmey(Enemy);
                }
            });
            this._evReg(_Game._Event.addEnemy, () => {
                if (this._Enemy.quantity > 0) {
                    this._Enemy.createEnmey(Enemy);
                }
                else {
                    if (this._ImgVar('EnemyParent').numChildren <= 1) {
                        this._evNotify(_Game._Event.enemyLandStage);
                    }
                }
            });
            this._evReg(_Game._Event.closeScene, () => {
                for (let index = 0; index < _Game._texArr.length; index++) {
                    const element = _Game._texArr[index];
                    element.destroy(true);
                    _Game._texArr.splice(index, 1);
                    index--;
                }
                for (let index = 0; index < _Game._arrowParentArr.length; index++) {
                    const element = _Game._arrowParentArr[index];
                    element.destroy(true);
                    _Game._arrowParentArr.splice(index, 1);
                    index--;
                }
                this._closeScene();
            });
        }
    }

    class Start extends LwgScene._SceneBase {
        lwgOnAwake() {
            LwgSet._bgMusic.switch = false;
        }
        lwgButton() {
            this._btnUp(this._ImgVar('BtnStart'), () => {
                let levelName = 'Game';
                this._openScene(levelName, true, false, () => {
                    if (!LwgScene._SceneControl[levelName].getComponent(Game)) {
                        LwgScene._SceneControl[levelName].addComponent(Game);
                    }
                });
            });
        }
    }

    class Defeated extends LwgScene._SceneBase {
        lwgButton() {
            this._btnUp(this._ImgVar('BtnBack'), () => {
                this._openScene('Start');
                this._evNotify(_Game._Event.closeScene);
            });
        }
    }

    class Victory extends LwgScene._SceneBase {
        lwgButton() {
            this._btnUp(this._ImgVar('BtnGet'), () => {
                this._openScene('Start');
                LwgEvent._notify(_Game._Event.closeScene);
            });
        }
    }

    class LwgInit extends LwgAdmin._InitScene {
        lwgOnAwake() {
            LwgPlatform._Ues.value = LwgPlatform._Tpye.OPPOTest;
            Laya.Stat.show();
            Laya.MouseManager.multiTouchEnabled = false;
            LwgSceneAni._openSwitch.value = true;
            LwgSceneAni._Use.value = {
                class: LwgSceneAni._fadeOut.Open,
                type: null,
            };
            LwgClick._Use.value = LwgClick._Type.reduce;
            LwgAdaptive._Use.value = [1280, 720];
            LwgScene._SceneScript = {
                PreLoad: PreLoad,
                Start: Start,
                Defeated: Defeated,
                Victory: Victory,
            };
        }
        lwgOnStart() {
            this._openScene('PreLoad');
        }
    }

    class GameConfig {
        constructor() {
        }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("script/Lwg/LwgInit.ts", LwgInit);
        }
    }
    GameConfig.width = 720;
    GameConfig.height = 1280;
    GameConfig.scaleMode = "fixedwidth";
    GameConfig.screenMode = "vertical";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
    GameConfig.startScene = "Scene/Lwginit.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = true;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    class Main {
        constructor() {
            if (window["Laya3D"])
                Laya3D.init(GameConfig.width, GameConfig.height);
            else
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = GameConfig.alignV;
            Laya.stage.alignH = GameConfig.alignH;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
                Laya.enableDebugPanel();
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat)
                Laya.Stat.show();
            Laya.alertGlobalError = true;
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
        }
    }
    new Main();

}());
