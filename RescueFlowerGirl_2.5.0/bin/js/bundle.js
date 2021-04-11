(function () {
  'use strict';

  var LwgPlatform;
  (function (LwgPlatform) {
      LwgPlatform.Tpye = {
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
      LwgPlatform.Ues = {
          get value() {
              return this['_platform/name'] ? this['_platform/name'] : null;
          },
          set value(val) {
              this['_platform/name'] = val;
              switch (val) {
                  case LwgPlatform.Tpye.WebTest:
                      Laya.LocalStorage.clear();
                      LwgCurrency.Gold.num.value = 5000;
                      break;
                  case LwgPlatform.Tpye.Research:
                      LwgCurrency.Gold.num.value = 50000000000000;
                      break;
                  default:
                      break;
              }
          }
      };
  })(LwgPlatform || (LwgPlatform = {}));
  var LwgGame;
  (function (LwgGame) {
      LwgGame.onOff = true;
      LwgGame.pause = {
          get value() {
              return LwgGame.onOff;
          },
          set value(bool) {
              if (bool) {
                  LwgGame.onOff = false;
                  LwgTimer.onOff = false;
                  LwgClick.filter.value = LwgClick.filterType.all;
              }
              else {
                  LwgGame.onOff = true;
                  LwgTimer.onOff = true;
                  LwgClick.filter.value = LwgClick.filterType.none;
              }
          }
      };
      LwgGame.level = {
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
      LwgGame.maxLevel = {
          get value() {
              return Laya.LocalStorage.getItem('_Game/maxLevel') ? Number(Laya.LocalStorage.getItem('_Game/maxLevel')) : this.level;
          },
          set value(val) {
              Laya.LocalStorage.setItem('_Game/maxLevel', val.toString());
          }
      };
      LwgGame.loopLevel = {
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
      LwgGame._createLevel = _createLevel;
      ;
  })(LwgGame || (LwgGame = {}));
  var LwgScene;
  (function (LwgScene) {
      LwgScene.SceneControl = {};
      LwgScene.SceneScript = [];
      class _BaseName {
      }
      _BaseName._LwgInit = '_LwgInit';
      _BaseName._PreLoad = '_PreLoad';
      _BaseName._PreLoadCutIn = '_PreLoadCutIn';
      _BaseName._Guide = '_Guide';
      _BaseName._Parameter = '_Parameter';
      _BaseName.Start = 'Start';
      _BaseName.SelectLevel = 'SelectLevel';
      _BaseName.Settle = 'Settle';
      _BaseName.Victory = 'Victory';
      _BaseName.Defeated = 'Defeated';
      _BaseName.Share = 'Share';
      _BaseName.CheckIn = 'CheckIn';
      _BaseName.Ranking = 'Ranking';
      _BaseName.Set = 'Set';
      _BaseName.Shop = 'Shop';
      _BaseName.Task = 'Task';
      LwgScene._BaseName = _BaseName;
      function sceneZOderUp(upScene) {
          let num = 0;
          for (const key in LwgScene.SceneControl) {
              if (Object.prototype.hasOwnProperty.call(LwgScene.SceneControl, key)) {
                  const Scene = LwgScene.SceneControl[key];
                  if (Scene.parent) {
                      Scene.zOrder = 0;
                      num++;
                  }
              }
          }
          if (upScene) {
              upScene.zOrder = num;
          }
      }
      LwgScene.sceneZOderUp = sceneZOderUp;
      function addToStage(openScene, _openZOder) {
          if (openScene) {
              if (_openZOder) {
                  Laya.stage.addChildAt(openScene, _openZOder);
              }
              else {
                  Laya.stage.addChild(openScene);
              }
              let spcriptBool = false;
              for (let index = 0; index < LwgScene.SceneScript.length; index++) {
                  const element = LwgScene.SceneScript[index];
                  if (element['name'] === openScene.name) {
                      if (!openScene.getComponent(element)) {
                          openScene.addComponent(element);
                          spcriptBool = true;
                      }
                  }
              }
              if (!spcriptBool) {
                  console.log(`${openScene.name}场景没有同名脚本！,需在LwgInit脚本中导入该脚本！`);
              }
          }
      }
      LwgScene.addToStage = addToStage;
      ;
      function aniFlow(openScene, closeScene, _openFunc, _closeFunc) {
          let closeAniTime = 0;
          let closeScript;
          if (closeScene) {
              sceneZOderUp(closeScene);
              closeScript = closeScene[closeScene.name];
              if (closeScript) {
                  closeAniTime = closeScript.lwgCloseAni();
                  if (closeAniTime === null) {
                      if (LwgSceneAni.closeSwitch.value) {
                          closeAniTime = LwgSceneAni._commonCloseAni(closeScene);
                      }
                  }
              }
          }
          Laya.timer.once(closeAniTime, this, () => {
              if (closeScene) {
                  closeScript && closeScript.lwgBeforeCloseAni();
                  closeScene.close();
                  _closeFunc && _closeFunc();
              }
              LwgClick.filter.value = LwgClick.filterType.all;
              if (openScene) {
                  LwgClick.filter.value = LwgClick.filterType.none;
                  sceneZOderUp(openScene);
                  const openScript = openScene[openScene.name];
                  let openAniTime = openScript.lwgOpenAni();
                  if (openAniTime === null) {
                      if (LwgSceneAni.openSwitch.value) {
                          openAniTime = LwgSceneAni._commonOpenAni(openScene);
                      }
                      else {
                          openAniTime = 0;
                      }
                  }
                  Laya.timer.once(openAniTime, this, () => {
                      openScript.lwgOpenAniAfter();
                      openScript.lwgButton();
                      _openFunc && _openFunc();
                      LwgClick.filter.value = LwgClick.filterType.all;
                  });
              }
          });
      }
      LwgScene.aniFlow = aniFlow;
      LwgScene._PreLoadCutIn = {
          openName: null,
          closeName: null,
      };
      function preLoadOpenScene(openName, closeName, func, zOrder) {
          LwgScene._PreLoadCutIn.openName = openName;
          LwgScene._PreLoadCutIn.closeName = closeName;
          openScene(_BaseName._PreLoadCutIn, closeName, func, zOrder);
      }
      LwgScene.preLoadOpenScene = preLoadOpenScene;
      function openScene(openName, closeName, openfunc, zOrder) {
          LwgClick.filter.value = LwgClick.filterType.none;
          Laya.Scene.load('Scene/' + openName + '.json', Laya.Handler.create(this, function (scene) {
              let openScene = LwgTools.Node.checkChildren(Laya.stage, openName);
              if (openScene) {
                  openScene.close();
                  console.log(`场景${openName}重复出现！前一个场景被关闭！`);
              }
              openScene = LwgScene.SceneControl[scene.name = openName] = scene;
              addToStage(openScene, zOrder);
              aniFlow(openScene, LwgScene.SceneControl[closeName], openfunc, null);
          }));
      }
      LwgScene.openScene = openScene;
      function closeScene(closeName, closefunc) {
          const closeScene = LwgScene.SceneControl[closeName];
          if (!closeScene) {
              console.log(`场景${closeName}关闭失败，可能不存在！`);
              return;
          }
          aniFlow(null, closeScene, null, closefunc);
      }
      LwgScene.closeScene = closeScene;
      class ScriptBase extends Laya.Script {
          constructor() {
              super(...arguments);
              this.ownerSceneName = '';
          }
          get ownerName() {
              return this.owner.name;
          }
          getFind(name, type) {
              if (!this[`_Scene${type}${name}`]) {
                  let Node = LwgTools.Node.findChild2D(this.owner.scene, name);
                  if (Node) {
                      LwgNode._addProperty(Node);
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
              return LwgStorage.num(`${this.ownerSceneName}/${name}`, _func, initial);
          }
          _storeStr(name, _func, initial) {
              return LwgStorage.str(`${this.ownerSceneName}/${name}`, _func, initial);
          }
          _storeBool(name, _func, initial) {
              return LwgStorage.bool(`${this.ownerSceneName}/${name}`, _func, initial);
          }
          _storeArray(name, _func, initial) {
              return LwgStorage.array(`${this.ownerSceneName}/${name}`, _func, initial);
          }
          lwgOnAwake() { }
          ;
          lwgAdaptive() { }
          ;
          lwgEvent() { }
          ;
          _evReg(name, func) {
              LwgEvent.register(name, this, func);
          }
          _evRegOne(name, func) {
              LwgEvent.registerOnce(name, this, func);
          }
          _evNotify(name, args) {
              LwgEvent.notify(name, args);
          }
          lwgOnEnable() { }
          lwgOnStart() { }
          lwgButton() { }
          ;
          checkBtnClick(target, clickFunc, e) {
              if (LwgClick.absolute) {
                  switch (LwgClick.filter.value) {
                      case LwgClick.filterType.all || LwgClick.filterType.button:
                          clickFunc && clickFunc(e);
                          break;
                      case LwgClick.filterType.someBtnIncludeStage || LwgClick.filterType.someBtnExcludeStage:
                          LwgClick.checkTarget(target.name) && clickFunc && clickFunc(e);
                          break;
                      default:
                          break;
                  }
              }
          }
          _btnDown(target, down, effect) {
              LwgClick.on(effect == undefined ? LwgClick.Use.value : effect, target, this, (e) => {
                  this.checkBtnClick(target, down, e);
              }, null, null, null);
          }
          _btnMove(target, move, effect) {
              LwgClick.on(effect == undefined ? LwgClick.Use.value : effect, target, this, null, (e) => {
                  this.checkBtnClick(target, move, e);
              }, null, null);
          }
          _btnUp(target, up, effect) {
              LwgClick.on(effect == undefined ? LwgClick.Use.value : effect, target, this, null, null, (e) => {
                  this.checkBtnClick(target, up, e);
              }, null);
          }
          _btnOut(target, out, effect) {
              LwgClick.on(effect == undefined ? LwgClick.Use.value : effect, target, this, null, null, null, (e) => {
                  this.checkBtnClick(target, out, e);
              });
          }
          _btnFour(target, down, move, up, out, effect) {
              LwgClick.on(effect == null ? effect : LwgClick.Use.value, target, this, (e) => {
                  this.checkBtnClick(target, down, e);
              }, (e) => {
                  this.checkBtnClick(target, move, e);
              }, (e) => {
                  this.checkBtnClick(target, up, e);
              }, (e) => {
                  this.checkBtnClick(target, out, e);
              });
          }
          _openScene(openName, closeSelf, preLoadCutIn, func, zOrder) {
              let closeName;
              if (closeSelf === undefined || closeSelf === true) {
                  closeName = this.ownerSceneName;
              }
              if (!preLoadCutIn) {
                  LwgScene.openScene(openName, closeName, func, zOrder);
              }
              else {
                  LwgScene.preLoadOpenScene(openName, closeName, func, zOrder);
              }
          }
          _closeScene(sceneName = this.ownerSceneName, func) {
              if (sceneName !== this.ownerSceneName) {
                  const scene = LwgScene.SceneControl[sceneName];
                  const scirpt = scene[sceneName];
                  const time = scirpt.lwgCloseAni();
                  Laya.timer.once(time ? time : 0, this, () => {
                      scene.close();
                  });
              }
              else {
                  LwgScene.closeScene(this.ownerSceneName, func);
              }
          }
          lwgOnUpdate() { }
          ;
          lwgOnDisable() { }
          ;
          onStageMouseDown(e) { LwgClick.checkStage() && this.lwgOnStageDown(e); }
          ;
          onStageMouseMove(e) { LwgClick.checkStage() && this.lwgOnStageMove(e); }
          ;
          onStageMouseUp(e) { LwgClick.checkStage() && this.lwgOnStageUp(e); }
          ;
          lwgOnStageDown(e) { }
          ;
          lwgOnStageMove(e) { }
          ;
          lwgOnStageUp(e) { }
          ;
      }
      LwgScene.ScriptBase = ScriptBase;
      class SceneBase extends ScriptBase {
          constructor() {
              super();
          }
          get _Owner() {
              return this.owner;
          }
          getVar(name, type) {
              if (!this[`_Scene${type}${name}`]) {
                  if (this._Owner[name]) {
                      LwgNode._addProperty(this._Owner[name]);
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
          _SkVar(name) {
              return this.getVar(name, '_SkVar');
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
          }
          moduleOnStart() { }
          ;
          lwgOpenAni() { return null; }
          ;
          lwgOpenAniAfter() { }
          ;
          _adaHeight(arr) {
              LwgAdaptive.stageHeight(arr);
          }
          ;
          _adaWidth(arr) {
              LwgAdaptive._stageWidth(arr);
          }
          ;
          _adaptiveCenter(arr) {
              LwgAdaptive.center(arr, Laya.stage);
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
              LwgEvent.offCaller(this);
              LwgEvent.offCaller(this._Owner);
              this.lwgOnDisable();
          }
      }
      LwgScene.SceneBase = SceneBase;
      class _ObjectBase extends ScriptBase {
          constructor() {
              super();
          }
          _lwgDestroyAndClear() {
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
                      LwgNode._addProperty(this._Scene[name]);
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
                      LwgNode._addProperty(child);
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
          _FontClipChild(name) {
              return this.getChild(name, '_TapFontClip');
          }
          _SKChild(name) {
              return this.getChild(name, '_TapFontClip');
          }
          onAwake() {
              LwgNode._addProperty(this._Owner);
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
              LwgEvent.offCaller(this);
              LwgEvent.offCaller(this._Owner);
          }
          onDisable() {
              this.clear();
              this.lwgOnDisable();
          }
      }
      LwgScene._ObjectBase = _ObjectBase;
  })(LwgScene || (LwgScene = {}));
  var LwgNode;
  (function (LwgNode) {
      class Sprite extends Laya.Sprite {
      }
      LwgNode.Sprite = Sprite;
      class Image extends Laya.Image {
      }
      LwgNode.Image = Image;
      class _Box extends Laya.Box {
      }
      LwgNode._Box = _Box;
      function _addProperty(Node, nodeType) {
          if (!Node)
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
          let getGPoint = () => {
              if (Node.parent) {
                  return Node.parent.localToGlobal(new Laya.Point(Node.x, Node.y));
              }
              else {
                  return null;
              }
          };
          const _fPoint = new Laya.Point(Node.x, Node.y);
          const _fGPoint = getGPoint();
          const _fRotation = Node.rotation;
          _proType = {
              get gPoint() {
                  return getGPoint();
              },
              fPoint: _fPoint,
              fGPoint: _fGPoint,
              fRotation: _fRotation,
              disByNode(OtherNode) {
                  const nodePos = getGPoint();
                  if (nodePos) {
                      if (OtherNode.parent) {
                          let otherNodePos = OtherNode.parent.localToGlobal(new Laya.Point(Node.x, Node.y));
                          return nodePos.distance(otherNodePos.x, otherNodePos.y);
                      }
                  }
                  return null;
              },
              globleDisByPoint(point) {
                  const nodeGPos = getGPoint();
                  return nodeGPos.distance(point.x, point.y);
              },
              localDisByPoint(point) {
                  const nodePos = new Laya.Point(Node.x, Node.y);
                  return nodePos.distance(point.x, point.y);
              },
              childGPoint(Child) {
                  const point = new Laya.Point(Child.x, Child.y);
                  const gPoint = Node.localToGlobal(point);
                  return gPoint;
              }
          };
          Node['_lwg'] = _proType;
      }
      LwgNode._addProperty = _addProperty;
  })(LwgNode || (LwgNode = {}));
  var LwgDialogue;
  (function (LwgDialogue) {
      let Skin;
      (function (Skin) {
          Skin["blackBord"] = "Lwg/UI/rectangle_mask_07.png";
      })(Skin || (Skin = {}));
      function middleHint(describe) {
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
          LwgAni2D.scale_Alpha(Hint_M, 0, 1, 0, 1, 1, 1, 200, 0, f => {
              LwgAni2D.fadeOut(Dec, 0, 1, 150, 0, f => {
                  LwgAni2D.fadeOut(Dec, 1, 0, 200, 800, f => {
                      LwgAni2D.scale_Alpha(Hint_M, 1, 1, 1, 1, 0, 0, 200, 0, f => {
                          Hint_M.removeSelf();
                      });
                  });
              });
          });
      }
      LwgDialogue.middleHint = middleHint;
      LwgDialogue.dialogContent = {
          get Array() {
              return Laya.loader.getRes("GameData/LwgDialogue/LwgDialogue.json")['RECORDS'] !== null ? Laya.loader.getRes("GameData/LwgDialogue/LwgDialogue.json")['RECORDS'] : [];
          },
      };
      function getDialogContent(useWhere, name) {
          let dia;
          for (let index = 0; index < LwgDialogue.dialogContent.Array.length; index++) {
              const element = LwgDialogue.dialogContent.Array[index];
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
      LwgDialogue.getDialogContent = getDialogContent;
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
      LwgDialogue.getDialogContent_Random = getDialogContent_Random;
      function getUseWhere(useWhere) {
          let arr = [];
          for (let index = 0; index < LwgDialogue.dialogContent.Array.length; index++) {
              const element = LwgDialogue.dialogContent.Array[index];
              if (element['useWhere'] == useWhere) {
                  arr.push(element);
              }
          }
          return arr;
      }
      LwgDialogue.getUseWhere = getUseWhere;
      let UseWhere;
      (function (UseWhere) {
          UseWhere["scene1"] = "scene1";
          UseWhere["scene2"] = "scene2";
          UseWhere["scene3"] = "scene3";
      })(UseWhere = LwgDialogue.UseWhere || (LwgDialogue.UseWhere = {}));
      let DialogProperty;
      (function (DialogProperty) {
          DialogProperty["name"] = "name";
          DialogProperty["useWhere"] = "useWhere";
          DialogProperty["content"] = "content";
          DialogProperty["max"] = "max";
      })(DialogProperty = LwgDialogue.DialogProperty || (LwgDialogue.DialogProperty = {}));
      let PlayMode;
      (function (PlayMode) {
          PlayMode["voluntarily"] = "voluntarily";
          PlayMode["manual"] = "manual";
          PlayMode["clickContent"] = "clickContent";
      })(PlayMode = LwgDialogue.PlayMode || (LwgDialogue.PlayMode = {}));
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
                  LwgAni2D.scale_Alpha(Pre_Dialogue, 0, 0, 0, 1, 1, 1, 150, 1000, () => {
                      for (let index = 0; index < contentArr.length; index++) {
                          Laya.timer.once(index * delayed, this, () => {
                              ContentLabel.text = contentArr[index];
                              if (index == contentArr.length - 1) {
                                  Laya.timer.once(delayed, this, () => {
                                      LwgAni2D.scale_Alpha(Pre_Dialogue, 1, 1, 1, 0, 0, 0, 150, 1000, () => {
                                          Pre_Dialogue.removeSelf();
                                      });
                                  });
                              }
                          });
                      }
                  });
                  LwgDialogue.DialogueNode = Pre_Dialogue;
              }));
          });
      }
      LwgDialogue.createVoluntarilyDialogue = createVoluntarilyDialogue;
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
      LwgDialogue.createCommonDialog = createCommonDialog;
  })(LwgDialogue || (LwgDialogue = {}));
  var LwgCurrency;
  (function (LwgCurrency) {
      let Diamond;
      (function (Diamond) {
          Diamond.num = {
              get value() {
                  return Laya.LocalStorage.getItem('LwgCurrency/DiamondNum') ? Number(Laya.LocalStorage.getItem('LwgCurrency/DiamondNum')) : 0;
              },
              set value(val) {
                  Laya.LocalStorage.setItem('LwgCurrency/DiamondNum', val.toString());
              }
          };
      })(Diamond = LwgCurrency.Diamond || (LwgCurrency.Diamond = {}));
      let Gold;
      (function (Gold_1) {
          Gold_1.num = {
              get value() {
                  return Laya.LocalStorage.getItem('LwgCurrency/GoldNum') ? Number(Laya.LocalStorage.getItem('LwgCurrency/GoldNum')) : 0;
              },
              set value(val) {
                  Laya.LocalStorage.setItem('LwgCurrency/GoldNum', val.toString());
              }
          };
          function createNode(x, y, parent = Laya.stage) {
              if (Gold_1._GoldNode) {
                  Gold_1._GoldNode.removeSelf();
              }
              let Img;
              Laya.loader.load('Prefab/LwgGold.json', Laya.Handler.create(this, function (prefabJson) {
                  const _prefab = new Laya.Prefab;
                  _prefab.json = prefabJson;
                  Img = LwgTools.Node.createPrefab(_prefab, parent, [x, y], null, 100);
                  Gold_1._GoldNode = Img;
                  updateNumNode();
              }));
          }
          Gold_1.createNode = createNode;
          function updateNumNode() {
              const Num = Gold_1._GoldNode.getChildByName('Num');
              if (Num['sheet']) {
                  Num['value'] = LwgTools._Format.formatNumber(Gold_1.num.value);
              }
              else {
                  Num['text'] = LwgTools._Format.formatNumber(Gold_1.num.value);
              }
          }
          function _add(number) {
              Gold_1.num.value += Number(number);
              updateNumNode();
          }
          Gold_1._add = _add;
          function addDisPlay(number) {
              const Num = Gold_1._GoldNode.getChildByName('Num');
              if (Num['sheet']) {
                  Num['value'] = (Number(Num['value']) + number).toString();
              }
              else {
                  Num['text'] = (Number(Num['text']) + number).toString();
              }
          }
          Gold_1.addDisPlay = addDisPlay;
          function addNoDisPlay(number) {
              Gold_1.num.value += Number(number);
          }
          Gold_1.addNoDisPlay = addNoDisPlay;
          function nodeAppear(delayed, x, y) {
              if (!Gold_1._GoldNode) {
                  return;
              }
              if (delayed) {
                  LwgAni2D.scale_Alpha(Gold_1._GoldNode, 0, 1, 1, 1, 1, 1, delayed, 0, () => {
                      Gold_1._GoldNode.visible = true;
                  });
              }
              else {
                  Gold_1._GoldNode.visible = true;
              }
              if (x) {
                  Gold_1._GoldNode.x = x;
              }
              if (y) {
                  Gold_1._GoldNode.y = y;
              }
          }
          Gold_1.nodeAppear = nodeAppear;
          function nodeVinish(delayed) {
              if (!Gold_1._GoldNode) {
                  return;
              }
              if (delayed) {
                  LwgAni2D.scale_Alpha(Gold_1._GoldNode, 1, 1, 1, 1, 1, 0, delayed, 0, () => {
                      Gold_1._GoldNode.visible = false;
                  });
              }
              else {
                  Gold_1._GoldNode.visible = false;
              }
          }
          Gold_1.nodeVinish = nodeVinish;
          function nodeMove(x, y, time = 200, delay = 0, func = null) {
              LwgAni2D.move(Gold_1._GoldNode, x, y ? y : Gold_1._GoldNode.y, time, () => {
                  func && func();
              }, delay);
          }
          Gold_1.nodeMove = nodeMove;
          let SkinUrl;
          (function (SkinUrl) {
              SkinUrl[SkinUrl["Lwg/UI/corner_12.png"] = 0] = "Lwg/UI/corner_12.png";
          })(SkinUrl || (SkinUrl = {}));
          function createOne(width, height, url) {
              const Gold = Laya.Pool.getItemByClass('addGold', Laya.Image);
              Gold.name = 'addGold';
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
              if (Gold_1._GoldNode) {
                  Gold.zOrder = Gold_1._GoldNode.zOrder + 10;
              }
              return Gold;
          }
          Gold_1.createOne = createOne;
          function getAni_Single(parent, number, width, height, url, firstPoint, targetPoint, func1, func2) {
              for (let index = 0; index < number; index++) {
                  Laya.timer.once(index * 30, this, () => {
                      const Gold = createOne(width, height, url);
                      parent.addChild(Gold);
                      LwgAni2D.move_Scale(Gold, 1, firstPoint.x, firstPoint.y, targetPoint.x, targetPoint.y, 1, 350, 0, null, () => {
                          LwgAudio.playSound(LwgAudio.voiceUrl.huodejinbi);
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
          Gold_1.getAni_Single = getAni_Single;
          function getAni_Heap(parent, number, width, height, url, firstPoint, targetPoint, func1, func2) {
              for (let index = 0; index < number; index++) {
                  const Gold = createOne(width ? width : 100, height ? height : 100, url ? url : SkinUrl[0]);
                  parent = parent ? parent : Laya.stage;
                  parent.addChild(Gold);
                  firstPoint = firstPoint ? firstPoint : new Laya.Point(Laya.stage.width / 2, Laya.stage.height / 2);
                  targetPoint = targetPoint ? targetPoint : new Laya.Point(Gold_1._GoldNode.x, Gold_1._GoldNode.y);
                  let x = Math.floor(Math.random() * 2) == 1 ? firstPoint.x + Math.random() * 100 : firstPoint.x - Math.random() * 100;
                  let y = Math.floor(Math.random() * 2) == 1 ? firstPoint.y + Math.random() * 100 : firstPoint.y - Math.random() * 100;
                  LwgAni2D.move_Scale(Gold, 0.5, firstPoint.x, firstPoint.y, x, y, 1, 300, Math.random() * 100 + 100, Laya.Ease.expoIn, () => {
                      LwgAni2D.move_Scale(Gold, 1, Gold.x, Gold.y, targetPoint.x, targetPoint.y, 1, 400, Math.random() * 200 + 100, Laya.Ease.cubicOut, () => {
                          LwgAudio.playSound(LwgAudio.voiceUrl.huodejinbi);
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
          Gold_1.getAni_Heap = getAni_Heap;
      })(Gold = LwgCurrency.Gold || (LwgCurrency.Gold = {}));
  })(LwgCurrency || (LwgCurrency = {}));
  var LwgEvent;
  (function (LwgEvent) {
      LwgEvent.dispatcher = new Laya.EventDispatcher();
      function register(type, caller, listener) {
          if (!caller) {
              console.error("事件的执行域必须存在!");
          }
          LwgEvent.dispatcher.on(type.toString(), caller, listener);
      }
      LwgEvent.register = register;
      function registerOnce(type, caller, listener) {
          if (!caller) {
              console.error("事件的执行域必须存在!");
          }
          LwgEvent.dispatcher.once(type.toString(), caller, listener);
      }
      LwgEvent.registerOnce = registerOnce;
      function notify(type, args) {
          LwgEvent.dispatcher.event(type.toString(), args);
      }
      LwgEvent.notify = notify;
      function off(type, caller, listener) {
          LwgEvent.dispatcher.off(type.toString(), caller, listener);
      }
      LwgEvent.off = off;
      function offAll(type) {
          LwgEvent.dispatcher.offAll(type.toString());
      }
      LwgEvent.offAll = offAll;
      function offCaller(caller) {
          LwgEvent.dispatcher.offAllCaller(caller);
      }
      LwgEvent.offCaller = offCaller;
  })(LwgEvent || (LwgEvent = {}));
  var LwgDate;
  (function (LwgDate) {
      LwgDate.date = {
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
      function init() {
          const d = new Date;
          LwgDate.loginInfo = LwgStorage.arrayArr('LwgDate/loginInfo');
          LwgDate.loginInfo.value.push([d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getDay(), d.getHours(), d.getMinutes(), d.getSeconds()]);
          let arr = [];
          if (LwgDate.loginInfo.value.length > 0) {
              for (let index = 0; index < LwgDate.loginInfo.value.length; index++) {
                  arr.push(LwgDate.loginInfo.value[index]);
              }
          }
          arr.push([d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getDay(), d.getHours(), d.getMinutes(), d.getSeconds()]);
          LwgDate.loginInfo.value = arr;
          LwgDate.loginCount = LwgStorage.num('LwgDate/ loginCount');
          LwgDate.loginCount.value++;
          LwgDate.loginToday.num++;
      }
      LwgDate.init = init;
      LwgDate.loginToday = {
          get num() {
              return Laya.LocalStorage.getItem('LwgDate/loginToday') ? Number(Laya.LocalStorage.getItem('LwgDate/loginToday')) : 0;
          },
          set num(val) {
              if (LwgDate.date.date == LwgDate.loginInfo.value[LwgDate.loginInfo.value.length - 1][2]) {
                  Laya.LocalStorage.setItem('LwgDate/loginToday', val.toString());
              }
          }
      };
      LwgDate.last = {
          get date() {
              if (LwgDate.loginInfo.value.length > 1) {
                  return LwgDate.loginInfo.value[LwgDate.loginInfo.value.length - 2][2];
              }
              else {
                  return LwgDate.loginInfo.value[LwgDate.loginInfo.value.length - 1][2];
              }
          },
      };
      LwgDate.front = {
          get date() {
              return LwgDate.loginInfo.value[LwgDate.loginInfo.value.length - 1][2];
          },
      };
  })(LwgDate || (LwgDate = {}));
  var LwgTimer;
  (function (LwgTimer) {
      LwgTimer.onOff = true;
      function frameLoop(delay, caller, method, immediately, args, coverBefore) {
          if (immediately) {
              if (LwgTimer.onOff) {
                  method();
              }
          }
          Laya.timer.frameLoop(delay, caller, () => {
              if (LwgTimer.onOff) {
                  method();
              }
          }, args, coverBefore);
      }
      LwgTimer.frameLoop = frameLoop;
      function frameRandomLoop(delay1, delay2, caller, method, immediately, args, coverBefore) {
          if (immediately) {
              if (LwgTimer.onOff) {
                  method();
              }
          }
          var func = () => {
              let delay = LwgTools.Num.randomOneInt(delay1, delay2);
              Laya.timer.frameOnce(delay, caller, () => {
                  if (LwgTimer.onOff) {
                      method();
                      func();
                  }
              }, args, coverBefore);
          };
          func();
      }
      LwgTimer.frameRandomLoop = frameRandomLoop;
      function frameNumLoop(delay, num, caller, method, compeletMethod, immediately, args, coverBefore) {
          if (immediately) {
              if (LwgTimer.onOff) {
                  method();
              }
          }
          let num0 = 0;
          var func = () => {
              if (LwgTimer.onOff) {
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
      LwgTimer.frameNumLoop = frameNumLoop;
      function numRandomLoop(delay1, delay2, num, caller, method, compeletMethod, immediately, args, coverBefore) {
          immediately && LwgTimer.onOff && method();
          let num0 = 0;
          var func = () => {
              let delay = LwgTools.Num.randomOneInt(delay1, delay2);
              Laya.timer.frameOnce(delay, caller, () => {
                  if (LwgTimer.onOff) {
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
      LwgTimer.numRandomLoop = numRandomLoop;
      function frameNumRandomLoop(delay1, delay2, num, caller, method, compeletMethod, immediately, args, coverBefore) {
          immediately && LwgTimer.onOff && method();
          let num0 = 0;
          var func = () => {
              let delay = LwgTools.Num.randomOneInt(delay1, delay2);
              Laya.timer.frameOnce(delay, caller, () => {
                  if (LwgTimer.onOff) {
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
      LwgTimer.frameNumRandomLoop = frameNumRandomLoop;
      function frameOnce(delay, caller, afterMethod, beforeMethod, args, coverBefore) {
          beforeMethod && beforeMethod();
          Laya.timer.frameOnce(delay, caller, () => {
              if (LwgTimer.onOff) {
                  afterMethod();
              }
          }, args, coverBefore);
      }
      LwgTimer.frameOnce = frameOnce;
      function _frameNumOnce(delay, num, caller, afterMethod, beforeMethod, args, coverBefore) {
          for (let index = 0; index < num; index++) {
              beforeMethod && beforeMethod();
              Laya.timer.frameOnce(delay, caller, () => {
                  if (LwgTimer.onOff) {
                      afterMethod();
                  }
              }, args, coverBefore);
          }
      }
      LwgTimer._frameNumOnce = _frameNumOnce;
      function _loop(delay, caller, method, immediately, args, coverBefore) {
          if (immediately) {
              if (LwgTimer.onOff) {
                  method();
              }
          }
          Laya.timer.loop(delay, caller, () => {
              if (LwgTimer.onOff) {
                  method();
              }
          }, args, coverBefore);
      }
      LwgTimer._loop = _loop;
      function randomLoop(delay1, delay2, caller, method, immediately, args, coverBefore) {
          if (immediately) {
              if (LwgTimer.onOff) {
                  method();
              }
          }
          var func = () => {
              let delay = LwgTools.Num.randomOneInt(delay1, delay2);
              Laya.timer.once(delay, caller, () => {
                  if (LwgTimer.onOff) {
                      method();
                      func();
                  }
              }, args, coverBefore);
          };
          func();
      }
      LwgTimer.randomLoop = randomLoop;
      function numLoop(delay, num, caller, method, compeletMethod, immediately, args, coverBefore) {
          if (immediately) {
              method();
          }
          let num0 = 0;
          var func = () => {
              if (LwgTimer.onOff) {
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
      LwgTimer.numLoop = numLoop;
      function once(delay, caller, afterMethod, beforeMethod, args, coverBefore) {
          if (beforeMethod) {
              beforeMethod();
          }
          Laya.timer.once(delay, caller, () => {
              afterMethod();
          }, args, coverBefore);
      }
      LwgTimer.once = once;
      function clearAll(caller) {
          Laya.timer.clearAll(caller);
      }
      LwgTimer.clearAll = clearAll;
      function _clear(caller, func) {
          Laya.timer.clear(caller, func);
      }
      LwgTimer._clear = _clear;
  })(LwgTimer || (LwgTimer = {}));
  var LwgAdaptive;
  (function (LwgAdaptive) {
      LwgAdaptive.Use = {
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
                  element.x = element.x / LwgAdaptive.Use.value[0] * Laya.stage.width + element.width / 2;
              }
              else {
                  element.x = element.x / LwgAdaptive.Use.value[0] * Laya.stage.width;
              }
          }
      }
      LwgAdaptive._stageWidth = _stageWidth;
      function stageHeight(arr) {
          for (let index = 0; index < arr.length; index++) {
              const element = arr[index];
              if (element.pivotY == 0 && element.height) {
                  element.y = element.y / LwgAdaptive.Use.value[1] * element.scaleX * Laya.stage.height + element.height / 2;
              }
              else {
                  element.y = element.y / LwgAdaptive.Use.value[1] * element.scaleX * Laya.stage.height;
              }
          }
      }
      LwgAdaptive.stageHeight = stageHeight;
      function center(arr, target) {
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
      LwgAdaptive.center = center;
  })(LwgAdaptive || (LwgAdaptive = {}));
  var LwgSceneAni;
  (function (LwgSceneAni) {
      LwgSceneAni.openSwitch = {
          get value() {
              return this['openSwitch'] ? this['openSwitch'] : false;
          },
          set value(val) {
              if (val) {
                  LwgSceneAni.closeSwitch.value = false;
              }
              this['openSwitch'] = val;
          }
      };
      LwgSceneAni.closeSwitch = {
          get value() {
              return this['closeSwitch'] ? this['closeSwitch'] : false;
          },
          set value(val) {
              if (val) {
                  LwgSceneAni.openSwitch.value = false;
              }
              this['closeSwitch'] = val;
          }
      };
      LwgSceneAni.Use = {
          get value() {
              return this['SceneAnimation/use'] ? this['SceneAnimation/use'] : null;
          },
          set value(val) {
              if (val.class['name'] === 'Open') {
                  LwgSceneAni.openSwitch.value = true;
              }
              else {
                  LwgSceneAni.openSwitch.value = false;
              }
              this['SceneAnimation/use'] = val;
          }
      };
      LwgSceneAni.closeAniTime = 0;
      LwgSceneAni.openAniTime = 0;
      function _commonOpenAni(Scene) {
          return LwgSceneAni.Use.value.class['_paly'](LwgSceneAni.Use.value.type, Scene);
      }
      LwgSceneAni._commonOpenAni = _commonOpenAni;
      function _commonCloseAni(Scene) {
          return LwgSceneAni.Use.value.class['_paly'](LwgSceneAni.Use.value.type, Scene);
      }
      LwgSceneAni._commonCloseAni = _commonCloseAni;
      let _fadeOut;
      (function (_fadeOut) {
          let commonTime = 700;
          let commonDelay = 150;
          class Close {
              static _paly(type, Scene) {
                  _fadeOut_Close(Scene);
                  return commonDelay + commonTime;
              }
              ;
          }
          _fadeOut.Close = Close;
          class Open {
              static _paly(type, Scene) {
                  _fadeOut_Open(Scene);
                  return LwgSceneAni.closeAniTime = commonDelay + commonTime;
              }
              ;
          }
          _fadeOut.Open = Open;
          function _fadeOut_Open(Scene) {
              let time = 400;
              let delay = 300;
              if (Scene['Background']) {
                  LwgAni2D.fadeOut(Scene, 0, 1, time / 2, delay);
              }
              LwgAni2D.fadeOut(Scene, 0, 1, time, 0);
              return time + delay;
          }
          function _fadeOut_Close(Scene) {
              let time = 150;
              let delay = 50;
              if (Scene['Background']) {
                  LwgAni2D.fadeOut(Scene, 1, 0, time / 2);
              }
              LwgAni2D.fadeOut(Scene, 1, 0, time, delay);
              return time + delay;
          }
      })(_fadeOut = LwgSceneAni._fadeOut || (LwgSceneAni._fadeOut = {}));
      let Shutters;
      (function (Shutters) {
          let commonNum = 10;
          let commonTime = 700;
          let commonDelay = 150;
          function moveClose(sp, tex, scaleX, scealeY) {
              LwgAni2D.scale(sp, 1, 1, scaleX, scealeY, commonTime, 0, () => {
                  tex.disposeBitmap();
                  tex.destroy();
                  sp.destroy();
              });
          }
          function moveOpen(sp, tex, scaleX, scealeY) {
              LwgAni2D.scale(sp, scaleX, scealeY, 1, 1, commonTime, 0, () => {
                  tex.disposeBitmap();
                  tex.destroy();
                  sp.destroy();
              });
          }
          function moveRule(sp, tex, scaleModul, open) {
              if (open) {
                  if (scaleModul === 'x') {
                      moveOpen(sp, tex, 0, 1);
                  }
                  else {
                      moveOpen(sp, tex, 1, 0);
                  }
              }
              else {
                  if (scaleModul === 'x') {
                      moveClose(sp, tex, 0, 1);
                  }
                  else {
                      moveClose(sp, tex, 1, 0);
                  }
              }
          }
          function createNoMaskSp(x, y, width, height, tex, scaleModul, open) {
              const sp = new Laya.Sprite;
              Laya.stage.addChild(sp);
              sp.name = 'shutters';
              sp.zOrder = 1000;
              sp.pos(x, y);
              sp.size(width, height);
              LwgTools.Node.changePivot(sp, width / 2, height / 2);
              sp.texture = tex;
              moveRule(sp, tex, scaleModul, open);
              return sp;
          }
          function createMaskSp(Scene, scaleModul, open) {
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
              moveRule(sp, tex, scaleModul, open);
              return sp;
          }
          function createMask(sp) {
              const Mask = new Laya.Image;
              Mask.skin = `Lwg/UI/ui_orthogon_cycn.png`;
              Mask.sizeGrid = '12,12,12,12';
              sp.mask = Mask;
              Mask.anchorX = Mask.anchorY = 0.5;
              return Mask;
          }
          function crosswise(Scene, open) {
              for (let index = 0; index < commonNum; index++) {
                  const _width = Scene.width / commonNum;
                  const _height = Laya.stage.height;
                  const tex = Scene.drawToTexture(_width, _height, -_width * index, 0);
                  createNoMaskSp(_width * index, 0, _width, _height, tex, 'x', open);
              }
          }
          Shutters.crosswise = crosswise;
          function vertical(Scene, open) {
              for (let index = 0; index < commonNum; index++) {
                  const _width = Scene.width;
                  const _height = Laya.stage.height / commonNum;
                  const tex = Scene.drawToTexture(_width, _height, 0, -_height * index);
                  createNoMaskSp(0, _height * index, _width, _height, tex, 'y', false);
              }
          }
          Shutters.vertical = vertical;
          function croAndVer(Scene, open) {
              const num = commonNum - 2;
              for (let index = 0; index < num; index++) {
                  const _width = Scene.width / num;
                  const _height = Laya.stage.height;
                  const tex = Scene.drawToTexture(_width, _height, -_width * index, 0);
                  createNoMaskSp(_width * index, 0, _width, _height, tex, 'x', false);
              }
              for (let index = 0; index < num; index++) {
                  const _width = Scene.width;
                  const _height = Laya.stage.height / num;
                  const tex = Scene.drawToTexture(_width, _height, 0, -_height * index);
                  createNoMaskSp(0, _height * index, _width, _height, tex, 'y', open);
              }
          }
          Shutters.croAndVer = croAndVer;
          function rSideling(Scene, open) {
              for (let index = 0; index < commonNum; index++) {
                  let addLen = 1000;
                  const sp = createMaskSp(Scene, 'x', open);
                  const Mask = createMask(sp);
                  Mask.size(Math.round(Laya.stage.width / commonNum), Math.round(Laya.stage.height + addLen));
                  Mask.pos(Math.round(Laya.stage.width / commonNum * index), Math.round(-addLen / 2));
                  LwgTools.Node.changePivot(Mask, Math.round(Mask.width / 2), Math.round(Mask.height / 2));
                  LwgTools.Node.changePivot(sp, Math.round(index * sp.width / commonNum + sp.width / commonNum / 2), Math.round(sp.height / 2));
                  Mask.rotation = -10;
              }
          }
          Shutters.rSideling = rSideling;
          function lSideling(Scene, open) {
              for (let index = 0; index < commonNum; index++) {
                  const sp = createMaskSp(Scene, 'x', open);
                  const Mask = createMask(sp);
                  Mask.size(Math.round(Laya.stage.width / commonNum), Math.round(Laya.stage.height + 1000));
                  Mask.pos(Math.round(Laya.stage.width / commonNum * index), -1000 / 2);
                  LwgTools.Node.changePivot(Mask, Math.round(Mask.width / 2), Math.round(Mask.height / 2));
                  LwgTools.Node.changePivot(sp, Math.round(index * sp.width / commonNum + sp.width / commonNum / 2), Math.round(sp.height / 2));
                  Mask.rotation = 10;
              }
          }
          Shutters.lSideling = lSideling;
          function sidelingIntersection(Scene, open) {
              for (let index = 0; index < commonNum; index++) {
                  let addLen = 1000;
                  const sp1 = createMaskSp(Scene, 'x', open);
                  const Mask1 = createMask(sp1);
                  Mask1.width = Math.round(Laya.stage.width / commonNum);
                  Mask1.height = Math.round(Laya.stage.height + addLen);
                  Mask1.pos(Math.round(Laya.stage.width / commonNum * index), Math.round(-addLen / 2));
                  LwgTools.Node.changePivot(Mask1, Math.round(Mask1.width / 2), Math.round(Mask1.height / 2));
                  LwgTools.Node.changePivot(sp1, Math.round(index * sp1.width / commonNum + sp1.width / commonNum / 2), Math.round(sp1.height / 2));
                  Mask1.rotation = -15;
                  const sp2 = createMaskSp(Scene, 'x', open);
                  const Mask2 = createMask(sp2);
                  Mask2.width = Laya.stage.width / commonNum;
                  Mask2.height = Laya.stage.height + addLen;
                  Mask2.pos(Laya.stage.width / commonNum * index, -addLen / 2);
                  LwgTools.Node.changePivot(Mask2, Mask2.width / 2, Mask2.height / 2);
                  LwgTools.Node.changePivot(sp2, index * sp2.width / commonNum + sp2.width / commonNum / 2, sp2.height / 2);
                  Mask2.rotation = 15;
              }
          }
          Shutters.sidelingIntersection = sidelingIntersection;
          function randomCroAndVer(Scene, open) {
              const index = LwgTools._Array.randomGetOne([0, 1, 2]);
              switch (index) {
                  case 0:
                      crosswise(Scene, open);
                      break;
                  case 1:
                      vertical(Scene, open);
                      break;
                  case 2:
                      croAndVer(Scene, open);
                      break;
                  default:
                      crosswise(Scene, open);
                      break;
              }
          }
          Shutters.randomCroAndVer = randomCroAndVer;
          function random(Scene, open) {
              const index = LwgTools._Array.randomGetOne([0, 1, 2, 3, 4, 5]);
              switch (index) {
                  case 0:
                      crosswise(Scene, open);
                      break;
                  case 1:
                      vertical(Scene, open);
                      break;
                  case 2:
                      croAndVer(Scene, open);
                      break;
                  case 3:
                      sidelingIntersection(Scene, open);
                      break;
                  case 4:
                      lSideling(Scene, open);
                      break;
                  case 5:
                      rSideling(Scene, open);
                      break;
                  default:
                      crosswise(Scene, open);
                      break;
              }
          }
          Shutters.random = random;
          class Close {
              static _paly(type, Scene) {
                  LwgTimer.once(commonDelay, this, () => {
                      Shutters[`${type}`](Scene, false);
                      Scene.visible = false;
                  });
                  return LwgSceneAni.closeAniTime = commonDelay + commonTime;
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
          Shutters.Close = Close;
          class Open {
              static _paly(type, Scene) {
                  LwgTimer.once(commonDelay, this, () => {
                      Shutters[`_${type}`](Scene, true);
                      Scene.visible = false;
                      LwgTimer.once(commonTime, this, () => {
                          Scene.visible = true;
                      });
                  });
                  return LwgSceneAni.closeAniTime = commonTime + commonDelay;
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
          Shutters.Open = Open;
      })(Shutters = LwgSceneAni.Shutters || (LwgSceneAni.Shutters = {}));
      let SickIn;
      (function (SickIn) {
          function stickIn(Scene, type) {
              let sumDelay = 0;
              let time = 700;
              let delay = 100;
              if (Scene.getChildByName('Background')) {
                  LwgAni2D.fadeOut(Scene.getChildByName('Background'), 0, 1, time);
              }
              let stickInLeftArr = LwgTools.Node.childZOrderByY(Scene, false);
              for (let index = 0; index < stickInLeftArr.length; index++) {
                  const element = stickInLeftArr[index];
                  if (element.name !== 'Background' && element.name.substr(0, 5) !== 'NoAni') {
                      let originalPovitX = element.pivotX;
                      let originalPovitY = element.pivotY;
                      let originalX = element.x;
                      let originalY = element.y;
                      element.x = element.pivotX > element.width / 2 ? 800 + element.width : -800 - element.width;
                      element.y = element.rotation > 0 ? element.y + 200 : element.y - 200;
                      LwgAni2D.rotate(element, 0, time, delay * index);
                      LwgAni2D.move(element, originalX, originalY, time, () => {
                          LwgTools.Node.changePivot(element, originalPovitX, originalPovitY);
                      }, delay * index);
                  }
              }
              sumDelay = Scene.numChildren * delay + time + 200;
              return sumDelay;
          }
      })(SickIn = LwgSceneAni.SickIn || (LwgSceneAni.SickIn = {}));
  })(LwgSceneAni || (LwgSceneAni = {}));
  var LwgStorage;
  (function (LwgStorage) {
      class admin {
          removeSelf() { }
          func() { }
      }
      class NumVariable extends admin {
      }
      LwgStorage.NumVariable = NumVariable;
      class StrVariable extends admin {
      }
      LwgStorage.StrVariable = StrVariable;
      class BoolVariable extends admin {
      }
      LwgStorage.BoolVariable = BoolVariable;
      class ArrayVariable extends admin {
      }
      LwgStorage.ArrayVariable = ArrayVariable;
      class ArrayArrVariable extends admin {
      }
      LwgStorage.ArrayArrVariable = ArrayArrVariable;
      class _Object extends admin {
      }
      LwgStorage._Object = _Object;
      function num(name, _func, initial) {
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
      LwgStorage.num = num;
      function str(name, _func, initial) {
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
      LwgStorage.str = str;
      function bool(name, _func, initial) {
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
      LwgStorage.bool = bool;
      function array(name, _func, initial) {
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
      LwgStorage.array = array;
      function obj(name, _func, initial) {
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
      LwgStorage.obj = obj;
      function arrayArr(name, _func, initial) {
          if (!this[`arrayArr${name}`]) {
              this[`arrayArr${name}`] = {
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
              this[`arrayArr${name}`]['_func'] = _func;
          }
          return this[`arrayArr${name}`];
      }
      LwgStorage.arrayArr = arrayArr;
  })(LwgStorage || (LwgStorage = {}));
  var LwgData;
  (function (LwgData) {
      class BaseProperty {
          constructor() {
              this.name = 'name';
              this.serial = 'serial';
              this.gameLevel = 'level';
              this.level = 'level';
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
              this.price = 'price';
              this.EXP = 'EXP';
          }
      }
      LwgData.BaseProperty = BaseProperty;
      ;
      LwgData._unlockWayType = {
          ads: 'ads',
          gold: 'gold',
          diamond: 'diamond',
          customs: 'customs',
          check: 'check',
          free: 'free',
      };
      class Item extends LwgScene._ObjectBase {
          constructor() {
              super(...arguments);
              this.$data = null;
              this.$unlockWayType = LwgData._unlockWayType;
              this.buttonOn = false;
          }
          get $dataIndex() { return this['item/dataIndex']; }
          set $dataIndex(_dataIndex) { this['item/dataIndex'] = _dataIndex; }
          get $dataArrName() { return this['item/dataArrName']; }
          set $dataArrName(name) {
              this['item/dataArrName'] = name;
          }
          $render() { }
          ;
          $button() { }
          ;
          $onStart() { }
          ;
          lwgOnStart() {
              this.$onStart();
              if (!this.buttonOn) {
                  this.$button();
              }
          }
      }
      LwgData.Item = Item;
      class Table {
          constructor(tableName, _tableArr = null, localStorage = true, addCompare = true, lastVtableName, lastProArr) {
              this._unlockWay = LwgData._unlockWayType;
              this._tableName = 'Table';
              this._lastArr = [];
              this._localStorage = false;
              this._property = new BaseProperty;
              if (tableName) {
                  this._tableName = tableName;
                  if (localStorage) {
                      this._localStorage = localStorage;
                      if (addCompare) {
                          this._arr = compareAdd(_tableArr, tableName, this._property.name);
                      }
                      else {
                          this._arr = compare(_tableArr, tableName);
                      }
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
              if (!this[`_${this._tableName}arr`]) {
                  console.log('非单例模式下，请手动初始化_arr');
              }
              return this[`_${this._tableName}arr`];
          }
          set _arr(arr) {
              this[`_${this._tableName}arr`] = arr;
              Laya.LocalStorage.setJSON(this._tableName, JSON.stringify(this[`_${this._tableName}arr`]));
          }
          get _ListScrollBarTouchScrollEnable() {
              return this._List.scrollBar.touchScrollEnable;
          }
          ;
          set _ListScrollBarTouchScrollEnable(bool) {
              this._List.scrollBar.touchScrollEnable = bool;
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
                      _item.$data = this._listArray[index];
                      _item.$dataIndex = index;
                      _item.$render();
                      if (!_item.buttonOn) {
                          _item.$button();
                      }
                  }
              });
              list.selectHandler = new Laya.Handler(this, (index) => {
                  this._listSelect && this._listSelect(index);
              });
              this[`${this._tableName}_List`].refresh();
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
          _sumProByCompelet(proName) {
              let sum = 0;
              for (let index = 0; index < this._arr.length; index++) {
                  const element = this._arr[index];
                  if (element.complete && element[proName]) {
                      sum += element[proName];
                  }
              }
              return sum;
          }
          _sumProByAll(proName) {
              let sum = 0;
              for (let index = 0; index < this._arr.length; index++) {
                  const element = this._arr[index];
                  if (element[proName]) {
                      sum += element[proName];
                  }
              }
              return sum;
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
          _getFirstObjByPro(proName, value) {
              for (const key in this._arr) {
                  if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
                      const element = this._arr[key];
                      if (element[proName] === value) {
                          return element;
                      }
                  }
              }
          }
          _getObjByName(name) {
              for (const key in this._arr) {
                  if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
                      const element = this._arr[key];
                      if (element.name == name) {
                          return element;
                      }
                  }
              }
          }
          _getFirstObjByLevel(level) {
              for (const key in this._arr) {
                  if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
                      const element = this._arr[key];
                      if (element.level == level) {
                          return element;
                      }
                  }
              }
          }
          _getObjArrByLevel(level) {
              const arr = [];
              for (const key in this._arr) {
                  if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
                      const element = this._arr[key];
                      if (element.level == level) {
                          arr.push(element);
                      }
                  }
              }
              return arr;
          }
          _getObjBySerial(serial) {
              for (const key in this._arr) {
                  if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
                      const element = this._arr[key];
                      if (element.serial === serial) {
                          return element;
                      }
                  }
              }
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
          _setCompleteByName(name) {
              this._setProperty(name, this._property.complete, true);
              this._refreshAndStorage();
          }
          _setCompleteByProName(proName, value) {
              for (let index = 0; index < this._arr.length; index++) {
                  const element = this._arr[index];
                  if (element[proName] && element[proName] === value) {
                      element[this._property.complete] = true;
                      break;
                  }
              }
              this._refreshAndStorage();
          }
          _setOtherCompleteName(name) {
              this._setProperty(name, this._property.otherComplete, true);
              this._refreshAndStorage();
          }
          _setAllCompleteDelay(delay, eachFrontFunc, eachEndFunc, comFunc) {
              for (let index = 0; index < this._arr.length; index++) {
                  LwgTimer.once(delay * index, this, () => {
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
                  LwgTimer.once(delay * index, this, () => {
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
                  let any = LwgTools._Array.randomGetOne(arr);
                  return any;
              }
          }
          _randomOneObj() {
              const index = LwgTools.Num.randomOneBySection(0, this._arr.length - 1, true);
              return this._arr[index];
          }
          _randomCountObj(count) {
              const indexArr = LwgTools.Num.randomCountBySection(0, this._arr.length - 1, count, true);
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
          _getArrByCompelet() {
              let arr = [];
              for (const key in this._arr) {
                  if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
                      const element = this._arr[key];
                      if (element[this._property.complete]) {
                          arr.push(element);
                      }
                  }
              }
              return arr;
          }
          _getArrByNoCompelet() {
              let arr = [];
              for (const key in this._arr) {
                  if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
                      const element = this._arr[key];
                      if (!element[this._property.complete]) {
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
          _eachArr(func) {
              for (let index = 0; index < this._arr.length; index++) {
                  const element = this._arr[index];
                  func && func(element);
              }
          }
          _eachArrByCompelet(func) {
              for (let index = 0; index < this._arr.length; index++) {
                  const element = this._arr[index];
                  func && func(element);
              }
          }
          _eachArrByNoCompelet(func) {
              for (let index = 0; index < this._arr.length; index++) {
                  const element = this._arr[index];
                  if (!element.complete) {
                      func && func(element);
                  }
              }
          }
          get _pitchClassify() {
              this._setAllOtherCompleteDelay;
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
          _addObj(obj) {
              let _obj = LwgTools.ObjArray.objCopy(obj);
              for (let index = 0; index < this._arr.length; index++) {
                  const element = this._arr[index];
                  if (element.name === _obj.name) {
                      this._arr[index] == _obj;
                  }
              }
              this._refreshAndStorage();
          }
          _addObjArr(objArr) {
              const _objArr = LwgTools.ObjArray.arrCopy(objArr);
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
          _deleteListObjByName(name) {
              for (let index = 0; index < this._arr.length; index++) {
                  const element = this._arr[index];
                  if (element.name === name) {
                      this._List.deleteItem(index);
                  }
              }
              this._refreshAndStorage();
          }
          _deleteListObjByPro(pro, value) {
              for (let index = 0; index < this._arr.length; index++) {
                  const element = this._arr[index];
                  if (element[pro] && element[pro] === value) {
                      this._List.deleteItem(index);
                  }
              }
              this._refreshAndStorage();
          }
          _sortByProperty(pro, indexPro, inverted) {
              LwgTools.ObjArray.sortByProperty(this._arr, pro);
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
      LwgData.Table = Table;
      function compare(tableArr, storageName) {
          try {
              Laya.LocalStorage.getJSON(storageName);
          }
          catch (error) {
              Laya.LocalStorage.setJSON(storageName, JSON.stringify(tableArr));
              return tableArr;
          }
          let storageArr;
          if (Laya.LocalStorage.getJSON(storageName)) {
              storageArr = JSON.parse(Laya.LocalStorage.getJSON(storageName));
              if (!tableArr || !storageArr) {
                  return storageArr;
              }
          }
          else {
              storageArr = tableArr;
          }
          Laya.LocalStorage.setJSON(storageName, JSON.stringify(storageArr));
          return storageArr;
      }
      function compareAdd(tableArr, storageName, propertyName) {
          try {
              Laya.LocalStorage.getJSON(storageName);
          }
          catch (error) {
              Laya.LocalStorage.setJSON(storageName, JSON.stringify(tableArr));
              return tableArr;
          }
          let storageArr;
          if (Laya.LocalStorage.getJSON(storageName)) {
              storageArr = JSON.parse(Laya.LocalStorage.getJSON(storageName));
              if (!tableArr || !storageArr) {
                  return storageArr;
              }
              let diffArray = LwgTools.ObjArray.diffProByTwo(tableArr, storageArr, propertyName);
              console.log(`${storageName}新添加对象`, diffArray);
              LwgTools._Array.addToarray(storageArr, diffArray);
          }
          else {
              storageArr = tableArr;
          }
          Laya.LocalStorage.setJSON(storageName, JSON.stringify(storageArr));
          return storageArr;
      }
      function jsonCompare(url, storageName, propertyName) {
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
                      let diffArray = LwgTools.ObjArray.diffProByTwo(dataArr_0, dataArr, propertyName);
                      console.log('两个数据的差值为：', diffArray);
                      LwgTools._Array.addToarray(dataArr, diffArray);
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
  })(LwgData || (LwgData = {}));
  var LwgColor;
  (function (LwgColor) {
      function RGBToHexString(r, g, b) {
          return '#' + ("00000" + (r << 16 | g << 8 | b).toString(16)).slice(-6);
      }
      LwgColor.RGBToHexString = RGBToHexString;
      function hexStringToRGB(str) {
          let r, g, b;
          r = (0xff << 16 & str) >> 16;
          g = (0xff << 8 & str) >> 8;
          b = 0xff & str;
          return [r, g, b];
      }
      LwgColor.hexStringToRGB = hexStringToRGB;
      function colour(node, RGBA, vanishtime) {
          let cf = new Laya.ColorFilter();
          node.blendMode = 'null';
          if (!RGBA) {
              cf.color(LwgTools.Num.randomOneBySection(255, 100, true), LwgTools.Num.randomOneBySection(255, 100, true), LwgTools.Num.randomOneBySection(255, 100, true), 1);
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
      LwgColor.colour = colour;
      function changeOnce(node, RGBA, time, func) {
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
          LwgTimer.frameLoop(1, caller, () => {
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
      LwgColor.changeOnce = changeOnce;
      function changeConstant(node, RGBA1, RGBA2, frameTime) {
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
          let RGBA = [LwgTools.Num.randomCountBySection(RGBA1[0], RGBA2[0])[0], LwgTools.Num.randomCountBySection(RGBA1[1], RGBA2[1])[0], LwgTools.Num.randomCountBySection(RGBA1[2], RGBA2[2])[0], LwgTools.Num.randomCountBySection(RGBA1[3] ? RGBA1[3] : 1, RGBA2[3] ? RGBA2[3] : 1)[0]];
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
          LwgTimer.frameLoop(1, changeCaller, () => {
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
      LwgColor.changeConstant = changeConstant;
  })(LwgColor || (LwgColor = {}));
  var LwgEff3D;
  (function (LwgEff3D) {
      LwgEff3D.tex2D = {
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
      let Particle;
      (function (Particle) {
          class Caller {
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
                  LwgTimer.frameLoop(1, this, () => {
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
              boxInit(parent, position, sectionSize, sectionRotation, texArr, colorRGBA) {
                  const scaleX = sectionSize ? LwgTools.Num.randomOneBySection(sectionSize[0][0], sectionSize[1][0]) : LwgTools.Num.randomOneBySection(0.06, 0.08);
                  const scaleY = sectionSize ? LwgTools.Num.randomOneBySection(sectionSize[0][1], sectionSize[1][1]) : LwgTools.Num.randomOneBySection(0.06, 0.08);
                  const scaleZ = sectionSize ? LwgTools.Num.randomOneBySection(sectionSize[0][2], sectionSize[1][2]) : LwgTools.Num.randomOneBySection(0.06, 0.08);
                  this.box = parent.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(scaleX, scaleY, scaleZ)));
                  if (position) {
                      this.box.transform.position = new Laya.Vector3(position[0], position[1], position[2]);
                  }
                  else {
                      this.box.transform.position = new Laya.Vector3(0, 0, 0);
                  }
                  this.fPosition = new Laya.Vector3(this.box.transform.position.x, this.box.transform.position.y, this.box.transform.position.z);
                  this.box.transform.localRotationEulerX = sectionRotation ? LwgTools.Num.randomOneBySection(sectionRotation[0][0], sectionRotation[1][0]) : LwgTools.Num.randomOneBySection(0, 360);
                  this.box.transform.localRotationEulerX = sectionRotation ? LwgTools.Num.randomOneBySection(sectionRotation[0][1], sectionRotation[1][1]) : LwgTools.Num.randomOneBySection(0, 360);
                  this.box.transform.localRotationEulerX = sectionRotation ? LwgTools.Num.randomOneBySection(sectionRotation[0][2], sectionRotation[1][2]) : LwgTools.Num.randomOneBySection(0, 360);
                  this.fEuler = new Laya.Vector3(this.box.transform.localRotationEulerX, this.box.transform.localRotationEulerY, this.box.transform.localRotationEulerZ);
                  const mat = this.box.meshRenderer.material = new Laya.BlinnPhongMaterial();
                  mat.albedoTexture = texArr ? LwgTools._Array.randomGetOne(texArr) : LwgEff3D.tex2D.圆形发光.texture2D;
                  mat.renderMode = 2;
                  const R = colorRGBA ? LwgTools.Num.randomOneBySection(colorRGBA[0][0], colorRGBA[1][0]) : LwgTools.Num.randomOneBySection(10, 25);
                  const G = colorRGBA ? LwgTools.Num.randomOneBySection(colorRGBA[0][1], colorRGBA[1][1]) : LwgTools.Num.randomOneBySection(5, 15);
                  const B = colorRGBA ? LwgTools.Num.randomOneBySection(colorRGBA[0][2], colorRGBA[1][2]) : LwgTools.Num.randomOneBySection(5, 10);
                  const A = colorRGBA ? LwgTools.Num.randomOneBySection(colorRGBA[0][3], colorRGBA[1][3]) : LwgTools.Num.randomOneBySection(1, 1);
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
              positionByARY(angleSpeed, radius, speedY, distance, stateSwitch) {
                  const pXZ = LwgTools.Point.getRoundPosOld(this._positionByARY_FA += angleSpeed, radius, new Laya.Point(this.fPosition.x, this.fPosition.z));
                  this.box.transform.position = new Laya.Vector3(pXZ.x, this.box.transform.position.y += speedY, pXZ.y);
                  if (this.box.transform.position.y - this.fPosition.y > distance) {
                      stateSwitch && stateSwitch();
                  }
              }
              positionARXY_R(angle, speedR, distance, stateSwitch) {
                  this._positionARXY_FR += speedR;
                  const point = LwgTools.Point.getRoundPosOld(angle, this._positionARXY_FR, new Laya.Point(0, 0));
                  this.box.transform.position = new Laya.Vector3(this.fPosition.x + point.x, this.fPosition.y + point.y, this.fPosition.z);
                  if (this._positionARXY_FR >= distance) {
                      stateSwitch && stateSwitch();
                  }
              }
              fadeAway(albedoColorASpeed, endNum = 0, stateSwitch) {
                  this.mat.albedoColorA -= albedoColorASpeed;
                  if (this.mat.albedoColorA <= endNum) {
                      this.mat.albedoColorA = endNum;
                      stateSwitch && stateSwitch();
                  }
              }
              fadeIn(albedoColorASpeed, endNum = 1, stateSwitch) {
                  this.mat.albedoColorA += albedoColorASpeed;
                  if (this.mat.albedoColorA >= endNum) {
                      this.mat.albedoColorA = endNum;
                      stateSwitch && stateSwitch();
                  }
              }
              positionByTime(posSpeed, time, stateSwitch) {
                  this._positionByTimeRecord++;
                  this.box.transform.position = new Laya.Vector3(this.box.transform.position.x += posSpeed[0], this.box.transform.position.y += posSpeed[1], this.box.transform.position.z += posSpeed[2]);
                  if (time && this._positionByTimeRecord > time) {
                      stateSwitch && stateSwitch();
                  }
              }
              scaleX(scaleSpeedX, endNum, stateSwitch) {
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
              scaleY(scaleSpeedY, endNum, stateSwitch) {
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
              scaleZ(scaleSpeedZ, endNum, stateSwitch) {
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
              rotateX(rotateSpeedX, endNum, stateSwitch) {
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
              rotateY(rotateSpeedY, endNum, stateSwitch) {
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
              rotateZ(rotateSpeedZ, endNum, stateSwitch) {
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
              randomScopeByPosition(scopeSize) {
                  scopeSize = scopeSize ? scopeSize : [[0.1, 0.1, 0.1], [0.3, 0.3, 0.3]];
                  LwgTools.D3.randomScopeByPosition(this.box, scopeSize);
              }
              excludeZ() {
                  this.box.transform.localScaleZ = 0;
              }
              rotateTheZero() {
                  this.box.transform.localRotationEulerZ = 0;
                  this.box.transform.localRotationEulerX = 0;
                  this.box.transform.localRotationEulerY = 0;
              }
              scaleTheZero() {
                  this.box.transform.localRotationEulerZ = 0;
                  this.box.transform.localRotationEulerX = 0;
                  this.box.transform.localRotationEulerY = 0;
              }
          }
          Particle.Caller = Caller;
          function spiral(parent, position, sectionSize, sectionRotation, texArr, colorRGBA, distance, speedY, angleSpeed, radius) {
              const caller = new Caller();
              caller.boxInit(parent, position, sectionSize, sectionRotation, texArr, colorRGBA);
              caller.excludeZ();
              caller.rotateTheZero();
              const _distance = LwgTools.Num.randomNumerical(distance, [1.5, 1.5]);
              const _speedY = LwgTools.Num.randomNumerical(speedY, [0.02, 0.02]);
              const _angleSpeed = LwgTools.Num.randomNumerical(angleSpeed, [6, 6]);
              const _radius = LwgTools.Num.randomNumerical(radius, [0.5, 0.5]);
              caller.mat.albedoColorA = 0;
              caller.stateSwitch('m');
              caller.moveFunc = () => {
                  caller.fadeIn(0.2);
                  caller.positionByARY(_angleSpeed, _radius, _speedY, _distance, () => {
                      caller.stateSwitch('v');
                  });
              };
              caller.vinishFunc = () => {
                  caller.fadeAway(0.15, 0, () => {
                      caller.stateSwitch('e');
                  });
                  caller.positionByTime([0, 0.002, 0]);
              };
              return caller;
          }
          Particle.spiral = spiral;
          function explode(parent, position, sectionSize, sectionRotation, texArr, colorRGBA, distance, speedR) {
              const caller = new Caller();
              caller.boxInit(parent, position, sectionSize, sectionRotation, texArr, colorRGBA);
              caller.excludeZ();
              caller.rotateTheZero();
              const _distance = LwgTools.Num.randomNumerical(distance, [0.3, 0.6]);
              const _speedR = LwgTools.Num.randomNumerical(speedR, [0.008, 0.012]);
              const _angle = LwgTools.Num.randomNumerical([0, 360]);
              caller.mat.albedoColorA = 0;
              caller.stateSwitch('m');
              caller.moveFunc = () => {
                  caller.fadeIn(0.15);
                  caller.positionARXY_R(_angle, _speedR, _distance, () => {
                      caller.stateSwitch('v');
                  });
              };
              caller.vinishFunc = () => {
                  caller.fadeAway(0.15, 0, () => {
                      caller.stateSwitch('e');
                  });
              };
              return;
          }
          Particle.explode = explode;
          function fade(parent, position, sectionSize, staytime, vainshASpeed, vainshSSpeed, sectionRotation, texArr, colorRGBA) {
              const caller = new Caller();
              caller.boxInit(parent, position, sectionSize ? sectionSize : [[0.04, 0.04, 0], [0.04, 0.04, 0]], sectionRotation, texArr, colorRGBA);
              caller.excludeZ();
              const _staytime = staytime ? staytime : 20;
              const _vainshASpeed = vainshASpeed ? vainshASpeed : 0.02;
              const _vainshSSpeed = vainshSSpeed ? vainshSSpeed : 0.02;
              caller.rotateTheZero();
              caller.stateSwitch('m');
              caller.moveFunc = () => {
                  if (caller.time > _staytime) {
                      caller.stateSwitch('v');
                  }
              };
              caller.vinishFunc = () => {
                  caller.scaleX(_vainshSSpeed);
                  caller.fadeAway(_vainshASpeed, 0, () => {
                      caller.stateSwitch('e');
                  });
              };
              caller.everyFrameFunc = () => {
                  caller.box.transform.localScaleY = caller.box.transform.localScaleX;
              };
              return caller;
          }
          Particle.fade = fade;
          function starsShine(parent, position, scopeSize, scaleSpeed, maxScale, angelspeed, ASpeed, texArr, colorRGBA) {
              const caller = new Caller();
              caller.boxInit(parent, position, null, null, texArr ? texArr : [LwgEff3D.tex2D.星星5.texture2D], colorRGBA ? colorRGBA : [[15, 15, 15, 1], [30, 30, 30, 1]]);
              caller.excludeZ();
              caller.rotateTheZero();
              caller.scaleTheZero();
              caller.randomScopeByPosition(scopeSize);
              caller.mat.albedoColorA = 0;
              const _maxScale = LwgTools.Num.randomNumerical(maxScale, [1, 2]);
              const _scaleSpeed = LwgTools.Num.randomNumerical(scaleSpeed, [0.01, 0.05]);
              const _angelspeed = LwgTools.Num.randomNumerical(angelspeed, [2, 6], true);
              const _ASpeed = LwgTools.Num.randomNumerical(ASpeed, [0.01, 0.05]);
              caller.appearFunc = () => {
                  caller.fadeIn(_ASpeed, 1, () => {
                      caller.stateSwitch('m');
                  });
                  caller.scaleX(_scaleSpeed, 1);
                  caller.rotateZ(_angelspeed);
              };
              caller.moveFunc = () => {
                  caller.scaleX(_scaleSpeed, _maxScale, () => {
                      caller.stateSwitch('v');
                  });
                  caller.rotateZ(_angelspeed);
              };
              caller.vinishFunc = () => {
                  caller.fadeAway(_ASpeed, 0, () => {
                      caller.stateSwitch('e');
                  });
                  caller.scaleX(-_scaleSpeed);
                  caller.rotateZ(-_angelspeed);
              };
              caller.everyFrameFunc = () => {
                  caller.box.transform.localScaleY = caller.box.transform.localScaleX;
              };
              return caller;
          }
          Particle.starsShine = starsShine;
      })(Particle = LwgEff3D.Particle || (LwgEff3D.Particle = {}));
  })(LwgEff3D || (LwgEff3D = {}));
  var LwgEff2D;
  (function (LwgEff2D) {
      let SkinUrl;
      (function (SkinUrl) {
          SkinUrl["\u7231\u5FC31"] = "Lwg/Effects/aixin1.png";
          SkinUrl["\u7231\u5FC32"] = "Lwg/Effects/aixin2.png";
          SkinUrl["\u7231\u5FC33"] = "Lwg/Effects/aixin3.png";
          SkinUrl["\u82B11"] = "Lwg/Effects/hua1.png";
          SkinUrl["\u82B12"] = "Lwg/Effects/hua2.png";
          SkinUrl["\u82B13"] = "Lwg/Effects/hua3.png";
          SkinUrl["\u82B14"] = "Lwg/Effects/hua4.png";
          SkinUrl["\u661F\u661F1"] = "Lwg/Effects/star1.png";
          SkinUrl["\u661F\u661F2"] = "Lwg/Effects/star2.png";
          SkinUrl["\u661F\u661F3"] = "Lwg/Effects/star3.png";
          SkinUrl["\u661F\u661F4"] = "Lwg/Effects/star4.png";
          SkinUrl["\u661F\u661F5"] = "Lwg/Effects/star5.png";
          SkinUrl["\u661F\u661F6"] = "Lwg/Effects/star6.png";
          SkinUrl["\u661F\u661F7"] = "Lwg/Effects/star7.png";
          SkinUrl["\u661F\u661F8"] = "Lwg/Effects/star8.png";
          SkinUrl["\u83F1\u5F621"] = "Lwg/Effects/rhombus1.png";
          SkinUrl["\u83F1\u5F622"] = "Lwg/Effects/rhombus1.png";
          SkinUrl["\u83F1\u5F623"] = "Lwg/Effects/rhombus1.png";
          SkinUrl["\u77E9\u5F621"] = "Lwg/Effects/rectangle1.png";
          SkinUrl["\u77E9\u5F622"] = "Lwg/Effects/rectangle2.png";
          SkinUrl["\u77E9\u5F623"] = "Lwg/Effects/rectangle3.png";
          SkinUrl["\u96EA\u82B11"] = "Lwg/Effects/xuehua1.png";
          SkinUrl["\u53F6\u5B501"] = "Lwg/Effects/yezi1.png";
          SkinUrl["\u5706\u5F62\u53D1\u51491"] = "Lwg/Effects/yuanfaguang.png";
          SkinUrl["\u5706\u5F621"] = "Lwg/Effects/yuan1.png";
          SkinUrl["\u65B9\u5F62\u5149\u57081"] = "Lwg/Effects/ui_square_guang1.png";
          SkinUrl["\u65B9\u5F62\u5706\u89D2\u5149\u57081"] = "Lwg/Effects/ui_square_guang2.png";
          SkinUrl["\u5706\u5F62\u5C0F\u5149\u73AF"] = "Lwg/Effects/xiaoguanghuan.png";
          SkinUrl["\u5149\u57082"] = "Lwg/Effects/guangquan2.png";
          SkinUrl["\u4E09\u89D2\u5F621"] = "Lwg/Effects/triangle1.png";
          SkinUrl["\u4E09\u89D2\u5F622"] = "Lwg/Effects/triangle2.png";
      })(SkinUrl = LwgEff2D.SkinUrl || (LwgEff2D.SkinUrl = {}));
      let Aperture;
      (function (Aperture) {
          class ApertureImage extends Laya.Image {
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
                  this.rotation = rotation ? LwgTools.Num.randomOneBySection(rotation[0], rotation[1]) : LwgTools.Num.randomOneBySection(360);
                  this.skin = urlArr ? LwgTools._Array.randomGetOne(urlArr) : SkinUrl.花3;
                  this.zOrder = zOrder ? zOrder : 0;
                  this.alpha = 0;
                  let RGBA = [null, null, null, null];
                  RGBA[0] = colorRGBA ? LwgTools.Num.randomOneBySection(colorRGBA[0][0], colorRGBA[1][0]) : LwgTools.Num.randomOneBySection(180, 255);
                  RGBA[1] = colorRGBA ? LwgTools.Num.randomOneBySection(colorRGBA[0][1], colorRGBA[1][1]) : LwgTools.Num.randomOneBySection(10, 180);
                  RGBA[2] = colorRGBA ? LwgTools.Num.randomOneBySection(colorRGBA[0][2], colorRGBA[1][2]) : LwgTools.Num.randomOneBySection(10, 180);
                  RGBA[3] = colorRGBA ? LwgTools.Num.randomOneBySection(colorRGBA[0][3], colorRGBA[1][3]) : LwgTools.Num.randomOneBySection(1, 1);
                  LwgColor.colour(this, RGBA);
              }
          }
          Aperture.ApertureImage = ApertureImage;
          function continuous(parent, centerPoint, size, minScale, rotation, urlArr, colorRGBA, zOrder, maxScale, speed, accelerated) {
              const Img = new ApertureImage(parent, centerPoint, size, rotation, urlArr, colorRGBA, zOrder);
              let _speed = speed ? LwgTools.Num.randomOneBySection(speed[0], speed[1]) : 0.025;
              let _accelerated = accelerated ? LwgTools.Num.randomOneBySection(accelerated[0], accelerated[1]) : 0.0005;
              if (minScale) {
                  Img.scale(minScale[0], minScale[1]);
              }
              else {
                  Img.scale(0, 0);
              }
              const _maxScale = maxScale ? LwgTools.Num.randomOneBySection(maxScale[0], maxScale[1]) : 2;
              let moveCaller = {
                  alpha: true,
                  scale: false,
                  vanish: false
              };
              Img['moveCaller'] = moveCaller;
              let acc = 0;
              LwgTimer.frameLoop(1, moveCaller, () => {
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
          Aperture.continuous = continuous;
          function _continuousByDs(parent, centerPoint, size, minScale, rotation, urlArr, colorRGBA, zOrder, maxScale, speed, accelerated) {
              const Img = new ApertureImage(parent, centerPoint, size, rotation, urlArr, colorRGBA, zOrder);
              let _speed = speed ? LwgTools.Num.randomOneBySection(speed[0], speed[1]) : 0.025;
              let _accelerated = accelerated ? LwgTools.Num.randomOneBySection(accelerated[0], accelerated[1]) : 0.0005;
              if (minScale) {
                  Img.scale(minScale[0], minScale[1]);
              }
              else {
                  Img.scale(0, 0);
              }
              const _maxScale = maxScale ? LwgTools.Num.randomOneBySection(maxScale[0], maxScale[1]) : 2;
              let moveCaller = {
                  alpha: true,
                  scale: false,
                  vanish: false
              };
              Img['moveCaller'] = moveCaller;
              let acc = 0;
              LwgTimer.frameLoop(1, moveCaller, () => {
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
          Aperture._continuousByDs = _continuousByDs;
      })(Aperture = LwgEff2D.Aperture || (LwgEff2D.Aperture = {}));
      let Particle;
      (function (Particle) {
          class ImgBase extends Laya.Image {
              constructor(parent, centerPoint, sectionWH, width, height, rotation, urlArr, colorRGBA, zOrder) {
                  super();
                  parent.addChild(this);
                  let sectionWidth = sectionWH ? LwgTools.Num.randomOneBySection(sectionWH[0]) : LwgTools.Num.randomOneBySection(200);
                  let sectionHeight = sectionWH ? LwgTools.Num.randomOneBySection(sectionWH[1]) : LwgTools.Num.randomOneBySection(50);
                  sectionWidth = LwgTools.Num.randomOneHalf() == 0 ? sectionWidth : -sectionWidth;
                  sectionHeight = LwgTools.Num.randomOneHalf() == 0 ? sectionHeight : -sectionHeight;
                  this.x = centerPoint ? centerPoint.x + sectionWidth : sectionWidth;
                  this.y = centerPoint ? centerPoint.y + sectionHeight : sectionHeight;
                  this.width = width ? LwgTools.Num.randomOneBySection(width[0], width[1]) : LwgTools.Num.randomOneBySection(20, 50);
                  this.height = height ? LwgTools.Num.randomOneBySection(height[0], height[1]) : this.width;
                  this.pivotX = this.width / 2;
                  this.pivotY = this.height / 2;
                  this.skin = urlArr ? LwgTools._Array.randomGetOne(urlArr) : SkinUrl.圆形1;
                  this.rotation = rotation ? LwgTools.Num.randomOneBySection(rotation[0], rotation[1]) : 0;
                  this.alpha = 0;
                  this.zOrder = zOrder ? zOrder : 1000;
                  let RGBA = [null, null, null, null];
                  RGBA[0] = colorRGBA ? LwgTools.Num.randomOneBySection(colorRGBA[0][0], colorRGBA[1][0]) : LwgTools.Num.randomOneBySection(180, 255);
                  RGBA[1] = colorRGBA ? LwgTools.Num.randomOneBySection(colorRGBA[0][1], colorRGBA[1][1]) : LwgTools.Num.randomOneBySection(10, 180);
                  RGBA[2] = colorRGBA ? LwgTools.Num.randomOneBySection(colorRGBA[0][2], colorRGBA[1][2]) : LwgTools.Num.randomOneBySection(10, 180);
                  RGBA[3] = colorRGBA ? LwgTools.Num.randomOneBySection(colorRGBA[0][3], colorRGBA[1][3]) : LwgTools.Num.randomOneBySection(1, 1);
                  LwgColor.colour(this, RGBA);
              }
          }
          Particle.ImgBase = ImgBase;
          function snow(parent, centerPoint, sectionWH, width, height, rotation, urlArr, colorRGBA, zOrder, distance, rotationSpeed, speed, windX) {
              let Img = new ImgBase(parent, centerPoint, sectionWH, width, height, rotation, urlArr, colorRGBA, zOrder);
              let _rotationSpeed = rotationSpeed ? LwgTools.Num.randomOneBySection(rotationSpeed[0], rotationSpeed[1]) : LwgTools.Num.randomOneBySection(0, 1);
              _rotationSpeed = LwgTools.Num.randomOneHalf() == 0 ? _rotationSpeed : -_rotationSpeed;
              let speed0 = speed ? LwgTools.Num.randomOneBySection(speed[0], speed[1]) : LwgTools.Num.randomOneBySection(1, 2.5);
              let _windX = windX ? LwgTools.Num.randomOneBySection(windX[0], windX[1]) : 0;
              let moveCaller = {
                  alpha: true,
                  move: false,
                  vinish: false,
              };
              Img['moveCaller'] = moveCaller;
              let distance0 = 0;
              let distance1 = distance ? LwgTools.Num.randomOneBySection(distance[0], distance[1]) : LwgTools.Num.randomOneBySection(100, 300);
              LwgTimer.frameLoop(1, moveCaller, () => {
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
          Particle.snow = snow;
          function downwardSpray(parent, point, width, height, angle, urlArr, colorRGBA, vanishDistance, moveSpeed, gravity, accelerated, rotationSpeed, scaleRotationSpeed, skewSpeed, zOrder) {
              const Img = new ImgBase(parent, point, [0, 0], width, height, null, urlArr, colorRGBA, zOrder);
              const _angle = angle ? LwgTools.Num.randomOneBySection(angle[0], angle[1]) : LwgTools.Num.randomOneBySection(0, 90);
              const p = LwgTools.Point.angleByPoint(_angle);
              const _vanishDistance = vanishDistance ? LwgTools.Num.randomOneBySection(vanishDistance[0], vanishDistance[1]) : LwgTools.Num.randomOneBySection(200, 800);
              let _speed = moveSpeed ? LwgTools.Num.randomOneBySection(moveSpeed[0], moveSpeed[1]) : LwgTools.Num.randomOneBySection(10, 30);
              let accelerated0 = accelerated ? LwgTools.Num.randomOneBySection(accelerated[0], accelerated[1]) : LwgTools.Num.randomOneBySection(0.3, 1.5);
              const _gravity = gravity ? LwgTools.Num.randomOneBySection(gravity[0], gravity[1]) : LwgTools.Num.randomOneBySection(1, 5);
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
              LwgTimer.frameLoop(1, moveCaller, () => {
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
          Particle.downwardSpray = downwardSpray;
          function rotatingWay(Img, rotationSpeed, scaleRotationSpeed, skewSpeed) {
              let _rotationSpeed = rotationSpeed ? LwgTools.Num.randomOneBySection(rotationSpeed[0], rotationSpeed[1]) : LwgTools.Num.randomOneBySection(0, 1);
              _rotationSpeed = LwgTools.Num.randomOneHalf() == 0 ? _rotationSpeed : -_rotationSpeed;
              const _scaleSpeed = scaleRotationSpeed ? LwgTools.Num.randomOneBySection(scaleRotationSpeed[0], scaleRotationSpeed[1]) : LwgTools.Num.randomOneBySection(0, 0.25);
              const _scaleDir = LwgTools.Num.randomOneHalf();
              let _skewSpeed = skewSpeed ? LwgTools.Num.randomOneBySection(skewSpeed[0], skewSpeed[1]) : LwgTools.Num.randomOneBySection(1, 10);
              _skewSpeed = LwgTools.Num.randomOneHalf() === 1 ? _skewSpeed : -_skewSpeed;
              const _skewDir = LwgTools.Num.randomOneHalf();
              const _scaleOrSkew = LwgTools.Num.randomOneHalf();
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
          function fallingRotate(parent, centerPoint, sectionWH, width, height, urlArr, colorRGBA, distance, moveSpeed, scaleRotationSpeed, skewSpeed, rotationSpeed, zOrder) {
              const Img = new ImgBase(parent, centerPoint, sectionWH, width, height, null, urlArr, colorRGBA, zOrder);
              const _moveSpeed = moveSpeed ? LwgTools.Num.randomOneBySection(moveSpeed[0], moveSpeed[1]) : LwgTools.Num.randomOneBySection(1, 2.5);
              let _distance0 = 0;
              const _distance = distance ? LwgTools.Num.randomOneBySection(distance[0], distance[1]) : LwgTools.Num.randomOneBySection(100, 300);
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
              LwgTimer.frameLoop(1, moveCaller, () => {
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
          Particle.fallingRotate = fallingRotate;
          function fallingVertical(parent, centerPoint, sectionWH, width, height, rotation, urlArr, colorRGBA, zOrder, distance, speed, accelerated) {
              let Img = new ImgBase(parent, centerPoint, sectionWH, width, height, rotation, urlArr, colorRGBA, zOrder);
              let speed0 = speed ? LwgTools.Num.randomOneBySection(speed[0], speed[1]) : LwgTools.Num.randomOneBySection(4, 8);
              let accelerated0 = accelerated ? LwgTools.Num.randomOneBySection(accelerated[0], accelerated[1]) : LwgTools.Num.randomOneBySection(0.25, 0.45);
              let acc = 0;
              let moveCaller = {
                  alpha: true,
                  move: false,
                  vinish: false,
              };
              Img['moveCaller'] = moveCaller;
              let distance1 = distance ? LwgTools.Num.randomOneBySection(distance[0], distance[1]) : LwgTools.Num.randomOneBySection(100, 300);
              let fY = Img.y;
              LwgTimer.frameLoop(1, moveCaller, () => {
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
          Particle.fallingVertical = fallingVertical;
          function fallingVertical_Reverse(parent, centerPoint, sectionWH, width, height, rotation, urlArr, colorRGBA, zOrder, distance, speed, accelerated) {
              let Img = new ImgBase(parent, centerPoint, sectionWH, width, height, rotation, urlArr, colorRGBA, zOrder);
              let speed0 = speed ? LwgTools.Num.randomOneBySection(speed[0], speed[1]) : LwgTools.Num.randomOneBySection(4, 8);
              let accelerated0 = accelerated ? LwgTools.Num.randomOneBySection(accelerated[0], accelerated[1]) : LwgTools.Num.randomOneBySection(0.25, 0.45);
              let acc = 0;
              let moveCaller = {
                  alpha: true,
                  move: false,
                  vinish: false,
              };
              Img['moveCaller'] = moveCaller;
              let distance1 = distance ? LwgTools.Num.randomOneBySection(distance[0], distance[1]) : LwgTools.Num.randomOneBySection(100, 300);
              let fY = Img.y;
              LwgTimer.frameLoop(1, moveCaller, () => {
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
          Particle.fallingVertical_Reverse = fallingVertical_Reverse;
          function slowlyUp(parent, centerPoint, sectionWH, width, height, rotation, urlArr, colorRGBA, zOrder, distance, speed, accelerated) {
              let Img = new ImgBase(parent, centerPoint, sectionWH, width, height, rotation, urlArr, colorRGBA, zOrder);
              let speed0 = speed ? LwgTools.Num.randomOneBySection(speed[0], speed[1]) : LwgTools.Num.randomOneBySection(1.5, 2);
              let accelerated0 = accelerated ? LwgTools.Num.randomOneBySection(accelerated[0], accelerated[1]) : LwgTools.Num.randomOneBySection(0.001, 0.005);
              let acc = 0;
              let moveCaller = {
                  alpha: true,
                  move: false,
                  vinish: false,
              };
              Img['moveCaller'] = moveCaller;
              let fy = Img.y;
              let distance0 = 0;
              let distance1 = distance ? LwgTools.Num.randomOneBySection(distance[0], distance[1]) : LwgTools.Num.randomOneBySection(-250, -600);
              LwgTimer.frameLoop(1, moveCaller, () => {
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
          Particle.slowlyUp = slowlyUp;
          function sprayRound(parent, centerPoint, width, height, rotation, urlArr, colorRGBA, distance, time, moveAngle, rotationSpeed, zOrder) {
              let Img = new ImgBase(parent, centerPoint, [0, 0], width, height, rotation, urlArr, colorRGBA, zOrder);
              let centerPoint0 = centerPoint ? centerPoint : new Laya.Point(0, 0);
              let radius = 0;
              const _time = time ? LwgTools.Num.randomOneBySection(time[0], time[1]) : LwgTools.Num.randomOneBySection(30, 50);
              const _distance = distance ? LwgTools.Num.randomOneBySection(distance[0], distance[1]) : LwgTools.Num.randomOneBySection(100, 200);
              const _speed = _distance / _time;
              const _angle = moveAngle ? LwgTools.Num.randomOneBySection(moveAngle[0], moveAngle[1]) : LwgTools.Num.randomOneBySection(0, 360);
              let rotationSpeed0 = rotationSpeed ? LwgTools.Num.randomOneBySection(rotationSpeed[0], rotationSpeed[1]) : LwgTools.Num.randomOneBySection(0, 20);
              rotationSpeed0 = LwgTools.Num.randomOneHalf() == 0 ? rotationSpeed0 : -rotationSpeed0;
              const vinishTime = LwgTools.Num.randomOneInt(60);
              const subAlpha = 1 / vinishTime;
              let moveCaller = {
                  alpha: true,
                  move: false,
                  vinish: false,
              };
              Img['moveCaller'] = moveCaller;
              LwgTimer.frameLoop(1, moveCaller, () => {
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
                          let point = LwgTools.Point.getRoundPosOld(_angle, radius, centerPoint0);
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
                          let point = LwgTools.Point.getRoundPosOld(_angle, radius, centerPoint0);
                          Img.pos(point.x, point.y);
                      }
                  }
              });
              return Img;
          }
          Particle.sprayRound = sprayRound;
          function spray(parent, centerPoint, width, height, rotation, urlArr, colorRGBA, distance, moveAngle, rotationSpeed, speed, accelerated, zOrder) {
              let Img = new ImgBase(parent, centerPoint, [0, 0], width, height, rotation, urlArr, colorRGBA, zOrder);
              let centerPoint0 = centerPoint ? centerPoint : new Laya.Point(0, 0);
              let speed0 = speed ? LwgTools.Num.randomOneBySection(speed[0], speed[1]) : LwgTools.Num.randomOneBySection(3, 10);
              let accelerated0 = accelerated ? LwgTools.Num.randomOneBySection(accelerated[0], accelerated[1]) : LwgTools.Num.randomOneBySection(0.25, 0.45);
              let acc = 0;
              let moveCaller = {
                  alpha: true,
                  move: false,
                  vinish: false,
              };
              Img['moveCaller'] = moveCaller;
              let radius = 0;
              let distance1 = distance ? LwgTools.Num.randomOneBySection(distance[0], distance[1]) : LwgTools.Num.randomOneBySection(100, 200);
              let angle0 = moveAngle ? LwgTools.Num.randomOneBySection(moveAngle[0], moveAngle[1]) : LwgTools.Num.randomOneBySection(0, 360);
              let rotationSpeed0 = rotationSpeed ? LwgTools.Num.randomOneBySection(rotationSpeed[0], rotationSpeed[1]) : LwgTools.Num.randomOneBySection(0, 20);
              rotationSpeed0 = LwgTools.Num.randomOneHalf() == 0 ? rotationSpeed0 : -rotationSpeed0;
              LwgTimer.frameLoop(1, moveCaller, () => {
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
                      let point = LwgTools.Point.getRoundPosOld(angle0, radius, centerPoint0);
                      Img.pos(point.x, point.y);
                  }
              });
              return Img;
          }
          Particle.spray = spray;
          function outsideBox(parent, centerPoint, sectionWH, width, height, rotation, urlArr, colorRGBA, zOrder, curtailAngle, distance, rotateSpeed, speed, accelerated) {
              let Img = new ImgBase(parent, centerPoint, [0, 0], width, height, rotation, urlArr, colorRGBA, zOrder);
              let _angle = 0;
              sectionWH = sectionWH ? sectionWH : [100, 100];
              let fixedXY = LwgTools.Num.randomOneHalf() == 0 ? 'x' : 'y';
              curtailAngle = curtailAngle ? curtailAngle : 60;
              if (fixedXY == 'x') {
                  if (LwgTools.Num.randomOneHalf() == 0) {
                      Img.x += sectionWH[0];
                      _angle = LwgTools.Num.randomOneHalf() == 0 ? LwgTools.Num.randomOneBySection(0, 90 - curtailAngle) : LwgTools.Num.randomOneBySection(0, -90 + curtailAngle);
                  }
                  else {
                      Img.x -= sectionWH[0];
                      _angle = LwgTools.Num.randomOneBySection(90 + curtailAngle, 270 - curtailAngle);
                  }
                  Img.y += LwgTools.Num.randomOneBySection(-sectionWH[1], sectionWH[1]);
              }
              else {
                  if (LwgTools.Num.randomOneHalf() == 0) {
                      Img.y -= sectionWH[1];
                      _angle = LwgTools.Num.randomOneBySection(180 + curtailAngle, 360 - curtailAngle);
                  }
                  else {
                      Img.y += sectionWH[1];
                      _angle = LwgTools.Num.randomOneBySection(0 + curtailAngle, 180 - curtailAngle);
                  }
                  Img.x += LwgTools.Num.randomOneBySection(-sectionWH[0], sectionWH[0]);
              }
              let p = LwgTools.Point.angleByPoint(_angle);
              let _distance = distance ? LwgTools.Num.randomOneBySection(distance[0], distance[1]) : LwgTools.Num.randomOneBySection(20, 50);
              let speed0 = speed ? LwgTools.Num.randomOneBySection(speed[0], speed[1]) : LwgTools.Num.randomOneBySection(0.5, 1);
              let accelerated0 = accelerated ? LwgTools.Num.randomOneBySection(accelerated[0], accelerated[1]) : LwgTools.Num.randomOneBySection(0.25, 0.45);
              let acc = 0;
              let rotationSpeed0 = rotateSpeed ? LwgTools.Num.randomOneBySection(rotateSpeed[0], rotateSpeed[1]) : LwgTools.Num.randomOneBySection(0, 20);
              let firstP = new Laya.Point(Img.x, Img.y);
              let moveCaller = {
                  alpha: true,
                  move: false,
                  vinish: false,
              };
              Img['moveCaller'] = moveCaller;
              LwgTimer.frameLoop(1, moveCaller, () => {
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
          Particle.outsideBox = outsideBox;
          function moveToTargetToMove(parent, centerPoint, width, height, rotation, angle, urlArr, colorRGBA, zOrder, distance1, distance2, rotationSpeed, speed, accelerated) {
              let Img = new ImgBase(parent, centerPoint, [0, 0], width, height, rotation, urlArr, colorRGBA, zOrder);
              let centerPoint0 = centerPoint ? centerPoint : new Laya.Point(0, 0);
              let speed0 = speed ? LwgTools.Num.randomOneBySection(speed[0], speed[1]) : LwgTools.Num.randomOneBySection(5, 6);
              let accelerated0 = accelerated ? LwgTools.Num.randomOneBySection(accelerated[0], accelerated[1]) : LwgTools.Num.randomOneBySection(0.25, 0.45);
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
              let dis1 = distance1 ? LwgTools.Num.randomOneBySection(distance1[0], distance1[1]) : LwgTools.Num.randomOneBySection(100, 200);
              let dis2 = distance2 ? LwgTools.Num.randomOneBySection(distance2[0], distance2[1]) : LwgTools.Num.randomOneBySection(100, 200);
              let angle0 = angle ? LwgTools.Num.randomOneBySection(angle[0], angle[1]) : LwgTools.Num.randomOneBySection(0, 360);
              Img.rotation = angle0 - 90;
              let rotationSpeed0 = rotationSpeed ? LwgTools.Num.randomOneBySection(rotationSpeed[0], rotationSpeed[1]) : LwgTools.Num.randomOneBySection(0, 20);
              LwgTimer.frameLoop(1, moveCaller, () => {
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
                  let point = LwgTools.Point.getRoundPosOld(angle0, radius, centerPoint0);
                  Img.pos(point.x, point.y);
              });
              return Img;
          }
          Particle.moveToTargetToMove = moveToTargetToMove;
          function annularInhalation(parent, centerPoint, radius, rotation, width, height, urlArr, speed, accelerated, zOrder) {
              let Img = new Laya.Image();
              parent.addChild(Img);
              width = width ? width : [25, 50];
              Img.width = LwgTools.Num.randomCountBySection(width[0], width[1])[0];
              Img.height = height ? LwgTools.Num.randomCountBySection(height[0], height[1])[0] : Img.width;
              Img.pivotX = Img.width / 2;
              Img.pivotY = Img.height / 2;
              Img.skin = urlArr ? LwgTools._Array.randomGetOut(urlArr)[0] : SkinUrl[LwgTools.Num.randomCountBySection(0, 12)[0]];
              let radius0 = LwgTools.Num.randomCountBySection(radius[0], radius[1])[0];
              Img.alpha = 0;
              let speed0 = speed ? LwgTools.Num.randomCountBySection(speed[0], speed[1])[0] : LwgTools.Num.randomCountBySection(5, 10)[0];
              let angle = rotation ? LwgTools.Num.randomCountBySection(rotation[0], rotation[1])[0] : LwgTools.Num.randomCountBySection(0, 360)[0];
              let caller = {};
              let acc = 0;
              accelerated = accelerated ? accelerated : 0.35;
              LwgTimer.frameLoop(1, caller, () => {
                  if (Img.alpha < 1) {
                      Img.alpha += 0.05;
                      acc += (accelerated / 5);
                      radius0 -= (speed0 / 2 + acc);
                  }
                  else {
                      acc += accelerated;
                      radius0 -= (speed0 + acc);
                  }
                  let point = LwgTools.Point.getRoundPosOld(angle, radius0, centerPoint);
                  Img.pos(point.x, point.y);
                  if (point.distance(centerPoint.x, centerPoint.y) <= 20 || point.distance(centerPoint.x, centerPoint.y) >= 1000) {
                      Img.removeSelf();
                      Laya.timer.clearAll(caller);
                  }
              });
              return Img;
          }
          Particle.annularInhalation = annularInhalation;
      })(Particle = LwgEff2D.Particle || (LwgEff2D.Particle = {}));
      let Glitter;
      (function (Glitter) {
          class GlitterImage extends Laya.Image {
              constructor(parent, centerPos, radiusXY, urlArr, colorRGBA, width, height, zOder) {
                  super();
                  if (!parent.parent) {
                      return;
                  }
                  parent.addChild(this);
                  this.skin = urlArr ? LwgTools._Array.randomGetOne(urlArr) : SkinUrl.星星1;
                  this.width = width ? LwgTools.Num.randomOneBySection(width[0], width[1]) : 80;
                  this.height = height ? LwgTools.Num.randomOneBySection(height[0], height[1]) : this.width;
                  this.pivotX = this.width / 2;
                  this.pivotY = this.height / 2;
                  let p = radiusXY ? LwgTools.Point.randomPointByCenter(centerPos, radiusXY[0], radiusXY[1], 1) : LwgTools.Point.randomPointByCenter(centerPos, 100, 100, 1);
                  this.pos(p[0].x, p[0].y);
                  const RGBA = [null, null, null, null];
                  RGBA[0] = colorRGBA ? LwgTools.Num.randomOneBySection(colorRGBA[0][0], colorRGBA[1][0]) : LwgTools.Num.randomOneBySection(10, 255);
                  RGBA[1] = colorRGBA ? LwgTools.Num.randomOneBySection(colorRGBA[0][1], colorRGBA[1][1]) : LwgTools.Num.randomOneBySection(200, 255);
                  RGBA[2] = colorRGBA ? LwgTools.Num.randomOneBySection(colorRGBA[0][2], colorRGBA[1][2]) : LwgTools.Num.randomOneBySection(10, 255);
                  RGBA[3] = colorRGBA ? LwgTools.Num.randomOneBySection(colorRGBA[0][3], colorRGBA[1][3]) : LwgTools.Num.randomOneBySection(1, 1);
                  LwgColor.colour(this, RGBA);
                  this.alpha = 0;
                  this.zOrder = zOder ? zOder : 1000;
              }
          }
          Glitter.GlitterImage = GlitterImage;
          function blinkStar(parent, centerPos, radiusXY, urlArr, colorRGBA, width, height, scale, speed, rotateSpeed, zOder) {
              let Img = new GlitterImage(parent, centerPos, radiusXY, urlArr, colorRGBA, width, height, zOder);
              Img.scaleX = 0;
              Img.scaleY = 0;
              let _scale = scale ? LwgTools.Num.randomOneBySection(scale[0], scale[1]) : LwgTools.Num.randomOneBySection(0.8, 1.2);
              let _speed = speed ? LwgTools.Num.randomOneBySection(speed[0], speed[1]) : LwgTools.Num.randomOneBySection(0.01, 0.02);
              let _rotateSpeed = rotateSpeed ? LwgTools.Num.randomOneInt(rotateSpeed[0], rotateSpeed[1]) : LwgTools.Num.randomOneInt(0, 5);
              _rotateSpeed = LwgTools.Num.randomOneHalf() == 0 ? -_rotateSpeed : _rotateSpeed;
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
          Glitter.blinkStar = blinkStar;
          function simpleInfinite(parent, x, y, width, height, zOrder, url, speed) {
              let Img = new Laya.Image();
              parent.addChild(Img);
              Img.width = width;
              Img.height = height;
              Img.pos(x, y);
              Img.skin = url ? url : SkinUrl.方形光圈1;
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
          Glitter.simpleInfinite = simpleInfinite;
      })(Glitter = LwgEff2D.Glitter || (LwgEff2D.Glitter = {}));
      let Circulation;
      (function (Circulation) {
          class ImageBase extends Laya.Image {
              constructor(parent, urlArr, colorRGBA, width, height, zOrder) {
                  super();
                  parent.addChild(this);
                  this.skin = urlArr ? LwgTools._Array.randomGetOne(urlArr) : SkinUrl.圆形发光1;
                  this.width = width ? LwgTools.Num.randomOneBySection(width[0], width[1]) : 80;
                  this.height = height ? LwgTools.Num.randomOneBySection(height[0], height[1]) : this.width;
                  this.pivotX = this.width / 2;
                  this.pivotY = this.height / 2;
                  const RGBA = [null, null, null, null];
                  RGBA[0] = colorRGBA ? LwgTools.Num.randomOneBySection(colorRGBA[0][0], colorRGBA[1][0]) : LwgTools.Num.randomOneBySection(0, 255);
                  RGBA[1] = colorRGBA ? LwgTools.Num.randomOneBySection(colorRGBA[0][1], colorRGBA[1][1]) : LwgTools.Num.randomOneBySection(0, 255);
                  RGBA[2] = colorRGBA ? LwgTools.Num.randomOneBySection(colorRGBA[0][2], colorRGBA[1][2]) : LwgTools.Num.randomOneBySection(0, 255);
                  RGBA[3] = colorRGBA ? LwgTools.Num.randomOneBySection(colorRGBA[0][3], colorRGBA[1][3]) : LwgTools.Num.randomOneBySection(0, 255);
                  LwgColor.colour(this, RGBA);
                  this.zOrder = zOrder ? zOrder : 0;
                  this.alpha = 0;
                  this.scaleX = 0;
                  this.scaleY = 0;
              }
          }
          Circulation.ImageBase = ImageBase;
          function corner(parent, posArray, urlArr, colorRGBA, width, height, zOrder, parallel, speed) {
              if (posArray.length <= 1) {
                  return;
              }
              let Img = new ImageBase(parent, urlArr, colorRGBA, width, height, zOrder);
              let Imgfootprint = new ImageBase(parent, urlArr, colorRGBA, width, height, zOrder);
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
              LwgTimer.frameLoop(1, moveCaller, () => {
                  let Imgfootprint = new ImageBase(parent, urlArr, colorRGBA, width, height, zOrder);
                  Imgfootprint.filters = Img.filters;
                  Imgfootprint.x = Img.x;
                  Imgfootprint.y = Img.y;
                  Imgfootprint.rotation = Img.rotation;
                  Imgfootprint.alpha = 1;
                  Imgfootprint.zOrder = -1;
                  Imgfootprint.scaleX = Img.scaleX;
                  Imgfootprint.scaleY = Img.scaleY;
                  LwgAni2D.fadeOut(Imgfootprint, 1, 0, 200, 0, () => {
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
                      Img.rotation = LwgTools.Point.pointByAngleOld(Img.x - targetXY[0], Img.y - targetXY[1]) + 180;
                  }
                  let time = speed * 100 + distance / 5;
                  if (index == posArray.length + 1) {
                      targetXY = [posArray[0][0], posArray[0][1]];
                  }
                  LwgAni2D.move(Img, targetXY[0], targetXY[1], time, () => {
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
          Circulation.corner = corner;
      })(Circulation = LwgEff2D.Circulation || (LwgEff2D.Circulation = {}));
  })(LwgEff2D || (LwgEff2D = {}));
  var LwgClick;
  (function (LwgClick) {
      LwgClick.absolute = true;
      LwgClick.filterType = {
          all: 'all',
          none: 'none',
          stage: 'stage',
          button: 'button',
          someBtnIncludeStage: 'someBtnIncludeStage',
          someBtnExcludeStage: 'someBtnExcludeStage',
      };
      LwgClick.filter = {
          get value() {
              return this['LwgClick/filter'] ? this['LwgClick/filter'] : LwgClick.filterType.all;
          },
          set value(val) {
              this['LwgClick/filter'] = val;
              switch (val) {
                  case LwgClick.filterType.all || LwgClick.filterType.none || LwgClick.filterType.stage:
                      LwgClick.filter.nodeSelection = [];
                      break;
                  default:
                      break;
              }
          },
          get nodeSelection() {
              return this['LwgClick/_nodeSelection'];
          },
          set nodeSelection(arr) {
              this['LwgClick/_nodeSelection'] = arr;
              switch (LwgClick.filter.value) {
                  case LwgClick.filterType.someBtnIncludeStage || LwgClick.filterType.someBtnExcludeStage:
                      LwgClick.filter.value = LwgClick.filterType.someBtnExcludeStage;
                      break;
                  default:
                      break;
              }
          }
      };
      function checkTarget(targetName) {
          let targetClick = false;
          if (LwgClick.absolute) {
              if (LwgClick.filter.nodeSelection.length > 0) {
                  for (let index = 0; index < LwgClick.filter.nodeSelection.length; index++) {
                      const _name = LwgClick.filter.nodeSelection[index];
                      if (_name === targetName) {
                          targetClick = true;
                      }
                  }
              }
          }
          return targetClick;
      }
      LwgClick.checkTarget = checkTarget;
      function checkStage() {
          let stageClick = false;
          if (LwgClick.absolute) {
              if (LwgClick.filter.value === LwgClick.filterType.all || LwgClick.filter.value === LwgClick.filterType.stage || LwgClick.filter.value === LwgClick.filterType.someBtnIncludeStage) {
                  stageClick = true;
              }
          }
          return stageClick;
      }
      LwgClick.checkStage = checkStage;
      LwgClick._Type = {
          no: 'no',
          largen: 'largen',
          reduce: 'reduce',
      };
      LwgClick.Use = {
          get value() {
              return this['Click/name'] ? this['Click/name'] : null;
          },
          set value(val) {
              this['Click/name'] = val;
          }
      };
      function effectSwitch(effectType) {
          let btnEffect;
          switch (effectType) {
              case LwgClick._Type.no:
                  btnEffect = new NoEffect();
                  break;
              case LwgClick._Type.largen:
                  btnEffect = new Largen();
                  break;
              case LwgClick._Type.reduce:
                  btnEffect = new Reduce();
                  break;
              default:
                  btnEffect = new NoEffect();
                  break;
          }
          return btnEffect;
      }
      LwgClick.effectSwitch = effectSwitch;
      function on(effect, target, caller, down, move, up, out) {
          const btnEffect = effectSwitch(effect);
          target.on(Laya.Event.MOUSE_DOWN, caller, down);
          target.on(Laya.Event.MOUSE_MOVE, caller, move);
          target.on(Laya.Event.MOUSE_UP, caller, up);
          target.on(Laya.Event.MOUSE_OUT, caller, out);
          target.on(Laya.Event.MOUSE_DOWN, caller, btnEffect.down);
          target.on(Laya.Event.MOUSE_MOVE, caller, btnEffect.move);
          target.on(Laya.Event.MOUSE_UP, caller, btnEffect.up);
          target.on(Laya.Event.MOUSE_OUT, caller, btnEffect.out);
      }
      LwgClick.on = on;
      function off(effect, target, caller, down, move, up, out) {
          const btnEffect = effectSwitch(effect);
          target.off(Laya.Event.MOUSE_DOWN, caller, down);
          target.off(Laya.Event.MOUSE_MOVE, caller, move);
          target.off(Laya.Event.MOUSE_UP, caller, up);
          target.off(Laya.Event.MOUSE_OUT, caller, out);
          target.off(Laya.Event.MOUSE_DOWN, caller, btnEffect.down);
          target.off(Laya.Event.MOUSE_MOVE, caller, btnEffect.move);
          target.off(Laya.Event.MOUSE_UP, caller, btnEffect.up);
          target.off(Laya.Event.MOUSE_OUT, caller, btnEffect.out);
      }
      LwgClick.off = off;
      class NoEffect {
          down() { }
          ;
          move() { }
          ;
          up() { }
          ;
          out() { }
          ;
      }
      LwgClick.NoEffect = NoEffect;
      class Largen {
          down(event) {
              event.currentTarget.scale(1.1, 1.1);
              LwgAudio.playSound(LwgClick._audioUrl);
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
      LwgClick.Largen = Largen;
      class Reduce {
          down(event) {
              event.currentTarget.scale(0.9, 0.9);
              LwgAudio.playSound(LwgClick._audioUrl);
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
      LwgClick.Reduce = Reduce;
  })(LwgClick || (LwgClick = {}));
  var LwgAni3D;
  (function (LwgAni3D) {
      LwgAni3D.tweenMap = {};
      LwgAni3D.frameRate = 1;
      function moveTo(target, toPos, duration, caller, ease, complete, delay = 0, coverBefore = true, update, frame) {
          let position = target.transform.position.clone();
          if (duration == 0 || duration === undefined || duration === null) {
              target.transform.position = toPos.clone();
              complete && complete.apply(caller);
              return;
          }
          if (frame <= 0 || frame === undefined || frame === null) {
              frame = LwgAni3D.frameRate;
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
          if (!LwgAni3D.tweenMap[target.id]) {
              LwgAni3D.tweenMap[target.id] = [];
          }
          LwgAni3D.tweenMap[target.id].push(tween);
      }
      LwgAni3D.moveTo = moveTo;
      function rotateTo(target, toRotation, duration, caller, ease, complete, delay, coverBefore, update, frame) {
          let rotation = target.transform.localRotationEuler.clone();
          if (duration == 0 || duration === undefined || duration === null) {
              target.transform.localRotationEuler = toRotation.clone();
              complete && complete.apply(caller);
              return;
          }
          if (frame <= 0 || frame === undefined || frame === null) {
              frame = LwgAni3D.frameRate;
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
          if (!LwgAni3D.tweenMap[target.id]) {
              LwgAni3D.tweenMap[target.id] = [];
          }
          LwgAni3D.tweenMap[target.id].push(tween);
      }
      LwgAni3D.rotateTo = rotateTo;
      function scaleTo(target, toScale, duration, caller, ease, complete, delay, coverBefore, update, frame) {
          let localScale = target.transform.localScale.clone();
          if (duration == 0 || duration === undefined || duration === null) {
              target.transform.localScale = toScale.clone();
              complete && complete.apply(caller);
              return;
          }
          if (frame <= 0 || frame === undefined || frame === null) {
              frame = LwgAni3D.frameRate;
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
          if (!LwgAni3D.tweenMap[target.id]) {
              LwgAni3D.tweenMap[target.id] = [];
          }
          LwgAni3D.tweenMap[target.id].push(tween);
      }
      LwgAni3D.scaleTo = scaleTo;
      function ClearTween(target) {
          let tweens = LwgAni3D.tweenMap[target.id];
          if (tweens && tweens.length) {
              while (tweens.length > 0) {
                  let tween = tweens.pop();
                  tween.clear();
              }
          }
          Laya.timer.clearAll(target);
      }
      LwgAni3D.ClearTween = ClearTween;
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
      LwgAni3D.rock = rock;
      function moveRotateTo(Sp3d, Target, duration, caller, ease, complete, delay, coverBefore, update, frame) {
          moveTo(Sp3d, Target.transform.position, duration, caller, ease, null, delay, coverBefore, update, frame);
          rotateTo(Sp3d, Target.transform.localRotationEuler, duration, caller, ease, complete, delay, coverBefore, null, frame);
      }
      LwgAni3D.moveRotateTo = moveRotateTo;
  })(LwgAni3D || (LwgAni3D = {}));
  var LwgAni2D;
  (function (LwgAni2D) {
      function clearAll(arr) {
          for (let index = 0; index < arr.length; index++) {
              Laya.Tween.clearAll(arr[index]);
          }
      }
      LwgAni2D.clearAll = clearAll;
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
      LwgAni2D.circulation_scale = circulation_scale;
      function leftRight_Shake(node, range, time, delayed, func) {
          if (!delayed) {
              delayed = 0;
          }
          Laya.Tween.to(node, { x: node.x - range }, time, null, Laya.Handler.create(this, function () {
              Laya.Tween.to(node, { x: node.x + range * 2 }, time, null, Laya.Handler.create(this, function () {
                  Laya.Tween.to(node, { x: node.x - range }, time, null, Laya.Handler.create(this, function () {
                      if (func) {
                          func();
                      }
                  }));
              }));
          }), delayed);
      }
      LwgAni2D.leftRight_Shake = leftRight_Shake;
      function rotate(node, Erotate, time, delayed, func) {
          Laya.Tween.to(node, { rotation: Erotate }, time, null, Laya.Handler.create(node, function () {
              if (func) {
                  func();
              }
          }), delayed ? delayed : 0);
      }
      LwgAni2D.rotate = rotate;
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
      LwgAni2D.upDown_Overturn = upDown_Overturn;
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
      LwgAni2D.leftRight_Overturn = leftRight_Overturn;
      function upDwon_Shake(node, range, time, delayed, func) {
          Laya.Tween.to(node, { y: node.y + range }, time, null, Laya.Handler.create(this, function () {
              Laya.Tween.to(node, { y: node.y - range * 2 }, time, null, Laya.Handler.create(this, function () {
                  Laya.Tween.to(node, { y: node.y + range }, time, null, Laya.Handler.create(this, function () {
                      if (func !== null) {
                          func && func();
                      }
                  }));
              }));
          }), delayed ? delayed : 0);
      }
      LwgAni2D.upDwon_Shake = upDwon_Shake;
      function fadeOut(node, alpha1, alpha2, time, delayed, func, stageClick) {
          node.alpha = alpha1;
          Laya.Tween.to(node, { alpha: alpha2 }, time, null, Laya.Handler.create(this, function () {
              if (func) {
                  func();
              }
          }), delayed ? delayed : 0);
      }
      LwgAni2D.fadeOut = fadeOut;
      function fadeOut_KickBack(node, alpha1, alpha2, time, delayed, func) {
          node.alpha = alpha1;
          Laya.Tween.to(node, { alpha: alpha2 }, time, null, Laya.Handler.create(this, function () {
              if (func !== null) {
                  func();
              }
          }), delayed);
      }
      LwgAni2D.fadeOut_KickBack = fadeOut_KickBack;
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
      LwgAni2D.move_FadeOut = move_FadeOut;
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
      LwgAni2D.move_Fade_Out = move_Fade_Out;
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
      LwgAni2D.move_FadeOut_Scale_01 = move_FadeOut_Scale_01;
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
      LwgAni2D.move_Scale = move_Scale;
      function move_rotate(Node, tRotate, tPoint, time, delayed, func) {
          Laya.Tween.to(Node, { rotation: tRotate, x: tPoint.x, y: tPoint.y }, time, null, Laya.Handler.create(Node, () => {
              if (func) {
                  func();
              }
          }), delayed ? delayed : 0);
      }
      LwgAni2D.move_rotate = move_rotate;
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
      LwgAni2D.rotate_Scale = rotate_Scale;
      function drop_Simple(node, fY, tY, rotation, time, delayed, func) {
          node.y = fY;
          Laya.Tween.to(node, { y: tY, rotation: rotation }, time, Laya.Ease.circOut, Laya.Handler.create(this, function () {
              if (func !== null) {
                  func();
              }
          }), delayed);
      }
      LwgAni2D.drop_Simple = drop_Simple;
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
      LwgAni2D.drop_KickBack = drop_KickBack;
      function drop_Excursion(node, targetY, targetX, rotation, time, delayed, func) {
          Laya.Tween.to(node, { x: node.x + targetX, y: node.y + targetY * 1 / 6 }, time, Laya.Ease.expoIn, Laya.Handler.create(this, function () {
              Laya.Tween.to(node, { x: node.x + targetX + 50, y: targetY, rotation: rotation }, time, null, Laya.Handler.create(this, function () {
                  if (func !== null) {
                      func();
                  }
              }), 0);
          }), delayed);
      }
      LwgAni2D.drop_Excursion = drop_Excursion;
      function goUp_Simple(node, initialY, initialR, targetY, time, delayed, func) {
          node.y = initialY;
          node.rotation = initialR;
          Laya.Tween.to(node, { y: targetY, rotation: 0 }, time, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
              if (func !== null) {
                  func();
              }
          }), delayed);
      }
      LwgAni2D.goUp_Simple = goUp_Simple;
      function cardRotateX_TowFace(node, time, func1, delayed, func2) {
          Laya.Tween.to(node, { scaleX: 0 }, time, null, Laya.Handler.create(this, function () {
              LwgTools.Node.childrenVisible2D(node, false);
              if (func1) {
                  func1();
              }
              Laya.Tween.to(node, { scaleX: 1 }, time * 0.9, null, Laya.Handler.create(this, function () {
                  Laya.Tween.to(node, { scaleX: 0 }, time * 0.8, null, Laya.Handler.create(this, function () {
                      LwgTools.Node.childrenVisible2D(node, true);
                      Laya.Tween.to(node, { scaleX: 1 }, time * 0.7, null, Laya.Handler.create(this, function () {
                          if (func2) {
                              func2();
                          }
                      }), 0);
                  }), 0);
              }), 0);
          }), delayed);
      }
      LwgAni2D.cardRotateX_TowFace = cardRotateX_TowFace;
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
      LwgAni2D.cardRotateX_OneFace = cardRotateX_OneFace;
      function cardRotateY_TowFace(node, time, func1, delayed, func2) {
          Laya.Tween.to(node, { scaleY: 0 }, time, null, Laya.Handler.create(this, function () {
              LwgTools.Node.childrenVisible2D(node, false);
              if (func1) {
                  func1();
              }
              Laya.Tween.to(node, { scaleY: 1 }, time, null, Laya.Handler.create(this, function () {
                  Laya.Tween.to(node, { scaleY: 0 }, time, null, Laya.Handler.create(this, function () {
                      Laya.Tween.to(node, { scaleY: 1 }, time * 1 / 2, null, Laya.Handler.create(this, function () {
                          LwgTools.Node.childrenVisible2D(node, true);
                          if (func2) {
                              func2();
                          }
                      }), 0);
                  }), 0);
              }), 0);
          }), delayed);
      }
      LwgAni2D.cardRotateY_TowFace = cardRotateY_TowFace;
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
      LwgAni2D.cardRotateY_OneFace = cardRotateY_OneFace;
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
      LwgAni2D.move_changeRotate = move_changeRotate;
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
      LwgAni2D.bomb_LeftRight = bomb_LeftRight;
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
      LwgAni2D.bombs_Appear = bombs_Appear;
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
      LwgAni2D.bombs_AppearAllChild = bombs_AppearAllChild;
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
      LwgAni2D.bombs_VanishAllChild = bombs_VanishAllChild;
      function bombs_Vanish(node, scale, alpha, rotation, time, func, delayed) {
          Laya.Tween.to(node, { scaleX: scale, scaleY: scale, alpha: alpha, rotation: rotation }, time, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
              if (func) {
                  func();
              }
          }), delayed ? delayed : 0);
      }
      LwgAni2D.bombs_Vanish = bombs_Vanish;
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
      LwgAni2D.swell_shrink = swell_shrink;
      function move(node, targetX, targetY, time, func, delayed, ease) {
          Laya.Tween.to(node, { x: targetX, y: targetY }, time, ease ? ease : null, Laya.Handler.create(this, function () {
              if (func) {
                  func();
              }
          }), delayed ? delayed : 0);
      }
      LwgAni2D.move = move;
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
      LwgAni2D.move_Deform_X = move_Deform_X;
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
      LwgAni2D.move_Deform_Y = move_Deform_Y;
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
      LwgAni2D.blink_FadeOut_v = blink_FadeOut_v;
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
      LwgAni2D.blink_FadeOut = blink_FadeOut;
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
      LwgAni2D.shookHead_Simple = shookHead_Simple;
      function hintAni_01(target, upNum, time1, stopTime, downNum, time2, func) {
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
      LwgAni2D.hintAni_01 = hintAni_01;
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
      LwgAni2D.scale_Alpha = scale_Alpha;
      function scale(target, fScaleX, fScaleY, eScaleX, eScaleY, time, delayed, func, ease) {
          target.scaleX = fScaleX;
          target.scaleY = fScaleY;
          Laya.Tween.to(target, { scaleX: eScaleX, scaleY: eScaleY }, time, ease ? ease : null, Laya.Handler.create(this, function () {
              if (func) {
                  func();
              }
          }), delayed ? delayed : 0);
      }
      LwgAni2D.scale = scale;
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
      LwgAni2D.rotate_Magnify_KickBack = rotate_Magnify_KickBack;
  })(LwgAni2D || (LwgAni2D = {}));
  var LwgSet;
  (function (LwgSet) {
      LwgSet.sound = {
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
      LwgSet.bgMusic = {
          get switch() {
              return Laya.LocalStorage.getItem('Setting/bgMusic') == '0' ? false : true;
          },
          set switch(value) {
              let val;
              if (value) {
                  val = 1;
                  Laya.LocalStorage.setItem('Setting/bgMusic', val.toString());
                  LwgAudio.playMusic();
              }
              else {
                  val = 0;
                  Laya.LocalStorage.setItem('Setting/bgMusic', val.toString());
                  LwgAudio.stopMusic();
              }
          }
      };
      LwgSet.shake = {
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
      function createBtnSet(x, y, width, height, skin, parent, ZOder) {
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
              LwgScene.openScene(LwgScene._BaseName.Set);
          };
          LwgClick.on(LwgClick._Type.largen, btn, null, null, btnSetUp, null);
          LwgSet.BtnSet = btn;
          LwgSet.BtnSet.name = 'BtnSetNode';
          return btn;
      }
      LwgSet.createBtnSet = createBtnSet;
      function btnSetAppear(delayed, x, y) {
          if (!LwgSet.BtnSet) {
              return;
          }
          if (delayed) {
              LwgAni2D.scale_Alpha(LwgSet.BtnSet, 0, 1, 1, 1, 1, 1, delayed, 0, f => {
                  LwgSet.BtnSet.visible = true;
              });
          }
          else {
              LwgSet.BtnSet.visible = true;
          }
          if (x) {
              LwgSet.BtnSet.x = x;
          }
          if (y) {
              LwgSet.BtnSet.y = y;
          }
      }
      LwgSet.btnSetAppear = btnSetAppear;
      function btnSetVinish(delayed) {
          if (!LwgSet.BtnSet) {
              return;
          }
          if (delayed) {
              LwgAni2D.scale_Alpha(LwgSet.BtnSet, 1, 1, 1, 1, 1, 0, delayed, 0, f => {
                  LwgSet.BtnSet.visible = false;
              });
          }
          else {
              LwgSet.BtnSet.visible = false;
          }
      }
      LwgSet.btnSetVinish = btnSetVinish;
  })(LwgSet || (LwgSet = {}));
  var LwgAudio;
  (function (LwgAudio) {
      let voiceUrl;
      (function (voiceUrl) {
          voiceUrl["bgm"] = "Lwg/Voice/bgm.mp3";
          voiceUrl["btn"] = "https://h5.tomatojoy.cn/res/ark/3d04671eec61b1e12a6c02e54c1e7320/1.0.0/3DDressUp/Voice/btn.wav";
          voiceUrl["victory"] = "https://h5.tomatojoy.cn/res/ark/3d04671eec61b1e12a6c02e54c1e7320/1.0.0/3DDressUp/Voice/guoguan.wav";
          voiceUrl["defeated"] = "https://h5.tomatojoy.cn/res/ark/3d04671eec61b1e12a6c02e54c1e7320/1.0.0/3DDressUp/Voice/wancheng.wav";
          voiceUrl["huodejinbi"] = "https://h5.tomatojoy.cn/res/ark/3d04671eec61b1e12a6c02e54c1e7320/1.0.0/3DDressUp/Voice/huodejinbi.wav";
      })(voiceUrl = LwgAudio.voiceUrl || (LwgAudio.voiceUrl = {}));
      function playSound(url, number, func) {
          if (!url) {
              url = voiceUrl.btn;
          }
          if (!number) {
              number = 1;
          }
          if (LwgSet.sound.switch) {
              Laya.SoundManager.playSound(url, number, Laya.Handler.create(this, function () {
                  if (func) {
                      func();
                  }
              }));
          }
      }
      LwgAudio.playSound = playSound;
      function playDefeatedSound(url, number, func, soundVolume) {
          if (LwgSet.sound.switch) {
              Laya.SoundManager.soundVolume = soundVolume ? soundVolume : 1;
              Laya.SoundManager.playSound(url ? url : voiceUrl.defeated, number ? number : 1, Laya.Handler.create(this, function () {
                  if (func) {
                      func();
                  }
                  Laya.SoundManager.soundVolume = 1;
              }));
          }
      }
      LwgAudio.playDefeatedSound = playDefeatedSound;
      function playVictorySound(url, number, func, soundVolume) {
          if (LwgSet.sound.switch) {
              Laya.SoundManager.soundVolume = soundVolume ? soundVolume : 1;
              Laya.SoundManager.playSound(url ? url : voiceUrl.victory, number ? number : 1, Laya.Handler.create(this, function () {
                  if (func) {
                      func();
                  }
                  Laya.SoundManager.soundVolume = 1;
              }));
          }
      }
      LwgAudio.playVictorySound = playVictorySound;
      function playMusic(url, number, delayed) {
          if (LwgSet.bgMusic.switch) {
              Laya.SoundManager.playMusic(url ? url : voiceUrl.bgm, number ? number : 0, Laya.Handler.create(this, function () { }), delayed ? delayed : 0);
          }
      }
      LwgAudio.playMusic = playMusic;
      function stopMusic() {
          Laya.SoundManager.stopMusic();
      }
      LwgAudio.stopMusic = stopMusic;
  })(LwgAudio || (LwgAudio = {}));
  var LwgTools;
  (function (LwgTools) {
      function color_RGBtoHexString(r, g, b) {
          return '#' + ("00000" + (r << 16 | g << 8 | b).toString(16)).slice(-6);
      }
      LwgTools.color_RGBtoHexString = color_RGBtoHexString;
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
      })(_Format = LwgTools._Format || (LwgTools._Format = {}));
      let Node;
      (function (Node_1) {
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
          Node_1.tieByParent = tieByParent;
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
          Node_1.tieByStage = tieByStage;
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
          Node_1.simpleCopyImg = simpleCopyImg;
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
          Node_1.leaveStage = leaveStage;
          function getNodeGP(sp) {
              if (!sp.parent) {
                  return;
              }
              return sp.parent.localToGlobal(new Laya.Point(sp.x, sp.y));
          }
          Node_1.getNodeGP = getNodeGP;
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
          Node_1.checkTwoDistance = checkTwoDistance;
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
              ObjArray.sortByProperty(arr, 'y');
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
          Node_1.childZOrderByY = childZOrderByY;
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
          Node_1.changePivot = changePivot;
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
          Node_1.changePivotCenter = changePivotCenter;
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
          Node_1.getChildArrByProperty = getChildArrByProperty;
          function randomChildren(node, num) {
              let childArr = [];
              let indexArr = [];
              for (let i = 0; i < node.numChildren; i++) {
                  indexArr.push(i);
              }
              let randomIndex = LwgTools._Array.randomGetOut(indexArr, num);
              for (let j = 0; j < randomIndex.length; j++) {
                  childArr.push(node.getChildAt(randomIndex[j]));
              }
              return childArr;
          }
          Node_1.randomChildren = randomChildren;
          function destroyAllChildren(node) {
              for (let index = 0; index < node.numChildren; index++) {
                  const element = node.getChildAt(index);
                  element.destroy();
                  index--;
              }
          }
          Node_1.destroyAllChildren = destroyAllChildren;
          function destroyOneChildren(node, nodeName) {
              for (let index = 0; index < node.numChildren; index++) {
                  const element = node.getChildAt(index);
                  if (element.name == nodeName) {
                      element.destroy();
                      index--;
                  }
              }
          }
          Node_1.destroyOneChildren = destroyOneChildren;
          function removeAllChildren(node) {
              if (node.numChildren > 0) {
                  node.removeChildren(0, node.numChildren - 1);
              }
          }
          Node_1.removeAllChildren = removeAllChildren;
          function removeOneChildren(node, nodeName) {
              for (let index = 0; index < node.numChildren; index++) {
                  const element = node.getChildAt(index);
                  if (element.name == nodeName) {
                      element.removeSelf();
                      index--;
                  }
              }
          }
          Node_1.removeOneChildren = removeOneChildren;
          function checkChildren(node, nodeName) {
              for (let index = 0; index < node.numChildren; index++) {
                  const element = node.getChildAt(index);
                  if (element.name == nodeName) {
                      return element;
                  }
              }
          }
          Node_1.checkChildren = checkChildren;
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
          Node_1.showExcludedChild2D = showExcludedChild2D;
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
          Node_1.showExcludedChild3D = showExcludedChild3D;
          function createPrefab(prefab, Parent, point, script, zOrder, name) {
              name = name ? name : prefab.json['props']['name'];
              const Sp = Laya.Pool.getItemByCreateFun(name, prefab.create, prefab);
              Parent && Parent.addChild(Sp);
              point && Sp.pos(point[0], point[1]);
              script && Sp.addComponent(script);
              Sp.name = name;
              LwgNode._addProperty(Sp);
              if (zOrder)
                  Sp.zOrder = zOrder;
              return Sp;
          }
          Node_1.createPrefab = createPrefab;
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
          Node_1.childrenVisible2D = childrenVisible2D;
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
          Node_1.childrenVisible3D = childrenVisible3D;
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
          Node_1.findChild3D = findChild3D;
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
          Node_1.findChild2D = findChild2D;
          function findChildByName2D(parent, name) {
              let arr = [];
              return arr;
          }
          Node_1.findChildByName2D = findChildByName2D;
      })(Node = LwgTools.Node || (LwgTools.Node = {}));
      let Num;
      (function (Num) {
          function randomOneHalf() {
              let number;
              number = Math.floor(Math.random() * 2);
              return number;
          }
          Num.randomOneHalf = randomOneHalf;
          function randomNumerical(numSection, defaultNumSection, randomPlusOrMinus) {
              let num = numSection ? LwgTools.Num.randomOneBySection(numSection[0], numSection[1]) : LwgTools.Num.randomOneBySection(defaultNumSection[0], defaultNumSection[1]);
              if (randomPlusOrMinus) {
                  num = LwgTools.Num.randomOneHalf() === 0 ? num : -num;
              }
              return num;
          }
          Num.randomNumerical = randomNumerical;
          function randomOneInt(section1, section2) {
              if (section2) {
                  return Math.round(Math.random() * (section2 - section1)) + section1;
              }
              else {
                  return Math.round(Math.random() * section1);
              }
          }
          Num.randomOneInt = randomOneInt;
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
          Num.randomCountBySection = randomCountBySection;
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
          Num.randomOneBySection = randomOneBySection;
      })(Num = LwgTools.Num || (LwgTools.Num = {}));
      let Point;
      (function (Point) {
          function getOtherLocal(element, Other) {
              let Parent = element.parent;
              let gPoint = Parent.localToGlobal(new Laya.Point(element.x, element.y));
              return Other.globalToLocal(gPoint);
          }
          Point.getOtherLocal = getOtherLocal;
          function angleByRadian(angle) {
              return Math.PI / 180 * angle;
          }
          Point.angleByRadian = angleByRadian;
          function pointByAngleOld(x, y) {
              const radian = Math.atan2(x, y);
              let angle = 90 - radian * (180 / Math.PI);
              if (angle <= 0) {
                  angle = 270 + (90 + angle);
              }
              return angle - 90;
          }
          Point.pointByAngleOld = pointByAngleOld;
          ;
          function pointByAngleNew(x, y) {
              const radian = Math.atan2(y, x);
              let angle = radian * (180 / Math.PI);
              if (angle <= 0) {
                  angle = 360 + angle;
              }
              return angle;
          }
          Point.pointByAngleNew = pointByAngleNew;
          ;
          function angleByPoint(angle) {
              const radian = (90 - angle) / (180 / Math.PI);
              const p = new Laya.Point(Math.sin(radian), Math.cos(radian));
              p.normalize();
              return p;
          }
          Point.angleByPoint = angleByPoint;
          ;
          function angleByPointNew(angle) {
              const rad = angleByRadian(angle);
              const p = new Laya.Point(Math.cos(rad), Math.sin(rad));
              p.normalize();
              return p;
          }
          Point.angleByPointNew = angleByPointNew;
          ;
          function dotRotatePoint(x0, y0, x1, y1, angle) {
              let x2 = x0 + (x1 - x0) * Math.cos(angle * Math.PI / 180) - (y1 - y0) * Math.sin(angle * Math.PI / 180);
              let y2 = y0 + (x1 - x0) * Math.sin(angle * Math.PI / 180) + (y1 - y0) * Math.cos(angle * Math.PI / 180);
              return new Laya.Point(x2, y2);
          }
          Point.dotRotatePoint = dotRotatePoint;
          function angleAndLenByPoint(angle, len) {
              const point = new Laya.Point();
              point.x = len * Math.cos(angle * Math.PI / 180);
              point.y = len * Math.sin(angle * Math.PI / 180);
              return point;
          }
          Point.angleAndLenByPoint = angleAndLenByPoint;
          function getRoundPosOld(angle, radius, centerPos) {
              const radian = angleByRadian(angle);
              const X = centerPos.x + Math.sin(radian) * radius;
              const Y = centerPos.y - Math.cos(radian) * radius;
              return new Laya.Point(X, Y);
          }
          Point.getRoundPosOld = getRoundPosOld;
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
          Point.getRoundPosNew = getRoundPosNew;
          function randomPointByCenter(centerPos, radiusX, radiusY, count = 1) {
              let arr = [];
              for (let index = 0; index < count; index++) {
                  let x0 = LwgTools.Num.randomCountBySection(0, radiusX, 1, false);
                  let y0 = LwgTools.Num.randomCountBySection(0, radiusY, 1, false);
                  let diffX = LwgTools.Num.randomOneHalf() == 0 ? x0[0] : -x0[0];
                  let diffY = LwgTools.Num.randomOneHalf() == 0 ? y0[0] : -y0[0];
                  let p = new Laya.Point(centerPos.x + diffX, centerPos.y + diffY);
                  arr.push(p);
              }
              return arr;
          }
          Point.randomPointByCenter = randomPointByCenter;
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
          Point.getPArrBetweenTwoP = getPArrBetweenTwoP;
          function reverseVector(Vecoter1, Vecoter2, normalizing) {
              let p;
              p = new Laya.Point(Vecoter1.x - Vecoter2.x, Vecoter1.y - Vecoter2.y);
              if (normalizing) {
                  p.normalize();
              }
              return p;
          }
          Point.reverseVector = reverseVector;
      })(Point = LwgTools.Point || (LwgTools.Point = {}));
      let D3;
      (function (D3) {
          function randomScopeByPosition(sp3D, scopeSize) {
              let _pX = LwgTools.Num.randomOneBySection(scopeSize[0][0], scopeSize[1][0]);
              let _pY = LwgTools.Num.randomOneBySection(scopeSize[0][1], scopeSize[1][1]);
              let _pZ = LwgTools.Num.randomOneBySection(scopeSize[0][2], scopeSize[1][2]);
              _pX = LwgTools.Num.randomOneHalf() == 0 ? _pX : -_pX;
              _pY = LwgTools.Num.randomOneHalf() == 0 ? _pY : -_pY;
              _pZ = LwgTools.Num.randomOneHalf() == 0 ? _pZ : -_pZ;
              sp3D.transform.position = new Laya.Vector3(sp3D.transform.position.x + _pX, sp3D.transform.position.y + _pY, sp3D.transform.position.z + _pZ);
          }
          D3.randomScopeByPosition = randomScopeByPosition;
          function getMeshSize(MSp3D) {
              if (MSp3D.meshRenderer) {
                  let v3;
                  let extent = MSp3D.meshRenderer.bounds.getExtent();
                  return v3 = new Laya.Vector3(extent.x * 2, extent.y * 2, extent.z * 2);
              }
          }
          D3.getMeshSize = getMeshSize;
          function getSkinMeshSize(MSp3D) {
              if (MSp3D.skinnedMeshRenderer) {
                  let v3;
                  let extent = MSp3D.skinnedMeshRenderer.bounds.getExtent();
                  return v3 = new Laya.Vector3(extent.x * 2, extent.y * 2, extent.z * 2);
              }
          }
          D3.getSkinMeshSize = getSkinMeshSize;
          function twoNodeDistance(obj1, obj2) {
              let obj1V3 = obj1.transform.position;
              let obj2V3 = obj2.transform.position;
              let p = new Laya.Vector3();
              Laya.Vector3.subtract(obj1V3, obj2V3, p);
              let lenp = Laya.Vector3.scalarLength(p);
              return lenp;
          }
          D3.twoNodeDistance = twoNodeDistance;
          function twoPositionDistance(v1, v2) {
              let p = twoSubV3(v1, v2);
              let lenp = Laya.Vector3.scalarLength(p);
              return lenp;
          }
          D3.twoPositionDistance = twoPositionDistance;
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
          D3.twoSubV3 = twoSubV3;
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
          D3.maximumDistanceLimi = maximumDistanceLimi;
          function posToScreen(v3, camera) {
              let ScreenV4 = new Laya.Vector4();
              camera.viewport.project(v3, camera.projectionViewMatrix, ScreenV4);
              let point = new Laya.Vector2();
              point.x = ScreenV4.x / Laya.stage.clientScaleX;
              point.y = ScreenV4.y / Laya.stage.clientScaleY;
              return point;
          }
          D3.posToScreen = posToScreen;
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
          D3.reverseVector = reverseVector;
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
          D3.rayScanning = rayScanning;
          function rayScanningFirst(camera, scene3D, vector2) {
              let _ray = new Laya.Ray(new Laya.Vector3(0, 0, 0), new Laya.Vector3(0, 0, 0));
              let out = new Laya.HitResult();
              const _v2 = new Laya.Vector2(Laya.stage.clientScaleX * vector2.x, Laya.stage.clientScaleY * vector2.y);
              camera.viewportPointToRay(_v2, _ray);
              scene3D.physicsSimulation.rayCast(_ray, out);
              return out;
          }
          D3.rayScanningFirst = rayScanningFirst;
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
          D3.animatorPlay = animatorPlay;
      })(D3 = LwgTools.D3 || (LwgTools.D3 = {}));
      let Skeleton;
      (function (Skeleton) {
          function sk_indexControl(sk, name) {
              sk.play(name, true);
              sk.player.currentTime = 15 * 1000 / sk.player.cacheFrameRate;
          }
          Skeleton.sk_indexControl = sk_indexControl;
      })(Skeleton = LwgTools.Skeleton || (LwgTools.Skeleton = {}));
      let Draw;
      (function (Draw) {
          function drawPieMask(parent, startAngle, endAngle) {
              parent.cacheAs = "bitmap";
              let drawPieSpt = new Laya.Sprite();
              drawPieSpt.blendMode = "destination-out";
              parent.addChild(drawPieSpt);
              let drawPie = drawPieSpt.graphics.drawPie(parent.width / 2, parent.height / 2, parent.width / 2 + 10, startAngle, endAngle, "#000000");
              return drawPie;
          }
          Draw.drawPieMask = drawPieMask;
          function screenshot(Sp, quality) {
              const htmlCanvas = Sp.drawToCanvas(Sp.width, Sp.height, Sp.x, Sp.y);
              const base64 = htmlCanvas.toBase64("image/png", quality ? quality : 1);
              return base64;
          }
          Draw.screenshot = screenshot;
          Draw._texArr = [];
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
              Draw._texArr.push(ptex);
              if (Draw._texArr.length > 3) {
                  Draw._texArr[0].destroy();
                  Draw._texArr.shift();
              }
              LwgTimer.frameOnce(5, this, () => {
                  _camera.destroy();
              });
          }
          Draw.cameraToSprite = cameraToSprite;
          function drawToTex(Sp, quality) {
              let tex = Sp.drawToTexture(Sp.width, Sp.height, Sp.x, Sp.y);
              return tex;
          }
          Draw.drawToTex = drawToTex;
          function reverseCircleMask(sp, circleArr, eliminate) {
              if (eliminate == undefined || eliminate == true) {
                  Node.destroyAllChildren(sp);
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
          Draw.reverseCircleMask = reverseCircleMask;
          function reverseRoundrectMask(sp, roundrectArr, eliminate) {
              if (eliminate == undefined || eliminate == true) {
                  Node.removeAllChildren(sp);
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
          Draw.reverseRoundrectMask = reverseRoundrectMask;
      })(Draw = LwgTools.Draw || (LwgTools.Draw = {}));
      let ObjArray;
      (function (ObjArray_1) {
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
          ObjArray_1.sortByProperty = sortByProperty;
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
                      let _obj1 = ObjArray.objCopy(obj1);
                      result.push(_obj1);
                  }
              }
              return result;
          }
          ObjArray_1.diffProByTwo = diffProByTwo;
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
          ObjArray_1.identicalPropertyObjArr = identicalPropertyObjArr;
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
          ObjArray_1.objArrUnique = objArrUnique;
          function getArrByValue(objArr, property) {
              let arr = [];
              for (let i = 0; i < objArr.length; i++) {
                  if (objArr[i][property]) {
                      arr.push(objArr[i][property]);
                  }
              }
              return arr;
          }
          ObjArray_1.getArrByValue = getArrByValue;
          function arrCopy(ObjArray) {
              var sourceCopy = ObjArray instanceof Array ? [] : {};
              for (var item in ObjArray) {
                  sourceCopy[item] = typeof ObjArray[item] === 'object' ? objCopy(ObjArray[item]) : ObjArray[item];
              }
              return sourceCopy;
          }
          ObjArray_1.arrCopy = arrCopy;
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
          ObjArray_1.modifyProValue = modifyProValue;
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
          ObjArray_1.objCopy = objCopy;
      })(ObjArray = LwgTools.ObjArray || (LwgTools.ObjArray = {}));
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
      })(_Array = LwgTools._Array || (LwgTools._Array = {}));
  })(LwgTools || (LwgTools = {}));
  var LwgPreLoad;
  (function (LwgPreLoad) {
      class _PreLoadScene extends LwgScene.SceneBase {
          constructor() {
              super(...arguments);
              this.$pic2D = [];
              this.$texture = [];
              this.$prefab2D = [];
              this.$scene2D = [];
              this.$scene3D = [];
              this.$prefab3D = [];
              this.$texture2D = [];
              this.$effectsTex2D = [];
              this.$material = [];
              this.$mesh3D = [];
              this.$json = [];
              this.$skeleton = [];
              this._loadOrder = [this.$pic2D, this.$texture, this.$prefab2D, this.$scene2D, this.$prefab3D, this.$texture2D, this.$effectsTex2D, this.$material, this.$mesh3D, this.$scene3D, this.$json, this.$skeleton];
              this._loadOrderIndex = 0;
              this._sumProgress = 0;
              this._currentProgress = 0;
          }
          lwgStartLoding(listObj) {
              listObj['$effectsTex2D'] = LwgEff3D.tex2D;
              for (const typeName in listObj) {
                  if (Object.prototype.hasOwnProperty.call(listObj, typeName)) {
                      for (const resObj in listObj[typeName]) {
                          if (Object.prototype.hasOwnProperty.call(listObj[typeName], resObj)) {
                              const obj = listObj[typeName][resObj];
                              this[typeName].push(obj);
                          }
                      }
                  }
              }
              for (let index = 0; index < this._loadOrder.length; index++) {
                  this._sumProgress += this._loadOrder[index].length;
                  if (this._loadOrder[index].length <= 0) {
                      this._loadOrder.splice(index, 1);
                      index--;
                  }
              }
              let time = this.lwgOpenAni();
              Laya.timer.once(time ? time : 0, this, () => {
                  this.lode();
              });
          }
          lwgStepComplete() { }
          lwgAllComplete() { return 0; }
          ;
          stepComplete() {
              this._currentProgress++;
              console.log('当前进度条进度:', this._currentProgress / this._sumProgress);
              if (this._currentProgress >= this._sumProgress) {
                  if (this._sumProgress == 0) {
                      return;
                  }
                  console.log(`所有资源加载完成！此时所有资源可通过例如:Laya.loader.getRes("url")获取`);
                  this.allComplete();
              }
              else {
                  let number = 0;
                  for (let index = 0; index <= this._loadOrderIndex; index++) {
                      number += this._loadOrder[index].length;
                  }
                  if (this._currentProgress === number) {
                      this._loadOrderIndex++;
                  }
                  this.lode();
                  this.lwgStepComplete();
              }
          }
          allComplete() {
              Laya.timer.once(this.lwgAllComplete(), this, () => {
                  if (this._Owner.name == LwgScene._BaseName._PreLoadCutIn) {
                      this._openScene(LwgScene._PreLoadCutIn.openName);
                  }
                  else {
                      LwgAudio.playMusic();
                  }
              });
          }
          lodeFunc(resArr, index, res, typeName, completeFunc) {
              const url = resArr[index].url;
              if (typeof url === 'object') {
                  console.log(typeName, url, `数组加载完成，为数组对象，只能从getRes（url）中逐个获取`);
              }
              else {
                  if (res == null) {
                      console.log(`XXXXXXXXXXX${typeName}:${url}加载失败！不会停止加载进程！, 数组下标为：${index}, 'XXXXXXXXXXX`);
                  }
                  else {
                      console.log(`${typeName}:${url}加载完成！, 数组下标为${index}`);
                      completeFunc && completeFunc();
                  }
              }
              this.stepComplete();
          }
          lode() {
              if (this._loadOrder.length <= 0) {
                  console.log('没有加载项');
                  this.allComplete();
                  return;
              }
              let alreadyPro = 0;
              for (let i = 0; i < this._loadOrderIndex; i++) {
                  alreadyPro += this._loadOrder[i].length;
              }
              let index = this._currentProgress - alreadyPro;
              switch (this._loadOrder[this._loadOrderIndex]) {
                  case this.$pic2D:
                      Laya.loader.load(this.$pic2D[index].url, Laya.Handler.create(this, (res) => {
                          this.lodeFunc(this._loadOrder[this._loadOrderIndex], index, res, '2D图片', null);
                      }));
                      break;
                  case this.$scene2D:
                      Laya.loader.load(this.$scene2D[index].url, Laya.Handler.create(this, (res) => {
                          this.lodeFunc(this._loadOrder[this._loadOrderIndex], index, res, '2D场景', null);
                      }), null, Laya.Loader.JSON);
                      break;
                  case this.$scene3D:
                      Laya.Scene3D.load(this.$scene3D[index].url, Laya.Handler.create(this, (Scene3D) => {
                          this.lodeFunc(this._loadOrder[this._loadOrderIndex], index, Scene3D, '3D场景', () => {
                              this.$scene3D[index].scene3D = Scene3D;
                          });
                      }));
                      break;
                  case this.$prefab3D:
                      Laya.Sprite3D.load(this.$prefab3D[index].url, Laya.Handler.create(this, (Sp3D) => {
                          this.lodeFunc(this._loadOrder[this._loadOrderIndex], index, Sp3D, '3D预制体', () => {
                              this.$prefab3D[index].prefab3D = Sp3D;
                          });
                      }));
                      break;
                  case this.$mesh3D:
                      Laya.Mesh.load(this.$mesh3D[index].url, Laya.Handler.create(this, (Mesh3D) => {
                          this.lodeFunc(this._loadOrder[this._loadOrderIndex], index, Mesh3D, '3D网格', () => {
                              this.$mesh3D[index].mesh3D = Mesh3D;
                          });
                      }));
                      break;
                  case this.$texture:
                      Laya.loader.load(this.$texture[index].url, Laya.Handler.create(this, (tex) => {
                          this.lodeFunc(this._loadOrder[this._loadOrderIndex], index, tex, '纹理', () => {
                              this.$texture[index].texture = tex;
                          });
                      }));
                      break;
                  case this.$texture2D:
                      Laya.Texture2D.load(this.$texture2D[index].url, Laya.Handler.create(this, (tex2D) => {
                          this.lodeFunc(this._loadOrder[this._loadOrderIndex], index, tex2D, '3D纹理', () => {
                              this.$texture2D[index].texture2D = tex2D;
                          });
                      }));
                      break;
                  case this.$effectsTex2D:
                      Laya.Texture2D.load(this.$effectsTex2D[index].url, Laya.Handler.create(this, (tex2D) => {
                          this.lodeFunc(this._loadOrder[this._loadOrderIndex], index, tex2D, '3D纹理', () => {
                              this.$effectsTex2D[index].texture2D = tex2D;
                          });
                      }));
                      break;
                  case this.$material:
                      Laya.Material.load(this.$material[index].url, Laya.Handler.create(this, (Material) => {
                          this.lodeFunc(this._loadOrder[this._loadOrderIndex], index, Material, '3D纹理', () => {
                              this.$material[index].material = Material;
                          });
                      }));
                      break;
                  case this.$json:
                      Laya.loader.load(this.$json[index].url, Laya.Handler.create(this, (Json) => {
                          this.lodeFunc(this._loadOrder[this._loadOrderIndex], index, Json, '数据表', () => {
                              this.$json[index].dataArr = Json["RECORDS"];
                          });
                      }), null, Laya.Loader.JSON);
                      break;
                  case this.$skeleton:
                      this.$skeleton[index].templet.on(Laya.Event.ERROR, this, () => {
                          console.log('XXXXXXXXXXX骨骼动画' + this.$skeleton[index] + '加载失败！不会停止加载进程！', '数组下标为：', index, 'XXXXXXXXXXX');
                          this.stepComplete();
                      });
                      this.$skeleton[index].templet.on(Laya.Event.COMPLETE, this, () => {
                          console.log('骨骼动画', this.$skeleton[index].url, '加载完成！', '数组下标为：', index);
                          this.stepComplete();
                      });
                      this.$skeleton[index].templet.loadAni(this.$skeleton[index].url);
                      break;
                  case this.$prefab2D:
                      Laya.loader.load(this.$prefab2D[index].url, Laya.Handler.create(this, (prefabJson) => {
                          this.lodeFunc(this._loadOrder[this._loadOrderIndex], index, prefabJson, '2D预制体', () => {
                              let _prefab = new Laya.Prefab();
                              _prefab.json = prefabJson;
                              this.$prefab2D[index].prefab2D = _prefab;
                          });
                      }));
                      break;
                  default:
                      break;
              }
          }
      }
      LwgPreLoad._PreLoadScene = _PreLoadScene;
      class _PreLoadCutInScene extends _PreLoadScene {
          moduleOnAwake() {
              this.$openName = LwgScene._PreLoadCutIn.openName;
              this.$closeName = LwgScene._PreLoadCutIn.closeName;
          }
      }
      LwgPreLoad._PreLoadCutInScene = _PreLoadCutInScene;
  })(LwgPreLoad || (LwgPreLoad = {}));
  var LwgInit;
  (function (LwgInit) {
      class _InitScene extends LwgScene.SceneBase {
          lwgOpenAni() {
              return 100;
          }
          moduleOnStart() {
              LwgDate.init();
          }
          ;
      }
      LwgInit._InitScene = _InitScene;
  })(LwgInit || (LwgInit = {}));
  var LwgExecution;
  (function (LwgExecution) {
      let maxEx = 15;
      LwgExecution.execution = {
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
      LwgExecution.addExDate = {
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
      LwgExecution.addExHours = {
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
      LwgExecution.addMinutes = {
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
      function createExecutionNode(parent) {
          let sp;
          Laya.loader.load('prefab/ExecutionNum.json', Laya.Handler.create(this, function (prefab) {
              let _prefab = new Laya.Prefab();
              _prefab.json = prefab;
              sp = Laya.Pool.getItemByCreateFun('prefab', _prefab.create, _prefab);
              parent.addChild(sp);
              let num = sp.getChildByName('Num');
              num.value = LwgExecution.execution.value.toString();
              sp.pos(297, 90);
              sp.zOrder = 50;
              LwgExecution.ExNode = sp;
              LwgExecution.ExNode.name = 'ExNode';
          }));
      }
      LwgExecution.createExecutionNode = createExecutionNode;
      function addExecution(x, y, func) {
          let sp;
          Laya.loader.load('prefab/execution.json', Laya.Handler.create(this, function (prefab) {
              let _prefab = new Laya.Prefab();
              _prefab.json = prefab;
              sp = Laya.Pool.getItemByCreateFun('prefab', _prefab.create, _prefab);
              Laya.stage.addChild(sp);
              sp.x = Laya.stage.width / 2;
              sp.y = Laya.stage.height / 2;
              sp.zOrder = 50;
              if (LwgExecution.ExNode) {
                  LwgAni2D.move(sp, LwgExecution.ExNode.x, LwgExecution.ExNode.y, 800, () => {
                      LwgAni2D.fadeOut(sp, 1, 0, 200, 0, () => {
                          LwgAni2D.upDwon_Shake(LwgExecution.ExNode, 10, 80, 0, null);
                          if (func) {
                              func();
                          }
                      });
                  }, 100);
              }
          }));
      }
      LwgExecution.addExecution = addExecution;
      function createConsumeEx(subEx) {
          let label = Laya.Pool.getItemByClass('label', Laya.Label);
          label.name = 'label';
          Laya.stage.addChild(label);
          label.text = `${subEx}`;
          label.fontSize = 40;
          label.bold = true;
          label.color = '#59245c';
          label.x = LwgExecution.ExNode.x + 100;
          label.y = LwgExecution.ExNode.y - label.height / 2 + 4;
          label.zOrder = 100;
          LwgAni2D.fadeOut(label, 0, 1, 200, 150, () => {
              LwgAni2D.leftRight_Shake(LwgExecution.ExNode, 15, 60, 0, null);
              LwgAni2D.fadeOut(label, 1, 0, 600, 400, () => {
              });
          });
      }
      LwgExecution.createConsumeEx = createConsumeEx;
      class ExecutionNode extends LwgScene._ObjectBase {
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
              if (d.getDate() !== LwgExecution.addExDate.value) {
                  LwgExecution.execution.value = maxEx;
              }
              else {
                  if (d.getHours() == LwgExecution.addExHours.value) {
                      console.log(d.getMinutes(), LwgExecution.addMinutes.value);
                      LwgExecution.execution.value += (d.getMinutes() - LwgExecution.addMinutes.value);
                      if (LwgExecution.execution.value > maxEx) {
                          LwgExecution.execution.value = maxEx;
                      }
                  }
                  else {
                      LwgExecution.execution.value = maxEx;
                  }
              }
              this.Num.value = LwgExecution.execution.value.toString();
              LwgExecution.addExDate.value = d.getDate();
              LwgExecution.addExHours.value = d.getHours();
              LwgExecution.addMinutes.value = d.getMinutes();
          }
          countDownAddEx() {
              this.time++;
              if (this.time % 60 == 0) {
                  this.countNum--;
                  if (this.countNum < 0) {
                      this.countNum = 59;
                      LwgExecution.execution.value += 1;
                      this.Num.value = LwgExecution.execution.value.toString();
                      let d = new Date;
                      LwgExecution.addExHours.value = d.getHours();
                      LwgExecution.addMinutes.value = d.getMinutes();
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
              LwgTimer.frameLoop(1, this, () => {
                  if (Number(this.Num.value) >= maxEx) {
                      if (this.timeSwitch) {
                          LwgExecution.execution.value = maxEx;
                          this.Num.value = LwgExecution.execution.value.toString();
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
      LwgExecution.ExecutionNode = ExecutionNode;
  })(LwgExecution || (LwgExecution = {}));

  class _SceneName extends LwgScene._BaseName {
  }
  _SceneName.AdsHint = 'AdsHint';
  _SceneName.PersonalInfo = 'PersonalInfo';
  _SceneName.Levels = 'Levels';
  _SceneName.Levels1 = 'Levels1';
  _SceneName.CheckIn = 'CheckIn';
  _SceneName.Share = 'Share';
  _SceneName.Sweep = 'Sweep';
  _SceneName.Assembly = 'Assembly';
  _SceneName.Embattle = 'Embattle';
  _SceneName.Workshop = 'Workshop';
  _SceneName.Acquire = 'Acquire';

  class Start extends LwgScene.SceneBase {
      lwgOnAwake() {
          LwgSet.bgMusic.switch = false;
      }
      lwgButton() {
          this._btnUp(this._ImgVar('BtnStart'), () => {
              this._openScene(_SceneName.Levels);
          });
      }
  }

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

  var $Guide;
  (function ($Guide) {
      let Event;
      (function (Event) {
      })(Event = $Guide.Event || ($Guide.Event = {}));
      let Data;
      (function (Data) {
      })(Data = $Guide.Data || ($Guide.Data = {}));
  })($Guide || ($Guide = {}));
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
      class _Buff extends LwgData.Table {
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
              const Buff = LwgTools.Node.createPrefab(_Res.$prefab2D.Buff.prefab2D, Parent, [x, y], script);
              Buff['buffType'] = type;
              return Buff;
          }
      }
      _Role._Buff = _Buff;
      class _Enemy extends LwgData.Table {
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
              const element = LwgTools.Node.createPrefab(_Res.$prefab2D.Enemy.prefab2D, this.Parent);
              shellNumTime++;
              const color = LwgTools._Array.randomGetOne(['blue', 'yellow', 'red']);
              element.name = `${color}${color}`;
              let speed = LwgTools.Num.randomOneBySection(this.levelData[this._otherPro.speed][0], this.levelData[this._otherPro.speed][1]);
              speed = LwgTools.Num.randomOneHalf() == 0 ? -speed : speed;
              element['_EnemyData'] = {
                  shell: shellNumTime <= shellNum ? true : false,
                  blood: this.levelData['blood'],
                  angle: LwgTools.Num.randomOneBySection(0, 360),
                  speed: speed,
                  color: color,
              };
              element.addComponent(Script);
          }
      }
      _Role._Enemy = _Enemy;
      class _Boss extends LwgData.Table {
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
              const element = LwgTools.Node.createPrefab(_Res.$prefab2D.Boss.prefab2D, Parent);
              element.name = `Boss`;
              let speed = LwgTools.Num.randomOneBySection(this.speed[0], this.speed[1]);
              speed = LwgTools.Num.randomOneHalf() == 0 ? -speed : speed;
              element['_EnemyData'] = {
                  blood: this.blood,
                  angle: LwgTools.Num.randomOneBySection(0, 360),
                  speed: speed,
                  sikllNameArr: this.skills,
              };
              element.addComponent(BossScript);
              return element;
          }
      }
      _Role._Boss = _Boss;
  })(_Role || (_Role = {}));

  class _EnemyBullet {
      static clearBullet(Bullet) {
          Laya.timer.clearAll(Bullet);
          Laya.Tween.clearAll(Bullet);
          Bullet.destroy(true);
      }
      static checkStageAndHero(Bullet, checkHero = true) {
          LwgTimer.frameLoop(1, Bullet, () => {
              const bool = LwgTools.Node.leaveStage(Bullet, () => {
                  this.clearBullet(Bullet);
              });
              if (!bool && checkHero) {
                  LwgEvent.notify(_Game._Event.checkEnemyBullet, [Bullet, 1]);
              }
          });
      }
      static checkNumChild(Bullet) {
          LwgTimer.frameLoop(1, Bullet, () => {
              if (Bullet.numChildren === 0) {
                  this.clearBullet(Bullet);
              }
          });
      }
      ;
      static checkHeroByChild(bullet) {
          this.checkStageAndHero(bullet, false);
          for (let index = 0; index < bullet.numChildren; index++) {
              const element = bullet.getChildAt(index);
              this.checkStageAndHero(element);
              element.name = this.Type.single;
          }
      }
      static createBase(enemy, type, checkType) {
          let prefab = _Res.$prefab2D[type]['prefab2D'];
          const bullet = LwgTools.Node.createPrefab(prefab, this.Parent, [enemy._lwg.gPoint.x, enemy._lwg.gPoint.y]);
          bullet.name = type;
          switch (checkType) {
              case this.ChekType.bullet:
                  this.checkStageAndHero(bullet);
                  break;
              case this.ChekType.child:
                  this.checkHeroByChild(bullet);
                  break;
              case this.ChekType.bulletAndchild:
                  this.checkStageAndHero(bullet);
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

  class Levels_RoleBase extends LwgScene._ObjectBase {
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
          LwgTools.Node.checkTwoDistance(Weapon, this._Owner, dis ? dis : 30, () => {
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
              this._lwgDestroyAndClear();
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
              LwgEff2D.Particle.spray(Laya.stage, this._Owner._lwg.gPoint, [10, 30]);
          }
      }
  }

  class Levels_Buff extends LwgScene._ObjectBase {
      lwgOnStart() {
          this.checkHero();
      }
      checkHero() {
          LwgTimer.frameLoop(1, this, () => {
              this._Owner.y += 5;
              !LwgTools.Node.leaveStage(this._Owner, () => {
                  this._Owner.removeSelf();
              }) && LwgTools.Node.checkTwoDistance(this._Owner, this._SceneImg('Hero'), 60, () => {
                  this._Owner.removeSelf();
                  this._evNotify(_Game._Event.checkBuff, [this._Owner['buffType']]);
              });
          });
      }
  }
  class Tree extends Levels_RoleBase {
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
          _Role._Buff._ins().createBuff(0, this._Scene, this._Owner._lwg.gPoint.x, this._Owner._lwg.gPoint.y, Levels_Buff);
      }
  }

  class Level1 {
      enemy(enemy) {
          const angleSpacing = 15;
          const speed = 5;
          LwgTimer.frameRandomLoop(120, 300, enemy, () => {
              const ep = new Laya.Point(enemy._lwg.gPoint.x, enemy._lwg.gPoint.y);
              for (let index = 0; index < 3; index++) {
                  const bullet = _EnemyBullet.EB_single(enemy);
                  let _speedAdd = 0;
                  LwgTimer.frameLoop(1, bullet, () => {
                      const point = LwgTools.Point.getRoundPosNew(index * angleSpacing + 90 - angleSpacing, _speedAdd += speed, ep);
                      bullet.pos(point.x, point.y);
                  });
              }
          });
      }
      land(enemy) {
          let time = 0;
          const speed = 5;
          LwgTimer.frameLoop(30, enemy, () => {
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
                  LwgTimer.frameLoop(1, bullet, () => {
                      const unit = 180 / num;
                      const point = LwgTools.Point.getRoundPosNew(unit * index + unit / 2, _speedAdd += speed, enemy._lwg.gPoint);
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
          LwgTimer.frameLoop(20, enemy, () => {
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
                  LwgTimer.frameLoop(1, bullet, () => {
                      const point = LwgTools.Point.getRoundPosNew(spacing * index + timeAngle, _speedAdd += speed, ep);
                      bullet.pos(point.x, point.y);
                  });
              }
          });
      }
      boss(enemy) {
          const speed = 6;
          const num = 8;
          LwgTimer.frameLoop(30, enemy, () => {
              const unit = 180 / num;
              const ep1 = new Laya.Point(enemy._lwg.gPoint.x + 100, enemy._lwg.gPoint.y);
              const ep2 = new Laya.Point(enemy._lwg.gPoint.x - 100, enemy._lwg.gPoint.y);
              for (let index = 0; index < num; index++) {
                  const bullet = _EnemyBullet.EB_single(enemy);
                  let _speedAdd = 0;
                  LwgTimer.frameLoop(1, bullet, () => {
                      const point = LwgTools.Point.getRoundPosNew(unit * index + unit / 2, _speedAdd += speed, ep1);
                      bullet.pos(point.x, point.y);
                  });
              }
              for (let index = 0; index < num; index++) {
                  const bullet = _EnemyBullet.EB_single(enemy);
                  let _speedAdd = 0;
                  LwgTimer.frameLoop(1, bullet, () => {
                      const point = LwgTools.Point.getRoundPosNew(unit * index + unit / 2, _speedAdd += speed, ep2);
                      bullet.pos(point.x, point.y);
                  });
              }
          });
      }
      heroine(enemy) {
          const speed = 10;
          const num = 6;
          const spacing = 8;
          LwgTimer.frameLoop(15, enemy, () => {
              const fA = LwgTools.Num.randomOneInt(360);
              const ep = new Laya.Point(enemy._lwg.gPoint.x, enemy._lwg.gPoint.y);
              for (let index = 0; index < num; index++) {
                  const bullet = _EnemyBullet.EB_single(enemy);
                  let _speedAdd = 0;
                  LwgTimer.frameLoop(1, bullet, () => {
                      const point = LwgTools.Point.getRoundPosNew(fA + spacing * index, _speedAdd += speed, ep);
                      bullet.pos(point.x, point.y);
                  });
              }
              for (let index = 0; index < num; index++) {
                  const bullet = _EnemyBullet.EB_single(enemy);
                  let _speedAdd = 0;
                  LwgTimer.frameLoop(1, bullet, () => {
                      const point = LwgTools.Point.getRoundPosNew(fA + spacing * index + 120, _speedAdd += speed, ep);
                      bullet.pos(point.x, point.y);
                  });
              }
              for (let index = 0; index < num; index++) {
                  const bullet = _EnemyBullet.EB_single(enemy);
                  let _speedAdd = 0;
                  LwgTimer.frameLoop(1, bullet, () => {
                      const point = LwgTools.Point.getRoundPosNew(fA + spacing * index + 240, _speedAdd += speed, ep);
                      bullet.pos(point.x, point.y);
                  });
              }
          });
      }
  }

  class Level2 {
      enemy(enemy) {
          const speed = 8;
          LwgTimer.frameRandomLoop(120, 300, enemy, () => {
              const bullet = _EnemyBullet.EB_two(enemy);
              LwgTimer.frameLoop(1, bullet, () => {
                  bullet.y += speed;
              });
          });
      }
      land(enemy) {
          const speed = 12;
          const num = 2;
          LwgTimer.frameLoop(5, enemy, () => {
              let fA = LwgTools.Num.randomOneInt(0, 180);
              for (let index = 0; index < num; index++) {
                  const ep = new Laya.Point(enemy._lwg.gPoint.x, enemy._lwg.gPoint.y);
                  const bullet = _EnemyBullet.EB_two(enemy);
                  let _speedAdd = 0;
                  bullet.rotation = fA + 90;
                  LwgTimer.frameLoop(1, bullet, () => {
                      const point = LwgTools.Point.getRoundPosNew(fA, _speedAdd += speed, ep);
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
          LwgTimer.frameLoop(3, enemy, () => {
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
                  LwgTimer.frameLoop(1, bullet, () => {
                      const point = LwgTools.Point.getRoundPosNew(spacing * index + timeAngle, _speedAdd += speed, ep);
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
          LwgTimer.frameLoop(3, enemy, () => {
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
                  LwgTimer.frameLoop(1, bullet, () => {
                      const point = LwgTools.Point.getRoundPosNew(angle, _speedAdd += speed, ep);
                      bullet.pos(point.x, point.y);
                  });
              }
          });
      }
      heroine(enemy) {
          const num = 4;
          let time = 0;
          const spacing2 = 10;
          LwgTimer.frameLoop(5, enemy, () => {
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
                  LwgTimer.frameLoop(1, bullet, () => {
                      const point = LwgTools.Point.getRoundPosNew(angle, _speedAdd += speed, ep);
                      bullet.pos(point.x, point.y);
                  });
              }
          });
      }
  }

  class _General {
      static moveByAngle(Bullet, diffX, angle, speed, rSpeed, FrameFunc, ChildMove) {
          let frameTime = 0;
          let _childMoveDelay = 0;
          if (ChildMove) {
              _childMoveDelay = ChildMove.delay ? LwgTools.Num.randomOneInt(ChildMove.delay[0], ChildMove.delay[1]) : null;
          }
          const _rSpeed = LwgTools.Num.randomOneHalf() === 0 ? rSpeed : -rSpeed;
          Bullet.rotation = angle - 90;
          let _baseRadius = 0;
          const pos = new Laya.Point(Bullet.x += diffX, Bullet.y);
          LwgTimer.frameLoop(1, Bullet, () => {
              frameTime++;
              const point = LwgTools.Point.getRoundPosNew(angle, _baseRadius += speed, pos);
              Bullet.pos(point.x, point.y);
              Bullet.rotation += _rSpeed;
              if (FrameFunc && FrameFunc.func && FrameFunc.interval) {
                  if (frameTime % FrameFunc.interval === 0) {
                      FrameFunc.func();
                  }
              }
              if (ChildMove && ChildMove.type) {
                  if (_childMoveDelay && frameTime > _childMoveDelay) {
                      this[ChildMove.type](Bullet);
                  }
              }
          });
      }
      static moveByAngle_Stretch(Bullet, minDis, diffX, angleByCenter, speed, dis, rSpeed, FrameFunc, ChildMove) {
          let frameTime = 0;
          let dir = 'add';
          let _childMoveDelay;
          if (ChildMove) {
              _childMoveDelay = ChildMove.delay ? LwgTools.Num.randomOneInt(ChildMove.delay[0], ChildMove.delay[1]) : null;
          }
          const _rSpeed = LwgTools.Num.randomOneHalf() === 0 ? rSpeed : -rSpeed;
          let _baseRadius = minDis;
          const pos = new Laya.Point(Bullet.x += diffX, Bullet.y);
          LwgTimer.frameLoop(1, Bullet, () => {
              frameTime++;
              let point;
              if (dir === 'add') {
                  point = LwgTools.Point.getRoundPosNew(angleByCenter, _baseRadius += speed, pos);
              }
              else {
                  point = LwgTools.Point.getRoundPosNew(angleByCenter, _baseRadius -= speed, pos);
              }
              Bullet.pos(point.x, point.y);
              if (_baseRadius > dis) {
                  dir = 'sub';
              }
              else if (_baseRadius <= minDis) {
                  _baseRadius = minDis;
                  dir = 'add';
              }
              Bullet.rotation += _rSpeed;
              if (FrameFunc && FrameFunc.func && FrameFunc.interval) {
                  if (frameTime % FrameFunc.interval === 0) {
                      FrameFunc.func();
                  }
              }
              if (ChildMove && ChildMove.type) {
                  if (_childMoveDelay && frameTime > _childMoveDelay) {
                      this[ChildMove.type](Bullet);
                  }
              }
          });
      }
      static moveByXY(Bullet, diffX, speedX, speedY, rSpeed, FrameFunc, ChildMove) {
          let time = 0;
          let _childMoveDelay;
          if (ChildMove) {
              _childMoveDelay = ChildMove.delay ? LwgTools.Num.randomOneInt(ChildMove.delay[0], ChildMove.delay[1]) : null;
          }
          Bullet.x += diffX;
          const _rSpeed = LwgTools.Num.randomOneHalf() === 0 ? rSpeed : -rSpeed;
          LwgTimer.frameLoop(1, Bullet, () => {
              time++;
              Bullet.x += speedX;
              Bullet.y += speedY;
              Bullet.rotation += _rSpeed;
              if (FrameFunc && FrameFunc.func && FrameFunc.interval) {
                  if (time % FrameFunc.interval === 0) {
                      FrameFunc.func();
                  }
              }
              if (ChildMove && ChildMove.type) {
                  if (_childMoveDelay && time > _childMoveDelay) {
                      this[ChildMove.type](Bullet);
                  }
              }
          });
      }
      static childStretch(ParentBullet, speed = 2, rSpeed = 5) {
          _EnemyBullet.checkNumChild(ParentBullet);
          if (ParentBullet['childStretch']) {
              return;
          }
          else {
              ParentBullet['childStretch'] = true;
              const parentLocP = ParentBullet.globalToLocal(new Laya.Point(ParentBullet.x, ParentBullet.y));
              for (let index = 0; index < ParentBullet.numChildren; index++) {
                  const ChildB = ParentBullet.getChildAt(index);
                  LwgNode._addProperty(ChildB);
                  const angle = LwgTools.Point.pointByAngleNew(parentLocP.x - ChildB.x, parentLocP.y - ChildB.y);
                  const baseDis = parentLocP.distance(ChildB.x, ChildB.y);
                  this.moveByAngle_Stretch(ChildB, baseDis, 0, angle, speed, 100, 0, null, null);
              }
          }
      }
      static childExplodebyAngle(ParentBullet, speed = 10, rSpeed = 5) {
          Laya.timer.clearAll(ParentBullet);
          _EnemyBullet.checkNumChild(ParentBullet);
          const gPosBullet = new Laya.Point(ParentBullet._lwg.gPoint.x, ParentBullet._lwg.gPoint.y);
          for (let index = 0; index < ParentBullet.numChildren; index++) {
              const ChildB = ParentBullet.getChildAt(index);
              LwgNode._addProperty(ChildB);
              const gPosChildB = new Laya.Point(ChildB._lwg.gPoint.x, ChildB._lwg.gPoint.y);
              const angle = LwgTools.Point.pointByAngleNew(gPosChildB.x - gPosBullet.x, gPosChildB.y - gPosBullet.y);
              this.moveByAngle(ChildB, 0, angle, speed, rSpeed, null, null);
          }
      }
      static _fall(Enemy, interval1, interval2, speedY = 10, rSpeed = 0, style = _EnemyBullet.Type.three_Across, delay = 0, diffX = 0, frameFunc, ChildMove) {
          LwgTimer.frameOnce(delay, Enemy, () => {
              LwgTimer.frameRandomLoop(interval1, interval2, Enemy, () => {
                  this.moveByXY(_EnemyBullet[style](Enemy), diffX, 0, speedY, rSpeed, frameFunc, ChildMove);
              });
          });
      }
      static _annular(Enemy, interval, num = 10, speed = 10, rSpeed = 0, style, delay = 0, diffX = 0, frameFunc, ChildMove) {
          LwgTimer.frameOnce(delay, Enemy, () => {
              LwgTimer.frameLoop(interval, Enemy, () => {
                  for (let index = 0; index < num; index++) {
                      this.moveByAngle(_EnemyBullet[style](Enemy), diffX, 360 / num * index, speed, rSpeed, frameFunc, ChildMove);
                  }
              });
          });
      }
      static _spiral(Enemy, interval, num, spacingAngle, speed = 10, rSpeed = 0, style = _EnemyBullet.Type.single, delay = 0, diffX = 0, frameFunc, ChildMove) {
          let time = 0;
          LwgTimer.frameOnce(delay, Enemy, () => {
              LwgTimer.frameLoop(interval, Enemy, () => {
                  time++;
                  const fA = 0;
                  const ep = new Laya.Point(Enemy._lwg.gPoint.x + diffX, Enemy._lwg.gPoint.y);
                  for (let index = 0; index < num; index++) {
                      let angle = fA + time * spacingAngle;
                      angle += index * 360 / num;
                      this.moveByAngle(_EnemyBullet[style](Enemy), diffX, angle, speed, rSpeed, frameFunc, ChildMove);
                  }
              });
          });
      }
      static _slapDown(Enemy, interval = 3, startAngle = 0, endAngle = 180, spacingAngle = 15, speed = 10, rSpeed = 0, style = _EnemyBullet.Type.single, delay = 0, diffX = 0, frameFunc, ChildMove) {
          LwgTimer.frameOnce(delay, Enemy, () => {
              let time = 0;
              LwgTimer.frameLoop(interval, Enemy, () => {
                  let angle = time * spacingAngle;
                  if (angle > endAngle) {
                      Enemy['angleState'] = 'sub';
                  }
                  if (angle <= startAngle) {
                      Enemy['angleState'] = 'add';
                  }
                  if (Enemy['angleState'] === 'sub') {
                      time--;
                  }
                  else {
                      time++;
                  }
                  this.moveByAngle(_EnemyBullet[style](Enemy), diffX, angle, speed, rSpeed, frameFunc, ChildMove);
              });
          });
      }
      static _randomAngleDown(Enemy, interval1, interval2, speed = 10, rSpeed = 0, style = _EnemyBullet.Type.single, delay = 0, diffX = 0, frameFunc, ChildMove) {
          LwgTimer.frameOnce(delay, Enemy, () => {
              LwgTimer.frameRandomLoop(interval1, interval2, Enemy, () => {
                  this.moveByAngle(_EnemyBullet[style](Enemy), diffX, LwgTools.Num.randomOneInt(0, 180), speed, rSpeed, frameFunc, ChildMove);
              });
          });
      }
      static _evenDowByCenter(Enemy, interval = 5, num = 2, spacing = 30, speed = 10, rSpeed = 0, style = _EnemyBullet.Type.three_Triangle, delay = 0, diffX = 0, frameFunc, ChildMove) {
          LwgTimer.frameOnce(delay, Enemy, () => {
              rSpeed = LwgTools.Num.randomOneHalf() === 0 ? rSpeed : -rSpeed;
              LwgTimer.frameLoop(interval, Enemy, () => {
                  for (let index = 0; index < num; index++) {
                      let angle = index * (180 - spacing * 2) / (num - 1) + spacing;
                      this.moveByAngle(_EnemyBullet[style](Enemy), diffX, angle, speed, rSpeed, frameFunc, ChildMove);
                  }
              });
          });
      }
      static _assignAngle(Enemy, interval = 20, angle = 30, num = 2, numFrameInterval = 10, speed = 10, rSpeed = 0, style = _EnemyBullet.Type.single, delay = 0, diffX = 0, frameFunc, ChildMove) {
          LwgTimer.frameOnce(delay, Enemy, () => {
              LwgTimer.frameLoop(interval, Enemy, () => {
                  for (let index = 0; index < num; index++) {
                      LwgTimer.frameOnce(numFrameInterval * index, Enemy, () => {
                          this.moveByAngle(_EnemyBullet[style](Enemy), diffX, angle, speed, rSpeed, frameFunc, ChildMove);
                      });
                  }
              });
          });
      }
  }
  _General.ChildMoveType = {
      childExplodebyAngle: 'childExplodebyAngle',
      childStretch: 'childStretch',
  };

  class Level6 {
      enemy(enemy) {
          _General._fall(enemy, 200, 200, 5, 0, _EnemyBullet.Type.four_Square, 0, 0, null, { type: _General.ChildMoveType.childStretch, delay: [1, 1] });
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

  class Levels_Land extends Levels_RoleBase {
      constructor() {
          super(...arguments);
          this.landStage = false;
      }
      lwgOnAwake() {
          this.bloodInit(100);
          this._ImgChild('Blood').visible = false;
          LwgTimer.frameLoop(1, this, () => {
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

  class Levels_Heroine extends Levels_RoleBase {
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
          LwgTimer.frameLoop(1, this, () => {
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

  class Levels_Enemy extends Levels_RoleBase {
      lwgOnAwake() {
          this.generalProInit();
          this.bloodInit(this._Owner['_EnemyData']['blood']);
          this.ranAttackNum = LwgTools.Num.randomOneBySection(1, 3, true);
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
          LwgTimer.frameNumLoop(1, time, this, () => {
              radius += radiusSpeed;
              let point = LwgTools.Point.getRoundPosNew(this._Owner.rotation, radius, new Laya.Point(this._SceneImg('Land').width / 2, this._SceneImg('Land').height / 2));
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
          LwgTimer.frameLoop(1, this, () => {
              let point = LwgTools.Point.getRoundPosNew(this._Owner.rotation += this.speed, 220, new Laya.Point(this._SceneImg('Land').width / 2, this._SceneImg('Land').height / 2));
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
              LwgTools.Node.createPrefab(_Res.$prefab2D.Heroine.prefab2D, this._Parent, [this._Owner.x, this._Owner.y], Levels_Heroine);
          }
          else {
              this._evNotify(_Game._Event.addEnemy);
          }
      }
  }

  class Levels_HeroWeapon extends LwgScene._ObjectBase {
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
          LwgTimer.frameLoop(1, this, () => {
              this.move();
          });
      }
      move() {
          if (this.getSpeed() > 0) {
              let p = LwgTools.Point.angleAndLenByPoint(this._Owner.rotation - 90, this.getSpeed());
              this._Owner.x += p.x;
              this._Owner.y += p.y;
          }
          else {
              this._Owner.y += this.getDropSpeed();
          }
          const leave = LwgTools.Node.leaveStage(this._Owner, () => {
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
          LwgTimer.frameLoop(1, this, () => {
              this._Owner.y += 40;
              this._Owner.rotation += 10;
              LwgTools.Node.leaveStage(this._Owner, () => {
                  this._Owner.destroy();
              });
          });
      }
  }

  class Levels_HeroAttack {
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
          const Weapon = LwgTools.Node.createPrefab(_Res.$prefab2D.Weapon.prefab2D);
          this.WeaponParent.addChild(Weapon);
          Weapon.addComponent(Levels_HeroWeapon);
          Weapon.pos(x, y);
          const Pic = Weapon.getChildByName('Pic');
          Pic.skin = style ? `Game/UI/Game/Hero/Hero_01_weapon_${style}.png` : `Lwg/UI/rectangle_05.png`;
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

  class Levels_Hero extends Levels_RoleBase {
      lwgOnAwake() {
          this.bloodInit(5000);
          this.attackInterval = 10;
          this._HeroAttack = new Levels_HeroAttack(this._SceneImg('WeaponParent'), this._Owner);
          this._HeroAttack.ballisticNum = 1;
      }
      lwgOnStart() {
          LwgTimer.frameLoop(this.attackInterval, this, () => {
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

  class Levels_Boss extends Levels_Enemy {
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
          LwgTimer.frameLoop(1, this, () => {
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

  class Levels_EnemyHouse extends Levels_RoleBase {
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
          new _Role._Boss(this._SceneImg('BossParent'), Levels_Boss);
      }
  }

  class Levels extends LwgScene.SceneBase {
      lwgOnAwake() {
          this._Owner['Hero'] = LwgTools.Node.createPrefab(_Res.$prefab2D.Hero.prefab2D, this._Owner, [Laya.stage.width / 2, Laya.stage.height * 2 / 3]);
          this._ImgVar('Hero').addComponent(Levels_Hero);
          for (let index = 0; index < this._ImgVar('MiddleScenery').numChildren; index++) {
              const element = this._ImgVar('MiddleScenery').getChildAt(index);
              if (element.name == 'Tree') {
                  element.addComponent(Tree);
              }
          }
          this._ImgVar('Land').addComponent(Levels_Land);
          this._ImgVar('EnemyHouse').addComponent(Levels_EnemyHouse);
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
                  this._Enemy.createEnmey(Levels_Enemy);
              }
          });
          this._evReg(_Game._Event.addEnemy, () => {
              if (this._Enemy.quantity > 0) {
                  this._Enemy.createEnmey(Levels_Enemy);
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
  class Levels1 extends Levels {
  }

  class _PreLoadCutIn extends LwgPreLoad._PreLoadCutInScene {
      lwgOpenAniAfter() {
      }
      lwgAllComplete() {
          return 10;
      }
      lwgOnDisable() {
      }
  }

  class _PreLoad extends LwgPreLoad._PreLoadScene {
      lwgOnAwake() {
      }
      lwgOnStart() {
          this.lwgStartLoding(_Res);
      }
      lwgStepComplete() {
      }
      lwgAllComplete() {
          this._openScene(_SceneName.Start);
          return 2000;
      }
      lwgOnDisable() {
      }
  }

  class _GameAni {
      static _dialogOpenPopup(Content, Bg, func) {
          Content.scene.zOrder = Laya.stage.numChildren - 1;
          const time = 100;
          const delay = 100;
          Content.scale(0.5, 0.5);
          LwgAni2D.bombs_Appear(Content, 0, 1, 1.2, 0, time * 3, () => {
              func && func();
          });
          if (Bg) {
              Bg.alpha = 0;
              LwgAni2D.fadeOut(Bg, 0, 1, 200, delay * 2);
          }
          return time * 3;
      }
      static _dialogOpenFadeOut(Content, Bg, func) {
          Bg && LwgAni2D.fadeOut(Bg, 0, 1, 300, 0, () => {
              func && func();
          });
          LwgAni2D.fadeOut(Content, 0, 1, 250, 0, () => {
              !Bg && func && func();
          });
          return 300;
      }
      static _dialogCloseFadeOut(Content, Bg, func) {
          const time = 60;
          const delay = 100;
          LwgAni2D.fadeOut(Content, 1, 0, time * 3, delay * 1.5, () => {
              func && func();
          });
          Bg && LwgAni2D.fadeOut(Bg, 1, 0, time * 3);
          return time * 3 + delay * 1.5;
      }
      static _charactersEffect(label, bodyText, func) {
          for (let index = 0; index < bodyText.length; index++) {
              const char = bodyText.charAt(index);
              LwgTimer.frameOnce(10 * index, this, () => {
                  label.text += char;
                  if (index == bodyText.length - 1) {
                      func && func();
                  }
              });
          }
      }
      static _scaleHint(Node) {
          LwgTimer._loop(1000, this, () => {
              LwgAni2D.swell_shrink(Node, 1, 1.05, 300);
          });
      }
      static _fadeHint(Node) {
          LwgAni2D.fadeOut(Node, 0, 0.6, 1500, 0, () => {
              LwgAni2D.fadeOut(Node, 0.6, 0, 800, 0, () => {
                  LwgTimer.frameOnce(30, this, () => {
                      this._fadeHint(Node);
                  });
              });
          });
      }
  }

  class _Guide extends LwgScene.SceneBase {
      constructor() {
          super(...arguments);
          this.btnComX = Laya.stage.width - 250;
          this.btnComY = 70;
          this.bgType = {
              present: 'present',
              vanish: 'vanish',
              appear: 'appear',
          };
      }
      lwgOpenAni() {
          return 200;
      }
      lwgOnAwake() {
          this._ImgVar('Hand').scale(0, 0);
          this._ImgVar('Slide').scale(0, 0);
      }
      clickEffcet() {
          LwgEff2D.Aperture.continuous(this._Owner, [this._ImgVar('Hand').x, this._ImgVar('Hand').y + 28], [6, 6], null, null, [LwgEff2D.SkinUrl.圆形小光环], null, this._ImgVar('Hand').zOrder - 1, [1.2, 1.2], [0.6, 0.6], [0.01, 0.01]);
      }
      boreholeCircle(arr, handX, handY, func) {
          for (let index = 0; index < arr.length; index++) {
              const time = 80 / 8;
              let radiusBase = 15;
              const element = arr[index];
              const speed = (arr[index][2] - radiusBase) / time;
              LwgTimer.frameNumLoop(1, time, this, () => {
                  radiusBase += speed;
                  element[2] = radiusBase;
                  LwgTools.Draw.reverseCircleMask(this._ImgVar('Background'), arr, true);
              }, () => {
                  func && func();
              }, true);
          }
          handX && this._ImgVar('Hand').pos(handX, handY - 30);
      }
      boreholeRoundrect(arr, handX, handY, func) {
          handX && this._ImgVar('Hand').pos(handX, handY);
          for (let index = 0; index < arr.length; index++) {
              let widthBase = 0;
              let heightBase = 0;
              let radiuBase = 0;
              const element = arr[index];
              const time = 20;
              const speedX = (element[2] - widthBase) / time;
              const speedY = (element[3] - heightBase) / time;
              const speedR = (element[4] - radiuBase) / time;
              LwgTimer.frameNumLoop(1, time, this, () => {
                  widthBase += speedX;
                  heightBase += speedY;
                  radiuBase += speedR;
                  element[2] = widthBase;
                  element[3] = heightBase;
                  element[4] = radiuBase;
                  LwgTools.Draw.reverseRoundrectMask(this._ImgVar('Background'), arr, true);
              }, () => {
                  func && func();
              }, true);
          }
          handX && this._ImgVar('Hand').pos(handX, handY);
      }
      handAppear(delay, func) {
          const time = 200;
          LwgAni2D.scale(this._ImgVar('Hand'), 0, 0, 1, 1, time, delay ? delay : 0, () => {
              func && func();
          });
          this._ImgVar('HandPic').rotation = -17;
      }
      bgAppear(delay, func) {
          LwgTools.Node.destroyAllChildren(this._ImgVar('Background'));
          const time = 300;
          this._ImgVar('HandPic').rotation = -17;
          LwgAni2D.fadeOut(this._ImgVar('Background'), 0, 1, time, delay ? delay : 0, () => {
              func && func();
          });
      }
      handVanish(delay, func) {
          const time = 300;
          this._ImgVar('HandPic').rotation = -17;
          LwgAni2D.scale(this._ImgVar('Hand'), 1, 1, 0, 0, time, delay ? delay : 0, () => {
              func && func();
          });
      }
      bgVanish(delay, func) {
          const time = 300;
          LwgAni2D.fadeOut(this._ImgVar('Background'), 1, 0, time, delay ? delay : 0, () => {
              func && func();
          });
      }
      handMove(x, y, func, bgType) {
          this.handClear();
          const _y = y - 30;
          const point = new Laya.Point(this._ImgVar('Hand').x, this._ImgVar('Hand').y);
          const time = point.distance(x, _y);
          LwgAni2D.move(this._ImgVar('Hand'), x, _y, time, () => {
              func && func();
          });
          this._ImgVar('Hand').scale(1, 1);
          LwgAni2D.move(this._ImgVar('HandPic'), 75, 56, time);
          switch (bgType) {
              case this.bgType.vanish:
                  this.bgVanish();
                  break;
              case this.bgType.appear:
                  this.bgAppear();
                  break;
              default:
                  break;
          }
      }
      handClear() {
          LwgTimer.clearAll([this._ImgVar('Hand')]);
          LwgAni2D.clearAll([this._ImgVar('Hand')]);
          this._AniVar('Frame').stop();
          this._AniVar('Click').stop();
          this._AniVar('ClickOne').stop();
          this._ImgVar('Hand').visible = true;
          this._ImgVar('HandPic').scale(1, 1);
          this._ImgVar('HandPic').rotation = -17;
          this._ImgVar('Hand').pos(this._ImgVar('HandPic')._lwg.gPoint.x - 75, this._ImgVar('HandPic')._lwg.gPoint.y - 56);
          this._ImgVar('HandPic').pos(75, 56);
      }
      slideUpAppear(x, y, width, height, radius, delay) {
          this.bgAppear(delay ? delay : 0, () => {
              this.boreholeRoundrect([[x, y, width, height, radius]], null, null, () => {
                  this._ImgVar('Hand').scale(0, 0);
                  this._ImgVar('Slide').scale(1, 1);
                  this._ImgVar('Slide').pos(x, y);
                  this._AniVar('SlideUp').play();
              });
          });
      }
      noMoveRoundrect(x, y, width, height, radius, delay, handX, handY) {
          this.bgAppear(delay ? delay : 0, () => {
              this.boreholeRoundrect([[x, y, width, height, radius]], handX ? handX : x, handY ? handY : y - 30, () => {
                  this.handAppear(null, () => {
                      this._AniVar('Click').play();
                  });
              });
          });
      }
      moveRoundrectNoBg(x, y, width, height, radius) {
          this.boreholeRoundrect([[x, y, width, height, radius]], null, null, () => {
              this.handMove(x, y, () => {
                  this._AniVar('Click').play();
              });
          });
      }
      noMoveCircle(x, y, radius) {
          this.bgAppear(0, () => {
              this.boreholeCircle([[x, y, radius]], x, y, () => {
                  this.handAppear(200, () => {
                      this._AniVar('Click').play();
                  });
              });
          });
      }
      moveCircleBg(x, y, radius) {
          this.bgAppear(0, () => {
              this.boreholeCircle([[x, y, radius]], null, null, () => {
                  this.handMove(x, y, () => {
                      this._AniVar('Click').play();
                  });
              });
          });
      }
      moveCircleNoBg(x, y, radius) {
          this.boreholeCircle([[x, y, radius]], null, null, () => {
              this.handMove(x, y, () => {
                  this._AniVar('Click').play();
              });
          });
      }
      lwgEvent() {
      }
      lwgCloseAni() {
          return _GameAni._dialogCloseFadeOut(this._ImgVar('Hand'), this._ImgVar('Background'));
      }
      lwgOnDisable() {
          this._ImgVar('Background').destroy();
      }
  }

  class _Parameter extends LwgScene.SceneBase {
      lwgOnAwake() {
      }
      lwgButton() {
      }
  }

  class Defeated extends LwgScene.SceneBase {
      lwgButton() {
          this._btnUp(this._ImgVar('BtnBack'), () => {
              this._openScene('Start');
              this._evNotify(_Game._Event.closeScene);
          });
      }
  }

  class Victory extends LwgScene.SceneBase {
      lwgButton() {
          this._btnUp(this._ImgVar('BtnGet'), () => {
              this._openScene('Start');
              LwgEvent.notify(_Game._Event.closeScene);
          });
      }
  }

  class _Init extends LwgInit._InitScene {
      lwgOnAwake() {
          LwgPlatform.Ues.value = LwgPlatform.Tpye.Bytedance;
          Laya.Stat.show();
          Laya.MouseManager.multiTouchEnabled = false;
          LwgSceneAni.Use.value = {
              class: LwgSceneAni._fadeOut.Open,
              type: null,
          };
          LwgClick.Use.value = LwgClick._Type.largen;
          LwgAdaptive.Use.value = [720, 1280];
          LwgScene.SceneScript = [
              _PreLoad,
              _PreLoadCutIn,
              _Guide,
              _Parameter,
              Start,
              Levels,
              Defeated,
              Victory,
          ];
      }
      lwgOnStart() {
          this._openScene(_SceneName._PreLoad);
      }
  }

  class GameConfig {
      constructor() {
      }
      static init() {
          var reg = Laya.ClassUtils.regClass;
          reg("script/Game/General/_Init.ts", _Init);
      }
  }
  GameConfig.width = 720;
  GameConfig.height = 1280;
  GameConfig.scaleMode = "fixedwidth";
  GameConfig.screenMode = "vertical";
  GameConfig.alignV = "top";
  GameConfig.alignH = "left";
  GameConfig.startScene = "Scene/_Init.scene";
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
