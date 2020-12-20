(function () {
    'use strict';

    var lwg;
    (function (lwg) {
        let Dialogue;
        (function (Dialogue) {
            let Skin;
            (function (Skin) {
                Skin["blackBord"] = "Frame/UI/ui_orthogon_black.png";
            })(Skin || (Skin = {}));
            function createHint_Middle(describe) {
                let Hint_M = Laya.Pool.getItemByClass('Hint_M', Laya.Sprite);
                Hint_M.name = 'Hint_M';
                Laya.stage.addChild(Hint_M);
                Hint_M.width = Laya.stage.width;
                Hint_M.height = 100;
                Hint_M.pivotY = Hint_M.height / 2;
                Hint_M.pivotX = Laya.stage.width / 2;
                Hint_M.x = Laya.stage.width / 2;
                Hint_M.y = Laya.stage.height / 2;
                Hint_M.zOrder = 100;
                let Pic = new Laya.Image();
                Hint_M.addChild(Pic);
                Pic.skin = Skin.blackBord;
                Pic.width = Laya.stage.width;
                Pic.pivotX = Laya.stage.width / 2;
                Pic.height = 100;
                Pic.pivotY = Pic.height / 2;
                Pic.y = Hint_M.height / 2;
                Pic.x = Laya.stage.width / 2;
                Pic.alpha = 0.6;
                let Dec = new Laya.Label();
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
                Animation2D.scale_Alpha(Hint_M, 0, 1, 0, 1, 1, 1, 200, 0, f => {
                    Animation2D.fadeOut(Dec, 0, 1, 150, 0, f => {
                        Animation2D.fadeOut(Dec, 1, 0, 200, 800, f => {
                            Animation2D.scale_Alpha(Hint_M, 1, 1, 1, 1, 0, 0, 200, 0, f => {
                                Hint_M.removeSelf();
                            });
                        });
                    });
                });
            }
            Dialogue.createHint_Middle = createHint_Middle;
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
                let arr = [];
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
                        Animation2D.scale_Alpha(Pre_Dialogue, 0, 0, 0, 1, 1, 1, 150, 1000, () => {
                            for (let index = 0; index < contentArr.length; index++) {
                                Laya.timer.once(index * delayed, this, () => {
                                    ContentLabel.text = contentArr[index];
                                    if (index == contentArr.length - 1) {
                                        Laya.timer.once(delayed, this, () => {
                                            Animation2D.scale_Alpha(Pre_Dialogue, 1, 1, 1, 0, 0, 0, 150, 1000, () => {
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
        })(Dialogue = lwg.Dialogue || (lwg.Dialogue = {}));
        let Gold;
        (function (Gold_1) {
            Gold_1._num = {
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
                if (Gold_1.GoldNode) {
                    Gold_1.GoldNode.removeSelf();
                }
                let sp;
                Laya.loader.load('Prefab/LwgGold.json', Laya.Handler.create(this, function (prefab) {
                    let _prefab = new Laya.Prefab();
                    _prefab.json = prefab;
                    sp = Laya.Pool.getItemByCreateFun('gold', _prefab.create, _prefab);
                    let Num = sp.getChildByName('Num');
                    Num.text = Tools._Format.formatNumber(Gold_1._num.value);
                    parent.addChild(sp);
                    sp.pos(x, y);
                    sp.zOrder = 100;
                    Gold_1.GoldNode = sp;
                }));
            }
            Gold_1._createGoldNode = _createGoldNode;
            function _add(number) {
                Gold_1._num.value += Number(number);
                let Num = Gold_1.GoldNode.getChildByName('Num');
                Num.text = Tools._Format.formatNumber(Gold_1._num.value);
            }
            Gold_1._add = _add;
            function _addDisPlay(number) {
                let Num = Gold_1.GoldNode.getChildByName('Num');
                Num.value = (Number(Num.value) + Number(number)).toString();
            }
            Gold_1._addDisPlay = _addDisPlay;
            function _addNoDisPlay(number) {
                Gold_1._num.value += Number(number);
            }
            Gold_1._addNoDisPlay = _addNoDisPlay;
            function _nodeAppear(delayed, x, y) {
                if (!Gold_1.GoldNode) {
                    return;
                }
                if (delayed) {
                    Animation2D.scale_Alpha(Gold_1.GoldNode, 0, 1, 1, 1, 1, 1, delayed, 0, f => {
                        Gold_1.GoldNode.visible = true;
                    });
                }
                else {
                    Gold_1.GoldNode.visible = true;
                }
                if (x) {
                    Gold_1.GoldNode.x = x;
                }
                if (y) {
                    Gold_1.GoldNode.y = y;
                }
            }
            Gold_1._nodeAppear = _nodeAppear;
            function _nodeVinish(delayed) {
                if (!Gold_1.GoldNode) {
                    return;
                }
                if (delayed) {
                    Animation2D.scale_Alpha(Gold_1.GoldNode, 1, 1, 1, 1, 1, 0, delayed, 0, f => {
                        Gold_1.GoldNode.visible = false;
                    });
                }
                else {
                    Gold_1.GoldNode.visible = false;
                }
            }
            Gold_1._nodeVinish = _nodeVinish;
            let SkinUrl;
            (function (SkinUrl) {
                SkinUrl[SkinUrl["Frame/Effects/iconGold.png"] = 0] = "Frame/Effects/iconGold.png";
            })(SkinUrl || (SkinUrl = {}));
            function _createOne(width, height, url) {
                let Gold = Laya.Pool.getItemByClass('addGold', Laya.Image);
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
                if (Gold_1.GoldNode) {
                    Gold.zOrder = Gold_1.GoldNode.zOrder + 10;
                }
                return Gold;
            }
            Gold_1._createOne = _createOne;
            function _getAni_Single(parent, number, width, height, url, firstPoint, targetPoint, func1, func2) {
                for (let index = 0; index < number; index++) {
                    Laya.timer.once(index * 30, this, () => {
                        let Gold = _createOne(width, height, url);
                        parent.addChild(Gold);
                        Animation2D.move_Scale(Gold, 1, firstPoint.x, firstPoint.y, targetPoint.x, targetPoint.y, 1, 350, 0, null, () => {
                            Audio._playSound(Audio._voiceUrl.huodejinbi);
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
            Gold_1._getAni_Single = _getAni_Single;
            function _getAni_Heap(parent, number, width, height, url, firstPoint, targetPoint, func1, func2) {
                for (let index = 0; index < number; index++) {
                    let Gold = _createOne(width ? width : 100, height ? height : 100, url ? url : SkinUrl[0]);
                    parent = parent ? parent : Laya.stage;
                    parent.addChild(Gold);
                    firstPoint = firstPoint ? firstPoint : new Laya.Point(Laya.stage.width / 2, Laya.stage.height / 2);
                    targetPoint = targetPoint ? targetPoint : new Laya.Point(Gold_1.GoldNode.x, Gold_1.GoldNode.y);
                    let x = Math.floor(Math.random() * 2) == 1 ? firstPoint.x + Math.random() * 100 : firstPoint.x - Math.random() * 100;
                    let y = Math.floor(Math.random() * 2) == 1 ? firstPoint.y + Math.random() * 100 : firstPoint.y - Math.random() * 100;
                    Animation2D.move_Scale(Gold, 0.5, firstPoint.x, firstPoint.y, x, y, 1, 300, Math.random() * 100 + 100, Laya.Ease.expoIn, () => {
                        Animation2D.move_Scale(Gold, 1, Gold.x, Gold.y, targetPoint.x, targetPoint.y, 1, 400, Math.random() * 200 + 100, Laya.Ease.cubicOut, () => {
                            Audio._playSound(Audio._voiceUrl.huodejinbi);
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
            Gold_1._getAni_Heap = _getAni_Heap;
        })(Gold = lwg.Gold || (lwg.Gold = {}));
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
        })(EventAdmin = lwg.EventAdmin || (lwg.EventAdmin = {}));
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
                let d = new Date;
                DateAdmin._loginInfo = StorageAdmin._arrayArr('DateAdmin._loginInfo');
                DateAdmin._loginInfo.value.push([d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getDay(), d.getHours(), d.getMinutes(), d.getSeconds()]);
                let arr = [];
                if (DateAdmin._loginInfo.value.length > 0) {
                    for (let index = 0; index < DateAdmin._loginInfo.value.length; index++) {
                        arr.push(DateAdmin._loginInfo.value[index]);
                    }
                }
                arr.push([d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getDay(), d.getHours(), d.getMinutes(), d.getSeconds()]);
                DateAdmin._loginInfo.value = arr;
                DateAdmin._loginCount = StorageAdmin._mum('DateAdmin._loginCount');
                DateAdmin._loginCount.value++;
                DateAdmin._loginToday.num++;
            }
            DateAdmin._init = _init;
            DateAdmin._loginToday = {
                get num() {
                    return Laya.LocalStorage.getItem('DateAdmin._loginToday') ? Number(Laya.LocalStorage.getItem('DateAdmin._loginToday')) : 0;
                },
                set num(val) {
                    if (DateAdmin._date.date == DateAdmin._loginInfo.value[DateAdmin._loginInfo.value.length - 1][2]) {
                        Laya.LocalStorage.setItem('DateAdmin._loginToday', val.toString());
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
        })(DateAdmin = lwg.DateAdmin || (lwg.DateAdmin = {}));
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
                    let delay = Tools._Number.randomOneInt(delay1, delay2);
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
                if (immediately) {
                    if (TimerAdmin._switch) {
                        method();
                    }
                }
                let num0 = 0;
                var func = () => {
                    let delay = Tools._Number.randomOneInt(delay1, delay2);
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
                if (immediately) {
                    if (TimerAdmin._switch) {
                        method();
                    }
                }
                let num0 = 0;
                var func = () => {
                    let delay = Tools._Number.randomOneInt(delay1, delay2);
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
            TimerAdmin._frameNumRandomLoop = _frameNumRandomLoop;
            function _frameOnce(delay, caller, afterMethod, beforeMethod, args, coverBefore) {
                if (beforeMethod) {
                    beforeMethod();
                }
                Laya.timer.frameOnce(delay, caller, () => {
                    afterMethod();
                }, args, coverBefore);
            }
            TimerAdmin._frameOnce = _frameOnce;
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
                    let delay = Tools._Number.randomOneInt(delay1, delay2);
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
            function _once(delay, afterMethod, beforeMethod, args, coverBefore) {
                if (beforeMethod) {
                    beforeMethod();
                }
                let caller = {};
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
        })(TimerAdmin = lwg.TimerAdmin || (lwg.TimerAdmin = {}));
        let Adaptive;
        (function (Adaptive) {
            Adaptive._Use = {
                get value() {
                    return this['Adaptive_value'] ? this['Adaptive_value'] : null;
                },
                set value(val) {
                    this['Adaptive_value'] = val;
                }
            };
            function _stageWidth(arr) {
                for (let index = 0; index < arr.length; index++) {
                    const element = arr[index];
                    if (element.pivotX == 0 && element.width) {
                        element.x = element.x / Adaptive._Use.value[0] * Laya.stage.width + element.width / 2;
                    }
                    else {
                        element.x = element.x / Adaptive._Use.value[0] * Laya.stage.width;
                    }
                }
            }
            Adaptive._stageWidth = _stageWidth;
            function _stageHeight(arr) {
                for (let index = 0; index < arr.length; index++) {
                    const element = arr[index];
                    if (element.pivotY == 0 && element.height) {
                        element.y = element.y / Adaptive._Use.value[1] * element.scaleX * Laya.stage.height + element.height / 2;
                    }
                    else {
                        element.y = element.y / Adaptive._Use.value[1] * element.scaleX * Laya.stage.height;
                    }
                }
            }
            Adaptive._stageHeight = _stageHeight;
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
            Adaptive._center = _center;
        })(Adaptive = lwg.Adaptive || (lwg.Adaptive = {}));
        let Platform;
        (function (Platform) {
            Platform._Tpye = {
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
            Platform._Ues = {
                get value() {
                    return this['_platform_name'] ? this['_platform_name'] : null;
                },
                set value(val) {
                    this['_platform_name'] = val;
                    switch (val) {
                        case Platform._Tpye.WebTest:
                            Laya.LocalStorage.clear();
                            Gold._num.value = 5000;
                            break;
                        case Platform._Tpye.Research:
                            Laya.Stat.show();
                            Gold._num.value = 50000000000000;
                            break;
                        default:
                            break;
                    }
                }
            };
        })(Platform = lwg.Platform || (lwg.Platform = {}));
        let SceneAnimation;
        (function (SceneAnimation) {
            SceneAnimation._Type = {
                fadeOut: 'fadeOut',
                stickIn: {
                    randomstickIn: 'randomstickIn',
                    upLeftDownLeft: 'upLeftDownRight',
                    upRightDownLeft: 'upRightDownLeft',
                },
                shutters: {
                    crosswise: 'crosswise',
                    vertical: 'vertical',
                    lSideling: 'lSideling',
                    rSideling: 'rSideling',
                    intersection1: 'intersection1',
                    intersection2: 'intersection2',
                    randomshutters: 'randomshutters',
                },
                leftMove: 'leftMove',
                rightMove: 'rightMove',
                centerRotate: 'centerRotate',
                drawUp: 'drawUp',
            };
            SceneAnimation._openSwitch = true;
            SceneAnimation._closeSwitch = false;
            SceneAnimation._Use = {
                get value() {
                    return this['SceneAnimation_name'] ? this['SceneAnimation_name'] : null;
                },
                set value(val) {
                    this['SceneAnimation_name'] = val;
                }
            };
            function _commonOpenAni(Scene) {
                let sumDelay = 0;
                var afterAni = () => {
                    Click._switch = true;
                    if (Scene[Scene.name]) {
                        Scene[Scene.name].lwgOpenAniAfter();
                        Scene[Scene.name].lwgButton();
                        Admin._SceneChange._close();
                    }
                };
                if (!SceneAnimation._openSwitch) {
                    afterAni();
                    return 0;
                }
                switch (SceneAnimation._Use.value) {
                    case SceneAnimation._Type.fadeOut:
                        sumDelay = _fadeOut_Open(Scene);
                        break;
                    case SceneAnimation._Type.stickIn.randomstickIn:
                        sumDelay = _stickIn(Scene, SceneAnimation._Type.stickIn.randomstickIn);
                    case SceneAnimation._Type.stickIn.upLeftDownLeft:
                        sumDelay = _stickIn(Scene, SceneAnimation._Type.stickIn.upLeftDownLeft);
                        break;
                    case SceneAnimation._Type.stickIn.upRightDownLeft:
                        sumDelay = _stickIn(Scene, SceneAnimation._Type.stickIn.upRightDownLeft);
                    case SceneAnimation._Type.stickIn.randomstickIn:
                        sumDelay = _stickIn(Scene, SceneAnimation._Type.stickIn.randomstickIn);
                    case SceneAnimation._Type.shutters.lSideling:
                        sumDelay = _shutters_Open(Scene, SceneAnimation._Type.shutters.lSideling);
                    default:
                        sumDelay = _fadeOut_Open(Scene);
                        break;
                }
                Laya.timer.once(sumDelay, this, () => {
                    afterAni();
                });
                return sumDelay;
            }
            SceneAnimation._commonOpenAni = _commonOpenAni;
            function _commonCloseAni(CloseScene, closeFunc) {
                CloseScene[CloseScene.name].lwgBeforeCloseAni();
                let sumDelay = 0;
                switch (SceneAnimation._Use.value) {
                    case SceneAnimation._Type.fadeOut:
                        sumDelay = _fadeOut_Close(CloseScene);
                        break;
                    case SceneAnimation._Type.stickIn.upLeftDownLeft:
                        break;
                    case SceneAnimation._Type.stickIn.upRightDownLeft:
                        break;
                    case SceneAnimation._Type.stickIn.randomstickIn:
                        break;
                    case SceneAnimation._Type.shutters.vertical:
                        sumDelay = _shutters_Close(CloseScene, SceneAnimation._Type.shutters.vertical);
                        break;
                    case SceneAnimation._Type.shutters.crosswise:
                        sumDelay = _shutters_Close(CloseScene, SceneAnimation._Type.shutters.crosswise);
                        break;
                    case SceneAnimation._Type.shutters.lSideling:
                        sumDelay = _shutters_Close(CloseScene, SceneAnimation._Type.shutters.lSideling);
                        break;
                    case SceneAnimation._Type.shutters.rSideling:
                        sumDelay = _shutters_Close(CloseScene, SceneAnimation._Type.shutters.rSideling);
                        break;
                    case SceneAnimation._Type.shutters.intersection1:
                        sumDelay = _shutters_Close(CloseScene, SceneAnimation._Type.shutters.intersection1);
                        break;
                    case SceneAnimation._Type.shutters.intersection2:
                        sumDelay = _shutters_Close(CloseScene, SceneAnimation._Type.shutters.intersection2);
                        break;
                    case SceneAnimation._Type.shutters.randomshutters:
                        sumDelay = _shutters_Close(CloseScene, SceneAnimation._Type.shutters.randomshutters);
                        break;
                    default:
                        sumDelay = _fadeOut_Close(CloseScene);
                        break;
                }
                Laya.timer.once(sumDelay, this, () => {
                    closeFunc();
                });
            }
            SceneAnimation._commonCloseAni = _commonCloseAni;
            function _fadeOut_Open(Scene) {
                let time = 400;
                let delay = 300;
                if (Scene['Background']) {
                    Animation2D.fadeOut(Scene, 0, 1, time / 2, delay);
                }
                Animation2D.fadeOut(Scene, 0, 1, time, 0);
                return time + delay;
            }
            function _fadeOut_Close(Scene) {
                let time = 150;
                let delay = 50;
                if (Scene['Background']) {
                    Animation2D.fadeOut(Scene, 1, 0, time / 2);
                }
                Animation2D.fadeOut(Scene, 1, 0, time, delay);
                return time + delay;
            }
            function _shutters_Open(Scene, type) {
                let num = 12;
                let time = 500;
                let delaye = 100;
                let caller = {};
                Scene.scale(1, 0);
                Laya.timer.once(delaye, caller, () => {
                    Scene.scale(1, 1);
                    var htmlCanvas1 = Laya.stage.drawToCanvas(Laya.stage.width, Laya.stage.height, 0, 0);
                    let base641 = htmlCanvas1.toBase64("image/png", 1);
                    Scene.scale(1, 0);
                    for (let index = 0; index < num; index++) {
                        let Sp = new Laya.Image;
                        Laya.stage.addChild(Sp);
                        Sp.width = Laya.stage.width;
                        Sp.height = Laya.stage.height;
                        Sp.pos(0, 0);
                        Sp.zOrder = 100;
                        Sp.name = 'shutters';
                        Sp.skin = base641;
                        let Mask = new Laya.Image;
                        Mask.width = Sp.width;
                        Mask.height = Laya.stage.height / num;
                        Mask.pos(0, Laya.stage.height / num * index);
                        Mask.skin = `Lwg/UI/ui_orthogon_cycn.png`;
                        Sp.mask = Mask;
                        Tools._Node.changePivot(Sp, Sp.width / 2, index * Sp.height / num + Sp.height / num / 2);
                        Sp.scale(1, 0);
                        Animation2D.scale(Sp, 1, 0, 1, 1, time, 0, () => {
                            Scene.scale(1, 1);
                            Sp.destroy();
                        });
                    }
                });
                return time + delaye + 100;
            }
            function _shutters_Close(Scene, type) {
                let num = 12;
                let time = 600;
                let delaye = 100;
                let caller = {};
                let ran = Tools._Array.randomGetOne([0, 1, 2, 3, 4, 5]);
                Laya.timer.once(delaye, caller, () => {
                    var htmlCanvas1 = Laya.stage.drawToCanvas(Laya.stage.width, Laya.stage.height, 0, 0);
                    let base641 = htmlCanvas1.toBase64("image/png", 1);
                    Scene.scale(1, 0);
                    for (let index = 0; index < num; index++) {
                        let Sp = new Laya.Image;
                        Laya.stage.addChild(Sp);
                        Sp.width = Laya.stage.width;
                        Sp.height = Laya.stage.height;
                        Sp.pos(0, 0);
                        Sp.zOrder = 100;
                        Sp.name = 'shutters';
                        Sp.skin = base641;
                        let Mask = new Laya.Image;
                        Mask.skin = `Lwg/UI/ui_orthogon_cycn.png`;
                        Sp.mask = Mask;
                        var func1 = () => {
                            Mask.width = Laya.stage.width;
                            Mask.height = Laya.stage.height / num;
                            Mask.pos(0, Laya.stage.height / num * index);
                            Tools._Node.changePivot(Sp, Sp.width / 2, index * Sp.height / num + Sp.height / num / 2);
                            Animation2D.scale(Sp, 1, 1, 1, 0, time, 0, () => {
                                Sp.destroy();
                            });
                        };
                        var func2 = () => {
                            Mask.width = Laya.stage.width / num;
                            Mask.height = Laya.stage.height;
                            Mask.pos(Laya.stage.width / num * index, 0);
                            Tools._Node.changePivot(Sp, index * Sp.width / num + Sp.width / num / 2, Sp.height / 2);
                            Animation2D.scale(Sp, 1, 1, 0, 1, time, 0, () => {
                                Sp.destroy();
                            });
                        };
                        var func6 = () => {
                            Mask.width = Laya.stage.width;
                            Mask.height = Laya.stage.height / num;
                            Mask.pos(0, Laya.stage.height / num * index);
                            Tools._Node.changePivot(Sp, Sp.width / 2, index * Sp.height / num + Sp.height / num / 2);
                            Animation2D.scale(Sp, 1, 1, 1, 0, time, 0, () => {
                                Sp.destroy();
                            });
                            if (index % 2 == 0) {
                                let Sp1 = new Laya.Image;
                                Laya.stage.addChild(Sp1);
                                Sp1.width = Laya.stage.width;
                                Sp1.height = Laya.stage.height;
                                Sp1.pos(0, 0);
                                Sp1.zOrder = 100;
                                Sp1.name = 'shutters';
                                Sp1.skin = base641;
                                let Mask1 = new Laya.Image;
                                Mask1.skin = `Lwg/UI/ui_orthogon_cycn.png`;
                                Sp1.mask = Mask1;
                                Mask1.width = Laya.stage.width / num;
                                Mask1.height = Laya.stage.height;
                                Mask1.pos(Laya.stage.width / num * index, 0);
                                Tools._Node.changePivot(Sp1, index * Sp1.width / num + Sp1.width / num / 2, Sp1.height / 2);
                                Animation2D.scale(Sp1, 1, 1, 0, 1, time, 0, () => {
                                    Sp1.destroy();
                                });
                            }
                        };
                        var func3 = () => {
                            Mask.width = Laya.stage.width / num;
                            Mask.height = Laya.stage.height + 1000;
                            Mask.pos(Laya.stage.width / num * index, -1000 / 2);
                            Tools._Node.changePivot(Mask, Mask.width / 2, Mask.height / 2);
                            Tools._Node.changePivot(Sp, index * Sp.width / num + Sp.width / num / 2, Sp.height / 2);
                            Mask.rotation = 10;
                            Animation2D.scale(Sp, 1, 1, 0, 1, time, 0, () => {
                                Sp.destroy();
                            });
                        };
                        let addLen = 1000;
                        var func4 = () => {
                            Mask.width = Laya.stage.width / num;
                            Mask.height = Laya.stage.height + addLen;
                            Mask.pos(Laya.stage.width / num * index, -addLen / 2);
                            Tools._Node.changePivot(Mask, Mask.width / 2, Mask.height / 2);
                            Tools._Node.changePivot(Sp, index * Sp.width / num + Sp.width / num / 2, Sp.height / 2);
                            Mask.rotation = -10;
                            Animation2D.scale(Sp, 1, 1, 0, 1, time, 0, () => {
                                Sp.destroy();
                            });
                        };
                        var func5 = () => {
                            Mask.width = Laya.stage.width / num;
                            Mask.height = Laya.stage.height + addLen;
                            Mask.pos(Laya.stage.width / num * index, -addLen / 2);
                            Tools._Node.changePivot(Mask, Mask.width / 2, Mask.height / 2);
                            Tools._Node.changePivot(Sp, index * Sp.width / num + Sp.width / num / 2, Sp.height / 2);
                            Mask.rotation = -15;
                            Animation2D.scale(Sp, 1, 1, 0, 1, time, 0, () => {
                                Sp.destroy();
                            });
                            let Sp2 = new Laya.Image;
                            Laya.stage.addChild(Sp2);
                            Sp2.width = Laya.stage.width;
                            Sp2.height = Laya.stage.height;
                            Sp2.pos(0, 0);
                            Sp2.zOrder = 100;
                            Sp2.name = 'shutters';
                            Sp2.skin = base641;
                            let Mask1 = new Laya.Image;
                            Mask1.skin = `Lwg/UI/ui_orthogon_cycn.png`;
                            Sp2.mask = Mask1;
                            Mask1.width = Laya.stage.width / num;
                            Mask1.height = Laya.stage.height + addLen;
                            Mask1.pos(Laya.stage.width / num * index, -addLen / 2);
                            Tools._Node.changePivot(Mask1, Mask1.width / 2, Mask1.height / 2);
                            Tools._Node.changePivot(Sp2, index * Sp2.width / num + Sp2.width / num / 2, Sp2.height / 2);
                            Mask1.rotation = 15;
                            Animation2D.scale(Sp2, 1, 1, 0, 1, time, 0, () => {
                                Sp2.destroy();
                            });
                        };
                        let arr = [func1, func2, func3, func4, func5, func6];
                        switch (type) {
                            case SceneAnimation._Type.shutters.crosswise:
                                func1();
                                break;
                            case SceneAnimation._Type.shutters.vertical:
                                func2();
                                break;
                            case SceneAnimation._Type.shutters.lSideling:
                                func3();
                                break;
                            case SceneAnimation._Type.shutters.rSideling:
                                func4();
                                break;
                            case SceneAnimation._Type.shutters.intersection1:
                                func5();
                                break;
                            case SceneAnimation._Type.shutters.intersection2:
                                func6();
                            case SceneAnimation._Type.shutters.randomshutters:
                                arr[ran]();
                                break;
                            default:
                                break;
                        }
                    }
                });
                return time + delaye;
            }
            function _stickIn(Scene, type) {
                let sumDelay = 0;
                let time = 700;
                let delay = 100;
                if (Scene.getChildByName('Background')) {
                    Animation2D.fadeOut(Scene.getChildByName('Background'), 0, 1, time);
                }
                let stickInLeftArr = Tools._Node.zOrderByY(Scene, false);
                for (let index = 0; index < stickInLeftArr.length; index++) {
                    const element = stickInLeftArr[index];
                    if (element.name !== 'Background' && element.name.substr(0, 5) !== 'NoAni') {
                        let originalPovitX = element.pivotX;
                        let originalPovitY = element.pivotY;
                        switch (type) {
                            case SceneAnimation._Type.stickIn.upLeftDownLeft:
                                element.rotation = element.y > Laya.stage.height / 2 ? -180 : 180;
                                Tools._Node.changePivot(element, 0, 0);
                                break;
                            case SceneAnimation._Type.stickIn.upRightDownLeft:
                                element.rotation = element.y > Laya.stage.height / 2 ? -180 : 180;
                                Tools._Node.changePivot(element, element.rotation == 180 ? element.width : 0, 0);
                                break;
                            case SceneAnimation._Type.stickIn.randomstickIn:
                                element.rotation = Tools._Number.randomOneHalf() == 1 ? 180 : -180;
                                Tools._Node.changePivot(element, Tools._Number.randomOneHalf() == 1 ? 0 : element.width, Tools._Number.randomOneHalf() == 1 ? 0 : element.height);
                                break;
                            default:
                                break;
                        }
                        let originalX = element.x;
                        let originalY = element.y;
                        element.x = element.pivotX > element.width / 2 ? 800 + element.width : -800 - element.width;
                        element.y = element.rotation > 0 ? element.y + 200 : element.y - 200;
                        Animation2D.rotate(element, 0, time, delay * index);
                        Animation2D.move_Simple(element, element.x, element.y, originalX, originalY, time, delay * index, () => {
                            Tools._Node.changePivot(element, originalPovitX, originalPovitY);
                        });
                    }
                }
                sumDelay = Scene.numChildren * delay + time + 200;
                return sumDelay;
            }
        })(SceneAnimation = lwg.SceneAnimation || (lwg.SceneAnimation = {}));
        let Admin;
        (function (Admin) {
            Admin._game = {
                switch: true,
                get level() {
                    return Laya.LocalStorage.getItem('_gameLevel') ? Number(Laya.LocalStorage.getItem('_gameLevel')) : 1;
                },
                set level(val) {
                    let diff = val - this.level;
                    if (diff > 0) {
                        this.maxLevel += diff;
                    }
                    if (val > this.loopLevel && this.loopLevel != -1) {
                        Laya.LocalStorage.setItem('_gameLevel', (1).toString());
                    }
                    else {
                        Laya.LocalStorage.setItem('_gameLevel', (val).toString());
                    }
                },
                get maxLevel() {
                    return Laya.LocalStorage.getItem('_game_maxLevel') ? Number(Laya.LocalStorage.getItem('_game_maxLevel')) : this.level;
                },
                set maxLevel(val) {
                    Laya.LocalStorage.setItem('_game_maxLevel', val.toString());
                },
                get loopLevel() {
                    return this['_gameloopLevel'] ? this['_gameloopLevel'] : -1;
                },
                set loopLevel(lev) {
                    this['_gameloopLevel'] = lev;
                },
                LevelNode: new Laya.Sprite,
                _createLevel(parent, x, y) {
                    let sp;
                    Laya.loader.load('prefab/LevelNode.json', Laya.Handler.create(this, function (prefab) {
                        let _prefab = new Laya.Prefab();
                        _prefab.json = prefab;
                        sp = Laya.Pool.getItemByCreateFun('prefab', _prefab.create, _prefab);
                        parent.addChild(sp);
                        sp.pos(x, y);
                        sp.zOrder = 0;
                        let level = sp.getChildByName('level');
                        Admin._game.LevelNode = sp;
                    }));
                },
                pause: {
                    get switch() {
                        return Admin._game.switch;
                    },
                    set switch(bool) {
                        this.bool = bool;
                        if (bool) {
                            Admin._game.switch = false;
                            TimerAdmin._switch = false;
                            Click._switch = true;
                        }
                        else {
                            Admin._game.switch = true;
                            TimerAdmin._switch = true;
                            Click._switch = false;
                        }
                    }
                }
            };
            class _Game {
            }
            Admin._Game = _Game;
            Admin._GuideControl = {
                switch: false,
            };
            Admin._SceneControl = {};
            Admin._sceneScript = {};
            Admin._Moudel = {};
            let _SceneName;
            (function (_SceneName) {
                _SceneName["PreLoad"] = "PreLoad";
                _SceneName["PreLoadCutIn"] = "PreLoadCutIn";
                _SceneName["Guide"] = "Guide";
                _SceneName["Start"] = "Start";
                _SceneName["Shop"] = "Shop";
                _SceneName["Task"] = "Task";
                _SceneName["Set"] = "Set";
                _SceneName["Skin"] = "Skin";
                _SceneName["Puase"] = "Puase";
                _SceneName["Share"] = "Share";
                _SceneName["Game3D"] = "Game3D";
                _SceneName["Victory"] = "Victory";
                _SceneName["Defeated"] = "Defeated";
                _SceneName["PassHint"] = "PassHint";
                _SceneName["SkinTry"] = "SkinTry";
                _SceneName["Redeem"] = "Redeem";
                _SceneName["Turntable"] = "Turntable";
                _SceneName["CaidanPifu"] = "CaidanPifu";
                _SceneName["Operation"] = "Operation";
                _SceneName["VictoryBox"] = "VictoryBox";
                _SceneName["CheckIn"] = "CheckIn";
                _SceneName["Resurgence"] = "Resurgence";
                _SceneName["AdsHint"] = "AdsHint";
                _SceneName["LwgInit"] = "LwgInit";
                _SceneName["Game"] = "Game";
                _SceneName["SmallHint"] = "SmallHint";
                _SceneName["DrawCard"] = "DrawCard";
                _SceneName["PropTry"] = "PropTry";
                _SceneName["Card"] = "Card";
                _SceneName["ExecutionHint"] = "ExecutionHint";
                _SceneName["SkinQualified"] = "SkinQualified";
                _SceneName["Eastereggister"] = "Eastereggister";
                _SceneName["SelectLevel"] = "SelectLevel";
                _SceneName["Settle"] = "Settle";
                _SceneName["Special"] = "Special";
                _SceneName["Compound"] = "Compound";
            })(_SceneName = Admin._SceneName || (Admin._SceneName = {}));
            Admin._PreLoadCutIn = {
                openName: null,
                closeName: null,
                func: null,
                zOrder: null,
            };
            function _preLoadOpenScene(openName, closeName, func, zOrder) {
                _openScene(_SceneName.PreLoadCutIn, closeName);
                Admin._PreLoadCutIn.openName = openName;
                Admin._PreLoadCutIn.closeName = closeName;
                Admin._PreLoadCutIn.func = func;
                Admin._PreLoadCutIn.zOrder = zOrder;
            }
            Admin._preLoadOpenScene = _preLoadOpenScene;
            class _SceneChange {
                static _openZOderUp() {
                }
                ;
                static _closeZOderUP(CloseScene) {
                    if (SceneAnimation._closeSwitch) {
                        let num = 0;
                        for (const key in Admin._SceneControl) {
                            if (Object.prototype.hasOwnProperty.call(Admin._SceneControl, key)) {
                                const Scene = Admin._SceneControl[key];
                                if (Scene.parent) {
                                    num++;
                                }
                            }
                        }
                        if (CloseScene) {
                            CloseScene.zOrder = num;
                            if (this._openScene) {
                                this._openScene.zOrder = num - 1;
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
                        if (Admin._Moudel[`_${this._openScene.name}`]) {
                            if (Admin._Moudel[`_${this._openScene.name}`][this._openScene.name]) {
                                if (!this._openScene.getComponent(Admin._Moudel[`_${this._openScene.name}`][this._openScene.name])) {
                                    this._openScene.addComponent(Admin._Moudel[`_${this._openScene.name}`][this._openScene.name]);
                                }
                            }
                        }
                        else {
                            console.log(`${this._openScene.name}场景没有同名脚本！,需在LwgInit脚本中导入该模块！`);
                        }
                        this._openFunc();
                    }
                }
                ;
                static _close() {
                    if (this._closeScene.length > 0) {
                        for (let index = 0; index < this._closeScene.length; index++) {
                            let scene = this._closeScene[index];
                            if (scene) {
                                _closeScene(scene.name);
                                this._closeScene.splice(index, 1);
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
            _SceneChange._openScene = null;
            _SceneChange._openZOder = 1;
            _SceneChange._openFunc = null;
            _SceneChange._closeScene = [];
            _SceneChange._closeZOder = 0;
            _SceneChange._sceneNum = 1;
            Admin._SceneChange = _SceneChange;
            function _openScene(openName, closeName, func, zOrder) {
                Click._switch = false;
                Laya.Scene.load('Scene/' + openName + '.json', Laya.Handler.create(this, function (scene) {
                    if (Tools._Node.checkChildren(Laya.stage, openName)) {
                        console.log(openName, '场景重复出现！请检查代码');
                    }
                    else {
                        _SceneChange._openScene = Admin._SceneControl[scene.name = openName] = scene;
                        _SceneChange._closeScene.push(Admin._SceneControl[closeName]);
                        _SceneChange._closeZOder = closeName ? Admin._SceneControl[closeName].zOrder : 0;
                        _SceneChange._openZOder = zOrder ? zOrder : null;
                        _SceneChange._openFunc = func ? func : () => { };
                        _SceneChange._open();
                    }
                }));
            }
            Admin._openScene = _openScene;
            function _closeScene(closeName, func) {
                if (!Admin._SceneControl[closeName]) {
                    console.log('场景', closeName, '关闭失败！可能是名称不对！');
                    return;
                }
                var closef = () => {
                    func && func();
                    Click._switch = true;
                    Admin._SceneControl[closeName].close();
                };
                if (!SceneAnimation._closeSwitch) {
                    closef();
                    return;
                }
                _SceneChange._closeZOderUP(Admin._SceneControl[closeName]);
                let script = Admin._SceneControl[closeName][Admin._SceneControl[closeName].name];
                if (script) {
                    if (script) {
                        Click._switch = false;
                        script.lwgBeforeCloseAni();
                        let time0 = script.lwgCloseAni();
                        if (time0 !== null) {
                            Laya.timer.once(time0, this, () => {
                                closef();
                                Click._switch = true;
                            });
                        }
                        else {
                            SceneAnimation._commonCloseAni(Admin._SceneControl[closeName], closef);
                        }
                    }
                }
            }
            Admin._closeScene = _closeScene;
            class _ScriptBase extends Laya.Script {
                constructor() {
                    super(...arguments);
                    this.ownerSceneName = '';
                }
                getFind(name, type) {
                    if (!this[`_Scene${type}${name}`]) {
                        let Node = Tools._Node.findChild2D(this.owner.scene, name);
                        if (Node) {
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
                    return StorageAdmin._mum(`${this.owner.name}/${name}`, _func, initial);
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
                    Click._on(effect == undefined ? Click._Use.value : effect, target, this, (e) => {
                        Click._switch && down && down(e);
                    }, null, null, null);
                }
                _btnMove(target, move, effect) {
                    Click._on(effect == undefined ? Click._Use.value : effect, target, this, null, (e) => {
                        Click._switch && move && move(e);
                    }, null, null);
                }
                _btnUp(target, up, effect) {
                    Click._on(effect == undefined ? Click._Use.value : effect, target, this, null, null, (e) => {
                        Click._switch && up && up(e);
                    }, null);
                }
                _btnOut(target, out, effect) {
                    Click._on(effect == undefined ? Click._Use.value : effect, target, this, null, null, null, (e) => { Click._switch && out && out(e); });
                }
                _btnFour(target, down, move, up, out, effect) {
                    Click._on(effect == null ? effect : Click._Use.value, target, this, (e) => { Click._switch && down && down(e); }, (e) => { Click._switch && move && move(e); }, (e) => { Click._switch && up && up(e); }, (e) => { Click._switch && out && out(e); });
                }
                _openScene(openName, closeSelf, preLoadCutIn, func, zOrder) {
                    let closeName;
                    if (closeSelf == undefined || closeSelf == true) {
                        closeName = this.ownerSceneName;
                    }
                    if (!preLoadCutIn) {
                        Admin._openScene(openName, closeName, func, zOrder);
                    }
                    else {
                        Admin._preLoadOpenScene(openName, closeName, func, zOrder);
                    }
                }
                _closeScene(sceneName, func) {
                    Admin._closeScene(sceneName ? sceneName : this.ownerSceneName, func);
                }
                lwgOnUpdate() { }
                ;
                lwgOnDisable() { }
                ;
                onStageMouseDown(e) { Click._switch && this.lwgOnStageDown(e); }
                ;
                onStageMouseMove(e) { Click._switch && this.lwgOnStageMove(e); }
                ;
                onStageMouseUp(e) { Click._switch && this.lwgOnStageUp(e); }
                ;
                lwgOnStageDown(e) { }
                ;
                lwgOnStageMove(e) { }
                ;
                lwgOnStageUp(e) { }
                ;
            }
            class _SceneBase extends _ScriptBase {
                constructor() {
                    super();
                    this._calssName = _SceneName.PreLoad;
                }
                get _Owner() {
                    return this.owner;
                }
                getVar(name, type) {
                    if (!this[`_Scene${type}${name}`]) {
                        if (this._Owner[name]) {
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
                _FontClipVar(name) {
                    return this.getVar(name, '_FontClipVar');
                }
                _FontBox(name) {
                    return this.getVar(name, '_FontBox');
                }
                onAwake() {
                    this._Owner.width = Laya.stage.width;
                    this._Owner.height = Laya.stage.height;
                    if (this._Owner.getChildByName('Background')) {
                        this._Owner.getChildByName('Background')['width'] = Laya.stage.width;
                        this._Owner.getChildByName('Background')['height'] = Laya.stage.height;
                    }
                    if (this._Owner.name == null) {
                        console.log('场景名称失效，脚本赋值失败');
                    }
                    else {
                        this.ownerSceneName = this._calssName = this._Owner.name;
                        this._Owner[this._calssName] = this;
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
                    this.btnAndOpenAni();
                    this.moduleOnStart();
                    this.lwgOnStart();
                }
                moduleOnStart() { }
                btnAndOpenAni() {
                    let time = this.lwgOpenAni();
                    if (time !== null) {
                        Laya.timer.once(time, this, () => {
                            Click._switch = true;
                            this.lwgOpenAniAfter();
                            this.lwgButton();
                            _SceneChange._close();
                        });
                    }
                    else {
                        SceneAnimation._commonOpenAni(this._Owner);
                    }
                }
                lwgOpenAni() { return null; }
                ;
                lwgOpenAniAfter() { }
                ;
                _adaHeight(arr) {
                    Adaptive._stageHeight(arr);
                }
                ;
                _adaWidth(arr) {
                    Adaptive._stageWidth(arr);
                }
                ;
                _adaptiveCenter(arr) {
                    Adaptive._center(arr, Laya.stage);
                }
                ;
                onUpdate() { this.lwgOnUpdate(); }
                ;
                lwgBeforeCloseAni() { }
                lwgCloseAni() { return null; }
                ;
                onDisable() {
                    Animation2D.fadeOut(this._Owner, 1, 0, 2000, 1);
                    this.lwgOnDisable();
                    Laya.timer.clearAll(this);
                    Laya.Tween.clearAll(this);
                    EventAdmin._offCaller(this);
                }
            }
            Admin._SceneBase = _SceneBase;
            class _ObjectBase extends _ScriptBase {
                constructor() {
                    super();
                }
                get _Owner() {
                    return this.owner;
                }
                get _Scene() {
                    return this.owner.scene;
                }
                get _Parent() {
                    if (this._Owner.parent) {
                        return this.owner.parent;
                    }
                }
                get _gPoint() {
                    return this._Parent.localToGlobal(new Laya.Point(this._Owner.x, this._Owner.y));
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
                        if (this._Scene[name]) {
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
                        if (this._Owner.getChildByName(name)) {
                            return this[`${type}${name}`] = this._Owner.getChildByName(name);
                        }
                        else {
                            console.log('场景内不存在子节点：', name);
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
                    this._Owner[this['__proto__']['constructor'].name] = this;
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
                    this._fPoint = new Laya.Point(this._Owner.x, this._Owner.y);
                    this._fGPoint = this._gPoint;
                    this.lwgOnStart();
                }
                onUpdate() {
                    this.lwgOnUpdate();
                }
                onDisable() {
                    this.lwgOnDisable();
                    Laya.timer.clearAll(this);
                    EventAdmin._offCaller(this);
                }
            }
            Admin._ObjectBase = _ObjectBase;
        })(Admin = lwg.Admin || (lwg.Admin = {}));
        let StorageAdmin;
        (function (StorageAdmin) {
            class admin {
                removeSelf() { }
                func() { }
            }
            class _NumVariable extends admin {
                get value() { return; }
                ;
                set value(val) { }
            }
            StorageAdmin._NumVariable = _NumVariable;
            class _StrVariable extends admin {
                get value() { return; }
                set value(val) { }
            }
            StorageAdmin._StrVariable = _StrVariable;
            class _BoolVariable extends admin {
                get value() { return; }
                set value(val) { }
            }
            StorageAdmin._BoolVariable = _BoolVariable;
            class _ArrayVariable extends admin {
                get value() { return; }
                set value(val) { }
            }
            StorageAdmin._ArrayVariable = _ArrayVariable;
            class _ArrayArrVariable extends admin {
                get value() { return; }
                set value(val) { }
            }
            StorageAdmin._ArrayArrVariable = _ArrayArrVariable;
            function _mum(name, _func, initial) {
                if (!this[`_mum${name}`]) {
                    this[`_mum${name}`] = {
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
                            console.log(this['_func']);
                        }
                    };
                }
                if (_func) {
                    this[`_mum${name}`]['_func'] = _func;
                }
                return this[`_mum${name}`];
            }
            StorageAdmin._mum = _mum;
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
                            _func && _func();
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
                                if (Laya.LocalStorage.getItem(name) == "false") {
                                    return false;
                                }
                                else if (Laya.LocalStorage.getItem(name) == "true") {
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
                                    ;
                                }
                                else {
                                    initial = initial ? initial : [];
                                    Laya.LocalStorage.setItem(name, initial.toString());
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
        })(StorageAdmin = lwg.StorageAdmin || (lwg.StorageAdmin = {}));
        let DataAdmin;
        (function (DataAdmin) {
            class _Table {
                constructor(tableName, arrUrl, localStorage, proName, lastVtableName) {
                    this._property = {
                        name: 'name',
                        chName: 'chName',
                        classify: 'classify',
                        unlockWay: 'unlockWay',
                        conditionNum: 'conditionNum',
                        degreeNum: 'degreeNum',
                        compelet: 'compelet',
                        unlock: 'unlock',
                        have: 'have',
                        getAward: 'getAward',
                        versionUpdateTimes: 'versionUpdateTimes',
                    };
                    this._tableName = '';
                    this._arr = [];
                    this._lastArr = [];
                    this._localStorage = false;
                    if (tableName) {
                        this._tableName = tableName;
                        if (localStorage) {
                            this._localStorage = localStorage;
                            this._arr = _jsonCompare(arrUrl, tableName, proName ? proName : 'name');
                            if (lastVtableName) {
                                this._compareLastInfor(lastVtableName);
                            }
                        }
                        else {
                            if (Laya.Loader.getRes(arrUrl)) {
                                this._arr = Laya.Loader.getRes(arrUrl);
                            }
                            else {
                                console.log(arrUrl, '数据表不存在！');
                            }
                        }
                    }
                }
                _compareLastInfor(lastVtableName) {
                    this._lastArr = this._getlastVersion(lastVtableName);
                    if (this._lastArr.length > 0) {
                        for (let i = 0; i < this._lastArr.length; i++) {
                            const _lastelement = this._lastArr[i];
                            for (let j = 0; j < this._arr.length; j++) {
                                const element = this._arr[j];
                                if (_lastelement[this._property.compelet]) {
                                    element[this._property.compelet] = true;
                                }
                                if (_lastelement[this._property.have]) {
                                    element[this._property.have] = true;
                                }
                                if (_lastelement[this._property.unlock]) {
                                    element[this._property.unlock] = true;
                                }
                                if (_lastelement[this._property.getAward]) {
                                    element[this._property.getAward] = true;
                                }
                                if (_lastelement[this._property.degreeNum] > element[this._property.degreeNum]) {
                                    element[this._property.getAward] = _lastelement[this._property.degreeNum];
                                }
                            }
                        }
                    }
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
                            if (element[this._property.name] == name) {
                                value = element[pro];
                                break;
                            }
                        }
                    }
                    return value;
                }
                ;
                _setProperty(name, pro, value) {
                    for (const key in this._arr) {
                        if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
                            const element = this._arr[key];
                            if (element[this._property.name] == name) {
                                element[pro] = value;
                                break;
                            }
                        }
                    }
                    if (this._localStorage) {
                        Laya.LocalStorage.setJSON(this._tableName, JSON.stringify(this._arr));
                    }
                    return value;
                }
                ;
                _randomOne(proName, value) {
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
                        let any = Tools._Array.randomGetOne(arr);
                        return any;
                    }
                }
                _getPropertyArr(proName, value) {
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
                _setPropertyArr(proName, value) {
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
                    if (this._localStorage) {
                        Laya.LocalStorage.setJSON(this._tableName, JSON.stringify(this._arr));
                    }
                    return arr;
                }
                _checkCondition(name, number, func) {
                    let chek = null;
                    number = number == undefined ? 1 : number;
                    let degreeNum = this._getProperty(name, this._property.degreeNum);
                    let condition = this._getProperty(name, this._property.conditionNum);
                    let compelet = this._getProperty(name, this._property.compelet);
                    if (!compelet) {
                        if (condition <= degreeNum + number) {
                            this._setProperty(name, this._property.degreeNum, condition);
                            this._setProperty(name, this._property.compelet, true);
                            chek = true;
                        }
                        else {
                            this._setProperty(name, this._property.degreeNum, degreeNum + number);
                            chek = false;
                        }
                    }
                    else {
                        chek = -1;
                    }
                    if (func) {
                        func();
                    }
                    return chek;
                }
                _checkAllCompelet() {
                    let bool = true;
                    for (let index = 0; index < this._arr.length; index++) {
                        const element = this._arr[index];
                        if (!element[this._property.compelet]) {
                            bool = false;
                            return bool;
                        }
                    }
                    return bool;
                }
            }
            DataAdmin._Table = _Table;
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
                            let diffArray = Tools._ObjArray.differentPropertyTwo(dataArr_0, dataArr, propertyName);
                            console.log('两个数据的差值为：', diffArray);
                            Tools._Array.oneAddToarray(dataArr, diffArray);
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
        })(DataAdmin = lwg.DataAdmin || (lwg.DataAdmin = {}));
        let Color;
        (function (Color) {
            function RGBToHexString(r, g, b) {
                return '#' + ("00000" + (r << 16 | g << 8 | b).toString(16)).slice(-6);
            }
            Color.RGBToHexString = RGBToHexString;
            function HexStringToRGB(str) {
                let arr = [];
                return arr;
            }
            Color.HexStringToRGB = HexStringToRGB;
            function _colour(node, RGBA, vanishtime) {
                let cf = new Laya.ColorFilter();
                node.blendMode = 'null';
                if (!RGBA) {
                    cf.color(Tools._Number.randomOneBySection(255, 100, true), Tools._Number.randomOneBySection(255, 100, true), Tools._Number.randomOneBySection(255, 100, true), 1);
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
            Color._colour = _colour;
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
            Color._changeOnce = _changeOnce;
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
                let RGBA = [Tools._Number.randomCountBySection(RGBA1[0], RGBA2[0])[0], Tools._Number.randomCountBySection(RGBA1[1], RGBA2[1])[0], Tools._Number.randomCountBySection(RGBA1[2], RGBA2[2])[0], Tools._Number.randomCountBySection(RGBA1[3] ? RGBA1[3] : 1, RGBA2[3] ? RGBA2[3] : 1)[0]];
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
            Color._changeConstant = _changeConstant;
        })(Color = lwg.Color || (lwg.Color = {}));
        let Effects;
        (function (Effects) {
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
                _SkinUrl["\u96EA\u82B11"] = "Lwg/Effects/xuehua1.png";
                _SkinUrl["\u53F6\u5B501"] = "Lwg/Effects/yezi1.png";
                _SkinUrl["\u5706\u5F62\u53D1\u51491"] = "Lwg/Effects/yuanfaguang.png";
                _SkinUrl["\u5706\u5F621"] = "Lwg/Effects/yuan1.png";
                _SkinUrl["\u5149\u57081"] = "Lwg/Effects/guangquan1.png";
                _SkinUrl["\u5149\u57082"] = "Lwg/Effects/guangquan2.png";
            })(_SkinUrl = Effects._SkinUrl || (Effects._SkinUrl = {}));
            let _Aperture;
            (function (_Aperture) {
                class _ApertureImage extends Laya.Image {
                    constructor(parent, centerPoint, width, height, rotation, urlArr, colorRGBA, zOrder) {
                        super();
                        if (!parent.parent) {
                            return;
                        }
                        parent.addChild(this);
                        centerPoint ? this.pos(centerPoint.x, centerPoint.y) : this.pos(0, 0);
                        this.width = width ? width : 100;
                        this.height = height ? height : 100;
                        this.pivotX = this.width / 2;
                        this.pivotY = this.height / 2;
                        this.rotation = rotation ? Tools._Number.randomOneBySection(rotation[0], rotation[1]) : Tools._Number.randomOneBySection(360);
                        this.skin = urlArr ? Tools._Array.randomGetOne(urlArr) : _SkinUrl.花3;
                        this.zOrder = zOrder ? zOrder : 0;
                        this.alpha = 0;
                        let RGBA = [];
                        RGBA[0] = colorRGBA ? Tools._Number.randomOneBySection(colorRGBA[0][0], colorRGBA[1][0]) : Tools._Number.randomOneBySection(0, 255);
                        RGBA[1] = colorRGBA ? Tools._Number.randomOneBySection(colorRGBA[0][1], colorRGBA[1][1]) : Tools._Number.randomOneBySection(0, 255);
                        RGBA[2] = colorRGBA ? Tools._Number.randomOneBySection(colorRGBA[0][2], colorRGBA[1][2]) : Tools._Number.randomOneBySection(0, 255);
                        RGBA[3] = colorRGBA ? Tools._Number.randomOneBySection(colorRGBA[0][3], colorRGBA[1][3]) : Tools._Number.randomOneBySection(0, 255);
                        Color._colour(this, RGBA);
                    }
                }
                _Aperture._ApertureImage = _ApertureImage;
                function _continuous(parent, centerPoint, width, height, rotation, urlArr, colorRGBA, zOrder, scale, speed, accelerated) {
                    let Img = new _ApertureImage(parent, centerPoint, width, height, rotation, urlArr, colorRGBA, zOrder);
                    let _speed = speed ? Tools._Number.randomOneBySection(speed[0], speed[1]) : 0.025;
                    let _accelerated = accelerated ? Tools._Number.randomOneBySection(accelerated[0], accelerated[1]) : 0.0005;
                    let _scale = scale ? Tools._Number.randomOneBySection(scale[0], scale[1]) : 2;
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
                        else if (moveCaller.scale) {
                            acc += _accelerated;
                            if (Img.scaleX > _scale) {
                                moveCaller.scale = false;
                                moveCaller.vanish = true;
                            }
                        }
                        else if (moveCaller.vanish) {
                            acc -= _accelerated;
                            if (acc < 0) {
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
                _Aperture._continuous = _continuous;
            })(_Aperture = Effects._Aperture || (Effects._Aperture = {}));
            let _Particle;
            (function (_Particle) {
                class _ParticleImgBase extends Laya.Image {
                    constructor(parent, centerPoint, sectionWH, width, height, rotation, urlArr, colorRGBA, zOrder) {
                        super();
                        parent.addChild(this);
                        let sectionWidth = sectionWH ? Tools._Number.randomOneBySection(sectionWH[0]) : Tools._Number.randomOneBySection(200);
                        let sectionHeight = sectionWH ? Tools._Number.randomOneBySection(sectionWH[1]) : Tools._Number.randomOneBySection(50);
                        sectionWidth = Tools._Number.randomOneHalf() == 0 ? sectionWidth : -sectionWidth;
                        sectionHeight = Tools._Number.randomOneHalf() == 0 ? sectionHeight : -sectionHeight;
                        this.x = centerPoint ? centerPoint.x + sectionWidth : sectionWidth;
                        this.y = centerPoint ? centerPoint.y + sectionHeight : sectionHeight;
                        this.width = width ? Tools._Number.randomOneBySection(width[0], width[1]) : Tools._Number.randomOneBySection(20, 50);
                        this.height = height ? Tools._Number.randomOneBySection(height[0], height[1]) : this.width;
                        this.pivotX = this.width / 2;
                        this.pivotY = this.height / 2;
                        this.skin = urlArr ? Tools._Array.randomGetOne(urlArr) : _SkinUrl.圆形1;
                        this.rotation = rotation ? Tools._Number.randomOneBySection(rotation[0], rotation[1]) : 0;
                        this.alpha = 0;
                        this.zOrder = zOrder ? zOrder : 0;
                        let RGBA = [];
                        RGBA[0] = colorRGBA ? Tools._Number.randomOneBySection(colorRGBA[0][0], colorRGBA[1][0]) : Tools._Number.randomOneBySection(0, 255);
                        RGBA[1] = colorRGBA ? Tools._Number.randomOneBySection(colorRGBA[0][1], colorRGBA[1][1]) : Tools._Number.randomOneBySection(0, 255);
                        RGBA[2] = colorRGBA ? Tools._Number.randomOneBySection(colorRGBA[0][2], colorRGBA[1][2]) : Tools._Number.randomOneBySection(0, 255);
                        RGBA[3] = colorRGBA ? Tools._Number.randomOneBySection(colorRGBA[0][3], colorRGBA[1][3]) : Tools._Number.randomOneBySection(0, 255);
                        Color._colour(this, RGBA);
                    }
                }
                _Particle._ParticleImgBase = _ParticleImgBase;
                function _snow(parent, centerPoint, sectionWH, width, height, rotation, urlArr, colorRGBA, zOrder, distance, rotationSpeed, speed, windX) {
                    let Img = new _ParticleImgBase(parent, centerPoint, sectionWH, width, height, rotation, urlArr, colorRGBA, zOrder);
                    let _rotationSpeed = rotationSpeed ? Tools._Number.randomOneBySection(rotationSpeed[0], rotationSpeed[1]) : Tools._Number.randomOneBySection(0, 1);
                    _rotationSpeed = Tools._Number.randomOneHalf() == 0 ? _rotationSpeed : -_rotationSpeed;
                    let speed0 = speed ? Tools._Number.randomOneBySection(speed[0], speed[1]) : Tools._Number.randomOneBySection(1, 2.5);
                    let _windX = windX ? Tools._Number.randomOneBySection(windX[0], windX[1]) : 0;
                    let moveCaller = {
                        alpha: true,
                        move: false,
                        vinish: false,
                    };
                    Img['moveCaller'] = moveCaller;
                    let distance0 = 0;
                    let distance1 = distance ? Tools._Number.randomOneBySection(distance[0], distance[1]) : Tools._Number.randomOneBySection(100, 300);
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
                function _fallingVertical(parent, centerPoint, sectionWH, width, height, rotation, urlArr, colorRGBA, zOrder, distance, speed, accelerated) {
                    let Img = new _ParticleImgBase(parent, centerPoint, sectionWH, width, height, rotation, urlArr, colorRGBA, zOrder);
                    let speed0 = speed ? Tools._Number.randomOneBySection(speed[0], speed[1]) : Tools._Number.randomOneBySection(4, 8);
                    let accelerated0 = accelerated ? Tools._Number.randomOneBySection(accelerated[0], accelerated[1]) : Tools._Number.randomOneBySection(0.25, 0.45);
                    let acc = 0;
                    let moveCaller = {
                        alpha: true,
                        move: false,
                        vinish: false,
                    };
                    Img['moveCaller'] = moveCaller;
                    let distance1 = distance ? Tools._Number.randomOneBySection(distance[0], distance[1]) : Tools._Number.randomOneBySection(100, 300);
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
                    let speed0 = speed ? Tools._Number.randomOneBySection(speed[0], speed[1]) : Tools._Number.randomOneBySection(4, 8);
                    let accelerated0 = accelerated ? Tools._Number.randomOneBySection(accelerated[0], accelerated[1]) : Tools._Number.randomOneBySection(0.25, 0.45);
                    let acc = 0;
                    let moveCaller = {
                        alpha: true,
                        move: false,
                        vinish: false,
                    };
                    Img['moveCaller'] = moveCaller;
                    let distance1 = distance ? Tools._Number.randomOneBySection(distance[0], distance[1]) : Tools._Number.randomOneBySection(100, 300);
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
                    let speed0 = speed ? Tools._Number.randomOneBySection(speed[0], speed[1]) : Tools._Number.randomOneBySection(1.5, 2);
                    let accelerated0 = accelerated ? Tools._Number.randomOneBySection(accelerated[0], accelerated[1]) : Tools._Number.randomOneBySection(0.001, 0.005);
                    let acc = 0;
                    let moveCaller = {
                        alpha: true,
                        move: false,
                        vinish: false,
                    };
                    Img['moveCaller'] = moveCaller;
                    let fy = Img.y;
                    let distance0 = 0;
                    let distance1 = distance ? Tools._Number.randomOneBySection(distance[0], distance[1]) : Tools._Number.randomOneBySection(-250, -600);
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
                function _spray(parent, centerPoint, sectionWH, width, height, rotation, urlArr, colorRGBA, zOrder, moveAngle, distance, rotationSpeed, speed, accelerated) {
                    let Img = new _ParticleImgBase(parent, centerPoint, [0, 0], width, height, rotation, urlArr, colorRGBA, zOrder);
                    let centerPoint0 = centerPoint ? centerPoint : new Laya.Point(0, 0);
                    let speed0 = speed ? Tools._Number.randomOneBySection(speed[0], speed[1]) : Tools._Number.randomOneBySection(3, 10);
                    let accelerated0 = accelerated ? Tools._Number.randomOneBySection(accelerated[0], accelerated[1]) : Tools._Number.randomOneBySection(0.25, 0.45);
                    let acc = 0;
                    let moveCaller = {
                        alpha: true,
                        move: false,
                        vinish: false,
                    };
                    Img['moveCaller'] = moveCaller;
                    let radius = 0;
                    let distance1 = distance ? Tools._Number.randomOneBySection(distance[0], distance[1]) : Tools._Number.randomOneBySection(100, 200);
                    let angle0 = moveAngle ? Tools._Number.randomOneBySection(moveAngle[0], moveAngle[1]) : Tools._Number.randomOneBySection(0, 360);
                    let rotationSpeed0 = rotationSpeed ? Tools._Number.randomOneBySection(rotationSpeed[0], rotationSpeed[1]) : Tools._Number.randomOneBySection(0, 20);
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
                            let point = Tools._Point.getRoundPos(angle0, radius, centerPoint0);
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
                    let fixedXY = Tools._Number.randomOneHalf() == 0 ? 'x' : 'y';
                    curtailAngle = curtailAngle ? curtailAngle : 60;
                    if (fixedXY == 'x') {
                        if (Tools._Number.randomOneHalf() == 0) {
                            Img.x += sectionWH[0];
                            _angle = Tools._Number.randomOneHalf() == 0 ? Tools._Number.randomOneBySection(0, 90 - curtailAngle) : Tools._Number.randomOneBySection(0, -90 + curtailAngle);
                        }
                        else {
                            Img.x -= sectionWH[0];
                            _angle = Tools._Number.randomOneBySection(90 + curtailAngle, 270 - curtailAngle);
                        }
                        Img.y += Tools._Number.randomOneBySection(-sectionWH[1], sectionWH[1]);
                    }
                    else {
                        if (Tools._Number.randomOneHalf() == 0) {
                            Img.y -= sectionWH[1];
                            _angle = Tools._Number.randomOneBySection(180 + curtailAngle, 360 - curtailAngle);
                        }
                        else {
                            Img.y += sectionWH[1];
                            _angle = Tools._Number.randomOneBySection(0 + curtailAngle, 180 - curtailAngle);
                        }
                        Img.x += Tools._Number.randomOneBySection(-sectionWH[0], sectionWH[0]);
                    }
                    let p = Tools._Point.pointByAngle(_angle);
                    let _distance = distance ? Tools._Number.randomOneBySection(distance[0], distance[1]) : Tools._Number.randomOneBySection(20, 50);
                    let speed0 = speed ? Tools._Number.randomOneBySection(speed[0], speed[1]) : Tools._Number.randomOneBySection(0.5, 1);
                    let accelerated0 = accelerated ? Tools._Number.randomOneBySection(accelerated[0], accelerated[1]) : Tools._Number.randomOneBySection(0.25, 0.45);
                    let acc = 0;
                    let rotationSpeed0 = rotateSpeed ? Tools._Number.randomOneBySection(rotateSpeed[0], rotateSpeed[1]) : Tools._Number.randomOneBySection(0, 20);
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
                    let speed0 = speed ? Tools._Number.randomOneBySection(speed[0], speed[1]) : Tools._Number.randomOneBySection(5, 6);
                    let accelerated0 = accelerated ? Tools._Number.randomOneBySection(accelerated[0], accelerated[1]) : Tools._Number.randomOneBySection(0.25, 0.45);
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
                    let dis1 = distance1 ? Tools._Number.randomOneBySection(distance1[0], distance1[1]) : Tools._Number.randomOneBySection(100, 200);
                    let dis2 = distance2 ? Tools._Number.randomOneBySection(distance2[0], distance2[1]) : Tools._Number.randomOneBySection(100, 200);
                    let angle0 = angle ? Tools._Number.randomOneBySection(angle[0], angle[1]) : Tools._Number.randomOneBySection(0, 360);
                    Img.rotation = angle0 - 90;
                    let rotationSpeed0 = rotationSpeed ? Tools._Number.randomOneBySection(rotationSpeed[0], rotationSpeed[1]) : Tools._Number.randomOneBySection(0, 20);
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
                        let point = Tools._Point.getRoundPos(angle0, radius, centerPoint0);
                        Img.pos(point.x, point.y);
                    });
                    return Img;
                }
                _Particle._moveToTargetToMove = _moveToTargetToMove;
                function _AnnularInhalation(parent, centerPoint, radius, rotation, width, height, urlArr, speed, accelerated, zOrder) {
                    let Img = new Laya.Image();
                    parent.addChild(Img);
                    width = width ? width : [25, 50];
                    Img.width = Tools._Number.randomCountBySection(width[0], width[1])[0];
                    Img.height = height ? Tools._Number.randomCountBySection(height[0], height[1])[0] : Img.width;
                    Img.pivotX = Img.width / 2;
                    Img.pivotY = Img.height / 2;
                    Img.skin = urlArr ? Tools._Array.randomGetOut(urlArr)[0] : _SkinUrl[Tools._Number.randomCountBySection(0, 12)[0]];
                    let radius0 = Tools._Number.randomCountBySection(radius[0], radius[1])[0];
                    Img.alpha = 0;
                    let speed0 = speed ? Tools._Number.randomCountBySection(speed[0], speed[1])[0] : Tools._Number.randomCountBySection(5, 10)[0];
                    let angle = rotation ? Tools._Number.randomCountBySection(rotation[0], rotation[1])[0] : Tools._Number.randomCountBySection(0, 360)[0];
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
                        let point = Tools._Point.getRoundPos(angle, radius0, centerPoint);
                        Img.pos(point.x, point.y);
                        if (point.distance(centerPoint.x, centerPoint.y) <= 20 || point.distance(centerPoint.x, centerPoint.y) >= 1000) {
                            Img.removeSelf();
                            Laya.timer.clearAll(caller);
                        }
                    });
                    return Img;
                }
                _Particle._AnnularInhalation = _AnnularInhalation;
            })(_Particle = Effects._Particle || (Effects._Particle = {}));
            let _Glitter;
            (function (_Glitter) {
                class _GlitterImage extends Laya.Image {
                    constructor(parent, centerPos, radiusXY, urlArr, colorRGBA, width, height) {
                        super();
                        if (!parent.parent) {
                            return;
                        }
                        parent.addChild(this);
                        this.skin = urlArr ? Tools._Array.randomGetOne(urlArr) : _SkinUrl.星星1;
                        this.width = width ? Tools._Number.randomOneBySection(width[0], width[1]) : 80;
                        this.height = height ? Tools._Number.randomOneBySection(height[0], height[1]) : this.width;
                        this.pivotX = this.width / 2;
                        this.pivotY = this.height / 2;
                        let p = radiusXY ? Tools._Point.randomPointByCenter(centerPos, radiusXY[0], radiusXY[1], 1) : Tools._Point.randomPointByCenter(centerPos, 100, 100, 1);
                        this.pos(p[0].x, p[0].y);
                        let RGBA = [];
                        RGBA[0] = colorRGBA ? Tools._Number.randomOneBySection(colorRGBA[0][0], colorRGBA[1][0]) : Tools._Number.randomOneBySection(0, 255);
                        RGBA[1] = colorRGBA ? Tools._Number.randomOneBySection(colorRGBA[0][1], colorRGBA[1][1]) : Tools._Number.randomOneBySection(0, 255);
                        RGBA[2] = colorRGBA ? Tools._Number.randomOneBySection(colorRGBA[0][2], colorRGBA[1][2]) : Tools._Number.randomOneBySection(0, 255);
                        RGBA[3] = colorRGBA ? Tools._Number.randomOneBySection(colorRGBA[0][3], colorRGBA[1][3]) : Tools._Number.randomOneBySection(0, 255);
                        Color._colour(this, RGBA);
                        this.alpha = 0;
                    }
                }
                _Glitter._GlitterImage = _GlitterImage;
                function _blinkStar(parent, centerPos, radiusXY, urlArr, colorRGBA, width, height, scale, speed, rotateSpeed) {
                    let Img = new _GlitterImage(parent, centerPos, radiusXY, urlArr, colorRGBA, width, height);
                    Img.scaleX = 0;
                    Img.scaleY = 0;
                    let _scale = scale ? Tools._Number.randomOneBySection(scale[0], scale[1]) : Tools._Number.randomOneBySection(0.8, 1.2);
                    let _speed = speed ? Tools._Number.randomOneBySection(speed[0], speed[1]) : Tools._Number.randomOneBySection(0.01, 0.02);
                    let _rotateSpeed = rotateSpeed ? Tools._Number.randomOneInt(rotateSpeed[0], rotateSpeed[1]) : Tools._Number.randomOneInt(0, 5);
                    _rotateSpeed = Tools._Number.randomOneHalf() == 0 ? -_rotateSpeed : _rotateSpeed;
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
                    Img.skin = url ? url : _SkinUrl.光圈1;
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
            })(_Glitter = Effects._Glitter || (Effects._Glitter = {}));
            let _circulation;
            (function (_circulation) {
                class _circulationImage extends Laya.Image {
                    constructor(parent, urlArr, colorRGBA, width, height, zOrder) {
                        super();
                        parent.addChild(this);
                        this.skin = urlArr ? Tools._Array.randomGetOne(urlArr) : _SkinUrl.圆形发光1;
                        this.width = width ? Tools._Number.randomOneBySection(width[0], width[1]) : 80;
                        this.height = height ? Tools._Number.randomOneBySection(height[0], height[1]) : this.width;
                        this.pivotX = this.width / 2;
                        this.pivotY = this.height / 2;
                        let RGBA = [];
                        RGBA[0] = colorRGBA ? Tools._Number.randomOneBySection(colorRGBA[0][0], colorRGBA[1][0]) : Tools._Number.randomOneBySection(0, 255);
                        RGBA[1] = colorRGBA ? Tools._Number.randomOneBySection(colorRGBA[0][1], colorRGBA[1][1]) : Tools._Number.randomOneBySection(0, 255);
                        RGBA[2] = colorRGBA ? Tools._Number.randomOneBySection(colorRGBA[0][2], colorRGBA[1][2]) : Tools._Number.randomOneBySection(0, 255);
                        RGBA[3] = colorRGBA ? Tools._Number.randomOneBySection(colorRGBA[0][3], colorRGBA[1][3]) : Tools._Number.randomOneBySection(0, 255);
                        Color._colour(this, RGBA);
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
                        Animation2D.fadeOut(Imgfootprint, 1, 0, 200, 0, () => {
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
                            Img.rotation = Tools._Point.angleByPoint(Img.x - targetXY[0], Img.y - targetXY[1]) + 180;
                        }
                        let time = speed * 100 + distance / 5;
                        if (index == posArray.length + 1) {
                            targetXY = [posArray[0][0], posArray[0][1]];
                        }
                        Animation2D.move_Simple(Img, Img.x, Img.y, targetXY[0], targetXY[1], time, 0, () => {
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
            })(_circulation = Effects._circulation || (Effects._circulation = {}));
        })(Effects = lwg.Effects || (lwg.Effects = {}));
        let Click;
        (function (Click) {
            Click._switch = true;
            function _createButton() {
                let Btn = new Laya.Sprite();
                let img = new Laya.Image();
                let label = new Laya.Label();
            }
            Click._createButton = _createButton;
            Click._Type = {
                no: 'no',
                largen: 'largen',
                reduce: 'reduce',
            };
            Click._Use = {
                get value() {
                    return this['Click_name'] ? this['Click_name'] : null;
                },
                set value(val) {
                    this['Click_name'] = val;
                }
            };
            function _on(effect, target, caller, down, move, up, out) {
                let btnEffect;
                switch (effect) {
                    case Click._Type.no:
                        btnEffect = new _NoEffect();
                        break;
                    case Click._Type.largen:
                        btnEffect = new _Largen();
                        break;
                    case Click._Type.reduce:
                        btnEffect = new _Reduce();
                        break;
                    default:
                        btnEffect = new _Largen();
                        break;
                }
                target.on(Laya.Event.MOUSE_DOWN, caller, down);
                target.on(Laya.Event.MOUSE_MOVE, caller, move);
                target.on(Laya.Event.MOUSE_UP, caller, up);
                target.on(Laya.Event.MOUSE_OUT, caller, out);
                target.on(Laya.Event.MOUSE_DOWN, caller, btnEffect.down);
                target.on(Laya.Event.MOUSE_MOVE, caller, btnEffect.move);
                target.on(Laya.Event.MOUSE_UP, caller, btnEffect.up);
                target.on(Laya.Event.MOUSE_OUT, caller, btnEffect.out);
            }
            Click._on = _on;
            function _off(effect, target, caller, down, move, up, out) {
                let btnEffect;
                switch (effect) {
                    case Click._Type.no:
                        btnEffect = new _NoEffect();
                        break;
                    case Click._Type.largen:
                        btnEffect = new _Largen();
                        break;
                    case Click._Type.reduce:
                        btnEffect = new _Largen();
                        break;
                    default:
                        btnEffect = new _Reduce();
                        break;
                }
                target._off(Laya.Event.MOUSE_DOWN, caller, down);
                target._off(Laya.Event.MOUSE_MOVE, caller, move);
                target._off(Laya.Event.MOUSE_UP, caller, up);
                target._off(Laya.Event.MOUSE_OUT, caller, out);
                target._off(Laya.Event.MOUSE_DOWN, caller, btnEffect.down);
                target._off(Laya.Event.MOUSE_MOVE, caller, btnEffect.move);
                target._off(Laya.Event.MOUSE_UP, caller, btnEffect.up);
                target._off(Laya.Event.MOUSE_OUT, caller, btnEffect.out);
            }
            Click._off = _off;
            class _NoEffect {
                constructor() {
                }
                down() { }
                move() { }
                up() { }
                out() { }
            }
            Click._NoEffect = _NoEffect;
            class _Largen {
                constructor() {
                }
                down(event) {
                    event.currentTarget.scale(1.1, 1.1);
                    Audio._playSound(Click._audioUrl);
                }
                move() { }
                up(event) {
                    event.currentTarget.scale(1, 1);
                }
                out(event) {
                    event.currentTarget.scale(1, 1);
                }
            }
            Click._Largen = _Largen;
            class _Reduce {
                constructor() {
                }
                down(event) {
                    event.currentTarget.scale(0.9, 0.9);
                    Audio._playSound(Click._audioUrl);
                }
                move() { }
                up(event) {
                    event.currentTarget.scale(1, 1);
                }
                out(event) {
                    event.currentTarget.scale(1, 1);
                }
            }
            Click._Reduce = _Reduce;
        })(Click = lwg.Click || (lwg.Click = {}));
        let Animation3D;
        (function (Animation3D) {
            Animation3D.tweenMap = {};
            Animation3D.frameRate = 1;
            function moveTo(target, toPos, duration, caller, ease, complete, delay = 0, coverBefore = true, update, frame) {
                let position = target.transform.position.clone();
                if (duration == 0 || duration === undefined || duration === null) {
                    target.transform.position = toPos.clone();
                    complete && complete.apply(caller);
                    return;
                }
                if (frame <= 0 || frame === undefined || frame === null) {
                    frame = Animation3D.frameRate;
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
                if (!Animation3D.tweenMap[target.id]) {
                    Animation3D.tweenMap[target.id] = [];
                }
                Animation3D.tweenMap[target.id].push(tween);
            }
            Animation3D.moveTo = moveTo;
            function rotateTo(target, toRotation, duration, caller, ease, complete, delay, coverBefore, update, frame) {
                let rotation = target.transform.localRotationEuler.clone();
                if (duration == 0 || duration === undefined || duration === null) {
                    target.transform.localRotationEuler = toRotation.clone();
                    complete && complete.apply(caller);
                    return;
                }
                if (frame <= 0 || frame === undefined || frame === null) {
                    frame = Animation3D.frameRate;
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
                if (!Animation3D.tweenMap[target.id]) {
                    Animation3D.tweenMap[target.id] = [];
                }
                Animation3D.tweenMap[target.id].push(tween);
            }
            Animation3D.rotateTo = rotateTo;
            function scaleTo(target, toScale, duration, caller, ease, complete, delay, coverBefore, update, frame) {
                let localScale = target.transform.localScale.clone();
                if (duration == 0 || duration === undefined || duration === null) {
                    target.transform.localScale = toScale.clone();
                    complete && complete.apply(caller);
                    return;
                }
                if (frame <= 0 || frame === undefined || frame === null) {
                    frame = Animation3D.frameRate;
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
                if (!Animation3D.tweenMap[target.id]) {
                    Animation3D.tweenMap[target.id] = [];
                }
                Animation3D.tweenMap[target.id].push(tween);
            }
            Animation3D.scaleTo = scaleTo;
            function ClearTween(target) {
                let tweens = Animation3D.tweenMap[target.id];
                if (tweens && tweens.length) {
                    while (tweens.length > 0) {
                        let tween = tweens.pop();
                        tween.clear();
                    }
                }
                Laya.timer.clearAll(target);
            }
            Animation3D.ClearTween = ClearTween;
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
            Animation3D.rock = rock;
            function moveRotateTo(Sp3d, Target, duration, caller, ease, complete, delay, coverBefore, update, frame) {
                moveTo(Sp3d, Target.transform.position, duration, caller, ease, null, delay, coverBefore, update, frame);
                rotateTo(Sp3d, Target.transform.localRotationEuler, duration, caller, ease, complete, delay, coverBefore, null, frame);
            }
            Animation3D.moveRotateTo = moveRotateTo;
        })(Animation3D = lwg.Animation3D || (lwg.Animation3D = {}));
        let Animation2D;
        (function (Animation2D) {
            function _clearAll(arr) {
                for (let index = 0; index < arr.length; index++) {
                    Laya.Tween.clearAll(arr[index]);
                }
            }
            Animation2D._clearAll = _clearAll;
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
            Animation2D.circulation_scale = circulation_scale;
            function leftRight_Shake(node, range, time, delayed, func, click) {
                if (!delayed) {
                    delayed = 0;
                }
                if (!click) {
                    Click._switch = false;
                }
                Laya.Tween.to(node, { x: node.x - range }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { x: node.x + range * 2 }, time, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { x: node.x - range }, time, null, Laya.Handler.create(this, function () {
                            if (func) {
                                func();
                            }
                            if (!click) {
                                Click._switch = true;
                            }
                        }));
                    }));
                }), delayed);
            }
            Animation2D.leftRight_Shake = leftRight_Shake;
            function rotate(node, Erotate, time, delayed, func) {
                Laya.Tween.to(node, { rotation: Erotate }, time, null, Laya.Handler.create(node, function () {
                    if (func) {
                        func();
                    }
                }), delayed ? delayed : 0);
            }
            Animation2D.rotate = rotate;
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
            Animation2D.upDown_Overturn = upDown_Overturn;
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
            Animation2D.leftRight_Overturn = leftRight_Overturn;
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
            Animation2D.upDwon_Shake = upDwon_Shake;
            function fadeOut(node, alpha1, alpha2, time, delayed, func, stageClick) {
                node.alpha = alpha1;
                if (stageClick) {
                    Click._switch = false;
                }
                Laya.Tween.to(node, { alpha: alpha2 }, time, null, Laya.Handler.create(this, function () {
                    if (func) {
                        func();
                    }
                    if (stageClick) {
                        Click._switch = true;
                    }
                }), delayed ? delayed : 0);
            }
            Animation2D.fadeOut = fadeOut;
            function fadeOut_KickBack(node, alpha1, alpha2, time, delayed, func) {
                node.alpha = alpha1;
                Laya.Tween.to(node, { alpha: alpha2 }, time, null, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func();
                    }
                }), delayed);
            }
            Animation2D.fadeOut_KickBack = fadeOut_KickBack;
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
            Animation2D.move_FadeOut = move_FadeOut;
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
            Animation2D.move_Fade_Out = move_Fade_Out;
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
            Animation2D.move_FadeOut_Scale_01 = move_FadeOut_Scale_01;
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
            Animation2D.move_Scale = move_Scale;
            function move_rotate(Node, tRotate, tPoint, time, delayed, func) {
                Laya.Tween.to(Node, { rotation: tRotate, x: tPoint.x, y: tPoint.y }, time, null, Laya.Handler.create(Node['move_rotate'], () => {
                    if (func) {
                        func();
                    }
                }), delayed ? delayed : 0);
            }
            Animation2D.move_rotate = move_rotate;
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
            Animation2D.rotate_Scale = rotate_Scale;
            function drop_Simple(node, fY, tY, rotation, time, delayed, func) {
                node.y = fY;
                Laya.Tween.to(node, { y: tY, rotation: rotation }, time, Laya.Ease.circOut, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func();
                    }
                }), delayed);
            }
            Animation2D.drop_Simple = drop_Simple;
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
            Animation2D.drop_KickBack = drop_KickBack;
            function drop_Excursion(node, targetY, targetX, rotation, time, delayed, func) {
                Laya.Tween.to(node, { x: node.x + targetX, y: node.y + targetY * 1 / 6 }, time, Laya.Ease.expoIn, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { x: node.x + targetX + 50, y: targetY, rotation: rotation }, time, null, Laya.Handler.create(this, function () {
                        if (func !== null) {
                            func();
                        }
                    }), 0);
                }), delayed);
            }
            Animation2D.drop_Excursion = drop_Excursion;
            function goUp_Simple(node, initialY, initialR, targetY, time, delayed, func) {
                node.y = initialY;
                node.rotation = initialR;
                Laya.Tween.to(node, { y: targetY, rotation: 0 }, time, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func();
                    }
                }), delayed);
            }
            Animation2D.goUp_Simple = goUp_Simple;
            function cardRotateX_TowFace(node, time, func1, delayed, func2) {
                Laya.Tween.to(node, { scaleX: 0 }, time, null, Laya.Handler.create(this, function () {
                    Tools._Node.childrenVisible2D(node, false);
                    if (func1) {
                        func1();
                    }
                    Laya.Tween.to(node, { scaleX: 1 }, time * 0.9, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { scaleX: 0 }, time * 0.8, null, Laya.Handler.create(this, function () {
                            Tools._Node.childrenVisible2D(node, true);
                            Laya.Tween.to(node, { scaleX: 1 }, time * 0.7, null, Laya.Handler.create(this, function () {
                                if (func2) {
                                    func2();
                                }
                            }), 0);
                        }), 0);
                    }), 0);
                }), delayed);
            }
            Animation2D.cardRotateX_TowFace = cardRotateX_TowFace;
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
            Animation2D.cardRotateX_OneFace = cardRotateX_OneFace;
            function cardRotateY_TowFace(node, time, func1, delayed, func2) {
                Laya.Tween.to(node, { scaleY: 0 }, time, null, Laya.Handler.create(this, function () {
                    Tools._Node.childrenVisible2D(node, false);
                    if (func1) {
                        func1();
                    }
                    Laya.Tween.to(node, { scaleY: 1 }, time, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { scaleY: 0 }, time, null, Laya.Handler.create(this, function () {
                            Laya.Tween.to(node, { scaleY: 1 }, time * 1 / 2, null, Laya.Handler.create(this, function () {
                                Tools._Node.childrenVisible2D(node, true);
                                if (func2) {
                                    func2();
                                }
                            }), 0);
                        }), 0);
                    }), 0);
                }), delayed);
            }
            Animation2D.cardRotateY_TowFace = cardRotateY_TowFace;
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
            Animation2D.cardRotateY_OneFace = cardRotateY_OneFace;
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
            Animation2D.move_changeRotate = move_changeRotate;
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
            Animation2D.bomb_LeftRight = bomb_LeftRight;
            function bombs_Appear(node, firstAlpha, endScale, maxScale, rotation1, time1, time2, delayed, func) {
                node.scale(0, 0);
                node.alpha = firstAlpha;
                Laya.Tween.to(node, { scaleX: maxScale, scaleY: maxScale, alpha: 1, rotation: rotation1 }, time1, Laya.Ease.cubicInOut, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { scaleX: endScale, scaleY: endScale, rotation: 0 }, time2, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { scaleX: endScale + (maxScale - endScale) * 0.2, scaleY: endScale + (maxScale - endScale) * 0.2, rotation: 0 }, time2, null, Laya.Handler.create(this, function () {
                            Laya.Tween.to(node, { scaleX: endScale, scaleY: endScale, rotation: 0 }, time2, null, Laya.Handler.create(this, function () {
                                if (func) {
                                    func();
                                }
                            }), 0);
                        }), 0);
                    }), 0);
                }), delayed ? delayed : 0);
            }
            Animation2D.bombs_Appear = bombs_Appear;
            function bombs_AppearAllChild(node, firstAlpha, endScale, scale1, rotation1, time1, time2, interval, func, audioType) {
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
                        bombs_Appear(Child, firstAlpha, endScale, scale1, rotation1, time1, time2, null, func);
                    });
                    de1 += interval;
                }
            }
            Animation2D.bombs_AppearAllChild = bombs_AppearAllChild;
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
                        bombs_Vanish(node, endScale, alpha, rotation, time, 0, func);
                    });
                    de1 += interval;
                }
            }
            Animation2D.bombs_VanishAllChild = bombs_VanishAllChild;
            function bombs_Vanish(node, scale, alpha, rotation, time, delayed, func) {
                Laya.Tween.to(node, { scaleX: scale, scaleY: scale, alpha: alpha, rotation: rotation }, time, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
                    if (func) {
                        func();
                    }
                }), delayed ? delayed : 0);
            }
            Animation2D.bombs_Vanish = bombs_Vanish;
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
            Animation2D.swell_shrink = swell_shrink;
            function move_Simple(node, fX, fY, targetX, targetY, time, delayed, func, ease) {
                node.x = fX;
                node.y = fY;
                Laya.Tween.to(node, { x: targetX, y: targetY }, time, ease ? ease : null, Laya.Handler.create(this, function () {
                    if (func) {
                        func();
                    }
                }), delayed ? delayed : 0);
            }
            Animation2D.move_Simple = move_Simple;
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
            Animation2D.move_Deform_X = move_Deform_X;
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
            Animation2D.move_Deform_Y = move_Deform_Y;
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
            Animation2D.blink_FadeOut_v = blink_FadeOut_v;
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
            Animation2D.blink_FadeOut = blink_FadeOut;
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
            Animation2D.shookHead_Simple = shookHead_Simple;
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
            Animation2D.HintAni_01 = HintAni_01;
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
            Animation2D.scale_Alpha = scale_Alpha;
            function scale(target, fScaleX, fScaleY, eScaleX, eScaleY, time, delayed, func, ease) {
                target.scaleX = fScaleX;
                target.scaleY = fScaleY;
                Laya.Tween.to(target, { scaleX: eScaleX, scaleY: eScaleY }, time, ease ? ease : null, Laya.Handler.create(this, function () {
                    if (func) {
                        func();
                    }
                }), delayed ? delayed : 0);
            }
            Animation2D.scale = scale;
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
            Animation2D.rotate_Magnify_KickBack = rotate_Magnify_KickBack;
        })(Animation2D = lwg.Animation2D || (lwg.Animation2D = {}));
        let Setting;
        (function (Setting) {
            Setting._sound = {
                get switch() {
                    return Laya.LocalStorage.getItem('Setting_sound') == '0' ? false : true;
                },
                set switch(value) {
                    let val;
                    if (value) {
                        val = 1;
                    }
                    else {
                        val = 0;
                    }
                    Laya.LocalStorage.setItem('Setting_sound', val.toString());
                }
            };
            Setting._bgMusic = {
                get switch() {
                    return Laya.LocalStorage.getItem('Setting_bgMusic') == '0' ? false : true;
                },
                set switch(value) {
                    let val;
                    if (value) {
                        val = 1;
                        Laya.LocalStorage.setItem('Setting_bgMusic', val.toString());
                        Audio._playMusic();
                    }
                    else {
                        val = 0;
                        Laya.LocalStorage.setItem('Setting_bgMusic', val.toString());
                        Audio._stopMusic();
                    }
                }
            };
            Setting._shake = {
                get switch() {
                    return Laya.LocalStorage.getItem('Setting_shake') == '0' ? false : true;
                },
                set switch(value) {
                    let val;
                    if (value) {
                        val = 1;
                    }
                    else {
                        val = 0;
                    }
                    Laya.LocalStorage.setItem('Setting_shake', val.toString());
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
                    Admin._openScene(Admin._SceneName.Set);
                };
                Click._on(Click._Type.largen, btn, null, null, btnSetUp, null);
                Setting._BtnSet = btn;
                Setting._BtnSet.name = 'BtnSetNode';
                return btn;
            }
            Setting._createBtnSet = _createBtnSet;
            function btnSetAppear(delayed, x, y) {
                if (!Setting._BtnSet) {
                    return;
                }
                if (delayed) {
                    Animation2D.scale_Alpha(Setting._BtnSet, 0, 1, 1, 1, 1, 1, delayed, 0, f => {
                        Setting._BtnSet.visible = true;
                    });
                }
                else {
                    Setting._BtnSet.visible = true;
                }
                if (x) {
                    Setting._BtnSet.x = x;
                }
                if (y) {
                    Setting._BtnSet.y = y;
                }
            }
            Setting.btnSetAppear = btnSetAppear;
            function btnSetVinish(delayed) {
                if (!Setting._BtnSet) {
                    return;
                }
                if (delayed) {
                    Animation2D.scale_Alpha(Setting._BtnSet, 1, 1, 1, 1, 1, 0, delayed, 0, f => {
                        Setting._BtnSet.visible = false;
                    });
                }
                else {
                    Setting._BtnSet.visible = false;
                }
            }
            Setting.btnSetVinish = btnSetVinish;
        })(Setting = lwg.Setting || (lwg.Setting = {}));
        let Audio;
        (function (Audio) {
            let _voiceUrl;
            (function (_voiceUrl) {
                _voiceUrl["btn"] = "Lwg/Voice/btn.wav";
                _voiceUrl["bgm"] = "Lwg/Voice/bgm.mp3";
                _voiceUrl["victory"] = "Lwg/Voice/guoguan.wav";
                _voiceUrl["defeated"] = "Lwg/Voice/wancheng.wav";
                _voiceUrl["huodejinbi"] = "Lwg/Voice/huodejinbi.wav";
            })(_voiceUrl = Audio._voiceUrl || (Audio._voiceUrl = {}));
            function _playSound(url, number, func) {
                if (!url) {
                    url = _voiceUrl.btn;
                }
                if (!number) {
                    number = 1;
                }
                if (Setting._sound.switch) {
                    Laya.SoundManager.playSound(url, number, Laya.Handler.create(this, function () {
                        if (func) {
                            func();
                        }
                    }));
                }
            }
            Audio._playSound = _playSound;
            function _playDefeatedSound(url, number, func) {
                if (!url) {
                    url = _voiceUrl.defeated;
                }
                if (!number) {
                    number = 1;
                }
                if (Setting._sound.switch) {
                    Laya.SoundManager.playSound(url, number, Laya.Handler.create(this, function () {
                        if (func) {
                            func();
                        }
                    }));
                }
            }
            Audio._playDefeatedSound = _playDefeatedSound;
            function _playVictorySound(url, number, func) {
                if (!url) {
                    url = _voiceUrl.victory;
                }
                if (!number) {
                    number = 1;
                }
                if (Setting._sound.switch) {
                    Laya.SoundManager.playSound(url, number, Laya.Handler.create(this, function () {
                        if (func) {
                            func();
                        }
                    }));
                }
            }
            Audio._playVictorySound = _playVictorySound;
            function _playMusic(url, number, delayed) {
                if (!url) {
                    url = _voiceUrl.bgm;
                }
                if (!number) {
                    number = 0;
                }
                if (!delayed) {
                    delayed = 0;
                }
                if (Setting._bgMusic.switch) {
                    Laya.SoundManager.playMusic(url, number, Laya.Handler.create(this, function () { }), delayed);
                }
            }
            Audio._playMusic = _playMusic;
            function _stopMusic() {
                Laya.SoundManager.stopMusic();
            }
            Audio._stopMusic = _stopMusic;
        })(Audio = lwg.Audio || (lwg.Audio = {}));
        let Tools;
        (function (Tools) {
            function color_RGBtoHexString(r, g, b) {
                return '#' + ("00000" + (r << 16 | g << 8 | b).toString(16)).slice(-6);
            }
            Tools.color_RGBtoHexString = color_RGBtoHexString;
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
            })(_Format = Tools._Format || (Tools._Format = {}));
            let _Node;
            (function (_Node) {
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
                    return Img;
                }
                _Node.simpleCopyImg = simpleCopyImg;
                function leaveStage(_Sprite, func) {
                    let Parent = _Sprite.parent;
                    let bool = false;
                    let gPoint = Parent.localToGlobal(new Laya.Point(_Sprite.x, _Sprite.y));
                    if (gPoint.x > Laya.stage.width + 10 || gPoint.x < -10) {
                        if (func) {
                            func();
                        }
                        bool = true;
                    }
                    if (gPoint.y > Laya.stage.height + 10 || gPoint.y < -10) {
                        if (func) {
                            func();
                        }
                        bool = true;
                    }
                    return bool;
                }
                _Node.leaveStage = leaveStage;
                function checkTwoDistance(_Sprite1, _Sprite2, distance, func) {
                    let Parent1 = _Sprite1.parent;
                    let gPoint1 = Parent1.localToGlobal(new Laya.Point(_Sprite1.x, _Sprite1.y));
                    let Parent2 = _Sprite2.parent;
                    let gPoint2 = Parent2.localToGlobal(new Laya.Point(_Sprite2.x, _Sprite2.y));
                    if (gPoint1.distance(gPoint2.x, gPoint2.y) < distance) {
                        if (func) {
                            func();
                        }
                    }
                    return gPoint1.distance(gPoint2.x, gPoint2.y);
                }
                _Node.checkTwoDistance = checkTwoDistance;
                function zOrderByY(sp, zOrder, along) {
                    let arr = [];
                    if (sp.numChildren == 0) {
                        return arr;
                    }
                    ;
                    for (let index = 0; index < sp.numChildren; index++) {
                        const element = sp.getChildAt(index);
                        arr.push(element);
                    }
                    _ObjArray.onPropertySort(arr, 'y');
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
                _Node.zOrderByY = zOrderByY;
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
                    let randomIndex = Tools._Array.randomGetOut(indexArr, num);
                    for (let j = 0; j < randomIndex.length; j++) {
                        childArr.push(node.getChildAt(randomIndex[j]));
                    }
                    return childArr;
                }
                _Node.randomChildren = randomChildren;
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
                        }
                    }
                }
                _Node.removeOneChildren = removeOneChildren;
                function checkChildren(node, nodeName) {
                    let bool = false;
                    for (let index = 0; index < node.numChildren; index++) {
                        const element = node.getChildAt(index);
                        if (element.name == nodeName) {
                            bool = true;
                        }
                    }
                    return bool;
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
                function createPrefab(prefab, name) {
                    let sp = Laya.Pool.getItemByCreateFun(name ? name : prefab.json['props']['name'], prefab.create, prefab);
                    return sp;
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
            })(_Node = Tools._Node || (Tools._Node = {}));
            let _Number;
            (function (_Number) {
                function randomOneHalf() {
                    let number;
                    number = Math.floor(Math.random() * 2);
                    return number;
                }
                _Number.randomOneHalf = randomOneHalf;
                function randomOneInt(section1, section2) {
                    if (section2) {
                        return Math.floor(Math.random() * (section2 - section1)) + section1;
                    }
                    else {
                        return Math.floor(Math.random() * section1);
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
                                num = Math.floor(Math.random() * (section2 - section1)) + section1;
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
                                num = Math.floor(Math.random() * section1);
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
                            num = Math.floor(Math.random() * (section2 - section1)) + section1;
                        }
                        else {
                            num = Math.random() * (section2 - section1) + section1;
                        }
                        return num;
                    }
                    else {
                        let num;
                        if (intSet) {
                            num = Math.floor(Math.random() * section1);
                        }
                        else {
                            num = Math.random() * section1;
                        }
                        return num;
                    }
                }
                _Number.randomOneBySection = randomOneBySection;
            })(_Number = Tools._Number || (Tools._Number = {}));
            let _Point;
            (function (_Point) {
                function getOtherLocal(element, Other) {
                    let Parent = element.parent;
                    let gPoint = Parent.localToGlobal(new Laya.Point(element.x, element.y));
                    return Other.globalToLocal(gPoint);
                }
                _Point.getOtherLocal = getOtherLocal;
                function angleByRad(angle) {
                    return angle / 180 * Math.PI;
                }
                _Point.angleByRad = angleByRad;
                function twoNodeDistance(obj1, obj2) {
                    const Parnet1 = obj1.parent;
                    const Parnet2 = obj2.parent;
                    const p1 = Parnet1.localToGlobal(new Laya.Point(obj1.x, obj1.y));
                    const p2 = Parnet2.localToGlobal(new Laya.Point(obj2.x, obj2.y));
                    let len = p1.distance(p2.x, p2.y);
                    return len;
                }
                _Point.twoNodeDistance = twoNodeDistance;
                function angleByPoint(x, y) {
                    let radian = Math.atan2(x, y);
                    let angle = 90 - radian * (180 / Math.PI);
                    if (angle <= 0) {
                        angle = 270 + (90 + angle);
                    }
                    return angle - 90;
                }
                _Point.angleByPoint = angleByPoint;
                ;
                function pointByAngle(angle) {
                    let radian = (90 - angle) / (180 / Math.PI);
                    let p = new Laya.Point(Math.sin(radian), Math.cos(radian));
                    p.normalize();
                    return p;
                }
                _Point.pointByAngle = pointByAngle;
                ;
                function dotRotatePoint(x0, y0, x1, y1, angle) {
                    let x2 = x0 + (x1 - x0) * Math.cos(angle * Math.PI / 180) - (y1 - y0) * Math.sin(angle * Math.PI / 180);
                    let y2 = y0 + (x1 - x0) * Math.sin(angle * Math.PI / 180) + (y1 - y0) * Math.cos(angle * Math.PI / 180);
                    return new Laya.Point(x2, y2);
                }
                _Point.dotRotatePoint = dotRotatePoint;
                function angleAndLenByPoint(angle, len) {
                    if (angle % 90 === 0 || !angle) {
                    }
                    const speedXY = { x: 0, y: 0 };
                    speedXY.x = len * Math.cos(angle * Math.PI / 180);
                    speedXY.y = len * Math.sin(angle * Math.PI / 180);
                    return new Laya.Point(speedXY.x, speedXY.y);
                }
                _Point.angleAndLenByPoint = angleAndLenByPoint;
                function getRoundPos(angle, radius, centerPos) {
                    var center = centerPos;
                    var radius = radius;
                    var hudu = (2 * Math.PI / 360) * angle;
                    var X = center.x + Math.sin(hudu) * radius;
                    var Y = center.y - Math.cos(hudu) * radius;
                    return new Laya.Point(X, Y);
                }
                _Point.getRoundPos = getRoundPos;
                function randomPointByCenter(centerPos, radiusX, radiusY, count) {
                    if (!count) {
                        count = 1;
                    }
                    let arr = [];
                    for (let index = 0; index < count; index++) {
                        let x0 = Tools._Number.randomCountBySection(0, radiusX, 1, false);
                        let y0 = Tools._Number.randomCountBySection(0, radiusY, 1, false);
                        let diffX = Tools._Number.randomOneHalf() == 0 ? x0[0] : -x0[0];
                        let diffY = Tools._Number.randomOneHalf() == 0 ? y0[0] : -y0[0];
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
            })(_Point = Tools._Point || (Tools._Point = {}));
            let _3D;
            (function (_3D) {
                function getMeshSize(MSp3D) {
                    if (MSp3D.meshRenderer) {
                        let v3;
                        let extent = MSp3D.meshRenderer.bounds.getExtent();
                        return v3 = new Laya.Vector3(extent.x * 2, extent.y * 2, extent.z * 2);
                    }
                }
                _3D.getMeshSize = getMeshSize;
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
                    point.x = ScreenV4.x;
                    point.y = ScreenV4.y;
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
                    camera.viewportPointToRay(vector2, _ray);
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
            })(_3D = Tools._3D || (Tools._3D = {}));
            let _Skeleton;
            (function (_Skeleton) {
                function sk_indexControl(sk, name) {
                    sk.play(name, true);
                    sk.player.currentTime = 15 * 1000 / sk.player.cacheFrameRate;
                }
                _Skeleton.sk_indexControl = sk_indexControl;
            })(_Skeleton = Tools._Skeleton || (Tools._Skeleton = {}));
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
                function reverseRoundMask(node, x, y, radius, eliminate) {
                    if (eliminate == undefined || eliminate == true) {
                        _Node.removeAllChildren(node);
                    }
                    let interactionArea = new Laya.Sprite();
                    interactionArea.name = 'reverseRoundMask';
                    interactionArea.blendMode = "destination-out";
                    node.cacheAs = "bitmap";
                    node.addChild(interactionArea);
                    interactionArea.graphics.drawCircle(0, 0, radius, "#000000");
                    interactionArea.pos(x, y);
                    return interactionArea;
                }
                _Draw.reverseRoundMask = reverseRoundMask;
                function reverseRoundrectMask(node, x, y, width, height, round, eliminate) {
                    if (eliminate == undefined || eliminate == true) {
                        _Node.removeAllChildren(node);
                    }
                    let interactionArea = new Laya.Sprite();
                    interactionArea.name = 'reverseRoundrectMask';
                    interactionArea.blendMode = "destination-out";
                    node.cacheAs = "bitmap";
                    node.addChild(interactionArea);
                    interactionArea.graphics.drawPath(0, 0, [["moveTo", 5, 0], ["lineTo", width - round, 0], ["arcTo", width, 0, width, round, round], ["lineTo", width, height - round], ["arcTo", width, height, width - round, height, round], ["lineTo", height - round, height], ["arcTo", 0, height, 0, height - round, round], ["lineTo", 0, round], ["arcTo", 0, 0, round, 0, round], ["closePath"]], { fillStyle: "#000000" });
                    interactionArea.width = width;
                    interactionArea.height = height;
                    interactionArea.pivotX = width / 2;
                    interactionArea.pivotY = height / 2;
                    interactionArea.pos(x, y);
                }
                _Draw.reverseRoundrectMask = reverseRoundrectMask;
            })(_Draw = Tools._Draw || (Tools._Draw = {}));
            let _ObjArray;
            (function (_ObjArray) {
                function onPropertySort(array, property) {
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
                _ObjArray.onPropertySort = onPropertySort;
                function differentPropertyTwo(objArr1, objArr2, property) {
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
                            result.push(obj1);
                        }
                    }
                    return result;
                }
                _ObjArray.differentPropertyTwo = differentPropertyTwo;
                function identicalPropertyObjArr(data1, data2, property) {
                    var result = [];
                    for (var i = 0; i < data1.length; i++) {
                        var obj1 = data1[i];
                        var obj1Name = obj1[property];
                        var isExist = false;
                        for (var j = 0; j < data2.length; j++) {
                            var obj2 = data2[j];
                            var obj2Name = obj2[property];
                            if (obj2Name == name) {
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
                function objCopy(obj) {
                    var copyObj = {};
                    for (const item in obj) {
                        if (obj.hasOwnProperty(item)) {
                            const element = obj[item];
                            if (typeof element === 'object') {
                                if (Array.isArray(element)) {
                                    let arr1 = _Array.copy(element);
                                    copyObj[item] = arr1;
                                }
                                else {
                                    objCopy(element);
                                }
                            }
                            else {
                                copyObj[item] = element;
                            }
                        }
                    }
                    return objCopy;
                }
                _ObjArray.objCopy = objCopy;
            })(_ObjArray = Tools._ObjArray || (Tools._ObjArray = {}));
            let _Array;
            (function (_Array) {
                function oneAddToarray(array1, array2) {
                    for (let index = 0; index < array2.length; index++) {
                        const element = array2[index];
                        array1.push(element);
                    }
                    return array1;
                }
                _Array.oneAddToarray = oneAddToarray;
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
            })(_Array = Tools._Array || (Tools._Array = {}));
        })(Tools = lwg.Tools || (lwg.Tools = {}));
        let LwgPreLoad;
        (function (LwgPreLoad) {
            let _scene3D = [];
            let _prefab3D = [];
            let _mesh3D = [];
            let _material = [];
            let _texture = [];
            let _texture2D = [];
            let _pic2D = [];
            let _scene2D = [];
            let _prefab2D = [];
            let _json = [];
            let _skeleton = [];
            LwgPreLoad._sumProgress = 0;
            LwgPreLoad._loadOrder = [];
            LwgPreLoad._loadOrderIndex = 0;
            LwgPreLoad._loadType = Admin._SceneName.PreLoad;
            let _ListName;
            (function (_ListName) {
                _ListName["scene3D"] = "scene3D";
                _ListName["prefab3D"] = "prefab3D";
                _ListName["mesh3D"] = "mesh3D";
                _ListName["material"] = "material";
                _ListName["texture"] = "texture";
                _ListName["texture2D"] = "texture2D";
                _ListName["pic2D"] = "pic2D";
                _ListName["scene2D"] = "scene2D";
                _ListName["prefab2D"] = "prefab2D";
                _ListName["json"] = "json";
                _ListName["skeleton"] = "skeleton";
            })(_ListName = LwgPreLoad._ListName || (LwgPreLoad._ListName = {}));
            LwgPreLoad._currentProgress = {
                get value() {
                    return this['len'] ? this['len'] : 0;
                },
                set value(val) {
                    this['len'] = val;
                    if (this['len'] >= LwgPreLoad._sumProgress) {
                        if (LwgPreLoad._sumProgress == 0) {
                            return;
                        }
                        console.log('当前进度条进度为:', LwgPreLoad._currentProgress.value / LwgPreLoad._sumProgress);
                        console.log('所有资源加载完成！此时所有资源可通过例如 Laya.loader.getRes("url")获取');
                        EventAdmin._notify(LwgPreLoad._Event.complete);
                    }
                    else {
                        let number = 0;
                        for (let index = 0; index <= LwgPreLoad._loadOrderIndex; index++) {
                            number += LwgPreLoad._loadOrder[index].length;
                        }
                        if (this['len'] == number) {
                            LwgPreLoad._loadOrderIndex++;
                        }
                        EventAdmin._notify(LwgPreLoad._Event.stepLoding);
                    }
                },
            };
            let _Event;
            (function (_Event) {
                _Event["importList"] = "_PreLoad_importList";
                _Event["complete"] = "_PreLoad_complete";
                _Event["stepLoding"] = "_PreLoad_startLoding";
                _Event["progress"] = "_PreLoad_progress";
            })(_Event = LwgPreLoad._Event || (LwgPreLoad._Event = {}));
            function _remakeLode() {
                _scene3D = [];
                _prefab3D = [];
                _mesh3D = [];
                _material = [];
                _texture2D = [];
                _pic2D = [];
                _scene2D = [];
                _prefab2D = [];
                _json = [];
                _skeleton = [];
                LwgPreLoad._loadOrder = [];
                LwgPreLoad._sumProgress = 0;
                LwgPreLoad._loadOrderIndex = 0;
                LwgPreLoad._currentProgress.value = 0;
            }
            LwgPreLoad._remakeLode = _remakeLode;
            class _PreLoadScene extends Admin._SceneBase {
                moduleOnAwake() {
                    LwgPreLoad._remakeLode();
                }
                lwgStartLoding(any) {
                    EventAdmin._notify(LwgPreLoad._Event.importList, (any));
                }
                moduleEvent() {
                    EventAdmin._registerOnce(_Event.importList, this, (listObj) => {
                        for (const key in listObj) {
                            if (Object.prototype.hasOwnProperty.call(listObj, key)) {
                                for (const key1 in listObj[key]) {
                                    if (Object.prototype.hasOwnProperty.call(listObj[key], key1)) {
                                        const element = listObj[key][key1];
                                        switch (key) {
                                            case _ListName.json:
                                                _json.push(element);
                                                break;
                                            case _ListName.material:
                                                _material.push(element);
                                                break;
                                            case _ListName.mesh3D:
                                                _mesh3D.push(element);
                                                break;
                                            case _ListName.pic2D:
                                                _pic2D.push(element);
                                                break;
                                            case _ListName.prefab2D:
                                                _prefab2D.push(element);
                                                break;
                                            case _ListName.prefab3D:
                                                _prefab3D.push(element);
                                                break;
                                            case _ListName.scene2D:
                                                _scene2D.push(element);
                                                break;
                                            case _ListName.scene3D:
                                                _scene3D.push(element);
                                                break;
                                            case _ListName.texture2D:
                                                _texture2D.push(element);
                                                break;
                                            case _ListName.skeleton:
                                                _skeleton.push(element);
                                                break;
                                            case _ListName.texture:
                                                _texture.push(element);
                                                break;
                                            default:
                                                break;
                                        }
                                    }
                                }
                            }
                        }
                        LwgPreLoad._loadOrder = [_pic2D, _scene2D, _prefab2D, _prefab3D, _json, _texture, _texture2D, _mesh3D, _material, _skeleton, _scene3D];
                        for (let index = 0; index < LwgPreLoad._loadOrder.length; index++) {
                            LwgPreLoad._sumProgress += LwgPreLoad._loadOrder[index].length;
                            if (LwgPreLoad._loadOrder[index].length <= 0) {
                                LwgPreLoad._loadOrder.splice(index, 1);
                                index--;
                            }
                        }
                        let time = this.lwgOpenAni();
                        Laya.timer.once(time ? time : 0, this, () => {
                            EventAdmin._notify(LwgPreLoad._Event.stepLoding);
                        });
                    });
                    EventAdmin._register(_Event.stepLoding, this, () => { this.startLodingRule(); });
                    EventAdmin._registerOnce(_Event.complete, this, () => {
                        Laya.timer.once(this.lwgAllComplete(), this, () => {
                            Admin._SceneControl[LwgPreLoad._loadType] = this._Owner;
                            if (LwgPreLoad._loadType !== Admin._SceneName.PreLoad) {
                                if (Admin._PreLoadCutIn.openName) {
                                    console.log('预加载完毕开始打开界面！');
                                    Admin._openScene(Admin._PreLoadCutIn.openName, Admin._PreLoadCutIn.closeName, () => {
                                        Admin._PreLoadCutIn.func;
                                        Admin._closeScene(LwgPreLoad._loadType);
                                    }, Admin._PreLoadCutIn.zOrder);
                                }
                            }
                            else {
                                for (const key in Admin._Moudel) {
                                    if (Object.prototype.hasOwnProperty.call(Admin._Moudel, key)) {
                                        const element = Admin._Moudel[key];
                                        if (element['_init']) {
                                            element['_init']();
                                        }
                                        else {
                                            console.log(element, '模块没有初始化函数！');
                                        }
                                    }
                                }
                                if (Admin._GuideControl.switch) {
                                    this._openScene(_SceneName.Guide, true, false, () => {
                                        LwgPreLoad._loadType = Admin._SceneName.PreLoadCutIn;
                                    });
                                }
                                else {
                                    this._openScene(_SceneName.Start, true, false, () => {
                                        LwgPreLoad._loadType = Admin._SceneName.PreLoadCutIn;
                                    });
                                }
                            }
                        });
                    });
                    EventAdmin._register(_Event.progress, this, () => {
                        LwgPreLoad._currentProgress.value++;
                        if (LwgPreLoad._currentProgress.value < LwgPreLoad._sumProgress) {
                            console.log('当前进度条进度为:', LwgPreLoad._currentProgress.value / LwgPreLoad._sumProgress);
                            this.lwgStepComplete();
                        }
                    });
                }
                moduleOnEnable() {
                    LwgPreLoad._loadOrderIndex = 0;
                }
                startLodingRule() {
                    if (LwgPreLoad._loadOrder.length <= 0) {
                        console.log('没有加载项');
                        EventAdmin._notify(LwgPreLoad._Event.complete);
                        return;
                    }
                    let alreadyPro = 0;
                    for (let i = 0; i < LwgPreLoad._loadOrderIndex; i++) {
                        alreadyPro += LwgPreLoad._loadOrder[i].length;
                    }
                    let index = LwgPreLoad._currentProgress.value - alreadyPro;
                    switch (LwgPreLoad._loadOrder[LwgPreLoad._loadOrderIndex]) {
                        case _pic2D:
                            Laya.loader.load(_pic2D[index], Laya.Handler.create(this, (any) => {
                                if (any == null) {
                                    console.log('XXXXXXXXXXX2D资源' + _pic2D[index] + '加载失败！不会停止加载进程！', '数组下标为：', index, 'XXXXXXXXXXX');
                                }
                                else {
                                    console.log('2D图片' + _pic2D[index] + '加载完成！', '数组下标为：', index);
                                }
                                EventAdmin._notify(_Event.progress);
                            }));
                            break;
                        case _scene2D:
                            Laya.loader.load(_scene2D[index], Laya.Handler.create(this, (any) => {
                                if (any == null) {
                                    console.log('XXXXXXXXXXX数据表' + _scene2D[index] + '加载失败！不会停止加载进程！', '数组下标为：', index, 'XXXXXXXXXXX');
                                }
                                else {
                                    console.log('2D场景' + _scene2D[index] + '加载完成！', '数组下标为：', index);
                                }
                                EventAdmin._notify(_Event.progress);
                            }), null, Laya.Loader.JSON);
                            break;
                        case _scene3D:
                            Laya.Scene3D.load(_scene3D[index]['url'], Laya.Handler.create(this, (Scene) => {
                                if (Scene == null) {
                                    console.log('XXXXXXXXXXX3D场景' + _scene3D[index]['url'] + '加载失败！不会停止加载进程！', '数组下标为：', index, 'XXXXXXXXXXX');
                                }
                                else {
                                    _scene3D[index]['Scene'] = Scene;
                                    console.log('3D场景' + _scene3D[index]['url'] + '加载完成！', '数组下标为：', index);
                                }
                                EventAdmin._notify(_Event.progress);
                            }));
                            break;
                        case _prefab3D:
                            Laya.Sprite3D.load(_prefab3D[index]['url'], Laya.Handler.create(this, (Sp) => {
                                if (Sp == null) {
                                    console.log('XXXXXXXXXXX3D预设体' + _prefab3D[index]['url'] + '加载失败！不会停止加载进程！', '数组下标为：', index, 'XXXXXXXXXXX');
                                }
                                else {
                                    _prefab3D[index]['Prefab'] = Sp;
                                    console.log('3D预制体' + _prefab3D[index]['url'] + '加载完成！', '数组下标为：', index);
                                }
                                EventAdmin._notify(_Event.progress);
                            }));
                            break;
                        case _mesh3D:
                            Laya.Mesh.load(_mesh3D[index]['url'], Laya.Handler.create(this, (any) => {
                                if (any == null) {
                                    console.log('XXXXXXXXXXX3D网格' + _mesh3D[index]['url'] + '加载失败！不会停止加载进程！', '数组下标为：', index, 'XXXXXXXXXXX');
                                }
                                else {
                                    console.log('3D网格' + _mesh3D[index]['url'] + '加载完成！', '数组下标为：', index);
                                }
                                EventAdmin._notify(_Event.progress);
                            }));
                            break;
                        case _texture:
                            Laya.loader.load(_texture[index]['url'], Laya.Handler.create(this, (tex) => {
                                if (tex == null) {
                                    console.log('XXXXXXXXXXX2D纹理' + _texture[index]['url'] + '加载失败！不会停止加载进程！', '数组下标为：', index, 'XXXXXXXXXXX');
                                }
                                else {
                                    _texture[index]['texture'] = tex;
                                    console.log('纹理' + _texture[index]['url'] + '加载完成！', '数组下标为：', index);
                                }
                                EventAdmin._notify(_Event.progress);
                            }));
                            break;
                        case _texture2D:
                            Laya.Texture2D.load(_texture2D[index]['url'], Laya.Handler.create(this, function (tex) {
                                if (tex == null) {
                                    console.log('XXXXXXXXXXX2D纹理' + _texture2D[index]['url'] + '加载失败！不会停止加载进程！', '数组下标为：', index, 'XXXXXXXXXXX');
                                }
                                else {
                                    _texture2D[index]['texture2D'] = tex;
                                    console.log('3D纹理' + _texture2D[index]['url'] + '加载完成！', '数组下标为：', index);
                                }
                                EventAdmin._notify(_Event.progress);
                            }));
                            break;
                        case _material:
                            Laya.Material.load(_material[index]['url'], Laya.Handler.create(this, (any) => {
                                if (any == null) {
                                    console.log('XXXXXXXXXXX材质' + _material[index]['url'] + '加载失败！不会停止加载进程！', '数组下标为：', index, 'XXXXXXXXXXX');
                                }
                                else {
                                    console.log('材质' + _material[index]['url'] + '加载完成！', '数组下标为：', index);
                                }
                                EventAdmin._notify(_Event.progress);
                            }));
                            break;
                        case _json:
                            Laya.loader.load(_json[index]['url'], Laya.Handler.create(this, (data) => {
                                if (data == null) {
                                    console.log('XXXXXXXXXXX数据表' + _json[index] + '加载失败！不会停止加载进程！', '数组下标为：', index, 'XXXXXXXXXXX');
                                }
                                else {
                                    _json[index]['data'] = data["RECORDS"];
                                    console.log('数据表' + _json[index]['url'] + '加载完成！', '数组下标为：', index);
                                }
                                EventAdmin._notify(_Event.progress);
                            }), null, Laya.Loader.JSON);
                            break;
                        case _skeleton:
                            _skeleton[index]['templet'].on(Laya.Event.ERROR, this, () => {
                                console.log('XXXXXXXXXXX骨骼动画' + _skeleton[index] + '加载失败！不会停止加载进程！', '数组下标为：', index, 'XXXXXXXXXXX');
                                EventAdmin._notify(_Event.progress);
                            });
                            _skeleton[index]['templet'].on(Laya.Event.COMPLETE, this, () => {
                                console.log('骨骼动画', _skeleton[index]['templet']['url'], '加载完成！', '数组下标为：', index);
                                EventAdmin._notify(_Event.progress);
                            });
                            _skeleton[index]['templet'].loadAni(_skeleton[index]['url']);
                            break;
                        case _prefab2D:
                            Laya.loader.load(_prefab2D[index]['url'], Laya.Handler.create(this, (prefab) => {
                                if (prefab == null) {
                                    console.log('XXXXXXXXXXX数据表' + _prefab2D[index]['url'] + '加载失败！不会停止加载进程！', '数组下标为：', index, 'XXXXXXXXXXX');
                                }
                                else {
                                    let _prefab = new Laya.Prefab();
                                    _prefab.json = prefab;
                                    _prefab2D[index]['prefab'] = _prefab;
                                    console.log('2D预制体' + _prefab2D[index]['url'] + '加载完成！', '数组下标为：', index);
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
            LwgPreLoad._PreLoadScene = _PreLoadScene;
        })(LwgPreLoad = lwg.LwgPreLoad || (lwg.LwgPreLoad = {}));
        let _LwgInit;
        (function (_LwgInit) {
            _LwgInit._pkgStep = 0;
            _LwgInit._pkgInfo = [
                { name: "sp1", root: "res" },
                { name: "sp2", root: "3DScene" },
                { name: "sp3", root: "3DPrefab" },
            ];
            let _Event;
            (function (_Event) {
                _Event["start"] = "_ResPrepare_start";
                _Event["nextStep"] = "_ResPrepare_nextStep";
                _Event["compelet"] = "_ResPrepare_compelet";
            })(_Event = _LwgInit._Event || (_LwgInit._Event = {}));
            function _init() {
                switch (Platform._Ues.value) {
                    case Platform._Tpye.WeChat:
                        _loadPkg_Wechat();
                        break;
                    case Platform._Tpye.OPPO || Platform._Tpye.VIVO:
                        _loadPkg_VIVO();
                        break;
                    default:
                        break;
                }
            }
            _LwgInit._init = _init;
            function _loadPkg_VIVO() {
                if (_LwgInit._pkgStep !== _LwgInit._pkgInfo.length) {
                    let info = _LwgInit._pkgInfo[_LwgInit._pkgStep];
                    let name = info.name;
                    Laya.Browser.window.qg.loadSubpackage({
                        name: name,
                        success: (res) => {
                            _LwgInit._pkgStep++;
                            _loadPkg_VIVO();
                        },
                        fail: (res) => {
                            console.error(`load ${name} err: `, res);
                        },
                    });
                }
            }
            _LwgInit._loadPkg_VIVO = _loadPkg_VIVO;
            function _loadPkg_Wechat() {
                if (_LwgInit._pkgStep !== _LwgInit._pkgInfo.length) {
                    let info = _LwgInit._pkgInfo[_LwgInit._pkgStep];
                    let name = info.name;
                    let root = info.root;
                    Laya.Browser.window.wx.loadSubpackage({
                        name: name,
                        success: (res) => {
                            console.log(`load ${name} suc`);
                            Laya.MiniAdpter.subNativeFiles[name] = root;
                            Laya.MiniAdpter.nativefiles.push(root);
                            _LwgInit._pkgStep++;
                            console.log("加载次数", _LwgInit._pkgStep);
                            _loadPkg_Wechat();
                        },
                        fail: (res) => {
                            console.error(`load ${name} err: `, res);
                        },
                    });
                }
            }
            _LwgInit._loadPkg_Wechat = _loadPkg_Wechat;
            class _LwgInitScene extends Admin._SceneBase {
                lwgOpenAni() {
                    return 1;
                }
                moduleOnAwake() {
                }
                moduleOnStart() {
                    _init();
                    DateAdmin._init();
                    this._openScene(_SceneName.PreLoad);
                    this._Owner.close();
                }
                ;
            }
            _LwgInit._LwgInitScene = _LwgInitScene;
        })(_LwgInit = lwg._LwgInit || (lwg._LwgInit = {}));
        let Execution;
        (function (Execution) {
            Execution._execution = {
                get value() {
                    if (!this['_Execution_executionNum']) {
                        return Laya.LocalStorage.getItem('_Execution_executionNum') ? Number(Laya.LocalStorage.getItem('_Execution_executionNum')) : 15;
                    }
                    return this['_Execution_executionNum'];
                },
                set value(val) {
                    console.log(val);
                    this['_Execution_executionNum'] = val;
                    Laya.LocalStorage.setItem('_Execution_executionNum', val.toString());
                }
            };
            Execution._addExDate = {
                get value() {
                    if (!this['_Execution_addExDate']) {
                        return Laya.LocalStorage.getItem('_Execution_addExDate') ? Number(Laya.LocalStorage.getItem('_Execution_addExDate')) : (new Date()).getDay();
                    }
                    return this['_Execution_addExDate'];
                },
                set value(val) {
                    this['_Execution_addExDate'] = val;
                    Laya.LocalStorage.setItem('_Execution_addExDate', val.toString());
                }
            };
            Execution._addExHours = {
                get value() {
                    if (!this['_Execution_addExHours']) {
                        return Laya.LocalStorage.getItem('_Execution_addExHours') ? Number(Laya.LocalStorage.getItem('_Execution_addExHours')) : (new Date()).getHours();
                    }
                    return this['_Execution_addExHours'];
                },
                set value(val) {
                    this['_Execution_addExHours'] = val;
                    Laya.LocalStorage.setItem('_Execution_addExHours', val.toString());
                }
            };
            Execution._addMinutes = {
                get value() {
                    if (!this['_Execution_addMinutes']) {
                        return Laya.LocalStorage.getItem('_Execution_addMinutes') ? Number(Laya.LocalStorage.getItem('_Execution_addMinutes')) : (new Date()).getMinutes();
                    }
                    return this['_Execution_addMinutes'];
                },
                set value(val) {
                    this['_Execution_addMinutes'] = val;
                    Laya.LocalStorage.setItem('_Execution_addMinutes', val.toString());
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
                    num.value = Execution._execution.value.toString();
                    sp.pos(297, 90);
                    sp.zOrder = 50;
                    Execution._ExecutionNode = sp;
                    Execution._ExecutionNode.name = '_ExecutionNode';
                }));
            }
            Execution._createExecutionNode = _createExecutionNode;
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
                    if (Execution._ExecutionNode) {
                        Animation2D.move_Simple(sp, sp.x, sp.y, Execution._ExecutionNode.x, Execution._ExecutionNode.y, 800, 100, f => {
                            Animation2D.fadeOut(sp, 1, 0, 200, 0, f => {
                                Animation2D.upDwon_Shake(Execution._ExecutionNode, 10, 80, 0, null);
                                if (func) {
                                    func();
                                }
                            });
                        });
                    }
                }));
            }
            Execution._addExecution = _addExecution;
            function createConsumeEx(subEx) {
                let label = Laya.Pool.getItemByClass('label', Laya.Label);
                label.name = 'label';
                Laya.stage.addChild(label);
                label.text = '-2';
                label.fontSize = 40;
                label.bold = true;
                label.color = '#59245c';
                label.x = Execution._ExecutionNode.x + 100;
                label.y = Execution._ExecutionNode.y - label.height / 2 + 4;
                label.zOrder = 100;
                Animation2D.fadeOut(label, 0, 1, 200, 150, () => {
                    Animation2D.leftRight_Shake(Execution._ExecutionNode, 15, 60, 0, null);
                    Animation2D.fadeOut(label, 1, 0, 600, 400, () => {
                    });
                });
            }
            Execution.createConsumeEx = createConsumeEx;
            class ExecutionNode extends Admin._ObjectBase {
                constructor() {
                    super(...arguments);
                    this.time = 0;
                    this.countNum = 59;
                    this.timeSwitch = true;
                }
                lwgOnAwake() {
                    this.Num = this._Owner.getChildByName('Num');
                    this.CountDown = this._Owner.getChildByName('CountDown');
                    this.CountDown_board = this._Owner.getChildByName('CountDown_board');
                    this.countNum = 59;
                    this.CountDown.text = '00:' + this.countNum;
                    this.CountDown_board.text = this.CountDown.text;
                    let d = new Date;
                    if (d.getDate() !== Execution._addExDate.value) {
                        Execution._execution.value = 15;
                    }
                    else {
                        if (d.getHours() == Execution._addExHours.value) {
                            console.log(d.getMinutes(), Execution._addMinutes.value);
                            Execution._execution.value += (d.getMinutes() - Execution._addMinutes.value);
                            if (Execution._execution.value > 15) {
                                Execution._execution.value = 15;
                            }
                        }
                        else {
                            Execution._execution.value = 15;
                        }
                    }
                    this.Num.value = Execution._execution.value.toString();
                    Execution._addExDate.value = d.getDate();
                    Execution._addExHours.value = d.getHours();
                    Execution._addMinutes.value = d.getMinutes();
                }
                countDownAddEx() {
                    this.time++;
                    if (this.time % 60 == 0) {
                        this.countNum--;
                        if (this.countNum < 0) {
                            this.countNum = 59;
                            Execution._execution.value += 1;
                            this.Num.value = Execution._execution.value.toString();
                            let d = new Date;
                            Execution._addExHours.value = d.getHours();
                            Execution._addMinutes.value = d.getMinutes();
                        }
                        if (this.countNum >= 10 && this.countNum <= 59) {
                            this.CountDown.text = '00:' + this.countNum;
                            this.CountDown_board.text = this.CountDown.text;
                        }
                        else if (this.countNum >= 0 && this.countNum < 10) {
                            this.CountDown.text = '00:0' + this.countNum;
                            this.CountDown_board.text = this.CountDown.text;
                        }
                    }
                }
                lwgOnUpdate() {
                    if (Number(this.Num.value) >= 15) {
                        if (this.timeSwitch) {
                            Execution._execution.value = 15;
                            this.Num.value = Execution._execution.value.toString();
                            this.CountDown.text = '00:00';
                            this.CountDown_board.text = this.CountDown.text;
                            this.countNum = 60;
                            this.timeSwitch = false;
                        }
                    }
                    else {
                        this.timeSwitch = true;
                        this.countDownAddEx();
                    }
                }
            }
            Execution.ExecutionNode = ExecutionNode;
        })(Execution = lwg.Execution || (lwg.Execution = {}));
    })(lwg || (lwg = {}));
    var lwg$1 = lwg;
    let Admin = lwg.Admin;
    let _SceneBase = Admin._SceneBase;
    let _ObjectBase = Admin._ObjectBase;
    let _SceneName = Admin._SceneName;
    let Platform = lwg.Platform;
    let SceneAnimation = lwg.SceneAnimation;
    let Adaptive = lwg.Adaptive;
    let StorageAdmin = lwg.StorageAdmin;
    let DataAdmin = lwg.DataAdmin;
    let EventAdmin = lwg.EventAdmin;
    let DateAdmin = lwg.DateAdmin;
    let TimerAdmin = lwg.TimerAdmin;
    let Execution = lwg.Execution;
    let Gold = lwg.Gold;
    let Setting = lwg.Setting;
    let AudioAdmin = lwg.Audio;
    let Click = lwg.Click;
    let Color = lwg.Color;
    let Effects = lwg.Effects;
    let Dialogue = lwg.Dialogue;
    let Animation2D = lwg.Animation2D;
    let Animation3D = lwg.Animation3D;
    let Tools = lwg.Tools;
    let _LwgPreLoad = lwg.LwgPreLoad;
    let _PreLoadScene = lwg.LwgPreLoad._PreLoadScene;
    let _LwgInit = lwg._LwgInit;
    let _LwgInitScene = lwg._LwgInit._LwgInitScene;

    var _Res;
    (function (_Res) {
        _Res._list = {
            prefab2D: {
                LwgGold: {
                    url: 'Prefab/LwgGold.json',
                    prefab: null,
                },
                Weapon: {
                    url: 'Prefab/Weapon.json',
                    prefab: null,
                },
                Enemy: {
                    url: 'Prefab/Enemy.json',
                    prefab: null,
                },
                EnemyBullet: {
                    url: 'Prefab/EnemyBullet.json',
                    prefab: null,
                }
            },
            scene2D: {
                UIStart: "Scene/" + _SceneName.Start + '.json',
                GameScene: "Scene/" + _SceneName.Game + '.json',
            },
            json: {},
        };
    })(_Res || (_Res = {}));
    var _PreLoad;
    (function (_PreLoad) {
        class PreLoad extends _LwgPreLoad._PreLoadScene {
            lwgOnStart() {
                EventAdmin._notify(_LwgPreLoad._Event.importList, [_Res._list]);
            }
            lwgOpenAni() { return 1; }
            lwgStepComplete() {
            }
            lwgAllComplete() {
                return 1000;
            }
        }
        _PreLoad.PreLoad = PreLoad;
    })(_PreLoad || (_PreLoad = {}));

    var _Game;
    (function (_Game) {
        class _Data {
        }
        _Data._property = {
            name: 'name',
            index: 'index',
            color: 'color',
        };
        _Data._arr = [
            {
                index: 1,
                name: 'yellow',
                color: 'yellow',
            },
            {
                index: 2,
                name: 'yellow',
                color: 'yellow',
            },
            {
                index: 3,
                name: 'blue',
                color: 'blue',
            }, {
                index: 4,
                name: 'blue',
                color: 'blue',
            }, {
                index: 5,
                name: 'red',
                color: 'red',
            }, {
                index: 6,
                name: 'red',
                color: 'red',
            }, {
                index: 7,
                name: 'blue',
                color: 'blue',
            }, {
                index: 8,
                name: 'blue',
                color: 'blue',
            },
            {
                index: 9,
                name: 'blue',
                color: 'blue',
            },
            {
                index: 10,
                name: 'blue',
                color: 'blue',
            },
            {
                index: 11,
                name: 'red',
                color: 'red',
            },
            {
                index: 12,
                name: 'yellow',
                color: 'yellow',
            },
        ];
        _Game._Data = _Data;
        let _Label;
        (function (_Label) {
            _Label["trigger"] = "trigger";
            _Label["weapon"] = "weapon";
            _Label["enemy"] = "enemy";
        })(_Label = _Game._Label || (_Game._Label = {}));
        _Game._fireControl = {
            Aim: null,
            EnemyParent: null,
            rotateSwitch: true,
            moveDownY: 0,
        };
        let _Event;
        (function (_Event) {
            _Event["WeaponSate"] = "_Game_WeaponSate";
            _Event["EnemyMove"] = "_Game_EnemyMove";
            _Event["calculateBlood"] = "_Game_calculateBlood";
            _Event["skillEnemy"] = "_Game_skillEnemy";
            _Event["closeScene"] = "_Game_closeScene";
            _Event["aimAddColor"] = "_Game_aimAddColor";
            _Event["aimSubColor"] = "_Game_aimSubColor";
            _Event["launch"] = "_WeaponSateType_launch";
        })(_Event = _Game._Event || (_Game._Event = {}));
        let _EnemySate;
        (function (_EnemySate) {
            _EnemySate["activity"] = "_EnemySate_activity";
            _EnemySate["death"] = "_EnemySate_death";
        })(_EnemySate = _Game._EnemySate || (_Game._EnemySate = {}));
        function _init() {
        }
        _Game._init = _init;
        class _Shell extends Admin._ObjectBase {
            lwgOnStart() {
                TimerAdmin._frameLoop(1, this, () => {
                });
            }
        }
        _Game._Shell = _Shell;
        class _Stone extends _Shell {
        }
        _Game._Stone = _Stone;
        class _EnemyBullet extends Admin._ObjectBase {
            constructor() {
                super(...arguments);
                this.speed = 2;
            }
            lwgOnStart() {
                let GPoint = this._SceneImg('HeroContent').localToGlobal(new Laya.Point(this._SceneImg('Hero').x, this._SceneImg('Hero').y));
                let p = new Laya.Point(this._Owner.x - GPoint.x, this._Owner.y - GPoint.y);
                p.normalize();
                TimerAdmin._frameLoop(1, this, () => {
                    this._Owner.x -= p.x * this.speed;
                    this._Owner.y -= p.y * this.speed;
                    Tools._Node.leaveStage(this._Owner, () => {
                        this._Owner.removeSelf();
                        return;
                    });
                });
                TimerAdmin._frameLoop(1, this, () => {
                    Tools._Node.checkTwoDistance(this._Owner, this._SceneImg('Hero'), 50, () => {
                        this._Owner.removeSelf();
                        this._evNotify(_Event.calculateBlood, [1]);
                    });
                });
            }
        }
        _Game._EnemyBullet = _EnemyBullet;
        class _Enemy extends Admin._ObjectBase {
            constructor() {
                super(...arguments);
                this.time = 0;
                this.state = '';
            }
            lwgOnStart() {
                this.state = _EnemySate.activity;
                TimerAdmin._frameRandomLoop(100, 1000, this, () => {
                    if (this.state == _EnemySate.activity) {
                        let bullet = Tools._Node.createPrefab(_Res._list.prefab2D.EnemyBullet.prefab);
                        bullet.addComponent(_EnemyBullet);
                        let GPoint = this._Parent.localToGlobal(new Laya.Point(this._Owner.x, this._Owner.y));
                        this._Scene.addChild(bullet);
                        bullet.pos(GPoint.x, GPoint.y);
                    }
                });
                let rotate = Tools._Number.randomOneHalf() == 1 ? -0.5 : 0.5;
                TimerAdmin._frameLoop(1, this, () => {
                    let point = Tools._Point.getRoundPos(this._Owner.rotation += rotate, this._SceneImg('MobileFrame').width / 2 + this._Owner.height / 2, new Laya.Point(this._SceneImg('LandContent').width / 2, this._SceneImg('LandContent').height / 2));
                    this._Owner.x = point.x;
                    this._Owner.y = point.y;
                });
            }
        }
        _Game._Enemy = _Enemy;
        class _Weapon extends Admin._ObjectBase {
            constructor() {
                super(...arguments);
                this.dynamics = 0;
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
                const acc = (1 - this.dynamics) * 5;
                this.launchAcc -= acc;
                return 80 + this.launchAcc;
            }
            getDropSpeed() {
                return this.dropAcc += 0.5;
            }
            lwgOnAwake() {
            }
            lwgEvent() {
                var move = () => {
                    if (!this.fGP) {
                        this.fGP = new Laya.Point(this._Owner.x, this._Owner.y);
                    }
                    if (this.getSpeed() > 0) {
                        let p = Tools._Point.angleAndLenByPoint(this._Owner.rotation - 90, this.getSpeed());
                        this._Owner.x += p.x;
                        this._Owner.y += p.y;
                    }
                    else {
                        this._Owner.y += this.getDropSpeed();
                    }
                    !Tools._Node.leaveStage(this._Owner, () => {
                        this._Owner.removeSelf();
                    }) && checkEnemy();
                };
                var drop = () => {
                    this.state = this.stateType.free;
                    Laya.timer.clearAll(this);
                    TimerAdmin._frameLoop(1, this, () => {
                        this._Owner.y += 40;
                        this._Owner.rotation += 10;
                        Tools._Node.leaveStage(this._Owner, () => {
                            this._Owner.removeSelf();
                        });
                    });
                };
                var skill = (Enemy) => {
                    this._evNotify(_Event.skillEnemy, [1]);
                    for (let index = 0; index < 20; index++) {
                        Effects._Particle._spray(Laya.stage, this._gPoint, [0, 0], [10, 35], null, null, null, null, null, null, [30, 100], null, [5, 20]);
                    }
                    Enemy.removeSelf();
                    this._Owner.removeSelf();
                };
                var checkEnemy = () => {
                    if (this.state === this.stateType.free) {
                        return;
                    }
                    if (this._SceneImg('FrontScenery').getChildByName('Stone')) {
                        for (let index = 0; index < this._SceneImg('FrontScenery').numChildren; index++) {
                            const element = this._SceneImg('FrontScenery').getChildAt(index);
                            if (element.name == 'Stone') {
                                let gPStone = this._SceneImg('FrontScenery').localToGlobal(new Laya.Point(element.x, element.y));
                                if (gPStone.distance(this._gPoint.x, this._gPoint.y) < 30) {
                                    drop();
                                    return;
                                }
                            }
                        }
                    }
                    for (let index = 0; index < _Game._fireControl.EnemyParent.numChildren; index++) {
                        const Enemy = _Game._fireControl.EnemyParent.getChildAt(index);
                        let gPEnemy = this._SceneImg('EnemyParent').localToGlobal(new Laya.Point(Enemy.x, Enemy.y));
                        if (gPEnemy.distance(this._gPoint.x, this._gPoint.y) < 50) {
                            if (this._Owner.name === Enemy.name.substr(5)) {
                                let Shell = Enemy.getChildByName('Shell');
                                if (Shell) {
                                    let angle = Tools._Point.angleByPoint(this._SceneImg('LandContent').x - this._gPoint.x, this._SceneImg('LandContent').y - this._gPoint.y) + 90;
                                    if (210 < angle && angle < 330) {
                                        drop();
                                    }
                                    else {
                                        skill(Enemy);
                                    }
                                }
                                else {
                                    skill(Enemy);
                                }
                            }
                            else {
                                drop();
                            }
                            return;
                        }
                    }
                    const pos = new Laya.Point(this._SceneImg('LandContent').x, this._SceneImg('LandContent').y);
                    if (pos.distance(this._gPoint.x, this._gPoint.y) < 150) {
                        Laya.timer.clearAll(this);
                        this.state = this.stateType.free;
                        const lP = this._SceneImg('LandContent').globalToLocal(this._gPoint);
                        this._SceneImg('LandContent').addChild(this._Owner);
                        this._Owner.pos(lP.x, lP.y);
                        this._Owner.rotation -= this._SceneImg('LandContent').rotation;
                        const mask = new Laya.Sprite;
                        mask.size(200, 300);
                        mask.pos(0, 80);
                        mask.loadImage('Lwg/UI/ui_l_orthogon_white.png');
                        this._Owner.mask = mask;
                    }
                };
                this._evReg(_Event.launch, (dynamics) => {
                    if (this.state !== this.stateType.free) {
                        TimerAdmin._frameLoop(1, this, () => {
                            this.dynamics = dynamics;
                            move();
                        });
                    }
                });
            }
        }
        _Game._Weapon = _Weapon;
        class Game extends Admin._SceneBase {
            constructor() {
                super(...arguments);
                this.Weapon = {
                    state: 'checkinAim',
                    stateType: {
                        checkinAim: 'checkinAim',
                        direction: 'direction',
                    },
                    ins: null,
                    Tail: null,
                    Pic: null,
                    dynamics: 0,
                    minPullDes: 0,
                    pullDes: 0,
                    maxPullDes: null,
                    heroFP: null,
                    lBowstringW: null,
                    rBowstringW: null,
                    diffY: -150,
                    create: (color, x, y) => {
                        this.Weapon.ins = Tools._Node.createPrefab(_Res._list.prefab2D.Weapon.prefab);
                        this._ImgVar('WeaponParent').addChild(this.Weapon.ins);
                        this.Weapon.ins.name = color;
                        this.Weapon.ins.addComponent(_Weapon);
                        this.Weapon.ins.pos(x, y + this.Weapon.diffY);
                        this.Weapon.Pic = this.Weapon.ins.getChildByName('Pic');
                        this.Weapon.Pic.skin = `Game/UI/Game/Hero/Hero_01_weapon_${color}.png`;
                        this.Weapon.lBowstringW = this._ImgVar('LBowstring').width;
                        this.Weapon.rBowstringW = this._ImgVar('RBowstring').width;
                        this.Weapon.heroFP = new Laya.Point(this._ImgVar('Hero').x, this._ImgVar('Hero').y);
                        this.Weapon.minPullDes = this.Weapon.ins.height - 20;
                        this.Weapon.maxPullDes = this.Weapon.minPullDes + 50;
                        this.Weapon.pullDes = 0;
                        this.Weapon.Tail = this.Weapon.ins.getChildByName('Tail');
                        this._ImgVar('Quiver').visible = false;
                    },
                    remove: () => {
                        if (this.Weapon.ins) {
                            this.Weapon.ins.removeSelf();
                            this.Weapon.ins = null;
                            this.Weapon.state = this.Weapon.stateType.checkinAim;
                        }
                    },
                    getAimGP: () => {
                        return this._ImgVar('Aim').localToGlobal(new Laya.Point(this._ImgVar('Fulcrum').x, this._ImgVar('Fulcrum').y));
                    },
                    getTailGP: () => {
                        return this.Weapon.ins.localToGlobal(new Laya.Point(this.Weapon.Tail.x, this.Weapon.Tail.y));
                    },
                    getWeaponGP: () => {
                        return new Laya.Point(this.Weapon.ins.x, this.Weapon.ins.y);
                    },
                    checkinAim: (e) => {
                        const dis = this.Weapon.getAimGP().distance(e.stageX, e.stageY);
                        if (dis < 150 && e.stageY >= this.Weapon.getAimGP().y) {
                            this.Weapon.state = this.Weapon.stateType.direction;
                            this.Weapon.ins.pivotX = this.Weapon.ins.width / 2;
                            this.Weapon.ins.pivotY = this.Weapon.ins.height / 2;
                            this.Weapon.ins.pos(this.Weapon.getAimGP().x, this.Weapon.getAimGP().y);
                            this._ImgVar('Bow').skin = `Game/UI/Game/Hero/Hero_01_bow_${this.Weapon.ins.name}.png`;
                            this.Weapon.directionType = 'weapon';
                            this.Weapon.direction(e);
                        }
                        else {
                            this.Weapon.restore();
                            this.Weapon.ins.rotation = 0;
                            this.Weapon.ins.pos(e.stageX, e.stageY + this.Weapon.diffY);
                            this._ImgVar('Bow').skin = `Game/UI/Game/Hero/Hero_01_bow_normalc.png`;
                        }
                    },
                    getAimStageDis: (e) => {
                        return this.Weapon.getAimGP().distance(e.stageX, e.stageY);
                    },
                    directionType: 'weapon',
                    direction: (e) => {
                        if (e.stageY < this.Weapon.getAimGP().y) {
                            this.Weapon.state = this.Weapon.stateType.checkinAim;
                            this.Weapon.checkinAim(e);
                        }
                        else {
                            let angle = 0;
                            if (this.Weapon.directionType === 'weapon') {
                                angle = Tools._Point.angleByPoint(this.Weapon.getAimGP().x - this.Weapon.ins.x, this.Weapon.getAimGP().y - this.Weapon.ins.y);
                                if (Math.abs(this.Weapon.getAimGP().x - e.stageX) < 10) {
                                    this.Weapon.directionType = 'stage';
                                }
                            }
                            else if (this.Weapon.directionType === 'stage') {
                                angle = Tools._Point.angleByPoint(e.stageX - this.Weapon.ins.x, e.stageY - this.Weapon.ins.y);
                            }
                            this.Weapon.ins.rotation = this._ImgVar('Aim').rotation = angle;
                            this.Weapon.ins.pos(this.Weapon.getAimGP().x, this.Weapon.getAimGP().y);
                            this.Weapon.pullDes = this.Weapon.getWeaponGP().distance(e.stageX, e.stageY);
                            if (this.Weapon.pullDes >= this.Weapon.minPullDes && this.Weapon.pullDes <= this.Weapon.maxPullDes) {
                                this.Weapon.Tail.y = this.Weapon.pullDes;
                                this.Weapon.Pic.y = this.Weapon.pullDes - this.Weapon.minPullDes;
                                const ratio = this.Weapon.Pic.y / (this.Weapon.maxPullDes - this.Weapon.minPullDes);
                                this._ImgVar('DynamicsBar').mask.y = this._ImgVar('DynamicsBar').height * (1 - ratio);
                                this.Weapon.dynamics = ratio;
                                this._ImgVar('Hero').y = this.Weapon.heroFP.y + this.Weapon.Pic.y;
                            }
                            this.Weapon.bowstring();
                            return angle;
                        }
                    },
                    bowstring: () => {
                        const angle = Tools._Point.angleByPoint(this.Weapon.getTailGP().x - this.Weapon.ins.x, this.Weapon.getTailGP().y - this.Weapon.ins.y);
                        const lBowstringGP = this._ImgVar('Aim').localToGlobal(new Laya.Point(this._ImgVar('LBowstring').x, this._ImgVar('LBowstring').y));
                        const lBowstringAngle = Tools._Point.angleByPoint(lBowstringGP.x - this.Weapon.getTailGP().x, lBowstringGP.y - this.Weapon.getTailGP().y);
                        this._ImgVar('LBowstring').rotation = lBowstringAngle - 90 - angle;
                        this._ImgVar('LBowstring').width = this.Weapon.getTailGP().distance(lBowstringGP.x, lBowstringGP.y);
                        const rBowstringGP = this._ImgVar('Aim').localToGlobal(new Laya.Point(this._ImgVar('RBowstring').x, this._ImgVar('RBowstring').y));
                        const rBowstringAngle = Tools._Point.angleByPoint(rBowstringGP.x - this.Weapon.getTailGP().x, rBowstringGP.y - this.Weapon.getTailGP().y);
                        this._ImgVar('RBowstring').rotation = rBowstringAngle + 90 - angle;
                        this._ImgVar('RBowstring').width = this.Weapon.getTailGP().distance(rBowstringGP.x, rBowstringGP.y);
                    },
                    restore: () => {
                        this._ImgVar('LBowstring').width = this.Weapon.lBowstringW;
                        this._ImgVar('RBowstring').width = this.Weapon.rBowstringW;
                        this._ImgVar('RBowstring').rotation = this._ImgVar('LBowstring').rotation = 0;
                        this._ImgVar('Aim').rotation = 0;
                        this._ImgVar('Hero').y = this.Weapon.heroFP.y;
                    },
                    checkLuanch: () => {
                        if (this.Weapon.ins) {
                            if (this.Weapon.state === this.Weapon.stateType.direction) {
                                this._evNotify(_Event.launch, [this.Weapon.dynamics]);
                                Tools._Node.changePivot(this.Weapon.ins, this.Weapon.ins.pivotX + this.Weapon.Pic.x, this.Weapon.ins.pivotY);
                            }
                            else {
                                this.Weapon.ins.removeSelf();
                            }
                            this._ImgVar('Quiver').visible = true;
                            this.Weapon.restore();
                            this.Weapon.ins = null;
                            this.Weapon.state = this.Weapon.stateType.checkinAim;
                        }
                    },
                    move: (e) => {
                        this.Weapon[this.Weapon.state](e);
                    }
                };
                this.heroContentFP = null;
            }
            lwgOnAwake() {
            }
            lwgOnStart() {
                TimerAdmin._frameLoop(1, this, () => {
                    this._ImgVar('LandContent').rotation += 0.1;
                });
                _Game._fireControl.EnemyParent = this._ImgVar('EnemyParent');
                _Game._fireControl.Aim = this._ImgVar('Aim');
                for (let index = 0; index < this._ImgVar('EnemyParent').numChildren; index++) {
                    const element = this._ImgVar('EnemyParent').getChildAt(index);
                    Tools._Node.changePivot(element, element.width / 2, element.height / 2);
                    element.addComponent(_Enemy);
                }
            }
            lwgEvent() {
                this._evReg(_Event.aimAddColor, (Weapon) => {
                    if (this._ImgVar('Bow')['launch'] !== Weapon) {
                        this._ImgVar('Bow')['launch'] = Weapon;
                        this._ImgVar('Bow').skin = `Game/UI/Game/Hero/Hero_01_bow_${Weapon['_data'][_Data._property.color]}.png`;
                    }
                });
                this._evReg(_Event.aimSubColor, (Weapon) => {
                    if (this._ImgVar('Bow')['launch'] == Weapon) {
                        this._ImgVar('Bow').skin = `Game/UI/Game/Hero/Hero_01_bow_normalc.png`;
                        this._ImgVar('Bow')['launch'] = null;
                    }
                });
                let bloodNum = 20;
                let _width = 100;
                this._evReg(_Event.calculateBlood, (number) => {
                    let Blood = this._ImgVar('Blood').getChildAt(0);
                    Blood.width = Blood.width - _width / 20;
                    bloodNum -= number;
                    if (!this['bloodNumSwitch']) {
                        if (bloodNum <= 0) {
                            this['bloodNumSwitch'] = true;
                            this._openScene(_SceneName.Defeated, false);
                        }
                    }
                });
                let enemyNum = this._ImgVar('EnemyParent').numChildren;
                this._evReg(_Event.skillEnemy, () => {
                    enemyNum -= 1;
                    if (!this['EnemyNumSwitch']) {
                        if (enemyNum <= 0) {
                            this['EnemyNumSwitch'] = true;
                            this._openScene(_SceneName.Victory, false);
                        }
                    }
                });
                this._evReg(_Event.closeScene, () => {
                    this._closeScene();
                });
            }
            lwgButton() {
                let QuiverArr = [this._ImgVar('Quiver_blue'), this._ImgVar('Quiver_yellow'), this._ImgVar('Quiver_red')];
                for (let index = 0; index < QuiverArr.length; index++) {
                    const element = QuiverArr[index];
                    this._btnFour(element, (e) => {
                        e.stopPropagation();
                        this.Weapon.create(element.name.substr(7), e.stageX, e.stageY);
                    }, null, () => {
                        this.Weapon.remove();
                    }, () => {
                    }, 'null');
                }
            }
            lwgOnStageDown(e) {
                this.heroContentFP = new Laya.Point(e.stageX, e.stageY);
            }
            lwgOnStageMove(e) {
                if (this.Weapon.ins) {
                    this.Weapon.move(e);
                }
                else {
                    if (this.heroContentFP) {
                        let diffX = e.stageX - this.heroContentFP.x;
                        let diffY = e.stageY - this.heroContentFP.y;
                        this._ImgVar('HeroContent').x += diffX;
                        this._ImgVar('HeroContent').y += diffY;
                        this.heroContentFP = new Laya.Point(e.stageX, e.stageY);
                        if (this._ImgVar('HeroContent').x > Laya.stage.width) {
                            this._ImgVar('HeroContent').x = Laya.stage.width;
                        }
                        if (this._ImgVar('HeroContent').x < 0) {
                            this._ImgVar('HeroContent').x = 0;
                        }
                        if (this._ImgVar('HeroContent').y < 0) {
                            this._ImgVar('HeroContent').y = 0;
                        }
                        if (this._ImgVar('HeroContent').y > Laya.stage.height - 200) {
                            this._ImgVar('HeroContent').y = Laya.stage.height - 200;
                        }
                    }
                }
            }
            lwgOnStageUp() {
                this.Weapon.checkLuanch();
                this.heroContentFP = null;
            }
        }
        _Game.Game = Game;
    })(_Game || (_Game = {}));
    var _Game$1 = _Game.Game;

    var _Defeated;
    (function (_Defeated) {
        class _data {
        }
        _Defeated._data = _data;
        function _init() {
        }
        _Defeated._init = _init;
        class Defeated extends Admin._SceneBase {
            lwgButton() {
                this._btnUp(this._ImgVar('BtnBack'), () => {
                    this._openScene(_SceneName.Start);
                    EventAdmin._notify(_Game._Event.closeScene);
                });
            }
        }
        _Defeated.Defeated = Defeated;
    })(_Defeated || (_Defeated = {}));
    var _Defeated$1 = _Defeated.Defeated;

    var _Guide;
    (function (_Guide) {
        _Guide._complete = {
            get bool() {
                if (Laya.LocalStorage.getItem('_Guide_complete')) {
                    if (Number(Laya.LocalStorage.getItem('_Guide_complete')) == 0) {
                        return false;
                    }
                    else {
                        return true;
                    }
                }
                else {
                    return false;
                }
            },
            set bool(bol) {
                if (bol == true) {
                    bol = 1;
                }
                Laya.LocalStorage.setItem('_Guide_complete', bol.toString());
            }
        };
        _Guide._whichStep = {
            get num() {
                return Laya.LocalStorage.getItem('_Guide_whichStep') ? Number(Laya.LocalStorage.getItem('_Guide_whichStep')) : 1;
            },
            set num(num0) {
                Laya.LocalStorage.setItem('_Guide_whichStep', num0.toString());
            }
        };
        _Guide._whichStepNum = 1;
        let _Event;
        (function (_Event) {
            _Event["onStep"] = "_Guide_onStep";
            _Event["stepComplete"] = "_Guide_stepComplete";
            _Event["appear"] = "_Guide_appear";
            _Event["start"] = "_Guide_start";
            _Event["complete"] = "_Guide_complete";
        })(_Event = _Guide._Event || (_Guide._Event = {}));
        function _init() {
        }
        _Guide._init = _init;
        class Guide extends Admin._SceneBase {
            lwgOnStart() {
                this._openScene('Start');
            }
            lwgOnEnable() {
            }
        }
        _Guide.Guide = Guide;
    })(_Guide || (_Guide = {}));
    var _Guide$1 = _Guide.Guide;

    var _PreLoadCutIn;
    (function (_PreLoadCutIn) {
        let _Event;
        (function (_Event) {
            _Event["animation1"] = "_PreLoadCutIn_animation1";
            _Event["preLoad"] = "_PreLoadCutIn_preLoad";
            _Event["animation2"] = "_PreLoadCutIn_animation2";
        })(_Event = _PreLoadCutIn._Event || (_PreLoadCutIn._Event = {}));
        class PreLoadCutIn extends _LwgPreLoad._PreLoadScene {
            lwgOnStart() {
                EventAdmin._notify(_Event.animation1);
            }
            lwgEventRegister() {
                EventAdmin._register(_Event.animation1, this, () => {
                    let time = 0;
                    TimerAdmin._frameNumLoop(1, 30, this, () => {
                        time++;
                        this._LabelVar('Schedule').text = `${time}`;
                    }, () => {
                        EventAdmin._notify(_LwgPreLoad._Event.importList, [{}]);
                    });
                });
            }
            lwgOpenAni() {
                return 100;
            }
            lwgStepComplete() {
            }
            lwgAllComplete() {
                return 1000;
            }
        }
        _PreLoadCutIn.PreLoadCutIn = PreLoadCutIn;
    })(_PreLoadCutIn || (_PreLoadCutIn = {}));
    ;
    var _PreLoadCutIn$1 = _PreLoadCutIn.PreLoadCutIn;

    var _Start;
    (function (_Start) {
        function _init() {
            console.log(_Start);
        }
        _Start._init = _init;
        class Start extends Admin._SceneBase {
            lwgOnAwake() {
                Setting._bgMusic.switch = false;
            }
            lwgButton() {
                this._btnUp(this._ImgVar('BtnStart'), () => {
                    let levelName = _SceneName.Game + 1;
                    this._openScene(levelName, true, false, () => {
                        if (!Admin._SceneControl[levelName].getComponent(_Game.Game)) {
                            Admin._SceneControl[levelName].addComponent(_Game.Game);
                        }
                    });
                });
            }
        }
        _Start.Start = Start;
        class StartItem extends Admin._ObjectBase {
        }
        _Start.StartItem = StartItem;
    })(_Start || (_Start = {}));
    var _Start$1 = _Start.Start;

    var _Victory;
    (function (_Victory) {
        class _data {
        }
        _Victory._data = _data;
        function _init() {
        }
        _Victory._init = _init;
        class Victory extends Admin._SceneBase {
            lwgButton() {
                this._btnUp(this._ImgVar('BtnGet'), () => {
                    this._openScene(_SceneName.Start);
                    EventAdmin._notify(_Game._Event.closeScene);
                });
            }
        }
        _Victory.Victory = Victory;
    })(_Victory || (_Victory = {}));
    var _Victory$1 = _Victory.Victory;

    class LwgInit extends _LwgInitScene {
        lwgOnAwake() {
            _LwgInit._pkgInfo = [];
            Platform._Ues.value = Platform._Tpye.Research;
            SceneAnimation._Use.value = SceneAnimation._Type.fadeOut;
            Click._Use.value = Click._Type.largen;
            Adaptive._Use.value = [720, 1280];
            Admin._Moudel = {
                _PreLoad: _PreLoad,
                _PreLoadCutIn: _PreLoadCutIn,
                _Guide: _Guide,
                _Start: _Start,
                _Game: _Game,
                _Victory: _Victory,
                _Defeated: _Defeated,
            };
        }
    }

    class GameConfig {
        constructor() {
        }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("script/Frame/LwgInit.ts", LwgInit);
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
