
/**记录引擎中解决的一些问题，节约同类问题的解决时间*/
export module record {

    /**
       * 关于引擎
       * 打括号的是刚体属性，不打括号的是问题名称
       */
    export enum Engine {

        'atlas' = '当图集不在索引中，或者无法更新打包时，可以在bin文件夹下手动添加需要用到的图片和文件夹，这样的用以就是不打包，直接用',

        '修改文件夹名字' = '在左边修改文件夹名称不会导致图片资源丢失，会直接映射到游戏中，所以增删改查都在左边进入，下面制作展示和拖入',



        'skeleton(骨骼动画)' = '骨骼动画所用到的图片是不可以打包的，否则取图片时候图片会错乱',

        'fileconfig.json(索引文件)' = 'atlas打包了，索引文件中找不到，可以把图片名称添加到fileconfig.json中',
        '库文件' = '如果F9中的库文件没有勾选，那么相对应的模块不能用new创建，但是可以用 Laya.模块 的类型声明',

        '首次加载出现卡顿' = '有时候第一次添加一张很小的图时，都会卡，有些界面进入第一次也会卡，这些图片和界面包括资源都进行了预加载，可是依然很卡，猜测的原因是因为图片虽然加载了，但是绘制到屏幕可能依然需要消耗性能，那么第一次加载到屏幕可能会因为这张图片在一张很大的合图中，如果这张图片很小，又要单独拿出来创建，可以不合图，或者这张图可以在加载界面取出进行第一次绘制，然后关闭',

        '所有节点，都以img为基础' = 'sprite功能太少，img格式在是空节点时，会有一个框，其他功能多于sprite，索性全用img',

        '执行域1' = '执行域的作用之一，追踪一些事件和方法的执行者，this便是这些事件和方法的执行者，对象{}，类calss，模块module都可以作为执行域，他们都有this，执行域必须在可控范围内，否则会导致事件重叠或者无法清除这些事件',

        '执行域2' = '点击事件的执行域为当前脚本，特效的执行域是一次性的，可以在临时执行域{}或者单例中，结束时清理',

        '执行域3' = '循环的执行域可以用new出来的对象{}当做执行域，方便舍弃，如果需要关闭当前界面特效就结束，可以用当前脚本当做执行域，否则关闭脚本和场景，虽然图片不在，但是循环依然在进行，显然增加了性能消耗',

        '执行事件Event' = '事件注册可以注册在onAweak中或者onEnable中，但是执行的时候不要执行在onAweak中或者onEnable中，执行在onStart中，否则可能会报错',

        '节点或场景关闭时机问题' = '节点或场景上如果有脚本，不可以在onAweak中或者onEnable中关闭或者移除，否则会导致此节点没有初始化完成就被关闭了，会报错，如果要立即关闭场景，则在onStart中执行关闭和移除操作',

        '项目库文件勾选' = '2D项目必须删除所有3D库文件，否则可能会导致某些不必要的计算；无论是2D还是3D最好删除不必要的库文件',

        'mask遮罩问题1' = '节点如果为Image,那么它的遮罩必须为mask，否则可能会导致一些显示问题',
        'mask遮罩问题2' = '有遮罩的图片的坐标必须是整数，不能有小数，否则可能导致遮罩有一根细线的存在，可能是遮罩只会遮罩整数坐标，导致计算错误',

        '截屏对应源码修改' = '截屏  var htmlCanvas: Laya.HTMLCanvas = this.Owner.drawToCanvas(this.Owner.width, this.Owner.height, 0, 0);htmlCanvas.toBase64("image/png"),对应core中的源码修改，才可以上传平台，被平台识别，core中搜索‘var imgdata’，修改如下:',
        // // var imgdata = new ImageData(canvasWidth, canvasHeight);
        // var canvx = new HTMLCanvas(true); //创建一个canvas
        // canvx.size(canvasWidth, canvasHeight); //设置宽高，这个和ImageData保持一致
        // var ctx2dx = canvx.getContext('2d'); //获取上下文
        // var imgdata = ctx2dx.getImageData(0, 0, canvasWidth, canvasHeight); //获取imageData，来替代ImageData

