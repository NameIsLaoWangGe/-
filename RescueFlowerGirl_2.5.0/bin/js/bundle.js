(function () {
    'use strict';

    var lwg;
    (function (lwg) {
        let Dialogue;
        (function (Dialogue) {
            let Skin;
            (function (Skin) {
                Skin["blackBord"] = "Lwg/UI/ui_orthogon_black_0.7.png";
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
                DateAdmin._loginCount = StorageAdmin._num('DateAdmin._loginCount');
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
                immediately && TimerAdmin._switch && method();
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
                immediately && TimerAdmin._switch && method();
                let num0 = 0;
                var func = () => {
                    let delay = Tools._Number.randomOneInt(delay1, delay2);
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
            SceneAnimation._openSwitch = {
                get value() {
                    return this['openSwitch'] ? this['openSwitch'] : false;
                },
                set value(val) {
                    if (val) {
                        SceneAnimation._closeSwitch.value = false;
                    }
                    this['openSwitch'] = val;
                }
            };
            SceneAnimation._closeSwitch = {
                get value() {
                    return this['closeSwitch'] ? this['closeSwitch'] : false;
                },
                set value(val) {
                    if (val) {
                        SceneAnimation._openSwitch.value = false;
                    }
                    this['closeSwitch'] = val;
                }
            };
            SceneAnimation._Use = {
                get value() {
                    return this['SceneAnimation_name'] ? this['SceneAnimation_name'] : null;
                },
                set value(val) {
                    this['SceneAnimation_name'] = val;
                }
            };
            SceneAnimation._closeAniDelay = 0;
            SceneAnimation._closeAniTime = 0;
            function _commonOpenAni(Scene) {
                var afterAni = () => {
                    Click._switch = true;
                    if (Scene[Scene.name]) {
                        Scene[Scene.name].lwgOpenAniAfter();
                        Scene[Scene.name].lwgButton();
                    }
                };
                if (!SceneAnimation._openSwitch.value) {
                    Admin._SceneChange._close();
                    Laya.timer.once(SceneAnimation._closeAniDelay + SceneAnimation._closeAniTime, this, () => {
                        afterAni();
                    });
                    return 0;
                }
                let sumDelay = 0;
                sumDelay = SceneAnimation._Use.value.class['_paly'](SceneAnimation._Use.value.type, Scene);
                Laya.timer.once(sumDelay, this, () => {
                    afterAni();
                });
                return sumDelay;
            }
            SceneAnimation._commonOpenAni = _commonOpenAni;
            function _commonCloseAni(CloseScene) {
                return SceneAnimation._Use.value.class['_paly'](SceneAnimation._Use.value.type, CloseScene);
            }
            SceneAnimation._commonCloseAni = _commonCloseAni;
            let _fadeOut;
            (function (_fadeOut) {
                let _time = 700;
                let _delay = 150;
                class Close {
                    static _paly(type, Scene) {
                        _fadeOut_Close(Scene);
                        SceneAnimation._closeAniDelay = _delay;
                        SceneAnimation._closeAniTime = _time;
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
            })(_fadeOut = SceneAnimation._fadeOut || (SceneAnimation._fadeOut = {}));
            let _shutters;
            (function (_shutters) {
                let _num = 10;
                let _time = 700;
                let _delay = 150;
                function _moveClose(sp, tex, scaleX, scealeY) {
                    Animation2D.scale(sp, 1, 1, scaleX, scealeY, _time, 0, () => {
                        tex.disposeBitmap();
                        tex.destroy();
                        sp.destroy();
                    });
                }
                function _moveOpen(sp, tex, scaleX, scealeY) {
                    Animation2D.scale(sp, scaleX, scealeY, 1, 1, _time, 0, () => {
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
                    Tools._Node.changePivot(sp, width / 2, height / 2);
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
                        Tools._Node.changePivot(Mask, Math.round(Mask.width / 2), Math.round(Mask.height / 2));
                        Tools._Node.changePivot(sp, Math.round(index * sp.width / _num + sp.width / _num / 2), Math.round(sp.height / 2));
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
                        Tools._Node.changePivot(Mask, Math.round(Mask.width / 2), Math.round(Mask.height / 2));
                        Tools._Node.changePivot(sp, Math.round(index * sp.width / _num + sp.width / _num / 2), Math.round(sp.height / 2));
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
                        Tools._Node.changePivot(Mask1, Math.round(Mask1.width / 2), Math.round(Mask1.height / 2));
                        Tools._Node.changePivot(sp1, Math.round(index * sp1.width / _num + sp1.width / _num / 2), Math.round(sp1.height / 2));
                        Mask1.rotation = -15;
                        const sp2 = _createMaskSp(Scene, 'x', open);
                        const Mask2 = _createMask(sp2);
                        Mask2.width = Laya.stage.width / _num;
                        Mask2.height = Laya.stage.height + addLen;
                        Mask2.pos(Laya.stage.width / _num * index, -addLen / 2);
                        Tools._Node.changePivot(Mask2, Mask2.width / 2, Mask2.height / 2);
                        Tools._Node.changePivot(sp2, index * sp2.width / _num + sp2.width / _num / 2, sp2.height / 2);
                        Mask2.rotation = 15;
                    }
                }
                _shutters._sidelingIntersection = _sidelingIntersection;
                function _randomCroAndVer(Scene, open) {
                    const index = Tools._Array.randomGetOne([0, 1, 2]);
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
                    const index = Tools._Array.randomGetOne([0, 1, 2, 3, 4, 5]);
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
                        SceneAnimation._closeAniDelay = _delay;
                        SceneAnimation._closeAniTime = _time;
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
            })(_shutters = SceneAnimation._shutters || (SceneAnimation._shutters = {}));
            let _stickIn;
            (function (_stickIn_1) {
                function _stickIn(Scene, type) {
                    let sumDelay = 0;
                    let time = 700;
                    let delay = 100;
                    if (Scene.getChildByName('Background')) {
                        Animation2D.fadeOut(Scene.getChildByName('Background'), 0, 1, time);
                    }
                    let stickInLeftArr = Tools._Node.childZOrderByY(Scene, false);
                    for (let index = 0; index < stickInLeftArr.length; index++) {
                        const element = stickInLeftArr[index];
                        if (element.name !== 'Background' && element.name.substr(0, 5) !== 'NoAni') {
                            let originalPovitX = element.pivotX;
                            let originalPovitY = element.pivotY;
                            let originalX = element.x;
                            let originalY = element.y;
                            element.x = element.pivotX > element.width / 2 ? 800 + element.width : -800 - element.width;
                            element.y = element.rotation > 0 ? element.y + 200 : element.y - 200;
                            Animation2D.rotate(element, 0, time, delay * index);
                            Animation2D.move(element, originalX, originalY, time, () => {
                                Tools._Node.changePivot(element, originalPovitX, originalPovitY);
                            }, delay * index);
                        }
                    }
                    sumDelay = Scene.numChildren * delay + time + 200;
                    return sumDelay;
                }
            })(_stickIn = SceneAnimation._stickIn || (SceneAnimation._stickIn = {}));
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
                _openScene(_SceneName.PreLoadCutIn, closeName, func);
                Admin._PreLoadCutIn.openName = openName;
                Admin._PreLoadCutIn.closeName = closeName;
                Admin._PreLoadCutIn.func = func;
                Admin._PreLoadCutIn.zOrder = zOrder;
            }
            Admin._preLoadOpenScene = _preLoadOpenScene;
            class _SceneChange {
                static _openZOderUp() {
                    if (SceneAnimation._closeSwitch.value) {
                        let num = 0;
                        for (const key in Admin._SceneControl) {
                            if (Object.prototype.hasOwnProperty.call(Admin._SceneControl, key)) {
                                const Scene = Admin._SceneControl[key];
                                if (Scene.parent) {
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
                    if (SceneAnimation._closeSwitch.value) {
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
            _SceneChange._openScene = null;
            _SceneChange._openZOder = 1;
            _SceneChange._openFunc = null;
            _SceneChange._closeSceneArr = [];
            _SceneChange._closeZOder = 0;
            _SceneChange._sceneNum = 1;
            Admin._SceneChange = _SceneChange;
            function _openScene(openName, closeName, func, zOrder) {
                Click._switch = false;
                Laya.Scene.load('Scene/' + openName + '.json', Laya.Handler.create(this, function (scene) {
                    const openScene = Tools._Node.checkChildren(Laya.stage, openName);
                    if (openScene) {
                        openScene.close();
                        console.log(`场景${openName}重复出现！前面的场景将会被关闭！`);
                    }
                    _SceneChange._openScene = Admin._SceneControl[scene.name = openName] = scene;
                    _SceneChange._closeSceneArr.push(Admin._SceneControl[closeName]);
                    _SceneChange._closeZOder = closeName ? Admin._SceneControl[closeName].zOrder : 0;
                    _SceneChange._openZOder = zOrder ? zOrder : null;
                    _SceneChange._openFunc = func ? func : () => { };
                    _SceneChange._open();
                }));
            }
            Admin._openScene = _openScene;
            function _closeScene(closeName, func) {
                if (!Admin._SceneControl[closeName]) {
                    console.log(`场景${closeName}关闭失败，可能不存在！`);
                    return;
                }
                var closef = () => {
                    func && func();
                    Click._switch = true;
                    Admin._SceneControl[closeName].close();
                };
                if (!SceneAnimation._closeSwitch.value) {
                    closef();
                    return;
                }
                _SceneChange._closeZOderUP(Admin._SceneControl[closeName]);
                let script = Admin._SceneControl[closeName][Admin._SceneControl[closeName].name];
                if (script) {
                    if (script) {
                        Click._switch = false;
                        let time0 = script.lwgCloseAni();
                        if (time0 !== null) {
                            SceneAnimation._closeAniDelay = time0;
                            script.lwgBeforeCloseAni();
                            Laya.timer.once(time0, this, () => {
                                closef();
                                Click._switch = true;
                            });
                        }
                        else {
                            const delay = SceneAnimation._commonCloseAni(Admin._SceneControl[closeName]);
                            Laya.timer.once(delay, this, () => {
                                script.lwgBeforeCloseAni();
                                closef();
                            });
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
            Admin._ScriptBase = _ScriptBase;
            class _lwgSp extends Laya.Sprite {
            }
            class _lwgImg extends Laya.Image {
            }
            class _lwgBox extends Laya.Box {
            }
            class _SceneBase extends _ScriptBase {
                constructor() {
                    super();
                    this._calssName = _SceneName.PreLoad;
                }
                get _Owner() {
                    return this.owner;
                }
                addLwgImgPro(_sprite) {
                    _sprite['_lwgProperty'] = {
                        get gPoint() {
                            if (_sprite.parent) {
                                return _sprite.parent.localToGlobal(new Laya.Point(_sprite.x, _sprite.y));
                            }
                            else {
                                return null;
                            }
                        },
                    };
                }
                getVar(name, type) {
                    if (!this[`_Scene${type}${name}`]) {
                        if (this._Owner[name]) {
                            this[`_Scene${type}${name}`] = this._Owner[name];
                            this.addLwgImgPro(this[`_Scene${type}${name}`]);
                            return this[`_Scene${type}${name}`];
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
                    this.moduleOnStart();
                    this.lwgOnStart();
                    this.btnAndOpenAni();
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
                    Laya.Tween.clearAll(this);
                    Laya.Tween.clearAll(this._Owner);
                    Laya.timer.clearAll(this);
                    Laya.timer.clearAll(this._Owner);
                    EventAdmin._offCaller(this);
                    EventAdmin._offCaller(this._Owner);
                    this.lwgOnDisable();
                }
            }
            Admin._SceneBase = _SceneBase;
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
                    this._Owner[this['__proto__']['constructor'].name] = this;
                    this.ownerSceneName = this._Scene.name;
                    this._fPoint = new Laya.Point(this._Owner.x, this._Owner.y);
                    this._fGPoint = this._Parent.localToGlobal(new Laya.Point(this._Owner.x, this._Owner.y));
                    this._fRotation = this._Owner.rotation;
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
            class _Object extends admin {
                get value() { return; }
                set value(val) { }
            }
            StorageAdmin._Object = _Object;
            function _num(name, _func, initial) {
                if (!this[`_num${name}`]) {
                    this[`_num${name}`] = {
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
        })(StorageAdmin = lwg.StorageAdmin || (lwg.StorageAdmin = {}));
        let DataAdmin;
        (function (DataAdmin) {
            class _Item extends Admin._ObjectBase {
                get $name() {
                    return this.$data ? this.$data['name'] : null;
                }
                set $name(_name) {
                    this.$data['name'] = _name;
                }
                get $serial() {
                    return this.$data ? this.$data['serial'] : null;
                }
                set $serial(_serial) {
                    this.$data['serial'] = _serial;
                }
                get $sort() {
                    return this.$data ? this.$data['sort'] : null;
                }
                set $sort(_sort) {
                    this.$data['sort'] = _sort;
                }
                get $chName() {
                    return this.$data ? this.$data['chName'] : null;
                }
                set $chName(_chName) {
                    this.$data['chName'] = _chName;
                }
                get $classify() {
                    return this.$data ? this.$data['classify'] : null;
                }
                set $classify(_classify) {
                    this.$data['classify'] = _classify;
                }
                get $unlockWay() {
                    return this.$data ? this.$data['conditionNum'] : null;
                }
                set $unlockWay(_unlockWay) {
                    this.$data['conditionNum'] = _unlockWay;
                }
                get $conditionNum() {
                    return this.$data ? this.$data['conditionNum'] : null;
                }
                set $conditionNum(_conditionNum) {
                    this.$data['conditionNum'] = _conditionNum;
                }
                get $degreeNum() {
                    return this.$data ? this.$data['degreeNum'] : null;
                }
                set $degreeNum(_degreeNum) {
                    this.$data['degreeNum'] = _degreeNum;
                }
                get $compelet() {
                    return this.$data ? this.$data['compelet'] : null;
                }
                set $compelet(_compelet) {
                    this.$data['compelet'] = _compelet;
                }
                get $getAward() {
                    return this.$data ? this.$data['getAward'] : null;
                }
                set $getAward(_getAward) {
                    this.$data['getAward'] = _getAward;
                }
                get $pitch() {
                    return this.$data ? this.$data['pitch'] : null;
                }
                set $pitch(_pitch) {
                    this.$data['pitch'] = _pitch;
                }
                get $data() {
                    if (!this['item/dataSource']) {
                        console.log('data没有赋值！也可能是数据源赋值给Data延时！');
                    }
                    return this['item/dataSource'];
                }
                set $data(data) {
                    this['item/dataSource'] = data;
                }
                get $dataIndex() {
                    return this['item/dataIndex'];
                }
                set $dataIndex(_dataIndex) {
                    this['item/dataIndex'] = _dataIndex;
                }
                $render() { }
                ;
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
                    this._property = {
                        name: 'name',
                        index: 'index',
                        sort: 'sort',
                        chName: 'chName',
                        classify: 'classify',
                        unlockWay: 'unlockWay',
                        conditionNum: 'conditionNum',
                        degreeNum: 'degreeNum',
                        compelet: 'compelet',
                        getAward: 'getAward',
                        pitch: 'pitch',
                    };
                    this._unlockWay = {
                        ads: 'ads',
                        gold: 'gold',
                        customs: 'customs',
                        diamond: 'diamond',
                        free: 'free',
                        check: 'check',
                    };
                    this._tableName = 'name';
                    this._lastArr = [];
                    this._localStorage = false;
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
                        }
                        this._listRender && this._listRender(cell, index);
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
                            if (elementLast[this._property.name] === element[this._property.name]) {
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
                                if (_lastelement[this._property.compelet]) {
                                    element[this._property.compelet] = true;
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
                            if (element[this._property.name] == name) {
                                value = element[pro];
                                break;
                            }
                        }
                    }
                    return value;
                }
                ;
                _getPitchIndexArr() {
                    for (let index = 0; index < this._arr.length; index++) {
                        const element = this._arr[index];
                        if (element[this._property.name] === this._pitchName) {
                            return index;
                        }
                    }
                }
                _getPitchIndexByList() {
                    if (this._List) {
                        for (let index = 0; index < this._List.array.length; index++) {
                            const element = this._List.array[index];
                            if (element[this._property.name] === this._pitchName) {
                                return index;
                            }
                        }
                    }
                }
                _listTweenToPitch(time, func) {
                    const index = this._getPitchIndexByList();
                    index && this._List.tweenTo(index, time, Laya.Handler.create(this, () => {
                        func && func();
                    }));
                }
                _listTweenToPitchChoose(diffIndex, time, func) {
                    const index = this._getPitchIndexByList();
                    index && this._List.tweenTo(index + diffIndex, time, Laya.Handler.create(this, () => {
                        func && func();
                    }));
                }
                _listScrollToLast() {
                    const index = this._List.array.length - 1;
                    index && this._List.scrollTo(index);
                }
                _setProperty(name, pro, value) {
                    for (const key in this._arr) {
                        if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
                            const element = this._arr[key];
                            if (element[this._property.name] == name) {
                                element[pro] = value;
                                this._refreshAndStorage();
                                break;
                            }
                        }
                    }
                    return value;
                }
                ;
                _getObjByName(name) {
                    let obj = null;
                    for (const key in this._arr) {
                        if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
                            const element = this._arr[key];
                            if (element[this._property.name] == name) {
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
                            if (element[this._property.name] == name) {
                                element[pro] = value;
                            }
                            else {
                                element[pro] = !value;
                            }
                        }
                    }
                    this._refreshAndStorage();
                }
                _setAllProPerty(pro, value) {
                    for (let index = 0; index < this._arr.length; index++) {
                        const element = this._arr[index];
                        element[pro] = value;
                    }
                    this._refreshAndStorage();
                }
                _addAllProPerty(pro, valueFunc) {
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
                        let any = Tools._Array.randomGetOne(arr);
                        return any;
                    }
                }
                _randomOneObj() {
                    const index = Tools._Number.randomOneBySection(0, this._arr.length - 1, true);
                    return this._arr[index];
                }
                _randomCountObj(count) {
                    const indexArr = Tools._Number.randomCountBySection(0, this._arr.length - 1, count, true);
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
                _setArrByProperty(proName, value) {
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
                        if (element[this._property.name] == name) {
                            element[this._property.pitch] = true;
                            _calssify = element[this._property.classify];
                        }
                        else {
                            element[this._property.pitch] = false;
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
                            if (element[this._property.name] === this._pitchName) {
                                return element;
                            }
                        }
                    }
                }
                _addObject(obj) {
                    let _obj = Tools._ObjArray.objCopy(obj);
                    for (let index = 0; index < this._arr.length; index++) {
                        const element = this._arr[index];
                        if (element[this._property.name] === _obj[this._property.name]) {
                            this._arr[index] == _obj;
                        }
                    }
                    this._refreshAndStorage();
                }
                _addObjectArr(objArr) {
                    const _objArr = Tools._ObjArray.arrCopy(objArr);
                    for (let i = 0; i < _objArr.length; i++) {
                        const obj = _objArr[i];
                        for (let j = 0; j < this._arr.length; j++) {
                            const element = this._arr[j];
                            if (obj && obj[this._property.name] === element[this._property.name]) {
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
                _sortByProperty(pro, indexPro, inverted) {
                    Tools._ObjArray.sortByProperty(this._arr, pro);
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
                    let diffArray = Tools._ObjArray.diffProByTwo(tableArr, storeArr, propertyName);
                    console.log(`${storageName}新添加对象`, diffArray);
                    Tools._Array.addToarray(storeArr, diffArray);
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
                            let diffArray = Tools._ObjArray.diffProByTwo(dataArr_0, dataArr, propertyName);
                            console.log('两个数据的差值为：', diffArray);
                            Tools._Array.addToarray(dataArr, diffArray);
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
        let Effects3D;
        (function (Effects3D) {
            Effects3D._tex2D = {
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
                        const _scaleX = sectionSize ? Tools._Number.randomOneBySection(sectionSize[0][0], sectionSize[1][0]) : Tools._Number.randomOneBySection(0.06, 0.08);
                        const _scaleY = sectionSize ? Tools._Number.randomOneBySection(sectionSize[0][1], sectionSize[1][1]) : Tools._Number.randomOneBySection(0.06, 0.08);
                        const _scaleZ = sectionSize ? Tools._Number.randomOneBySection(sectionSize[0][2], sectionSize[1][2]) : Tools._Number.randomOneBySection(0.06, 0.08);
                        this.box = parent.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(_scaleX, _scaleY, _scaleZ)));
                        if (position) {
                            this.box.transform.position = new Laya.Vector3(position[0], position[1], position[2]);
                        }
                        else {
                            this.box.transform.position = new Laya.Vector3(0, 0, 0);
                        }
                        this.fPosition = new Laya.Vector3(this.box.transform.position.x, this.box.transform.position.y, this.box.transform.position.z);
                        this.box.transform.localRotationEulerX = sectionRotation ? Tools._Number.randomOneBySection(sectionRotation[0][0], sectionRotation[1][0]) : Tools._Number.randomOneBySection(0, 360);
                        this.box.transform.localRotationEulerX = sectionRotation ? Tools._Number.randomOneBySection(sectionRotation[0][1], sectionRotation[1][1]) : Tools._Number.randomOneBySection(0, 360);
                        this.box.transform.localRotationEulerX = sectionRotation ? Tools._Number.randomOneBySection(sectionRotation[0][2], sectionRotation[1][2]) : Tools._Number.randomOneBySection(0, 360);
                        this.fEuler = new Laya.Vector3(this.box.transform.localRotationEulerX, this.box.transform.localRotationEulerY, this.box.transform.localRotationEulerZ);
                        const mat = this.box.meshRenderer.material = new Laya.BlinnPhongMaterial();
                        mat.albedoTexture = texArr ? Tools._Array.randomGetOne(texArr) : Effects3D._tex2D.圆形发光.texture2D;
                        mat.renderMode = 2;
                        const R = colorRGBA ? Tools._Number.randomOneBySection(colorRGBA[0][0], colorRGBA[1][0]) : Tools._Number.randomOneBySection(10, 25);
                        const G = colorRGBA ? Tools._Number.randomOneBySection(colorRGBA[0][1], colorRGBA[1][1]) : Tools._Number.randomOneBySection(5, 15);
                        const B = colorRGBA ? Tools._Number.randomOneBySection(colorRGBA[0][2], colorRGBA[1][2]) : Tools._Number.randomOneBySection(5, 10);
                        const A = colorRGBA ? Tools._Number.randomOneBySection(colorRGBA[0][3], colorRGBA[1][3]) : Tools._Number.randomOneBySection(1, 1);
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
                        const pXZ = Tools._Point.getRoundPos(this._positionByARY_FA += angleSpeed, radius, new Laya.Point(this.fPosition.x, this.fPosition.z));
                        this.box.transform.position = new Laya.Vector3(pXZ.x, this.box.transform.position.y += speedY, pXZ.y);
                        if (this.box.transform.position.y - this.fPosition.y > distance) {
                            stateSwitch && stateSwitch();
                        }
                    }
                    _positionARXY_R(angle, speedR, distance, stateSwitch) {
                        this._positionARXY_FR += speedR;
                        const point = Tools._Point.getRoundPos(angle, this._positionARXY_FR, new Laya.Point(0, 0));
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
                        Tools._3D.randomScopeByPosition(this.box, scopeSize);
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
                    const _distance = Tools._Number.randomNumerical(distance, [1.5, 1.5]);
                    const _speedY = Tools._Number.randomNumerical(speedY, [0.02, 0.02]);
                    const _angleSpeed = Tools._Number.randomNumerical(angleSpeed, [6, 6]);
                    const _radius = Tools._Number.randomNumerical(radius, [0.5, 0.5]);
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
                    const _distance = Tools._Number.randomNumerical(distance, [0.3, 0.6]);
                    const _speedR = Tools._Number.randomNumerical(speedR, [0.008, 0.012]);
                    const _angle = Tools._Number.randomNumerical([0, 360]);
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
                    caller._boxInit(parent, position, null, null, texArr ? texArr : [Effects3D._tex2D.星星5.texture2D], colorRGBA ? colorRGBA : [[15, 15, 15, 1], [30, 30, 30, 1]]);
                    caller._excludeZ();
                    caller._rotateTheZero();
                    caller._scaleTheZero();
                    caller._randomScopeByPosition(scopeSize);
                    caller.mat.albedoColorA = 0;
                    const _maxScale = Tools._Number.randomNumerical(maxScale, [1, 2]);
                    const _scaleSpeed = Tools._Number.randomNumerical(scaleSpeed, [0.01, 0.05]);
                    const _angelspeed = Tools._Number.randomNumerical(angelspeed, [2, 6], true);
                    const _ASpeed = Tools._Number.randomNumerical(ASpeed, [0.01, 0.05]);
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
            })(_Particle = Effects3D._Particle || (Effects3D._Particle = {}));
        })(Effects3D = lwg.Effects3D || (lwg.Effects3D = {}));
        let Effects2D;
        (function (Effects2D) {
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
            })(_SkinUrl = Effects2D._SkinUrl || (Effects2D._SkinUrl = {}));
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
                        this.rotation = rotation ? Tools._Number.randomOneBySection(rotation[0], rotation[1]) : Tools._Number.randomOneBySection(360);
                        this.skin = urlArr ? Tools._Array.randomGetOne(urlArr) : _SkinUrl.花3;
                        this.zOrder = zOrder ? zOrder : 0;
                        this.alpha = 0;
                        let RGBA = [];
                        RGBA[0] = colorRGBA ? Tools._Number.randomOneBySection(colorRGBA[0][0], colorRGBA[1][0]) : Tools._Number.randomOneBySection(180, 255);
                        RGBA[1] = colorRGBA ? Tools._Number.randomOneBySection(colorRGBA[0][1], colorRGBA[1][1]) : Tools._Number.randomOneBySection(10, 180);
                        RGBA[2] = colorRGBA ? Tools._Number.randomOneBySection(colorRGBA[0][2], colorRGBA[1][2]) : Tools._Number.randomOneBySection(10, 180);
                        RGBA[3] = colorRGBA ? Tools._Number.randomOneBySection(colorRGBA[0][3], colorRGBA[1][3]) : Tools._Number.randomOneBySection(1, 1);
                        Color._colour(this, RGBA);
                    }
                }
                _Aperture._ApertureImage = _ApertureImage;
                function _continuous(parent, centerPoint, size, minScale, rotation, urlArr, colorRGBA, zOrder, maxScale, speed, accelerated) {
                    const Img = new _ApertureImage(parent, centerPoint, size, rotation, urlArr, colorRGBA, zOrder);
                    let _speed = speed ? Tools._Number.randomOneBySection(speed[0], speed[1]) : 0.025;
                    let _accelerated = accelerated ? Tools._Number.randomOneBySection(accelerated[0], accelerated[1]) : 0.0005;
                    if (minScale) {
                        Img.scale(minScale[0], minScale[1]);
                    }
                    else {
                        Img.scale(0, 0);
                    }
                    const _maxScale = maxScale ? Tools._Number.randomOneBySection(maxScale[0], maxScale[1]) : 2;
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
                    let _speed = speed ? Tools._Number.randomOneBySection(speed[0], speed[1]) : 0.025;
                    let _accelerated = accelerated ? Tools._Number.randomOneBySection(accelerated[0], accelerated[1]) : 0.0005;
                    if (minScale) {
                        Img.scale(minScale[0], minScale[1]);
                    }
                    else {
                        Img.scale(0, 0);
                    }
                    const _maxScale = maxScale ? Tools._Number.randomOneBySection(maxScale[0], maxScale[1]) : 2;
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
            })(_Aperture = Effects2D._Aperture || (Effects2D._Aperture = {}));
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
                        this.zOrder = zOrder ? zOrder : 1000;
                        let RGBA = [];
                        RGBA[0] = colorRGBA ? Tools._Number.randomOneBySection(colorRGBA[0][0], colorRGBA[1][0]) : Tools._Number.randomOneBySection(180, 255);
                        RGBA[1] = colorRGBA ? Tools._Number.randomOneBySection(colorRGBA[0][1], colorRGBA[1][1]) : Tools._Number.randomOneBySection(10, 180);
                        RGBA[2] = colorRGBA ? Tools._Number.randomOneBySection(colorRGBA[0][2], colorRGBA[1][2]) : Tools._Number.randomOneBySection(10, 180);
                        RGBA[3] = colorRGBA ? Tools._Number.randomOneBySection(colorRGBA[0][3], colorRGBA[1][3]) : Tools._Number.randomOneBySection(1, 1);
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
                function _downwardSpray(parent, point, width, height, angle, urlArr, colorRGBA, vanishDistance, moveSpeed, gravity, accelerated, rotationSpeed, scaleRotationSpeed, skewSpeed, zOrder) {
                    const Img = new _ParticleImgBase(parent, point, [0, 0], width, height, null, urlArr, colorRGBA, zOrder);
                    const _angle = angle ? Tools._Number.randomOneBySection(angle[0], angle[1]) : Tools._Number.randomOneBySection(0, 90);
                    const p = Tools._Point.angleByPoint(_angle);
                    const _vanishDistance = vanishDistance ? Tools._Number.randomOneBySection(vanishDistance[0], vanishDistance[1]) : Tools._Number.randomOneBySection(200, 800);
                    let _speed = moveSpeed ? Tools._Number.randomOneBySection(moveSpeed[0], moveSpeed[1]) : Tools._Number.randomOneBySection(10, 30);
                    let accelerated0 = accelerated ? Tools._Number.randomOneBySection(accelerated[0], accelerated[1]) : Tools._Number.randomOneBySection(0.3, 1.5);
                    const _gravity = gravity ? Tools._Number.randomOneBySection(gravity[0], gravity[1]) : Tools._Number.randomOneBySection(1, 5);
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
                    let _rotationSpeed = rotationSpeed ? Tools._Number.randomOneBySection(rotationSpeed[0], rotationSpeed[1]) : Tools._Number.randomOneBySection(0, 1);
                    _rotationSpeed = Tools._Number.randomOneHalf() == 0 ? _rotationSpeed : -_rotationSpeed;
                    const _scaleSpeed = scaleRotationSpeed ? Tools._Number.randomOneBySection(scaleRotationSpeed[0], scaleRotationSpeed[1]) : Tools._Number.randomOneBySection(0, 0.25);
                    const _scaleDir = Tools._Number.randomOneHalf();
                    let _skewSpeed = skewSpeed ? Tools._Number.randomOneBySection(skewSpeed[0], skewSpeed[1]) : Tools._Number.randomOneBySection(1, 10);
                    _skewSpeed = Tools._Number.randomOneHalf() === 1 ? _skewSpeed : -_skewSpeed;
                    const _skewDir = Tools._Number.randomOneHalf();
                    const _scaleOrSkew = Tools._Number.randomOneHalf();
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
                    const _moveSpeed = moveSpeed ? Tools._Number.randomOneBySection(moveSpeed[0], moveSpeed[1]) : Tools._Number.randomOneBySection(1, 2.5);
                    let _distance0 = 0;
                    const _distance = distance ? Tools._Number.randomOneBySection(distance[0], distance[1]) : Tools._Number.randomOneBySection(100, 300);
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
                function _sprayRound(parent, centerPoint, width, height, rotation, urlArr, colorRGBA, distance, time, moveAngle, rotationSpeed, zOrder) {
                    let Img = new _ParticleImgBase(parent, centerPoint, [0, 0], width, height, rotation, urlArr, colorRGBA, zOrder);
                    let centerPoint0 = centerPoint ? centerPoint : new Laya.Point(0, 0);
                    let radius = 0;
                    const _time = time ? Tools._Number.randomOneBySection(time[0], time[1]) : Tools._Number.randomOneBySection(30, 50);
                    const _distance = distance ? Tools._Number.randomOneBySection(distance[0], distance[1]) : Tools._Number.randomOneBySection(100, 200);
                    const _speed = _distance / _time;
                    const _angle = moveAngle ? Tools._Number.randomOneBySection(moveAngle[0], moveAngle[1]) : Tools._Number.randomOneBySection(0, 360);
                    let rotationSpeed0 = rotationSpeed ? Tools._Number.randomOneBySection(rotationSpeed[0], rotationSpeed[1]) : Tools._Number.randomOneBySection(0, 20);
                    rotationSpeed0 = Tools._Number.randomOneHalf() == 0 ? rotationSpeed0 : -rotationSpeed0;
                    const vinishTime = Tools._Number.randomOneInt(60);
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
                                let point = Tools._Point.getRoundPos(_angle, radius, centerPoint0);
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
                                let point = Tools._Point.getRoundPos(_angle, radius, centerPoint0);
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
                    rotationSpeed0 = Tools._Number.randomOneHalf() == 0 ? rotationSpeed0 : -rotationSpeed0;
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
                    let p = Tools._Point.angleByPoint(_angle);
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
            })(_Particle = Effects2D._Particle || (Effects2D._Particle = {}));
            let _Glitter;
            (function (_Glitter) {
                class _GlitterImage extends Laya.Image {
                    constructor(parent, centerPos, radiusXY, urlArr, colorRGBA, width, height, zOder) {
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
                        RGBA[0] = colorRGBA ? Tools._Number.randomOneBySection(colorRGBA[0][0], colorRGBA[1][0]) : Tools._Number.randomOneBySection(10, 255);
                        RGBA[1] = colorRGBA ? Tools._Number.randomOneBySection(colorRGBA[0][1], colorRGBA[1][1]) : Tools._Number.randomOneBySection(200, 255);
                        RGBA[2] = colorRGBA ? Tools._Number.randomOneBySection(colorRGBA[0][2], colorRGBA[1][2]) : Tools._Number.randomOneBySection(10, 255);
                        RGBA[3] = colorRGBA ? Tools._Number.randomOneBySection(colorRGBA[0][3], colorRGBA[1][3]) : Tools._Number.randomOneBySection(1, 1);
                        Color._colour(this, RGBA);
                        this.alpha = 0;
                        this.zOrder = zOder ? zOder : 1000;
                    }
                }
                _Glitter._GlitterImage = _GlitterImage;
                function _blinkStar(parent, centerPos, radiusXY, urlArr, colorRGBA, width, height, scale, speed, rotateSpeed, zOder) {
                    let Img = new _GlitterImage(parent, centerPos, radiusXY, urlArr, colorRGBA, width, height, zOder);
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
            })(_Glitter = Effects2D._Glitter || (Effects2D._Glitter = {}));
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
                            Img.rotation = Tools._Point.pointByAngle(Img.x - targetXY[0], Img.y - targetXY[1]) + 180;
                        }
                        let time = speed * 100 + distance / 5;
                        if (index == posArray.length + 1) {
                            targetXY = [posArray[0][0], posArray[0][1]];
                        }
                        Animation2D.move(Img, targetXY[0], targetXY[1], time, () => {
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
            })(_circulation = Effects2D._circulation || (Effects2D._circulation = {}));
        })(Effects2D = lwg.Effects2D || (lwg.Effects2D = {}));
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
                        btnEffect = new _NoEffect();
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
                        btnEffect = new _NoEffect();
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
                down() { }
                move() { }
                up() { }
                out() { }
            }
            Click._NoEffect = _NoEffect;
            class _Largen {
                down(event) {
                    event.currentTarget.scale(1.1, 1.1);
                    AudioAdmin._playSound(Click._audioUrl);
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
                down(event) {
                    event.currentTarget.scale(0.9, 0.9);
                    AudioAdmin._playSound(Click._audioUrl);
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
                Laya.Tween.to(Node, { rotation: tRotate, x: tPoint.x, y: tPoint.y }, time, null, Laya.Handler.create(Node, () => {
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
            Animation2D.bombs_Appear = bombs_Appear;
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
                        bombs_Vanish(node, endScale, alpha, rotation, time, func);
                    });
                    de1 += interval;
                }
            }
            Animation2D.bombs_VanishAllChild = bombs_VanishAllChild;
            function bombs_Vanish(node, scale, alpha, rotation, time, func, delayed) {
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
            function move(node, targetX, targetY, time, func, delayed, ease) {
                Laya.Tween.to(node, { x: targetX, y: targetY }, time, ease ? ease : null, Laya.Handler.create(this, function () {
                    if (func) {
                        func();
                    }
                }), delayed ? delayed : 0);
            }
            Animation2D.move = move;
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
                        AudioAdmin._playMusic();
                    }
                    else {
                        val = 0;
                        Laya.LocalStorage.setItem('Setting_bgMusic', val.toString());
                        AudioAdmin._stopMusic();
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
                if (Setting._sound.switch) {
                    Laya.SoundManager.playSound(url, number, Laya.Handler.create(this, function () {
                        if (func) {
                            func();
                        }
                    }));
                }
            }
            AudioAdmin._playSound = _playSound;
            function _playDefeatedSound(url, number, func, soundVolume) {
                if (Setting._sound.switch) {
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
                if (Setting._sound.switch) {
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
                if (Setting._bgMusic.switch) {
                    Laya.SoundManager.playMusic(url ? url : _voiceUrl.bgm, number ? number : 0, Laya.Handler.create(this, function () { }), delayed ? delayed : 0);
                }
            }
            AudioAdmin._playMusic = _playMusic;
            function _stopMusic() {
                Laya.SoundManager.stopMusic();
            }
            AudioAdmin._stopMusic = _stopMusic;
        })(AudioAdmin = lwg.AudioAdmin || (lwg.AudioAdmin = {}));
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
                    let randomIndex = Tools._Array.randomGetOut(indexArr, num);
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
                    let Sp = Laya.Pool.getItemByCreateFun(name ? name : prefab.json['props']['name'], prefab.create, prefab);
                    Parent && Parent.addChild(Sp);
                    point && Sp.pos(point[0], point[1]);
                    script && Sp.addComponent(script);
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
            })(_Node = Tools._Node || (Tools._Node = {}));
            let _Number;
            (function (_Number) {
                function randomOneHalf() {
                    let number;
                    number = Math.floor(Math.random() * 2);
                    return number;
                }
                _Number.randomOneHalf = randomOneHalf;
                function randomNumerical(numSection, defaultNumSection, randomPlusOrMinus) {
                    let num = numSection ? Tools._Number.randomOneBySection(numSection[0], numSection[1]) : Tools._Number.randomOneBySection(defaultNumSection[0], defaultNumSection[1]);
                    if (randomPlusOrMinus) {
                        num = Tools._Number.randomOneHalf() === 0 ? num : -num;
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
                function pointByAngle(x, y) {
                    let radian = Math.atan2(x, y);
                    let angle = 90 - radian * (180 / Math.PI);
                    if (angle <= 0) {
                        angle = 270 + (90 + angle);
                    }
                    return angle - 90;
                }
                _Point.pointByAngle = pointByAngle;
                ;
                function angleByPoint(angle) {
                    let radian = (90 - angle) / (180 / Math.PI);
                    let p = new Laya.Point(Math.sin(radian), Math.cos(radian));
                    p.normalize();
                    return p;
                }
                _Point.angleByPoint = angleByPoint;
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
                function randomScopeByPosition(sp3D, scopeSize) {
                    let _pX = Tools._Number.randomOneBySection(scopeSize[0][0], scopeSize[1][0]);
                    let _pY = Tools._Number.randomOneBySection(scopeSize[0][1], scopeSize[1][1]);
                    let _pZ = Tools._Number.randomOneBySection(scopeSize[0][2], scopeSize[1][2]);
                    _pX = Tools._Number.randomOneHalf() == 0 ? _pX : -_pX;
                    _pY = Tools._Number.randomOneHalf() == 0 ? _pY : -_pY;
                    _pZ = Tools._Number.randomOneHalf() == 0 ? _pZ : -_pZ;
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
                function screenshot(Sp, quality) {
                    const htmlCanvas = Sp.drawToCanvas(Sp.width, Sp.height, Sp.x, Sp.y);
                    const base64 = htmlCanvas.toBase64("image/png", quality ? quality : 1);
                    return base64;
                }
                _Draw.screenshot = screenshot;
                _Draw._texArr = [];
                function cameraToSprite(camera, sprite, clear) {
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
            })(_Draw = Tools._Draw || (Tools._Draw = {}));
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
            })(_ObjArray = Tools._ObjArray || (Tools._ObjArray = {}));
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
            let _effectTex2D = [];
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
                _ListName["effectTex2D"] = "effectTex2D";
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
                _effectTex2D = [];
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
                        listObj[_ListName.effectTex2D] = Effects3D._tex2D;
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
                                            case _ListName.effectTex2D:
                                                _effectTex2D.push(element);
                                                break;
                                            default:
                                                break;
                                        }
                                    }
                                }
                            }
                        }
                        LwgPreLoad._loadOrder = [_pic2D, _scene2D, _prefab2D, _prefab3D, _json, _texture, _texture2D, _mesh3D, _material, _skeleton, _scene3D, _effectTex2D];
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
                                Admin._PreLoadCutIn.openName && this._openScene(Admin._PreLoadCutIn.openName);
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
                                AudioAdmin._playMusic();
                                this._openScene(_SceneName.Start, true, false, () => {
                                    LwgPreLoad._loadType = Admin._SceneName.PreLoadCutIn;
                                });
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
                        case _effectTex2D:
                            Laya.Texture2D.load(_effectTex2D[index]['url'], Laya.Handler.create(this, function (tex) {
                                if (tex == null) {
                                    console.log('XXXXXXXXXXX2D纹理' + _effectTex2D[index]['url'] + '加载失败！不会停止加载进程！', '数组下标为：', index, 'XXXXXXXXXXX');
                                }
                                else {
                                    _effectTex2D[index]['texture2D'] = tex;
                                    console.log('3D纹理' + _effectTex2D[index]['url'] + '加载完成！', '数组下标为：', index);
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
                                    console.log('XXXXXXXXXXX数据表' + _json[index]['url'] + '加载失败！不会停止加载进程！', '数组下标为：', index, 'XXXXXXXXXXX');
                                }
                                else {
                                    _json[index]['dataArr'] = data["RECORDS"];
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
            ];
            function _22init() {
                console.log('------------------------开始分包！');
                _loadPkg_VIVO();
            }
            _LwgInit._22init = _22init;
            function _loadPkg_VIVO() {
                if (_LwgInit._pkgStep === _LwgInit._pkgInfo.length) {
                    Admin._openScene(_SceneName.PreLoad);
                }
                else {
                    let info = _LwgInit._pkgInfo[_LwgInit._pkgStep];
                    let name = info.name;
                    Laya.Browser.window.qg.loadSubpackage({
                        name: name,
                        success: (res) => {
                            console.log('++++++++++++++++++++++++++++++++++++++分包成功！', res, _LwgInit._pkgStep);
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
                if (_LwgInit._pkgStep === _LwgInit._pkgInfo.length) {
                    Admin._openScene(_SceneName.PreLoad);
                }
                else {
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
                    DateAdmin._init();
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
                        Animation2D.move(sp, Execution._ExecutionNode.x, Execution._ExecutionNode.y, 800, () => {
                            Animation2D.fadeOut(sp, 1, 0, 200, 0, () => {
                                Animation2D.upDwon_Shake(Execution._ExecutionNode, 10, 80, 0, null);
                                if (func) {
                                    func();
                                }
                            });
                        }, 100);
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
    let AudioAdmin = lwg.AudioAdmin;
    let Click = lwg.Click;
    let Color = lwg.Color;
    let Effects2D = lwg.Effects2D;
    let Effects3D = lwg.Effects3D;
    let Dialogue = lwg.Dialogue;
    let Animation2D = lwg.Animation2D;
    let Animation3D = lwg.Animation3D;
    let Tools = lwg.Tools;
    let _LwgPreLoad = lwg.LwgPreLoad;
    let _PreLoadScene = lwg.LwgPreLoad._PreLoadScene;
    let _LwgInit = lwg._LwgInit;
    let _LwgInitScene = lwg._LwgInit._LwgInitScene;

    var _GameEvent;
    (function (_GameEvent) {
        let PreLoad;
        (function (PreLoad) {
        })(PreLoad = _GameEvent.PreLoad || (_GameEvent.PreLoad = {}));
        let Guide;
        (function (Guide) {
        })(Guide = _GameEvent.Guide || (_GameEvent.Guide = {}));
        let Game;
        (function (Game) {
            Game["checkEnemyBullet"] = "Game_bulletCheckHero";
            Game["closeScene"] = "Game_closeScene";
            Game["checkBuff"] = "GamecheckBuff";
            Game["treeCheckWeapon"] = "GametreeCheckWeapon";
            Game["enemyCheckWeapon"] = "GameenemyCheckWeapon";
            Game["enemyLandCheckWeapon"] = "GameenemyLandCheckWeapon";
            Game["enemyHouseCheckWeapon"] = "GameenemyHouseCheckWeapon";
            Game["bossCheckWeapon"] = "GamebossCheckWeapon";
            Game["heroineCheckWeapon"] = "GameheroineCheckWeapon";
            Game["enemyStage"] = "GameenemyStage";
            Game["enemyLandStage"] = "GamelandStage";
            Game["enemyHouseStage"] = "GameenemyHouseStage";
            Game["bossStage"] = "GamebossStage";
            Game["heroineStage"] = "GameheroineStage";
            Game["addEnemy"] = "GameaddEnemy";
        })(Game = _GameEvent.Game || (_GameEvent.Game = {}));
        let Task;
        (function (Task) {
        })(Task = _GameEvent.Task || (_GameEvent.Task = {}));
    })(_GameEvent || (_GameEvent = {}));

    var _Res;
    (function (_Res) {
        _Res._list = {
            prefab2D: {
                LwgGold: {
                    url: 'Prefab/LwgGold.json',
                    prefab: null,
                },
                Hero: {
                    url: 'Prefab/Hero.json',
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
                },
                Boss: {
                    url: 'Prefab/Boss.json',
                    prefab: null,
                },
                Buff: {
                    url: 'Prefab/Buff.json',
                    prefab: null,
                },
                Heroine: {
                    url: 'Prefab/Heroine.json',
                    prefab: null,
                }
            },
            scene2D: {
                UIStart: "Scene/" + _SceneName.Start + '.json',
                GameScene: "Scene/" + _SceneName.Game + '.json',
            },
            json: {
                Boss: {
                    url: "_LwgData" + "/_Game/Boss" + ".json",
                    dataArr: null,
                },
                Enemy: {
                    url: "_LwgData" + "/_Game/Enemy" + ".json",
                    dataArr: null,
                },
                HeroLevel: {
                    url: "_LwgData" + "/_Game/HeroLevel" + ".json",
                    dataArr: null,
                },
                HeroType: {
                    url: "_LwgData" + "/_Game/HeroType" + ".json",
                    dataArr: null,
                }
            },
        };
    })(_Res || (_Res = {}));
    var _PreLoad;
    (function (_PreLoad) {
        class PreLoad extends _LwgPreLoad._PreLoadScene {
            lwgOnStart() {
                this._evNotify(_LwgPreLoad._Event.importList, [_Res._list]);
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
    var _PreLoad$1 = _PreLoad.PreLoad;

    class EnemyBullet extends Admin._ObjectBase {
        constructor() {
            super(...arguments);
            this.speed = 2;
        }
        lwgOnStart() {
            this.checkHeroAndLevel();
        }
        move() {
            this[`moveType${this._Owner['_moveType']['moveNum']}`]();
        }
        moveType1() {
            TimerAdmin._frameLoop(1, this, () => {
                let point = Tools._Point.getRoundPos(this._Owner['_moveType']['angle'], this.speed += 2, this._Owner['_moveType']['point']);
                this._Owner.pos(point.x, point.y);
            });
        }
        moveType2() {
            TimerAdmin._frameLoop(1, this, () => {
                this._Owner.y += 3;
            });
        }
        moveType3() {
        }
        checkHeroAndLevel() {
            TimerAdmin._frameLoop(1, this, () => {
                !Tools._Node.leaveStage(this._Owner, () => {
                    this._Owner.removeSelf();
                }) && this._evNotify(_GameEvent.Game.checkEnemyBullet, [this._Owner, 1]);
            });
        }
    }

    class BossBullet extends EnemyBullet {
        lwgOnStart() {
            this.move();
            this.checkHeroAndLevel();
        }
        move() {
            TimerAdmin._frameLoop(1, this, () => {
                let point = Tools._Point.getRoundPos(this._Owner.rotation, this.speed += 2, this._fGPoint);
                this._Owner.x = point.x;
                this._Owner.y = point.y;
            });
        }
    }

    class BloodBase extends Admin._ObjectBase {
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
            Tools._Node.checkTwoDistance(Weapon, this._Owner, dis ? dis : 30, () => {
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
                Effects2D._Particle._spray(Laya.stage, this._gPoint, [10, 30]);
            }
        }
        attack() {
            let time = 0;
            const num = 20;
            TimerAdmin._frameRandomLoop(50, 100, this, () => {
                time++;
                for (let index = 0; index < num; index++) {
                    const bullet = Tools._Node.createPrefab(_Res._list.prefab2D.EnemyBullet.prefab);
                    this._SceneImg('EBparrent').addChild(bullet);
                    bullet.pos(this._gPoint.x, this._gPoint.y);
                    bullet.rotation = 360 / num * index + time * 10;
                    bullet.addComponent(BossBullet);
                }
            }, true);
        }
        createBullet() {
            const bullet = Tools._Node.createPrefab(_Res._list.prefab2D.EnemyBullet.prefab, this._SceneImg('EBparrent'), [this._gPoint.x, this._gPoint.y], EnemyBullet);
            return bullet;
        }
        attackType3() {
            TimerAdmin._frameLoop(80, this, () => {
                const bullet = this.createBullet();
                const gPoint = new Laya.Point(this._gPoint.x, this._gPoint.y);
                const angle = Tools._Number.randomOneBySection(45, 135) + 90;
                let speed = 5;
                TimerAdmin._frameLoop(1, bullet, () => {
                    let point = Tools._Point.getRoundPos(angle, speed += 5, gPoint);
                    bullet.pos(point.x, point.y);
                });
            });
        }
    }

    class HeroWeapon extends Admin._ObjectBase {
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
            TimerAdmin._frameLoop(1, this, () => {
                this.move();
            });
        }
        move() {
            if (this.getSpeed() > 0) {
                let p = Tools._Point.angleAndLenByPoint(this._Owner.rotation - 90, this.getSpeed());
                this._Owner.x += p.x;
                this._Owner.y += p.y;
            }
            else {
                this._Owner.y += this.getDropSpeed();
            }
            const leave = Tools._Node.leaveStage(this._Owner, () => {
                this._Owner.destroy();
            });
            if (!leave) {
                this._evNotify(_GameEvent.Game.treeCheckWeapon, [this._Owner, 1]);
                this._evNotify(_GameEvent.Game.enemyCheckWeapon, [this._Owner, 1]);
                this._evNotify(_GameEvent.Game.enemyLandCheckWeapon, [this._Owner, 1]);
                this._evNotify(_GameEvent.Game.enemyHouseCheckWeapon, [this._Owner, 1]);
                this._evNotify(_GameEvent.Game.heroineCheckWeapon, [this._Owner, 1]);
                this._evNotify(_GameEvent.Game.bossCheckWeapon, [this._Owner, 1]);
            }
        }
        drop() {
            this.state = this.stateType.free;
            Laya.timer.clearAll(this);
            TimerAdmin._frameLoop(1, this, () => {
                this._Owner.y += 40;
                this._Owner.rotation += 10;
                Tools._Node.leaveStage(this._Owner, () => {
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
            const Weapon = Tools._Node.createPrefab(_Res._list.prefab2D.Weapon.prefab);
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
            this.bloodInit(50);
            this.attackInterval = 10;
            this._HeroAttack = new HeroAttack(this._SceneImg('WeaponParent'), this._Owner);
            this._HeroAttack.ballisticNum = 1;
        }
        lwgOnStart() {
            TimerAdmin._frameLoop(this.attackInterval, this, () => {
                if (this.mouseP) {
                    this._HeroAttack.attack_S();
                }
            });
        }
        deathFunc() {
            this._openScene(_SceneName.Defeated, false);
        }
        lwgEvent() {
            this._evReg(_GameEvent.Game.checkEnemyBullet, (Bullet, numBlood) => {
                this.checkOtherRule(Bullet, 40, numBlood);
            });
            this._evReg(_GameEvent.Game.checkBuff, (type) => {
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

    class Heroine extends BloodBase {
        constructor() {
            super(...arguments);
            this.heroineStage = true;
        }
        lwgOnAwake() {
            this.bloodInit(50);
            this.attack();
        }
        lwgEvent() {
            this._evReg(_GameEvent.Game.heroineCheckWeapon, (Weapon, numBlood) => {
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
            this.ranAttackNum = Tools._Number.randomOneBySection(1, 3, true);
        }
        generalProInit() {
            this._Owner.pos(this._SceneImg('Land').width / 2, this._SceneImg('Land').height / 2);
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
            TimerAdmin._frameNumLoop(1, time, this, () => {
                radius += radiusSpeed;
                let point = Tools._Point.getRoundPos(this._Owner.rotation, radius, new Laya.Point(this._SceneImg('Land').width / 2, this._SceneImg('Land').height / 2));
                this._Owner.x = point.x;
                this._Owner.y = point.y;
            }, () => {
                func();
            });
        }
        attack() {
            this[`attackType${this.ranAttackNum}`]();
        }
        move() {
            TimerAdmin._frameLoop(1, this, () => {
                let point = Tools._Point.getRoundPos(this._Owner.rotation += this.speed, 220, new Laya.Point(this._SceneImg('Land').width / 2, this._SceneImg('Land').height / 2));
                this._Owner.x = point.x;
                this._Owner.y = point.y;
            });
        }
        deathFunc() {
            this._evNotify(_GameEvent.Game.addEnemy);
            if (this._Owner.name === 'Boss') {
                Tools._Node.createPrefab(_Res._list.prefab2D.Heroine.prefab, this._Parent, [this._Owner.x, this._Owner.y], Heroine);
            }
        }
        lwgEvent() {
            this._evReg(_GameEvent.Game.enemyCheckWeapon, (Weapon, numBlood) => {
                this.checkOtherRule(Weapon, 30, numBlood);
            });
        }
        createBullet() {
            const bullet = Tools._Node.createPrefab(_Res._list.prefab2D.EnemyBullet.prefab, this._SceneImg('EBparrent'), [this._gPoint.x, this._gPoint.y], EnemyBullet);
            return bullet;
        }
        attackType1() {
            const angleSpeed = 15;
            TimerAdmin._frameRandomLoop(120, 300, this, () => {
                for (let index = 0; index < 3; index++) {
                    const bullet = this.createBullet();
                    let speed = 0;
                    const gPoint = new Laya.Point(this._gPoint.x, this._gPoint.y);
                    TimerAdmin._frameLoop(1, bullet, () => {
                        let point = Tools._Point.getRoundPos(index * angleSpeed + 180 - angleSpeed, speed += 2, gPoint);
                        bullet.pos(point.x, point.y);
                    });
                }
            });
        }
        attackType2() {
            TimerAdmin._frameRandomLoop(50, 100, this, () => {
                const bullet = this.createBullet();
                TimerAdmin._frameLoop(1, bullet, () => {
                    bullet.y += 3;
                });
            });
        }
    }

    class Boss extends Enemy {
        lwgOnAwake() {
            this.generalProInit();
            this._Owner.pos(this._SceneImg('Content').x, this._SceneImg('Content').y);
            this._Owner.rotation = 0;
            this._SceneImg('Content').removeSelf();
            this.bloodInit(this._Owner['_EnemyData']['blood']);
        }
        lwgOnStart() {
            this.attack();
            this.move();
        }
        move() {
            let dir = 'left';
            TimerAdmin._frameLoop(1, this, () => {
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
            let time = 0;
            const num = 20;
            TimerAdmin._frameRandomLoop(50, 100, this, () => {
                time++;
                for (let index = 0; index < num; index++) {
                    const bullet = Tools._Node.createPrefab(_Res._list.prefab2D.EnemyBullet.prefab);
                    this._SceneImg('EBparrent').addChild(bullet);
                    bullet.pos(this._gPoint.x, this._gPoint.y);
                    bullet.rotation = 360 / num * index + time * 10;
                    bullet.addComponent(BossBullet);
                }
            }, true);
        }
    }

    var _GameData;
    (function (_GameData) {
        class _Buff extends DataAdmin._Table {
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
                const Buff = Tools._Node.createPrefab(_Res._list.prefab2D.Buff.prefab, Parent, [x, y], script);
                Buff['buffType'] = type;
                return Buff;
            }
        }
        _GameData._Buff = _Buff;
        class _Enemy extends DataAdmin._Table {
            constructor(_Parent) {
                super();
                this._otherPro = {
                    quantity: "quantity",
                    shellNum: "shellNum",
                    blood: 'blood',
                    boss: 'boss',
                    speed: 'speed',
                };
                this._arr = _Res._list.json.Enemy.dataArr;
                this.levelData = this._getObjByName(`level${Admin._game.level}`);
                this.quantity = this.levelData['quantity'];
                this.Parent = _Parent;
            }
            createEnmey() {
                this.quantity--;
                const shellNum = this.levelData[this._otherPro.shellNum];
                let shellNumTime = 0;
                const element = Tools._Node.createPrefab(_Res._list.prefab2D.Enemy.prefab, this.Parent);
                shellNumTime++;
                const color = Tools._Array.randomGetOne(['blue', 'yellow', 'red']);
                element.name = `${color}${color}`;
                let speed = Tools._Number.randomOneBySection(this.levelData[this._otherPro.speed][0], this.levelData[this._otherPro.speed][1]);
                speed = Tools._Number.randomOneHalf() == 0 ? -speed : speed;
                element['_EnemyData'] = {
                    shell: shellNumTime <= shellNum ? true : false,
                    blood: this.levelData['blood'],
                    angle: Tools._Number.randomOneBySection(0, 360),
                    speed: speed,
                    color: color,
                };
                element.addComponent(Enemy);
            }
        }
        _GameData._Enemy = _Enemy;
        class _Boss extends DataAdmin._Table {
            constructor(Parent) {
                super();
                this._otherPro = {
                    blood: 'blood',
                    specials: 'specials',
                    speed: 'speed',
                    skills: 'skills',
                    bulletPower: 'bulletPower',
                };
                this._arr = _Res._list.json.Boss.dataArr;
                this.levelData = this._getObjByName(`Boss${Admin._game.level}`);
                this.skills = this.levelData['skills'];
                this.speed = this.levelData['speed'];
                this.blood = this.levelData['blood'];
                this.createLevelBoss(Parent);
            }
            createLevelBoss(Parent) {
                const element = Tools._Node.createPrefab(_Res._list.prefab2D.Enemy.prefab, Parent);
                element.name = `Boss`;
                let speed = Tools._Number.randomOneBySection(this.speed[0], this.speed[1]);
                speed = Tools._Number.randomOneHalf() == 0 ? -speed : speed;
                element['_EnemyData'] = {
                    blood: this.blood,
                    angle: Tools._Number.randomOneBySection(0, 360),
                    speed: speed,
                    sikllNameArr: this.skills,
                };
                element.addComponent(Boss);
                return element;
            }
        }
        _GameData._Boss = _Boss;
    })(_GameData || (_GameData = {}));

    class _Buff extends Admin._ObjectBase {
        lwgOnStart() {
            this.checkHero();
        }
        checkHero() {
            TimerAdmin._frameLoop(1, this, () => {
                this._Owner.y += 5;
                !Tools._Node.leaveStage(this._Owner, () => {
                    this._Owner.removeSelf();
                }) && Tools._Node.checkTwoDistance(this._Owner, this._SceneImg('Hero'), 60, () => {
                    this._Owner.removeSelf();
                    this._evNotify(_GameEvent.Game.checkBuff, [this._Owner['buffType']]);
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
            this._evReg(_GameEvent.Game.enemyLandStage, () => {
                this.buffState = false;
                this._ImgChild('Blood').visible = false;
                console.log(this._Owner);
                this.attackType3();
            });
            this._evReg(_GameEvent.Game.treeCheckWeapon, (Weapon, numBlood) => {
                if (this.buffState) {
                    this.checkOtherRule(Weapon, 50, numBlood);
                }
            });
        }
        deathFunc() {
            _GameData._Buff._ins().createBuff(0, this._Scene, this._gPoint.x, this._gPoint.y, _Buff);
        }
    }

    class EnemyLand extends BloodBase {
        constructor() {
            super(...arguments);
            this.landStage = false;
        }
        lwgOnAwake() {
            this.bloodInit(50);
            this._ImgChild('Blood').visible = false;
            TimerAdmin._frameLoop(1, this, () => {
                this._Owner.rotation += 0.1;
            });
        }
        lwgEvent() {
            this._evReg(_GameEvent.Game.enemyLandStage, () => {
                Laya.timer.clearAll(this);
                this.attack();
                const time = Math.abs(this._Owner.rotation % 360) * 10;
                Animation2D.rotate(this._Owner, 0, time, 0, () => {
                    this._Owner.rotation = 0;
                    this._ImgChild('Blood').visible = true;
                    this.landStage = true;
                });
            });
            this._evReg(_GameEvent.Game.enemyLandCheckWeapon, (Weapon, numBlood) => {
                this.checkOtherRule(Weapon, 160, this.landStage ? numBlood : 0);
            });
        }
        deathFunc() {
            this._evNotify(_GameEvent.Game.enemyHouseStage);
        }
    }

    class EnemyHouse extends BloodBase {
        constructor() {
            super(...arguments);
            this.enemyHouseStage = false;
        }
        lwgOnAwake() {
            this.bloodInit(50);
            this._ImgChild('Blood').visible = false;
        }
        lwgEvent() {
            this._evReg(_GameEvent.Game.enemyHouseStage, () => {
                this.enemyHouseStage = true;
                this._ImgChild('Blood').visible = true;
                this.attack();
            });
            this._evReg(_GameEvent.Game.enemyHouseCheckWeapon, (Weapon, numBlood) => {
                this.checkOtherRule(Weapon, 50, this.enemyHouseStage ? numBlood : 0);
            });
        }
        deathFunc() {
            new _GameData._Boss(this._SceneImg('BossParent'));
        }
    }

    var _Game;
    (function (_Game) {
        _Game._texArr = [];
        _Game._arrowParentArr = [];
        class Game extends Admin._SceneBase {
            lwgOnAwake() {
                this._Owner['Hero'] = Tools._Node.createPrefab(_Res._list.prefab2D.Hero.prefab, this._Owner, [Laya.stage.width / 2, Laya.stage.height * 2 / 3]);
                this._ImgVar('Hero').addComponent(Hero);
                for (let index = 0; index < this._ImgVar('MiddleScenery').numChildren; index++) {
                    const element = this._ImgVar('MiddleScenery').getChildAt(index);
                    if (element.name == 'Tree') {
                        element.addComponent(Tree);
                    }
                }
                this._ImgVar('Land').addComponent(EnemyLand);
                this._ImgVar('EnemyHouse').addComponent(EnemyHouse);
            }
            lwgOnStart() {
                this._evNotify(_GameEvent.Game.enemyStage);
            }
            lwgEvent() {
                this._evReg(_GameEvent.Game.enemyStage, () => {
                    this._Enemy = new _GameData._Enemy(this._ImgVar('EnemyParent'));
                    const num = 10;
                    for (let index = 0; index < num; index++) {
                        this._Enemy.createEnmey();
                    }
                });
                this._evReg(_GameEvent.Game.addEnemy, () => {
                    if (this._Enemy.quantity > 0) {
                        this._Enemy.createEnmey();
                    }
                    else {
                        if (this._ImgVar('EnemyParent').numChildren <= 1) {
                            this._evNotify(_GameEvent.Game.enemyLandStage);
                        }
                    }
                });
                this._evReg(_GameEvent.Game.closeScene, () => {
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
        _Game.Game = Game;
    })(_Game || (_Game = {}));
    var _Game$1 = _Game.Game;

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
                    EventAdmin._notify(_GameEvent.Game.closeScene);
                });
            }
        }
        _Victory.Victory = Victory;
    })(_Victory || (_Victory = {}));
    var _Victory$1 = _Victory.Victory;

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
                    EventAdmin._notify(_GameEvent.Game.closeScene);
                });
            }
        }
        _Defeated.Defeated = Defeated;
    })(_Defeated || (_Defeated = {}));
    var _Defeated$1 = _Defeated.Defeated;

    class LwgInit extends _LwgInitScene {
        lwgOnAwake() {
            _LwgInit._pkgInfo = [];
            Platform._Ues.value = Platform._Tpye.Web;
            Laya.Stat.show();
            SceneAnimation._openSwitch.value = true;
            SceneAnimation._Use.value = {
                class: SceneAnimation._fadeOut.Open,
                type: null,
            };
            Click._Use.value = Click._Type.reduce;
            Adaptive._Use.value = [1280, 720];
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
        lwgOnStart() {
            this._openScene(_SceneName.PreLoad);
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