        '2Dtexture' = '2Dtexture不需要打包，一般在unity中导出，如果在laya中也要设置不打包',

        'drawToTexture()和drawToCanvas()' = '这两个截图方法都是在新建的canves对象上进行绘制的，这个canves应该默认是舞台或者是设计宽度，所以其中的偏移量应该恰好是绘制的sprite的x，y，才能够刚好进行截图，所以根据sprite的宽高即可控制截图的大小，有时候截不到图，应该是x，y的偏移量问题，宽高和坐标都是sprite的即可',

        '每次赋值新贴图Texture/Texture2D的时候，旧的贴图要删掉' = 'destroy()掉，否则内存增加很快，尤其是用drawToTexture()和drawToCanvas()绘制的行的贴图',

        'texture/texture2D的引用属性' = '贴图如果不new出一个的话，多个sprite用同一个贴图的时候，销毁其中一个贴图必然会引发其他贴图消失，因为是引用关系',

        '非必要截图保存的图片用tex临时保存' = '只有需要存储的用base64，否则可能导致内存泄漏，经过测试base64字符串所占用的内存大多时候释放不掉',

        mouseEnabled = '节点上的这个属性为true时，可以注册点击事件，为false时，不触发点击事件！',
        '节点的长宽' = '节点的属性面板中，无论是sprite还是img只要在游戏中需要改变其图片，并且图片的大小发生了变化，只需要把节点的长宽变为空值auto即可，如果不变为auto，无论怎么换图片都是一样的大小，会压缩或者拉伸',

        'povit和anchor作为中心点的区别' = '其实这两个区别很简单，而且分情况使用将会更加强大，povit是具体中心点的xy数值，如果用了povit，那么缩放的时候不会改变这个数值，导致中心点是浮动的，位置是改变的，如果使用anchor作为中心点，是比例，那么无论进行怎么样的缩放都不会改变其中心点的比例位置，但是其位置也不会改变，所以这两种依情况而定',

        '节点的mask' = '规定节点的遮罩的大小和坐标必须为整数，如果有0.5这样的值出现，大概率出现遮罩不完全',
        '大面积固定遮罩panel' = 'panel可以在固定排布的界面中使用，遮罩更完美',
    }

    export let Skeleton = {
        不打包: '骨骼动画所用到的图集是不能够参与打包在其他图集上的，设置成不打包，否则取图片时候图片会错乱',
        事件监听内存泄露: '有时候事件过多的时候（猜测）监听lable事件的时候会疯狂触发事件，所以重复播放的开关被关闭，那就不会重复触发同一种事件，例如this.Sk.play(this.$SkAniType.attack, false, false);第三个参数就如果重复播放动画则不响应',
        当前动画的总帧数: 'Sk.total,这些可以用来控制动画播放的时间和速率',
        IK:'有时候骨骼动画的IK无法运行，这个问题到现在没有解决',
    }
    /**内存*/
    export enum memory {
        节点太多 = '当节点很多并且都处于显示状态时，解决办法：及时影藏显示销毁节点。做好节点管理',
        每帧中计算量过大 = '多重循环，或者计算逻辑太过复杂，解决办法：分解计算步骤，拆分for循环，分解计算步骤到前后步骤',
        单帧创建大量节点 = '同时创建大量节点也会增加内存负担，解决办法：减少或者分布到两三帧创建，肉眼很难分辨',
        提前加载资源 = '如果资源需要的时候在加载，那么依然会出现延时或卡顿，解决办法：提前加载，并且管理起来',
        内存泄露 = '如果游戏过程中创建的一些对象，例如贴图，截图，各种动态创建的资源，操作完毕后，依然存在，那么内存会一直占用，导致内存占用越来越大，解决办法：动态创建的对象，必须是在可控范围内，不需要时及时销毁或者，从某个界面出来后统一销毁',
        内存的最基本原则 = '1.减少瞬时计算，2.减少对象创建，不只是节点、贴图这些显存对象，例如计时器，脚本数量，脚本中的对象属性，各种模块等等，都是消耗虚拟内存的，但是这些并不是主要的',
        计时器 = '计时器和一般对象不同，在不作用的时候，一定要删掉，否则计算量会增加很多，尤其是不断增加的计时器',
        资源的大小 = '图片和模型的大小有时候也可以尽量优化，减小占用'
    }
    /**
     * 关于2d物理引擎
     * 打括号的是刚体属性，不打括号的是问题名称
     */
    export enum Box2d {
        allowSleep = '这个属性是休眠，默认开启，操作过一次后，可能就休眠了，所以如果需要平凡操作，一定要记得打开',
        bullet = '这个属性防止高速穿透',
        dynamic = 'dynamic物理类型，是运动类型，无论是自由运动，通过力来运动，通过坐标移动，都可以可以产生碰撞反应，坐标移动的话，可以做如下设置this.rig.setVelocity({ x: 0, y: 0 });',

        'childMove' = '子节点刚体不会跟着主节点的移动而移动，所以在update里面可以设置子节点跟随，或者建立多个刚体,此方法在相互碰撞中可能会产生问题',
        'BoxCollider' = '方形碰撞框，目前是以两个物体的第一次碰到的边作为进入碰撞，持续碰撞，结束碰撞来计算的，所以对碰撞框是有要求的，例如父节点的box被挤压后，有穿透，带着子节点位移了，很容易就会结束碰撞',

        'Laya.Physics.I.worldRoot=scene' = '物理世界根节点，有时候需要整体移动物理世界，可以将物理世界根节点设置为场景，这样的话可以整体移动场景，物理世界将一起移动，其他节点似乎不可以；如果不这么做，必须分别移动带有物理的节点，才可以，很麻烦，也可以',
    }

    export enum Unity {
        size = '一个模型真实大小测量方法，1、给一个模型增加一个boxCollider组件，此时会自动计算物体的长宽高，并且显示在boxcollider中;2、如果需要调整模型的大小，用scale，这时候会自动调整boxcollider的大小，无需手动调整，但是boxcollider的长宽高数字并不会发生改变，不需要改变这个值。那么此时模型的大小就是boxcollider.size*scale;3.如果物体的父节点也发生了scale缩放，则模型的真实大小为boxcollider.size*scale*parent.size；4、如果父节点还有父节点发生了缩放，那么逐级进行*parent.size',

        IsTrigger = '在box中，这个IsTrigger表示是否为触发器，如果IsTrigger=true，则不受物理属性影响，并且需要用onTriggerEnter进行碰撞检测，如果为false，则用onCollisionEnter方法检测碰撞；如果一个为true另一个为false的两个物体碰撞，那么在他们的挂载的脚本中，检测碰撞也是不一样的，必须和IsTrigger所匹配',
    }
    /**一些变量的初始化*/
    export enum Script {
        parentClass = '目前脚本内部很多通用方法，例如开场动画，消失动画，时间注册，self节点属性，等一些通用属性和方法，需要写个父类，然后开始直接运行父类的这些方法，就可以起到整合作用，不用每次都声明',
        new = '声明引用变量，必须初始化，否则无法直接赋值，例如 provide point ：Laya.point,可以直接写成provide point ：Laya.Point = new Laya.Point();'
    }

    export enum Laya3D {
        '_defaultPhysicsMemory' = '如果出现内存不够的情况‘abort Cannot enlarge memory arrays’，在Laya.d3.js中的构造函数中改变this._defaultPhysicsMemory = 512;',
        '单个资源加载过大' = '如果某个3D资源，比如场景，预制体过大，加载时间过长，可以用分解法，分解后再进行加载，这样进度条更加流畅'
    }

    export enum Loding {
        '单个资源加载过大' = '如果某个3D资源，比如场景，预制体过大，加载时间过长，可以用分解法，分解后再进行加载，这样进度条更加流畅'
    }

    export enum LocalStorage {
        "Laya.LocalStorage.getItem()" = '在pc浏览器中，会自动把“null”转换为null，但是微信小游戏等不会，所以getItem()如果没有上传，返回的是一个字符串“null”，并不是是真正的null，所以不可以用Laya.LocalStorage.getItem()！==null，来判断有无存储，必须得用Laya.LocalStorage.getItem()！==“null”，如果用Laya.LocalStorage.getItem()！==null会被自动判定成Laya.LocalStorage.getItem()==false，用Laya.LocalStorage.getItem()！==“null”才为true，为了避免歧义，直接用Laya.LocalStorage.getItem()是正确或者是错误即可有无存储',

        'JSON.parse()' = 'json转换成对象问题，同上在pc浏览器中，会自动把“null”转换为null，当Laya.LocalStorage.getJson()时，如果是没有上传json，那么在小游戏中返回的是“null”，pc会自动把“null”转换为null，此时浏览器不会报错，而小游戏中JSON.parse(“null”)是报错的，因为非json结构，所以此时不可以直接用JSON.parse(Laya.LocalStorage.getJson())，需先做判断!Laya.LocalStorage.getItem(),有上传过才可以转换',

        null的本地存储 = `null的本地json对象为"null"，为正确值，itme则时非正确值`,

    }
    export let TS = {
        " if(0)": 'false',
        " if(1)": 'true',
        '对象1': '在类中不推荐使用对象，因为对象函数的this指向只有是箭头函数的时候指向类，不用箭头函数则没有提示，所以尽量不使用'
    }
    export let JS = {
        '优化变量内存1': '最佳办法是将相对来说是全局变量的值初始化为null，很多类和对象也是全局的或者是一直存在的，里面的属性都可以为null，用过之后也为null，节点，变量都可以这么做，接触引用关系',
        '优化变量内存2': 'let,const是局部变量声明，会加快内存处理机制介入，var有时候是垮作用于的，所以某种意义上来说，相对清理较晚',
        '===和==': '优先使用===，为了防止出现==号中类型的隐式转换例如true和0',
    }
    export let VSCode = {
        '.点出的引用如何打开注释': '例如Effect.选中其中一个，点击最右边有个尖头‘>’就可以打开注释',
        '.只能注释插件': '搜索‘注释’下载插件即可，注意里面的快捷键',
    }
    export enum ObjArray {
        "一般会从json文件中取出对象数组" = '若想使用这个数组，必须每次深度拷贝，否则会修改json文件',
    }

    export let WritingRule = {
        节点名称: "节点名称用首字母大写",
        LwgData$Table类中1: "方法名称首字母小写，如果涉及到了一些查找和设置的，全部用set和get开头",
        LwgData$Table类中2: "方法名称首字母小写，如果涉及到了一些验证检查试用check开头",
        LwgData$Table类中3: "方法名称首字母小写，如果涉及到了一些特殊修改的可有用add,delete,change,check,create,set,get,do,when,play",
        事件: {
            事件位置: '都写在_GameData模块中',
            事件名称: 'uiname1+uiname2+‘string’，这种写法方便查找，也不用重新枚举事件名称',
        },
        模块: {
            变量名: '模块中的全局变量名称用_name命名形式',
            方法名: '模块中的全局方法名称用_func（）命名形式',
        },
        LwgTools: '代表了当前分类和作用例如，node开头则是节点相关，random开头是随机，draw开头表示绘制矢量图，d2开头表示2维方面的工具，d3表示3d中的工具，dAll是2d和3d都可用，point表示坐标相关，number表示数字，obj表示处理对象，array表示处理数组，objArray表示处理对象数组，json表示处理json',
        '没有声明的变量赋值[name]': '这样的变量赋值必须只用在当前页面，否则会发生找不到的情况。',
        '模块中同类型的方法可以重新内置一个模块': '也可以用类把他们框在一起，方便使用',

        脚本中的方法开头: "add,delete,change,check,create,set,get,do,when,play,find,deduct，show，hide，each便于归类和理解",
        对象名: "对象名用大写",
    }

    export enum TJ {
        '导入1：tsconfig.json如下修改',
        // {
        //     "compilerOptions": {
        //       "module": "es6",
        //       "target": "es2017",
        //       "noEmitHelpers": true,
        //       "sourceMap": false
        //     },
        //     "exclude": [
        //       "node_modules"
        //     ]
        //   }
        '导入2：index.js添加',
        // loadLib("js/TJ.js");
        'packing工具中方达按钮可以看到icon',
    }
    export let copyProject = {
        1: '文件夹数量或者文件夹中的内容：page文件夹，src文件夹，'
    }
    /**发布和调试*/
    export let Issue = {
        general: {
            1: '包体大小问题，3D游戏包体大小大约为11兆以下，多了可以用tinypng压缩合图，能压缩50%以下, https://tinypng.com/',
            2: '资源加载不出01,分包后，依然需要把分包的一些资源例如场景json、图片等进行预加载，否则可能会出现丢失的情况',
            3: '资源加载不出02,上传平台，如果还有些资源包括文件夹，因为大小写对不上而加载不出来，但是在浏览器中可能会忽略大小写',
            4: '如果无法横屏，可以在game.json的第一列改变设备的横竖屏"deviceOrientation": "sensor_landscape",landscape横屏 portrait竖屏 sensor_landscape横屏(双方向) sensor_portrait竖屏(双方向)',
        },
        OV: {
            1: '如果出现一些类似于npm、cmd、node-modoul、VIVO-minigame等问题，很有可能是nodejs、npm出现问题，卸载安装nodejs，有时候也有必要安装一下VIVO-minigame，网上搜索‘VIVO-minigame’即可通过npm安装',
            2: '网上教程可以用eclipse连接手机进行调试，如果控制面板中的安卓连接出现问题，可能是没有驱动，可以通过豌豆荚app，他会自动安装连接的驱动',
            3: '手机上快应用游戏调试器如果消失了，可以通过设置->应用->显示系统进程找到，卸载重装也是个方法，下载地址 https://activity-cdo.heytapimage.com/cdo-activity/static/201810/26/quickgame/documentation/#/games/use',
            4: 'eclipse和手机连接不上可以尝试拔出usb再插入，或者关闭eclipse再打开',
            5: '不分包的文件在games文件夹中',
            6: '如果打包不出dist可能是nodejs版本不对，需要nodejsv10.16.3，查看版本号，cmd，node -v',
            分包: {
                1: '配置分包名与分包路径的字段，分包的对应文件夹下加main.js文件（注：main.js文件不能为空，加一段log就可以了',
                2: '分包文件夹只能是bin目录下的一级目录，不能二级目录下，否则分包之后会找不到文件路径。name的取名与需要分包的文件夹root名字统一',
                3: '分包出的rpk文件中，纯分包的总大小（主包+分包）不能超过12M；其中主包不超过4M，单个分包不超过4M，所有分包的总和不超过8M。（不用分包的话：总大小不超过4M）。如下图是分包出的文件，自行检测是否超过大小',
                4: '分包成功后的小游戏 rpk 需拷贝到手机的 Android/data/com.nearme.instant.platform/files/subPkg 中，subPkg 是自己新建的， 之后便可打开 OPPO 小游戏调试器在 GAME分包 标签页下打开对应小游戏。注：原先games文件的rpk文件最好全都删掉，防止测包时出现读取错误。',
                5: '有时候电脑上没有com.nearme.instant.platform，可以将包复制到手机上，然后再手机上黏贴进去',
                6: '分包生成的rpk在和不分生成的rpk只能存在一个包文件，否则不能找到最新的',
                7: 'eclipse日志被自动清空的解决办法 https://www.cnblogs.com/lenve/p/5865918.html',
            },
        },
        ByteDance: {
            1: '打包成字节小游戏不通过，则用打包成微信小游戏也可以上传',
            2: 'bin文件夹下project.config.json需要手动添加appid',
        },
        eclipse: {
            1: 'eclipse上没有安卓选项如下步骤检查，检查一下baiWindows->Show View中有没有Android，如du果zhi没有，再看看Windows->Show View->Other中有没有Android，如果Other中也没有，Android插件dao没装好，从头zhuan检查有没有遗漏什么安装步骤。如果Other中有，那就只是配置的问题，接着往下看。1、打开Eclipse, New->Project->Android Project, 随便新建一个HelloWorld工程。2、建好了之后，Windows->New Window。3、看看新打开的Eclipse, New 菜单是不是有Android Project了?4、关掉第一个Eclipse',

            2: '步骤1如果没有发现，则重新安装，并且勾选安卓调试',
            3: '和手机连接后，如果发现手机和logCat，点击导航栏Windows->Show View->Other->Android文件夹，点开后分别有两个按钮，device选项为发现安卓手机窗口，logCat为日志',
            4: '日志的等级jswrapper是调试OV包的日志，在logCat窗口坐标saved filters过滤器中点击‘+’号，打开面板后，filterName 填写jswrapper，by log Tag 也写上jswrapper，点击确定，既可以出现jswrapper窗口，这个窗口的意义大概就是js调试',
            5: '有时候调试不成功可能是java没有装,cmd， java -version为查看java的方法',
            6: 'eclipse日志被自动清空的解决办法网址 https://www.cnblogs.com/lenve/p/5865918.html',
            7: 'eclipse日志被自动清空的解决办法 1.配置环境变量:环境变量的配置并不是必需的，但是为了使用命令时方便，我们最好还是配置一下，具体操作方式就不说了，说两个要点：1.新建Android_SDK_HOME，值为你的SDK目录，我的是D:\Program\android\SDKForEclipse,2.在Path中添加  ;%Android_SDK_HOME%\tools;%Android_SDK_HOME%\platform-tools，不过要注意%前的; 2.使用adb log命令:当我们的logcat清除的太快的以至于我们没法看清楚错误信息的时候，我们可以使用下面的方式来打印日志：1.打开cmd，输入如下命令并回车：注意，>后面的D:\aaa.txt表示我们将日志打印到D盘中的aaa.txt文件中。2.打开我们的app进行操作，当你操作完成之后，按下Ctrl+C，停止该命令的执行，这时打开D盘，就会看到日志文件都存在了aaa.txt文件里。3.打开aaa.txt，搜索fatal，可以快速找到错误信息。',
            8: 'eclipse和手机连接不上可以尝试拔出usb再插入，或者关闭eclipse再打开',
            9: '网上教程可以用eclipse连接手机进行调试，如果控制面板中的安卓连接出现问题，可能是没有驱动，可以通过豌豆荚app，他会自动安装连接的驱动',
        }

    }
    export let chrome = {
        横屏调试: 'F12,导航栏设置旁边有三个点，这三个点可以选择显示模式，调成上显示，下看log的模式，同时导航栏上有个手机图标，点击后更加方便'
    }
    export let WPS表格 = {
        wps表格数字输入逗号自动消失: '右键单元格设置，数字设置为文本',
    }
    export let Git = {
        TortoiseGit安装: '网上搜索TortoiseGit安装，里面也有一个语言选择包，可以选择中文，TortoiseGit安装在任意目录，语言包则旋转默认安装，当然应该也可以安装在其他目录',
        clone远程项目: '将远程项目的http//开头的地址改复制一下，用命令或者TortoiseGit都可以拉取',
        生成密钥才可以推送: 'gitbash输入命令ssh-keygen -t rsa -C "849567502@qq.com" 为生成密钥，地址在C:\Users\用户名（我的是老王哥）\.ssh中，id_rsa.pub这个文件中有密钥，填写到github中去，右上角选项中能看到密钥按钮进去填写即可',
        如果用TortoiseGit推送的话: 'TortoiseGit推送时会有一个弹窗弹出来，是输入密钥的，输入后会弹出输入用户名，就是‘849567502@qq.com’，然后弹出输入密码，即可推送，三次输入缺一不可',
        TortoiseGit的好处: '自动记录一些信息，并且可视化操作，不过最好用git命令行',
    }
}