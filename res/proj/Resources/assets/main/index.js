System.register("chunks:///_virtual/backbutton.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc', './scenelist.ts', './TestFramework.ts'], function (exports) {
  'use strict';

  var _defineProperty, _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, JsonAsset, Vec3, _decorator, Component, assetManager, profiler, Canvas, Layers, find, Label, game, ScrollView, director, Director, Layout, sceneArray, TestFramework, StateCode;

  return {
    setters: [function (module) {
      _defineProperty = module.defineProperty;
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      JsonAsset = module.JsonAsset;
      Vec3 = module.Vec3;
      _decorator = module._decorator;
      Component = module.Component;
      assetManager = module.assetManager;
      profiler = module.profiler;
      Canvas = module.Canvas;
      Layers = module.Layers;
      find = module.find;
      Label = module.Label;
      game = module.game;
      ScrollView = module.ScrollView;
      director = module.director;
      Director = module.Director;
      Layout = module.Layout;
    }, function (module) {
      sceneArray = module.sceneArray;
    }, function (module) {
      TestFramework = module.TestFramework;
      StateCode = module.StateCode;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor, _class3, _temp;

      cclegacy._RF.push({}, "022e0824UxEDY4MQ1JBg2L7", "backbutton", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let BackButton = exports('BackButton', (_dec = ccclass("BackButton"), _dec2 = property(JsonAsset), _dec(_class = (_class2 = (_temp = _class3 = class BackButton extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "autoTestConfig", _descriptor, this);

          _defineProperty(this, "isAutoTesting", false);
        }

        __preload() {
          const sceneInfo = assetManager.main.config.scenes;
          const array = [];
          sceneInfo.forEach(i => array.push(i.url));
          array.sort();

          for (let i = 0; i < array.length; i++) {
            let str = array[i];

            if (str.includes('TestList') || str.includes('subPack') || str.includes('static-ui-replace')) {
              continue;
            }

            if (str.includes('asset-bundle-zip') && !assetManager.downloader.remoteServerAddress) {
              continue;
            }

            const firstIndex = str.lastIndexOf('/') + 1;
            const lastIndex = str.lastIndexOf('.scene');
            sceneArray.push(str.substring(firstIndex, lastIndex));
          }
        }

        manuallyControl() {
          this.node.getChildByName('PrevButton').active = true;
          this.node.getChildByName('NextButton').active = true;
          this.node.getChildByName('back').active = true;
          profiler.showStats();
        }

        autoControl() {
          this.node.getChildByName('PrevButton').active = false;
          this.node.getChildByName('NextButton').active = false;
          this.node.getChildByName('back').active = false;
          profiler.hideStats();
        }

        static get offset() {
          return BackButton._offset;
        }

        static set offset(value) {
          BackButton._offset = value;
        }

        static saveOffset() {
          if (BackButton._scrollNode) {
            BackButton._offset = new Vec3(0, BackButton._scrollCom.getScrollOffset().y, 0);
          }
        }

        static saveIndex(index) {
          BackButton._sceneIndex = index;
          BackButton.refreshButton();
        }

        static refreshButton() {
          if (BackButton._sceneIndex === -1) {
            BackButton._prevNode.active = false;
            BackButton._nextNode.active = false;
          } else {
            BackButton._prevNode.active = true;
            BackButton._nextNode.active = true;
          }
        }

        start() {
          let camera = this.node.getComponent(Canvas).cameraComponent;
          if (camera.visibility & Layers.Enum.UI_2D) camera.visibility &= ~Layers.Enum.UI_2D;
          this.sceneName = find("backRoot").getChildByName("sceneName").getComponent(Label);
          game.addPersistRootNode(this.node);
          BackButton._scrollNode = this.node.getParent().getChildByPath('Canvas/ScrollView');

          if (BackButton._scrollNode) {
            BackButton._scrollCom = BackButton._scrollNode.getComponent(ScrollView);
          }

          BackButton._blockInput = this.node.getChildByName('BlockInput');
          BackButton._blockInput.active = false;
          BackButton._prevNode = this.node.getChildByName('PrevButton');
          BackButton._nextNode = this.node.getChildByName('NextButton');

          if (BackButton._prevNode && BackButton._nextNode) {
            BackButton.refreshButton();
          }

          director.on(Director.EVENT_BEFORE_SCENE_LOADING, this.switchSceneName, this);
          if (!this.autoTestConfig.json.enabled) return;
          TestFramework.instance.connect(this.autoTestConfig.json.server, this.autoTestConfig.json.port, this.autoTestConfig.json.timeout, err => {
            if (err) {
              this.isAutoTesting = false;
            } else {
              TestFramework.instance.startTest({
                time: Date.now()
              }, err => {
                if (err) {
                  this.isAutoTesting = false;
                } else {
                  this.isAutoTesting = true;
                  this.autoControl();
                  let sceneList = this.autoTestConfig.json.sceneList;
                  let testList = sceneArray.filter(x => sceneList.indexOf(x) !== -1);
                  sceneArray.length = 0;
                  sceneArray.push(...testList);
                  this.nextScene();
                }
              });
            }
          });
        }

        onDestroy() {
          let length = sceneArray.length;

          for (let i = 0; i < length; i++) {
            sceneArray.pop();
          }
        }

        switchSceneName() {
          if (this.getSceneName() == null) {
            return;
          }

          this.sceneName.node.active = true;
          this.sceneName.string = this.getSceneName();
        }

        backToList() {
          director.resume();
          BackButton._blockInput.active = true;
          director.loadScene('TestList', () => {
            this.sceneName.node.active = false;
            BackButton._sceneIndex = -1;
            BackButton.refreshButton();
            BackButton._scrollNode = this.node.parent.getChildByPath('Canvas/ScrollView');

            if (BackButton._scrollNode) {
              BackButton._scrollCom = BackButton._scrollNode.getComponent(ScrollView);

              BackButton._scrollCom.content.getComponent(Layout).updateLayout();

              BackButton._scrollCom.scrollToOffset(BackButton.offset, 0.1, true);
            }

            BackButton._blockInput.active = false;
          });
        }

        nextScene() {
          director.resume();
          BackButton._blockInput.active = true;
          this.updateSceneIndex(true);
          const sceneName = this.getSceneName();
          director.loadScene(sceneName, err => {
            if (this.isAutoTesting) {
              if (err) {
                TestFramework.instance.postMessage(StateCode.SCENE_ERROR, sceneName, '', () => {
                  this.manuallyControl();
                });
              } else {
                TestFramework.instance.postMessage(StateCode.SCENE_CHANGED, sceneName, '', err => {
                  if (err) {
                    this.manuallyControl();
                  } else if (BackButton._sceneIndex === sceneArray.length - 1) {
                    TestFramework.instance.endTest('', () => {
                      this.manuallyControl();
                    });
                  } else {
                    this.nextScene();
                  }
                });
              }
            }

            BackButton._blockInput.active = false;
          });
        }

        preScene() {
          director.resume();
          BackButton._blockInput.active = true;
          this.updateSceneIndex(false);
          director.loadScene(this.getSceneName(), function () {
            BackButton._blockInput.active = false;
          });
        }

        updateSceneIndex(next) {
          if (next) {
            BackButton._sceneIndex + 1 >= sceneArray.length ? BackButton._sceneIndex = 0 : BackButton._sceneIndex += 1;
          } else {
            BackButton._sceneIndex - 1 < 0 ? BackButton._sceneIndex = sceneArray.length - 1 : BackButton._sceneIndex -= 1;
          }
        }

        getSceneName() {
          return sceneArray[BackButton._sceneIndex];
        }

      }, _defineProperty(_class3, "_offset", new Vec3()), _defineProperty(_class3, "_scrollNode", null), _defineProperty(_class3, "_scrollCom", null), _defineProperty(_class3, "_sceneIndex", -1), _defineProperty(_class3, "_blockInput", void 0), _defineProperty(_class3, "_prevNode", void 0), _defineProperty(_class3, "_nextNode", void 0), _temp), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "autoTestConfig", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/graphics-continuous-filling.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _defineProperty, cclegacy, Vec2, _decorator, Component, Vec3, Node, Graphics, UITransform, math;

  return {
    setters: [function (module) {
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Vec2 = module.Vec2;
      _decorator = module._decorator;
      Component = module.Component;
      Vec3 = module.Vec3;
      Node = module.Node;
      Graphics = module.Graphics;
      UITransform = module.UITransform;
      math = module.math;
    }],
    execute: function () {
      var _dec, _class, _temp;

      cclegacy._RF.push({}, "027fazjnA9F8bfae44tQFpj", "graphics-continuous-filling", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      const temp_vec2 = new Vec2();
      let GraphicsContinuousFilling = exports('GraphicsContinuousFilling', (_dec = ccclass('GraphicsContinuousFilling'), _dec(_class = (_temp = class GraphicsContinuousFilling extends Component {
        constructor(...args) {
          super(...args);

          _defineProperty(this, "pos", new Vec3());

          _defineProperty(this, "worldPos", new Vec3());

          _defineProperty(this, "graphics", null);

          _defineProperty(this, "minX", 0);

          _defineProperty(this, "minY", 0);

          _defineProperty(this, "maxX", 0);

          _defineProperty(this, "maxY", 0);
        }

        start() {
          var _this$getComponent;

          this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
          this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
          this.graphics = this.getComponent(Graphics);
          const trans = this.getComponent(UITransform);
          const wPos = (_this$getComponent = this.getComponent(UITransform)) === null || _this$getComponent === void 0 ? void 0 : _this$getComponent.convertToWorldSpaceAR(new Vec3(), this.worldPos);
          this.minX = -trans.anchorX * trans.width + wPos.x;
          this.maxX = (1 - trans.anchorX) * trans.width + wPos.x;
          this.minY = -trans.anchorY * trans.height + wPos.y;
          this.maxY = (1 - trans.anchorY) * trans.height + wPos.y;
          this.graphics.lineWidth = 10;
        }

        onDestroy() {
          this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
          this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        }

        onTouchStart(touch, event) {
          touch.getUILocation(temp_vec2);
          let x = math.clamp(temp_vec2.x, this.minX, this.maxX);
          let y = math.clamp(temp_vec2.y, this.minY, this.maxY);
          this.pos.set(x - this.worldPos.x, y - this.worldPos.y, 0);
        }

        onTouchMove(touch, event) {
          this.graphics.moveTo(this.pos.x, this.pos.y);
          touch.getUILocation(temp_vec2);
          let x = math.clamp(temp_vec2.x, this.minX, this.maxX);
          let y = math.clamp(temp_vec2.y, this.minY, this.maxY);
          this.pos.set(x - this.worldPos.x, y - this.worldPos.y, 0);
          this.graphics.lineTo(this.pos.x, this.pos.y);
          this.graphics.stroke();
        }

        clear() {
          this.graphics.clear();
        }

      }, _temp)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/Utils.ts", ['cc'], function (exports) {
  'use strict';

  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      exports('isEmptyObject', isEmptyObject);

      cclegacy._RF.push({}, "04e49novIVI34Kk+WZjsnZW", "Utils", undefined);

      function isEmptyObject(obj) {
        for (var i in obj) {
          return false;
        }

        return true;
      }

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/use-render-texture-asset.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, RenderTexture, Sprite, _decorator, Component, Camera, SpriteFrame;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      RenderTexture = module.RenderTexture;
      Sprite = module.Sprite;
      _decorator = module._decorator;
      Component = module.Component;
      Camera = module.Camera;
      SpriteFrame = module.SpriteFrame;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _temp;

      cclegacy._RF.push({}, "07d94W9KPNNpZuDMYnjBRSX", "use-render-texture-asset", undefined);

      const {
        ccclass,
        property,
        menu
      } = _decorator;
      let UseRenderTextureAsset = exports('UseRenderTextureAsset', (_dec = ccclass("UseRenderTextureAsset"), _dec2 = menu('RenderTexture/UseRenderTextureAsset'), _dec3 = property(RenderTexture), _dec4 = property(Sprite), _dec(_class = _dec2(_class = (_class2 = (_temp = class UseRenderTextureAsset extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "render", _descriptor, this);

          _initializerDefineProperty(this, "content", _descriptor2, this);
        }

        start() {
          const renderTex = this.render;
          const camera = this.getComponent(Camera);
          camera.targetTexture = renderTex;
          const spriteFrame = this.content.spriteFrame;
          const sp = new SpriteFrame();
          sp.reset({
            originalSize: spriteFrame.originalSize,
            rect: spriteFrame.rect,
            offset: spriteFrame.offset,
            isRotate: spriteFrame.rotated
          });
          sp.texture = renderTex;
          this.content.spriteFrame = sp;
          this.content.updateMaterial();
        } // update (deltaTime: number) {
        //     // Your update function goes here.
        // }


      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "render", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "content", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/pauseButton.ts", ['cc'], function (exports) {
  'use strict';

  var cclegacy, Component, director, _decorator;

  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Component = module.Component;
      director = module.director;
      _decorator = module._decorator;
    }],
    execute: function () {
      var _dec, _class;

      cclegacy._RF.push({}, "0c9580onAlEC7RVsSoBOlCI", "pauseButton", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let button = exports('button', (_dec = ccclass("button"), _dec(_class = class button extends Component {
        onPause() {
          director.pause();
        }

        onResume() {
          director.resume();
        }

      }) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/static-batcher.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, _defineProperty, cclegacy, Node, Label, _decorator, Component, BatchingUtility;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      Label = module.Label;
      _decorator = module._decorator;
      Component = module.Component;
      BatchingUtility = module.BatchingUtility;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _temp;

      cclegacy._RF.push({}, "0dbb7y1BqdBcpQru04GUrg1", "static-batcher", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let StaticBatcher = exports('StaticBatcher', (_dec = ccclass('StaticBatcher'), _dec2 = property({
        type: Node
      }), _dec3 = property({
        type: Label
      }), _dec(_class = (_class2 = (_temp = class StaticBatcher extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "staticNode", _descriptor, this);

          _initializerDefineProperty(this, "buttonLabel", _descriptor2, this);

          _defineProperty(this, "_batched", false);
        }

        onBtnClick() {
          if (this._batched) {
            BatchingUtility.unbatchStaticModel(this.staticNode, this.node);
            this._batched = false;
            this.buttonLabel.string = 'Batch';
          } else {
            BatchingUtility.batchStaticModel(this.staticNode, this.node);
            this._batched = true;
            this.buttonLabel.string = 'Unbatch';
          }
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "staticNode", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "buttonLabel", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/slider-ctrl.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _defineProperty, cclegacy, _decorator, Component, Color, Sprite;

  return {
    setters: [function (module) {
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Component = module.Component;
      Color = module.Color;
      Sprite = module.Sprite;
    }],
    execute: function () {
      var _dec, _dec2, _class, _temp;

      cclegacy._RF.push({}, "0dc81FpNV1Gu7PzuHGs1FyN", "slider-ctrl", undefined);

      const {
        ccclass,
        menu
      } = _decorator;
      let SliderCtrl = exports('SliderCtrl', (_dec = ccclass("SliderCtrl"), _dec2 = menu('UI/SliderCtrl'), _dec(_class = _dec2(_class = (_temp = class SliderCtrl extends Component {
        constructor(...args) {
          super(...args);

          _defineProperty(this, "_color", new Color());
        }

        start() {// Your initialization goes here.
        }

        changeAlpha(slider) {
          const spriteComp = this.getComponent(Sprite);

          this._color.set(spriteComp.color);

          this._color.a = slider.progress * 255;
          spriteComp.color = this._color;
        } // update (deltaTime: number) {
        //     // Your update function goes here.
        // }


      }, _temp)) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/changeUniform.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, _defineProperty, cclegacy, _decorator, Component, Vec4, Sprite;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Component = module.Component;
      Vec4 = module.Vec4;
      Sprite = module.Sprite;
    }],
    execute: function () {
      var _dec, _class, _class2, _descriptor, _descriptor2, _temp;

      cclegacy._RF.push({}, "0e601yHzVhLwYhF9dgYNzIT", "changeUniform", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let ChangeUniform = exports('ChangeUniform', (_dec = ccclass('ChangeUniform'), _dec(_class = (_class2 = (_temp = class ChangeUniform extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "startTime", _descriptor, this);

          _initializerDefineProperty(this, "intervalTime", _descriptor2, this);

          _defineProperty(this, "spriteCom", null);

          _defineProperty(this, "materialIns", null);

          _defineProperty(this, "cha", false);

          _defineProperty(this, "color", new Vec4(1, 1, 1, 1));
        }

        start() {
          // Your initialization goes here.
          this.cha = false;
          this.spriteCom = this.node.getComponent(Sprite); // this.materialIns = this.spriteCom.sharedMaterial;

          this.materialIns = this.spriteCom.material;
          this.schedule(this.changeUni, this.intervalTime, 1000, this.startTime);
        }

        changeUni() {
          if (this.cha) {
            this.color.set(1, 1, 0, 1);
          } else {
            this.color.set(1, 1, 1, 1);
          }

          this.materialIns.setProperty('mainColor', this.color);
          this.cha = !this.cha;
        } // update (deltaTime: number) {
        //     // Your update function goes here.
        // }


      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "startTime", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 2;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "intervalTime", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 2;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/IntersectRayTest.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, _defineProperty, cclegacy, Label, Prefab, Camera, _decorator, Component, geometry, Node, instantiate, MeshRenderer, systemEvent, SystemEventType, Vec3, gfx, Vec2, Color;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Label = module.Label;
      Prefab = module.Prefab;
      Camera = module.Camera;
      _decorator = module._decorator;
      Component = module.Component;
      geometry = module.geometry;
      Node = module.Node;
      instantiate = module.instantiate;
      MeshRenderer = module.MeshRenderer;
      systemEvent = module.systemEvent;
      SystemEventType = module.SystemEventType;
      Vec3 = module.Vec3;
      gfx = module.gfx;
      Vec2 = module.Vec2;
      Color = module.Color;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _temp;

      cclegacy._RF.push({}, "107d8RVVo1LYoC6nEcHgFgp", "IntersectRayTest", undefined);

      const {
        ccclass,
        property
      } = _decorator; // const { Model } = renderer.scene

      const map = {};
      let IntersectRayTest = exports('IntersectRayTest', (_dec = ccclass('IntersectRayTest'), _dec2 = property({
        type: Label
      }), _dec3 = property({
        type: Prefab
      }), _dec4 = property({
        type: Camera
      }), _dec(_class = (_class2 = (_temp = class IntersectRayTest extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "tips", _descriptor, this);

          _initializerDefineProperty(this, "point", _descriptor2, this);

          _initializerDefineProperty(this, "mainCamera", _descriptor3, this);

          _defineProperty(this, "_ray", new geometry.Ray());

          _defineProperty(this, "_modelComps", []);

          _defineProperty(this, "_points", []);
        }

        onLoad() {
          this._container = new Node('_TEST_');
          this.node.scene.addChild(this._container);

          this._points.push(instantiate(this.point));

          this._points.push(instantiate(this.point));

          this._points.push(instantiate(this.point));

          this._container.addChild(this._points[0]);

          this._container.addChild(this._points[1]);

          this._container.addChild(this._points[2]);

          this._points[0].active = false;
          this._points[1].active = false;
          this._points[2].active = false;
          this._modelComps = this.getComponentsInChildren(MeshRenderer);
        }

        onEnable() {
          systemEvent.on(SystemEventType.TOUCH_START, this.onTouchStart, this);
        }

        onDisable() {
          systemEvent.off(SystemEventType.TOUCH_START, this.onTouchStart, this);
        }

        onTouchStart(touch, event) {
          this._points[0].active = false;
          this._points[1].active = false;
          this._points[2].active = false;
          const loc = touch.getLocation();
          this.mainCamera.screenPointToRay(loc.x, loc.y, this._ray);

          for (let i = 0; i < this._modelComps.length; i++) {
            const mo = this._modelComps[i].model;
            const me = this._modelComps[i].mesh;
            const opt = {
              'mode': geometry.ERaycastMode.CLOSEST,
              'distance': Infinity,
              'result': [],
              'subIndices': [],
              'doubleSided': false
            };
            const dis = geometry.intersect.rayModel(this._ray, mo, opt);

            if (dis) {
              console.log(mo.node.name, dis);

              if (mo.node.name == 'Cube') {
                map['Cube'] = dis;
              } else if (mo.node.name == 'Cube-non-uniform-scaled') {
                map['Cube-non-uniform-scaled'] = dis;
              }

              const r_cube = map['Cube'];
              const r_cube_nus = map['Cube-non-uniform-scaled'];
              if (r_cube && r_cube_nus) this.testEquals(r_cube, r_cube_nus, 4);
              const r = opt.result;
              const s = opt.subIndices; // test dis is equals result[0]

              this.testEquals(dis, r[0].distance, 0);

              if (me.subMeshCount == 1) {
                const vertex = new Vec3();
                const pos = me.renderingSubMeshes[0].geometricInfo.positions;
                let posIndex = r[0].vertexIndex0 * 3;
                vertex.set(pos[posIndex], pos[posIndex + 1], pos[posIndex + 2]);
                Vec3.transformMat4(vertex, vertex, mo.node.worldMatrix);

                this._points[0].setWorldPosition(vertex);

                posIndex = r[0].vertexIndex1 * 3;
                vertex.set(pos[posIndex], pos[posIndex + 1], pos[posIndex + 2]);
                Vec3.transformMat4(vertex, vertex, mo.node.worldMatrix);

                this._points[1].setWorldPosition(vertex);

                posIndex = r[0].vertexIndex2 * 3;
                vertex.set(pos[posIndex], pos[posIndex + 1], pos[posIndex + 2]);
                Vec3.transformMat4(vertex, vertex, mo.node.worldMatrix);

                this._points[2].setWorldPosition(vertex);

                this._points[0].active = true;
                this._points[1].active = true;
                this._points[2].active = true;
                /**GET UV  */

                const tex_coord = me.readAttribute(s[0], gfx.AttributeName.ATTR_TEX_COORD);

                if (tex_coord) {
                  const uv = new Vec2();
                  let uvIndex = r[0].vertexIndex0 * 2;
                  uv.set(tex_coord[uvIndex], tex_coord[uvIndex + 1]);
                  console.log(JSON.stringify(uv));
                  uvIndex = r[0].vertexIndex1 * 2;
                  uv.set(tex_coord[uvIndex], tex_coord[uvIndex + 1]);
                  console.log(JSON.stringify(uv));
                  uvIndex = r[0].vertexIndex2 * 2;
                  uv.set(tex_coord[uvIndex], tex_coord[uvIndex + 1]);
                  console.log(JSON.stringify(uv));
                }
              } else {
                const hitPoint = new Vec3();

                this._ray.computeHit(hitPoint, r[0].distance);

                this._points[0].setWorldPosition(hitPoint);

                this._points[0].active = true;
              }
            }
          }
        }

        testEquals(a, b, precision) {
          if (Math.abs(a - b) > precision) {
            this.tips.string = "????????? issue ????????????" + `Math.abs(${a.toPrecision(3)} - ${b.toPrecision(3)}) > ${precision}`;
            this.tips.color = Color.RED;
          }
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "tips", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "point", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "mainCamera", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/coordinate-ui-local-local.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, _defineProperty, cclegacy, Enum, Label, Node, _decorator, Component, Vec3, UITransform;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Enum = module.Enum;
      Label = module.Label;
      Node = module.Node;
      _decorator = module._decorator;
      Component = module.Component;
      Vec3 = module.Vec3;
      UITransform = module.UITransform;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _temp;

      cclegacy._RF.push({}, "11114hQBC1PGK1Ap1XNGEjC", "coordinate-ui-local-local", undefined);

      const {
        ccclass,
        property,
        menu
      } = _decorator;
      var ConvertType;

      (function (ConvertType) {
        ConvertType[ConvertType["LOCAL"] = 0] = "LOCAL";
        ConvertType[ConvertType["WORLD"] = 1] = "WORLD";
      })(ConvertType || (ConvertType = {}));

      Enum(ConvertType);
      let CoordinateUILocalLocal = exports('CoordinateUILocalLocal', (_dec = ccclass("CoordinateUILocalLocal"), _dec2 = menu('UI/CoordinateUILocalLocal'), _dec3 = property({
        type: ConvertType
      }), _dec4 = property(Label), _dec5 = property(Node), _dec(_class = _dec2(_class = (_class2 = (_temp = class CoordinateUILocalLocal extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "convertType", _descriptor, this);

          _initializerDefineProperty(this, "showLabel", _descriptor2, this);

          _initializerDefineProperty(this, "aim", _descriptor3, this);

          _defineProperty(this, "_time", 0);

          _defineProperty(this, "_transform", null);

          _defineProperty(this, "_aimTransform", null);

          _defineProperty(this, "_out", new Vec3());

          _defineProperty(this, "_fixPoint", new Vec3(100, 100, 0));
        }

        start() {
          this._transform = this.getComponent(UITransform);
          this._aimTransform = this.aim.getComponent(UITransform);
        }

        update(deltaTime) {
          let pos = this.node.position;

          if (this._time >= 0.2) {
            if (pos.x > 200) {
              this.node.setPosition(-200, pos.y, pos.z);
            } else {
              this.node.setPosition(pos.x + 5, pos.y, pos.z);
            }

            this._time = 0;
          }

          this._time += deltaTime;

          if (this.convertType === ConvertType.LOCAL) {
            pos = this.node.worldPosition;

            this._aimTransform.convertToNodeSpaceAR(pos, this._out);

            this.showLabel.string = `??????????????????????????????????????? 5 ????????????${this._out.toString()}`;
          } else {
            this._transform.convertToWorldSpaceAR(this._fixPoint, this._out);

            this.showLabel.string = `??????????????? x ????????? 100 ?????????????????????\n???????????????????????? x ???????????? 5???${this._out.toString()}`;
          }
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "convertType", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return ConvertType.LOCAL;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "showLabel", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "aim", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/TestFramework.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc', './Client.ts', './Utils.ts'], function (exports) {
  'use strict';

  var _defineProperty, cclegacy, Client, isEmptyObject;

  return {
    setters: [function (module) {
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      Client = module.Client;
    }, function (module) {
      isEmptyObject = module.isEmptyObject;
    }],
    execute: function () {
      exports({
        ReceivedCode: void 0,
        StateCode: void 0
      });

      cclegacy._RF.push({}, "123f32xQl9OcIs4nIjjgO2A", "TestFramework", undefined);

      let StateCode;

      (function (StateCode) {
        StateCode["START"] = "Start";
        StateCode["ERROR"] = "Error";
        StateCode["END"] = "End";
        StateCode["SCENE_CHANGED"] = "SceneChanged";
        StateCode["SCENE_ERROR"] = "SceneError";
        StateCode["PERFORMANCE"] = "Performance";
      })(StateCode || (StateCode = exports('StateCode', {})));

      let ReceivedCode;

      (function (ReceivedCode) {
        ReceivedCode["FAILED"] = "Failed";
        ReceivedCode["ERROR"] = "Error";
        ReceivedCode["Pass"] = "Pass";
        ReceivedCode["OK"] = "Ok";
        ReceivedCode["CHANGE_SCENE"] = "ChangeScene";
      })(ReceivedCode || (ReceivedCode = exports('ReceivedCode', {})));

      class TestFramework {
        constructor() {
          _defineProperty(this, "onmessage", null);

          _defineProperty(this, "_timeout", 5000);

          _defineProperty(this, "_client", null);

          _defineProperty(this, "_eventQueue", {});

          _defineProperty(this, "_msgId", 0);

          _defineProperty(this, "_timeoutTimer", 0);
        }

        static get instance() {
          if (!TestFramework._instance) {
            TestFramework._instance = new TestFramework();
          }

          return TestFramework._instance;
        }

        connect(address = '127.0.0.1', port = 8080, timeout = 5000, cb) {
          this._timeout = timeout;
          this._client = new Client(address, port);
          var timer = setTimeout(() => {
            this._client.close();

            cb(new Error('connect failed'));
          }, timeout);

          this._client.onopen = () => {
            this._client.onopen = null;
            clearTimeout(timer);
            cb(null);
          };

          this._client.onmessage = event => {
            let {
              id,
              state,
              message
            } = JSON.parse(event.data);
            let testEvent = this._eventQueue[id];
            delete this._eventQueue[id];

            if (testEvent) {
              testEvent.cb(state !== ReceivedCode.OK && state !== ReceivedCode.Pass ? new Error('Failed') : null, message);
            }

            this.onmessage && this.onmessage(state, message);
          };
        }

        startTest(message, cb) {
          this.postMessage(StateCode.START, '', message, cb);
        }

        postMessage(state, sceneName = '', message, cb) {
          let msgId = ++this._msgId;
          this._eventQueue[msgId] = {
            id: msgId,
            state,
            sceneName,
            message,
            cb,
            startTime: Date.now(),
            retry: 0
          };

          if (!this._timeoutTimer) {
            this._timeoutTimer = setInterval(() => {
              let now = Date.now();

              for (let id in this._eventQueue) {
                let event = this._eventQueue[id];

                if (now - event.startTime > this._timeout) {
                  delete this._eventQueue[id];
                  event.cb(new Error('connection disconected'));
                }
              }

              if (isEmptyObject(this._eventQueue)) {
                clearInterval(this._timeoutTimer);
                this._timeoutTimer = 0;
              }
            }, 200);
          }

          this._client.postMessage({
            id: msgId,
            state,
            sceneName,
            message,
            time: Date.now()
          });
        }

        endTest(message, cb) {
          this.postMessage(StateCode.END, '', message, cb);
        }

        disconnect() {
          this._client.close();
        }

      }

      exports('TestFramework', TestFramework);

      _defineProperty(TestFramework, "_instance", null);

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/test-atlas-config.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Label, _decorator, Component, assetManager, Texture2D, ImageAsset, SpriteAtlas;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Label = module.Label;
      _decorator = module._decorator;
      Component = module.Component;
      assetManager = module.assetManager;
      Texture2D = module.Texture2D;
      ImageAsset = module.ImageAsset;
      SpriteAtlas = module.SpriteAtlas;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _temp;

      cclegacy._RF.push({}, "1374d3rqdpHTp5bobdKEj/U", "test-atlas-config", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let Typescript = exports('Typescript', (_dec = ccclass('Typescript'), _dec2 = property({
        type: [Label]
      }), _dec3 = property({
        type: [Label]
      }), _dec4 = property({
        type: Label
      }), _dec(_class = (_class2 = (_temp = class Typescript extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "normal", _descriptor, this);

          _initializerDefineProperty(this, "config", _descriptor2, this);

          _initializerDefineProperty(this, "loadBundleLabel", _descriptor3, this);
        } // [2]
        // @property
        // serializableDummy = 0;


        start() {
          // [3]
          this.loadBundle();
        }

        loadBundle() {
          assetManager.loadBundle('test-atlas-build', (err, bundle) => {
            if (err) {
              this.loadBundleLabel.string = 'load bundle test-atlas-build failed!';
              return;
            }

            this.loadBundleLabel.string = 'load bundle success!';
            this.loadAssetTest('normal', bundle);
            this.loadAssetTest('config', bundle);
          });
        }

        loadAssetTest(folder, bundle) {
          const loadTexture = this[folder][0];
          const loadImage = this[folder][1];
          const loadSpriteAtlas = this[folder][2];
          bundle.load(`${folder}/1/texture`, Texture2D, (err, asset) => {
            if (err) {
              loadTexture.string = folder + ' load texture failed!';
              return;
            }

            loadTexture.string = folder + ' load texture sucess!';
          });
          bundle.load(`${folder}/2`, ImageAsset, (err, asset) => {
            if (err) {
              loadImage.string = folder + ' load image failed!???';
              return;
            }

            loadImage.string = folder + ' load image sucess!';
          });
          bundle.load(`${folder}/auto-atlas`, SpriteAtlas, (err, asset) => {
            if (err) {
              loadSpriteAtlas.string = folder + ' load spriteAtlas failed!';
              return;
            }

            loadSpriteAtlas.string = folder + ' load spriteAtlas sucess!';
          });
        } // update (deltaTime: number) {
        //     // [4]
        // }


      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "normal", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "config", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "loadBundleLabel", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      })), _class2)) || _class));
      /**
       * [1] Class member could be defined like this.
       * [2] Use `property` decorator if your want the member to be serializable.
       * [3] Your initialization goes here.
       * [4] Your update function goes here.
       *
       * Learn more about scripting: https://docs.cocos.com/creator/3.0/manual/en/scripting/
       * Learn more about CCClass: https://docs.cocos.com/creator/3.0/manual/en/scripting/ccclass.html
       * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.0/manual/en/scripting/life-cycle-callbacks.html
       */

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/asset-bundle-zip.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, _defineProperty, cclegacy, Label, Node, _decorator, Component, assetManager, log, Texture2D, Sprite, SpriteFrame, AudioClip, AudioSource, director;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Label = module.Label;
      Node = module.Node;
      _decorator = module._decorator;
      Component = module.Component;
      assetManager = module.assetManager;
      log = module.log;
      Texture2D = module.Texture2D;
      Sprite = module.Sprite;
      SpriteFrame = module.SpriteFrame;
      AudioClip = module.AudioClip;
      AudioSource = module.AudioSource;
      director = module.director;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _temp;

      cclegacy._RF.push({}, "14a26xCrOlOiZGaqGY0Vbto", "asset-bundle-zip", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let AssetBundleZip = exports('AssetBundleZip', (_dec = ccclass('AssetBundleZip'), _dec2 = property(Label), _dec3 = property(Node), _dec4 = property({
        type: [Label]
      }), _dec(_class = (_class2 = (_temp = class AssetBundleZip extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "loadTips", _descriptor, this);

          _initializerDefineProperty(this, "showWindow", _descriptor2, this);

          _initializerDefineProperty(this, "labels", _descriptor3, this);

          _defineProperty(this, "_audioSource", null);

          _defineProperty(this, "_isLoading", false);
        } // LIFE-CYCLE CALLBACKS:


        onLoad() {
          var testBundle = assetManager.getBundle('TestBundleZip');

          if (testBundle) {
            this.labels[0].string = "?????????";
          }
        }

        onClickBundle() {
          var testBundle = assetManager.getBundle('TestBundleZip');

          if (testBundle || this._isLoading) {
            return;
          }

          this._onClear();

          this._isLoading = true;
          this.loadTips.string = "Bundle Loading....";
          assetManager.loadBundle('TestBundleZip', err => {
            if (err) {
              log('Error url [' + err + ']');
              return;
            }

            this._isLoading = false;
            this.loadTips.string = "Bundle loaded Successfully!";
            this.labels[0].string = "?????????";
          });
        }

        onClickTexture() {
          if (this._isLoading) return;
          var testBundle = assetManager.getBundle('TestBundleZip');

          if (!testBundle) {
            this.loadTips.string = "??????????????????????????? Asset Bundle";
            return;
          }

          this._onClear();

          this._isLoading = true;
          this.loadTips.string = "Texture Loading....";
          testBundle.load("content/texture", Texture2D, (err, asset) => {
            if (err) {
              log('Error url [' + err + ']');
              return;
            }

            this._isLoading = false;
            this.loadTips.string = "";
            var node = new Node("New Node");
            node.setPosition(0, 0);
            let component = node.addComponent(Sprite);
            const sp = new SpriteFrame();
            sp.texture = asset;
            component.spriteFrame = sp;
            this.labels[1].string = "?????????";
            this.showWindow.addChild(node);
          });
        }

        onClickAudio() {
          if (this._isLoading) return;
          var testBundle = assetManager.getBundle('TestBundleZip');

          if (!testBundle) {
            this.loadTips.string = "??????????????????????????? Asset Bundle";
            return;
          }

          this._onClear();

          this._isLoading = true;
          this.loadTips.string = "Audio Loading....";
          testBundle.load("audio", AudioClip, (err, asset) => {
            if (err) {
              log('Error url [' + err + ']');
              return;
            }

            this._isLoading = false;
            this.loadTips.string = "";
            var node = new Node("New Node");
            node.setPosition(0, 0);
            let component = node.addComponent(AudioSource);
            component.clip = asset;
            component.play();
            this._audioSource = component;
            this.loadTips.string = "????????????";
            this.labels[2].string = "?????????";
            this.showWindow.addChild(node);
          });
        }

        onClickScene() {
          if (this._isLoading) return;
          var testBundle = assetManager.getBundle('TestBundleZip');

          if (!testBundle) {
            this.loadTips.string = "??????????????????????????? Asset Bundle";
            return;
          }

          this._onClear();

          this._isLoading = true;
          this.loadTips.string = "Scene Loading....";
          testBundle.loadScene("sub-scene", (err, asset) => {
            if (err) {
              log('Error url [' + err + ']');
              return;
            }

            this._isLoading = false;
            this.loadTips.string = "";
            director.runScene(asset);
          });
        }

        onClickDestroy() {
          if (this._isLoading) return;
          var testBundle = assetManager.getBundle('TestBundleZip');

          if (!testBundle) {
            this.loadTips.string = "??????????????????????????? Asset Bundle";
            return;
          }

          this._onClear();

          assetManager.removeBundle(testBundle);
          this.loadTips.string = "??????????????????";
          this.labels[0].string = "?????? Asset Bundle";
          this.labels[1].string = "?????? Texture";
          this.labels[2].string = "?????? Audio";
          this.labels[3].string = "?????? Scene";
        }

        onClickRelease() {
          if (this._isLoading) return;
          var testBundle = assetManager.getBundle('TestBundleZip');

          if (!testBundle) {
            this.loadTips.string = "??????????????????????????? Asset Bundle";
            return;
          }

          this._onClear();

          testBundle.releaseAll();
          this.loadTips.string = "??????????????????";
          this.labels[1].string = "?????? Texture";
          this.labels[2].string = "?????? Audio";
          this.labels[3].string = "?????? Scene";
        }

        _onClear() {
          this.showWindow.removeAllChildren();

          if (this._audioSource && this._audioSource instanceof AudioSource) {
            this._audioSource.stop();
          }
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "loadTips", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "showWindow", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "labels", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/ModelTest.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, _defineProperty, cclegacy, Node, Prefab, _decorator, Component, Label, instantiate, Layers, UIMeshRenderer;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      Prefab = module.Prefab;
      _decorator = module._decorator;
      Component = module.Component;
      Label = module.Label;
      instantiate = module.instantiate;
      Layers = module.Layers;
      UIMeshRenderer = module.UIMeshRenderer;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _temp;

      cclegacy._RF.push({}, "15859qFB2VKHqSh4HAQ+N0S", "ModelTest", undefined);

      const {
        ccclass,
        property,
        menu
      } = _decorator;
      let ModelTest = exports('ModelTest', (_dec = ccclass("ModelTest"), _dec2 = menu('UI/ModelTest'), _dec3 = property({
        type: Node
      }), _dec4 = property({
        type: Prefab
      }), _dec(_class = _dec2(_class = (_class2 = (_temp = class ModelTest extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "mount", _descriptor, this);

          _initializerDefineProperty(this, "prefab", _descriptor2, this);

          _defineProperty(this, "_meshMounted", false);

          _defineProperty(this, "_buttonLabel", null);
        }

        start() {
          // Your initialization goes here.
          this._buttonLabel = this.node.children[0].getComponent(Label);
        } // update (deltaTime: number) {
        //     // Your update function goes here.
        // }


        onClick() {
          if (this._meshMounted) {
            const c = this.mount.children[0];
            c.removeFromParent();
            c.destroy();
            this._buttonLabel.string = 'Add';
            this._meshMounted = false;
          } else {
            const c = instantiate(this.prefab);
            c.layer = Layers.Enum.UI_2D;
            c.setScale(100, 100, 100);
            this.mount.addChild(c);
            c.addComponent(UIMeshRenderer);
            this._buttonLabel.string = 'Remove';
            this._meshMounted = true;
          }
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "mount", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "prefab", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/DragonBonesCollider.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _defineProperty, cclegacy, _decorator, Component, PhysicsSystem2D, Contact2DType, EPhysics2DDrawFlags, Sprite, Color;

  return {
    setters: [function (module) {
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Component = module.Component;
      PhysicsSystem2D = module.PhysicsSystem2D;
      Contact2DType = module.Contact2DType;
      EPhysics2DDrawFlags = module.EPhysics2DDrawFlags;
      Sprite = module.Sprite;
      Color = module.Color;
    }],
    execute: function () {
      var _dec, _class, _temp;

      cclegacy._RF.push({}, "18a59OM3shCs5K8L9hCo3rK", "DragonBonesCollider", undefined);

      const {
        ccclass
      } = _decorator;
      let DragonBonesCollider = exports('DragonBonesCollider', (_dec = ccclass('DragonBonesCollider'), _dec(_class = (_temp = class DragonBonesCollider extends Component {
        constructor(...args) {
          super(...args);

          _defineProperty(this, "touchingCountMap", new Map());

          _defineProperty(this, "debugDrawFlags", 0);
        }

        start() {
          // Your initialization goes here.
          PhysicsSystem2D.instance.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
          PhysicsSystem2D.instance.on(Contact2DType.END_CONTACT, this.onEndContact, this);
          this.debugDrawFlags = PhysicsSystem2D.instance.debugDrawFlags;
        }

        onEnable() {
          PhysicsSystem2D.instance.debugDrawFlags = this.debugDrawFlags | EPhysics2DDrawFlags.Shape;
        }

        onDisable() {
          PhysicsSystem2D.instance.debugDrawFlags = this.debugDrawFlags;
        }

        addContact(c) {
          let count = this.touchingCountMap.get(c.node) || 0;
          this.touchingCountMap.set(c.node, ++count);
          let sprite = c.getComponent(Sprite);

          if (sprite) {
            sprite.color = Color.RED;
          }
        }

        removeContact(c) {
          let count = this.touchingCountMap.get(c.node) || 0;
          --count;

          if (count <= 0) {
            this.touchingCountMap.delete(c.node);
            let sprite = c.getComponent(Sprite);

            if (sprite) {
              sprite.color = Color.WHITE;
            }
          } else {
            this.touchingCountMap.set(c.node, count);
          }
        }

        onBeginContact(a, b) {
          this.addContact(a);
          this.addContact(b);
        }

        onEndContact(a, b) {
          this.removeContact(a);
          this.removeContact(b);
        }

      }, _temp)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/page-view-ctrl.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _defineProperty, _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Prefab, PageView, Label, _decorator, Component, instantiate, Vec3, Color, Sprite;

  return {
    setters: [function (module) {
      _defineProperty = module.defineProperty;
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Prefab = module.Prefab;
      PageView = module.PageView;
      Label = module.Label;
      _decorator = module._decorator;
      Component = module.Component;
      instantiate = module.instantiate;
      Vec3 = module.Vec3;
      Color = module.Color;
      Sprite = module.Sprite;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _class3, _temp;

      cclegacy._RF.push({}, "18f1cBj+JdJfr9Z5uh3wi34", "page-view-ctrl", undefined);

      const {
        ccclass,
        property,
        menu
      } = _decorator;
      let PageViewCtrl = exports('PageViewCtrl', (_dec = ccclass("PageViewCtrl"), _dec2 = menu('UI/PageViewCtrl'), _dec3 = property(Prefab), _dec4 = property(PageView), _dec5 = property(Label), _dec6 = property({
        type: PageView.Direction
      }), _dec(_class = _dec2(_class = (_class2 = (_temp = _class3 = class PageViewCtrl extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "curNum", _descriptor, this);

          _initializerDefineProperty(this, "curTotal", _descriptor2, this);

          _initializerDefineProperty(this, "pageTeample", _descriptor3, this);

          _initializerDefineProperty(this, "target", _descriptor4, this);

          _initializerDefineProperty(this, "label", _descriptor5, this);

          _initializerDefineProperty(this, "direction", _descriptor6, this);
        }

        _createPage() {
          const page = instantiate(this.pageTeample);
          page.name = `page_${this.curNum}`;
          page.setPosition(new Vec3());
          const color = new Color();
          color.r = Math.floor(Math.random() * 255);
          color.g = Math.floor(Math.random() * 255);
          color.b = Math.floor(Math.random() * 255);
          const comp = page.getComponent(Sprite);
          comp.color = color;
          return page;
        }

        onLoad() {
          // ???????????????????????? 1
          this.target.setCurrentPageIndex(0);
        }

        update() {
          // ??????????????????
          const extra = this.direction === PageView.Direction.Vertical ? '\n' : '';
          this.label.string = `???${extra}` + (this.target.getCurrentPageIndex() + 1) + `${extra}???`;
        } // ????????????


        onJumpHome() {
          // ??????????????????????????????????????????????????? 0.3 ???
          this.target.scrollToPage(0);
        } // ????????????


        plusPage(callback) {
          if (this.curNum >= this.curTotal) {
            return;
          }

          this.curNum++;

          if (callback) {
            callback();
          }
        } // ????????????


        lessPageNum(callback) {
          if (this.curNum <= 0) {
            return;
          }

          this.curNum--;

          if (callback) {
            callback();
          }
        } // ????????????


        onAddPage() {
          this.plusPage(() => {
            this.target.addPage(this._createPage());
          });
        } // ??????????????????


        onInsertPage() {
          this.plusPage(() => {
            this.target.insertPage(this._createPage(), this.target.getCurrentPageIndex());
          });
        } // ????????????????????????


        onRemovePage() {
          this.lessPageNum(() => {
            var pages = this.target.getPages();
            this.target.removePage(pages[pages.length - 1]);

            if (this.curNum === 0) {
              this.onAddPage();
            }
          });
        } // ??????????????????


        onRemovePageAtIndex() {
          this.lessPageNum(() => {
            this.target.removePageAtIndex(this.target.getCurrentPageIndex());

            if (this.curNum === 0) {
              this.onAddPage();
            }
          });
        } // ??????????????????


        onRemoveAllPage() {
          this.target.removeAllPages();
          this.curNum = 0;
          this.onAddPage();
        } // ????????????


        onPageEvent(sender, eventType) {
          // // ????????????
          // if (eventType !== PageView.EventType.PAGE_TURNING) {
          //     return;
          // }
          console.log("???????????????????????????:" + sender.getCurrentPageIndex());
        }

      }, _defineProperty(_class3, "Direction", PageView.Direction), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "curNum", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 3;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "curTotal", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 10;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "pageTeample", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "target", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "label", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "direction", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return PageView.Direction.Horizontal;
        }
      })), _class2)) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/particle-normal.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, _defineProperty, cclegacy, Prefab, _decorator, Component, instantiate;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Prefab = module.Prefab;
      _decorator = module._decorator;
      Component = module.Component;
      instantiate = module.instantiate;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor, _temp;

      cclegacy._RF.push({}, "198732t5gxBkreDnzUqpqKP", "particle-normal", undefined);

      const {
        ccclass,
        type
      } = _decorator;
      let ParticleControl = exports('ParticleControl', (_dec = ccclass('ParticleControl'), _dec2 = type(Prefab), _dec(_class = (_class2 = (_temp = class ParticleControl extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "spritePrefab", _descriptor, this);

          _defineProperty(this, "totalNum", 20);
        }

        start() {
          this.schedule(this.addParticle, 1);
        }

        addParticle() {
          if (this.totalNum > 0) {
            const particle = instantiate(this.spritePrefab);
            particle.parent = this.node;
            particle.setPosition(Math.random() * 200, Math.random() * 200);
            this.totalNum--;
          }
        }

      }, _temp), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "spritePrefab", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/graphics-line-join.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _defineProperty, cclegacy, Graphics, _decorator, Component;

  return {
    setters: [function (module) {
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Graphics = module.Graphics;
      _decorator = module._decorator;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _class, _temp;

      cclegacy._RF.push({}, "1c5e8plAmhLNI/zRXjnw0+i", "graphics-line-join", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      const LineCap = Graphics.LineCap;
      const LineJoin = Graphics.LineJoin;
      let GraphicsLineJoin = exports('GraphicsLineJoin', (_dec = ccclass('GraphicsLineJoin'), _dec(_class = (_temp = class GraphicsLineJoin extends Component {
        constructor(...args) {
          super(...args);

          _defineProperty(this, "graphics", null);

          _defineProperty(this, "time", 0);

          _defineProperty(this, "radius", 100);
        }

        start() {
          // Your initialization goes here.
          this.graphics = this.getComponent(Graphics);
          this.graphics.lineWidth = 20;
          this.draw();
        }

        draw() {
          let graphics = this.graphics;
          graphics.clear();
          let rx = this.radius * Math.sin(this.time);
          let ry = -this.radius * Math.cos(this.time); // line join

          graphics.lineCap = LineCap.BUTT;
          graphics.lineJoin = LineJoin.BEVEL;
          this.drawLine(-200, 0, rx, ry);
          graphics.lineJoin = LineJoin.MITER;
          this.drawLine(0, 0, rx, ry);
          graphics.lineJoin = LineJoin.ROUND;
          this.drawLine(200, 0, rx, ry); // line cap

          graphics.lineJoin = LineJoin.MITER;
          graphics.lineCap = LineCap.BUTT;
          this.drawLine(0, -125, rx, ry);
          graphics.lineCap = LineCap.SQUARE;
          this.drawLine(-200, -125, rx, ry);
          graphics.lineCap = LineCap.ROUND;
          this.drawLine(200, -125, rx, ry);
        }

        drawLine(x, y, rx, ry) {
          let graphics = this.graphics;
          graphics.moveTo(x + rx, y + ry);
          graphics.lineTo(x, y);
          graphics.lineTo(x - rx, y + ry);
          graphics.stroke();
        }

        update(dt) {
          this.time += dt * 0.5;
          this.draw();
        }

      }, _temp)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/graphics-draw-before-init.ts", ['cc'], function (exports) {
  'use strict';

  var cclegacy, Component, Node, Graphics, _decorator;

  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Component = module.Component;
      Node = module.Node;
      Graphics = module.Graphics;
      _decorator = module._decorator;
    }],
    execute: function () {
      var _dec, _class;

      cclegacy._RF.push({}, "1d492ntcNpHzpqOcIZLVpin", "graphics-draw-before-init", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let GraphicsDrawBeforeInit = exports('GraphicsDrawBeforeInit', (_dec = ccclass('GraphicsDrawBeforeInit'), _dec(_class = class GraphicsDrawBeforeInit extends Component {
        start() {
          const node = new Node('graphics');
          const g = node.addComponent(Graphics);
          g.clear();
          g.lineWidth = 10;
          g.fillColor.fromHEX('#ff0000'); // rect

          g.rect(-250, 0, 200, 100); // round rect

          g.roundRect(50, 0, 200, 100, 20);
          g.stroke();
          g.fill();
          node.parent = this.node;
        }

      }) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/render-texture-sample.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, RenderTexture, MeshRenderer, _decorator, Component;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      RenderTexture = module.RenderTexture;
      MeshRenderer = module.MeshRenderer;
      _decorator = module._decorator;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _temp;

      cclegacy._RF.push({}, "1e122FIcbpHJqcxfbNqM2IS", "render-texture-sample", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      /**
       * Predefined variables
       * Name = RenderTextureSample
       * DateTime = Fri Sep 17 2021 17:52:49 GMT+0800 (??????????????????)
       * Author = EndEvil
       * FileBasename = render-texture-sample.ts
       * FileBasenameNoExtension = render-texture-sample
       * URL = db://assets/cases/render-texture-sample/render-texture-sample.ts
       * ManualUrl = https://docs.cocos.com/creator/3.4/manual/en/
       *
       */

      let RenderTextureSample = exports('RenderTextureSample', (_dec = ccclass('RenderTextureSample'), _dec2 = property(RenderTexture), _dec3 = property(RenderTexture), _dec4 = property(MeshRenderer), _dec5 = property(MeshRenderer), _dec(_class = (_class2 = (_temp = class RenderTextureSample extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "renderTexture1", _descriptor, this);

          _initializerDefineProperty(this, "renderTexture2", _descriptor2, this);

          _initializerDefineProperty(this, "meshRenderer1", _descriptor3, this);

          _initializerDefineProperty(this, "meshRenderer2", _descriptor4, this);
        }

        start() {
          this.renderTexture1.setWrapMode(RenderTexture.WrapMode.CLAMP_TO_EDGE, RenderTexture.WrapMode.CLAMP_TO_EDGE);
          this.meshRenderer1.getMaterial(0).setProperty('mainTexture', this.renderTexture1);
          this.meshRenderer2.getMaterial(0).setProperty('mainTexture', this.renderTexture2);
        } // update (deltaTime: number) {
        //     // [4]
        // }


      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "renderTexture1", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "renderTexture2", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "meshRenderer1", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "meshRenderer2", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));
      /**
       * [1] Class member could be defined like this.
       * [2] Use `property` decorator if your want the member to be serializable.
       * [3] Your initialization goes here.
       * [4] Your update function goes here.
       *
       * Learn more about scripting: https://docs.cocos.com/creator/3.4/manual/en/scripting/
       * Learn more about CCClass: https://docs.cocos.com/creator/3.4/manual/en/scripting/ccclass.html
       * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.4/manual/en/scripting/life-cycle-callbacks.html
       */

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/DragonBonesMode.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Material, dragonBones, Label, _decorator, Component;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Material = module.Material;
      dragonBones = module.dragonBones;
      Label = module.Label;
      _decorator = module._decorator;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _temp;

      cclegacy._RF.push({}, "1ec8fGOAJdGnKarDJTeyxnS", "DragonBonesMode", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let DragonBonesMode = exports('DragonBonesMode', (_dec = ccclass('DragonBonesMode'), _dec2 = property({
        type: Material
      }), _dec3 = property({
        type: Material
      }), _dec4 = property({
        type: dragonBones.ArmatureDisplay
      }), _dec5 = property({
        type: dragonBones.ArmatureDisplay
      }), _dec6 = property({
        type: dragonBones.ArmatureDisplay
      }), _dec7 = property({
        type: Label
      }), _dec8 = property({
        type: Label
      }), _dec9 = property({
        type: Label
      }), _dec(_class = (_class2 = (_temp = class DragonBonesMode extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "grayMaterial", _descriptor, this);

          _initializerDefineProperty(this, "normalMaterial", _descriptor2, this);

          _initializerDefineProperty(this, "db0", _descriptor3, this);

          _initializerDefineProperty(this, "db1", _descriptor4, this);

          _initializerDefineProperty(this, "db2", _descriptor5, this);

          _initializerDefineProperty(this, "batchLabel", _descriptor6, this);

          _initializerDefineProperty(this, "cacheLabel", _descriptor7, this);

          _initializerDefineProperty(this, "matLabel", _descriptor8, this);

          _initializerDefineProperty(this, "isGray", _descriptor9, this);

          _initializerDefineProperty(this, "isBatch", _descriptor10, this);

          _initializerDefineProperty(this, "isCache", _descriptor11, this);
        }

        onGray() {
          this.isGray = !this.isGray;
          let label = "gray";
          if (this.isGray) label = "normal";
          this.matLabel.string = label;
          let material = this.grayMaterial;

          if (!this.isGray) {
            material = this.normalMaterial;
          }

          this.db0.setMaterial(material, 0);
          this.db0.markForUpdateRenderData(true);
          this.db1.setMaterial(material, 0);
          this.db1.markForUpdateRenderData(true);
          this.db2.setMaterial(material, 0);
          this.db2.markForUpdateRenderData();
        }

        onBatch() {
          this.isBatch = !this.isBatch;
          let label = "batch";
          if (this.isBatch) label = "no batch";
          this.batchLabel.string = label; // this.db0!.enableBatch = this.isBatch;
          // this.db1!.enableBatch = this.isBatch;
          // this.db2!.enableBatch = this.isBatch;
        }

        onCache() {
          this.isCache = !this.isCache;
          let label = "cache";
          if (this.isCache) label = "no cache";
          this.cacheLabel.string = label;
          let mode = dragonBones.ArmatureDisplay.AnimationCacheMode.SHARED_CACHE;
          if (!this.isCache) mode = dragonBones.ArmatureDisplay.AnimationCacheMode.REALTIME;
          this.db0.setAnimationCacheMode(mode);
          this.db1.setAnimationCacheMode(mode);
          this.db2.setAnimationCacheMode(mode);
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "grayMaterial", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "normalMaterial", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "db0", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "db1", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "db2", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "batchLabel", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "cacheLabel", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "matLabel", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "isGray", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "isBatch", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "isCache", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/SpineAttach.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, _defineProperty, cclegacy, sp, Node, Label, Button, _decorator, Component;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      sp = module.sp;
      Node = module.Node;
      Label = module.Label;
      Button = module.Button;
      _decorator = module._decorator;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _class2, _class3, _descriptor, _descriptor2, _descriptor3, _descriptor4, _temp;

      cclegacy._RF.push({}, "1f4fb/2fX9O26fHciliNUu8", "SpineAttach", undefined);

      const {
        ccclass,
        property
      } = _decorator;

      let _class = exports('default', (_dec = ccclass('SpineAttach'), _dec2 = property({
        type: sp.Skeleton
      }), _dec3 = property({
        type: Node
      }), _dec4 = property({
        type: Label
      }), _dec5 = property({
        type: Button
      }), _dec(_class2 = (_class3 = (_temp = class _class3 extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "skeleton", _descriptor, this);

          _initializerDefineProperty(this, "attachNode", _descriptor2, this);

          _initializerDefineProperty(this, "modeLabel", _descriptor3, this);

          _initializerDefineProperty(this, "attachBtn", _descriptor4, this);

          _defineProperty(this, "backSockets", null);
        }

        onLoad() {
          var socket = new sp.SpineSocket("root/hip/tail1/tail2/tail3/tail4/tail5/tail6/tail7/tail8/tail9/tail10", this.attachNode);
          this.skeleton.sockets.push(socket);
          this.skeleton.sockets = this.skeleton.sockets;
        }

        changeAttach() {
          if (!this.backSockets) {
            this.backSockets = this.skeleton.sockets;
            this.skeleton.sockets = [];
          } else {
            this.skeleton.sockets = this.backSockets;
            this.backSockets = null;
          }
        }

        changeMode() {
          let isCached = this.skeleton.isAnimationCached();

          if (isCached) {
            this.skeleton.setAnimationCacheMode(sp.Skeleton.AnimationCacheMode.REALTIME);
            this.modeLabel.string = "realtime";
            this.attachBtn.interactable = true;
          } else {
            this.skeleton.setAnimationCacheMode(sp.Skeleton.AnimationCacheMode.SHARED_CACHE);
            this.modeLabel.string = "cache";
            this.attachBtn.interactable = false;
          }
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class3.prototype, "skeleton", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class3.prototype, "attachNode", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class3.prototype, "modeLabel", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class3.prototype, "attachBtn", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class3)) || _class2));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/pause.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _defineProperty, cclegacy, _decorator, Component, Vec3;

  return {
    setters: [function (module) {
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Component = module.Component;
      Vec3 = module.Vec3;
    }],
    execute: function () {
      var _dec, _class, _temp;

      cclegacy._RF.push({}, "20eccyukcdKQoxfRMYT7lCm", "pause", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let newScript = exports('newScript', (_dec = ccclass("newScript"), _dec(_class = (_temp = class newScript extends Component {
        constructor(...args) {
          super(...args);

          _defineProperty(this, "timer", false);

          _defineProperty(this, "_y", 0);
        }

        start() {
          this._y = this.node.position.y;
        }

        update(deltaTime) {
          this.node.position = new Vec3(this.node.position.x, this._y, this.node.position.z);

          if (this._y <= 0) {
            this.timer = true;
          }

          if (this._y >= 2) {
            this.timer = false;
          }

          if (deltaTime > 1) {
            // hack for first frame
            deltaTime = 1;
          }

          if (this.timer) {
            this._y += 1 * deltaTime;
          }

          if (this.timer == false) {
            this._y -= 1 * deltaTime;
          }
        }

      }, _temp)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/motion-streak-ctrl.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, _defineProperty, cclegacy, MotionStreak, Texture2D, Animation, _decorator, Component;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      MotionStreak = module.MotionStreak;
      Texture2D = module.Texture2D;
      Animation = module.Animation;
      _decorator = module._decorator;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _temp;

      cclegacy._RF.push({}, "22ac1BM7stAG4GBDo0Vwp7q", "motion-streak-ctrl", undefined);

      const {
        ccclass,
        type
      } = _decorator;
      let MotionStreakCtrl = exports('MotionStreakCtrl', (_dec = ccclass('MotionStreakCtrl'), _dec2 = type(MotionStreak), _dec3 = type(Texture2D), _dec4 = type(Animation), _dec(_class = (_class2 = (_temp = class MotionStreakCtrl extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "motionStreak", _descriptor, this);

          _initializerDefineProperty(this, "newTexture", _descriptor2, this);

          _initializerDefineProperty(this, "animationCom", _descriptor3, this);

          _defineProperty(this, "_changed", true);

          _defineProperty(this, "_oldTexture", null);
        }

        onLoad() {
          this._changed = true;
          this._oldTexture = this.motionStreak.texture;
        }

        onClick() {
          if (this._changed) {
            this.setMotionStreak(2, 3, 20, this.newTexture);
          } else {
            this.setMotionStreak(0.5, 1, 30, this._oldTexture);
          }

          this._changed = !this._changed;
        }

        setMotionStreak(fadeTime, minSeg, stroke, texture) {
          this.motionStreak.fadeTime = fadeTime;
          this.motionStreak.minSeg = minSeg;
          this.motionStreak.stroke = stroke;
          this.motionStreak.texture = texture;
        }

        lateUpdate() {
          if (!this.animationCom.getState('move_around').isPlaying) {
            this.animationCom.play();
          }
        }

        onDisable() {
          this.animationCom.stop();
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "motionStreak", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "newTexture", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "animationCom", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/DragonBonesCtrl.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _defineProperty, _initializerDefineProperty, cclegacy, dragonBones, Node, _decorator, macro, director, Component, Vec3, SystemEventType, systemEvent, KeyCode;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _defineProperty = module.defineProperty;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      dragonBones = module.dragonBones;
      Node = module.Node;
      _decorator = module._decorator;
      macro = module.macro;
      director = module.director;
      Component = module.Component;
      Vec3 = module.Vec3;
      SystemEventType = module.SystemEventType;
      systemEvent = module.systemEvent;
      KeyCode = module.KeyCode;
    }],
    execute: function () {
      var _dec, _class, _temp, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _class3, _class4, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _temp2;

      cclegacy._RF.push({}, "2323bz+GgZJZ5mpHSfuf3kv", "DragonBonesCtrl", undefined);

      const {
        ccclass,
        property,
        requireComponent
      } = _decorator;
      var NORMAL_ANIMATION_GROUP = "normal";
      var AIM_ANIMATION_GROUP = "aim";
      var ATTACK_ANIMATION_GROUP = "attack";
      var JUMP_SPEED = -20;
      var NORMALIZE_MOVE_SPEED = 3.6;
      var MAX_MOVE_SPEED_FRONT = NORMALIZE_MOVE_SPEED * 1.4;
      var MAX_MOVE_SPEED_BACK = NORMALIZE_MOVE_SPEED * 1.0;
      var WEAPON_R_LIST = ["weapon_1502b_r", "weapon_1005", "weapon_1005b", "weapon_1005c", "weapon_1005d", "weapon_1005e"];
      var WEAPON_L_LIST = ["weapon_1502b_l", "weapon_1005", "weapon_1005b", "weapon_1005c", "weapon_1005d"];
      var SKINS = ["mecha_1502b", "skin_a", "skin_b", "skin_c"];
      var GROUND = -200;
      var G = -0.6;
      let DragonBonesCtrl = exports('default', (_dec2 = ccclass('DragonBonesCtrl'), _dec3 = requireComponent(dragonBones.ArmatureDisplay), _dec4 = property({
        type: Node
      }), _dec5 = property({
        type: Node
      }), _dec6 = property({
        type: Node
      }), _dec7 = property({
        type: Node
      }), _dec8 = property({
        type: Node
      }), _dec9 = property({
        type: dragonBones.ArmatureDisplay
      }), _dec10 = property({
        type: dragonBones.ArmatureDisplay
      }), _dec2(_class3 = _dec3(_class3 = (_class4 = (_temp2 = class DragonBonesCtrl extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "touchHandler", _descriptor, this);

          _initializerDefineProperty(this, "upButton", _descriptor2, this);

          _initializerDefineProperty(this, "downButton", _descriptor3, this);

          _initializerDefineProperty(this, "leftButton", _descriptor4, this);

          _initializerDefineProperty(this, "rightButton", _descriptor5, this);

          _initializerDefineProperty(this, "weaponArmature", _descriptor6, this);

          _initializerDefineProperty(this, "skinArmature", _descriptor7, this);

          _defineProperty(this, "_bullets", []);

          _defineProperty(this, "_left", false);

          _defineProperty(this, "_right", false);

          _defineProperty(this, "_isJumpingA", false);

          _defineProperty(this, "_isJumpingB", false);

          _defineProperty(this, "_isSquating", false);

          _defineProperty(this, "_isAttackingA", false);

          _defineProperty(this, "_isAttackingB", false);

          _defineProperty(this, "_weaponRIndex", 0);

          _defineProperty(this, "_weaponLIndex", 0);

          _defineProperty(this, "_skinIndex", 0);

          _defineProperty(this, "_faceDir", 1);

          _defineProperty(this, "_aimDir", 0);

          _defineProperty(this, "_moveDir", 0);

          _defineProperty(this, "_aimRadian", 0);

          _defineProperty(this, "_speedX", 0);

          _defineProperty(this, "_speedY", 0);

          _defineProperty(this, "_armature", null);

          _defineProperty(this, "_armatureDisplay", null);

          _defineProperty(this, "_weaponR", null);

          _defineProperty(this, "_weaponL", null);

          _defineProperty(this, "_aimState", null);

          _defineProperty(this, "_walkState", null);

          _defineProperty(this, "_attackState", null);

          _defineProperty(this, "_target", new Vec3(0, 0, 0));

          _defineProperty(this, "_mouseDown_", false);
        } // use this for initialization


        onLoad() {
          this._armatureDisplay = this.getComponent(dragonBones.ArmatureDisplay);
          this._armature = this._armatureDisplay.armature();

          this._armatureDisplay.addEventListener(dragonBones.EventObject.FADE_IN_COMPLETE, this._animationEventHandler, this);

          this._armatureDisplay.addEventListener(dragonBones.EventObject.FADE_OUT_COMPLETE, this._animationEventHandler, this);

          this._armatureDisplay.addEventListener(dragonBones.EventObject.COMPLETE, this._animationEventHandler, this);

          this._weaponR = this._armature.getSlot('weapon_r').childArmature;
          this._weaponL = this._armature.getSlot('weapon_l').childArmature;

          this._weaponR.addEventListener(dragonBones.EventObject.FRAME_EVENT, this._frameEventHandler, this);

          this._weaponL.addEventListener(dragonBones.EventObject.FRAME_EVENT, this._frameEventHandler, this); // load all skin data


          for (let i = 1; i < SKINS.length; i++) {
            this.skinArmature.armatureName = SKINS[i];
          }

          for (let i = 1; i < WEAPON_R_LIST.length; i++) {
            this.weaponArmature.armatureName = WEAPON_R_LIST[i];
          }

          this._updateAnimation();

          if (this.touchHandler) {
            // touch event
            this.touchHandler.on(SystemEventType.TOUCH_START, event => {
              this._mouseDown_ = true;
              var touchLoc = event.getUILocation();
              this.aim(touchLoc.x, touchLoc.y);
              this.attack(true);
            }, this);
            this.touchHandler.on(SystemEventType.TOUCH_END, event => {
              this._mouseDown_ = false;
              this.attack(false);
            }, this);
            this.touchHandler.on(SystemEventType.TOUCH_MOVE, event => {
              var touchLoc = event.getUILocation();
              this.aim(touchLoc.x, touchLoc.y);
            }, this);
          }

          if (this.upButton) {
            this.upButton.on(SystemEventType.TOUCH_START, event => {
              this.jump();
            }, this);
          }

          if (this.downButton) {
            this.downButton.on(SystemEventType.TOUCH_START, event => {
              this.squat(true);
            }, this);
            this.downButton.on(SystemEventType.TOUCH_END, event => {
              this.squat(false);
            }, this);
            this.downButton.on(SystemEventType.TOUCH_CANCEL, event => {
              this.squat(false);
            }, this);
          }

          if (this.leftButton) {
            this.leftButton.on(SystemEventType.TOUCH_START, event => {
              this._left = true;

              this._updateMove(-1);
            }, this);
            this.leftButton.on(SystemEventType.TOUCH_END, event => {
              this._left = false;

              this._updateMove(-1);
            }, this);
            this.leftButton.on(SystemEventType.TOUCH_CANCEL, event => {
              this._left = false;

              this._updateMove(-1);
            }, this);
          }

          if (this.rightButton) {
            this.rightButton.on(SystemEventType.TOUCH_START, event => {
              this._right = true;

              this._updateMove(1);
            }, this);
            this.rightButton.on(SystemEventType.TOUCH_END, event => {
              this._right = false;

              this._updateMove(1);
            }, this);
            this.rightButton.on(SystemEventType.TOUCH_CANCEL, event => {
              this._right = false;

              this._updateMove(1);
            }, this);
          } // keyboard events


          systemEvent.on(SystemEventType.KEY_DOWN, event => {
            this._keyHandler(event.keyCode, true);
          }, this);
          systemEvent.on(SystemEventType.KEY_UP, event => {
            this._keyHandler(event.keyCode, false);
          }, this);
        }

        _keyHandler(keyCode, isDown) {
          switch (keyCode) {
            case KeyCode.KEY_A:
            case KeyCode.ARROW_LEFT:
              this._left = isDown;

              this._updateMove(-1);

              break;

            case KeyCode.KEY_D:
            case KeyCode.ARROW_RIGHT:
              this._right = isDown;

              this._updateMove(1);

              break;

            case KeyCode.KEY_W:
            case KeyCode.ARROW_UP:
              if (isDown) {
                this.jump();
              }

              break;

            case KeyCode.KEY_S:
            case KeyCode.ARROW_DOWN:
              this.squat(isDown);
              break;

            case KeyCode.KEY_Q:
              if (isDown) {
                this.switchWeaponR();
              }

              break;

            case KeyCode.KEY_E:
              if (isDown) {
                this.switchWeaponL();
              }

              break;

            case KeyCode.SPACE:
              if (isDown) {
                this.switchWeaponR();
                this.switchWeaponL();
              }

              break;

            default:
              return;
          }
        }

        _updateMove(dir) {
          if (this._left && this._right) {
            this.move(dir);
          } else if (this._left) {
            this.move(-1);
          } else if (this._right) {
            this.move(1);
          } else {
            this.move(0);
          }
        }

        move(dir) {
          if (this._moveDir === dir) {
            return;
          }

          this._moveDir = dir;

          this._updateAnimation();
        }

        jump() {
          if (this._isJumpingA) {
            return;
          }

          this._isJumpingA = true;

          this._armature.animation.fadeIn("jump_1", -1, -1, 0, NORMAL_ANIMATION_GROUP);

          this._walkState = null;
        }

        squat(isSquating) {
          if (this._isSquating === isSquating) {
            return;
          }

          this._isSquating = isSquating;

          this._updateAnimation();
        }

        attack(isAttacking) {
          if (this._isAttackingA == isAttacking) {
            return;
          }

          this._isAttackingA = isAttacking;
        }

        switchWeaponL() {
          this._weaponL.removeEventListener(dragonBones.EventObject.FRAME_EVENT, this._frameEventHandler, this);

          this._weaponLIndex++;

          if (this._weaponLIndex >= WEAPON_L_LIST.length) {
            this._weaponLIndex = 0;
          }

          var newWeaponName = WEAPON_L_LIST[this._weaponLIndex];
          let factory = dragonBones.CCFactory.getInstance();
          this._weaponL = factory.buildArmature(newWeaponName);
          this._armature.getSlot('weapon_l').childArmature = this._weaponL;

          this._weaponL.addEventListener(dragonBones.EventObject.FRAME_EVENT, this._frameEventHandler, this);
        }

        switchWeaponR() {
          this._weaponR.removeEventListener(dragonBones.EventObject.FRAME_EVENT, this._frameEventHandler, this);

          this._weaponRIndex++;

          if (this._weaponRIndex >= WEAPON_R_LIST.length) {
            this._weaponRIndex = 0;
          }

          var newWeaponName = WEAPON_R_LIST[this._weaponRIndex];
          let factory = dragonBones.CCFactory.getInstance();
          this._weaponR = factory.buildArmature(newWeaponName);
          this._armature.getSlot('weapon_r').childArmature = this._weaponR;

          this._weaponR.addEventListener(dragonBones.EventObject.FRAME_EVENT, this._frameEventHandler, this);
        }

        switchSkin() {
          this._skinIndex++;

          if (this._skinIndex >= SKINS.length) {
            this._skinIndex = 0;
          }

          let skinName = SKINS[this._skinIndex];
          let factory = dragonBones.CCFactory.getInstance();
          let skinData = factory.getArmatureData(skinName).defaultSkin;
          factory.replaceSkin(this._armatureDisplay.armature(), skinData, false, ["weapon_l", "weapon_r"]);
        }

        aim(x, y) {
          if (this._aimDir === 0) {
            this._aimDir = 10;
          }

          const t = this._target = this.node.parent._uiProps.uiTransformComp.convertToNodeSpaceAR(new Vec3(x, y, 0));
        }

        update(dt) {
          this._updatePosition();

          this._updateAim();

          this._updateAttack();

          this._enterFrameHandler(dt);
        }

        onDisable() {
          // clean the bullets
          for (var i = this._bullets.length - 1; i >= 0; i--) {
            var bullet = this._bullets[i];
            bullet.enabled = false;
          }

          this._bullets = [];
        }

        addBullet(bullet) {
          this._bullets.push(bullet);
        }

        _enterFrameHandler(dt) {
          for (var i = this._bullets.length - 1; i >= 0; i--) {
            var bullet = this._bullets[i];

            if (bullet.update()) {
              this._bullets.splice(i, 1);
            }
          }
        }

        _animationEventHandler(event) {
          if (event.type === dragonBones.EventObject.FADE_IN_COMPLETE) {
            if (event.animationState.name === "jump_1") {
              this._isJumpingB = true;
              this._speedY = -JUMP_SPEED;

              if (this._moveDir != 0) {
                if (this._moveDir * this._faceDir > 0) {
                  this._speedX = MAX_MOVE_SPEED_FRONT * this._faceDir;
                } else {
                  this._speedX = -MAX_MOVE_SPEED_BACK * this._faceDir;
                }
              }

              this._armature.animation.fadeIn("jump_2", -1, -1, 0, NORMAL_ANIMATION_GROUP).resetToPose = false;
            } else if (event.animationState.name === "jump_4") {
              this._updateAnimation();
            }
          } else if (event.type === dragonBones.EventObject.FADE_OUT_COMPLETE) {
            if (event.animationState.name === "attack_01") {
              this._isAttackingB = false;
              this._attackState = null;
            }
          } else if (event.type === dragonBones.EventObject.COMPLETE) {
            if (event.animationState.name === "jump_4") {
              this._isJumpingA = false;
              this._isJumpingB = false;

              this._updateAnimation();
            }
          }
        }

        _frameEventHandler(event, bone, armature) {
          if (event.name === "fire") {
            // var firePointBone = event.armature.getBone("firePoint");
            var localPoint = new Vec3(event.bone.global.x, event.bone.global.y, 0);
            var display = event.armature.display;
            var globalPoint = display.node.convertToWorldSpace(localPoint);

            this._fire(globalPoint);
          }
        }

        _fire(firePoint) {
          firePoint.x += Math.random() * 2 - 1;
          firePoint.y += Math.random() * 2 - 1;
          firePoint.z = 0;

          var armature = this._armatureDisplay.buildArmature("bullet_01");

          var effect = this._armatureDisplay.buildArmature("fire_effect_01");

          var radian = this._faceDir < 0 ? Math.PI - this._aimRadian : this._aimRadian;
          var bullet = new DragonBullet();
          bullet.init(this.node.parent, armature, effect, radian + Math.random() * 0.02 - 0.01, 40, firePoint);
          this.addBullet(bullet);
        }

        _updateAnimation() {
          if (this._isJumpingA) {
            return;
          }

          if (this._isSquating) {
            this._speedX = 0;
            this._armature.animation.fadeIn("squat", -1, -1, 0, NORMAL_ANIMATION_GROUP).resetToPose = false;
            this._walkState = null;
            return;
          }

          if (this._moveDir === 0) {
            this._speedX = 0;
            this._armature.animation.fadeIn("idle", -1, -1, 0, NORMAL_ANIMATION_GROUP).resetToPose = false;
            this._walkState = null;
          } else {
            if (!this._walkState) {
              this._walkState = this._armature.animation.fadeIn("walk", -1, -1, 0, NORMAL_ANIMATION_GROUP);
              this._walkState.resetToPose = false;
            }

            if (this._moveDir * this._faceDir > 0) {
              this._walkState.timeScale = MAX_MOVE_SPEED_FRONT / NORMALIZE_MOVE_SPEED;
            } else {
              this._walkState.timeScale = -MAX_MOVE_SPEED_BACK / NORMALIZE_MOVE_SPEED;
            }

            if (this._moveDir * this._faceDir > 0) {
              this._speedX = MAX_MOVE_SPEED_FRONT * this._faceDir;
            } else {
              this._speedX = -MAX_MOVE_SPEED_BACK * this._faceDir;
            }
          }
        }

        _updatePosition() {
          const camera = director.root.batcher2D.getFirstRenderCamera(this.node);
          const pos = this.node.getPosition();

          if (this._speedX !== 0) {
            pos.x += this._speedX;
            var minX = -camera.width / 2;
            var maxX = camera.width / 2;

            if (pos.x < minX) {
              pos.x = minX;
            } else if (pos.x > maxX) {
              pos.x = maxX;
            }

            this.node.setPosition(pos);
          }

          if (this._speedY != 0) {
            if (this._speedY > 5 && this._speedY + G <= 5) {
              this._armature.animation.fadeIn("jump_3", -1, -1, 0, NORMAL_ANIMATION_GROUP).resetToPose = false;
            }

            this._speedY += G;
            pos.y += this._speedY;

            if (pos.y < GROUND) {
              pos.y = GROUND;
              this._speedY = 0;
              this._armature.animation.fadeIn("jump_4", -1, -1, 0, NORMAL_ANIMATION_GROUP).resetToPose = false;
            }

            this.node.setPosition(pos);
          }
        }

        _updateAim() {
          if (!this._mouseDown_) return;

          if (this._aimDir === 0) {
            return;
          }

          const pos = this.node.getPosition();
          const scale = this.node.getScale();
          this._faceDir = this._target.x > pos.x ? 1 : -1;

          if (scale.x * this._faceDir < 0) {
            scale.x *= -1;

            if (this._moveDir) {
              this._updateAnimation();
            }

            this.node.setScale(scale);
          }

          var aimOffsetY = this._armature.getBone("chest").global.y * scale.y;

          if (this._faceDir > 0) {
            this._aimRadian = Math.atan2(this._target.y - pos.y - aimOffsetY, this._target.x - pos.x);
          } else {
            this._aimRadian = Math.PI - Math.atan2(this._target.y - pos.y - aimOffsetY, this._target.x - pos.x);

            if (this._aimRadian > Math.PI) {
              this._aimRadian -= Math.PI * 2;
            }
          }

          let aimDir = 0;

          if (this._aimRadian > 0) {
            aimDir = 1;
          } else {
            aimDir = -1;
          }

          if (this._aimDir != aimDir) {
            this._aimDir = aimDir; // Animation mixing.

            if (this._aimDir >= 0) {
              this._aimState = this._armature.animation.fadeIn("aim_up", -1.0, -1, 0, AIM_ANIMATION_GROUP);
            } else {
              this._aimState = this._armature.animation.fadeIn("aim_down", -1.0, -1, 0, AIM_ANIMATION_GROUP);
            }

            this._aimState.resetToPose = false;
          }

          this._aimState.weight = Math.abs(this._aimRadian / Math.PI * 2); //_armature.invalidUpdate("pelvis"); // Only update bone mask.

          this._armature.invalidUpdate();
        }

        _updateAttack() {
          if (!this._isAttackingA || this._isAttackingB) {
            return;
          }

          this._isAttackingB = true; // Animation mixing.

          this._attackState = this._armature.animation.fadeIn("attack_01", -1.0, -1, 0, ATTACK_ANIMATION_GROUP, dragonBones.AnimationFadeOutMode.SameGroup);
          this._attackState.resetToPose = false;
          this._attackState.autoFadeOutTime = this._attackState.fadeTotalTime;
        }

      }, _temp2), (_descriptor = _applyDecoratedDescriptor(_class4.prototype, "touchHandler", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class4.prototype, "upButton", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class4.prototype, "downButton", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class4.prototype, "leftButton", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class4.prototype, "rightButton", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class4.prototype, "weaponArmature", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class4.prototype, "skinArmature", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class4)) || _class3) || _class3));
      let DragonBullet = exports('DragonBullet', (_dec = ccclass('DragonBullet'), _dec(_class = (_temp = class DragonBullet {
        constructor() {
          _defineProperty(this, "_speedX", 0);

          _defineProperty(this, "_speedY", 0);

          _defineProperty(this, "_armature", null);

          _defineProperty(this, "_armatureDisplay", null);

          _defineProperty(this, "_effect", null);
        }

        init(parentNode, armature, effect, radian, speed, position) {
          this._speedX = Math.cos(radian) * speed;
          this._speedY = Math.sin(radian) * speed;

          var thePos = parentNode._uiProps.uiTransformComp.convertToNodeSpaceAR(position);

          armature.playAnimation("idle");
          let armatureNode = armature.node;
          armatureNode.setPosition(thePos);
          armatureNode.angle = radian * macro.DEG;
          this._armature = armature;

          if (effect) {
            this._effect = effect;
            var effectDisplay = this._effect.node;
            effectDisplay.angle = radian * macro.DEG;
            effectDisplay.setPosition(thePos);
            effectDisplay.scaleX = 1 + Math.random() * 1;
            effectDisplay.scaleY = 1 + Math.random() * 0.5;

            if (Math.random() < 0.5) {
              effectDisplay.scaleY *= -1;
            }

            this._effect.playAnimation("idle");

            parentNode.addChild(effectDisplay);
          }

          parentNode.addChild(armatureNode);
        }

        update() {
          let armatureNode = this._armature.node;
          const pos = armatureNode.getPosition();
          pos.x += this._speedX;
          pos.y += this._speedY;
          armatureNode.setPosition(pos);
          const uiTrans = armatureNode.parent._uiProps.uiTransformComp;
          var worldPos = uiTrans.convertToWorldSpaceAR(armatureNode.getPosition());
          const camera = director.root.batcher2D.getFirstRenderCamera(armatureNode);

          if (worldPos.x < -100 || worldPos.x >= camera.width + 100 || worldPos.y < -100 || worldPos.y >= camera.height + 100) {
            this.doClean();
            return true;
          }

          return false;
        }

        onDisable() {
          this.doClean();
        }

        doClean() {
          this._armature.node.removeFromParent();

          if (this._effect) {
            this._effect.node.removeFromParent();
          }
        }

      }, _temp)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/PreloadAssets.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _defineProperty, _initializerDefineProperty, cclegacy, Node, Label, Prefab, SpriteFrame, _decorator, Component, resources, director, SpriteAtlas, Font, TextureCube, Texture2D, log, Layers, instantiate, MeshRenderer, UIMeshRenderer, builtinResMgr, Sprite, AudioSource;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _defineProperty = module.defineProperty;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      Label = module.Label;
      Prefab = module.Prefab;
      SpriteFrame = module.SpriteFrame;
      _decorator = module._decorator;
      Component = module.Component;
      resources = module.resources;
      director = module.director;
      SpriteAtlas = module.SpriteAtlas;
      Font = module.Font;
      TextureCube = module.TextureCube;
      Texture2D = module.Texture2D;
      log = module.log;
      Layers = module.Layers;
      instantiate = module.instantiate;
      MeshRenderer = module.MeshRenderer;
      UIMeshRenderer = module.UIMeshRenderer;
      builtinResMgr = module.builtinResMgr;
      Sprite = module.Sprite;
      AudioSource = module.AudioSource;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _temp;

      cclegacy._RF.push({}, "23363UvMkJDuL3mTFnNcJCg", "PreloadAssets", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let PreloadAssets = exports('PreloadAssets', (_dec = ccclass('PreloadAssets'), _dec2 = property({
        type: Node
      }), _dec3 = property({
        type: Label
      }), _dec4 = property({
        type: [Node]
      }), _dec5 = property({
        type: Prefab
      }), _dec6 = property({
        type: SpriteFrame
      }), _dec(_class = (_class2 = (_temp = class PreloadAssets extends Component {
        constructor(...args) {
          super(...args);

          _defineProperty(this, "_lastType", '');

          _defineProperty(this, "_btnLabel", null);

          _defineProperty(this, "_audioSources", []);

          _defineProperty(this, "_isLoading", false);

          _defineProperty(this, "_urls", {
            Audio: "test_assets/audio",
            Txt: "test_assets/text",
            ImageAsset: "test_assets/PurpleMonster",
            Texture2D: "test_assets/PurpleMonster/texture",
            Font: "test_assets/font",
            SpriteAtlas: "test_assets/atlas",
            SpriteFrame: "test_assets/image/spriteFrame",
            Prefab: "test_assets/prefab",
            Animation: "test_assets/testAnim",
            Scene: "test_assets/test-preload-scene",
            TextureCube: "test_assets/cubemap",
            Material: "test_assets/testMat",
            Mesh: "test_assets/Monster/monster",
            Skeleton: "test_assets/Monster/Armature",
            Dir: 'test_assets'
          });

          _initializerDefineProperty(this, "showWindow", _descriptor, this);

          _initializerDefineProperty(this, "loadTips", _descriptor2, this);

          _initializerDefineProperty(this, "loadList", _descriptor3, this);

          _initializerDefineProperty(this, "loadAnimTestPrefab", _descriptor4, this);

          _initializerDefineProperty(this, "loadMaterialSpriteFrame", _descriptor5, this);
        } // use this for initialization


        onLoad() {
          // registered event
          this._onRegisteredEvent();
        }

        onDestroy() {}

        _onRegisteredEvent() {
          for (var i = 0; i < this.loadList.length; ++i) {
            this.loadList[i].on(Node.EventType.TOUCH_END, this._onClick.bind(this));
          }
        }

        _onClick(event) {
          if (this._isLoading) {
            return;
          }

          this._onClear();

          this._curType = event.target.name.split('_')[1];

          if (this._lastType !== "" && this._curType === this._lastType) {
            this.loadTips.string = '';

            this._onShowResClick(event);

            return;
          }

          if (this._btnLabel) {
            this._btnLabel.string = "????????? " + this._lastType;
          }

          this._lastType = this._curType;
          this._btnLabel = event.target.getChildByName("Label").getComponent(Label);
          this.loadTips.string = this._curType + " Loading....";
          this._isLoading = true;

          this._load();
        }

        _load() {
          var url = this._urls[this._curType];

          var loadCallBack = this._loadCallBack.bind(this);

          switch (this._curType) {
            case 'SpriteFrame':
              // specify the type to load sub asset from texture's url
              resources.preload(url, SpriteFrame, loadCallBack);
              break;

            case 'Texture2D':
              resources.preload(url, Texture2D, loadCallBack);
              break;

            case 'TextureCube':
              resources.preload(url, TextureCube, loadCallBack);
              break;

            case 'Font':
              resources.preload(url, Font, loadCallBack);
              break;

            case 'SpriteAtlas':
              resources.preload(url, SpriteAtlas, loadCallBack);
              break;

            case 'Animation':
            case 'Prefab':
            case 'Skeleton':
            case 'Mesh':
            case 'ImageAsset':
            case 'Txt':
            case 'Audio':
            case 'Material':
            case 'Skeleton':
              resources.preload(url, loadCallBack);
              break;

            case 'Scene':
              director.preloadScene(url, loadCallBack);
              break;

            case 'Dir':
              resources.preloadDir(url, loadCallBack);
              break;
          }
        }

        _loadCallBack(err, data) {
          this._isLoading = false;

          if (err) {
            log('Error url [' + err + ']');
            return;
          }

          if (this._btnLabel) {
            if (this._curType === "Audio") {
              this._btnLabel.string = "??????";
            } else {
              this._btnLabel.string = "??????";
            }

            this._btnLabel.string += this._curType;
          }

          this.loadTips.string = this._curType + " Preloaded Successfully!";
        }

        _onClear() {
          this.showWindow.removeAllChildren();

          this._audioSources.forEach(audioSource => {
            audioSource.stop();
          });

          this._audioSources.length = 0;
        }

        _onShowResClick(event) {
          var url = this._urls[this._curType];

          switch (this._curType) {
            case 'SpriteFrame':
              // specify the type to load sub asset from texture's url
              resources.load(url, SpriteFrame, (err, asset) => this._createNode(this._curType, asset));
              break;

            case 'Texture2D':
              resources.load(url, Texture2D, (err, asset) => this._createNode(this._curType, asset));
              break;

            case 'TextureCube':
              resources.load(url, TextureCube, (err, asset) => this._createNode(this._curType, asset));
              break;

            case 'Font':
              resources.load(url, Font, (err, asset) => this._createNode(this._curType, asset));
              break;

            case 'SpriteAtlas':
              resources.load(url, SpriteAtlas, (err, asset) => this._createNode(this._curType, asset));
              break;

            case 'Animation':
            case 'Prefab':
            case 'Skeleton':
            case 'Mesh':
            case 'ImageAsset':
            case 'Txt':
            case 'Audio':
            case 'Material':
            case 'Skeleton':
              resources.load(url, (err, asset) => this._createNode(this._curType, asset));
              break;

            case 'Scene':
              director.loadScene(url);
              break;

            case 'Dir':
              resources.loadDir(url, (err, assets) => {
                this.loadTips.string = "The asset loaded: ";
                assets.forEach(r => this.loadTips.string += `${r.name};`);
              });
              break;
          }
        }

        _createNode(type, res) {
          var _model$material;

          this.loadTips.string = "";
          const node = new Node("New " + type);
          node.layer = Layers.Enum.UI_2D;
          node.setPosition(0, 0, 0);
          let component = null;

          switch (this._curType) {
            case "SpriteFrame":
              component = node.addComponent(Sprite);
              component.spriteFrame = res;
              break;

            case "SpriteAtlas":
              component = node.addComponent(Sprite);
              component.spriteFrame = res.getSpriteFrames()[0];
              break;

            case "Texture2D":
              let cube = instantiate(this.loadAnimTestPrefab);
              const model = cube.getComponent(MeshRenderer);
              model === null || model === void 0 ? void 0 : (_model$material = model.material) === null || _model$material === void 0 ? void 0 : _model$material.setProperty('albedoMap', res);
              cube.setPosition(0, 0, 50);
              cube.setScale(100, 100, 100);
              cube.parent = this.showWindow;
              break;

            case 'ImageAsset':
              component = node.addComponent(Sprite);
              const spriteFrame = new SpriteFrame();
              const tex = new Texture2D();
              tex.image = res;
              spriteFrame.texture = tex;
              component.spriteFrame = spriteFrame;
              break;

            case "Audio":
              component = node.addComponent(AudioSource);
              component.clip = res;
              component.play();

              this._audioSources.push(component);

              this.loadTips.string = "???????????????";
              break;

            case "Txt":
              component = node.addComponent(Label);
              component.lineHeight = 40;
              component.string = res.text;
              break;

            case "Material":
              component = node.addComponent(Sprite);
              component.sharedMaterials = res;
              component.spriteFrame = this.loadMaterialSpriteFrame;
              break;

            case "Font":
              component = node.addComponent(Label);
              component.font = res;
              component.lineHeight = 40;
              component.string = "This is BitmapFont!";
              break;

            case 'Mesh':
              component = node.addComponent(MeshRenderer);
              node.addComponent(UIMeshRenderer);
              node.setPosition(0, 0, 50);
              node.setScale(5, 5, 5);
              component.mesh = res;
              component.material = builtinResMgr.get('standard-material');
              break;

            case "Prefab":
              let prefab = instantiate(res);
              prefab.parent = node;
              prefab.setPosition(0, 0, 0);
              break;

            default:
              this.loadTips.string = "????????????????????????";
              break;
          }

          this.showWindow.addChild(node);
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "showWindow", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "loadTips", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "loadList", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "loadAnimTestPrefab", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "loadMaterialSpriteFrame", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/use-render-texture-to-model.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, MeshRenderer, RenderTexture, _decorator, Component, Material;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      MeshRenderer = module.MeshRenderer;
      RenderTexture = module.RenderTexture;
      _decorator = module._decorator;
      Component = module.Component;
      Material = module.Material;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _temp;

      cclegacy._RF.push({}, "273937WXQBIKKGFsZAzGHKx", "use-render-texture-to-model", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let UseRenderTextureToModel = exports('UseRenderTextureToModel', (_dec = ccclass('UseRenderTextureToModel'), _dec2 = property(MeshRenderer), _dec3 = property(RenderTexture), _dec(_class = (_class2 = (_temp = class UseRenderTextureToModel extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "quad", _descriptor, this);

          _initializerDefineProperty(this, "rtTexture", _descriptor2, this);
        }

        start() {
          // Your initialization goes here.
          this.scheduleOnce(() => {
            const material = this.quad.getMaterialInstance(0);

            if (!material) {
              return;
            }

            const defines = {
              SAMPLE_FROM_RT: true,
              ...material.passes[0].defines
            };
            const renderMat = new Material();
            renderMat.initialize({
              effectAsset: material.effectAsset,
              defines
            });
            this.quad.setMaterialInstance(0, renderMat);
            renderMat.setProperty('mainTexture', this.rtTexture, 0);
          }, 3);
        } // update (deltaTime: number) {
        //     // Your update function goes here.
        // }


      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "quad", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "rtTexture", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/rotate.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, _defineProperty, cclegacy, _decorator, Component, Vec3, math;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Component = module.Component;
      Vec3 = module.Vec3;
      math = module.math;
    }],
    execute: function () {
      var _dec, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _temp;

      cclegacy._RF.push({}, "28769dseGxNyq/PV1QPTk17", "rotate", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let rotate = exports('rotate', (_dec = ccclass("rotate"), _dec(_class = (_class2 = (_temp = class rotate extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "xAxis", _descriptor, this);

          _initializerDefineProperty(this, "xTo", _descriptor2, this);

          _initializerDefineProperty(this, "yAxis", _descriptor3, this);

          _initializerDefineProperty(this, "yTo", _descriptor4, this);

          _initializerDefineProperty(this, "zAxis", _descriptor5, this);

          _initializerDefineProperty(this, "zTo", _descriptor6, this);

          _initializerDefineProperty(this, "time", _descriptor7, this);

          _initializerDefineProperty(this, "loop", _descriptor8, this);

          _defineProperty(this, "originEuler", new Vec3());

          _defineProperty(this, "currT", 0);
        }

        start() {
          // Your initialization goes here.
          this.originEuler.set(this.node.eulerAngles);
        }

        update(dt) {
          // Your update function goes here.
          if (this.loop && this.currT + dt > this.time) {
            return;
          }

          this.currT = math.repeat(this.currT + dt, this.time);
          let x = this.xAxis ? math.lerp(this.originEuler.x, this.xTo, this.currT / this.time) : this.node.eulerAngles.x;
          let y = this.yAxis ? math.lerp(this.originEuler.y, this.yTo, this.currT / this.time) : this.node.eulerAngles.y;
          let z = this.zAxis ? math.lerp(this.originEuler.z, this.zTo, this.currT / this.time) : this.node.eulerAngles.z;
          this.node.setRotationFromEuler(x, y, z);
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "xAxis", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "xTo", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "yAxis", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "yTo", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "zAxis", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "zTo", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "time", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "loop", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/TweenClone.ts", ['cc'], function (exports) {
  'use strict';

  var cclegacy, Component, tween, Vec3, find, _decorator;

  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Component = module.Component;
      tween = module.tween;
      Vec3 = module.Vec3;
      find = module.find;
      _decorator = module._decorator;
    }],
    execute: function () {
      var _dec, _dec2, _class;

      cclegacy._RF.push({}, "2a301uexdZCzKvVP44F+yc2", "TweenClone", undefined);

      const {
        ccclass,
        property,
        menu
      } = _decorator;
      let TweenClone = exports('TweenClone', (_dec = ccclass("TweenClone"), _dec2 = menu("tween/TweenClone"), _dec(_class = _dec2(_class = class TweenClone extends Component {
        onLoad() {
          // ?????????????????????????????????
          let tweenTemplate = tween({}).to(4, {
            scale: new Vec3(3, 3, 3)
          }); // ?????? tween?????????????????? cocos ?????? target

          this.tweenClone0 = tweenTemplate.clone(find('TweenClone/cocos')); // ?????? tween?????????????????? cocos2 ?????? target

          this.tweenClone1 = tweenTemplate.clone(find('TweenClone/cocos2'));
        }

        onEnable() {
          this.tweenClone0.start();
          this.tweenClone1.start();
        }

        onDisable() {
          this.tweenClone0.stop();
          this.tweenClone1.stop();
        }

      }) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/RTPixel.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc', './RTCapture.ts'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, _defineProperty, cclegacy, Sprite, _decorator, Component, SpriteFrame, Texture2D, RTCapture;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Sprite = module.Sprite;
      _decorator = module._decorator;
      Component = module.Component;
      SpriteFrame = module.SpriteFrame;
      Texture2D = module.Texture2D;
    }, function (module) {
      RTCapture = module.RTCapture;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor, _temp;

      cclegacy._RF.push({}, "2a91bm9/a5GNYHSxEA3GSF8", "RTPixel", undefined);

      const {
        ccclass,
        property,
        menu
      } = _decorator;
      /**
       * Predefined variables
       * Name = RTPixel
       * DateTime = Mon Sep 06 2021 11:31:06 GMT+0800 (??????????????????)
       * Author = zhakesi
       * FileBasename = RTPixel.ts
       * FileBasenameNoExtension = RTPixel
       * URL = db://assets/RTPixel.ts
       * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
       *
       */

      let RTPixel = exports('RTPixel', (_dec = ccclass('RTPixel'), _dec2 = menu('RenderTexture/RTPixel'), _dec3 = property(Sprite), _dec(_class = _dec2(_class = (_class2 = (_temp = class RTPixel extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "sprite", _descriptor, this);

          _defineProperty(this, "dstTexture", void 0);

          _defineProperty(this, "sp", void 0);
        }

        start() {
          const spriteframe = this.sprite.spriteFrame;
          this.sp = new SpriteFrame();
          this.sp.reset({
            originalSize: spriteframe.getOriginalSize(),
            rect: spriteframe.getRect(),
            offset: spriteframe.getOffset(),
            isRotate: spriteframe.isRotated(),
            borderTop: spriteframe.insetTop,
            borderLeft: spriteframe.insetLeft,
            borderBottom: spriteframe.insetBottom,
            borderRight: spriteframe.insetRight
          });
          this.dstTexture = new Texture2D();
          this.dstTexture.reset({
            width: 256,
            height: 256,
            format: Texture2D.PixelFormat.RGBA8888,
            mipmapLevel: 0
          });
        }

        update(deltaTime) {
          let src = RTCapture._renderTex;

          if (src) {
            let pbuffer = src.readPixels();
            this.dstTexture.uploadData(pbuffer);
          }

          this.sp.texture = this.dstTexture;
          this.sprite.spriteFrame = this.sp;
          this.sprite.updateMaterial();
        }

        onDestroy() {
          if (this.dstTexture) {
            this.dstTexture.destroy();
            this.dstTexture = null;
          }
        }

      }, _temp), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "sprite", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _class2)) || _class) || _class));
      /**
       * [1] Class member could be defined like this.
       * [2] Use `property` decorator if your want the member to be serializable.
       * [3] Your initialization goes here.
       * [4] Your update function goes here.
       *
       * Learn more about scripting: https://docs.cocos.com/creator/3.3/manual/en/scripting/
       * Learn more about CCClass: https://docs.cocos.com/creator/3.3/manual/en/scripting/ccclass.html
       * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.3/manual/en/scripting/life-cycle-callbacks.html
       */

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/RaycastModelTest.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, _defineProperty, cclegacy, Material, Camera, MeshRenderer, _decorator, Component, geometry, systemEvent, SystemEventType;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Material = module.Material;
      Camera = module.Camera;
      MeshRenderer = module.MeshRenderer;
      _decorator = module._decorator;
      Component = module.Component;
      geometry = module.geometry;
      systemEvent = module.systemEvent;
      SystemEventType = module.SystemEventType;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _temp;

      cclegacy._RF.push({}, "2b0a2MPT3xIFJHQ0fZRqYF2", "RaycastModelTest", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let RaycastModelTest = exports('RaycastModelTest', (_dec = ccclass("RaycastModelTest"), _dec2 = property({
        type: Material
      }), _dec3 = property({
        type: Material
      }), _dec4 = property({
        type: Camera
      }), _dec5 = property({
        type: MeshRenderer
      }), _dec(_class = (_class2 = (_temp = class RaycastModelTest extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "defaultMaterial", _descriptor, this);

          _initializerDefineProperty(this, "rayMaterial", _descriptor2, this);

          _initializerDefineProperty(this, "cameraCom", _descriptor3, this);

          _initializerDefineProperty(this, "modelCom", _descriptor4, this);

          _defineProperty(this, "_ray", new geometry.Ray());
        }

        onEnable() {
          systemEvent.on(SystemEventType.TOUCH_START, this.onTouchStart, this);
        }

        onDisable() {
          systemEvent.off(SystemEventType.TOUCH_START, this.onTouchStart, this);
        }

        onTouchStart(touch, event) {
          const point = touch.getLocation();
          this.cameraCom.screenPointToRay(point.x, point.y, this._ray);

          if (geometry.intersect.rayModel(this._ray, this.modelCom.model)) {
            this.modelCom.material = this.rayMaterial;
          } else {
            this.modelCom.material = this.defaultMaterial;
          }
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "defaultMaterial", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "rayMaterial", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "cameraCom", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "modelCom", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/tiled.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _defineProperty, cclegacy, _decorator, Component, Size, UITransform, view;

  return {
    setters: [function (module) {
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Component = module.Component;
      Size = module.Size;
      UITransform = module.UITransform;
      view = module.view;
    }],
    execute: function () {
      var _dec, _dec2, _class, _temp;

      cclegacy._RF.push({}, "2b357qH4X1IbY1T5THVmIyE", "tiled", undefined);

      const {
        ccclass,
        property,
        menu
      } = _decorator;
      let Tiled = exports('Tiled', (_dec = ccclass("Tiled"), _dec2 = menu('UI/Tiled'), _dec(_class = _dec2(_class = (_temp = class Tiled extends Component {
        constructor(...args) {
          super(...args);

          _defineProperty(this, "_startSize", new Size());
        }

        start() {
          const uiTrans = this.getComponent(UITransform);

          this._startSize.set(uiTrans.contentSize);
        }

        update(dt) {
          const size = view.getVisibleSize();
          const limit = size.width * 0.7;
          const uiTrans = this.getComponent(UITransform);
          let content = uiTrans.contentSize;
          let width = content.width;

          if (width > limit) {
            this.enabled = false;
          }

          uiTrans.setContentSize(width + 5, content.height);
        }

      }, _temp)) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/NetworkCtrl.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, _defineProperty, cclegacy, Label, Asset, _decorator, Component, loader, sys, assetManager, assert;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Label = module.Label;
      Asset = module.Asset;
      _decorator = module._decorator;
      Component = module.Component;
      loader = module.loader;
      sys = module.sys;
      assetManager = module.assetManager;
      assert = module.assert;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _temp;

      cclegacy._RF.push({}, "2b4f5mwy11Bl7RSImxjHp/i", "NetworkCtrl", undefined);

      const {
        ccclass,
        property
      } = _decorator; // imported from socket-io.js

      let NetworkCtrl = exports('NetworkCtrl', (_dec = ccclass('NetworkCtrl'), _dec2 = property({
        type: Label
      }), _dec3 = property({
        type: Label
      }), _dec4 = property({
        type: Label
      }), _dec5 = property({
        type: Label
      }), _dec6 = property({
        type: Asset
      }), _dec(_class = (_class2 = (_temp = class NetworkCtrl extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "xhr", _descriptor, this);

          _initializerDefineProperty(this, "xhrAB", _descriptor2, this);

          _initializerDefineProperty(this, "xhrTimeout", _descriptor3, this);

          _initializerDefineProperty(this, "websocket", _descriptor4, this);

          _initializerDefineProperty(this, "wssCacert", _descriptor5, this);

          _defineProperty(this, "_reconnectCount", 0);

          _defineProperty(this, "_xhrXHR", null);

          _defineProperty(this, "_xhrHRAB", null);

          _defineProperty(this, "_xhrXHRTimeout", null);

          _defineProperty(this, "_wsiSendBinary", null);

          _defineProperty(this, "_sioClient", null);

          _defineProperty(this, "tag", '');
        } // use this for initialization


        start() {
          this._wsiSendBinary = null;
          this._xhrXHR = null;
          this._xhrHRAB = null;
          this._xhrXHRTimeout = null;
          this.xhr.string = 'waiting..';
          this.xhrAB.string = 'waiting..';
          this.xhrTimeout.string = 'waiting..';
          this.websocket.string = 'waiting..';
          this.sendXHR();
          this.sendXHRAB();
          this.sendXHRTimeout();
          this.prepareWebSocket();
        }

        onDestroy() {
          let wsiSendBinary = this._wsiSendBinary;

          if (wsiSendBinary) {
            wsiSendBinary.onopen = null;
            wsiSendBinary.onmessage = null;
            wsiSendBinary.onerror = null;
            wsiSendBinary.onclose = null;
            wsiSendBinary.close();
          }

          this.rmXhrEventListener(this._xhrXHR);
          this.rmXhrEventListener(this._xhrHRAB);
          this.rmXhrEventListener(this._xhrXHRTimeout);
        }

        sendXHR() {
          let xhr = loader.getXMLHttpRequest();
          this.streamXHREventsToLabel(xhr, this.xhr, 'GET');
          xhr.open('GET', 'https://httpbin.org/get?show_env=1', true);

          if (sys.isNative) {
            xhr.setRequestHeader('Accept-Encoding', 'gzip,deflate');
          } // note: In Internet Explorer, the timeout property may be set only after calling the open()
          // method and before calling the send() method.


          xhr.timeout = 10000; // 10 seconds for timeout

          xhr.send();
          this._xhrXHR = xhr;
        }

        sendXHRAB() {
          let xhr = loader.getXMLHttpRequest();
          this.streamXHREventsToLabel(xhr, this.xhrAB, 'POST');
          xhr.open('POST', 'https://httpbin.org/post'); // set Content-type "text/plain" to post ArrayBuffer or ArrayBufferView

          xhr.setRequestHeader('Content-Type', 'text/plain'); // Uint8Array is an ArrayBufferView

          xhr.send(new Uint8Array([1, 2, 3, 4, 5]));
          this._xhrHRAB = xhr;
        }

        sendXHRTimeout() {
          let xhr = new XMLHttpRequest();
          this.streamXHREventsToLabel(xhr, this.xhrTimeout, 'GET');
          xhr.open('GET', 'https://192.168.22.222', true); // note: In Internet Explorer, the timeout property may be set only after calling the open()
          // method and before calling the send() method.

          xhr.timeout = 5000; // 5 seconds for timeout

          xhr.send();
          this._xhrXHRTimeout = xhr;
        }

        prepareWebSocket() {
          const self = this;
          const websocketLabel = this.websocket.node.getParent().getComponent(Label);
          const respLabel = this.websocket;
          let url = this.wssCacert.nativeUrl;

          if (assetManager.cacheManager) {
            url = assetManager.cacheManager.getCache(url) || assetManager.cacheManager.getTemp(url) || url;
          } // We should pass the cacert to libwebsockets used in native platform, otherwise the wss connection would be closed.
          // @ts-ignore


          this._wsiSendBinary = new WebSocket('wss://echo.websocket.org', [], url);
          this._wsiSendBinary.binaryType = 'arraybuffer';

          this._wsiSendBinary.onopen = function (evt) {
            respLabel.string = 'Opened!';
            websocketLabel.string = 'WebSocket: onopen';
          };

          this._wsiSendBinary.onmessage = function (evt) {
            const binary = new Uint8Array(evt.data);
            let binaryStr = 'response bin msg: ';
            let str = '0x';
            const hexMap = '0123456789ABCDEF'.split('');
            assert(hexMap.length == 16);

            for (let i = 0; i < binary.length; i++) {
              str += hexMap[binary[i] >> 4];
              str += hexMap[binary[i] & 0x0F];
            }

            binaryStr += str;
            respLabel.string = binaryStr;
            websocketLabel.string = 'WebSocket: onmessage';
          };

          this._wsiSendBinary.onerror = function (evt) {
            websocketLabel.string = 'WebSocket: onerror';
            respLabel.string = 'Error!';
          };

          this._wsiSendBinary.onclose = function (evt) {
            websocketLabel.string = 'WebSocket: onclose'; // After close, it's no longer possible to use it again,
            // if you want to send another request, you need to create a new websocket instance

            self._wsiSendBinary = null;
            respLabel.string = 'Close!';
          };

          this.scheduleOnce(this.sendWebSocketBinary, 1);
        }

        sendWebSocketBinary() {
          let websocketLabel = this.websocket.node.getParent().getComponent(Label);

          if (!this._wsiSendBinary) {
            return;
          }

          if (this._wsiSendBinary.readyState === WebSocket.OPEN) {
            websocketLabel.string = 'WebSocket: sendbinary';
            let buf = 'Hello WebSocket??????,\0 I\'m\0 a\0 binary\0 message\0.';
            let arrData = new Uint16Array(buf.length);

            for (let i = 0; i < buf.length; i++) {
              arrData[i] = buf.charCodeAt(i);
            }

            this._wsiSendBinary.send(arrData.buffer);
          } else {
            let warningStr = 'send binary websocket instance wasn\'t ready...';
            websocketLabel.string = 'WebSocket: not ready';
            this.websocket.string = warningStr;
            this.scheduleOnce(() => {
              this.sendWebSocketBinary();
            }, 1);
          }
        }

        streamXHREventsToLabel(xhr, label, method, responseHandler) {
          let handler = responseHandler || function (response) {
            return method + ' Response (30 chars): ' + response.substring(0, 30) + '...';
          };

          const eventLabel = label.node.getParent().getComponent(Label);
          let eventLabelOrigin = eventLabel.string; // Simple events

          ['loadstart', 'abort', 'error', 'load', 'loadend', 'timeout'].forEach(function (eventName) {
            xhr['on' + eventName] = function () {
              eventLabel.string = eventLabelOrigin + '\nEvent : ' + eventName;

              if (eventName === 'timeout') {
                label.string += '(timeout)';
              } else if (eventName === 'loadend') {
                label.string += '...loadend!';
              }
            };
          }); // Special event

          xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status >= 200) {
              label.string = handler(xhr.responseText);
            } else if (xhr.status === 404) {
              label.string = '404 page not found!';
            } else if (xhr.readyState === 3) {
              label.string = 'Request dealing!';
            } else if (xhr.readyState === 2) {
              label.string = 'Request received!';
            } else if (xhr.readyState === 1) {
              label.string = 'Server connection established! Request hasn\'t been received';
            } else if (xhr.readyState === 0) {
              label.string = 'Request hasn\'t been initiated!';
            }
          };
        }

        rmXhrEventListener(xhr) {
          if (!xhr) {
            return;
          }

          ['loadstart', 'abort', 'error', 'load', 'loadend', 'timeout'].forEach(eventName => {
            xhr['on' + eventName] = null;
          });
          xhr.onreadystatechange = null;
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "xhr", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "xhrAB", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "xhrTimeout", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "websocket", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "wssCacert", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/AsyncFunctionsTest.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc', './ui-log.ts'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, _decorator, Component, UILog;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Component = module.Component;
    }, function (module) {
      UILog = module.UILog;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor, _temp;

      cclegacy._RF.push({}, "2c510NsGGFIbpHzebAjhUU0", "AsyncFunctionsTest", undefined);

      const {
        ccclass,
        property,
        menu
      } = _decorator;
      let AsyncFunctionsTest = exports('AsyncFunctionsTest', (_dec = ccclass('AsyncFunctionsTest'), _dec2 = menu('TestCases/Scripting/LanguageFeature/AsyncFunctionsTest'), _dec3 = property(UILog), _dec(_class = _dec2(_class = (_class2 = (_temp = class AsyncFunctionsTest extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "logPanel", _descriptor, this);
        }

        start() {
          (async () => {
            // Directly running an async function should be OK.
            this._getLogPanelChecked().addLabel(`Async function starts at ${new Date()}`); // cc.log(`Async function starts at ${new Date()}`);


            await sleep(2000);

            this._getLogPanelChecked().addLabel(`Async function ends at ${new Date()}(Expected: 2 seconds past)`); // cc.log(`Async function ends at ${new Date()}(Expected: 2 seconds past)`);


            try {
              this._getLogPanelChecked().addLabel(`Async function(which is throw-ful) starts at ${new Date()}`);

              await sleepThrow(1000);
            } catch (error) {
              this._getLogPanelChecked().addLabel(`Async function(which is throw-ful) throws "${error}" at ${new Date()}(Expected: 1 seconds past)`);
            }
          })();
        }

        _getLogPanelChecked() {
          if (this.isValid) {
            return this.logPanel;
          } else {
            // This may happen if the scene has been destroyed.
            // For simplification, we return a mocking stuff...
            return {
              addLabel() {// ...
              }

            };
          }
        }

      }, _temp), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "logPanel", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _class2)) || _class) || _class));

      async function sleep(duration) {
        // Define an async function should be OK.
        return await new Promise((resolve, reject) => {
          // `await` in async function should be OK.
          setTimeout(() => {
            resolve();
          }, duration);
        });
      }

      const sleepThrow = async at => {
        // Define an async lambda should be OK.
        return await new Promise((resolve, reject) => {
          // `await` in lambda should be OK.
          setTimeout(() => {
            reject(new Error(`Oops...`));
          }, at);
        });
      };

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/batch-tester.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, _defineProperty, cclegacy, Prefab, Label, Slider, _decorator, Component, director, instantiate;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Prefab = module.Prefab;
      Label = module.Label;
      Slider = module.Slider;
      _decorator = module._decorator;
      Component = module.Component;
      director = module.director;
      instantiate = module.instantiate;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _temp;

      cclegacy._RF.push({}, "2e116ACZoBGcpoJL3RMAD5+", "batch-tester", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let BatchTester = exports('BatchTester', (_dec = ccclass('BatchTester'), _dec2 = property(Prefab), _dec3 = property(Label), _dec4 = property(Slider), _dec(_class = (_class2 = (_temp = class BatchTester extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "prefab", _descriptor, this);

          _initializerDefineProperty(this, "label", _descriptor2, this);

          _initializerDefineProperty(this, "slider", _descriptor3, this);

          _initializerDefineProperty(this, "count", _descriptor4, this);

          _initializerDefineProperty(this, "xinterval", _descriptor5, this);

          _initializerDefineProperty(this, "zinterval", _descriptor6, this);

          _initializerDefineProperty(this, "hoverSpeed", _descriptor7, this);

          _initializerDefineProperty(this, "maxCount", _descriptor8, this);

          _defineProperty(this, "_nodes", []);

          _defineProperty(this, "_delays", []);
        }

        start() {
          for (let i = 0; i < this.count; i++) {
            for (let j = 0; j < 10; j++) {
              this._createBatch(i, j);
            }
          }

          this.label.string = 'Boxes: ' + this.count * 100;
          this.slider.progress = this.count / this.maxCount;
        }

        update() {
          const t = director.getCurrentTime();

          for (let i = 0; i < this._nodes.length; i++) {
            const node = this._nodes[i];
            const delay = this._delays[i];
            const position = node.position;
            const y = Math.sin(delay + t * this.hoverSpeed);
            node.setPosition(position.x, y, position.z);
          }
        }

        setCount(e) {
          const count = Math.floor(e.progress * this.maxCount);

          if (count > this.count) {
            for (let i = this.count; i < count; i++) {
              for (let j = 0; j < 10; j++) {
                this._createBatch(i, j);
              }
            }
          } else {
            if (this._nodes.length > 0) {
              for (let i = count; i < this.count; i++) {
                for (let j = 0; j < 10; j++) {
                  var _this$_nodes$splice$;

                  const idx = count * 100;
                  (_this$_nodes$splice$ = this._nodes.splice(idx, 10)[0].parent) === null || _this$_nodes$splice$ === void 0 ? void 0 : _this$_nodes$splice$.setParent(null);

                  this._delays.splice(idx, 10);
                }
              }
            }
          }

          this.count = count;
          this.label.string = 'Boxes: ' + this.count * 100;
        }

        _createBatch(i, j) {
          const node = instantiate(this.prefab);
          node.setPosition(j * this.xinterval, 0, i * this.zinterval);
          node.name = '' + (i * 10 + j) * 10;
          node.setParent(this.node.parent);
          Array.prototype.push.apply(this._nodes, node.children);
          Array.prototype.push.apply(this._delays, node.children.map(() => Math.random() * Math.PI * 2));
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "prefab", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "label", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "slider", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "count", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 15;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "xinterval", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 6;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "zinterval", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 3;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "hoverSpeed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.01;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "maxCount", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 50;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/stringChange.ts", ['cc'], function (exports) {
  'use strict';

  var cclegacy, Component, Label, _decorator;

  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Component = module.Component;
      Label = module.Label;
      _decorator = module._decorator;
    }],
    execute: function () {
      var _dec, _class;

      cclegacy._RF.push({}, "2e8d3jQzlNN5YzO9AwDESmT", "stringChange", undefined);

      const {
        ccclass
      } = _decorator;
      let StringChange = exports('StringChange', (_dec = ccclass('StringChange'), _dec(_class = class StringChange extends Component {
        start() {
          this.getComponent(Label).string = 'changed';
        }

      }) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/loadSubPack.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Label, Button, _decorator, Component, loader, math, director;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Label = module.Label;
      Button = module.Button;
      _decorator = module._decorator;
      Component = module.Component;
      loader = module.loader;
      math = module.math;
      director = module.director;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _temp;

      cclegacy._RF.push({}, "30af6PoiY9LnL7y8Z0Qg4vY", "loadSubPack", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let loadSubPack = exports('loadSubPack', (_dec = ccclass("loadSubPack"), _dec2 = property({
        type: Label
      }), _dec3 = property({
        type: Button
      }), _dec4 = property({
        type: Button
      }), _dec(_class = (_class2 = (_temp = class loadSubPack extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "label", _descriptor, this);

          _initializerDefineProperty(this, "createButton_1", _descriptor2, this);

          _initializerDefineProperty(this, "createButton_2", _descriptor3, this);
        }

        start() {
          // Your initialization goes here.
          this.loadSubPackages();
        }

        loadSubPackages() {
          this.createButton_1.node.active = false;
          this.createButton_2.node.active = false;
          this.label.string = 'Load subPackage...';
          loader.downloader.loadSubpackage('sub-pack-01', err => {
            if (err) {
              this.label.string = 'load sub-pack-01 failed!';
              this.label.color = math.Color.RED;
              return console.error(err);
            }

            this.label.string = 'load sub-pack-01 success!';
            console.log(`load subpackage(sub-pack-01) successfully.`);
            this.createButton_1.node.active = true;
            loader.downloader.loadSubpackage('sub-pack-02', err => {
              if (err) {
                this.label.string = 'load sub-pack-02 failed!';
                this.label.color = math.Color.RED;
                return console.error(err);
              }

              this.label.string += '\n load sub-pack-02 success!';
              console.log(`load subpackage(sub-pack-02) successfully.`);
              this.createButton_2.node.active = true;
              this.label.string += '\n load all success!';
            });
          });
        }

        jumpToSubScene01() {
          director.loadScene('subPack01');
        }

        jumpToSubScene02() {
          director.loadScene('subPack02');
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "label", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "createButton_1", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "createButton_2", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/TransformController.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, _defineProperty, cclegacy, Node, Toggle, _decorator, Component, Vec3;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      Toggle = module.Toggle;
      _decorator = module._decorator;
      Component = module.Component;
      Vec3 = module.Vec3;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _temp;

      cclegacy._RF.push({}, "31227RC6XlF3qraA74BrA9+", "TransformController", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let _temp_num = 0;
      let TransformController = exports('TransformController', (_dec = ccclass("TransformController"), _dec2 = property({
        type: Node
      }), _dec3 = property({
        type: Node
      }), _dec4 = property({
        type: Node
      }), _dec5 = property({
        type: Node
      }), _dec6 = property({
        type: Toggle
      }), _dec7 = property({
        type: Toggle
      }), _dec8 = property({
        type: Toggle
      }), _dec9 = property({
        type: Toggle
      }), _dec(_class = (_class2 = (_temp = class TransformController extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "particle1", _descriptor, this);

          _initializerDefineProperty(this, "particle2", _descriptor2, this);

          _initializerDefineProperty(this, "particle3", _descriptor3, this);

          _initializerDefineProperty(this, "particle4", _descriptor4, this);

          _initializerDefineProperty(this, "check1", _descriptor5, this);

          _initializerDefineProperty(this, "check2", _descriptor6, this);

          _initializerDefineProperty(this, "check3", _descriptor7, this);

          _initializerDefineProperty(this, "check4", _descriptor8, this);

          _defineProperty(this, "_translate", new Vec3());

          _defineProperty(this, "_rotate", new Vec3());
        }

        start() {// Your initialization goes here.
        } // update (deltaTime: number) {
        //     // Your update function goes here.
        // }


        onTranslateChanged(slider, data) {
          this._translate.set(0, 0, slider.progress * 10 - _temp_num);

          _temp_num = slider.progress * 10;

          if (this.check1.isChecked) {
            this.particle1.translate(this._translate);
          }

          if (this.check2.isChecked) {
            this.particle2.translate(this._translate);
          }

          if (this.check3.isChecked) {
            this.particle3.translate(this._translate);
          }

          if (this.check4.isChecked) {
            this.particle4.translate(this._translate);
          }
        }

        onRotateChanged(slider, data) {
          this._rotate.set(slider.progress * 90, 0, 0);

          if (this.check1.isChecked) {
            this.particle1.setRotationFromEuler(this.particle1.eulerAngles.x, this._rotate.x, this.particle1.eulerAngles.z);
          }

          if (this.check2.isChecked) {
            this.particle2.setRotationFromEuler(this.particle2.eulerAngles.x, this._rotate.x, this.particle2.eulerAngles.z);
          }

          if (this.check3.isChecked) {
            this.particle3.setRotationFromEuler(this.particle3.eulerAngles.x, this._rotate.x, this.particle3.eulerAngles.z);
          }

          if (this.check4.isChecked) {
            this.particle4.setRotationFromEuler(this.particle4.eulerAngles.x, this._rotate.x, this.particle4.eulerAngles.z);
          }
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "particle1", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "particle2", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "particle3", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "particle4", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "check1", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "check2", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "check3", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "check4", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/keyboard-event.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _defineProperty, _initializerDefineProperty, cclegacy, Toggle, Node, _decorator, Component, sys, input, Input, systemEvent, SystemEvent, Color, Sprite;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _defineProperty = module.defineProperty;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Toggle = module.Toggle;
      Node = module.Node;
      _decorator = module._decorator;
      Component = module.Component;
      sys = module.sys;
      input = module.input;
      Input = module.Input;
      systemEvent = module.systemEvent;
      SystemEvent = module.SystemEvent;
      Color = module.Color;
      Sprite = module.Sprite;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _temp;

      cclegacy._RF.push({}, "3122c1K7LxOX4ANwtri6+eN", "keyboard-event", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      const keyCode2KeyName = {
        0: "none",
        6: "back",
        8: "backspace",
        9: "tab",
        13: "enter",
        16: "shiftLeft",
        17: "ctrlLeft",
        18: "altLeft",
        19: "pause",
        20: "capslock",
        27: "escape",
        32: "space",
        33: "pageup",
        34: "pagedown",
        35: "end",
        36: "home",
        37: "left",
        38: "up",
        39: "right",
        40: "down",
        41: "select",
        45: "insert",
        46: "Delete",
        48: "0",
        49: "1",
        50: "2",
        51: "3",
        52: "4",
        53: "5",
        54: "6",
        55: "7",
        56: "8",
        57: "9",
        65: "a",
        66: "b",
        67: "c",
        68: "d",
        69: "e",
        70: "f",
        71: "g",
        72: "h",
        73: "i",
        74: "j",
        75: "k",
        76: "l",
        77: "m",
        78: "n",
        79: "o",
        80: "p",
        81: "q",
        82: "r",
        83: "s",
        84: "t",
        85: "u",
        86: "v",
        87: "w",
        88: "x",
        89: "y",
        90: "z",
        96: "num0",
        97: "num1",
        98: "num2",
        99: "num3",
        100: "num4",
        101: "num5",
        102: "num6",
        103: "num7",
        104: "num8",
        105: "num9",
        106: "asterisk",
        107: "plus",
        109: "minus",
        110: "numdel",
        111: "numslash",
        112: "f1",
        113: "f2",
        114: "f3",
        115: "f4",
        116: "f5",
        117: "f6",
        118: "f7",
        119: "f8",
        120: "f9",
        121: "f10",
        122: "f11",
        123: "f12",
        144: "numlock",
        145: "scrolllock",
        186: "semicolon",
        187: "equal",
        188: "comma",
        189: "dash",
        190: "period",
        191: "forwardslash",
        192: "grave",
        219: "openbracket",
        220: "backslash",
        221: "closebracket",
        222: "quote",
        1000: "dpadLeft",
        1001: "dpadRight",
        1003: "dpadUp",
        1004: "dpadDown",
        1005: "dpadCenter",
        // supported on v3.3
        2000: "shiftRight",
        2001: "ctrlRight",
        2002: "altRight",
        2003: "numEnter"
      };
      let KeyboardEvent = exports('KeyboardEvent', (_dec = ccclass('KeyboardEvent'), _dec2 = property(Toggle), _dec3 = property(Node), _dec(_class = (_class2 = (_temp = class KeyboardEvent extends Component {
        constructor(...args) {
          super(...args);

          _defineProperty(this, "_keyNode2TimeoutId", new WeakMap());

          _initializerDefineProperty(this, "legacyEventToggle", _descriptor, this);

          _initializerDefineProperty(this, "noSupport", _descriptor2, this);
        }

        onLoad() {
          if (sys.platform === sys.Platform.WIN32 || sys.platform === sys.Platform.MACOS || sys.platform === sys.Platform.DESKTOP_BROWSER || sys.platform === sys.Platform.WECHAT_GAME && !sys.isMobile) {
            this.noSupport.active = false;
          } else {
            this.noSupport.active = true;
            return;
          }

          this.legacyEventToggle.node.on(Toggle.EventType.TOGGLE, this.onToggle, this);
          this.updateEventType();
        }

        onDestroy() {
          this.unregisterEvent();
          this.unregisterLegacyEvent();
        }

        updateEventType() {
          if (this.legacyEventToggle.isChecked) {
            this.unregisterEvent();
            this.registerLegacyEvent();
          } else {
            this.unregisterLegacyEvent();
            this.registerEvent();
          }
        }

        registerEvent() {
          input.on(Input.EventType.KEY_DOWN, this.onKeyboardDown, this);
          input.on(Input.EventType.KEY_PRESSING, this.onKeyboardPressing, this);
          input.on(Input.EventType.KEY_UP, this.onKeyboardUp, this);
        }

        unregisterEvent() {
          input.off(Input.EventType.KEY_DOWN, this.onKeyboardDown, this);
          input.off(Input.EventType.KEY_PRESSING, this.onKeyboardPressing, this);
          input.off(Input.EventType.KEY_UP, this.onKeyboardUp, this);
        }

        registerLegacyEvent() {
          systemEvent.on(SystemEvent.EventType.KEY_DOWN, this.onKeyboardDown, this);
          systemEvent.on(SystemEvent.EventType.KEY_UP, this.onKeyboardUp, this);
        }

        unregisterLegacyEvent() {
          systemEvent.off(SystemEvent.EventType.KEY_DOWN, this.onKeyboardDown, this);
          systemEvent.off(SystemEvent.EventType.KEY_UP, this.onKeyboardUp, this);
        }

        onToggle(toggle) {
          this.updateEventType();
        }

        onKeyboardDown(event) {
          let keyCode = event.keyCode;
          let keyName = keyCode2KeyName[keyCode];
          console.log('key down: ', keyName);
          let keyNode = this.getChildRecursively(this.node, keyName);

          if (keyNode) {
            this.showKeyNodeWithColor(keyNode, Color.RED);
          }
        }

        onKeyboardPressing(event) {
          let keyCode = event.keyCode;
          let keyName = keyCode2KeyName[keyCode];
          console.log('key down: ', keyName);
          let keyNode = this.getChildRecursively(this.node, keyName);

          if (keyNode) {
            this.showKeyNodeWithColor(keyNode, Color.GREEN);
          }
        }

        onKeyboardUp(event) {
          let keyCode = event.keyCode;
          let keyName = keyCode2KeyName[keyCode];
          console.log('key up: ', keyName);
          let keyNode = this.getChildRecursively(this.node, keyName);

          if (keyNode) {
            this.showKeyNodeWithColor(keyNode, Color.BLUE);
          }
        }

        getChildRecursively(currentNode, name) {
          let childs = currentNode.children;

          for (let child of childs) {
            if (child.name === name) {
              return child;
            } else {
              let result = this.getChildRecursively(child, name);

              if (result) {
                return result;
              }
            }
          }

          return null;
        }

        showKeyNodeWithColor(node, color) {
          let timeoutId = this._keyNode2TimeoutId.get(node);

          if (timeoutId) {
            clearTimeout(timeoutId);
          }

          node.getComponent(Sprite).color = color;
          node.active = true;
          timeoutId = setTimeout(() => {
            node.active = false;
          }, 200);

          this._keyNode2TimeoutId.set(node, timeoutId);
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "legacyEventToggle", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "noSupport", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));
      /**
       * [1] Class member could be defined like this.
       * [2] Use `property` decorator if your want the member to be serializable.
       * [3] Your initialization goes here.
       * [4] Your update function goes here.
       *
       * Learn more about scripting: https://docs.cocos.com/creator/3.0/manual/en/scripting/
       * Learn more about CCClass: https://docs.cocos.com/creator/3.0/manual/en/scripting/ccclass.html
       * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.0/manual/en/scripting/life-cycle-callbacks.html
       */

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/migrate-canvas.ts", ['cc'], function () {
  'use strict';

  var cclegacy, director, Director, Canvas, Camera, game, Node;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      director = module.director;
      Director = module.Director;
      Canvas = module.Canvas;
      Camera = module.Camera;
      game = module.game;
      Node = module.Node;
    }],
    execute: function () {
      cclegacy._RF.push({}, "357c1B+j+ZEKrORrCBMY+0Y", "migrate-canvas", undefined);

      const customLayerMask = 0x000fffff;
      const builtinLayerMask = 0xfff00000;
      director.on(Director.EVENT_AFTER_SCENE_LAUNCH, () => {
        var _director$getScene, _director$getScene2, _director$getScene3;

        const roots = (_director$getScene = director.getScene()) === null || _director$getScene === void 0 ? void 0 : _director$getScene.children;
        let allCanvases = (_director$getScene2 = director.getScene()) === null || _director$getScene2 === void 0 ? void 0 : _director$getScene2.getComponentsInChildren(Canvas);
        if (allCanvases.length <= 1) return;
        allCanvases = allCanvases.filter(x => !!x.cameraComponent);
        let allCameras = (_director$getScene3 = director.getScene()) === null || _director$getScene3 === void 0 ? void 0 : _director$getScene3.getComponentsInChildren(Camera);
        let usedLayer = 0;
        allCameras.forEach(x => usedLayer |= x.visibility & customLayerMask);
        const persistCanvas = [];

        for (let i = 0, l = roots.length; i < l; i++) {
          const root = roots[i];
          if (!game.isPersistRootNode(root)) continue;
          const canvases = root.getComponentsInChildren(Canvas);
          if (canvases.length === 0) continue;
          persistCanvas.push(...canvases.filter(x => !!x.cameraComponent));
        }

        persistCanvas.forEach(val => {
          const isLayerCollided = allCanvases.find(x => x !== val && x.cameraComponent.visibility & val.cameraComponent.visibility & customLayerMask);

          if (isLayerCollided) {
            const availableLayers = ~usedLayer;
            const lastAvailableLayer = availableLayers & ~(availableLayers - 1);
            val.cameraComponent.visibility = lastAvailableLayer | val.cameraComponent.visibility & builtinLayerMask;
            setChildrenLayer(val.node, lastAvailableLayer);
            usedLayer |= availableLayers;
          }
        });
      });

      function setChildrenLayer(node, layer) {
        for (let i = 0, l = node.children.length; i < l; i++) {
          node.children[i].layer = layer;
          setChildrenLayer(node.children[i], layer);
        }
      }

      let setParentEngine = Node.prototype.setParent;
      {
        Node.prototype.setParent = function (value, keepWorldTransform) {
          setParentEngine.call(this, value, keepWorldTransform);
          if (!value) return; // find canvas

          let layer = getCanvasCameraLayer(this);

          if (layer) {
            this.layer = layer;
            setChildrenLayer(this, layer);
          }
        };
      }

      function getCanvasCameraLayer(node) {
        let layer = 0;
        let canvas = node.getComponent(Canvas);

        if (canvas && canvas.cameraComponent) {
          if (canvas.cameraComponent.visibility & canvas.node.layer) {
            layer = canvas.node.layer;
          } else {
            layer = canvas.cameraComponent.visibility & ~(canvas.cameraComponent.visibility - 1);
          }

          return layer;
        }

        if (node.parent) {
          layer = getCanvasCameraLayer(node.parent);
        }

        return layer;
      }

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/mouse-event.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Label, Node, _decorator, Component, sys, view, systemEvent, SystemEvent;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Label = module.Label;
      Node = module.Node;
      _decorator = module._decorator;
      Component = module.Component;
      sys = module.sys;
      view = module.view;
      systemEvent = module.systemEvent;
      SystemEvent = module.SystemEvent;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _temp;

      cclegacy._RF.push({}, "3624chdE5lPlaJCHJz9nFgZ", "mouse-event", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let systemEventPC = exports('systemEventPC', (_dec = ccclass("systemEventPC"), _dec2 = property(Label), _dec3 = property(Label), _dec4 = property(Node), _dec(_class = (_class2 = (_temp = class systemEventPC extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "labelShow", _descriptor, this);

          _initializerDefineProperty(this, "tip", _descriptor2, this);

          _initializerDefineProperty(this, "notSupported", _descriptor3, this);
        }

        onLoad() {
          if (sys.isMobile) {
            this.notSupported.active = true;
            return;
          }

          const canvasSize = view.getCanvasSize();
          this.tip.string = this.tip.string.replace('{{width}}', canvasSize.width.toString());
          this.tip.string = this.tip.string.replace('{{height}}', canvasSize.height.toString());
          systemEvent.on(SystemEvent.EventType.MOUSE_DOWN, this.onMouseDown, this);
          systemEvent.on(SystemEvent.EventType.MOUSE_UP, this.onMouseUp, this);
          systemEvent.on(SystemEvent.EventType.MOUSE_MOVE, this.onMouseMove, this);
          systemEvent.on(SystemEvent.EventType.MOUSE_WHEEL, this.onMouseScroll, this);
        }

        onDestroy() {
          systemEvent.off(SystemEvent.EventType.MOUSE_DOWN, this.onMouseDown, this);
          systemEvent.off(SystemEvent.EventType.MOUSE_UP, this.onMouseUp, this);
          systemEvent.off(SystemEvent.EventType.MOUSE_MOVE, this.onMouseMove, this);
          systemEvent.off(SystemEvent.EventType.MOUSE_WHEEL, this.onMouseScroll, this);
        }

        onMouseDown(event) {
          this.labelShow.string = `MOUSE_DOWN: ${event.getLocation()}`;
        }

        onMouseMove(event) {
          this.labelShow.string = `MOUSE_MOVE: ${event.getLocation()}`;
        }

        onMouseUp(event) {
          this.labelShow.string = `MOUSE_UP: ${event.getLocation()}`;
        }

        onMouseScroll(event) {
          this.labelShow.string = `MOUSE_SCROLL: ${event.getScrollY()}`;
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "labelShow", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "tip", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "notSupported", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/RaycastColliderTest.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, _defineProperty, cclegacy, Material, Camera, MeshRenderer, _decorator, Component, geometry, systemEvent, SystemEventType, PhysicsSystem;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Material = module.Material;
      Camera = module.Camera;
      MeshRenderer = module.MeshRenderer;
      _decorator = module._decorator;
      Component = module.Component;
      geometry = module.geometry;
      systemEvent = module.systemEvent;
      SystemEventType = module.SystemEventType;
      PhysicsSystem = module.PhysicsSystem;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _temp;

      cclegacy._RF.push({}, "37034s9FztAjYJasirfUmAr", "RaycastColliderTest", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let RaycastColliderTest = exports('RaycastColliderTest', (_dec = ccclass("RaycastColliderTest"), _dec2 = property({
        type: Material
      }), _dec3 = property({
        type: Material
      }), _dec4 = property({
        type: Camera
      }), _dec5 = property({
        type: MeshRenderer
      }), _dec(_class = (_class2 = (_temp = class RaycastColliderTest extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "defaultMaterial", _descriptor, this);

          _initializerDefineProperty(this, "rayMaterial", _descriptor2, this);

          _initializerDefineProperty(this, "cameraCom", _descriptor3, this);

          _initializerDefineProperty(this, "modelCom", _descriptor4, this);

          _defineProperty(this, "_ray", new geometry.Ray());
        }

        onEnable() {
          systemEvent.on(SystemEventType.TOUCH_START, this.onTouchStart, this);
        }

        onDisable() {
          systemEvent.off(SystemEventType.TOUCH_START, this.onTouchStart, this);
        }

        onTouchStart(touch, event) {
          this.cameraCom.screenPointToRay(touch.getLocationX(), touch.getLocationY(), this._ray);

          if (PhysicsSystem.instance.raycast(this._ray)) {
            const r = PhysicsSystem.instance.raycastResults;

            for (let i = 0; i < r.length; i++) {
              const item = r[i];

              if (item.collider.node.uuid == this.modelCom.node.uuid) {
                this.modelCom.material = this.rayMaterial;
              }
            }
          } else {
            this.modelCom.material = this.defaultMaterial;
          }
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "defaultMaterial", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "rayMaterial", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "cameraCom", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "modelCom", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/mask-use-image-stencil.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, SpriteFrame, Label, _decorator, Component, Mask;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      SpriteFrame = module.SpriteFrame;
      Label = module.Label;
      _decorator = module._decorator;
      Component = module.Component;
      Mask = module.Mask;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _temp;

      cclegacy._RF.push({}, "37545UEL51DoZgd4hrYyzOH", "mask-use-image-stencil", undefined);

      const {
        ccclass,
        type
      } = _decorator;
      let MaskUseImageStencil = exports('MaskUseImageStencil', (_dec = ccclass('MaskUseImageStencil'), _dec2 = type(SpriteFrame), _dec3 = type(Label), _dec(_class = (_class2 = (_temp = class MaskUseImageStencil extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "image", _descriptor, this);

          _initializerDefineProperty(this, "label", _descriptor2, this);
        }

        start() {
          const mask = this.getComponent(Mask);
          this.scheduleOnce(() => {
            mask.type = Mask.Type.IMAGE_STENCIL;
            this.scheduleOnce(() => {
              mask.enabled = false;
              this.scheduleOnce(() => {
                mask.type = Mask.Type.GRAPHICS_STENCIL;
                const g = mask.graphics;
                g.clear();
                g.lineWidth = 10;
                g.fillColor.fromHEX('#ff0000');
                g.moveTo(-80, 0);
                g.lineTo(0, -150);
                g.lineTo(80, 0);
                g.lineTo(0, 150);
                g.close();
                g.stroke();
                g.fill();
                mask.enabled = true;
                this.scheduleOnce(() => {
                  mask.spriteFrame = mask.spriteFrame = this.image;
                  mask.type = Mask.Type.IMAGE_STENCIL;
                  mask.alphaThreshold = 0.1;
                  this.scheduleOnce(() => {
                    mask.type = Mask.Type.RECT;
                    this.label.string = '????????????';
                  }, 2);
                }, 2);
              }, 1);
            }, 1);
          }, 2);
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "image", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "label", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/label-model-component.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, _defineProperty, cclegacy, Color, Font, _decorator, Component, quat, Vec3, Camera, Canvas, Node, UITransform, Label;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Color = module.Color;
      Font = module.Font;
      _decorator = module._decorator;
      Component = module.Component;
      quat = module.quat;
      Vec3 = module.Vec3;
      Camera = module.Camera;
      Canvas = module.Canvas;
      Node = module.Node;
      UITransform = module.UITransform;
      Label = module.Label;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _temp;

      cclegacy._RF.push({}, "378c6HWD4pOybbqKzh7da60", "label-model-component", undefined);

      const {
        ccclass,
        property,
        menu
      } = _decorator;
      let LabelModelComponent = exports('LabelModelComponent', (_dec = ccclass('LabelModelComponent'), _dec2 = menu('???????????????/LabelModel/label-model-component'), _dec3 = property({
        type: Color
      }), _dec4 = property({
        type: Font
      }), _dec(_class = _dec2(_class = (_class2 = (_temp = class LabelModelComponent extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "_string", _descriptor, this);

          _initializerDefineProperty(this, "_typeName", _descriptor2, this);

          _initializerDefineProperty(this, "_color", _descriptor3, this);

          _initializerDefineProperty(this, "_font", _descriptor4, this);

          _initializerDefineProperty(this, "_priority", _descriptor5, this);

          _defineProperty(this, "_label", null);

          _defineProperty(this, "_camera", null);

          _defineProperty(this, "_worldRot", quat());

          _defineProperty(this, "_lastCameraWPos", new Vec3());

          _defineProperty(this, "_wPos", new Vec3());

          _defineProperty(this, "_cameraWPos", new Vec3());

          _defineProperty(this, "_lastWPos", new Vec3());
        }

        get color() {
          return this._color;
        }

        set color(value) {
          this._color.set(value);
        }

        get string() {
          return this._string;
        }

        set string(value) {
          this._string = value;
        }

        get typeName() {
          return this._typeName;
        }

        set typeName(value) {
          this._typeName = value;
        }

        get font() {
          return this._font;
        }

        set font(value) {
          this._font = value;
        }

        get priority() {
          return this._priority;
        }

        set priority(value) {
          this._priority = value;
        }

        onEnable() {
          this._camera = this.node.scene.getComponentInChildren(Camera);

          if (this.labelInit()) {
            return;
          }

          const canvas = this.node.scene.getComponentInChildren(Canvas);

          if (!canvas) {
            return;
          }

          let root = canvas.node.getChildByName('label-model-manager');

          if (!root) {
            root = new Node('label-model-manager');
            root.setParent(canvas.node);
            root.setSiblingIndex(0);
            root.addComponent(UITransform);
          }

          const labelNode = new Node(this._typeName);
          labelNode.setParent(root);
          const labelTrans = labelNode.getComponent(UITransform);
          const label = labelNode.addComponent(Label);
          labelTrans.setContentSize(200, 50);
          label.horizontalAlign = Label.HorizontalAlign.CENTER;
          label.verticalAlign = Label.VerticalAlign.CENTER;
          this._label = label;
          this.labelInit();
        }

        lateUpdate() {
          this._camera.node.getWorldRotation(this._worldRot);

          this.node.setWorldRotation(this._worldRot);

          if (!this._camera || !this._label) {
            return;
          }

          this.node.getWorldPosition(this._wPos);

          this._camera.node.getWorldPosition(this._cameraWPos);

          if (this._cameraWPos.equals(this._lastCameraWPos) && this._wPos.equals(this._lastWPos)) {
            return;
          }

          this._lastCameraWPos.set(this._cameraWPos);

          this._lastWPos.set(this._wPos); // [HACK]
          // @ts-ignore


          this._camera._camera.update();

          this._camera.convertToUINode(this._wPos, this._label.node.parent, this._wPos);

          this._label.node.setPosition(this._wPos);
        }

        onDisable() {
          if (this._label) {
            this._label.node.active = false;
          }
        }

        onDestroy() {
          if (this._label && this._label.node) {
            this._label.node.destroy();
          }
        }

        labelInit() {
          if (this._label) {
            this._label.string = this._string;
            this._label.font = this._font;
            this._label.color = this._color;
            this._label.node.active = true;
            return true;
          }

          return false;
        }

      }, _temp), (_applyDecoratedDescriptor(_class2.prototype, "color", [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, "color"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "string", [property], Object.getOwnPropertyDescriptor(_class2.prototype, "string"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "typeName", [property], Object.getOwnPropertyDescriptor(_class2.prototype, "typeName"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "font", [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "font"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "priority", [property], Object.getOwnPropertyDescriptor(_class2.prototype, "priority"), _class2.prototype), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "_string", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return '';
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_typeName", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 'name-block';
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "_color", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return Color.WHITE.clone();
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "_font", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "_priority", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      })), _class2)) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/shield-node.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, TiledLayer, Prefab, _decorator, Component, v2, Vec3, instantiate, SystemEventType;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      TiledLayer = module.TiledLayer;
      Prefab = module.Prefab;
      _decorator = module._decorator;
      Component = module.Component;
      v2 = module.v2;
      Vec3 = module.Vec3;
      instantiate = module.instantiate;
      SystemEventType = module.SystemEventType;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _temp;

      cclegacy._RF.push({}, "39257srVZlHmqGvdeIRPFlt", "shield-node", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let ShieldNode = exports('ShieldNode', (_dec = ccclass('ShieldNode'), _dec2 = property({
        type: TiledLayer
      }), _dec3 = property({
        type: Prefab
      }), _dec(_class = (_class2 = (_temp = class ShieldNode extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "tiledLayer", _descriptor, this);

          _initializerDefineProperty(this, "nodePrefab", _descriptor2, this);
        }

        start() {
          this.initScene(this.nodePrefab);
        }

        initScene(prefab) {
          const posArr = [v2(-249, 96), v2(-150, 76), v2(-60, 54), v2(-248, -144), v2(-89, -34)];
          const tmpP = new Vec3();

          for (let i = 0; i < posArr.length; i++) {
            const shieldNode = instantiate(prefab);
            shieldNode.setPosition(posArr[i].x, posArr[i].y);
            this.tiledLayer.addUserNode(shieldNode);
            shieldNode.on(SystemEventType.TOUCH_MOVE, event => {
              const deltaMove = event.getUIDelta();
              shieldNode.getPosition(tmpP);
              tmpP.x += deltaMove.x;
              tmpP.y += deltaMove.y;
              shieldNode.setPosition(tmpP);
            });
          }
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "tiledLayer", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "nodePrefab", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/render-ui-to-model.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, _defineProperty, cclegacy, MeshRenderer, _decorator, Component, Canvas, RenderTexture, view;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      MeshRenderer = module.MeshRenderer;
      _decorator = module._decorator;
      Component = module.Component;
      Canvas = module.Canvas;
      RenderTexture = module.RenderTexture;
      view = module.view;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor, _temp;

      cclegacy._RF.push({}, "39d78FLjklEWZX29QTsFrlf", "render-ui-to-model", undefined);

      const {
        ccclass,
        property,
        menu
      } = _decorator;
      let RenderUIToModel = exports('RenderUIToModel', (_dec = ccclass('RenderUIToModel'), _dec2 = menu('RenderTexture/RenderUIToModel'), _dec3 = property(MeshRenderer), _dec(_class = _dec2(_class = (_class2 = (_temp = class RenderUIToModel extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "model", _descriptor, this);

          _defineProperty(this, "renderTexture", null);
        }

        start() {
          const canvas = this.getComponent(Canvas);
          const tex = new RenderTexture();
          tex.name = 'render-ui-to-model';
          const size = view.getVisibleSize();
          tex.reset({
            width: size.width,
            height: size.height
          });
          this.renderTexture = tex;
          canvas.targetTexture = tex;
          const mat = this.model.material;
          mat.setProperty('mainTexture', tex);
        }

        onDestroy() {
          if (this.renderTexture) {
            this.renderTexture.destroy();
            this.renderTexture = null;
          }
        }

      }, _temp), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "model", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _class2)) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/SpineSkin.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, _defineProperty, cclegacy, sp, _decorator, Component;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      sp = module.sp;
      _decorator = module._decorator;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor, _temp;

      cclegacy._RF.push({}, "3f265FzgzJO6pzW2KvpATcO", "SpineSkin", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let SpineSkin = exports('SpineSkin', (_dec = ccclass('SpineSkin'), _dec2 = property({
        type: sp.Skeleton
      }), _dec(_class = (_class2 = (_temp = class SpineSkin extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "spine", _descriptor, this);

          _defineProperty(this, "skinId", 0);
        }

        start() {// Your initialization goes here.
        }

        change() {
          const skins = ['girl', 'boy', 'girl-blue-cape', 'girl-spring-dress'].map(x => `full-skins/${x}`);
          this.skinId = (this.skinId + 1) % skins.length;
          this.spine.setSkin(skins[this.skinId]);
        } // update (deltaTime: number) {
        //     // Your update function goes here.
        // }


      }, _temp), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "spine", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/sport_light_2.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _defineProperty, cclegacy, _decorator, Component, Vec3;

  return {
    setters: [function (module) {
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Component = module.Component;
      Vec3 = module.Vec3;
    }],
    execute: function () {
      var _dec, _class, _temp;

      cclegacy._RF.push({}, "4078agfjjFO0bRMuakuCcmd", "sport_light_2", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let sport_light_1 = exports('sport_light_1', (_dec = ccclass('sport_light_2'), _dec(_class = (_temp = class sport_light_1 extends Component {
        constructor(...args) {
          super(...args);

          _defineProperty(this, "_nowA", new Vec3());

          _defineProperty(this, "_time", 0);
        }

        start() {
          // Your initialization goes here.
          this._nowA = this.node.eulerAngles;
        }

        update(deltaTime) {
          // Your update function goes here.
          this._time += 0.01;
          this._nowA.x = (Math.cos(this._time) + 1.0) * 0.5 * -90.0 - 90.0;
          this.node.setRotationFromEuler(this._nowA.x, this._nowA.y, this._nowA.z);
        }

      }, _temp)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/static-ui.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Label, UIStaticBatch, _decorator, Component, sys, director;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Label = module.Label;
      UIStaticBatch = module.UIStaticBatch;
      _decorator = module._decorator;
      Component = module.Component;
      sys = module.sys;
      director = module.director;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _temp;

      cclegacy._RF.push({}, "408fcDtyplHQJTZZxumfuDE", "static-ui", undefined);

      const {
        ccclass,
        property,
        menu
      } = _decorator;
      let StaticUI = exports('StaticUI', (_dec = ccclass("StaticUI"), _dec2 = menu('UI/StaticUI'), _dec3 = property(Label), _dec4 = property({
        type: [UIStaticBatch]
      }), _dec(_class = _dec2(_class = (_class2 = (_temp = class StaticUI extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "tipLabel", _descriptor, this);

          _initializerDefineProperty(this, "newSceneName", _descriptor2, this);

          _initializerDefineProperty(this, "uiStaticBatchCompList", _descriptor3, this);
        }

        start() {
          this.scheduleOnce(this.func, 1.5);
          const local = sys.localStorage;
          const item = local.getItem('ui-static-level');

          if (item) {
            this.tipLabel.string = `??? ${parseInt(item)} ?????????`;
          } else {
            this.tipLabel.string = `??? 0 ?????????`;
          }

          for (let i = 0; i < this.uiStaticBatchCompList.length; i++) {
            const element = this.uiStaticBatchCompList[i];
            element.markAsDirty();
          }
        }

        func() {
          const local = sys.localStorage;
          const item = local.getItem('ui-static-level');

          if (item) {
            let level = parseInt(item);

            if (level > 5) {
              local.removeItem('ui-static-level');
              return;
            }

            level++;

            if (this.newSceneName === 'static-ui') {
              local.setItem('ui-static-level', `${level}`);
            }
          } else if (this.newSceneName === 'static-ui') {
            local.setItem('ui-static-level', '1');
          }

          director.loadScene(this.newSceneName);
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "tipLabel", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "newSceneName", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return '';
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "uiStaticBatchCompList", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      })), _class2)) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/TweenThen.ts", ['cc'], function (exports) {
  'use strict';

  var cclegacy, Component, tween, Vec3, _decorator;

  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Component = module.Component;
      tween = module.tween;
      Vec3 = module.Vec3;
      _decorator = module._decorator;
    }],
    execute: function () {
      var _dec, _dec2, _class;

      cclegacy._RF.push({}, "41b6eByJ95GqoEm8dx4EHvo", "TweenThen", undefined);

      const {
        ccclass,
        property,
        menu
      } = _decorator;
      let TweenThen = exports('TweenThen', (_dec = ccclass("TweenThen"), _dec2 = menu("tween/TweenThen"), _dec(_class = _dec2(_class = class TweenThen extends Component {
        onLoad() {
          let scale = tween().to(1, {
            scale: new Vec3(2, 2, 2)
          });
          let rotate = tween().to(1, {
            eulerAngles: new Vec3(45, 45, 45)
          });
          let move = tween().to(1, {
            position: new Vec3(0, 5, 0)
          }); // ?????????????????????????????????

          this.tweenThen = tween(this.node).then(scale).then(rotate).then(move);
        }

        onEnable() {
          this.tweenThen.start();
        }

        onDisable() {
          this.tweenThen.stop();
        }

      }) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/acceleration-event.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, _defineProperty, cclegacy, Node, Label, _decorator, Component, Vec2, systemEvent, SystemEventType;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      Label = module.Label;
      _decorator = module._decorator;
      Component = module.Component;
      Vec2 = module.Vec2;
      systemEvent = module.systemEvent;
      SystemEventType = module.SystemEventType;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _descriptor3, _temp;

      cclegacy._RF.push({}, "44134JoDuRB5akTgWYcuSTB", "acceleration-event", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let accelerationEvent = exports('accelerationEvent', (_dec = ccclass('accelerationEvent'), _dec2 = property(Node), _dec3 = property(Label), _dec(_class = (_class2 = (_temp = class accelerationEvent extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "target", _descriptor, this);

          _initializerDefineProperty(this, "btnLabel", _descriptor2, this);

          _initializerDefineProperty(this, "speed", _descriptor3, this);

          _defineProperty(this, "acc", new Vec2(0, 0));

          _defineProperty(this, "accelerometerEnable", false);

          _defineProperty(this, "_skipCallback", false);
        }

        start() {
          this.accelerometerEnable = false;
          systemEvent.setAccelerometerInterval(0.5);
          systemEvent.on(SystemEventType.DEVICEMOTION, this.moveBall, this);
        }

        onDestroy() {
          systemEvent.off(SystemEventType.DEVICEMOTION, this.moveBall, this);
        }

        update(dt) {
          let pos = this.target.position;
          this.target.setPosition(pos.x + this.acc.x * dt * this.speed, pos.y);
          pos = this.target.position;
          this.target.setPosition(pos.x, pos.y, pos.z + -this.acc.y * dt * this.speed);
        }

        moveBall(event) {
          // on some platforms, stopping accelerometer is an asynchronous operation.
          // need to skip this callback after stopping.
          if (this._skipCallback) {
            return;
          }

          this.acc.x = event.acc.x;
          this.acc.y = event.acc.y;
        }

        onOpenAccelerometer() {
          this.accelerometerEnable = !this.accelerometerEnable;

          if (this.accelerometerEnable) {
            this.btnLabel.string = 'Accelerometer On';
          } else {
            this.btnLabel.string = 'Accelerometer Off';
          }

          if (!this.accelerometerEnable) {
            this.acc.x = 0;
            this.acc.y = 0;
          }

          systemEvent.setAccelerometerEnabled(this.accelerometerEnable);
          this._skipCallback = !this.accelerometerEnable;
        }

        resetPosition() {
          this.target.setPosition(0, 0.5, 0);
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "target", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "btnLabel", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "speed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 10;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/first-person-camera.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, _defineProperty, cclegacy, KeyCode, _decorator, math, Component, systemEvent, SystemEvent, game;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      KeyCode = module.KeyCode;
      _decorator = module._decorator;
      math = module.math;
      Component = module.Component;
      systemEvent = module.systemEvent;
      SystemEvent = module.SystemEvent;
      game = module.game;
    }],
    execute: function () {
      var _dec, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _temp;

      cclegacy._RF.push({}, "445598TP61LhoVLGOAdP05g", "first-person-camera", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      const {
        Vec2,
        Vec3,
        Quat
      } = math;
      const v2_1 = new Vec2();
      const v2_2 = new Vec2();
      const v3_1 = new Vec3();
      const qt_1 = new Quat();
      const KEYCODE = {
        W: 'W'.charCodeAt(0),
        S: 'S'.charCodeAt(0),
        A: 'A'.charCodeAt(0),
        D: 'D'.charCodeAt(0),
        Q: 'Q'.charCodeAt(0),
        E: 'E'.charCodeAt(0),
        SHIFT: KeyCode.SHIFT_LEFT
      };
      let FirstPersonCamera = exports('FirstPersonCamera', (_dec = property({
        slide: true,
        range: [0.05, 0.5, 0.01]
      }), ccclass(_class = (_class2 = (_temp = class FirstPersonCamera extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "moveSpeed", _descriptor, this);

          _initializerDefineProperty(this, "moveSpeedShiftScale", _descriptor2, this);

          _initializerDefineProperty(this, "damp", _descriptor3, this);

          _initializerDefineProperty(this, "rotateSpeed", _descriptor4, this);

          _defineProperty(this, "_euler", new Vec3());

          _defineProperty(this, "_velocity", new Vec3());

          _defineProperty(this, "_position", new Vec3());

          _defineProperty(this, "_speedScale", 1);
        }

        onLoad() {
          systemEvent.on(SystemEvent.EventType.MOUSE_WHEEL, this.onMouseWheel, this);
          systemEvent.on(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
          systemEvent.on(SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
          systemEvent.on(SystemEvent.EventType.TOUCH_START, this.onTouchStart, this);
          systemEvent.on(SystemEvent.EventType.TOUCH_MOVE, this.onTouchMove, this);
          systemEvent.on(SystemEvent.EventType.TOUCH_END, this.onTouchEnd, this);
          Vec3.copy(this._euler, this.node.eulerAngles);
          Vec3.copy(this._position, this.node.position);
        }

        onDestroy() {
          systemEvent.off(SystemEvent.EventType.MOUSE_WHEEL, this.onMouseWheel, this);
          systemEvent.off(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
          systemEvent.off(SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
          systemEvent.off(SystemEvent.EventType.TOUCH_START, this.onTouchStart, this);
          systemEvent.off(SystemEvent.EventType.TOUCH_MOVE, this.onTouchMove, this);
          systemEvent.off(SystemEvent.EventType.TOUCH_END, this.onTouchEnd, this);
        }

        update(dt) {
          const t = Math.min(dt / this.damp, 1); // position

          Vec3.transformQuat(v3_1, this._velocity, this.node.rotation);
          Vec3.scaleAndAdd(this._position, this._position, v3_1, this.moveSpeed * this._speedScale);
          Vec3.lerp(v3_1, this.node.position, this._position, t);
          this.node.setPosition(v3_1); // rotation

          Quat.fromEuler(qt_1, this._euler.x, this._euler.y, this._euler.z);
          Quat.slerp(qt_1, this.node.rotation, qt_1, t);
          this.node.setRotation(qt_1);
        }

        onMouseWheel(e) {
          const delta = -e.getScrollY() * this.moveSpeed * 0.1; // delta is positive when scroll down

          Vec3.transformQuat(v3_1, Vec3.UNIT_Z, this.node.rotation);
          Vec3.scaleAndAdd(this._position, this.node.position, v3_1, delta);
        }

        onKeyDown(e) {
          const v = this._velocity;

          if (e.keyCode === KEYCODE.SHIFT) {
            this._speedScale = this.moveSpeedShiftScale;
          } else if (e.keyCode === KEYCODE.W) {
            if (v.z === 0) {
              v.z = -1;
            }
          } else if (e.keyCode === KEYCODE.S) {
            if (v.z === 0) {
              v.z = 1;
            }
          } else if (e.keyCode === KEYCODE.A) {
            if (v.x === 0) {
              v.x = -1;
            }
          } else if (e.keyCode === KEYCODE.D) {
            if (v.x === 0) {
              v.x = 1;
            }
          } else if (e.keyCode === KEYCODE.Q) {
            if (v.y === 0) {
              v.y = -1;
            }
          } else if (e.keyCode === KEYCODE.E) {
            if (v.y === 0) {
              v.y = 1;
            }
          }
        }

        onKeyUp(e) {
          const v = this._velocity;

          if (e.keyCode === KEYCODE.SHIFT) {
            this._speedScale = 1;
          } else if (e.keyCode === KEYCODE.W) {
            if (v.z < 0) {
              v.z = 0;
            }
          } else if (e.keyCode === KEYCODE.S) {
            if (v.z > 0) {
              v.z = 0;
            }
          } else if (e.keyCode === KEYCODE.A) {
            if (v.x < 0) {
              v.x = 0;
            }
          } else if (e.keyCode === KEYCODE.D) {
            if (v.x > 0) {
              v.x = 0;
            }
          } else if (e.keyCode === KEYCODE.Q) {
            if (v.y < 0) {
              v.y = 0;
            }
          } else if (e.keyCode === KEYCODE.E) {
            if (v.y > 0) {
              v.y = 0;
            }
          }
        }

        onTouchStart() {
          if (game.canvas['requestPointerLock']) {
            game.canvas.requestPointerLock();
          }
        }

        onTouchMove(t, e) {
          e.getStartLocation(v2_1);

          if (v2_1.x > game.canvas.width * 0.4) {
            // rotation
            e.getDelta(v2_2);
            this._euler.y -= v2_2.x * this.rotateSpeed * 0.1;
            this._euler.x += v2_2.y * this.rotateSpeed * 0.1;
          } else {
            // position
            e.getLocation(v2_2);
            Vec2.subtract(v2_2, v2_2, v2_1);
            this._velocity.x = v2_2.x * 0.01;
            this._velocity.z = -v2_2.y * 0.01;
          }
        }

        onTouchEnd(t, e) {
          if (document.exitPointerLock) {
            document.exitPointerLock();
          }

          e.getStartLocation(v2_1);

          if (v2_1.x < game.canvas.width * 0.4) {
            // position
            this._velocity.x = 0;
            this._velocity.z = 0;
          }
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "moveSpeed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "moveSpeedShiftScale", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 5;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "damp", [_dec], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.2;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "rotateSpeed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/fill-sprite.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, _defineProperty, cclegacy, Label, Sprite, _decorator, Component;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Label = module.Label;
      Sprite = module.Sprite;
      _decorator = module._decorator;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _temp;

      cclegacy._RF.push({}, "44cd8itOoFJP6edfxYpJg8o", "fill-sprite", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let FillSprite = exports('FillSprite', (_dec = ccclass("FillSprite"), _dec2 = property({
        type: Label
      }), _dec3 = property({
        type: Sprite
      }), _dec4 = property({
        type: Label
      }), _dec5 = property({
        type: Sprite
      }), _dec6 = property({
        type: Label
      }), _dec7 = property({
        type: Sprite
      }), _dec8 = property({
        type: Label
      }), _dec9 = property({
        type: Sprite
      }), _dec10 = property({
        type: Label
      }), _dec11 = property({
        type: Sprite
      }), _dec(_class = (_class2 = (_temp = class FillSprite extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "hlabel", _descriptor, this);

          _initializerDefineProperty(this, "hhorizontal", _descriptor2, this);

          _initializerDefineProperty(this, "vlabel", _descriptor3, this);

          _initializerDefineProperty(this, "vhorizontal", _descriptor4, this);

          _initializerDefineProperty(this, "mclabel", _descriptor5, this);

          _initializerDefineProperty(this, "mc", _descriptor6, this);

          _initializerDefineProperty(this, "lblabel", _descriptor7, this);

          _initializerDefineProperty(this, "lb", _descriptor8, this);

          _initializerDefineProperty(this, "rblabel", _descriptor9, this);

          _initializerDefineProperty(this, "rb", _descriptor10, this);

          _defineProperty(this, "timer", 0);

          _defineProperty(this, "lTimer", 0);

          _defineProperty(this, "rTimer", 0.2);
        }

        vh(num) {
          this.vhorizontal.getComponent(Sprite).fillRange = num;
          this.hhorizontal.getComponent(Sprite).fillRange = num;
          this.mc.getComponent(Sprite).fillRange = num;
        }

        update(deltaTime) {
          this.timer += 0.1 * deltaTime;

          if (this.timer > 1) {
            this.timer = 0;
          }

          this.lTimer += 0.1 * deltaTime;

          if (this.lTimer > 0.3) {
            this.lTimer = 0;
          }

          this.rTimer += 0.1 * deltaTime;

          if (this.rTimer > 0.5) {
            this.rTimer = 0.2;
          }

          this.vh(this.timer);
          this.lb.getComponent(Sprite).fillRange = this.lTimer;
          this.rb.getComponent(Sprite).fillRange = this.rTimer;
          this.vlabel.getComponent(Label).string = '??????????????????????????? ' + Math.floor(this.timer * 100) + '%';
          this.hlabel.getComponent(Label).string = '??????????????????????????? ' + Math.floor(this.timer * 100) + '%';
          this.mclabel.getComponent(Label).string = 'center(0.5, 0.5) rang ' + Math.floor(this.timer * 100) / 100;
          this.lblabel.getComponent(Label).string = 'center(0, 0) rang ' + Math.floor(this.lTimer * 100) / 100;
          this.rblabel.getComponent(Label).string = 'center(1, 0) rang ' + Math.floor(this.rTimer * 100) / 100;
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "hlabel", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "hhorizontal", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "vlabel", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "vhorizontal", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "mclabel", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "mc", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "lblabel", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "lb", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "rblabel", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "rb", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/visibility-changed.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Node, _decorator, Component;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      _decorator = module._decorator;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor, _temp;

      cclegacy._RF.push({}, "4718c1lvcRNgoBh13xZK3lW", "visibility-changed", undefined);

      const {
        ccclass,
        property,
        menu
      } = _decorator;
      let VisibilityChanged = exports('VisibilityChanged', (_dec = ccclass("VisibilityChanged"), _dec2 = menu('UI/VisibilityChanged'), _dec3 = property(Node), _dec(_class = _dec2(_class = (_class2 = (_temp = class VisibilityChanged extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "target", _descriptor, this);
        }

        start() {
          this.scheduleOnce(() => {
            this.node.setParent(this.target);
            this.node.walk(child => {
              child.layer = this.target.layer;
            });
          }, 1);
        }

      }, _temp), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "target", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _class2)) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/LoadRes_example.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _defineProperty, _initializerDefineProperty, cclegacy, Node, _decorator, Component, SpriteAtlas, loader, Layers, Sprite, Prefab, instantiate, director;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _defineProperty = module.defineProperty;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      _decorator = module._decorator;
      Component = module.Component;
      SpriteAtlas = module.SpriteAtlas;
      loader = module.loader;
      Layers = module.Layers;
      Sprite = module.Sprite;
      Prefab = module.Prefab;
      instantiate = module.instantiate;
      director = module.director;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor, _temp;

      cclegacy._RF.push({}, "4b343jq4LREvorHBiCggFf4", "LoadRes_example", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      const builtInEffectList = ['711ebe11-f673-4cd9-9a83-63c60ba54c5b.json', '971bdb23-3ff6-43eb-b422-1c30165a3663.json', '17debcc3-0a6b-4b8a-b00b-dc58b885581e.json', 'd1346436-ac96-4271-b863-1f4fdead95b0.json', '60f7195c-ec2a-45eb-ba94-8955f60e81d0.json', '1baf0fc9-befa-459c-8bdd-af1a450a0319.json', '1d08ef62-a503-4ce2-8b9a-46c90873f7d3.json', 'a7612b54-35e3-4238-a1a9-4a7b54635839.json', 'a3cd009f-0ab0-420d-9278-b9fdab939bbc.json'];
      let LoadResExample = exports('LoadResExample', (_dec = ccclass("LoadResExample"), _dec2 = property({
        type: Node
      }), _dec(_class = (_class2 = (_temp = class LoadResExample extends Component {
        constructor(...args) {
          super(...args);

          _defineProperty(this, "_url", ["test_assets/atlas", "test_assets/prefab"]);

          _initializerDefineProperty(this, "content", _descriptor, this);
        }

        loadSpriteFrame() {
          const url = this._url[0];

          this._releaseResource(url, SpriteAtlas);

          loader.loadRes(url, SpriteAtlas, (err, atlas) => {
            this._removeAllChildren();

            loader.setAutoRelease(atlas, true);
            const node = new Node();
            node.layer = Layers.Enum.UI_2D;
            this.content.addChild(node);
            node.setPosition(0, 0, 0);
            const sprite = node.addComponent(Sprite);
            sprite.spriteFrame = atlas.getSpriteFrame('sheep_run_0');
          });
        }

        loadPrefab() {
          const url = this._url[1];

          this._releaseResource(url, Prefab);

          loader.loadRes(url, Prefab, (err, prefab) => {
            this._removeAllChildren();

            loader.setAutoRelease(prefab, true);
            const node = instantiate(prefab);
            node.layer = Layers.Enum.UI_2D;
            this.content.addChild(node);
            node.setPosition(0, 0, 0);
          });
        }

        onDisable() {
          this._releaseResource(this._url[0], SpriteAtlas);

          this._releaseResource(this._url[1], Prefab);
        }

        _removeAllChildren() {
          this.content.removeAllChildren();
        }

        _releaseResource(url, type) {
          this._removeAllChildren();

          const res = loader.getRes(url, type);
          const all = loader.getDependsRecursively(res);

          this._removeBuiltInEffect(all);

          loader.release(all);
        }

        _removeBuiltInEffect(deps) {
          let cache = [];

          for (let i = 0; i < deps.length; i++) {
            for (let j = 0; j < builtInEffectList.length; j++) {
              if (deps[i].includes(builtInEffectList[j])) {
                cache.push(i);
              }
            }
          }

          for (let k = 0; k < cache.length; k++) {
            delete deps[cache[k]];
          }

          cache = [];
        }

        backToAssetLoading() {
          director.loadScene('AssetLoading');
        }

      }, _temp), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "content", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/list-view-ctrl.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, _defineProperty, cclegacy, Vec3, Node, ScrollView, Button, Label, _decorator, Component, instantiate, UITransform, error;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Vec3 = module.Vec3;
      Node = module.Node;
      ScrollView = module.ScrollView;
      Button = module.Button;
      Label = module.Label;
      _decorator = module._decorator;
      Component = module.Component;
      instantiate = module.instantiate;
      UITransform = module.UITransform;
      error = module.error;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _temp;

      cclegacy._RF.push({}, "4cd67QgY99J/q8+hpaUQjt0", "list-view-ctrl", undefined);

      const {
        ccclass,
        property,
        menu
      } = _decorator;

      const _temp_vec3 = new Vec3();

      let ListViewCtrl = exports('ListViewCtrl', (_dec = ccclass("ListViewCtrl"), _dec2 = menu('UI/ListViewCtrl'), _dec3 = property(Node), _dec4 = property(ScrollView), _dec5 = property(Button), _dec6 = property(Button), _dec7 = property(Button), _dec8 = property(Label), _dec9 = property(Label), _dec(_class = _dec2(_class = (_class2 = (_temp = class ListViewCtrl extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "itemTemplate", _descriptor, this);

          _initializerDefineProperty(this, "scrollView", _descriptor2, this);

          _initializerDefineProperty(this, "spawnCount", _descriptor3, this);

          _initializerDefineProperty(this, "totalCount", _descriptor4, this);

          _initializerDefineProperty(this, "spacing", _descriptor5, this);

          _initializerDefineProperty(this, "bufferZone", _descriptor6, this);

          _initializerDefineProperty(this, "btnAddItem", _descriptor7, this);

          _initializerDefineProperty(this, "btnRemoveItem", _descriptor8, this);

          _initializerDefineProperty(this, "btnJumpToPosition", _descriptor9, this);

          _initializerDefineProperty(this, "lblJumpPosition", _descriptor10, this);

          _initializerDefineProperty(this, "lblTotalItems", _descriptor11, this);

          _defineProperty(this, "_content", null);

          _defineProperty(this, "_items", []);

          _defineProperty(this, "_updateTimer", 0);

          _defineProperty(this, "_updateInterval", 0.2);

          _defineProperty(this, "_lastContentPosY", 0);
        }

        onLoad() {
          this._content = this.scrollView.content;
          this.initialize();
          this._updateTimer = 0;
          this._updateInterval = 0.2;
          this._lastContentPosY = 0; // use this variable to detect if we are scrolling up or down
        } // ????????? item


        initialize() {
          this._itemTemplateUITrans = this.itemTemplate._uiProps.uiTransformComp;
          this._contentUITrans = this._content._uiProps.uiTransformComp;
          this._contentUITrans.height = this.totalCount * (this._itemTemplateUITrans.height + this.spacing) + this.spacing; // get total content height

          for (let i = 0; i < this.spawnCount; ++i) {
            // spawn items, we only need to do this once
            let item = instantiate(this.itemTemplate);

            this._content.addChild(item);

            let itemUITrans = item._uiProps.uiTransformComp;
            item.setPosition(0, -itemUITrans.height * (0.5 + i) - this.spacing * (i + 1), 0);
            const labelComp = item.getComponentInChildren(Label);
            labelComp.string = `item_${i}`;

            this._items.push(item);
          }
        }

        getPositionInView(item) {
          // get item position in scrollview's node space
          let worldPos = item.parent.getComponent(UITransform).convertToWorldSpaceAR(item.position);
          let viewPos = this.scrollView.node.getComponent(UITransform).convertToNodeSpaceAR(worldPos);
          return viewPos;
        }

        update(dt) {
          this._updateTimer += dt;
          if (this._updateTimer < this._updateInterval) return; // we don't need to do the math every frame

          this._updateTimer = 0;
          let items = this._items;
          let buffer = this.bufferZone;
          let isDown = this.scrollView.content.position.y < this._lastContentPosY; // scrolling direction

          let offset = (this._itemTemplateUITrans.height + this.spacing) * items.length;

          for (let i = 0; i < items.length; ++i) {
            let viewPos = this.getPositionInView(items[i]);
            items[i].getPosition(_temp_vec3);

            if (isDown) {
              // if away from buffer zone and not reaching top of content
              if (viewPos.y < -buffer && _temp_vec3.y + offset < 0) {
                _temp_vec3.y += offset;
                items[i].setPosition(_temp_vec3);
              }
            } else {
              // if away from buffer zone and not reaching bottom of content
              if (viewPos.y > buffer && _temp_vec3.y - offset > -this._contentUITrans.height) {
                _temp_vec3.y -= offset;
                items[i].setPosition(_temp_vec3);
              }
            }
          } // update lastContentPosY


          this._lastContentPosY = this.scrollView.content.position.y;
          this.lblTotalItems.string = "Total Items: " + this.totalCount;
        }

        addItem() {
          this._contentUITrans.height = (this.totalCount + 1) * (this._itemTemplateUITrans.height + this.spacing) + this.spacing; // get total content height

          this.totalCount = this.totalCount + 1;
        }

        removeItem() {
          if (this.totalCount - 1 < 30) {
            error("can't remove item less than 30!");
            return;
          }

          this._contentUITrans.height = (this.totalCount - 1) * (this._itemTemplateUITrans.height + this.spacing) + this.spacing; // get total content height

          this.totalCount = this.totalCount - 1;
          this.moveBottomItemToTop();
        }

        moveBottomItemToTop() {
          let offset = (this._itemTemplateUITrans.height + this.spacing) * this._items.length;
          let length = this._items.length;
          let item = this.getItemAtBottom();
          item.getPosition(_temp_vec3); // whether need to move to top

          if (_temp_vec3.y + offset < 0) {
            _temp_vec3.y = _temp_vec3.y + offset;
            item.setPosition(_temp_vec3);
          }
        }

        getItemAtBottom() {
          let item = this._items[0];

          for (let i = 1; i < this._items.length; ++i) {
            if (item.position.y > this._items[i].position.y) {
              item = this._items[i];
            }
          }

          return item;
        }

        scrollToFixedPosition() {
          this.scrollView.scrollToOffset(new Vec3(0, 500, 0), 2, true);
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "itemTemplate", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "scrollView", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "spawnCount", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "totalCount", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "spacing", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "bufferZone", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "btnAddItem", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "btnRemoveItem", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "btnJumpToPosition", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "lblJumpPosition", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "lblTotalItems", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/MorphController.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _defineProperty, _initializerDefineProperty, cclegacy, Prefab, Layout, CCFloat, _decorator, Component, MeshRenderer, instantiate, find, Label, Slider, EventHandler;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _defineProperty = module.defineProperty;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Prefab = module.Prefab;
      Layout = module.Layout;
      CCFloat = module.CCFloat;
      _decorator = module._decorator;
      Component = module.Component;
      MeshRenderer = module.MeshRenderer;
      instantiate = module.instantiate;
      find = module.find;
      Label = module.Label;
      Slider = module.Slider;
      EventHandler = module.EventHandler;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _temp;

      cclegacy._RF.push({}, "4e36bPGhGpItLiswUnsyx0x", "MorphController", undefined);

      const {
        ccclass,
        property,
        executeInEditMode
      } = _decorator;
      let MorphController = exports('MorphController', (_dec = ccclass('MorphController'), _dec2 = property({
        type: Prefab
      }), _dec3 = property({
        type: Layout
      }), _dec4 = property({
        type: [CCFloat],
        range: [0, 1, 0.1],
        slide: true
      }), _dec(_class = executeInEditMode(_class = (_class2 = (_temp = class MorphController extends Component {
        constructor(...args) {
          super(...args);

          _defineProperty(this, "_weightsControl", []);

          _defineProperty(this, "_modelComp", null);

          _defineProperty(this, "_totalTargets", 0);

          _initializerDefineProperty(this, "controlItemPrfb", _descriptor, this);

          _initializerDefineProperty(this, "itemLayout", _descriptor2, this);
        }

        get weightsControl() {
          return this._weightsControl;
        }

        set weightsControl(value) {
          // undo???????????????????????????????????????set?????????fix
          if (value.length != this._totalTargets) {
            return;
          }

          this._weightsControl = value;
          this.setWeights(this._weightsControl);
        }

        setWeights(weights) {
          if (weights.length === 0) {
            return;
          }

          for (let iSubMeshMorph = 0; iSubMeshMorph < this._morph.subMeshMorphs.length; ++iSubMeshMorph) {
            if (this._morph.subMeshMorphs[iSubMeshMorph]) {
              this._modelComp.setWeights(weights, iSubMeshMorph);
            }
          }
        }

        start() {
          this._modelComp = this.node.getComponent(MeshRenderer);

          if (!this._modelComp) {
            return;
          }

          const mesh = this._modelComp.mesh;

          if (!mesh) {
            return;
          }

          this._morph = mesh.struct.morph;

          if (!this._morph) {
            return;
          }

          if (this._morph.subMeshMorphs.length === 0) {
            // TODO submeshcount???0
            console.warn('submesh count is 0');
            return;
          }

          const firstNonNullSubMeshMorph = this._morph.subMeshMorphs.find(subMeshMorph => !!subMeshMorph);

          if (!firstNonNullSubMeshMorph) {
            // TODO ?????? submesh ?????????Morph
            console.warn(`all submesh don't have morph`);
            return;
          }

          if (!this._morph.subMeshMorphs.every(subMeshMorph => !subMeshMorph || subMeshMorph.targets.length === firstNonNullSubMeshMorph.targets.length)) {
            // TODO ?????? submesh ???target???????????????
            console.warn(`not all submesh count are the same`);
          }

          const subMeshMorph = this._morph.subMeshMorphs[0];
          const nTargets = subMeshMorph ? subMeshMorph.targets.length : 0;
          this._totalTargets = nTargets;
          this.weightsControl = new Array(nTargets).fill(0);
          {
            this.initUI();
          }
        }

        initUI() {
          for (let i = 0; i < this._totalTargets; i++) {
            var _find, _find2;

            let controlItem = instantiate(this.controlItemPrfb);
            controlItem.parent = this.itemLayout.node;
            let nameLabel = (_find = find('Name', controlItem)) === null || _find === void 0 ? void 0 : _find.getComponent(Label);

            if (nameLabel) {
              nameLabel.string = '' + i;
            }

            let slider = (_find2 = find('Slider', controlItem)) === null || _find2 === void 0 ? void 0 : _find2.getComponent(Slider);
            let sliderEventHandler = new EventHandler();
            sliderEventHandler.target = this.node;
            sliderEventHandler.handler = "onSliderChanged";
            sliderEventHandler.component = "MorphController";
            sliderEventHandler.customEventData = '' + i;
            slider === null || slider === void 0 ? void 0 : slider.slideEvents.push(sliderEventHandler);
          }
        }

        onSliderChanged(target, customEventData) {
          let index = Number.parseInt(customEventData);
          this.weightsControl[index] = target.progress;
          this.weightsControl = this.weightsControl;
        } // update (deltaTime: number) {
        //     // Your update function goes here.
        // }


      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "controlItemPrfb", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "itemLayout", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _applyDecoratedDescriptor(_class2.prototype, "weightsControl", [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "weightsControl"), _class2.prototype)), _class2)) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/listitem.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc', './scenelist.ts', './backbutton.ts'], function (exports) {
  'use strict';

  var _defineProperty, cclegacy, _decorator, Component, Label, director, sceneArray, BackButton;

  return {
    setters: [function (module) {
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Component = module.Component;
      Label = module.Label;
      director = module.director;
    }, function (module) {
      sceneArray = module.sceneArray;
    }, function (module) {
      BackButton = module.BackButton;
    }],
    execute: function () {
      var _dec, _class, _temp;

      cclegacy._RF.push({}, "4fa73P9DaREY7uj4BrhuimX", "listitem", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let ListItem = exports('ListItem', (_dec = ccclass("ListItem"), _dec(_class = (_temp = class ListItem extends Component {
        constructor(...args) {
          super(...args);

          _defineProperty(this, "index", -1);

          _defineProperty(this, "_name", "");

          _defineProperty(this, "label", null);
        }

        onload() {}

        start() {
          // Your initialization goes here.
          this.index = this.node.getSiblingIndex();
          this._name = "";

          if (this.node) {
            this.label = this.node.getComponentInChildren(Label);
          }

          this.updateItem(this.index, sceneArray[this.index]);
        }

        loadScene() {
          BackButton.saveOffset();
          BackButton.saveIndex(this.index);
          director.loadScene(this._name);
        }

        updateItem(idx, name) {
          this.index = idx;
          this._name = name;

          if (this.label) {
            this.label.string = name;
          }
        }

      }, _temp)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/TweenStop.ts", ['cc'], function (exports) {
  'use strict';

  var cclegacy, Component, tween, Vec3, Quat, _decorator;

  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Component = module.Component;
      tween = module.tween;
      Vec3 = module.Vec3;
      Quat = module.Quat;
      _decorator = module._decorator;
    }],
    execute: function () {
      var _dec, _dec2, _class;

      cclegacy._RF.push({}, "5372db1ch5D9rAE0w2hyKmg", "TweenStop", undefined);

      const {
        ccclass,
        property,
        menu
      } = _decorator;
      let TweenStop = exports('TweenStop', (_dec = ccclass("TweenStop"), _dec2 = menu("tween/TweenStop"), _dec(_class = _dec2(_class = class TweenStop extends Component {
        onLoad() {
          let scale = tween().to(1, {
            scale: new Vec3(3, 3, 3)
          });
          let rotate = tween().to(1, {
            rotation: new Quat(Math.sin(60), Math.sin(60), Math.sin(60), Math.cos(60))
          });
          this.tweenStop = tween(this.node).then(scale).call(() => {
            // ????????????
            this.tweenStop.stop();
          }).then(rotate);
        }

        onEnable() {
          this.tweenStop.start();
        }

        onDisable() {
          this.tweenStop.stop();
        }

      }) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/SpineMeshEffect.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, _defineProperty, cclegacy, sp, _decorator, Component, Size;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      sp = module.sp;
      _decorator = module._decorator;
      Component = module.Component;
      Size = module.Size;
    }],
    execute: function () {
      var _dec, _dec2, _class2, _class3, _descriptor, _temp;

      cclegacy._RF.push({}, "57b56AV9fFA5brJJCNWOURt", "SpineMeshEffect", undefined);

      const {
        ccclass,
        property
      } = _decorator;

      let _class = exports('default', (_dec = ccclass('SpineMeshEffect'), _dec2 = property({
        type: sp.Skeleton
      }), _dec(_class2 = (_class3 = (_temp = class _class3 extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "skeleton", _descriptor, this);

          _defineProperty(this, "_swirlTime", 0);

          _defineProperty(this, "_maxEffect", 0);

          _defineProperty(this, "_index", 0);

          _defineProperty(this, "_bound", void 0);

          _defineProperty(this, "_swirlEffect", void 0);

          _defineProperty(this, "_jitterEffect", void 0);
        }

        start() {
          this._swirlTime = 0;
          this._maxEffect = 3;
          this._index = 0;
          const skeletonNodeUIProps = this.skeleton.node._uiProps.uiTransformComp;
          this._bound = new Size(skeletonNodeUIProps.width, skeletonNodeUIProps.height);
          this._swirlEffect = new sp.VertexEffectDelegate();

          this._swirlEffect.initSwirlWithPowOut(0, 2);

          this._jitterEffect = new sp.VertexEffectDelegate();

          this._jitterEffect.initJitter(20, 20);
        }

        switchEffect() {
          this._index++;

          if (this._index >= this._maxEffect) {
            this._index = 0;
          }

          switch (this._index) {
            case 0:
              this.skeleton.setVertexEffectDelegate(null);
              break;

            case 1:
              this.skeleton.setVertexEffectDelegate(this._jitterEffect);
              break;

            case 2:
              this.skeleton.setVertexEffectDelegate(this._swirlEffect);
              break;
          }
        }

        update(dt) {
          if (this._index == 2) {
            this._swirlTime += dt;
            let percent = this._swirlTime % 2;
            if (percent > 1) percent = 1 - (percent - 1);
            let bound = this._bound;

            let swirlEffect = this._swirlEffect.getSwirlVertexEffect();

            swirlEffect.angle = 360 * percent;
            swirlEffect.centerX = bound.width * 0.5;
            swirlEffect.centerY = bound.height * 0.5;
            swirlEffect.radius = percent * Math.sqrt(bound.width * bound.width + bound.height * bound.height);
          }
        }

      }, _temp), _descriptor = _applyDecoratedDescriptor(_class3.prototype, "skeleton", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _class3)) || _class2));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/ui-log.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, _defineProperty, cclegacy, Prefab, _decorator, Size, Component, Vec3, UITransform, instantiate, ScrollView, Layout, Widget, safeMeasureText, fragmentText, Label;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Prefab = module.Prefab;
      _decorator = module._decorator;
      Size = module.Size;
      Component = module.Component;
      Vec3 = module.Vec3;
      UITransform = module.UITransform;
      instantiate = module.instantiate;
      ScrollView = module.ScrollView;
      Layout = module.Layout;
      Widget = module.Widget;
      safeMeasureText = module.safeMeasureText;
      fragmentText = module.fragmentText;
      Label = module.Label;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _temp;

      cclegacy._RF.push({}, "582baHkZuZBgLuu7k76+F1C", "ui-log", undefined);

      const {
        ccclass,
        property,
        menu
      } = _decorator;
      const FIXED_HEIGHT = 20;
      const TOTAL_PADDING = 4;
      let UILog = exports('UILog', (_dec = ccclass("UILog"), _dec2 = menu('UI/UILog'), _dec3 = property(Prefab), _dec4 = property(Prefab), _dec(_class = _dec2(_class = (_class2 = (_temp = class UILog extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "panel", _descriptor, this);

          _initializerDefineProperty(this, "item", _descriptor2, this);

          _initializerDefineProperty(this, "workOnLoad", _descriptor3, this);

          _defineProperty(this, "logPanel", null);

          _initializerDefineProperty(this, "_size", _descriptor4, this);

          _defineProperty(this, "_itemList", []);

          _defineProperty(this, "_itemPool", []);

          _defineProperty(this, "_context", null);

          _defineProperty(this, "_scrollView", null);

          _defineProperty(this, "_offset", new Vec3());

          _defineProperty(this, "_originPos", new Vec3());

          _defineProperty(this, "_layout", null);
        }

        get size() {
          return this._size;
        }

        set size(value) {
          if (this._size.equals(value)) {
            return;
          }

          this._size.set(value);

          if (this.logPanel) {
            const transform = this.logPanel.getComponent(UITransform);
            transform.contentSize = this._size;
          }
        }

        onLoad() {
          const canvas = document.createElement('canvas');
          this._context = canvas.getContext('2d');

          if (this._context) {
            this._context.font = `${FIXED_HEIGHT}px Arial`;
            this._context.lineWidth = FIXED_HEIGHT + 2;
          }

          if (this.workOnLoad) {
            this.initLog({
              isAlign: true,
              isAlignLeft: true,
              isAlignBottom: true,
              left: 50,
              bottom: 50
            });
          }
        }

        initLog(config) {
          config = config || {
            isAlign: false
          };
          const panel = this.logPanel = instantiate(this.panel);
          panel.parent = this.node;
          const scrollView = panel.getComponent(ScrollView);
          this._scrollView = scrollView;
          this._layout = scrollView.content.getComponent(Layout);

          this._originPos.set(scrollView.content.position);

          this._originPos.y = this._size.height / 2;
          const transform = panel.getComponent(UITransform);
          transform.contentSize = this.size;

          if (config.pos) {
            panel.setPosition(config.pos);
          }

          if (!!config.isAlign) {
            const widget = panel.addComponent(Widget);
            widget.isAlignLeft = !!config.isAlignLeft;
            widget.isAlignBottom = !!config.isAlignBottom;
            widget.isAlignRight = !!config.isAlignRight;
            widget.isAlignTop = !!config.isAlignTop;
            widget.left = config.left || 0;
            widget.bottom = config.bottom || 0;
            widget.right = config.right || 0;
            widget.top = config.top || 0;
          }

          const mask = panel.getChildByName('view');
          const maskWidget = mask.addComponent(Widget);
          maskWidget.isAlignBottom = maskWidget.isAlignLeft = maskWidget.isAlignRight = maskWidget.isAlignTop = true;
          maskWidget.left = maskWidget.right = maskWidget.top = maskWidget.bottom = 0;
        }

        addLabel(str) {
          var _this$_context, _this$_layout;

          if (!this.item || !this.logPanel || str.length <= 0) {
            return;
          }

          const paragraphedStrings = str.split('\n');
          let spliteStrings = [];
          const maxWidth = this._size.width;
          (_this$_context = this._context) === null || _this$_context === void 0 ? void 0 : _this$_context.clearRect(0, 0, maxWidth, this._size.height);

          for (const para of paragraphedStrings) {
            const allWidth = safeMeasureText(this._context, para);
            const textFragment = fragmentText(para, allWidth, maxWidth - TOTAL_PADDING, this._measureText());
            spliteStrings = spliteStrings.concat(textFragment);
          }

          const text = spliteStrings.join('\n');

          const item = this._allocItem();

          const content = this._scrollView ? this._scrollView.content : null;
          item.parent = content;
          const itemTransComp = item.getComponent(UITransform);
          const itemBgTransComp = item.children[0].getComponent(UITransform);
          itemBgTransComp.width = itemTransComp.width = maxWidth;
          const itemHeight = spliteStrings.length * (FIXED_HEIGHT + 2);
          itemBgTransComp.height = itemTransComp.height = itemHeight;
          const labelTransComp = item.children[1].getComponent(UITransform);
          labelTransComp.width = maxWidth - TOTAL_PADDING;
          labelTransComp.height = spliteStrings.length * FIXED_HEIGHT;
          const labelComp = labelTransComp.getComponent(Label);
          labelComp.string = text;
          (_this$_layout = this._layout) === null || _this$_layout === void 0 ? void 0 : _this$_layout.updateLayout();
          const conteTrans = content ? content.getComponent(UITransform) : null;

          if (conteTrans && conteTrans.height > this._size.height) {
            var _this$_scrollView;

            this._offset.set(0, conteTrans.height - this._size.height, 0);

            (_this$_scrollView = this._scrollView) === null || _this$_scrollView === void 0 ? void 0 : _this$_scrollView.scrollToOffset(this._offset, 0.5, true);
          }
        }

        clearLabel() {
          for (let i = 0; i < this._itemList.length; i++) {
            const e = this._itemList[i];

            this._freeItem(e);
          }

          this._itemList.length = 0;
        }

        _allocItem() {
          if (this._itemPool.length > 0) {
            return this._itemPool.pop();
          }

          const root = instantiate(this.item);
          return root;
        }

        _freeItem(item) {
          this._itemPool.push(item);
        }

        _measureText() {
          const ctx = this._context;
          return str => {
            return safeMeasureText(ctx, str);
          };
        }

      }, _temp), (_applyDecoratedDescriptor(_class2.prototype, "size", [property], Object.getOwnPropertyDescriptor(_class2.prototype, "size"), _class2.prototype), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "panel", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "item", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "workOnLoad", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "_size", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new Size(100, 100);
        }
      })), _class2)) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/scroll-view-events.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Label, ScrollBar, _decorator, Component, ScrollView;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Label = module.Label;
      ScrollBar = module.ScrollBar;
      _decorator = module._decorator;
      Component = module.Component;
      ScrollView = module.ScrollView;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _temp;

      cclegacy._RF.push({}, "59084rPhUpND6Eu0YGtvknr", "scroll-view-events", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let ScrollViewEvents = exports('ScrollViewEvents', (_dec = ccclass("ScrollViewEvents"), _dec2 = property(Label), _dec3 = property({
        type: ScrollBar.Direction
      }), _dec(_class = (_class2 = (_temp = class ScrollViewEvents extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "eventLabel", _descriptor, this);

          _initializerDefineProperty(this, "direction", _descriptor2, this);
        }

        start() {
          if (this.direction === ScrollBar.Direction.VERTICAL) {
            this.node.on(ScrollView.EventType.SCROLL_TO_BOTTOM, this.eventScrollToBottom, this);
            this.node.on(ScrollView.EventType.SCROLL_TO_TOP, this.eventScrollToTop, this);
            this.node.on(ScrollView.EventType.BOUNCE_BOTTOM, this.bounceBottom, this);
            this.node.on(ScrollView.EventType.BOUNCE_TOP, this.bounceTop, this);
          } else {
            this.node.on(ScrollView.EventType.SCROLL_TO_LEFT, this.eventScrollToLeft, this);
            this.node.on(ScrollView.EventType.SCROLL_TO_RIGHT, this.eventScrollToRight, this);
            this.node.on(ScrollView.EventType.BOUNCE_LEFT, this.bounceLeft, this);
            this.node.on(ScrollView.EventType.BOUNCE_RIGHT, this.bounceRight, this);
          }
        }

        eventScrollToLeft(scroll) {
          this.eventLabel.string = 'ScrollToLeft';
        }

        eventScrollToBottom(scroll) {
          this.eventLabel.string = 'ScrollToBottom';
        }

        eventScrollToRight(scroll) {
          this.eventLabel.string = 'ScrollToRight';
        }

        eventScrollToTop(scroll) {
          this.eventLabel.string = 'ScrollToTop';
        }

        bounceLeft(scroll) {
          this.eventLabel.string = 'BounceLeft';
        }

        bounceBottom(scroll) {
          this.eventLabel.string = 'BounceBottom';
        }

        bounceRight(scroll) {
          this.eventLabel.string = 'BounceRight';
        }

        bounceTop(scroll) {
          this.eventLabel.string = 'BounceTop';
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "eventLabel", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "direction", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return ScrollBar.Direction.HORIZONTAL;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/trimmed.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Node, _decorator, Component, Graphics, UITransform, Color;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      _decorator = module._decorator;
      Component = module.Component;
      Graphics = module.Graphics;
      UITransform = module.UITransform;
      Color = module.Color;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _temp;

      cclegacy._RF.push({}, "59e15ttAZ5Ku5epzgIxZVbi", "trimmed", undefined);

      const {
        ccclass,
        property,
        executeInEditMode,
        menu
      } = _decorator;
      let Trimmed = exports('Trimmed', (_dec = ccclass("Trimmed"), _dec2 = menu('UI/Trimmed'), _dec3 = property({
        type: Node
      }), _dec4 = property({
        type: Node
      }), _dec(_class = _dec2(_class = executeInEditMode(_class = (_class2 = (_temp = class Trimmed extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "trimmed", _descriptor, this);

          _initializerDefineProperty(this, "noTrimmed", _descriptor2, this);
        }

        start() {
          const g = this.node.getComponent(Graphics);
          const trimmedContentSize = this.trimmed.getComponent(UITransform).contentSize;
          const noTrimmedContentSize = this.noTrimmed.getComponent(UITransform).contentSize;
          g.clear();
          g.lineWidth = 2;
          g.strokeColor = Color.RED;
          g.moveTo(this.trimmed.position.x - trimmedContentSize.width / 2 + 1, trimmedContentSize.height / 2 - 1);
          g.lineTo(this.trimmed.position.x + trimmedContentSize.width / 2 - 1, trimmedContentSize.height / 2 - 1);
          g.lineTo(this.trimmed.position.x + trimmedContentSize.width / 2 - 1, -trimmedContentSize.height / 2 + 1);
          g.lineTo(this.trimmed.position.x - trimmedContentSize.width / 2 + 1, -trimmedContentSize.height / 2 + 1);
          g.lineTo(this.trimmed.position.x - trimmedContentSize.width / 2 + 1, trimmedContentSize.height / 2 - 1);
          g.moveTo(this.noTrimmed.position.x - noTrimmedContentSize.width / 2 + 1, noTrimmedContentSize.height / 2 - 1);
          g.lineTo(this.noTrimmed.position.x + noTrimmedContentSize.width / 2 - 1, noTrimmedContentSize.height / 2 - 1);
          g.lineTo(this.noTrimmed.position.x + noTrimmedContentSize.width / 2 - 1, -noTrimmedContentSize.height / 2 + 1);
          g.lineTo(this.noTrimmed.position.x - noTrimmedContentSize.width / 2 + 1, -noTrimmedContentSize.height / 2 + 1);
          g.lineTo(this.noTrimmed.position.x - noTrimmedContentSize.width / 2 + 1, noTrimmedContentSize.height / 2 - 1);
          g.stroke();
        } // update (deltaTime: number) {
        //     // Your update function goes here.
        // }


      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "trimmed", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "noTrimmed", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/node-move.ts", ['cc'], function (exports) {
  'use strict';

  var cclegacy, Component, Vec3, _decorator;

  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Component = module.Component;
      Vec3 = module.Vec3;
      _decorator = module._decorator;
    }],
    execute: function () {
      var _dec, _class;

      cclegacy._RF.push({}, "5cd33koVLVEppCM1HguV765", "node-move", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let NodeMove = exports('NodeMove', (_dec = ccclass('NodeMove'), _dec(_class = class NodeMove extends Component {
        start() {
          let x = this.node.position.x;
          let y = this.node.position.y;
          let z = this.node.position.z;
          let vec3 = new Vec3(x, y, z);
          this.schedule(dt => {
            x += dt;
            vec3.x = x;
            this.node.setPosition(vec3);

            if (x >= 5) {
              x = -5;
            }
          });
        }

      }) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/TweenRepeat2.ts", ['cc'], function (exports) {
  'use strict';

  var cclegacy, Component, tween, Vec3, _decorator;

  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Component = module.Component;
      tween = module.tween;
      Vec3 = module.Vec3;
      _decorator = module._decorator;
    }],
    execute: function () {
      var _dec, _dec2, _class;

      cclegacy._RF.push({}, "5de1coi5aBBspa8mURWNyUS", "TweenRepeat2", undefined);

      const {
        ccclass,
        property,
        menu
      } = _decorator;
      let TweenRepeat2 = exports('TweenRepeat2', (_dec = ccclass("TweenRepeat2"), _dec2 = menu("tween/TweenRepeat2"), _dec(_class = _dec2(_class = class TweenRepeat2 extends Component {
        onLoad() {
          /**
           * ?????? repeat ????????????????????? Tween, target ?????????????????????
           * ????????????????????? TweenRepeat ????????????????????????
           */
          this.tweenRepeat = tween(this.node).repeat(3, tween().by(1, {
            scale: new Vec3(2, 2, 2)
          }));
        }

        onEnable() {
          this.tweenRepeat.start();
        }

        onDisable() {
          this.tweenRepeat.stop();
        }

      }) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/show-hide-event.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Node, Prefab, _decorator, Component, game, Game, instantiate, Label;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      Prefab = module.Prefab;
      _decorator = module._decorator;
      Component = module.Component;
      game = module.game;
      Game = module.Game;
      instantiate = module.instantiate;
      Label = module.Label;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _temp;

      cclegacy._RF.push({}, "608b97wsvpKdZEREVfnWtiV", "show-hide-event", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let ShowHideEvent = exports('ShowHideEvent', (_dec = ccclass('ShowHideEvent'), _dec2 = property(Node), _dec3 = property(Prefab), _dec(_class = (_class2 = (_temp = class ShowHideEvent extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "contentView", _descriptor, this);

          _initializerDefineProperty(this, "timeLabelPrefab", _descriptor2, this);
        }

        onLoad() {
          game.on(Game.EVENT_HIDE, this.onHide, this);
          game.on(Game.EVENT_SHOW, this.onShow, this);
        }

        onDestroy() {
          game.off(Game.EVENT_HIDE, this.onHide, this);
          game.off(Game.EVENT_SHOW, this.onShow, this);
        }

        onHide() {
          const timeLabelNode = instantiate(this.timeLabelPrefab);
          let label = timeLabelNode.getComponent(Label);
          label.string = `${this.getTime()} hide event`;
          this.contentView.addChild(timeLabelNode);
        }

        onShow() {
          const timeLabelNode = instantiate(this.timeLabelPrefab);
          let label = timeLabelNode.getComponent(Label);
          label.string = `${this.getTime()} show event`;
          this.contentView.addChild(timeLabelNode);
        }

        getTime() {
          let date = new Date();
          return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        } // update (deltaTime: number) {
        //     // [4]
        // }


      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "contentView", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "timeLabelPrefab", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));
      /**
       * [1] Class member could be defined like this.
       * [2] Use `property` decorator if your want the member to be serializable.
       * [3] Your initialization goes here.
       * [4] Your update function goes here.
       *
       * Learn more about scripting: https://docs.cocos.com/creator/3.0/manual/en/scripting/
       * Learn more about CCClass: https://docs.cocos.com/creator/3.0/manual/en/scripting/ccclass.html
       * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.0/manual/en/scripting/life-cycle-callbacks.html
       */

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/SpineBoyCtrl.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _defineProperty, cclegacy, _decorator, Component;

  return {
    setters: [function (module) {
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _class, _temp;

      cclegacy._RF.push({}, "63fd6NWWQxCt6fDTJtglY8d", "SpineBoyCtrl", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let SpineBoyCtrl = exports('default', (_dec = ccclass('SpineBoyCtrl'), _dec(_class = (_temp = class SpineBoyCtrl extends Component {
        constructor(...args) {
          super(...args);

          _defineProperty(this, "mixTime", 0.2);

          _defineProperty(this, "spine", void 0);

          _defineProperty(this, "_hasStop", true);
        }

        onLoad() {
          var spine = this.spine = this.getComponent('sp.Skeleton');

          this._setMix('walk', 'run');

          this._setMix('run', 'jump');

          this._setMix('walk', 'jump');

          spine.setStartListener(trackEntry => {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            console.log("[track %s][animation %s] start.", trackEntry.trackIndex, animationName);
          });
          spine.setInterruptListener(trackEntry => {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            console.log("[track %s][animation %s] interrupt.", trackEntry.trackIndex, animationName);
          });
          spine.setEndListener(trackEntry => {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            console.log("[track %s][animation %s] end.", trackEntry.trackIndex, animationName);
          });
          spine.setDisposeListener(trackEntry => {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            console.log("[track %s][animation %s] will be disposed.", trackEntry.trackIndex, animationName);
          });
          spine.setCompleteListener(trackEntry => {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";

            if (animationName === 'shoot') {
              this.spine.clearTrack(1);
            }

            var loopCount = Math.floor(trackEntry.trackTime / trackEntry.animationEnd);
            console.log("[track %s][animation %s] complete: %s", trackEntry.trackIndex, animationName, loopCount);
          });
          spine.setEventListener((trackEntry, event) => {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            console.log("[track %s][animation %s] event: %s, %s, %s, %s", trackEntry.trackIndex, animationName, event.data.name, event.intValue, event.floatValue, event.stringValue);
          });
          this._hasStop = false;
        } // OPTIONS


        toggleDebugSlots() {
          var _this$spine;

          this.spine.debugSlots = !((_this$spine = this.spine) === null || _this$spine === void 0 ? void 0 : _this$spine.debugSlots);
        }

        toggleDebugBones() {
          var _this$spine2;

          this.spine.debugBones = !((_this$spine2 = this.spine) === null || _this$spine2 === void 0 ? void 0 : _this$spine2.debugBones);
        }

        toggleDebugMesh() {
          var _this$spine3;

          this.spine.debugMesh = !((_this$spine3 = this.spine) === null || _this$spine3 === void 0 ? void 0 : _this$spine3.debugMesh);
        }

        toggleUseTint() {
          var _this$spine4;

          this.spine.useTint = !((_this$spine4 = this.spine) === null || _this$spine4 === void 0 ? void 0 : _this$spine4.useTint);
        }

        toggleTimeScale() {
          if (this.spine.timeScale === 1.0) {
            this.spine.timeScale = 0.3;
          } else {
            this.spine.timeScale = 1.0;
          }
        } // ANIMATIONS


        stop() {
          var _this$spine5;

          (_this$spine5 = this.spine) === null || _this$spine5 === void 0 ? void 0 : _this$spine5.clearTrack(0);
          this._hasStop = true;
        }

        walk() {
          var _this$spine7;

          if (this._hasStop) {
            var _this$spine6;

            (_this$spine6 = this.spine) === null || _this$spine6 === void 0 ? void 0 : _this$spine6.setToSetupPose();
          }

          (_this$spine7 = this.spine) === null || _this$spine7 === void 0 ? void 0 : _this$spine7.setAnimation(0, 'walk', true);
          this._hasStop = false;
        }

        run() {
          var _this$spine9;

          if (this._hasStop) {
            var _this$spine8;

            (_this$spine8 = this.spine) === null || _this$spine8 === void 0 ? void 0 : _this$spine8.setToSetupPose();
          }

          (_this$spine9 = this.spine) === null || _this$spine9 === void 0 ? void 0 : _this$spine9.setAnimation(0, 'run', true);
          this._hasStop = false;
        }

        jump() {
          var _this$spine11;

          if (this._hasStop) {
            var _this$spine10;

            (_this$spine10 = this.spine) === null || _this$spine10 === void 0 ? void 0 : _this$spine10.setToSetupPose();
          }

          (_this$spine11 = this.spine) === null || _this$spine11 === void 0 ? void 0 : _this$spine11.setAnimation(0, 'jump', true);
          this._hasStop = false;
        }

        shoot() {
          var _this$spine12;

          (_this$spine12 = this.spine) === null || _this$spine12 === void 0 ? void 0 : _this$spine12.setAnimation(1, 'shoot', false);
        }

        idle() {
          var _this$spine13, _this$spine14;

          (_this$spine13 = this.spine) === null || _this$spine13 === void 0 ? void 0 : _this$spine13.setToSetupPose();
          (_this$spine14 = this.spine) === null || _this$spine14 === void 0 ? void 0 : _this$spine14.setAnimation(0, 'idle', true);
        }

        portal() {
          var _this$spine15, _this$spine16;

          (_this$spine15 = this.spine) === null || _this$spine15 === void 0 ? void 0 : _this$spine15.setToSetupPose();
          (_this$spine16 = this.spine) === null || _this$spine16 === void 0 ? void 0 : _this$spine16.setAnimation(0, 'portal', false);
        } //


        _setMix(anim1, anim2) {
          var _this$spine17, _this$spine18;

          (_this$spine17 = this.spine) === null || _this$spine17 === void 0 ? void 0 : _this$spine17.setMix(anim1, anim2, this.mixTime);
          (_this$spine18 = this.spine) === null || _this$spine18 === void 0 ? void 0 : _this$spine18.setMix(anim2, anim1, this.mixTime);
        }

      }, _temp)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/release-depend-asset.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Prefab, Node, _decorator, Component, loader;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Prefab = module.Prefab;
      Node = module.Node;
      _decorator = module._decorator;
      Component = module.Component;
      loader = module.loader;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _temp;

      cclegacy._RF.push({}, "66f91i0DbtJxrxCWvnTAzUa", "release-depend-asset", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let releaseDependAsset = exports('releaseDependAsset', (_dec = ccclass('releaseDependAsset'), _dec2 = property({
        type: Prefab
      }), _dec3 = property({
        type: Node
      }), _dec(_class = (_class2 = (_temp = class releaseDependAsset extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "prefabAsset", _descriptor, this);

          _initializerDefineProperty(this, "prefabNode", _descriptor2, this);
        }

        releaseAsset() {
          if (!this.prefabNode) {
            return;
          }

          if (!this.prefabNode.active) {
            return;
          }

          this.prefabNode.active = false;
          this.prefabNode.parent = null;
          let deps = loader.getDependsRecursively(this.prefabAsset);
          loader.release(deps);
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "prefabAsset", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "prefabNode", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/scenelist.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Prefab, _decorator, Component, instantiate;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Prefab = module.Prefab;
      _decorator = module._decorator;
      Component = module.Component;
      instantiate = module.instantiate;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor, _temp;

      cclegacy._RF.push({}, "687185yW5hKPJX0ATIa74GL", "scenelist", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      const sceneArray = exports('sceneArray', []);
      let SceneManager = exports('SceneManager', (_dec = ccclass("scenemanager"), _dec2 = property({
        type: Prefab
      }), _dec(_class = (_class2 = (_temp = class SceneManager extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "itemPrefab", _descriptor, this);
        }

        onLoad() {
          if (this.itemPrefab) {
            for (let i = 0; i < sceneArray.length; i++) {
              let item = instantiate(this.itemPrefab);
              this.node.addChild(item);
            }
          }
        }

      }, _temp), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "itemPrefab", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/extension-detection.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, _decorator, Component, Label, gfx, error, director;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Component = module.Component;
      Label = module.Label;
      gfx = module.gfx;
      error = module.error;
      director = module.director;
    }],
    execute: function () {
      var _dec, _class, _class2, _descriptor, _descriptor2, _temp;

      cclegacy._RF.push({}, "69edbvI+KVFQJEDKsfPvq75", "extension-detection", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let ExtensionDetection = exports('ExtensionDetection', (_dec = ccclass('ExtensionDetection'), _dec(_class = (_class2 = (_temp = class ExtensionDetection extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "feature", _descriptor, this);

          _initializerDefineProperty(this, "tips", _descriptor2, this);
        }

        start() {
          const label = this.node.getComponent(Label);

          if (!this.feature.length || !label) {
            return;
          }

          const featureNames = Object.keys(gfx.Feature);
          const str = this.feature.toUpperCase();

          if (!featureNames.includes(str)) {
            error(`Type error of GFXFeature`);
            return;
          }

          const featureName = str;

          if (!director.root.device.hasFeature(gfx.Feature[featureName])) {
            label.string = `GFX feature '${this.feature}' is not supported on this device,\n${this.tips}`;
          }
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "feature", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return '';
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "tips", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return '';
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/TweenShowHide.ts", ['cc'], function (exports) {
  'use strict';

  var cclegacy, Component, tween, _decorator;

  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Component = module.Component;
      tween = module.tween;
      _decorator = module._decorator;
    }],
    execute: function () {
      var _dec, _dec2, _class;

      cclegacy._RF.push({}, "6a2e0eywUlNDLyQo4AyRY+G", "TweenShowHide", undefined);

      const {
        ccclass,
        property,
        menu
      } = _decorator;
      let TweenShowHide = exports('TweenShowHide', (_dec = ccclass("TweenShowHide"), _dec2 = menu("tween/TweenShowHide"), _dec(_class = _dec2(_class = class TweenShowHide extends Component {
        onLoad() {
          /**
           * ?????? target ????????? Node ????????????????????? show ??? hide
           */
          this.tweenSH = tween(this.node).delay(0.1).hide().delay(0.1).show().union().repeatForever();
        }

        onEnable() {
          this.tweenSH.start();
        }

        onDisable() {
          this.tweenSH.stop();
        }

      }) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/TweenParallel.ts", ['cc'], function (exports) {
  'use strict';

  var cclegacy, Component, tween, Vec3, _decorator;

  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Component = module.Component;
      tween = module.tween;
      Vec3 = module.Vec3;
      _decorator = module._decorator;
    }],
    execute: function () {
      var _dec, _dec2, _class;

      cclegacy._RF.push({}, "6e30eSvH65K7a4saHr5Vhy9", "TweenParallel", undefined);

      const {
        ccclass,
        property,
        menu
      } = _decorator;
      let TweenParallel = exports('TweenParallel', (_dec = ccclass("TweenParallel"), _dec2 = menu("tween/TweenParallel"), _dec(_class = _dec2(_class = class TweenParallel extends Component {
        onLoad() {
          this.tweenParallel = tween(this.node) // ?????????????????? Tween
          .parallel(tween().to(2, {
            scale: new Vec3(1, 2, 3)
          }), tween().to(2, {
            position: new Vec3(3, 0, 3)
          })).call(() => {
            console.log('All tweens finished.');
          });
        }

        onEnable() {
          this.tweenParallel.start();
        }

        onDisable() {
          this.tweenParallel.stop();
        }

      }) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/rotate-around-axis.ts", ['cc'], function (exports) {
  'use strict';

  var cclegacy, Vec3, Quat, Component, _decorator;

  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Vec3 = module.Vec3;
      Quat = module.Quat;
      Component = module.Component;
      _decorator = module._decorator;
    }],
    execute: function () {
      var _dec, _dec2, _class;

      cclegacy._RF.push({}, "6ebf6h60j5MUKTFQSGSfF39", "rotate-around-axis", undefined);

      const {
        ccclass,
        property,
        menu
      } = _decorator;

      const _v3_0 = new Vec3();

      const _quat_0 = new Quat();

      let RotateAroundAxis = exports('RotateAroundAxis', (_dec = ccclass("RotateAroundAxis"), _dec2 = menu("UI/RotateAroundAxis"), _dec(_class = _dec2(_class = class RotateAroundAxis extends Component {
        update(deltaTime) {
          _v3_0.set(-1, 1, 0);

          _v3_0.normalize();

          Quat.rotateAround(_quat_0, this.node.rotation, _v3_0, Math.PI * 0.01);
          this.node.setRotation(_quat_0);
        }

      }) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/mask-inverted-event.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Label, _decorator, Component, SystemEventType;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Label = module.Label;
      _decorator = module._decorator;
      Component = module.Component;
      SystemEventType = module.SystemEventType;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _temp;

      cclegacy._RF.push({}, "70ef4zUKLxDA5zRBYDljNmp", "mask-inverted-event", undefined);

      const {
        ccclass,
        property,
        menu
      } = _decorator;
      let MaskInvertedEvent = exports('MaskInvertedEvent', (_dec = ccclass("MaskInvertedEvent"), _dec2 = menu('UI/MaskInvertedEvent'), _dec3 = property(Label), _dec(_class = _dec2(_class = (_class2 = (_temp = class MaskInvertedEvent extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "label", _descriptor, this);

          _initializerDefineProperty(this, "string", _descriptor2, this);
        }

        start() {
          this.node.on(SystemEventType.TOUCH_START, this.callback, this);
        }

        callback() {
          this.label.string = this.string;
        } // update (deltaTime: number) {
        //     // Your update function goes here.
        // }


      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "label", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "string", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return '';
        }
      })), _class2)) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/TweenRepeat.ts", ['cc'], function (exports) {
  'use strict';

  var cclegacy, Component, tween, Vec3, _decorator;

  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Component = module.Component;
      tween = module.tween;
      Vec3 = module.Vec3;
      _decorator = module._decorator;
    }],
    execute: function () {
      var _dec, _dec2, _class;

      cclegacy._RF.push({}, "7529cHC0KVCgqpBE8238J1i", "TweenRepeat", undefined);

      const {
        ccclass,
        property,
        menu
      } = _decorator;
      let TweenRepeat = exports('TweenRepeat', (_dec = ccclass("TweenRepeat"), _dec2 = menu("tween/TweenRepeat"), _dec(_class = _dec2(_class = class TweenRepeat extends Component {
        onLoad() {
          this.tweenRepeat = tween(this.node).by(1, {
            scale: new Vec3(2, 2, 2)
          }) // ???????????? by ???????????? 3???
          .repeat(3).call(() => {
            console.log('All tweens finished.');
          });
        }

        onEnable() {
          this.tweenRepeat.start();
        }

        onDisable() {
          this.tweenRepeat.stop();
        }

      }) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/tween-test.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _defineProperty, cclegacy, _decorator, Component, Vec3, tween;

  return {
    setters: [function (module) {
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Component = module.Component;
      Vec3 = module.Vec3;
      tween = module.tween;
    }],
    execute: function () {
      var _dec, _dec2, _class, _temp;

      cclegacy._RF.push({}, "7681ePAf7VHKpuKOshcVeC7", "tween-test", undefined);

      const {
        ccclass,
        property,
        menu
      } = _decorator;
      /**
       * ???????????????????????????
       *
       * ????????????????????? node ????????????????????????????????????
       */

      let TweenTest = exports('TweenTest', (_dec = ccclass("tween-test"), _dec2 = menu("tween/tween-test"), _dec(_class = _dec2(_class = (_temp = class TweenTest extends Component {
        constructor(...args) {
          super(...args);

          _defineProperty(this, "_wPos", new Vec3(0, 0, 0));

          _defineProperty(this, "_wScale", new Vec3(1, 1, 1));

          _defineProperty(this, "_lEuler", new Vec3(0, 0, 0));
        }

        onLoad() {
          Vec3.copy(this._wPos, this.node.worldPosition);
          /**
           * ?????????????????? easing ??????????????? V1.1 ??????????????????????????????????????????????????????????????????????????????????????????
           */

          this.tweenPos = tween(this._wPos).to(3, new Vec3(10, 10, 10), {
            easing: 'bounceInOut'
          }).to(3, new Vec3(0, 0, 0), {
            easing: 'elasticOut'
          }).union().repeat(Infinity);
          Vec3.copy(this._wScale, this.node.worldScale);
          /**
           * ?????? Tween ?????? easing ????????????
           */

          this.tweenScale = tween(this._wScale).to(0.5, new Vec3(3, 3, 3), {
            easing: 'bounceInOut'
          }).to(0.5, new Vec3(1, 1, 1), {
            easing: 'elasticOut'
          }).union().repeat(Infinity);
          Vec3.copy(this._lEuler, this.node.eulerAngles);
          this.tweenEuler = tween(this._lEuler).to(4.5, new Vec3(360, 360, 360), {
            easing: 'bounceInOut'
          }).to(4.5, new Vec3(0, 0, 0), {
            easing: 'elasticOut'
          }).union().repeat(Infinity);
        }

        onEnable() {
          this.tweenPos.start();
          this.tweenScale.start();
          this.tweenEuler.start();
        }

        onDisable() {
          this.tweenPos.stop();
          this.tweenScale.stop();
          this.tweenEuler.stop();
        }

        update() {
          this.node.worldPosition = this._wPos;
          this.node.worldScale = this._wScale;
          this.node.eulerAngles = this._lEuler;
        }

      }, _temp)) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/click-change-size.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Node, Size, _decorator, Component, UITransform;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      Size = module.Size;
      _decorator = module._decorator;
      Component = module.Component;
      UITransform = module.UITransform;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _temp;

      cclegacy._RF.push({}, "777b0Dcg3JNZI1dOiazs1tI", "click-change-size", undefined);

      const {
        ccclass,
        property,
        menu
      } = _decorator;
      let ClickChangeSize = exports('ClickChangeSize', (_dec = ccclass("ClickChangeSize"), _dec2 = menu('UI/ClickChangeSize'), _dec3 = property(Node), _dec4 = property(Size), _dec(_class = _dec2(_class = (_class2 = (_temp = class ClickChangeSize extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "target", _descriptor, this);

          _initializerDefineProperty(this, "size", _descriptor2, this);
        }

        start() {
          // Your initialization goes here.
          this.node.on('click', this.click, this);
        }

        click() {
          if (this.target) {
            const uiTrans = this.target.getComponent(UITransform);
            uiTrans.contentSize = this.size;
          }
        } // update (deltaTime: number) {
        //     // Your update function goes here.
        // }


      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "target", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "size", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new Size();
        }
      })), _class2)) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/MultiTouchCtrl.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Vec2, Toggle, Node, _decorator, Component, systemEvent, SystemEventType, macro;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Vec2 = module.Vec2;
      Toggle = module.Toggle;
      Node = module.Node;
      _decorator = module._decorator;
      Component = module.Component;
      systemEvent = module.systemEvent;
      SystemEventType = module.SystemEventType;
      macro = module.macro;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _temp;

      cclegacy._RF.push({}, "778bduOkDZEJoQ2kO/MRUcF", "MultiTouchCtrl", undefined);

      const {
        ccclass,
        property
      } = _decorator;

      const _temp_vec2_1 = new Vec2();

      const _temp_vec2_2 = new Vec2();

      const _temp_delta = new Vec2();

      let MultiTouchCtrl = exports('MultiTouchCtrl', (_dec = ccclass("MultiTouchCtrl"), _dec2 = property(Toggle), _dec3 = property(Node), _dec(_class = (_class2 = (_temp = class MultiTouchCtrl extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "toggle", _descriptor, this);

          _initializerDefineProperty(this, "target", _descriptor2, this);
        }

        start() {
          systemEvent.on(SystemEventType.TOUCH_MOVE, this.onTouchMove, this);
          this.changeMulti();
        }

        onDestroy() {
          systemEvent.off(SystemEventType.TOUCH_MOVE, this.onTouchMove, this);
        }

        changeMulti() {
          if (this.toggle.isChecked) {
            macro.ENABLE_MULTI_TOUCH = true;
          } else {
            macro.ENABLE_MULTI_TOUCH = false;
          }
        }

        onTouchMove(touch, event) {
          const touches = event.getAllTouches();
          const changedTouches = event.getTouches();

          if (macro.ENABLE_MULTI_TOUCH && touches.length > 1) {
            let touch1 = null;
            let touch2 = null;
            const delta2 = new Vec2();

            if (changedTouches.length > 1) {
              touch1 = touches[0];
              touch2 = touches[1];
              touch2.getDelta(delta2);
            } else {
              touch1 = touch;
              const diffID = touch1.getID();
              let str = '';

              for (let i = 0; i < touches.length; i++) {
                const element = touches[i];
                str += `${element.getID()} - `;

                if (element.getID() !== diffID) {
                  touch2 = element;
                  break;
                }
              }
            }

            const delta1 = touch1.getDelta(_temp_delta);
            const touchPoint1 = touch1.getLocation(_temp_vec2_1);
            const touchPoint2 = touch2.getLocation(_temp_vec2_2);
            const distance = touchPoint1.subtract(touchPoint2);
            const delta = delta1.subtract(delta2);

            if (Math.abs(distance.x) > Math.abs(distance.y)) {
              this.target.setScale((distance.x + delta.x) / distance.x * this.target.getScale().x, this.target.getScale().y, 1);
            } else {
              this.target.setScale(this.target.getScale().x, (distance.y + delta.y) / distance.y * this.target.getScale().y, 1);
            }
          }
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "toggle", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "target", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/coordinate-ui-3d.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Vec3, Node, Camera, _decorator, Component;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Vec3 = module.Vec3;
      Node = module.Node;
      Camera = module.Camera;
      _decorator = module._decorator;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _temp;

      cclegacy._RF.push({}, "78245HzqEFHMruIc9YDEFAZ", "coordinate-ui-3d", undefined);

      const {
        ccclass,
        property,
        menu
      } = _decorator;

      const _v3_0 = new Vec3();

      let CoordinateUI3D = exports('CoordinateUI3D', (_dec = ccclass("CoordinateUI3D"), _dec2 = menu("UI/CoordinateUI3D"), _dec3 = property({
        type: Node
      }), _dec4 = property({
        type: Node
      }), _dec5 = property({
        type: Camera
      }), _dec(_class = _dec2(_class = (_class2 = (_temp = class CoordinateUI3D extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "D3Node", _descriptor, this);

          _initializerDefineProperty(this, "UINode", _descriptor2, this);

          _initializerDefineProperty(this, "mainCamera", _descriptor3, this);
        }

        lateUpdate(deltaTime) {
          this.D3Node.getWorldPosition(_v3_0);
          this.mainCamera.convertToUINode(_v3_0, this.UINode.parent, _v3_0);
          this.UINode.setPosition(_v3_0);
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "D3Node", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "UINode", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "mainCamera", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/dynamic-tiled-map.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Node, _decorator, Component, loader, TiledMapAsset, TiledMap;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      _decorator = module._decorator;
      Component = module.Component;
      loader = module.loader;
      TiledMapAsset = module.TiledMapAsset;
      TiledMap = module.TiledMap;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor, _temp;

      cclegacy._RF.push({}, "7b7e1jUf5dIgqilm/MYNV6T", "dynamic-tiled-map", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let DynamicTiledMap = exports('DynamicTiledMap', (_dec = ccclass('DynamicTiledMap'), _dec2 = property({
        type: Node
      }), _dec(_class = (_class2 = (_temp = class DynamicTiledMap extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "targetNode", _descriptor, this);
        }

        start() {// Your initialization goes here.
        } // update (deltaTime: number) {
        //     // Your update function goes here.
        // }


        onLoadTileMap(url) {
          loader.loadRes(url, TiledMapAsset, (err, tmxAsset) => {
            if (err) {
              console.error(err);
              return;
            }

            this.onCreateTileMap(tmxAsset);
          });
        }

        onCreateTileMap(tmxAsset) {
          this.targetNode.destroyAllChildren();
          const node = new Node();
          this.targetNode.addChild(node);
          node.layer = this.targetNode.layer;
          const tileMap = node.addComponent(TiledMap);
          tileMap.tmxAsset = tmxAsset;
        }

        onBtnCreateTileMap() {
          const url = 'tilemap/tile_iso_offset';
          this.onLoadTileMap(url);
        }

        onBtnCreateTileMapWithTsx() {
          const url = 'tilemap/tile_iso_offset_with_tsx';
          this.onLoadTileMap(url);
        }

      }, _temp), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "targetNode", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/MaterialTextureAnimation.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Texture2D, _decorator, Component, Animation, error, UniformCurveValueAdapter, AnimationClip, ComponentModifier, js, MeshRenderer;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Texture2D = module.Texture2D;
      _decorator = module._decorator;
      Component = module.Component;
      Animation = module.Animation;
      error = module.error;
      UniformCurveValueAdapter = module.UniformCurveValueAdapter;
      AnimationClip = module.AnimationClip;
      ComponentModifier = module.ComponentModifier;
      js = module.js;
      MeshRenderer = module.MeshRenderer;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor, _temp;

      cclegacy._RF.push({}, "7bcf6oXnxJKBK7SHzLOoCmh", "MaterialTextureAnimation", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      /**
       * This component demonstrates how material texture animation run.
       */

      let MaterialTextureAnimation = exports('MaterialTextureAnimation', (_dec = ccclass("MaterialTextureAnimation"), _dec2 = property([Texture2D]), _dec(_class = (_class2 = (_temp = class MaterialTextureAnimation extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "textures", _descriptor, this);
        }

        start() {
          const animationComponent = this.node.getComponent(Animation);

          if (!animationComponent) {
            error(`Animation component is required for this script.`);
            return;
          }

          const clip = createMaterialTextureAnimationClip(this.textures, 0);
          clip.name = 'forward';
          const clip2 = createMaterialTextureAnimationClip(this.textures, 1);
          clip2.name = 'deferred';
          animationComponent.clips = [clip, clip2];
          animationComponent.defaultClip = clip; //animationComponent.playOnLoad = true;

          const state1 = animationComponent.getAnimationState('forward');
          state1.play();
          const state2 = animationComponent.getAnimationState('deferred');
          state2.play();
        }

      }, _temp), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "textures", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _class2)) || _class));

      function createMaterialTextureAnimationClip(textures, passIndex) {
        // Animate every texture for 1 sec.
        const defaultKeys = textures.map((texture, index) => index); // Setup the value adapter.

        const uca = new UniformCurveValueAdapter();
        uca.passIndex = passIndex;
        uca.uniformName = 'albedoMap';
        const animationClip = new AnimationClip();
        animationClip.wrapMode = AnimationClip.WrapMode.Loop;
        animationClip.keys = [defaultKeys];
        animationClip.duration = defaultKeys[defaultKeys.length - 1] + 1;
        animationClip.curves = [{
          modifiers: [new ComponentModifier(js.getClassName(MeshRenderer)), 'sharedMaterials', 0],
          valueAdapter: uca,
          data: {
            keys: 0,
            values: textures
          }
        }];
        return animationClip;
      }

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/sport_light_1.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _defineProperty, cclegacy, _decorator, Component, Vec3;

  return {
    setters: [function (module) {
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Component = module.Component;
      Vec3 = module.Vec3;
    }],
    execute: function () {
      var _dec, _class, _temp;

      cclegacy._RF.push({}, "7c371gYlBVOU5uHz9LbkNjm", "sport_light_1", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let sport_light_1 = exports('sport_light_1', (_dec = ccclass('sport_light_1'), _dec(_class = (_temp = class sport_light_1 extends Component {
        constructor(...args) {
          super(...args);

          _defineProperty(this, "_nowA", new Vec3());

          _defineProperty(this, "_time", 0);
        }

        start() {
          // Your initialization goes here.
          this._nowA = this.node.eulerAngles;
        }

        update(deltaTime) {
          // Your update function goes here.
          this._time += 0.01;
          this._nowA.x = (Math.sin(this._time) + 1.0) * 0.5 * -90.0;
          this.node.setRotationFromEuler(this._nowA.x, this._nowA.y, this._nowA.z);
        }

      }, _temp)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/click-event.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Label, _decorator, Component;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Label = module.Label;
      _decorator = module._decorator;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor, _temp;

      cclegacy._RF.push({}, "7d7e9Ou69ZHXLtYZ7k+65CX", "click-event", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let ClickEvent = exports('ClickEvent', (_dec = ccclass("ClickEvent"), _dec2 = property({
        type: Label
      }), _dec(_class = (_class2 = (_temp = class ClickEvent extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "notice", _descriptor, this);
        }

        start() {// Your initialization goes here.
        } // update (deltaTime: number) {
        //     // Your update function goes here.
        // }


        onButtonClick() {
          if (this.notice) {
            this.notice.string = this.node.name + ' had click!';
          }
        }

      }, _temp), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "notice", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/webview-ctrl.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, WebView, Label, Node, _decorator, Component, sys;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      WebView = module.WebView;
      Label = module.Label;
      Node = module.Node;
      _decorator = module._decorator;
      Component = module.Component;
      sys = module.sys;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _temp;

      cclegacy._RF.push({}, "802edHUpoRJ75rf3RFyK+c0", "webview-ctrl", undefined);

      const {
        ccclass,
        type
      } = _decorator;
      let WebviewCtrl = exports('WebviewCtrl', (_dec = ccclass('WebviewCtrl'), _dec2 = type(WebView), _dec3 = type(Label), _dec4 = type(Node), _dec5 = type(Label), _dec(_class = (_class2 = (_temp = class WebviewCtrl extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "webview", _descriptor, this);

          _initializerDefineProperty(this, "eventTips", _descriptor2, this);

          _initializerDefineProperty(this, "noSupport", _descriptor3, this);

          _initializerDefineProperty(this, "platform", _descriptor4, this);
        }

        start() {
          // ??????????????? video player ?????????
          switch (sys.platform) {
            case sys.MACOS:
            case sys.ALIPAY_MINI_GAME:
            case sys.BYTEDANCE_MINI_GAME:
            case sys.COCOSPLAY:
            case sys.HUAWEI_QUICK_GAME:
            case sys.OPPO_MINI_GAME:
            case sys.VIVO_MINI_GAME:
            case sys.XIAOMI_QUICK_GAME:
            case sys.BAIDU_MINI_GAME:
            case sys.WECHAT_GAME:
            case sys.LINKSURE_MINI_GAME:
            case sys.QTT_MINI_GAME:
            case sys.WIN32:
              this.noSupport.active = true;
              this.webview.node.active = false;
              break;
          }

          this.platform.string = `platform: ${sys.platform}`;
        }

        onGoTo() {
          this.webview.url = 'https://www.baidu.com';
        }

        onEventTypes(target, eventType) {
          this.eventTips.string = '???????????????' + eventType;
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "webview", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "eventTips", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "noSupport", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "platform", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/restart.ts", ['cc'], function (exports) {
  'use strict';

  var cclegacy, Component, game, _decorator;

  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Component = module.Component;
      game = module.game;
      _decorator = module._decorator;
    }],
    execute: function () {
      var _dec, _class;

      cclegacy._RF.push({}, "81256DPUK1LjY/2G7hd84DJ", "restart", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let Restart = exports('Restart', (_dec = ccclass('Restart'), _dec(_class = class Restart extends Component {
        start() {}

        restart() {
          console.log("restart the game");
          game.restart();
        }

      }) || _class));
      /**
       * [1] Class member could be defined like this.
       * [2] Use `property` decorator if your want the member to be serializable.
       * [3] Your initialization goes here.
       * [4] Your update function goes here.
       *
       * Learn more about scripting: https://docs.cocos.com/creator/3.3/manual/en/scripting/
       * Learn more about CCClass: https://docs.cocos.com/creator/3.3/manual/en/scripting/ccclass.html
       * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.3/manual/en/scripting/life-cycle-callbacks.html
       */

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/UniformKTest.ts", ['cc'], function (exports) {
  'use strict';

  var cclegacy, Component, Animation, UniformCurveValueAdapter, AnimationClip, animation, js, MeshRenderer, math, _decorator;

  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Component = module.Component;
      Animation = module.Animation;
      UniformCurveValueAdapter = module.UniformCurveValueAdapter;
      AnimationClip = module.AnimationClip;
      animation = module.animation;
      js = module.js;
      MeshRenderer = module.MeshRenderer;
      math = module.math;
      _decorator = module._decorator;
    }],
    execute: function () {
      var _dec, _class;

      cclegacy._RF.push({}, "83558/TWJFKr7fv70/K70at", "UniformKTest", undefined);

      const {
        ccclass
      } = _decorator;
      let UniformKTest = exports('UniformKTest', (_dec = ccclass('UniformKTest'), _dec(_class = class UniformKTest extends Component {
        start() {
          const testClip = this._makeTestClip(0);

          testClip.name = 'forward';

          const testClip2 = this._makeTestClip(1);

          testClip2.name = 'deferred';
          const animationComponent = this.node.addComponent(Animation);
          animationComponent.clips = [testClip, testClip2];
          animationComponent.defaultClip = testClip; //animationComponent.playOnLoad = true;

          const state1 = animationComponent.getAnimationState('forward');
          state1.play();
          const state2 = animationComponent.getAnimationState('deferred');
          state2.play();
        }

        _makeTestClip(passIndex) {
          const uniformValueAdapter = new UniformCurveValueAdapter();
          uniformValueAdapter.passIndex = passIndex;
          uniformValueAdapter.uniformName = 'albedo';
          const animationClip = new AnimationClip();
          animationClip.wrapMode = AnimationClip.WrapMode.Loop;
          animationClip.duration = 2.0;
          animationClip.keys = [[0, 0.3, 0.5, 1.0, 1.7, 2.0]];
          animationClip.curves = [{
            modifiers: [new animation.HierarchyPath('Nested'), new animation.ComponentPath(js.getClassName(MeshRenderer)), "sharedMaterials", 0],
            valueAdapter: uniformValueAdapter,
            data: {
              keys: 0,
              values: [new math.Color(0), new math.Color(10), new math.Color(70), new math.Color(80), new math.Color(150), new math.Color(255)]
            }
          }];
          return animationClip;
        }

      }) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/ByteCodeLoader.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc', './ByteCodeCache.ts'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Label, _decorator, Component, LastTimeResult;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Label = module.Label;
      _decorator = module._decorator;
      Component = module.Component;
    }, function (module) {
      LastTimeResult = module.LastTimeResult;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _temp;

      cclegacy._RF.push({}, "837f0IrH45KSY3rRxEsmFC6", "ByteCodeLoader", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let ByteCodeCache = exports('ByteCodeCache', (_dec = ccclass('ByteCodeCache'), _dec2 = property({
        type: Label
      }), _dec3 = property({
        type: Label
      }), _dec(_class = (_class2 = (_temp = class ByteCodeCache extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "statusLabel", _descriptor, this);

          _initializerDefineProperty(this, "titleLabel", _descriptor2, this);
        }

        start() {
          setTimeout(this.runTest.bind(this), 0);
        }

        runTest() {
          this.titleLabel.string = 'Bytecode Test';

          if (typeof jsb === 'undefined' || !jsb.saveByteCode) {
            this.statusLabel.string = 'Bytecode is not supported!';
          } else {
            if (LastTimeResult.done) {
              this.statusLabel.string = LastTimeResult.message;
              this.titleLabel.string = 'Bytecode Test (cached result)';
              return;
            }

            do {
              this.statusLabel.string = 'Generating JS file..';
              const src_file = jsb.fileUtils.getWritablePath() + 'bytecode_bigjs.js';
              const src_file2 = jsb.fileUtils.getWritablePath() + 'bytecode_bigjs2.js';
              {
                const start = new Date().getTime();

                if (jsb.fileUtils.isFileExist(src_file)) {
                  jsb.fileUtils.removeFile(src_file);
                }

                if (jsb.fileUtils.isFileExist(src_file2)) {
                  jsb.fileUtils.removeFile(src_file2);
                }

                const codeLines = ['function test_func_0() { return Math.random();}'];
                const funcCount = 100000;

                for (let i = 1; i < funcCount; i++) {
                  codeLines.push(`function test_func_${i}() { return test_func_${i - 1}() * Math.random();}`);
                }

                codeLines.push(`if(Math.random() < 0.00000001) console.log("wow " + test_func_${funcCount - 1}());`);
                const codeText = codeLines.join('\n');
                let ok = jsb.fileUtils.writeStringToFile(codeText + `"Success bc"`, src_file);

                if (!ok) {
                  this.statusLabel.string += '\n - failed to save source code.';
                  break;
                }

                ok = jsb.fileUtils.writeStringToFile(codeText + `"Success js"`, src_file2);

                if (!ok) {
                  this.statusLabel.string += '\n - failed to save source code..';
                  break;
                }

                this.statusLabel.string += '\n - file size ' + codeText.length;
                const end = new Date().getTime();
                this.statusLabel.string += '\n - generating scripts takes ' + (end - start) + 'ms';
              }
              this.statusLabel.string += '\nGenerating bytecode..';
              const dstFile = src_file + '.bc';
              {
                if (jsb.fileUtils.isFileExist(dstFile)) {
                  jsb.fileUtils.removeFile(dstFile);
                }

                const start = new Date().getTime();
                const ok = jsb.saveByteCode(src_file, dstFile);
                const end = new Date().getTime();

                if (!ok) {
                  this.statusLabel.string += '\n - failed to generate bytecode!';
                  break;
                }

                this.statusLabel.string += '\n - generating bytecode takes ' + (end - start) + 'ms';
              }
              this.statusLabel.string += '\nRunning bytecode.. (shorter time expected)';
              {
                const start = new Date().getTime();

                const result = require(dstFile);

                const end = new Date().getTime();
                this.statusLabel.string += '\n - script return: ' + result;
                this.statusLabel.string += '\n - require bytecode takes ' + (end - start) + 'ms';
              }
              this.statusLabel.string += '\nRunning text script.. (longer time expected)';
              {
                const start = new Date().getTime();

                const result = require(src_file2);

                const end = new Date().getTime();
                this.statusLabel.string += '\n - script return: ' + result;
                this.statusLabel.string += '\n - require text script takes ' + (end - start) + 'ms';
              }
            } while (false);

            LastTimeResult.done = true;
            LastTimeResult.message = this.statusLabel.string;
          }
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "statusLabel", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "titleLabel", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/TweenCustomProgress.ts", ['cc'], function (exports) {
  'use strict';

  var cclegacy, Component, tween, Vec3, _decorator;

  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Component = module.Component;
      tween = module.tween;
      Vec3 = module.Vec3;
      _decorator = module._decorator;
    }],
    execute: function () {
      var _dec, _dec2, _class;

      cclegacy._RF.push({}, "838c8pQgaNIO7KFfZzgLtHR", "TweenCustomProgress", undefined);

      const {
        ccclass,
        property,
        menu
      } = _decorator;
      let TweenCustomProgress = exports('TweenCustomProgress', (_dec = ccclass("TweenCustomProgress"), _dec2 = menu("tween/TweenCustomProgress"), _dec(_class = _dec2(_class = class TweenCustomProgress extends Component {
        onLoad() {
          // ???????????????????????? progress
          const scaleTween = tween(this.node).to(2, {
            scale: new Vec3(3, 2, 1)
          }, {
            progress: (start, end, current, ratio) => {
              return start + (end - start) * ratio;
            }
          }); // ???????????????????????? progress

          this.tweenCP = tween(this.node).to(2, {
            position: new Vec3(2, 2, -2)
          }, {
            progress: (start, end, current, ratio) => {
              return start + (end - start) * ratio * ratio * ratio;
            }
          }).reverseTime(scaleTween);
        }

        onEnable() {
          this.tweenCP.start();
        }

        onDisable() {
          this.tweenCP.stop();
        }

      }) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/SwitchAnimation.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _defineProperty, _initializerDefineProperty, cclegacy, _decorator, Component, Animation;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _defineProperty = module.defineProperty;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Component = module.Component;
      Animation = module.Animation;
    }],
    execute: function () {
      var _dec, _class, _class2, _descriptor, _descriptor2, _temp;

      cclegacy._RF.push({}, "857abdgcIpHIZ2oM4/tfffa", "SwitchAnimation", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let SwitchAnimation = exports('SwitchAnimation', (_dec = ccclass("SwitchAnimation"), _dec(_class = (_class2 = (_temp = class SwitchAnimation extends Component {
        constructor(...args) {
          super(...args);

          _defineProperty(this, "num", 0);

          _defineProperty(this, "_duration", 0.3);

          _initializerDefineProperty(this, "minDuration", _descriptor, this);

          _initializerDefineProperty(this, "maxDuration", _descriptor2, this);
        }

        switch() {
          if (this.num == 0) {
            this.animationComponent.crossFade("Walk", this._duration);
          }

          if (this.num == 1) {
            this.animationComponent.crossFade("Run", this._duration);
          }

          if (this.num == 2) {
            this.animationComponent.crossFade("Idle", this._duration);
            this.num = -1;
          }

          this.num++;
        }

        onDurationEditBoxChange(slider) {
          this._duration = (this.maxDuration - this.minDuration) * slider.progress;
        }

        start() {
          this.animationComponent = this.node.getComponent(Animation);
        } // update (deltaTime: number) {
        //     // Your update function goes here.
        // }


      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "minDuration", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.0;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "maxDuration", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1.0;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/screenTest.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Toggle, Node, _decorator, Component, screen, log;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Toggle = module.Toggle;
      Node = module.Node;
      _decorator = module._decorator;
      Component = module.Component;
      screen = module.screen;
      log = module.log;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _temp;

      cclegacy._RF.push({}, "86f76DTNzNJ9KDHIfkPV8lE", "screenTest", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let ScreenTest = exports('ScreenTest', (_dec = ccclass('ScreenTest'), _dec2 = property(Toggle), _dec3 = property(Node), _dec(_class = (_class2 = (_temp = class ScreenTest extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "toggleFullscreen", _descriptor, this);

          _initializerDefineProperty(this, "noSupport", _descriptor2, this);
        }

        start() {
          if (screen.supportsFullScreen) {
            this.noSupport.active = false;
          } else {
            this.noSupport.active = true;
            return;
          }

          this.toggleFullscreen.isChecked = screen.fullScreen();
          this.toggleFullscreen.node.on(Toggle.EventType.TOGGLE, this.onToggle, this);
        }

        onToggle(toggle) {
          if (toggle.isChecked) {
            screen.requestFullScreen().then(() => {
              log('on enter fullscreen');
            }).catch(e => {});
          } else {
            screen.exitFullScreen().then(() => {
              log('on exit fullscreen');
            }).catch(e => {});
          }
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "toggleFullscreen", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "noSupport", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/ReplaceSlotDisplay.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, _defineProperty, cclegacy, dragonBones, _decorator, Component;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      dragonBones = module.dragonBones;
      _decorator = module._decorator;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _temp;

      cclegacy._RF.push({}, "8c143MTiytPEpW1sihXhDt7", "ReplaceSlotDisplay", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let ReplaceSlotDisplay = exports('ReplaceSlotDisplay', (_dec = ccclass('ReplaceSlotDisplay'), _dec2 = property({
        type: dragonBones.ArmatureDisplay
      }), _dec3 = property({
        type: dragonBones.ArmatureDisplay
      }), _dec(_class = (_class2 = (_temp = class ReplaceSlotDisplay extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "armatureDisplay", _descriptor, this);

          _initializerDefineProperty(this, "replaceArmatureDisplay", _descriptor2, this);

          _defineProperty(this, "_leftWeaponIndex", 0);

          _defineProperty(this, "_rightDisplayIndex", 0);

          _defineProperty(this, "_rightDisplayNames", []);

          _defineProperty(this, "_rightDisplayOffset", []);
        }

        start() {
          this.replaceArmatureDisplay.node.active = false;
          this._leftWeaponIndex = 0;
          this._rightDisplayIndex = 0;
          this._rightDisplayNames = ["weapon_1004_r", "weapon_1004d_r"];
          this._rightDisplayOffset = [{
            x: 0,
            y: 0
          }, {
            x: -60,
            y: 100
          }];
        }

        left() {
          let armature = this.armatureDisplay.armature();
          let slot = armature.getSlot("weapon_hand_l");
          slot.displayIndex = slot.displayIndex == 0 ? 4 : 0;
        }

        right() {
          this._rightDisplayIndex++;
          this._rightDisplayIndex %= this._rightDisplayNames.length;
          let armature = this.armatureDisplay.armature();
          let slot = armature.getSlot("weapon_hand_r");
          let replaceArmatureName = this.replaceArmatureDisplay.armatureName;
          const displayName = this._rightDisplayNames[this._rightDisplayIndex];
          let factory = dragonBones.CCFactory.getInstance();
          factory.replaceSlotDisplay(this.replaceArmatureDisplay.getArmatureKey(), replaceArmatureName, "weapon_r", displayName, slot);
          let offset = this._rightDisplayOffset[this._rightDisplayIndex];
          slot.parent.offset.x = offset.x;
          slot.parent.offset.y = offset.y;
          armature.invalidUpdate();
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "armatureDisplay", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "replaceArmatureDisplay", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/render-camera-to-model.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, _defineProperty, cclegacy, MeshRenderer, _decorator, Component, RenderTexture, Camera;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      MeshRenderer = module.MeshRenderer;
      _decorator = module._decorator;
      Component = module.Component;
      RenderTexture = module.RenderTexture;
      Camera = module.Camera;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor, _temp;

      cclegacy._RF.push({}, "8ed22sN8h5F/Yqo7TkUBfq+", "render-camera-to-model", undefined);

      const {
        ccclass,
        property,
        menu
      } = _decorator;
      let RenderCameraToModel = exports('RenderCameraToModel', (_dec = ccclass('RenderCameraToModel'), _dec2 = menu('RenderTexture/RenderCameraToModel'), _dec3 = property(MeshRenderer), _dec(_class = _dec2(_class = (_class2 = (_temp = class RenderCameraToModel extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "model", _descriptor, this);

          _defineProperty(this, "_renderTex", null);
        }

        start() {
          // Your initialization goes here.
          const renderTex = this._renderTex = new RenderTexture();
          renderTex.reset({
            width: 256,
            height: 256
          });
          const cameraComp = this.getComponent(Camera);
          cameraComp.targetTexture = renderTex;
          const pass = this.model.material.passes[0];
          const binding = pass.getBinding('mainTexture');
          pass.bindTexture(binding, renderTex.getGFXTexture());
        }

        onDestroy() {
          if (this._renderTex) {
            this._renderTex.destroy();

            this._renderTex = null;
          }
        } // update (deltaTime: number) {
        //     // Your update function goes here.
        // }


      }, _temp), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "model", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _class2)) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/particle-sprite-change.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, ParticleSystem2D, SpriteFrame, _decorator, Component;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      ParticleSystem2D = module.ParticleSystem2D;
      SpriteFrame = module.SpriteFrame;
      _decorator = module._decorator;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _temp;

      cclegacy._RF.push({}, "9022dbOFcVDObg+SkEHYofd", "particle-sprite-change", undefined);

      const {
        ccclass,
        type
      } = _decorator;
      let ParticleSpriteChange = exports('ParticleSpriteChange', (_dec = ccclass('ParticleSpriteChange'), _dec2 = type(ParticleSystem2D), _dec3 = type(SpriteFrame), _dec4 = type(SpriteFrame), _dec(_class = (_class2 = (_temp = class ParticleSpriteChange extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "particle", _descriptor, this);

          _initializerDefineProperty(this, "spError", _descriptor2, this);

          _initializerDefineProperty(this, "add", _descriptor3, this);
        }

        changeCustom() {
          const ps = this.particle;

          if (ps.spriteFrame !== this.spError) {
            ps.spriteFrame = this.spError;
          } else {
            ps.spriteFrame = this.add;
          }
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "particle", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "spError", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "add", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/audioOperationQueue.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, AudioSource, _decorator, Component;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      AudioSource = module.AudioSource;
      _decorator = module._decorator;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor, _temp;

      cclegacy._RF.push({}, "93c30/5+sxENp0DWUmJnjxY", "audioOperationQueue", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let AudioOperationQueue = exports('AudioOperationQueue', (_dec = ccclass('AudioOperationQueue'), _dec2 = property(AudioSource), _dec(_class = (_class2 = (_temp = class AudioOperationQueue extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "source", _descriptor, this);
        }

        start() {
          // ??????????????????
          this.source.stop();
          this.source.pause();
          this.source.play();
          this.source.currentTime = 3;
          this.source.stop();
          this.source.stop();
          this.source.pause();
          this.source.play();
          this.source.pause();
          this.source.play();
          this.source.currentTime = 1;
          this.source.play();
          this.source.play();
          this.source.stop();
          this.source.play();
        }

      }, _temp), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "source", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/video-player-ctrl.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, _defineProperty, cclegacy, VideoClip, VideoPlayer, Label, Slider, Node, _decorator, Component, sys;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      VideoClip = module.VideoClip;
      VideoPlayer = module.VideoPlayer;
      Label = module.Label;
      Slider = module.Slider;
      Node = module.Node;
      _decorator = module._decorator;
      Component = module.Component;
      sys = module.sys;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _temp;

      cclegacy._RF.push({}, "94e230TPKRPMqKKeFyoIO/J", "video-player-ctrl", undefined);

      const {
        ccclass,
        type
      } = _decorator;
      let VideoPlayerCtrl = exports('VideoPlayerCtrl', (_dec = ccclass('VideoPlayerCtrl'), _dec2 = type(VideoClip), _dec3 = type(VideoPlayer), _dec4 = type(Label), _dec5 = type(Label), _dec6 = type(Label), _dec7 = type(Slider), _dec8 = type(Node), _dec9 = type(Node), _dec10 = type(Label), _dec(_class = (_class2 = (_temp = class VideoPlayerCtrl extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "videClip", _descriptor, this);

          _initializerDefineProperty(this, "videoPlayer", _descriptor2, this);

          _initializerDefineProperty(this, "eventType", _descriptor3, this);

          _initializerDefineProperty(this, "playbackRate", _descriptor4, this);

          _initializerDefineProperty(this, "stayOnBottom", _descriptor5, this);

          _initializerDefineProperty(this, "slider", _descriptor6, this);

          _initializerDefineProperty(this, "stayOnBottomTips", _descriptor7, this);

          _initializerDefineProperty(this, "noSupport", _descriptor8, this);

          _initializerDefineProperty(this, "platform", _descriptor9, this);

          _defineProperty(this, "_playbackRate", 1);
        }

        start() {
          // ??????????????? video player ?????????
          switch (sys.platform) {
            case sys.MACOS:
            case sys.ALIPAY_MINI_GAME:
            case sys.BYTEDANCE_MINI_GAME:
            case sys.COCOSPLAY:
            case sys.HUAWEI_QUICK_GAME:
            case sys.VIVO_MINI_GAME:
            case sys.XIAOMI_QUICK_GAME:
            case sys.BAIDU_MINI_GAME:
            case sys.LINKSURE_MINI_GAME:
            case sys.QTT_MINI_GAME:
            case sys.WIN32:
              this.noSupport.active = true;
              this.videoPlayer.node.active = false;
              break;
          }

          this.platform.string = `platform: ${sys.platform}`;
          this.eventType.string = 'nothing';
        }

        onStayOnBottom() {
          this.videoPlayer.stayOnBottom = !this.videoPlayer.stayOnBottom;
          let state = this.videoPlayer.stayOnBottom ? '??????' : '??????';
          this.stayOnBottom.string = `${state} stayOnBottom`;
          this.stayOnBottomTips.active = this.videoPlayer.stayOnBottom;
        }

        onPlaybackRate() {
          this._playbackRate = this._playbackRate++ >= 3 ? 1 : this._playbackRate;
          this.videoPlayer.playbackRate = this._playbackRate;
          this.playbackRate.string = `x${this._playbackRate}`;
        }

        onSlider(slider) {
          this.videoPlayer.currentTime = slider.progress * this.videoPlayer.duration;
        }

        onPlayLocalVideo() {
          this.videoPlayer.resourceType = VideoPlayer.ResourceType.LOCAL;

          if (this.videoPlayer.clip === this.videClip) {
            this.videoPlayer.play();
          } else {
            this.videoPlayer.clip = this.videClip;
          }
        }

        onPlayRemoteVideo() {
          this.videoPlayer.resourceType = VideoPlayer.ResourceType.REMOTE;
          const remoteURL = 'http://download.cocos.org/CocosTest/test-case/movie.mp4';

          if (this.videoPlayer.remoteURL === remoteURL) {
            this.videoPlayer.play();
          } else {
            this.videoPlayer.remoteURL = remoteURL;
          }
        }

        onEventType(target, type) {
          this.eventType.string = type;

          switch (type) {
            case VideoPlayer.EventType.READY_TO_PLAY:
            case VideoPlayer.EventType.META_LOADED:
              this.videoPlayer.play();
              break;
          }
        }

        update() {
          this.slider.progress = this.videoPlayer.currentTime / this.videoPlayer.duration;
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "videClip", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "videoPlayer", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "eventType", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "playbackRate", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "stayOnBottom", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "slider", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "stayOnBottomTips", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "noSupport", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "platform", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/node-event.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, _defineProperty, cclegacy, Label, Node, _decorator, Component;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Label = module.Label;
      Node = module.Node;
      _decorator = module._decorator;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _temp;

      cclegacy._RF.push({}, "96eb5gupZdFEr/6F/8WWVUA", "node-event", undefined);

      const {
        ccclass,
        property,
        menu
      } = _decorator;
      let NodeEvent = exports('NodeEvent', (_dec = ccclass("NodeEvent"), _dec2 = menu('Event/NodeEvent'), _dec3 = property(Label), _dec4 = property(Node), _dec(_class = _dec2(_class = (_class2 = (_temp = class NodeEvent extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "labelComp", _descriptor, this);

          _initializerDefineProperty(this, "receiver", _descriptor2, this);

          _defineProperty(this, "_receiver", null);
        }

        start() {
          if (this.receiver) {
            this._receiver = this.receiver.getComponent(NodeEvent);
          } else {
            this._receiver = this;
          }

          this.node.on('click', this.click, this._receiver);
        }

        onDestroy() {
          this.node.off('click', this.click, this._receiver);
        }

        click() {
          this.labelComp.string = `Receiver is: ${this._receiver.node.name}`;
        } // update (deltaTime: number) {
        //     // Your update function goes here.
        // }


      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "labelComp", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "receiver", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/use-render-texture-to-sprite.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, RenderTexture, _decorator, Component, SpriteFrame, Sprite;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      RenderTexture = module.RenderTexture;
      _decorator = module._decorator;
      Component = module.Component;
      SpriteFrame = module.SpriteFrame;
      Sprite = module.Sprite;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor, _temp;

      cclegacy._RF.push({}, "977eavsJ0tLkJ4Oyd3LtHF5", "use-render-texture-to-sprite", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let UseRenderTextureToSprite = exports('UseRenderTextureToSprite', (_dec = ccclass('UseRenderTextureToSprite'), _dec2 = property(RenderTexture), _dec(_class = (_class2 = (_temp = class UseRenderTextureToSprite extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "render", _descriptor, this);
        }

        start() {
          const renderTex = this.render;
          const spriteFrame = new SpriteFrame();
          spriteFrame.texture = renderTex;
          const sprite = this.getComponent(Sprite);
          sprite.spriteFrame = spriteFrame; // ???????????????????????????????????????????????????????????????????????????????????????Sprite????????????

          sprite.updateMaterial();
        }

      }, _temp), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "render", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/AudioControl.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, AudioClip, AudioSource, Label, Slider, Toggle, _decorator, Component;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      AudioClip = module.AudioClip;
      AudioSource = module.AudioSource;
      Label = module.Label;
      Slider = module.Slider;
      Toggle = module.Toggle;
      _decorator = module._decorator;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _temp;

      cclegacy._RF.push({}, "9c53aAt3PtHfLz+ArxCBHfU", "AudioControl", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let AudioControl = exports('AudioControl', (_dec = ccclass('AudioControl'), _dec2 = property(AudioClip), _dec3 = property(AudioSource), _dec4 = property(Label), _dec5 = property(Label), _dec6 = property(Slider), _dec7 = property(Slider), _dec8 = property(Label), _dec9 = property(Toggle), _dec10 = property(AudioSource), _dec11 = property(Label), _dec12 = property(Label), _dec13 = property(Slider), _dec14 = property(Slider), _dec15 = property(Label), _dec16 = property(Toggle), _dec(_class = (_class2 = (_temp = class AudioControl extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "clip", _descriptor, this);

          _initializerDefineProperty(this, "source1", _descriptor2, this);

          _initializerDefineProperty(this, "currentTimeLabel1", _descriptor3, this);

          _initializerDefineProperty(this, "durationLabel1", _descriptor4, this);

          _initializerDefineProperty(this, "progressSlider1", _descriptor5, this);

          _initializerDefineProperty(this, "volumeSlider1", _descriptor6, this);

          _initializerDefineProperty(this, "eventLabel1", _descriptor7, this);

          _initializerDefineProperty(this, "toggle1", _descriptor8, this);

          _initializerDefineProperty(this, "source2", _descriptor9, this);

          _initializerDefineProperty(this, "currentTimeLabel2", _descriptor10, this);

          _initializerDefineProperty(this, "durationLabel2", _descriptor11, this);

          _initializerDefineProperty(this, "progressSlider2", _descriptor12, this);

          _initializerDefineProperty(this, "volumeSlider2", _descriptor13, this);

          _initializerDefineProperty(this, "eventLabel2", _descriptor14, this);

          _initializerDefineProperty(this, "toggle2", _descriptor15, this);
        }

        onEnable() {
          var _this$source1$clip, _this$source2$clip;

          console.log('AudioSource1 loadMode: ', (_this$source1$clip = this.source1.clip) === null || _this$source1$clip === void 0 ? void 0 : _this$source1$clip.loadMode);
          console.log('AudioSource2 loadMode: ', (_this$source2$clip = this.source2.clip) === null || _this$source2$clip === void 0 ? void 0 : _this$source2$clip.loadMode);
          this.source1.loop = this.toggle1.isChecked;
          this.source2.loop = this.toggle2.isChecked;
          this.volumeSlider1.progress = this.source1.volume;
          this.volumeSlider2.progress = this.source2.volume;
          this.progressSlider1.node.on('slide', this.onSlide, this);
          this.progressSlider2.node.on('slide', this.onSlide, this);
          this.volumeSlider1.node.on('slide', this.onVolume, this);
          this.volumeSlider2.node.on('slide', this.onVolume, this);
          this.toggle1.node.on(Toggle.EventType.TOGGLE, this.onToggle, this);
          this.toggle2.node.on(Toggle.EventType.TOGGLE, this.onToggle, this);
          this.source1.node.on(AudioSource.EventType.STARTED, this.onStarted, this);
          this.source1.node.on(AudioSource.EventType.ENDED, this.onEnded, this);
          this.source2.node.on(AudioSource.EventType.STARTED, this.onStarted, this);
          this.source2.node.on(AudioSource.EventType.ENDED, this.onEnded, this);
        }

        onDisable() {
          this.progressSlider1.node.off('slide', this.onSlide, this);
          this.progressSlider2.node.off('slide', this.onSlide, this);
          this.volumeSlider1.node.off('slide', this.onVolume, this);
          this.volumeSlider2.node.off('slide', this.onVolume, this);
          this.toggle1.node.off(Toggle.EventType.TOGGLE, this.onToggle, this);
          this.toggle2.node.off(Toggle.EventType.TOGGLE, this.onToggle, this);
          this.source1.node.off(AudioSource.EventType.STARTED, this.onStarted, this);
          this.source1.node.off(AudioSource.EventType.ENDED, this.onEnded, this);
          this.source2.node.off(AudioSource.EventType.STARTED, this.onStarted, this);
          this.source2.node.off(AudioSource.EventType.ENDED, this.onEnded, this);
        }

        playOneShot1() {
          this.source1.playOneShot(this.clip);
        }

        playOneShot2() {
          this.source2.playOneShot(this.clip);
        }

        update(dt) {
          this.updateSlider(this.source1, this.progressSlider1, this.currentTimeLabel1, this.durationLabel1);
          this.updateSlider(this.source2, this.progressSlider2, this.currentTimeLabel2, this.durationLabel2);
        }

        updateSlider(source, slider, currentTimeLabel, durationLabel) {
          let currentTime = Number.parseFloat(source.currentTime.toFixed(2));
          let duration = Number.parseFloat(source.duration.toFixed(2));
          currentTimeLabel.string = currentTime.toString();
          durationLabel.string = duration.toString();
          slider.progress = currentTime / duration;
        }

        onSlide(slider) {
          let source = slider === this.progressSlider1 ? this.source1 : this.source2;
          let currentTime = slider.progress * source.duration;
          source.currentTime = currentTime;
        }

        onVolume(slider) {
          let source = slider === this.volumeSlider1 ? this.source1 : this.source2;
          source.volume = slider.progress;
        }

        onToggle(toggle) {
          let source = toggle === this.toggle1 ? this.source1 : this.source2;
          source.loop = toggle.isChecked;
        }

        onStarted(audioSource) {
          let eventLabel = audioSource === this.source1 ? this.eventLabel1 : this.eventLabel2;
          this.showEventLabel(eventLabel, 'STARTED', 1);
        }

        onEnded(audioSource) {
          let eventLabel = audioSource === this.source1 ? this.eventLabel1 : this.eventLabel2;
          this.showEventLabel(eventLabel, 'ENDED', 1);
        }

        showEventLabel(eventLabel, text, timeInSeconds) {
          eventLabel.string = text;
          eventLabel.node.active = true;
          this.scheduleOnce(() => {
            eventLabel.node.active = false;
          }, timeInSeconds);
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "clip", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "source1", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "currentTimeLabel1", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "durationLabel1", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "progressSlider1", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "volumeSlider1", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "eventLabel1", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "toggle1", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "source2", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "currentTimeLabel2", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "durationLabel2", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "progressSlider2", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "volumeSlider2", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "eventLabel2", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "toggle2", [_dec16], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/gold.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, _defineProperty, cclegacy, Label, _decorator, Component;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Label = module.Label;
      _decorator = module._decorator;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor, _temp;

      cclegacy._RF.push({}, "9cb89iurc1Dl4w4xqSuIEHk", "gold", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let gold = exports('gold', (_dec = ccclass("gold"), _dec2 = property({
        type: Label
      }), _dec(_class = (_class2 = (_temp = class gold extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "label", _descriptor, this);

          _defineProperty(this, "test", 0);
        }

        start() {// Your initialization goes here.
        }

        onButton() {
          this.test += 1;
          this.label.string = `${this.test}`;

          if (this.test > 9) {
            this.test = 0;
          }
        } // update (deltaTime: number) {
        //     // Your update function goes here.
        // }


      }, _temp), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "label", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/layout-change-order.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Node, _decorator, Component, UITransform;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      _decorator = module._decorator;
      Component = module.Component;
      UITransform = module.UITransform;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _temp;

      cclegacy._RF.push({}, "9d410ZZ47ZDeYDqx999RaNZ", "layout-change-order", undefined);

      const {
        ccclass,
        property,
        executeInEditMode
      } = _decorator;
      let LayoutChangeOrder = exports('LayoutChangeOrder', (_dec = ccclass('LayoutChangeOrder'), _dec2 = property(Node), _dec3 = property(Node), _dec4 = property(Node), _dec5 = property(Node), _dec6 = property(Node), _dec7 = property(Node), _dec(_class = executeInEditMode(_class = (_class2 = (_temp = class LayoutChangeOrder extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "changePriority", _descriptor, this);

          _initializerDefineProperty(this, "children_0", _descriptor2, this);

          _initializerDefineProperty(this, "children_1", _descriptor3, this);

          _initializerDefineProperty(this, "children_2", _descriptor4, this);

          _initializerDefineProperty(this, "children_3", _descriptor5, this);

          _initializerDefineProperty(this, "children_4", _descriptor6, this);

          _initializerDefineProperty(this, "children_5", _descriptor7, this);
        }

        start() {
          if (this.changePriority) {
            this.children_0.getComponent(UITransform).priority = 0;
            this.children_1.getComponent(UITransform).priority = 2;
            this.children_2.getComponent(UITransform).priority = 1;
            this.children_3.getComponent(UITransform).priority = 3;
            this.children_4.getComponent(UITransform).priority = 4;
            this.children_5.getComponent(UITransform).priority = 5;
          } else {
            this.children_2.setSiblingIndex(1);
          }
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "changePriority", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "children_0", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "children_1", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "children_2", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "children_3", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "children_4", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "children_5", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/auto-change-opacity.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _defineProperty, _initializerDefineProperty, cclegacy, Renderable2D, UIOpacity, _decorator, Component, Color;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _defineProperty = module.defineProperty;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Renderable2D = module.Renderable2D;
      UIOpacity = module.UIOpacity;
      _decorator = module._decorator;
      Component = module.Component;
      Color = module.Color;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _temp;

      cclegacy._RF.push({}, "9d4e2YDcsNCoYeRNuiHKfjV", "auto-change-opacity", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let AutoChangeOpacity = exports('AutoChangeOpacity', (_dec = ccclass('AutoChangeOpacity'), _dec2 = property({
        type: Renderable2D
      }), _dec3 = property({
        type: UIOpacity
      }), _dec(_class = (_class2 = (_temp = class AutoChangeOpacity extends Component {
        constructor(...args) {
          super(...args);

          _defineProperty(this, "opacity", 0);

          _defineProperty(this, "isColor", false);

          _defineProperty(this, "disappear", true);

          _defineProperty(this, "tempColor", new Color());

          _initializerDefineProperty(this, "renderComp", _descriptor, this);

          _initializerDefineProperty(this, "opacityComp", _descriptor2, this);
        }

        start() {
          this.disappear = true; // For test renderFlag is false when game start

          this.opacity = -1;

          if (this.renderComp) {
            this.isColor = true;
            this.tempColor = this.renderComp.color.clone();
          } else if (this.opacityComp) {
            this.isColor = false;
          }
        } // update (deltaTime: number) {
        //     // [4]
        // }


        update(deltaTime) {
          if (this.opacity <= 0) {
            this.disappear = false;
          } else if (this.opacity >= 255) {
            this.disappear = true;
          }

          if (this.disappear) {
            this.opacity -= 1;
          } else {
            this.opacity += 1;
          }

          if (this.isColor) {
            this.tempColor.a = this.opacity;
            this.renderComp.color = this.tempColor;
          } else {
            this.opacityComp.opacity = this.opacity;
          }
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "renderComp", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "opacityComp", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));
      /**
       * [1] Class member could be defined like this.
       * [2] Use `property` decorator if your want the member to be serializable.
       * [3] Your initialization goes here.
       * [4] Your update function goes here.
       *
       * Learn more about scripting: https://docs.cocos.com/creator/3.0/manual/en/scripting/
       * Learn more about CCClass: https://docs.cocos.com/creator/3.0/manual/en/scripting/ccclass.html
       * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.0/manual/en/scripting/life-cycle-callbacks.html
       */

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/event-first.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, _defineProperty, cclegacy, Prefab, Label, Button, _decorator, Component, instantiate, SystemEventType;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Prefab = module.Prefab;
      Label = module.Label;
      Button = module.Button;
      _decorator = module._decorator;
      Component = module.Component;
      instantiate = module.instantiate;
      SystemEventType = module.SystemEventType;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _temp;

      cclegacy._RF.push({}, "9deb3uG0i1DWYBatN5dSscL", "event-first", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let eventFirst = exports('eventFirst', (_dec = ccclass('eventFirst'), _dec2 = property({
        type: Prefab
      }), _dec3 = property({
        type: Label
      }), _dec4 = property({
        type: Button
      }), _dec(_class = (_class2 = (_temp = class eventFirst extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "prefabNode", _descriptor, this);

          _initializerDefineProperty(this, "labelShow", _descriptor2, this);

          _initializerDefineProperty(this, "button", _descriptor3, this);

          _defineProperty(this, "item", null);
        }

        onLoad() {
          this.item = instantiate(this.prefabNode);
        }

        start() {// Your initialization goes here.
        }

        onEnable() {
          this.eventOn();
        }

        eventOn() {
          this.item.on(SystemEventType.TOUCH_START, this.onTouchStart, this);
          this.item.on(SystemEventType.TOUCH_END, this.onTouchEnd, this);
          this.item.on(SystemEventType.TOUCH_MOVE, this.onTouchMove, this);
          this.item.on(SystemEventType.TOUCH_CANCEL, this.onTouchCancel, this);
        } // update (deltaTime: number) {
        //     // Your update function goes here.
        // }


        onDisable() {
          this.item.off(SystemEventType.TOUCH_START, this.onTouchStart, this);
          this.item.off(SystemEventType.TOUCH_END, this.onTouchEnd, this);
          this.item.off(SystemEventType.TOUCH_MOVE, this.onTouchMove, this);
          this.item.off(SystemEventType.TOUCH_CANCEL, this.onTouchCancel, this);
        }

        onTouchStart(event) {
          this.labelShow.string = `TouchStart: ${event.getLocation()}`;
          console.log(`TouchStart: ${event.getLocation()}`);
        }

        onTouchMove(event) {
          this.labelShow.string = `TouchMove: ${event.getLocation()}`;
          console.log(`TouchMove: ${event.getLocation()}`);
        }

        onTouchEnd(event) {
          this.labelShow.string = 'TouchEnd';
          console.log('TouchEnd');
        }

        onTouchCancel(event) {
          this.labelShow.string = 'TouchCancel';
          console.log('TouchCancel');
        }

        createChild() {
          this.node.addChild(this.item);
          this.button.node.active = false;
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "prefabNode", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "labelShow", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "button", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/editbox-ctrl.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, EditBox, _decorator, Component;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      EditBox = module.EditBox;
      _decorator = module._decorator;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _temp;

      cclegacy._RF.push({}, "a1095F095BAuqFmE8yQddG4", "editbox-ctrl", undefined);

      const {
        ccclass,
        property,
        menu
      } = _decorator;
      let EditboxCtrl = exports('EditboxCtrl', (_dec = ccclass("EditboxCtrl"), _dec2 = menu('UI/EditboxCtrl'), _dec3 = property(EditBox), _dec4 = property(EditBox), _dec5 = property(EditBox), _dec(_class = _dec2(_class = (_class2 = (_temp = class EditboxCtrl extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "editBox1", _descriptor, this);

          _initializerDefineProperty(this, "editBox2", _descriptor2, this);

          _initializerDefineProperty(this, "editBox3", _descriptor3, this);
        }

        start() {// Your initialization goes here.
        }

        setFocus(event, custom) {
          if (custom === '1') {
            this.editBox1.setFocus();
          } else if (custom === '2') {
            this.editBox2.setFocus();
          } else if (custom === '3') {
            this.editBox3.setFocus();
          }
        } // update (deltaTime: number) {
        //     // Your update function goes here.
        // }


      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "editBox1", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "editBox2", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "editBox3", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/material-test.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, _defineProperty, cclegacy, Color, Node, _decorator, Component, MeshRenderer, director, Label, gfx;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Color = module.Color;
      Node = module.Node;
      _decorator = module._decorator;
      Component = module.Component;
      MeshRenderer = module.MeshRenderer;
      director = module.director;
      Label = module.Label;
      gfx = module.gfx;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _temp;

      cclegacy._RF.push({}, "a133filF+BE/b9gjDYAmj56", "material-test", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      const color = Color.WHITE.clone();
      let MaterialTest = exports('MaterialTest', (_dec = ccclass("MaterialTest"), _dec2 = property(Node), _dec3 = property(Node), _dec4 = property(Node), _dec(_class = (_class2 = (_temp = class MaterialTest extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "manualAlbedo", _descriptor, this);

          _initializerDefineProperty(this, "manualMetallic", _descriptor2, this);

          _initializerDefineProperty(this, "manualAlphaTest", _descriptor3, this);

          _defineProperty(this, "_material", null);
        }

        start() {
          this._material = this.node.getComponent(MeshRenderer).material;
        }

        update() {
          this.node.setRotationFromEuler(0, director.getCurrentTime() * 0.01, 0);
        } // callbacks


        useAlbedoMap(e) {
          this._material.recompileShaders({
            USE_ALBEDO_MAP: e.isChecked
          });

          this.manualAlbedo.active = !e.isChecked;
        }

        useMetallicMap(e) {
          this._material.recompileShaders({
            USE_METALLIC_ROUGHNESS_MAP: e.isChecked
          });

          this.manualMetallic.active = !e.isChecked;
        }

        useAlphaTest(e) {
          this._material.recompileShaders({
            USE_ALPHA_TEST: e.isChecked
          });

          this.manualAlphaTest.active = e.isChecked;
        }

        setAlbedo(e) {
          const li = e.progress * 255;
          color.set(li, li, li, li);

          this._material.setProperty('albedo', color);

          this.manualAlbedo.getComponentInChildren(Label).string = e.progress.toFixed(1);
        }

        setMetallic(e) {
          this._material.setProperty('metallic', e.progress);

          this.manualMetallic.getComponentInChildren(Label).string = e.progress.toFixed(1);
        }

        setAlphaThreshold(e) {
          this._material.setProperty('alphaThreshold', e.progress);

          this.manualAlphaTest.getComponentInChildren(Label).string = e.progress.toFixed(1);
        }

        cullFrontFace(e) {
          this._material.overridePipelineStates({
            rasterizerState: {
              cullMode: e.isChecked ? gfx.CullMode.FRONT : gfx.CullMode.BACK
            }
          });
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "manualAlbedo", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "manualMetallic", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "manualAlphaTest", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/touch-event.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Label, Node, _decorator, Component, view, systemEvent, SystemEvent;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Label = module.Label;
      Node = module.Node;
      _decorator = module._decorator;
      Component = module.Component;
      view = module.view;
      systemEvent = module.systemEvent;
      SystemEvent = module.SystemEvent;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _temp;

      cclegacy._RF.push({}, "a1f49jKDlBFO4sao4R7Z9g2", "touch-event", undefined);

      const {
        ccclass,
        property,
        menu
      } = _decorator;
      let SystemEventTest = exports('SystemEventTest', (_dec = ccclass("SystemEventTest"), _dec2 = property(Label), _dec3 = property(Label), _dec4 = property(Node), _dec(_class = (_class2 = (_temp = class SystemEventTest extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "labelShow", _descriptor, this);

          _initializerDefineProperty(this, "tip", _descriptor2, this);

          _initializerDefineProperty(this, "notSupported", _descriptor3, this);
        }

        onLoad() {
          // NOTE: we've simulated touch event on PC end for now
          // if (!sys.isMobile) {
          //     this.notSupported.active = true;
          //     return;
          // }
          const canvasSize = view.getCanvasSize();
          this.tip.string = this.tip.string.replace('{{width}}', canvasSize.width.toString());
          this.tip.string = this.tip.string.replace('{{height}}', canvasSize.height.toString());
          systemEvent.on(SystemEvent.EventType.TOUCH_START, this.onTouchStart, this);
          systemEvent.on(SystemEvent.EventType.TOUCH_END, this.onTouchEnd, this);
          systemEvent.on(SystemEvent.EventType.TOUCH_MOVE, this.onTouchMove, this);
          systemEvent.on(SystemEvent.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        }

        onDestroy() {
          systemEvent.off(SystemEvent.EventType.TOUCH_START, this.onTouchStart, this);
          systemEvent.off(SystemEvent.EventType.TOUCH_END, this.onTouchEnd, this);
          systemEvent.off(SystemEvent.EventType.TOUCH_MOVE, this.onTouchMove, this);
          systemEvent.off(SystemEvent.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        }

        onTouchStart(touch, event) {
          this.labelShow.string = `TouchStart: ${event.getLocation()}`;
        }

        onTouchMove(touch, event) {
          this.labelShow.string = `TouchMove: ${event.getLocation()}`;
        }

        onTouchEnd(touch, event) {
          this.labelShow.string = `TouchEnd: ${event.getLocation()}`;
        }

        onTouchCancel(touch, event) {
          this.labelShow.string = `TouchCancel`;
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "labelShow", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "tip", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "notSupported", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/sphere_light.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _defineProperty, cclegacy, _decorator, Component, Vec3;

  return {
    setters: [function (module) {
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Component = module.Component;
      Vec3 = module.Vec3;
    }],
    execute: function () {
      var _dec, _class, _temp;

      cclegacy._RF.push({}, "a2018D8J3dIiYOJf8RTv9VA", "sphere_light", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let typescript = exports('typescript', (_dec = ccclass('typescript'), _dec(_class = (_temp = class typescript extends Component {
        constructor(...args) {
          super(...args);

          _defineProperty(this, "_nowP", new Vec3(0.0, 0.0, 0.0));

          _defineProperty(this, "_startP", 0.0);

          _defineProperty(this, "_low", 2.0);

          _defineProperty(this, "_height", 3.51);

          _defineProperty(this, "_time", 0);
        }

        start() {
          // Your initialization goes here.
          this._nowP = this.node.position;
          this._startP = Math.asin((this._nowP.y - this._low) / (this._height - this._low));
        }

        update(deltaTime) {
          this._time += 0.01;
          this._nowP.y = (Math.sin(this._time - this._startP) + 1.0) * 2.0 * (this._height - this._low) + this._low;
          this.node.setPosition(this._nowP);
        }

      }, _temp)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/click-and-listener.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _defineProperty, cclegacy, _decorator, Component, Label;

  return {
    setters: [function (module) {
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Component = module.Component;
      Label = module.Label;
    }],
    execute: function () {
      var _dec, _dec2, _class, _temp;

      cclegacy._RF.push({}, "a9268xYoEFIPLoutplf7g9g", "click-and-listener", undefined);

      const {
        ccclass,
        property,
        menu
      } = _decorator;
      let ClickAndListener = exports('ClickAndListener', (_dec = ccclass("ClickAndListener"), _dec2 = menu('UI/ClickAndListener'), _dec(_class = _dec2(_class = (_temp = class ClickAndListener extends Component {
        constructor(...args) {
          super(...args);

          _defineProperty(this, "_label", null);
        }

        start() {
          this._label = this.getComponent(Label);
        }

        clickCallback(event, data) {
          this._label.string = data;
        } // update (deltaTime: number) {
        //     // Your update function goes here.
        // }


      }, _temp)) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/Test.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, _defineProperty, cclegacy, EditBox, SpriteFrame, _decorator, Component, find, Label, Sprite;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      EditBox = module.EditBox;
      SpriteFrame = module.SpriteFrame;
      _decorator = module._decorator;
      Component = module.Component;
      find = module.find;
      Label = module.Label;
      Sprite = module.Sprite;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _temp;

      cclegacy._RF.push({}, "acb91WgF7FLwbelgCmr78H7", "Test", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let Test = exports('Test', (_dec = ccclass("Test"), _dec2 = property({
        type: EditBox
      }), _dec3 = property({
        type: SpriteFrame
      }), _dec4 = property({
        type: SpriteFrame
      }), _dec5 = property({
        type: SpriteFrame
      }), _dec6 = property({
        type: SpriteFrame
      }), _dec(_class = (_class2 = (_temp = class Test extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "editbox", _descriptor, this);

          _initializerDefineProperty(this, "sf", _descriptor2, this);

          _initializerDefineProperty(this, "sea", _descriptor3, this);

          _initializerDefineProperty(this, "lake", _descriptor4, this);

          _initializerDefineProperty(this, "mountain", _descriptor5, this);

          _defineProperty(this, "tipLabel", null);

          _defineProperty(this, "showLabel", null);

          _defineProperty(this, "_sprite", null);

          _defineProperty(this, "_label", '????????????');
        }

        start() {
          var _canvas$getChildByNam, _canvas$getChildByNam2;

          const canvas = find('Canvas');
          this.tipLabel = canvas === null || canvas === void 0 ? void 0 : (_canvas$getChildByNam = canvas.getChildByName('Label-1')) === null || _canvas$getChildByNam === void 0 ? void 0 : _canvas$getChildByNam.getComponent(Label);
          this.showLabel = canvas === null || canvas === void 0 ? void 0 : (_canvas$getChildByNam2 = canvas.getChildByName('Label-2')) === null || _canvas$getChildByNam2 === void 0 ? void 0 : _canvas$getChildByNam2.getComponent(Label);
          this._sprite = this.node.getComponent(Sprite);
        }

        test(name) {
          this._sprite.changeSpriteFrameFromAtlas(name);
        }

        button() {
          this.tipLabel.node.active = !this.tipLabel.node.active;
        }

        button1() {
          this.test(this.editbox.string);

          if (this._sprite.spriteFrame !== null) {
            this.showLabel.string = this._label + ' ' + this.editbox.string;
          }

          if (this._sprite.spriteAtlas === null) {
            this.showLabel.string = "????????????" + this.editbox.string;
          }

          if (this._sprite.spriteAtlas != null && this._sprite.spriteFrame == null) {
            this.showLabel.string = "????????????????????????";
          }

          this.tipLabel.node.active = false;
        }

        button2() {
          this._sprite.spriteAtlas = null;
          this.showLabel.string = '????????????';
          this._label = '????????????';
        }

        button3(name) {
          this.name = this.editbox.string;

          if (this.name == 'tree') {
            this._sprite.spriteFrame = this.sf;
            this.showLabel.string = '???????????? tree';
          }

          if (this.name == 'sea') {
            this._sprite.spriteFrame = this.sea;
            this.showLabel.string = '???????????? sea';
          }

          if (this.name == 'lake') {
            this._sprite.spriteFrame = this.lake;
            this.showLabel.string = '???????????? lake';
          }

          if (this.name == 'mountain') {
            this._sprite.spriteFrame = this.mountain;
            this.showLabel.string = '???????????? mountain';
          }

          if (this.name != 'mountain' && this.name != 'lake' && this.name != 'sea' && this.name != 'tree') {
            this.showLabel.string = '????????????????????????';
          }
        }

        button4() {
          this.tipLabel.node.active = !this.tipLabel.node.active;
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "editbox", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "sf", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "sea", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "lake", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "mountain", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/particle-custom-change.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, ParticleSystem2D, _decorator, Component;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      ParticleSystem2D = module.ParticleSystem2D;
      _decorator = module._decorator;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor, _temp;

      cclegacy._RF.push({}, "afc74+MThhNObj4Y7mBV5OT", "particle-custom-change", undefined);

      const {
        ccclass,
        type
      } = _decorator;
      let ParticleCustomChange = exports('ParticleCustomChange', (_dec = ccclass('ParticleCustomChange'), _dec2 = type(ParticleSystem2D), _dec(_class = (_class2 = (_temp = class ParticleCustomChange extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "particle", _descriptor, this);
        }

        changeCustom() {
          this.particle.custom = !this.particle.custom;
        }

      }, _temp), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "particle", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/BuildTimeConstantsTest.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc', './env'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Node, _decorator, Component, Label, env;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      _decorator = module._decorator;
      Component = module.Component;
      Label = module.Label;
    }, function (module) {
      env = module;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor, _temp;

      cclegacy._RF.push({}, "b0326gWXPZCZZWtUz1h2XSP", "BuildTimeConstantsTest", undefined);

      const {
        ccclass,
        property,
        menu,
        executeInEditMode
      } = _decorator; // import * as buildTimeConstants from 'build-time-constants';

      const keys = Object.keys(env).sort();
      let BuildTimeConstantsTest = exports('BuildTimeConstantsTest', (_dec = ccclass('BuildTimeConstantsTest'), _dec2 = menu('TestCases/Scripting/BuildTimeConstantsTest'), _dec3 = property(Node), _dec(_class = _dec2(_class = executeInEditMode(_class = (_class2 = (_temp = class BuildTimeConstantsTest extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "labelNode", _descriptor, this);
        }

        start() {
          const label = this.labelNode.getComponent(Label);
          const keyNameMaxLen = keys.reduce((len, key) => Math.max(len, key.length), 0);
          label.string = `\
            ${keys.map(key => {
            const value = env[key];
            const valueRep = typeof value === 'boolean' ? value ? 'V' : 'X' : value;
            return `${key.padStart(keyNameMaxLen, ' ')} : ${valueRep}`;
          }).join('\n')}
`;
        }

      }, _temp), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "labelNode", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _class2)) || _class) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/TweenRepeatForever.ts", ['cc'], function (exports) {
  'use strict';

  var cclegacy, Component, tween, Vec3, _decorator;

  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Component = module.Component;
      tween = module.tween;
      Vec3 = module.Vec3;
      _decorator = module._decorator;
    }],
    execute: function () {
      var _dec, _dec2, _class;

      cclegacy._RF.push({}, "b06c2YjnhhEwJmoSA0i153H", "TweenRepeatForever", undefined);

      const {
        ccclass,
        property,
        menu
      } = _decorator;
      let TweenRepeatForever = exports('TweenRepeatForever', (_dec = ccclass("TweenRepeatForever"), _dec2 = menu("tween/TweenRepeatForever"), _dec(_class = _dec2(_class = class TweenRepeatForever extends Component {
        onLoad() {
          // ????????????????????????
          this.tweenRF = tween(this.node).by(1, {
            scale: new Vec3(2, 2, 2)
          }).repeatForever();
        }

        onEnable() {
          this.tweenRF.start();
        }

        onDisable() {
          /**
           * v1.0.4 ????????????????????????????????? node ??????????????????????????????????????? stop
           */
          // this.tweenRF.stop();
        }

      }) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/wire-frame.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _defineProperty, cclegacy, _decorator, Component, Material, gfx, Vec4, MeshRenderer, utils, primitives;

  return {
    setters: [function (module) {
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Component = module.Component;
      Material = module.Material;
      gfx = module.gfx;
      Vec4 = module.Vec4;
      MeshRenderer = module.MeshRenderer;
      utils = module.utils;
      primitives = module.primitives;
    }],
    execute: function () {
      var _dec, _class, _class2, _temp;

      cclegacy._RF.push({}, "b4f9555Y+ZOYbMoZ8HBVqT8", "wire-frame", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let wireFrame = exports('wireFrame', (_dec = ccclass('wireFrame'), _dec(_class = (_temp = _class2 = class wireFrame extends Component {
        onEnable() {
          if (wireFrame.lineMat == null) {
            wireFrame.lineMat = new Material();
            wireFrame.lineMat.initialize({
              effectName: 'unlit',
              states: {
                primitive: gfx.PrimitiveMode.LINE_LIST
              }
            });
            wireFrame.lineMat.setProperty('mainColor', new Vec4(0, 0, 0, 1));
          }

          const model = this.getComponent(MeshRenderer);

          if (model && model.mesh && model.mesh.subMeshCount > 0) {
            const newModel = this.addComponent(MeshRenderer);
            const geo = {
              positions: model.mesh.renderingSubMeshes[0].geometricInfo.positions.slice(),
              indices: model.mesh.renderingSubMeshes[0].geometricInfo.indices.slice()
            };
            const mesh = utils.createMesh(primitives.wireframed(geo));
            newModel.material = wireFrame.lineMat;
            newModel.mesh = mesh;
          }
        }

      }, _defineProperty(_class2, "lineMat", null), _temp)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/Client.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _defineProperty, cclegacy;

  return {
    setters: [function (module) {
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "b6d024kRaRAM6r6jQ+zjtlM", "Client", undefined);

      class Client {
        get connected() {
          return this._connected;
        }

        constructor(address = '127.0.0.1', port = 8080) {
          _defineProperty(this, "_socket", null);

          _defineProperty(this, "_connected", false);

          _defineProperty(this, "_timer", 0);

          _defineProperty(this, "_maxRetryTime", 3);

          _defineProperty(this, "onopen", null);

          _defineProperty(this, "onmessage", null);

          _defineProperty(this, "onclose", null);

          let retryTime = 0;

          const init = () => {
            {
              this._socket = new WebSocket('ws://' + address + ':' + port);
            }

            this._socket.onmessage = event => {
              this.onmessage && this.onmessage(event);
            };

            this._socket.onopen = () => {
              this._connected = true;
              this.onopen && this.onopen();
            };

            this._socket.onerror = () => {
              this._connected = false;
              retryTime++;

              if (retryTime <= this._maxRetryTime) {
                this._timer = setTimeout(init, 1000);
              }
            };

            this._socket.onclose = () => {
              this._connected = false;
              this.onclose && this.onclose();
            };
          };

          init();
        }

        postMessage(message) {
          if (this._connected) {
            if (typeof message !== 'string' && !(message instanceof ArrayBuffer) && !ArrayBuffer.isView(message)) {
              message = JSON.stringify(message);
            }

            this._socket.send(message);

            return true;
          }
        }

        close() {
          this._socket.close();

          if (this._timer) {
            clearTimeout(this._timer);
          }
        }

      }

      exports('Client', Client);

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/AssetLoading.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _defineProperty, _initializerDefineProperty, cclegacy, Node, Label, Prefab, SpriteFrame, _decorator, Component, loader, director, SpriteAtlas, Font, TextureCube, Texture2D, log, AudioSource, Layers, instantiate, MeshRenderer, UIMeshRenderer, builtinResMgr, Sprite;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _defineProperty = module.defineProperty;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      Label = module.Label;
      Prefab = module.Prefab;
      SpriteFrame = module.SpriteFrame;
      _decorator = module._decorator;
      Component = module.Component;
      loader = module.loader;
      director = module.director;
      SpriteAtlas = module.SpriteAtlas;
      Font = module.Font;
      TextureCube = module.TextureCube;
      Texture2D = module.Texture2D;
      log = module.log;
      AudioSource = module.AudioSource;
      Layers = module.Layers;
      instantiate = module.instantiate;
      MeshRenderer = module.MeshRenderer;
      UIMeshRenderer = module.UIMeshRenderer;
      builtinResMgr = module.builtinResMgr;
      Sprite = module.Sprite;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _temp;

      cclegacy._RF.push({}, "b7a38N/ysBPxb/1g3EBPfn4", "AssetLoading", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let AssetLoading = exports('AssetLoading', (_dec = ccclass("AssetLoading"), _dec2 = property({
        type: Node
      }), _dec3 = property({
        type: Label
      }), _dec4 = property({
        type: [Node]
      }), _dec5 = property({
        type: Prefab
      }), _dec6 = property({
        type: SpriteFrame
      }), _dec(_class = (_class2 = (_temp = class AssetLoading extends Component {
        constructor(...args) {
          super(...args);

          _defineProperty(this, "_lastType", '');

          _defineProperty(this, "_curRes", null);

          _defineProperty(this, "_btnLabel", null);

          _defineProperty(this, "_audioSource", null);

          _defineProperty(this, "_isLoading", false);

          _defineProperty(this, "_urls", {
            Audio: "test_assets/audio",
            Txt: "test_assets/text",
            ImageAsset: "test_assets/PurpleMonster",
            Texture2D: "test_assets/PurpleMonster/texture",
            Font: "test_assets/font",
            SpriteAtlas: "test_assets/atlas.plist",
            SpriteFrame: "test_assets/image/spriteFrame",
            Prefab: "test_assets/prefab",
            Animation: "test_assets/testAnim",
            Scene: "test_assets/test-scene",
            TextureCube: "test_assets/cubemap",
            CORS: "https://download.cocos.org/CocosTest/test-case/logo.png",
            Material: "test_assets/testMat",
            Mesh: "test_assets/Monster/monster.mesh",
            Skeleton: "test_assets/Monster/Armature.skeleton"
          });

          _initializerDefineProperty(this, "showWindow", _descriptor, this);

          _initializerDefineProperty(this, "loadTips", _descriptor2, this);

          _initializerDefineProperty(this, "loadList", _descriptor3, this);

          _initializerDefineProperty(this, "loadAnimTestPrefab", _descriptor4, this);

          _initializerDefineProperty(this, "loadMaterialSpriteFrame", _descriptor5, this);
        } // use this for initialization


        onLoad() {
          // registered event
          this._onRegisteredEvent();
        }

        onDestroy() {
          if (this._curRes) {
            loader.releaseAsset(this._curRes);
          }
        }

        _onRegisteredEvent() {
          for (var i = 0; i < this.loadList.length; ++i) {
            this.loadList[i].on(Node.EventType.TOUCH_END, this._onClick.bind(this));
          }
        }

        _onClick(event) {
          if (this._isLoading) {
            return;
          }

          this._onClear();

          const target = event.target;

          if (target) {
            const curType = target.name.split('_')[1];

            if (curType in this._urls) {
              this._curType = curType;
            }
          }

          if (this._lastType !== "" && this._curType === this._lastType) {
            this.loadTips.string = '';

            this._onShowResClick(event);

            return;
          }

          if (this._btnLabel) {
            this._btnLabel.string = "????????? " + this._lastType;
          }

          this._lastType = this._curType;

          if (target) {
            this._btnLabel = target.getChildByName("Label").getComponent(Label);
          }

          this.loadTips.string = this._curType + " Loading....";
          this._isLoading = true;

          this._load();
        }

        _load() {
          const url = this._urls[this._curType];

          var loadCallBack = this._loadCallBack.bind(this);

          switch (this._curType) {
            case 'SpriteFrame':
              // specify the type to load sub asset from texture's url
              loader.loadRes(url, SpriteFrame, loadCallBack);
              break;

            case 'Texture2D':
              loader.loadRes(url, Texture2D, loadCallBack);
              break;

            case 'TextureCube':
              loader.loadRes(url, TextureCube, loadCallBack);
              break;

            case 'Font':
              loader.loadRes(url, Font, loadCallBack);
              break;

            case 'SpriteAtlas':
              loader.loadRes(url, SpriteAtlas, loadCallBack);
              break;

            case 'Animation':
            case 'Prefab':
            case 'Skeleton':
            case 'Mesh':
            case 'ImageAsset':
            case 'Txt':
            case 'Audio':
            case 'Material':
            case 'Skeleton':
              loader.loadRes(url, loadCallBack);
              break;

            case 'Scene':
              director.loadScene(url);
              break;

            case 'CORS':
              loader.load(url, loadCallBack);
              this.loadTips.string = "CORS image should report texImage2D error under WebGL and works ok under Canvas";
              break;

            default:
              loader.load(url, loadCallBack);
              break;
          }
        }

        _loadCallBack(err, res) {
          this._isLoading = false;

          if (err) {
            log('Error url [' + err + ']');
            return;
          }

          if (this._curType === 'ImageAsset' || this._curType === 'CORS') {
            this._curRes = new Texture2D();
            this._curRes.image = res;
          } else {
            this._curRes = res;
          }

          if (this._btnLabel) {
            if (this._curType === "Audio") {
              this._btnLabel.string = "??????";
            } else {
              this._btnLabel.string = "??????";
            }

            this._btnLabel.string += this._curType;
          }

          this.loadTips.string = this._curType + " Loaded Successfully!";
        }

        _onClear() {
          this.showWindow.removeAllChildren();

          if (this._audioSource && this._audioSource instanceof AudioSource) {
            this._audioSource.stop();
          }
        }

        _onShowResClick(event) {
          if (this._curType === "Scene") {
            return;
          }

          this._createNode(this._curType, this._curRes);
        }

        _createNode(type, res) {
          this.loadTips.string = "";
          const node = new Node("New " + type);
          node.layer = Layers.Enum.UI_2D;
          node.setPosition(0, 0, 0);
          let component = null;

          switch (this._curType) {
            case "SpriteFrame":
              component = node.addComponent(Sprite);
              component.spriteFrame = res;
              break;

            case "SpriteAtlas":
              component = node.addComponent(Sprite);
              component.spriteFrame = res.getSpriteFrames()[0];
              break;

            case "Texture2D":
              let cube = instantiate(this.loadAnimTestPrefab);
              const model = cube.getComponent(MeshRenderer);
              model.material.setProperty('albedoMap', res);
              cube.setPosition(0, 0, 50);
              cube.setScale(100, 100, 100);
              cube.parent = this.showWindow;
              break;

            case 'ImageAsset':
            case "CORS":
              component = node.addComponent(Sprite);
              const spriteFrame = new SpriteFrame();
              spriteFrame.texture = res;
              component.spriteFrame = spriteFrame;
              break;

            case "Audio":
              component = node.addComponent(AudioSource);
              component.clip = res;
              component.play();
              this._audioSource = component;
              this.loadTips.string = "???????????????";
              break;

            case "Txt":
              component = node.addComponent(Label);
              component.lineHeight = 40;
              component.string = res.text;
              break;

            case "Material":
              component = node.addComponent(Sprite);
              component.sharedMaterials = res;
              component.spriteFrame = this.loadMaterialSpriteFrame;
              break;

            case "Font":
              component = node.addComponent(Label);
              component.font = res;
              component.lineHeight = 40;
              component.string = "This is BitmapFont!";
              break;

            case 'Mesh':
              component = node.addComponent(MeshRenderer);
              node.addComponent(UIMeshRenderer);
              node.setPosition(0, 0, 50);
              node.setScale(5, 5, 5);
              component.mesh = res;
              component.material = builtinResMgr.get('standard-material');
              break;

            case "Prefab":
              let prefab = instantiate(res);
              prefab.parent = node;
              prefab.setPosition(0, 0, 0);
              break;

            default:
              this.loadTips.string = "????????????????????????";
              break;
          }

          this.showWindow.addChild(node);
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "showWindow", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "loadTips", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "loadList", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "loadAnimTestPrefab", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "loadMaterialSpriteFrame", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/event-info.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Label, _decorator, Component, view, systemEvent, SystemEventType;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Label = module.Label;
      _decorator = module._decorator;
      Component = module.Component;
      view = module.view;
      systemEvent = module.systemEvent;
      SystemEventType = module.SystemEventType;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _temp;

      cclegacy._RF.push({}, "b7fbeTedz5DS48dh969Stjm", "event-info", undefined);

      const {
        ccclass,
        property,
        menu
      } = _decorator;
      let EventInfo = exports('EventInfo', (_dec = ccclass("EventInfo"), _dec2 = menu('Event/EventInfo'), _dec3 = property(Label), _dec4 = property(Label), _dec(_class = _dec2(_class = (_class2 = (_temp = class EventInfo extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "label", _descriptor, this);

          _initializerDefineProperty(this, "top", _descriptor2, this);
        }

        start() {
          this.top.string = `????????????: ${view.getCanvasSize()} \n UI ??????: ${view.getVisibleSize()}`;
          systemEvent.on(SystemEventType.TOUCH_START, this._touchStart, this);
          systemEvent.on(SystemEventType.TOUCH_MOVE, this._touchMove, this);
          systemEvent.on(SystemEventType.TOUCH_END, this._touchEnd, this);
          systemEvent.on(SystemEventType.MOUSE_MOVE, this._mouseMove, this);
          systemEvent.on(SystemEventType.MOUSE_UP, this._mouseUp, this);
        }

        onDestroy() {
          systemEvent.off(SystemEventType.TOUCH_START, this._touchStart, this);
          systemEvent.off(SystemEventType.TOUCH_MOVE, this._touchMove, this);
          systemEvent.off(SystemEventType.TOUCH_END, this._touchEnd, this);
          systemEvent.off(SystemEventType.MOUSE_MOVE, this._mouseMove, this);
          systemEvent.off(SystemEventType.MOUSE_UP, this._mouseUp, this);
        } // update (deltaTime: number) {
        //     // Your update function goes here.
        // }


        _touchStart(touch) {
          let content = `touch startLocation:  ${touch.getStartLocation()} \n`;
          content += `UI touch startLocation:  ${touch.getUIStartLocation()} \n`;
          this.label.string = content;
        }

        _touchMove(event) {
          let content = '';
          content += 'touch pre location: ' + event.getPreviousLocation() + '\n';
          content += 'touch location: ' + event.getLocation() + '\n';
          content += 'touch delta: ' + event.getDelta() + '\n';
          content += 'touch location in view: ' + event.getLocationInView() + '\n';
          content += 'UI touch pre location: ' + event.getUIPreviousLocation() + '\n';
          content += 'UI touch location: ' + event.getUILocation() + '\n';
          content += 'UI touch delta: ' + event.getUIDelta() + '\n';
          this.label.string = content;
        }

        _touchEnd() {
          this.label.string = 'End';
        }

        _mouseMove(event) {
          let content = '';
          content += 'mouse pre location: ' + event.getPreviousLocation() + '\n';
          content += 'mouse location: ' + event.getLocation() + '\n';
          content += 'mouse delta: ' + event.getDelta() + '\n';
          content += 'mouse location in view: ' + event.getLocationInView() + '\n';
          content += 'UI mouse pre location: ' + event.getUIPreviousLocation() + '\n';
          content += 'UI mouse location: ' + event.getUILocation() + '\n';
          content += 'UI mouse delta: ' + event.getUIDelta() + '\n';
          this.label.string = content;
        }

        _mouseUp() {
          this.label.string = 'End';
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "label", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "top", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/change-graphics.ts", ['cc'], function (exports) {
  'use strict';

  var cclegacy, Component, Graphics, _decorator;

  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Component = module.Component;
      Graphics = module.Graphics;
      _decorator = module._decorator;
    }],
    execute: function () {
      var _dec, _dec2, _class;

      cclegacy._RF.push({}, "b8d16/SKKRMO5pWpEllhAXf", "change-graphics", undefined);

      const {
        ccclass,
        property,
        menu
      } = _decorator;
      let ChangeGraphics = exports('ChangeGraphics', (_dec = ccclass("ChangeGraphics"), _dec2 = menu('UI/ChangeGraphics'), _dec(_class = _dec2(_class = class ChangeGraphics extends Component {
        start() {// Your initialization goes here.
        }

        drawRect() {
          const g = this.getComponent(Graphics);
          g.clear();
          g.lineWidth = 10;
          g.fillColor.fromHEX('#ff0000'); // rect

          g.rect(-250, 0, 200, 100); // round rect

          g.roundRect(50, 0, 200, 100, 20);
          g.stroke();
          g.fill();
        }

        drawArc() {
          const g = this.getComponent(Graphics);
          g.clear();
          g.lineWidth = 5;
          g.fillColor.fromHEX('#ff0000');
          g.arc(0, 0, 100, Math.PI / 2, Math.PI, false);
          g.lineTo(0, 0);
          g.close();
          g.stroke();
          g.fill();
          g.fillColor.fromHEX('#00ff00');
          g.arc(-10, 10, 100, Math.PI / 2, Math.PI, true);
          g.lineTo(-10, 10);
          g.close();
          g.stroke();
          g.fill();
        }

        drawLineTo() {
          const g = this.getComponent(Graphics);
          g.clear();
          g.lineWidth = 10;
          g.fillColor.fromHEX('#ff0000');
          g.moveTo(-20, 0);
          g.lineTo(0, -100);
          g.lineTo(20, 0);
          g.lineTo(0, 100);
          g.close();
          g.stroke();
          g.fill();
        }

        drawEllipse() {
          const g = this.getComponent(Graphics);
          g.clear();
          g.lineWidth = 10;
          g.fillColor.fromHEX('#ff0000');
          g.circle(150, 0, 100);
          g.ellipse(-150, 0, 100, 70);
          g.stroke();
          g.fill();
        }

      }) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/toggle-ctrl.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, ToggleContainer, _decorator, Component, Label;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      ToggleContainer = module.ToggleContainer;
      _decorator = module._decorator;
      Component = module.Component;
      Label = module.Label;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor, _temp;

      cclegacy._RF.push({}, "bb72epOWF9CCrIWL9vgq1Ge", "toggle-ctrl", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let ToggleCtrl = exports('ToggleCtrl', (_dec = ccclass('ToggleCtrl'), _dec2 = property(ToggleContainer), _dec(_class = (_class2 = (_temp = class ToggleCtrl extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "group", _descriptor, this);
        }

        start() {
          let node = this.group.node.getChildByName('Label');
          let label = node.getComponent(Label);
          label.string += `\n toggleItems length : ${this.group.toggleItems.length}`;
        }

      }, _temp), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "group", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/AnimationEventTesting.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, _defineProperty, cclegacy, Label, _decorator, Component;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Label = module.Label;
      _decorator = module._decorator;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor, _temp;

      cclegacy._RF.push({}, "bc36fyzATlDor7Phlki8dYB", "AnimationEventTesting", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let AnimationEventTesting = exports('AnimationEventTesting', (_dec = ccclass("AnimationEventTesting"), _dec2 = property({
        type: Label
      }), _dec(_class = (_class2 = (_temp = class AnimationEventTesting extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "label", _descriptor, this);

          _defineProperty(this, "_times", 1);
        }

        start() {// Your initialization goes here.
        } // update (deltaTime: number) {
        //     // Your update function goes here.
        // }


        AnimationEventTest(param) {
          this.label.string = "???" + this._times++ + "??????" + param;
        }

      }, _temp), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "label", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/capture_to_web.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, _defineProperty, cclegacy, Sprite, Camera, _decorator, Component, SpriteFrame, RenderTexture;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Sprite = module.Sprite;
      Camera = module.Camera;
      _decorator = module._decorator;
      Component = module.Component;
      SpriteFrame = module.SpriteFrame;
      RenderTexture = module.RenderTexture;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _temp;

      cclegacy._RF.push({}, "c0df2m0GMhJYpH+xSMVYVVQ", "capture_to_web", undefined);

      const {
        ccclass,
        property,
        menu
      } = _decorator;
      let CaptureToWeb = exports('CaptureToWeb', (_dec = ccclass('CaptureToWeb'), _dec2 = menu('RenderTexture/CaptureToWeb'), _dec3 = property(Sprite), _dec4 = property(Camera), _dec(_class = _dec2(_class = (_class2 = (_temp = class CaptureToWeb extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "sprite", _descriptor, this);

          _initializerDefineProperty(this, "camera", _descriptor2, this);

          _defineProperty(this, "_renderTex", null);
        }

        start() {
          const spriteFrame = this.sprite.spriteFrame;
          const sp = new SpriteFrame();
          sp.reset({
            originalSize: spriteFrame.originalSize,
            rect: spriteFrame.rect,
            offset: spriteFrame.offset,
            isRotate: spriteFrame.rotated,
            borderTop: spriteFrame.insetTop,
            borderLeft: spriteFrame.insetLeft,
            borderBottom: spriteFrame.insetBottom,
            borderRight: spriteFrame.insetRight
          });
          const renderTex = this._renderTex = new RenderTexture();
          renderTex.reset({
            width: 128,
            height: 128
          });
          this.camera.targetTexture = renderTex;
          sp.texture = renderTex;
          this.sprite.spriteFrame = sp;
          this.sprite.updateMaterial();
          this.scheduleOnce(() => {
            renderTex.resize(512, 512);
          }, 2);
        }

        onDestroy() {
          if (this._renderTex) {
            this._renderTex.destroy();

            this._renderTex = null;
          }
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "sprite", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "camera", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/ShowTips.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _defineProperty, cclegacy, _decorator, Component;

  return {
    setters: [function (module) {
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _class, _temp;

      cclegacy._RF.push({}, "c161aJHiblOroMdOeGczlfU", "ShowTips", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let ShowTips = exports('ShowTips', (_dec = ccclass("ShowTips"), _dec(_class = (_temp = class ShowTips extends Component {
        constructor(...args) {
          super(...args);

          _defineProperty(this, "tips", null);

          _defineProperty(this, "ifShow", true);
        }

        showTip() {
          if (this.ifShow == false) {
            this.tips.setPosition(0, 1000, 0);
          }

          if (this.ifShow) {
            this.tips.setPosition(0, 0, 0);
          }

          this.ifShow = !this.ifShow;
        }

        start() {
          // Your initialization goes here.
          this.tips = this.node.getChildByName('tips');
        } // update (deltaTime: number) {
        //     // Your update function goes here.
        // }


      }, _temp)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/LoadSpine.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Label, _decorator, Component, loader, sp;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Label = module.Label;
      _decorator = module._decorator;
      Component = module.Component;
      loader = module.loader;
      sp = module.sp;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor, _temp;

      cclegacy._RF.push({}, "c17afOJ5PBHxIigUOVBfvPh", "LoadSpine", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let LoadSpine = exports('LoadSpine', (_dec = ccclass('LoadSpine'), _dec2 = property({
        type: Label
      }), _dec(_class = (_class2 = (_temp = class LoadSpine extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "tips", _descriptor, this);
        }

        start() {
          // Your initialization goes here.
          loader.loadRes("spine/alien/alien-pro", sp.SkeletonData, (err, spineAsset) => {
            if (err) {
              this.tips.string = "Failed to load asset";
              return;
            }

            let comp = this.getComponent('sp.Skeleton');
            comp.skeletonData = spineAsset;
            let ani = comp.setAnimation(0, 'run', true);
            this.tips.string = 'Load Success';
          });
        } // update (deltaTime: number) {
        //     // Your update function goes here.
        // }


      }, _temp), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "tips", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/toggle-event-ctrl.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Label, _decorator, Component;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Label = module.Label;
      _decorator = module._decorator;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor, _temp;

      cclegacy._RF.push({}, "c22adkyonxMMq+dz11Rnh0V", "toggle-event-ctrl", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let ToggleEvent = exports('ToggleEvent', (_dec = ccclass('ToggleEvent'), _dec2 = property(Label), _dec(_class = (_class2 = (_temp = class ToggleEvent extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "tips", _descriptor, this);
        }

        onToggleClick(toggle) {
          this.tips.string = `????????? toggle ??????????????? Toggle ????????????${toggle.isChecked}`;
        }

        onToggleContainerClick(toggle) {
          this.tips.string = `????????? ToggleContainer ???????????????${toggle.node.name}??? Toggle`;
        }

      }, _temp), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "tips", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/graphics-mask.ts", ['cc'], function (exports) {
  'use strict';

  var cclegacy, Component, Mask, _decorator;

  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Component = module.Component;
      Mask = module.Mask;
      _decorator = module._decorator;
    }],
    execute: function () {
      var _dec, _dec2, _class;

      cclegacy._RF.push({}, "c3558UrdgNCJ4ibMKFaVL2l", "graphics-mask", undefined);

      const {
        ccclass,
        property,
        menu,
        executeInEditMode
      } = _decorator;
      let GraphicsMask = exports('GraphicsMask', (_dec = ccclass("GraphicsMask"), _dec2 = menu('UI/GraphicsMask'), _dec(_class = _dec2(_class = executeInEditMode(_class = class GraphicsMask extends Component {
        start() {
          this.drawArc();
        }

        drawArc() {
          const mask = this.getComponent(Mask);
          const g = mask.graphics;
          g.clear();
          g.lineWidth = 10;
          g.fillColor.fromHEX('#ff0000');
          g.moveTo(-80, 0);
          g.lineTo(0, -150);
          g.lineTo(80, 0);
          g.lineTo(0, 150);
          g.close();
          g.stroke();
          g.fill();
        }

      }) || _class) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/CameraController.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, _defineProperty, cclegacy, _decorator, Component, Vec3, Quat, math;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Component = module.Component;
      Vec3 = module.Vec3;
      Quat = module.Quat;
      math = module.math;
    }],
    execute: function () {
      var _dec, _class, _class2, _descriptor, _descriptor2, _temp;

      cclegacy._RF.push({}, "c40916EtdZOjJLnC+2Jc6AL", "CameraController", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let CameraController = exports('CameraController', (_dec = ccclass("CameraController"), _dec(_class = (_class2 = (_temp = class CameraController extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "translateDelta", _descriptor, this);

          _initializerDefineProperty(this, "rotateDelta", _descriptor2, this);

          _defineProperty(this, "_rotateDelta", 0);

          _defineProperty(this, "_temp_vec3", new Vec3());

          _defineProperty(this, "_temp_quat", new Quat());
        }

        start() {
          // Your initialization goes here.
          this._rotateDelta = math.toRadian(this.rotateDelta);
        } // update (deltaTime: number) {
        //     // Your update function goes here.
        // }


        translate(leftRight, backForth, dt) {
          Vec3.set(this._temp_vec3, leftRight * this.translateDelta * dt, 0, backForth * this.translateDelta * dt);
          this.node.translate(this._temp_vec3);
        }

        rotate(longitudinal, perpendicular, dt) {
          Quat.fromEuler(this._temp_quat, perpendicular * this.rotateDelta * dt, longitudinal * this.rotateDelta * dt, 0);
          this.node.rotate(this._temp_quat);
        }

        onPushJoystick(dt, customEventData) {
          switch (customEventData) {
            case 'F':
              this.translate(0, -1, dt);
              break;

            case 'B':
              this.translate(0, 1, dt);
              break;

            case 'L':
              this.translate(-1, 0, dt);
              break;

            case 'R':
              this.translate(1, 0, dt);
              break;

            case 'U':
              this.rotate(0, 1, dt);
              break;

            case 'D':
              this.rotate(0, -1, dt);
              break;

            case 'RL':
              this.rotate(1, 0, dt);
              break;

            case 'RR':
              this.rotate(-1, 0, dt);
              break;
          }
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "translateDelta", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "rotateDelta", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 5;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/LabeledSlider.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, _decorator, Component, Slider, Label, EventHandler, js;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Component = module.Component;
      Slider = module.Slider;
      Label = module.Label;
      EventHandler = module.EventHandler;
      js = module.js;
    }],
    execute: function () {
      var _dec, _class, _class2, _descriptor, _descriptor2, _descriptor3, _temp;

      cclegacy._RF.push({}, "c457eD5+XJJ/LMdYhKEG60x", "LabeledSlider", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let LabeledSlider = exports('LabeledSlider', (_dec = ccclass('LabeledSlider'), _dec(_class = (_class2 = (_temp = class LabeledSlider extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "min", _descriptor, this);

          _initializerDefineProperty(this, "max", _descriptor2, this);

          _initializerDefineProperty(this, "integral", _descriptor3, this);
        }

        start() {
          const slider = this._slider = this.node.getChildByPath('Slider').getComponent(Slider);
          const valueLabel = this._valueLabel = this.node.getChildByPath('ValueLabel').getComponent(Label);
          const eventHandler = new EventHandler();
          eventHandler.target = this.node;
          eventHandler.component = js.getClassName(LabeledSlider);
          eventHandler.handler = '_onSliderChanged';
          slider.slideEvents.push(eventHandler);

          this._onSliderChanged();
        }

        _onSliderChanged() {
          const val = this.min + (this.max - this.min) * this._slider.progress;
          this._valueLabel.string = `${this.integral ? Math.floor(val) : val}`;
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "min", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "max", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "integral", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      })), _class2)) || _class));
      /**
       * [1] Class member could be defined like this.
       * [2] Use `property` decorator if your want the member to be serializable.
       * [3] Your initialization goes here.
       * [4] Your update function goes here.
       *
       * Learn more about scripting: https://docs.cocos.com/creator/3.0/manual/en/scripting/
       * Learn more about CCClass: https://docs.cocos.com/creator/3.0/manual/en/scripting/ccclass.html
       * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.0/manual/en/scripting/life-cycle-callbacks.html
       */

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/widget-preformance.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, _defineProperty, cclegacy, Prefab, SpriteFrame, _decorator, Component, instantiate, Sprite, Widget, Color, UITransform;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Prefab = module.Prefab;
      SpriteFrame = module.SpriteFrame;
      _decorator = module._decorator;
      Component = module.Component;
      instantiate = module.instantiate;
      Sprite = module.Sprite;
      Widget = module.Widget;
      Color = module.Color;
      UITransform = module.UITransform;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _temp;

      cclegacy._RF.push({}, "c4ef3eRVBJBtpMR5pXx2QQZ", "widget-preformance", undefined);

      const {
        ccclass,
        property,
        menu
      } = _decorator;
      let WidgetPreformance = exports('WidgetPreformance', (_dec = ccclass("WidgetPreformance"), _dec2 = menu('UI/WidgetPreformance'), _dec3 = property(Prefab), _dec4 = property(SpriteFrame), _dec(_class = _dec2(_class = (_class2 = (_temp = class WidgetPreformance extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "performancePrefab", _descriptor, this);

          _initializerDefineProperty(this, "bgTex", _descriptor2, this);

          _defineProperty(this, "nodeA", null);
        }

        start() {
          let i = 0;
          this.nodeA = instantiate(this.performancePrefab);
          this.node.addChild(this.nodeA);
          const sprite = this.nodeA.getComponent(Sprite);
          sprite.spriteFrame = this.bgTex;
          const arr = [true, false];

          for (i = 0; i < 500; i++) {
            const child = instantiate(this.performancePrefab);
            child.name = `layer_${i + 1}`;
            this.nodeA.addChild(child);
            const childWidgetComp = child.getComponent(Widget);
            childWidgetComp.isAlignTop = true;
            let bol = arr[Math.floor(Math.random() * arr.length)];
            childWidgetComp.isAlignLeft = bol;
            bol = arr[Math.floor(Math.random() * arr.length)];
            childWidgetComp.isAlignBottom = true;
            childWidgetComp.isAlignRight = bol;
            childWidgetComp.top = 0;
            childWidgetComp.left = Math.random() * 200;
            childWidgetComp.bottom = 0;
            childWidgetComp.right = Math.random() * 150;
            const renderComp = child.getComponent(Sprite);
            renderComp.color = new Color(Math.random() * 255, Math.random() * 255, Math.random() * 255, 255);
          }

          this.schedule(this.adjustWidget, 0.5);
        }

        onDisable() {
          this.unschedule(this.adjustWidget);
        }

        adjustWidget() {
          const uiTrans = this.nodeA.getComponent(UITransform);
          const size = uiTrans.contentSize;
          uiTrans.setContentSize(size.width, Math.random() * 200);
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "performancePrefab", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "bgTex", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/widget-destroy.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, _defineProperty, cclegacy, Prefab, Label, _decorator, Component, Vec3, instantiate, director, widgetManager;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Prefab = module.Prefab;
      Label = module.Label;
      _decorator = module._decorator;
      Component = module.Component;
      Vec3 = module.Vec3;
      instantiate = module.instantiate;
      director = module.director;
      widgetManager = module.widgetManager;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _temp;

      cclegacy._RF.push({}, "c5e6bCykblPn6fE7lnHQtss", "widget-destroy", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let WidgetDestroy = exports('WidgetDestroy', (_dec = ccclass("WidgetDestroy"), _dec2 = property({
        type: Prefab
      }), _dec3 = property({
        type: Label
      }), _dec4 = property({
        type: Label
      }), _dec(_class = (_class2 = (_temp = class WidgetDestroy extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "defaultPre", _descriptor, this);

          _initializerDefineProperty(this, "coinNumber", _descriptor2, this);

          _initializerDefineProperty(this, "activeWidgetNum", _descriptor3, this);

          _defineProperty(this, "movePos", new Vec3(-200, 0, 0));
        }

        createPrefab() {
          let item = instantiate(this.defaultPre);
          this.node.addChild(item);
          this.schedule(this.updateLabel, 0.5);
        }

        destroyThenCreate() {
          if (this.node.children.length < 1) {
            return;
          }

          this.node.children[this.node.children.length - 1].destroy();
          this.createPrefab();
        }

        moveRoot() {
          this.movePos.x += 20;
          this.node.setPosition(this.movePos);
        }

        updateLabel() {
          this.coinNumber.string = 'The Coin Num is:' + director.getScene().children[2].children[3].children.length;
          this.activeWidgetNum.string = 'The active Widget Num is:' + (widgetManager._activeWidgetsIterator.length - 5); // ????????? 5 ??????????????????create???????????????widget??????
          // ???????????? activeNode ??? iconNum ??????????????????????????? widget ?????????????????????5???
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "defaultPre", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "coinNumber", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "activeWidgetNum", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/loadSubPackages.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Label, Node, _decorator, Component, loader, Color, assetManager, SpriteAtlas, Sprite;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Label = module.Label;
      Node = module.Node;
      _decorator = module._decorator;
      Component = module.Component;
      loader = module.loader;
      Color = module.Color;
      assetManager = module.assetManager;
      SpriteAtlas = module.SpriteAtlas;
      Sprite = module.Sprite;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _temp;

      cclegacy._RF.push({}, "c613aqM8DtJXq0RwpVyXnS/", "loadSubPackages", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let loadSubPackages = exports('loadSubPackages', (_dec = ccclass("loadSubPackages"), _dec2 = property({
        type: Label
      }), _dec3 = property({
        type: Node
      }), _dec(_class = (_class2 = (_temp = class loadSubPackages extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "label", _descriptor, this);

          _initializerDefineProperty(this, "canvas", _descriptor2, this);
        }

        start() {
          // Your initialization goes here.
          this.loadSubPackage();
        }

        loadSubPackage() {
          this.label.string = 'Load subPackage...';
          loader.downloader.loadSubpackage('subPackage', err => {
            if (err) {
              this.label.string = 'load subPackage failed!';
              this.label.color = Color.RED;
              return console.error(err);
            }

            this.label.string = 'load subPackage success!';
            console.log(`load subpackage(subPackage) successfully.`);
            this.loadSpriteAtlas();
          });
        }

        loadSpriteAtlas() {
          assetManager.getBundle('subPackage').load('sheep', SpriteAtlas, (err, atlas) => {
            if (err) {
              return console.error(err);
            }

            loader.setAutoRelease(atlas, true);
            const node = new Node();
            this.canvas.addChild(node);
            node.setPosition(0, 0, 0);
            const sprite = node.addComponent(Sprite);
            sprite.spriteFrame = atlas.getSpriteFrame('sheep_down_0');
            this.label.string += '\nLoad atlas in subPackage success!';
            console.log('Load atlas in subPackage success!');
          });
        } // update (deltaTime: number) {
        //     // Your update function goes here.
        // }


      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "label", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "canvas", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/TweenActionCallBack.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _defineProperty, cclegacy, _decorator, Component, Vec3, tween, Quat;

  return {
    setters: [function (module) {
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Component = module.Component;
      Vec3 = module.Vec3;
      tween = module.tween;
      Quat = module.Quat;
    }],
    execute: function () {
      var _dec, _class, _temp;

      cclegacy._RF.push({}, "c674fT0YG9Jo6W4Cp5LYcqA", "TweenActionCallBack", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let TweenActionCallBack = exports('TweenActionCallBack', (_dec = ccclass("TweenActionCallBack"), _dec(_class = (_temp = class TweenActionCallBack extends Component {
        constructor(...args) {
          super(...args);

          _defineProperty(this, "_scale", new Vec3(1, 1, 1));
        }

        onLoad() {
          const that = this;
          let times = 0;
          this.tween = tween(this._scale) // ?????? 1s
          .delay(1).by(1, new Vec3(1, 1, 1), {
            'onStart': () => {
              // ?????????????????????????????????node
              if (times == 1) that.node.translate(new Vec3(0, 10, 0));
            },
            'onUpdate': () => {
              that.node.scale = that._scale;
            },
            'onComplete': () => {
              // ????????????????????????, ??????Node
              if (times == 2) that.node.rotate(Quat.fromEuler(new Quat(), 0, 45, 0));
              times++;
            }
          }).repeat(3);
        }

        onEnable() {
          this.tween.start();
        }

        onDisable() {
          this.tween.stop();
        }

      }, _temp)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/CoreJsTest.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc', './ui-log.ts'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, _decorator, Component, UILog;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Component = module.Component;
    }, function (module) {
      UILog = module.UILog;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor, _temp;

      cclegacy._RF.push({}, "c743e/HL69CAqH8vec3N4x9", "CoreJsTest", undefined);

      const {
        ccclass,
        property,
        menu
      } = _decorator;
      let CoreJsTest = exports('CoreJsTest', (_dec = ccclass('CoreJsTest'), _dec2 = menu('TestCases/Scripting/LanguageFeature/CoreJsTest'), _dec3 = property(UILog), _dec(_class = _dec2(_class = (_class2 = (_temp = class CoreJsTest extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "logPanel", _descriptor, this);
        }

        start() {
          this.logPanel.addLabel(`????????????...
---------------------------------------\
`);

          this._runTests();

          this.logPanel.addLabel(`\
---------------------------------------
???????????????\
`);
        }

        _runTests() {
          const asserts = this._asserts.bind(this);

          asserts(shouldBeDefined(globalThis)); // asserts(shouldBeDefined(globalThis.what));

          function shouldBeDefined(value) {
            return typeof value !== 'undefined';
          }
        }

        _asserts(expr) {
          if (!expr) {
            this.logPanel.addLabel(`??? ???????????????`);
          }
        }

      }, _temp), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "logPanel", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _class2)) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/ButtonEventCapture.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, _defineProperty, cclegacy, EventHandler, _decorator, Component, Button;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      EventHandler = module.EventHandler;
      _decorator = module._decorator;
      Component = module.Component;
      Button = module.Button;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor, _temp;

      cclegacy._RF.push({}, "c78c8Aob3dDEZX15sLNznvP", "ButtonEventCapture", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      const emptyArr = new Array();
      let ButtonEventCapture = exports('ButtonEventCapture', (_dec = ccclass("ButtonEventCapture"), _dec2 = property({
        type: EventHandler
      }), _dec(_class = (_class2 = (_temp = class ButtonEventCapture extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "eventHandler", _descriptor, this);

          _defineProperty(this, "_button", null);

          _defineProperty(this, "_click", false);
        }

        start() {
          // Your initialization goes here.
          this._button = this.getComponent(Button);

          this._button.node.on(Button.EventType.CLICK, this.click, this);
        }

        click() {
          this._click = true;
        }

        update(deltaTime) {
          // Your update function goes here.
          if (this._click) {
            emptyArr[0] = deltaTime;
            this.eventHandler.emit(emptyArr);
            this._click = false;
          }
        }

      }, _temp), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "eventHandler", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new EventHandler();
        }
      }), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/TweenRemoveSelf.ts", ['cc'], function (exports) {
  'use strict';

  var cclegacy, Component, tween, _decorator;

  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Component = module.Component;
      tween = module.tween;
      _decorator = module._decorator;
    }],
    execute: function () {
      var _dec, _dec2, _class;

      cclegacy._RF.push({}, "c7949ZkV0JICKrGvOPs4iyK", "TweenRemoveSelf", undefined);

      const {
        ccclass,
        property,
        menu
      } = _decorator;
      let TweenRemoveSelf = exports('TweenRemoveSelf', (_dec = ccclass("TweenRemoveSelf"), _dec2 = menu("tween/TweenRemoveSelf"), _dec(_class = _dec2(_class = class TweenRemoveSelf extends Component {
        onLoad() {
          /**
           * ?????? target ????????? Node ????????????????????? removeSelf
           */
          this.tweenRemoveSelf = tween(this.node).delay(1).removeSelf();
        }

        onEnable() {
          this.tweenRemoveSelf.start();
        }

        onDisable() {
          this.tweenRemoveSelf.stop();
        }

      }) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/instanced-color.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _defineProperty, cclegacy, Color, _decorator, Component, MeshRenderer;

  return {
    setters: [function (module) {
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Color = module.Color;
      _decorator = module._decorator;
      Component = module.Component;
      MeshRenderer = module.MeshRenderer;
    }],
    execute: function () {
      var _dec, _class, _temp;

      cclegacy._RF.push({}, "cb4458YfHxLYJuKZiHvk9m8", "instanced-color", undefined);

      const {
        ccclass
      } = _decorator;

      const _color = new Color();

      const _data = new Float32Array(4);

      let InstancedColor = exports('InstancedColor', (_dec = ccclass('InstancedColor'), _dec(_class = (_temp = class InstancedColor extends Component {
        constructor(...args) {
          super(...args);

          _defineProperty(this, "_models", []);
        }

        start() {
          this._models = this.node.getComponentsInChildren(MeshRenderer);
        }

        update(deltaTime) {
          const models = this._models;
          const len = models.length;

          for (let i = 0; i < len; i++) {
            const model = models[i];
            Color.toArray(_data, _color.fromHSV((model.node.position.y + 1) * 0.5, 0.5, 1));
            model.setInstancedAttribute('a_color_instanced', _data);
          }
        }

      }, _temp)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/deprecated-testing.ts", ['cc'], function (exports) {
  'use strict';

  var cclegacy, Component, Animation, AnimationClip, Vec3, _decorator;

  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Component = module.Component;
      Animation = module.Animation;
      AnimationClip = module.AnimationClip;
      Vec3 = module.Vec3;
      _decorator = module._decorator;
    }],
    execute: function () {
      var _dec, _class;

      cclegacy._RF.push({}, "cc4f9IgmW9NVpqXTd8nWoW4", "deprecated-testing", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let DeprecatedTesting = exports('DeprecatedTesting', (_dec = ccclass("deprecated-testing"), _dec(_class = class DeprecatedTesting extends Component {
        start() {
          let anim = this.node.addComponent(Animation);
          let clip = new AnimationClip('DD'); // API ??????

          anim.addClip(clip); // API ?????? + ???????????????

          anim.removeClip(clip); // ????????????????????????
          // @ts-ignore

          Vec3['sub'];
        }

      }) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/PlaybackRange.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc', './LabeledSlider.ts'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, AnimationClip, Slider, Label, _decorator, Component, AnimationState, LabeledSlider;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      AnimationClip = module.AnimationClip;
      Slider = module.Slider;
      Label = module.Label;
      _decorator = module._decorator;
      Component = module.Component;
      AnimationState = module.AnimationState;
    }, function (module) {
      LabeledSlider = module.LabeledSlider;
    }],
    execute: function () {
      var _dec, _class, _class2, _descriptor, _descriptor2, _temp, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _class4, _class5, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _temp2;

      cclegacy._RF.push({}, "cda2fixBepLN48wqVoNESov", "PlaybackRange", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let Mark = (_dec = ccclass('Mark'), _dec(_class = (_class2 = (_temp = class Mark {
        constructor() {
          _initializerDefineProperty(this, "frame", _descriptor, this);

          _initializerDefineProperty(this, "name", _descriptor2, this);
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "frame", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "name", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return '';
        }
      })), _class2)) || _class);
      let PlaybackRange = exports('PlaybackRange', (_dec2 = ccclass('PlaybackRange'), _dec3 = property(AnimationClip), _dec4 = property(Slider), _dec5 = property(Slider), _dec6 = property(LabeledSlider), _dec7 = property(LabeledSlider), _dec8 = property(Label), _dec9 = property([Mark]), _dec2(_class4 = (_class5 = (_temp2 = class PlaybackRange extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "clip", _descriptor3, this);

          _initializerDefineProperty(this, "sliderMin", _descriptor4, this);

          _initializerDefineProperty(this, "sliderMax", _descriptor5, this);

          _initializerDefineProperty(this, "labeledSliderMin", _descriptor6, this);

          _initializerDefineProperty(this, "labeledSliderMax", _descriptor7, this);

          _initializerDefineProperty(this, "totalFramesLabel", _descriptor8, this);

          _initializerDefineProperty(this, "marks", _descriptor9, this);
        }

        get totalFrames() {
          return Math.floor(this.frameRate * this.clip.duration);
        }

        get frameRate() {
          return this.clip.sample || 30;
        }

        setRange(min, max) {
          if (!this._state) {
            return;
          }

          const factor = 1.0 / this.frameRate;
          this._state.playbackRange = {
            min: factor * min,
            max: factor * max
          };
        }

        start() {
          this.totalFramesLabel.string = `${this.totalFrames}`;
          this.labeledSliderMin.max = this.totalFrames;
          this.labeledSliderMax.max = this.totalFrames;
          this._state = new AnimationState(this.clip);
          this._state.weight = 1.0;

          this._state.initialize(this.node);

          this._state.play();
        }

        onDestroy() {
          if (this._state) {
            this._state.destroy();
          }
        }

        onSliderChanged() {
          const totalFrames = this.totalFrames;
          const minFrames = Math.floor(totalFrames * this.sliderMin.progress);
          const maxFrames = Math.floor(totalFrames * this.sliderMax.progress);

          if (maxFrames <= minFrames) {
            return;
          }

          this.setRange(minFrames, maxFrames); // this._state.wrapMode = AnimationClip.WrapMode.Normal;

          this._state.stop();

          this._state.play();
        }

      }, _temp2), (_descriptor3 = _applyDecoratedDescriptor(_class5.prototype, "clip", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor4 = _applyDecoratedDescriptor(_class5.prototype, "sliderMin", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor5 = _applyDecoratedDescriptor(_class5.prototype, "sliderMax", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor6 = _applyDecoratedDescriptor(_class5.prototype, "labeledSliderMin", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor7 = _applyDecoratedDescriptor(_class5.prototype, "labeledSliderMax", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor8 = _applyDecoratedDescriptor(_class5.prototype, "totalFramesLabel", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor9 = _applyDecoratedDescriptor(_class5.prototype, "marks", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      })), _class5)) || _class4));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/testJsList.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Label, _decorator, Component;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Label = module.Label;
      _decorator = module._decorator;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor, _temp;

      cclegacy._RF.push({}, "cfb87ZSolxPPaNTWpnTT9v5", "testJsList", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let TestJsList = exports('TestJsList', (_dec = ccclass("TestJsList"), _dec2 = property({
        type: Label
      }), _dec(_class = (_class2 = (_temp = class TestJsList extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "label", _descriptor, this);
        }

        start() {
          const str = globalThis['JS_LIST_TIPS'];

          if (str.length) {
            this.label.string = str;
          }
        }

      }, _temp), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "label", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/render-ui-to-spriteframe.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, _defineProperty, cclegacy, Sprite, _decorator, Component, SpriteFrame, RenderTexture, view, Canvas;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Sprite = module.Sprite;
      _decorator = module._decorator;
      Component = module.Component;
      SpriteFrame = module.SpriteFrame;
      RenderTexture = module.RenderTexture;
      view = module.view;
      Canvas = module.Canvas;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor, _temp;

      cclegacy._RF.push({}, "d5a0eQxO1FNObBKLceL0sgB", "render-ui-to-spriteframe", undefined);

      const {
        ccclass,
        property,
        menu
      } = _decorator;
      let RenderUIToSpriteFrame = exports('RenderUIToSpriteFrame', (_dec = ccclass('RenderUIToSpriteFrame'), _dec2 = menu('RenderTexture/RenderUIToSpriteFrame'), _dec3 = property(Sprite), _dec(_class = _dec2(_class = (_class2 = (_temp = class RenderUIToSpriteFrame extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "content", _descriptor, this);

          _defineProperty(this, "_renderTex", null);
        }

        start() {
          const spriteFrame = this.content.spriteFrame;
          const sp = new SpriteFrame();
          sp.reset({
            originalSize: spriteFrame.originalSize,
            rect: spriteFrame.rect,
            offset: spriteFrame.offset,
            isRotate: spriteFrame.rotated,
            borderTop: spriteFrame.insetTop,
            borderLeft: spriteFrame.insetLeft,
            borderBottom: spriteFrame.insetBottom,
            borderRight: spriteFrame.insetRight
          });
          const renderTex = this._renderTex = new RenderTexture();
          const size = view.getVisibleSize();
          renderTex.reset({
            width: size.width,
            height: size.height
          });
          const cameraComp = this.getComponent(Canvas);
          cameraComp.targetTexture = renderTex;
          sp.texture = renderTex;
          this.content.spriteFrame = sp;
          this.content.updateMaterial();
        }

        onDestroy() {
          if (this._renderTex) {
            this._renderTex.destroy();

            this._renderTex = null;
          }
        } // update (deltaTime: number) {
        //     // Your update function goes here.
        // }


      }, _temp), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "content", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _class2)) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/TweenDelay.ts", ['cc'], function (exports) {
  'use strict';

  var cclegacy, Component, tween, Vec3, _decorator;

  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Component = module.Component;
      tween = module.tween;
      Vec3 = module.Vec3;
      _decorator = module._decorator;
    }],
    execute: function () {
      var _dec, _dec2, _class;

      cclegacy._RF.push({}, "d6bdf6xbXNOfayKGwLKR4B9", "TweenDelay", undefined);

      const {
        ccclass,
        property,
        menu
      } = _decorator;
      let TweenDelay = exports('TweenDelay', (_dec = ccclass("TweenDelay"), _dec2 = menu("tween/TweenDelay"), _dec(_class = _dec2(_class = class TweenDelay extends Component {
        onLoad() {
          this.tweenDelay = tween(this.node) // ?????? 1s
          .delay(1).to(1, {
            scale: new Vec3(2, 2, 2)
          }) // ????????? 1s
          .delay(1).to(1, {
            scale: new Vec3(3, 3, 3)
          });
        }

        onEnable() {
          this.tweenDelay.start();
        }

        onDisable() {
          this.tweenDelay.stop();
        }

      }) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/progress.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, _defineProperty, cclegacy, ProgressBar, _decorator, Component;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      ProgressBar = module.ProgressBar;
      _decorator = module._decorator;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _temp;

      cclegacy._RF.push({}, "d99e6wmJJRKFLcXIDvt9F5V", "progress", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let progress = exports('progress', (_dec = ccclass("progress"), _dec2 = property({
        type: ProgressBar
      }), _dec3 = property({
        type: ProgressBar
      }), _dec4 = property({
        type: ProgressBar
      }), _dec(_class = (_class2 = (_temp = class progress extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "sprite", _descriptor, this);

          _initializerDefineProperty(this, "ProgressBar", _descriptor2, this);

          _initializerDefineProperty(this, "reProgressBar", _descriptor3, this);

          _defineProperty(this, "timer", 0);
        }

        start() {// Your initialization goes here.
        }

        pro(num) {
          this.sprite.getComponent(ProgressBar).progress = num;
          this.ProgressBar.getComponent(ProgressBar).progress = num;
          this.reProgressBar.getComponent(ProgressBar).progress = num;
        }

        update(deltaTime) {
          this.timer += 0.1 * deltaTime;

          if (this.timer > 1) {
            this.timer = 0;
          }

          this.pro(this.timer);
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "sprite", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "ProgressBar", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "reProgressBar", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/LoadDragonBones.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, dragonBones, _decorator, Component, loader;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      dragonBones = module.dragonBones;
      _decorator = module._decorator;
      Component = module.Component;
      loader = module.loader;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor, _temp;

      cclegacy._RF.push({}, "db25aaEuudOurDFcTFrx3Al", "LoadDragonBones", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let LoadDragonBones = exports('LoadDragonBones', (_dec = ccclass('LoadDragonBones'), _dec2 = property({
        type: dragonBones.ArmatureDisplay
      }), _dec(_class = (_class2 = (_temp = class LoadDragonBones extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "dragonBones", _descriptor, this);
        }

        start() {// Your initialization goes here.
        }

        dynamicCreate() {
          loader.loadRes('dragonBones/NewDragonTest', dragonBones.DragonBonesAsset, (err, res) => {
            if (err) {
              console.error(err);
              return;
            }

            this.dragonBones.dragonAsset = res;
            loader.loadRes('dragonBones/texture', dragonBones.DragonBonesAtlasAsset, (err, res) => {
              if (err) {
                console.error(err);
                return;
              }

              this.dragonBones.dragonAtlasAsset = res;
              this.dragonBones.armatureName = "armatureName";
              this.dragonBones.playAnimation('stand', 0);
            });
          });
        } // update (deltaTime: number) {
        //     // Your update function goes here.
        // }


      }, _temp), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "dragonBones", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/SpineCollider.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _defineProperty, cclegacy, _decorator, Component, PhysicsSystem2D, Contact2DType, EPhysics2DDrawFlags, Sprite, Color;

  return {
    setters: [function (module) {
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Component = module.Component;
      PhysicsSystem2D = module.PhysicsSystem2D;
      Contact2DType = module.Contact2DType;
      EPhysics2DDrawFlags = module.EPhysics2DDrawFlags;
      Sprite = module.Sprite;
      Color = module.Color;
    }],
    execute: function () {
      var _dec, _class, _temp;

      cclegacy._RF.push({}, "dc74fi10upIPZ9ydQe0eazG", "SpineCollider", undefined);

      const {
        ccclass
      } = _decorator;
      let SpineCollider = exports('SpineCollider', (_dec = ccclass('SpineCollider'), _dec(_class = (_temp = class SpineCollider extends Component {
        constructor(...args) {
          super(...args);

          _defineProperty(this, "touchingCountMap", new Map());

          _defineProperty(this, "debugDrawFlags", 0);
        }

        start() {
          // Your initialization goes here.
          PhysicsSystem2D.instance.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
          PhysicsSystem2D.instance.on(Contact2DType.END_CONTACT, this.onEndContact, this);
          this.debugDrawFlags = PhysicsSystem2D.instance.debugDrawFlags;
        }

        onEnable() {
          PhysicsSystem2D.instance.debugDrawFlags = this.debugDrawFlags | EPhysics2DDrawFlags.Shape;
        }

        onDisable() {
          PhysicsSystem2D.instance.debugDrawFlags = this.debugDrawFlags;
        }

        addContact(c) {
          let count = this.touchingCountMap.get(c.node) || 0;
          this.touchingCountMap.set(c.node, ++count);
          let sprite = c.getComponent(Sprite);

          if (sprite) {
            sprite.color = Color.RED;
          }
        }

        removeContact(c) {
          let count = this.touchingCountMap.get(c.node) || 0;
          --count;

          if (count <= 0) {
            this.touchingCountMap.delete(c.node);
            let sprite = c.getComponent(Sprite);

            if (sprite) {
              sprite.color = Color.WHITE;
            }
          } else {
            this.touchingCountMap.set(c.node, count);
          }
        }

        onBeginContact(a, b) {
          this.addContact(a);
          this.addContact(b);
        }

        onEndContact(a, b) {
          this.removeContact(a);
          this.removeContact(b);
        }

      }, _temp)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/editbox-event.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, _defineProperty, cclegacy, Label, _decorator, Component;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Label = module.Label;
      _decorator = module._decorator;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor, _temp;

      cclegacy._RF.push({}, "dc817Zk5fFIwL416ijXNkBW", "editbox-event", undefined);

      const {
        ccclass,
        property,
        menu
      } = _decorator;
      let EditboxEvent = exports('EditboxEvent', (_dec = ccclass("EditboxEvent"), _dec2 = menu('UI/EditboxEvent'), _dec3 = property(Label), _dec(_class = _dec2(_class = (_class2 = (_temp = class EditboxEvent extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "showLabel", _descriptor, this);

          _defineProperty(this, "_isReturn", false);
        }

        start() {// Your initialization goes here.
        }

        editBegan(event, custom) {
          this.showLabel.string = custom;
          this._isReturn = false;
        }

        editEnd(event, custom) {
          if (this._isReturn) {
            return;
          }

          this.showLabel.string = custom;
        }

        editReturn(event, custom) {
          this.showLabel.string = custom;
          this._isReturn = true;
        }

        editInputing(input, event, custom) {
          this.showLabel.string = `${custom}: ${input}`;
        } // update (deltaTime: number) {
        //     // Your update function goes here.
        // }


      }, _temp), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "showLabel", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _class2)) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/rich-text-event.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Prefab, Vec3, _decorator, Component, instantiate, find, Label;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Prefab = module.Prefab;
      Vec3 = module.Vec3;
      _decorator = module._decorator;
      Component = module.Component;
      instantiate = module.instantiate;
      find = module.find;
      Label = module.Label;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _temp;

      cclegacy._RF.push({}, "dd8a3yRmjdPM68OsJes8h4E", "rich-text-event", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let RichTextEvent = exports('RichTextEvent', (_dec = ccclass('RichTextEvent'), _dec2 = property(Prefab), _dec3 = property(Vec3), _dec(_class = (_class2 = (_temp = class RichTextEvent extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "templateTips", _descriptor, this);

          _initializerDefineProperty(this, "position", _descriptor2, this);
        }

        onClick(event, param) {
          let node = instantiate(this.templateTips);
          node.position = this.position;
          node.parent = find('Canvas');
          let label = node.getComponent(Label);
          label.string = 'Duang Duang';
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "templateTips", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "position", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new Vec3();
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/asset-bundle.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, _defineProperty, cclegacy, Label, Node, _decorator, Component, assetManager, log, Texture2D, Layers, Sprite, SpriteFrame, AudioClip, AudioSource, director;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Label = module.Label;
      Node = module.Node;
      _decorator = module._decorator;
      Component = module.Component;
      assetManager = module.assetManager;
      log = module.log;
      Texture2D = module.Texture2D;
      Layers = module.Layers;
      Sprite = module.Sprite;
      SpriteFrame = module.SpriteFrame;
      AudioClip = module.AudioClip;
      AudioSource = module.AudioSource;
      director = module.director;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _temp;

      cclegacy._RF.push({}, "ec39dDiCpxNyrqH9XbtLdcb", "asset-bundle", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let AssetBundle = exports('AssetBundle', (_dec = ccclass('AssetBundle'), _dec2 = property(Label), _dec3 = property(Node), _dec4 = property({
        type: [Label]
      }), _dec(_class = (_class2 = (_temp = class AssetBundle extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "loadTips", _descriptor, this);

          _initializerDefineProperty(this, "showWindow", _descriptor2, this);

          _initializerDefineProperty(this, "labels", _descriptor3, this);

          _defineProperty(this, "_audioSource", null);

          _defineProperty(this, "_isLoading", false);
        } // LIFE-CYCLE CALLBACKS:


        onLoad() {
          var testBundle = assetManager.getBundle('TestBundle');

          if (testBundle) {
            this.labels[0].string = "?????????";
          }
        }

        onClickBundle() {
          var testBundle = assetManager.getBundle('TestBundle');

          if (testBundle || this._isLoading) {
            return;
          }

          this._onClear();

          this._isLoading = true;
          this.loadTips.string = "Bundle Loading....";
          assetManager.loadBundle('TestBundle', err => {
            if (err) {
              log('Error url [' + err + ']');
              return;
            }

            this._isLoading = false;
            this.loadTips.string = "Bundle loaded Successfully!";
            this.labels[0].string = "?????????";
          });
        }

        onClickTexture() {
          if (this._isLoading) return;
          var testBundle = assetManager.getBundle('TestBundle');

          if (!testBundle) {
            this.loadTips.string = "??????????????????????????? Asset Bundle";
            return;
          }

          this._onClear();

          this._isLoading = true;
          this.loadTips.string = "Texture Loading....";
          testBundle.load("gold/texture", Texture2D, (err, asset) => {
            if (err) {
              log('Error url [' + err + ']');
              return;
            }

            this._isLoading = false;
            this.loadTips.string = "";
            var node = new Node("New Node");
            node.layer = Layers.Enum.UI_2D;
            node.setPosition(0, 0);
            let component = node.addComponent(Sprite);
            const sp = new SpriteFrame();
            sp.texture = asset;
            component.spriteFrame = sp;
            this.labels[1].string = "?????????";
            this.showWindow.addChild(node);
          });
        }

        onClickAudio() {
          if (this._isLoading) return;
          var testBundle = assetManager.getBundle('TestBundle');

          if (!testBundle) {
            this.loadTips.string = "??????????????????????????? Asset Bundle";
            return;
          }

          this._onClear();

          this._isLoading = true;
          this.loadTips.string = "Audio Loading....";
          testBundle.load("ss", AudioClip, (err, asset) => {
            if (err) {
              log('Error url [' + err + ']');
              return;
            }

            this._isLoading = false;
            this.loadTips.string = "";
            var node = new Node("New Node");
            node.layer = Layers.Enum.UI_2D;
            node.setPosition(0, 0);
            let component = node.addComponent(AudioSource);
            component.clip = asset;
            component.play();
            this._audioSource = component;
            this.loadTips.string = "????????????";
            this.labels[2].string = "?????????";
            this.showWindow.addChild(node);
          });
        }

        onClickScene() {
          if (this._isLoading) return;
          var testBundle = assetManager.getBundle('TestBundle');

          if (!testBundle) {
            this.loadTips.string = "??????????????????????????? Asset Bundle";
            return;
          }

          this._onClear();

          this._isLoading = true;
          this.loadTips.string = "Scene Loading....";
          testBundle.loadScene("sub-scene", (err, asset) => {
            if (err) {
              log('Error url [' + err + ']');
              return;
            }

            this._isLoading = false;
            this.loadTips.string = "";
            director.runScene(asset);
          });
        }

        onClickDestroy() {
          if (this._isLoading) return;
          var testBundle = assetManager.getBundle('TestBundle');

          if (!testBundle) {
            this.loadTips.string = "??????????????????????????? Asset Bundle";
            return;
          }

          this._onClear();

          assetManager.removeBundle(testBundle);
          this.loadTips.string = "??????????????????";
          this.labels[0].string = "?????? Asset Bundle";
          this.labels[1].string = "?????? Texture";
          this.labels[2].string = "?????? Audio";
          this.labels[3].string = "?????? Scene";
        }

        onClickRelease() {
          if (this._isLoading) return;
          var testBundle = assetManager.getBundle('TestBundle');

          if (!testBundle) {
            this.loadTips.string = "??????????????????????????? Asset Bundle";
            return;
          }

          this._onClear();

          testBundle.releaseAll();
          this.loadTips.string = "??????????????????";
          this.labels[1].string = "?????? Texture";
          this.labels[2].string = "?????? Audio";
          this.labels[3].string = "?????? Scene";
        }

        _onClear() {
          this.showWindow.removeAllChildren();

          if (this._audioSource && this._audioSource instanceof AudioSource) {
            this._audioSource.stop();
          }
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "loadTips", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "showWindow", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "labels", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/RaycastCanvasTest.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, _defineProperty, cclegacy, Canvas, Label, _decorator, Component, geometry, systemEvent, SystemEventType, UITransform;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Canvas = module.Canvas;
      Label = module.Label;
      _decorator = module._decorator;
      Component = module.Component;
      geometry = module.geometry;
      systemEvent = module.systemEvent;
      SystemEventType = module.SystemEventType;
      UITransform = module.UITransform;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _temp;

      cclegacy._RF.push({}, "ef1feyKBBBGoLo0Surp/QQK", "RaycastCanvasTest", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let RaycastCanvasTest = exports('RaycastCanvasTest', (_dec = ccclass("RaycastCanvasTest"), _dec2 = property({
        type: Canvas
      }), _dec3 = property({
        type: Label
      }), _dec(_class = (_class2 = (_temp = class RaycastCanvasTest extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "canvas", _descriptor, this);

          _initializerDefineProperty(this, "label", _descriptor2, this);

          _defineProperty(this, "_ray", new geometry.Ray());

          _defineProperty(this, "_aabb", new geometry.AABB());
        }

        onEnable() {
          this.label.string = '??????????????????????????????';
          systemEvent.on(SystemEventType.TOUCH_START, this.onTouchStart, this);
        }

        onDisable() {
          systemEvent.off(SystemEventType.TOUCH_START, this.onTouchStart, this);
        }

        onTouchStart(touch, event) {
          this.label.string = '??????????????????????????????';
          const uiCamera = this.canvas.camera;
          const point = touch.getLocation();
          uiCamera.screenPointToRay(this._ray, point.x, point.y);
          const uiTrans = this.label.getComponent(UITransform);
          uiTrans.getComputeAABB(this._aabb);

          if (geometry.intersect.rayAABB(this._ray, this._aabb)) {
            this.label.string = '????????????';
          }
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "canvas", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "label", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/DragonBonesAttach.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, dragonBones, Prefab, Label, _decorator, Component, Color, instantiate, Sprite;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      dragonBones = module.dragonBones;
      Prefab = module.Prefab;
      Label = module.Label;
      _decorator = module._decorator;
      Component = module.Component;
      Color = module.Color;
      instantiate = module.instantiate;
      Sprite = module.Sprite;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class2, _class3, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _temp;

      cclegacy._RF.push({}, "f0494pzVKJIkrGKPQXf09Qb", "DragonBonesAttach", undefined);

      const {
        ccclass,
        property
      } = _decorator;

      let _class = exports('default', (_dec = ccclass('DragonBonesAttach'), _dec2 = property({
        type: dragonBones.ArmatureDisplay
      }), _dec3 = property({
        type: Prefab
      }), _dec4 = property({
        type: Label
      }), _dec(_class2 = (_class3 = (_temp = class _class3 extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "skeleton", _descriptor, this);

          _initializerDefineProperty(this, "targetPrefab", _descriptor2, this);

          _initializerDefineProperty(this, "modeLabel", _descriptor3, this);

          _initializerDefineProperty(this, "redBoneName", _descriptor4, this);

          _initializerDefineProperty(this, "greenBoneName", _descriptor5, this);

          _initializerDefineProperty(this, "blueBoneName", _descriptor6, this);
        }

        generateAllNodes() {
          this.destroyAllNodes();
          let red = this.createSocket(this.redBoneName, new Color(255, 0, 0));
          let green = this.createSocket(this.greenBoneName, new Color(0, 255, 0));
          let blue = this.createSocket(this.blueBoneName, new Color(0, 0, 255));
          this.skeleton.sockets = [red, green, blue];
        }

        destroyUnusual() {
          this.destroyAllNodes();
        }

        destroyAllNodes() {
          let sockets = this.skeleton.sockets;

          for (let s of sockets) {
            s.target.removeFromParent();
          }

          this.skeleton.sockets = [];
        }

        generateSomeNodes() {
          let sockets = this.skeleton.sockets;
          let greens = sockets.filter(x => {
            var _x$target;

            return ((_x$target = x.target) === null || _x$target === void 0 ? void 0 : _x$target.name) == this.greenBoneName;
          });

          if (greens.length === 0) {
            let green = this.createSocket(this.greenBoneName, new Color(0, 255, 0));
            sockets.push(green);
            this.skeleton.sockets = sockets;
          }
        }

        destroySomeNodes() {
          let sockets = this.skeleton.sockets;

          for (let l = sockets.length - 1; l >= 0; l--) {
            if (sockets[l].target.name === this.greenBoneName) {
              let s = sockets.splice(l, 1);
              s[0].target.removeFromParent();
              this.skeleton.sockets = sockets;
              break;
            }
          }
        }

        changeMode() {
          let isCached = this.skeleton.isAnimationCached();

          if (isCached) {
            this.skeleton.setAnimationCacheMode(dragonBones.ArmatureDisplay.AnimationCacheMode.REALTIME);
            this.modeLabel.string = "cache";
          } else {
            this.skeleton.setAnimationCacheMode(dragonBones.ArmatureDisplay.AnimationCacheMode.SHARED_CACHE);
            this.modeLabel.string = "realtime";
          }
        }

        createSocket(name, color) {
          let dbNode = new dragonBones.DragonBoneSocket();
          dbNode.path = this.skeleton.querySocketPathByName(name)[0];
          const child = dbNode.target = instantiate(this.targetPrefab);
          child.parent = this.node;
          child.name = name;
          const sp = child.getComponent(Sprite);
          sp.color = color;
          return dbNode;
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class3.prototype, "skeleton", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class3.prototype, "targetPrefab", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class3.prototype, "modeLabel", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class3.prototype, "redBoneName", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return "toujiaoR";
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class3.prototype, "greenBoneName", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return "shouL";
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class3.prototype, "blueBoneName", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return "bone24";
        }
      })), _class3)) || _class2));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/ByteCodeCache.ts", ['cc'], function (exports) {
  'use strict';

  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "f0c346Uy2hLS7HWIBLGbqsJ", "ByteCodeCache", undefined);

      let LastTimeResult = exports('LastTimeResult', {
        done: false,
        message: ''
      });

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/tips-ctrl.ts", ['cc'], function (exports) {
  'use strict';

  var cclegacy, Component, _decorator;

  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Component = module.Component;
      _decorator = module._decorator;
    }],
    execute: function () {
      var _dec, _class;

      cclegacy._RF.push({}, "f0d55ZA5HNAO4T4xzVj2DVW", "tips-ctrl", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let TipsCtrl = exports('TipsCtrl', (_dec = ccclass('TipsCtrl'), _dec(_class = class TipsCtrl extends Component {
        onFinish() {
          this.node.destroy();
        } // update (deltaTime: number) {
        //     // Your update function goes here.
        // }


      }) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/AudioController.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, AudioClip, AudioSource, Label, _decorator, Component;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      AudioClip = module.AudioClip;
      AudioSource = module.AudioSource;
      Label = module.Label;
      _decorator = module._decorator;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _temp;

      cclegacy._RF.push({}, "f2021d/1FdLjaJsU4R5oYSM", "AudioController", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let AudioController = exports('AudioController', (_dec = ccclass("AudioController"), _dec2 = property({
        type: [AudioClip]
      }), _dec3 = property({
        type: AudioSource
      }), _dec4 = property({
        type: Label
      }), _dec(_class = (_class2 = (_temp = class AudioController extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "clips", _descriptor, this);

          _initializerDefineProperty(this, "audioSource", _descriptor2, this);

          _initializerDefineProperty(this, "nameLabel", _descriptor3, this);
        }

        start() {// Your initialization goes here.
        } // update (deltaTime: number) {
        //     // Your update function goes here.
        // }


        onButtonClicked(event, index) {
          let clip = this.clips[index];
          this.nameLabel.string = clip.name;
          this.audioSource.playOneShot(clip);
        }

        onVolumeSliderChanged(eventTarget) {
          this.audioSource.volume = eventTarget.progress;
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "clips", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "audioSource", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "nameLabel", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/RTCapture.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _defineProperty, _applyDecoratedDescriptor, _initializerDefineProperty, cclegacy, Sprite, Camera, _decorator, Component, SpriteFrame, RenderTexture;

  return {
    setters: [function (module) {
      _defineProperty = module.defineProperty;
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Sprite = module.Sprite;
      Camera = module.Camera;
      _decorator = module._decorator;
      Component = module.Component;
      SpriteFrame = module.SpriteFrame;
      RenderTexture = module.RenderTexture;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _class3, _temp;

      cclegacy._RF.push({}, "f9feeneaxxL/JBwJb0h6fKm", "RTCapture", undefined);

      const {
        ccclass,
        property,
        menu
      } = _decorator;
      let RTCapture = exports('RTCapture', (_dec = ccclass('RTCapture'), _dec2 = menu('RenderTexture/RTCapture'), _dec3 = property(Sprite), _dec4 = property(Camera), _dec(_class = _dec2(_class = (_class2 = (_temp = _class3 = class RTCapture extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "sprite", _descriptor, this);

          _initializerDefineProperty(this, "camera", _descriptor2, this);
        }

        start() {
          const spriteFrame = this.sprite.spriteFrame;
          const sp = new SpriteFrame();
          sp.reset({
            originalSize: spriteFrame.originalSize,
            rect: spriteFrame.rect,
            offset: spriteFrame.offset,
            isRotate: spriteFrame.rotated,
            borderTop: spriteFrame.insetTop,
            borderLeft: spriteFrame.insetLeft,
            borderBottom: spriteFrame.insetBottom,
            borderRight: spriteFrame.insetRight
          });
          const renderTex = RTCapture._renderTex = new RenderTexture();
          renderTex.reset({
            width: 256,
            height: 256
          });
          this.camera.targetTexture = renderTex;
          sp.texture = renderTex;
          this.sprite.spriteFrame = sp;
          this.sprite.updateMaterial();
        }

        onDestroy() {
          if (RTCapture._renderTex) {
            RTCapture._renderTex.destroy();

            RTCapture._renderTex = null;
          }
        }

      }, _defineProperty(_class3, "_renderTex", null), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "sprite", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "camera", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/puzzle.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _defineProperty, _initializerDefineProperty, cclegacy, ccenum, Node, _decorator, Component, Vec2, systemEvent, SystemEventType, Vec3, KeyCode, view;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _defineProperty = module.defineProperty;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      ccenum = module.ccenum;
      Node = module.Node;
      _decorator = module._decorator;
      Component = module.Component;
      Vec2 = module.Vec2;
      systemEvent = module.systemEvent;
      SystemEventType = module.SystemEventType;
      Vec3 = module.Vec3;
      KeyCode = module.KeyCode;
      view = module.view;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _temp;

      cclegacy._RF.push({}, "fbbb4nzS11HVI7P0lFdPl+g", "puzzle", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      var MoveDirection;

      (function (MoveDirection) {
        MoveDirection[MoveDirection["NONE"] = 0] = "NONE";
        MoveDirection[MoveDirection["UP"] = 1] = "UP";
        MoveDirection[MoveDirection["DOWN"] = 2] = "DOWN";
        MoveDirection[MoveDirection["LEFT"] = 3] = "LEFT";
        MoveDirection[MoveDirection["RIGHT"] = 4] = "RIGHT";
      })(MoveDirection || (MoveDirection = {}));

      const minTilesCount = 2;
      const mapMoveStep = 1;
      const minMoveValue = 50;
      ccenum(MoveDirection);
      let Puzzle = exports('Puzzle', (_dec = ccclass('Puzzle'), _dec2 = property({
        type: Node
      }), _dec(_class = (_class2 = (_temp = class Puzzle extends Component {
        constructor(...args) {
          super(...args);

          _defineProperty(this, "_touchStartPos", new Vec2());

          _defineProperty(this, "_isMapLoaded", false);

          _initializerDefineProperty(this, "floorLayerName", _descriptor, this);

          _initializerDefineProperty(this, "barrierLayerName", _descriptor2, this);

          _initializerDefineProperty(this, "objectGroupName", _descriptor3, this);

          _initializerDefineProperty(this, "startObjectName", _descriptor4, this);

          _initializerDefineProperty(this, "successObjectName", _descriptor5, this);

          _initializerDefineProperty(this, "player", _descriptor6, this);

          _defineProperty(this, "_touching", false);

          _defineProperty(this, "_succeedLayer", null);

          _defineProperty(this, "_curTile", new Vec2());

          _defineProperty(this, "_startTile", new Vec2());

          _defineProperty(this, "_endTile", new Vec2());

          _defineProperty(this, "_tiledMap", null);

          _defineProperty(this, "_layerFloor", null);

          _defineProperty(this, "_layerBarrier", null);
        }

        onLoad() {
          if (!this._isMapLoaded) {
            this.player.active = false;
          }

          systemEvent.on(SystemEventType.KEY_UP, this._onKeyPressed, this);
          this.node.on(SystemEventType.TOUCH_START, (touch, event) => {
            this._touching = true;

            this._touchStartPos.set(touch.getLocation());
          });
          this.node.on(SystemEventType.TOUCH_END, (touch, event) => {
            if (!this._touching || !this._isMapLoaded || this._succeedLayer.active) return;
            this._touching = false;
            const touchPos = touch.getLocation();
            const movedX = touchPos.x - this._touchStartPos.x;
            const movedY = touchPos.y - this._touchStartPos.y;
            const movedXValue = Math.abs(movedX);
            const movedYValue = Math.abs(movedY);

            if (movedXValue < minMoveValue && movedYValue < minMoveValue) {
              // touch moved not enough
              return;
            }

            const tp = this._curTile;
            const newTile = new Vec2(tp.x, tp.y);
            let mapMoveDir = MoveDirection.NONE;

            if (movedXValue >= movedYValue) {
              // move to right or left
              if (movedX > 0) {
                newTile.x += 1;
                mapMoveDir = MoveDirection.LEFT;
              } else {
                newTile.x -= 1;
                mapMoveDir = MoveDirection.RIGHT;
              }
            } else {
              // move to up or down
              if (movedY > 0) {
                newTile.y -= 1;
                mapMoveDir = MoveDirection.DOWN;
              } else {
                newTile.y += 1;
                mapMoveDir = MoveDirection.UP;
              }
            }

            this._tryMoveToNewTile(newTile, mapMoveDir);
          });
        }

        onDestroy() {
          systemEvent.off(SystemEventType.KEY_UP, this._onKeyPressed, this);
        }

        restartGame() {
          this._succeedLayer.active = false;

          this._curTile.set(this._startTile);

          this._updatePlayerPos();

          this._initMapPos();
        }

        start() {
          // init the map position
          this._initMapPos(); // init the succeed layer


          this._succeedLayer = this.node.getParent().getChildByName('succeedLayer');
          this._succeedLayer.active = false; // init the player position

          this._tiledMap = this.node.getComponent('cc.TiledMap');

          const objectGroup = this._tiledMap.getObjectGroup(this.objectGroupName);

          if (!objectGroup) return;
          const startObj = objectGroup.getObject(this.startObjectName);
          const endObj = objectGroup.getObject(this.successObjectName);
          if (!startObj || !endObj) return;
          const startPos = new Vec2(startObj.x, startObj.y);
          const endPos = new Vec2(endObj.x, endObj.y);
          this._layerFloor = this._tiledMap.getLayer(this.floorLayerName);
          this._layerBarrier = this._tiledMap.getLayer(this.barrierLayerName);
          if (!this._layerFloor || !this._layerBarrier) return;
          this._curTile = this._startTile = this._getTilePos(startPos);
          this._endTile = this._getTilePos(endPos);

          if (this.player) {
            this._updatePlayerPos();

            this.player.active = true;
          }

          this._isMapLoaded = true;
        }

        _initMapPos() {
          this.node.setPosition(0, 0);
        }

        _updatePlayerPos() {
          const pos = this._layerFloor.getPositionAt(this._curTile);

          this.player.setPosition(new Vec3(pos.x, pos.y, 0));
        }

        _getTilePos(posInPixel) {
          const mapSize = this.node._uiProps.uiTransformComp.contentSize;

          const tileSize = this._tiledMap.getTileSize();

          const x = Math.floor(posInPixel.x / tileSize.width);
          const y = Math.floor((mapSize.height - posInPixel.y) / tileSize.height);
          return new Vec2(x, y);
        }

        _onKeyPressed(event) {
          if (!this._isMapLoaded || this._succeedLayer.active) return;
          const newTile = new Vec2(this._curTile.x, this._curTile.y);
          let mapMoveDir = MoveDirection.NONE;

          switch (event.keyCode) {
            case KeyCode.ARROW_UP:
              newTile.y -= 1;
              mapMoveDir = MoveDirection.DOWN;
              break;

            case KeyCode.ARROW_DOWN:
              newTile.y += 1;
              mapMoveDir = MoveDirection.UP;
              break;

            case KeyCode.ARROW_LEFT:
              newTile.x -= 1;
              mapMoveDir = MoveDirection.RIGHT;
              break;

            case KeyCode.ARROW_RIGHT:
              newTile.x += 1;
              mapMoveDir = MoveDirection.LEFT;
              break;

            default:
              return;
          }

          this._tryMoveToNewTile(newTile, mapMoveDir);
        }

        _tryMoveToNewTile(newTile, mapMoveDir) {
          const mapSize = this._tiledMap.getMapSize();

          if (newTile.x < 0 || newTile.x >= mapSize.width) return;
          if (newTile.y < 0 || newTile.y >= mapSize.height) return;

          if (this._layerBarrier.getTileGIDAt(newTile.x, newTile.y)) {
            console.log('This way is blocked!');
            return false;
          } // update the player position


          this._curTile = newTile;

          this._updatePlayerPos(); // move the map if necessary


          this._tryMoveMap(mapMoveDir); // check the player is success or not


          if (this._curTile.equals(this._endTile)) {
            console.log('succeed');
            this._succeedLayer.active = true;
          }
        }

        _tryMoveMap(moveDir) {
          // get necessary data
          const mapContentSize = this.node._uiProps.uiTransformComp.contentSize;
          const mapPos = this.node.getPosition();
          const playerPos = this.player.getPosition();
          const viewSize = view.getVisibleSize();

          const tileSize = this._tiledMap.getTileSize();

          const minDisX = minTilesCount * tileSize.width;
          const minDisY = minTilesCount * tileSize.height;
          const disX = playerPos.x + mapPos.x;
          const disY = playerPos.y + mapPos.y;
          let newPos;

          switch (moveDir) {
            case MoveDirection.UP:
              if (disY < minDisY) {
                newPos = new Vec2(mapPos.x, mapPos.y + tileSize.height * mapMoveStep);
              }

              break;

            case MoveDirection.DOWN:
              if (viewSize.height - disY - tileSize.height < minDisY) {
                newPos = new Vec2(mapPos.x, mapPos.y - tileSize.height * mapMoveStep);
              }

              break;

            case MoveDirection.LEFT:
              if (viewSize.width - disX - tileSize.width < minDisX) {
                newPos = new Vec2(mapPos.x - tileSize.width * mapMoveStep, mapPos.y);
              }

              break;

            case MoveDirection.RIGHT:
              if (disX < minDisX) {
                newPos = new Vec2(mapPos.x + tileSize.width * mapMoveStep, mapPos.y);
              }

              break;

            default:
              return;
          }

          const vsize = view.getVisibleSize();
          const voffset = view.getVisibleOrigin();

          if (newPos) {
            // calculate the position range of map
            const minX = viewSize.width - mapContentSize.width - voffset.x;
            const maxX = voffset.x;
            const minY = viewSize.height - mapContentSize.height - voffset.y;
            const maxY = voffset.y;
            if (newPos.x < minX) newPos.x = minX;
            if (newPos.x > maxX) newPos.x = maxX;
            if (newPos.y < minY) newPos.y = minY;
            if (newPos.y > maxY) newPos.y = maxY;

            if (newPos.x != mapPos.x || newPos.y != mapPos.y) {
              console.log('Move the map to new position: ', newPos);
              this.node.setPosition(newPos.x, newPos.y);
            }
          }
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "floorLayerName", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 'floor';
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "barrierLayerName", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 'barrier';
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "objectGroupName", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 'players';
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "startObjectName", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 'SpawnPoint';
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "successObjectName", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 'SuccessPoint';
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "player", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/LoadResDir_example.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, _defineProperty, cclegacy, Node, Prefab, ScrollView, _decorator, Component, UITransform, instantiate, Label, assetManager, loader, JsonAsset, js, SpriteFrame;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
      _defineProperty = module.defineProperty;
    }, function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      Prefab = module.Prefab;
      ScrollView = module.ScrollView;
      _decorator = module._decorator;
      Component = module.Component;
      UITransform = module.UITransform;
      instantiate = module.instantiate;
      Label = module.Label;
      assetManager = module.assetManager;
      loader = module.loader;
      JsonAsset = module.JsonAsset;
      js = module.js;
      SpriteFrame = module.SpriteFrame;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _temp;

      cclegacy._RF.push({}, "fbf7dF/vuxDcKIaWPb56M3y", "LoadResDir_example", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      const builtInEffectList = ['711ebe11-f673-4cd9-9a83-63c60ba54c5b', '971bdb23-3ff6-43eb-b422-1c30165a3663', '17debcc3-0a6b-4b8a-b00b-dc58b885581e', 'd1346436-ac96-4271-b863-1f4fdead95b0', '60f7195c-ec2a-45eb-ba94-8955f60e81d0', '1baf0fc9-befa-459c-8bdd-af1a450a0319', '1d08ef62-a503-4ce2-8b9a-46c90873f7d3', 'a7612b54-35e3-4238-a1a9-4a7b54635839', 'a3cd009f-0ab0-420d-9278-b9fdab939bbc'];
      let LoadResDirExample = exports('LoadResDirExample', (_dec = ccclass("LoadResDirExample"), _dec2 = property({
        type: Node
      }), _dec3 = property({
        type: Prefab
      }), _dec4 = property({
        type: ScrollView
      }), _dec(_class = (_class2 = (_temp = class LoadResDirExample extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "btnClearAll", _descriptor, this);

          _initializerDefineProperty(this, "label", _descriptor2, this);

          _initializerDefineProperty(this, "scrollView", _descriptor3, this);

          _defineProperty(this, "_assets", []);

          _defineProperty(this, "_hasLoading", false);
        }

        _init() {
          const uiTrans = this.scrollView.content.getComponent(UITransform);
          uiTrans.height = 0;
          this.btnClearAll.active = false;
        }

        onLoad() {
          this._init();
        }

        _createLabel(text) {
          const node = instantiate(this.label);
          const label = node.getComponent(Label);
          label.string = text;
          this.scrollView.content.addChild(node);
        }

        _clear() {
          this.scrollView.content.removeAllChildren();

          for (let i = 0; i < this._assets.length; ++i) {
            const asset = this._assets[i]; // ??????????????????????????????

            assetManager.releaseAsset(asset);
          }

          this._assets = [];
        }

        _removeBuiltInEffect(deps) {
          let cache = [];

          for (let i = 0; i < deps.length; i++) {
            for (let j = 0; j < builtInEffectList.length; j++) {
              if (deps[i].includes(builtInEffectList[j])) {
                cache.push(i);
              }
            }
          }

          for (let k = 0; k < cache.length; k++) {
            delete deps[cache[k]];
          }

          cache = [];
        }

        onClearAll() {
          const uiTrans = this.scrollView.content.getComponent(UITransform);
          uiTrans.height = 0;
          this.btnClearAll.active = false;

          this._clear();
        }

        onLoadAll() {
          if (this._hasLoading) {
            return;
          }

          this._hasLoading = true;

          this._clear();

          this._createLabel("Load All Assets");

          this.scrollView.scrollToTop();
          this.btnClearAll.active = false; // ????????????????????????????????????

          loader.loadResDir("test_assets", (err, assets) => {
            if (!this.isValid && err) {
              return;
            }

            this._assets = assets;

            for (var i = 0; i < assets.length; ++i) {
              var asset = assets[i];
              var info = asset.toString();

              if (!info) {
                if (asset instanceof JsonAsset) {
                  info = JSON.stringify(asset.json, null, 4);
                } else {
                  info = info || asset.name || js.getClassName(asset);
                }
              }

              this._createLabel(info);
            }

            this._hasLoading = false;
            this.btnClearAll.active = true;
          });
        }

        onLoadSpriteFrameAll() {
          if (this._hasLoading) {
            return;
          }

          this._hasLoading = true;

          this._clear();

          this._createLabel("Load All Sprite Frame");

          this.scrollView.scrollToTop();
          this.btnClearAll.active = false; // ????????????????????????????????????

          loader.loadResDir("test_assets", SpriteFrame, (err, assets) => {
            if (!this.isValid) {
              return;
            }

            this._assets = assets;

            for (var i = 0; i < assets.length; ++i) {
              var asset = assets[i];

              this._createLabel(asset.name);
            }

            this._hasLoading = false;
            this.btnClearAll.active = true;
          });
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "btnClearAll", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "label", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "scrollView", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/main", ['./scenelist.ts', './Client.ts', './Utils.ts', './TestFramework.ts', './backbutton.ts', './graphics-continuous-filling.ts', './use-render-texture-asset.ts', './pauseButton.ts', './static-batcher.ts', './slider-ctrl.ts', './changeUniform.ts', './IntersectRayTest.ts', './coordinate-ui-local-local.ts', './test-atlas-config.ts', './asset-bundle-zip.ts', './ModelTest.ts', './DragonBonesCollider.ts', './page-view-ctrl.ts', './particle-normal.ts', './graphics-line-join.ts', './graphics-draw-before-init.ts', './render-texture-sample.ts', './DragonBonesMode.ts', './SpineAttach.ts', './pause.ts', './motion-streak-ctrl.ts', './DragonBonesCtrl.ts', './PreloadAssets.ts', './use-render-texture-to-model.ts', './rotate.ts', './TweenClone.ts', './RTCapture.ts', './RTPixel.ts', './RaycastModelTest.ts', './tiled.ts', './NetworkCtrl.ts', './ui-log.ts', './AsyncFunctionsTest.ts', './batch-tester.ts', './stringChange.ts', './loadSubPack.ts', './TransformController.ts', './keyboard-event.ts', './migrate-canvas.ts', './mouse-event.ts', './RaycastColliderTest.ts', './mask-use-image-stencil.ts', './label-model-component.ts', './shield-node.ts', './render-ui-to-model.ts', './SpineSkin.ts', './sport_light_2.ts', './static-ui.ts', './TweenThen.ts', './acceleration-event.ts', './first-person-camera.ts', './fill-sprite.ts', './visibility-changed.ts', './LoadRes_example.ts', './list-view-ctrl.ts', './MorphController.ts', './listitem.ts', './TweenStop.ts', './SpineMeshEffect.ts', './scroll-view-events.ts', './trimmed.ts', './node-move.ts', './TweenRepeat2.ts', './show-hide-event.ts', './SpineBoyCtrl.ts', './release-depend-asset.ts', './extension-detection.ts', './TweenShowHide.ts', './TweenParallel.ts', './rotate-around-axis.ts', './mask-inverted-event.ts', './TweenRepeat.ts', './tween-test.ts', './click-change-size.ts', './MultiTouchCtrl.ts', './coordinate-ui-3d.ts', './dynamic-tiled-map.ts', './MaterialTextureAnimation.ts', './sport_light_1.ts', './click-event.ts', './webview-ctrl.ts', './restart.ts', './UniformKTest.ts', './ByteCodeCache.ts', './ByteCodeLoader.ts', './TweenCustomProgress.ts', './SwitchAnimation.ts', './screenTest.ts', './ReplaceSlotDisplay.ts', './render-camera-to-model.ts', './particle-sprite-change.ts', './audioOperationQueue.ts', './video-player-ctrl.ts', './node-event.ts', './use-render-texture-to-sprite.ts', './AudioControl.ts', './gold.ts', './layout-change-order.ts', './auto-change-opacity.ts', './event-first.ts', './editbox-ctrl.ts', './material-test.ts', './touch-event.ts', './sphere_light.ts', './click-and-listener.ts', './Test.ts', './particle-custom-change.ts', './BuildTimeConstantsTest.ts', './TweenRepeatForever.ts', './wire-frame.ts', './AssetLoading.ts', './event-info.ts', './change-graphics.ts', './toggle-ctrl.ts', './AnimationEventTesting.ts', './capture_to_web.ts', './ShowTips.ts', './LoadSpine.ts', './toggle-event-ctrl.ts', './graphics-mask.ts', './CameraController.ts', './LabeledSlider.ts', './widget-preformance.ts', './widget-destroy.ts', './loadSubPackages.ts', './TweenActionCallBack.ts', './CoreJsTest.ts', './ButtonEventCapture.ts', './TweenRemoveSelf.ts', './instanced-color.ts', './deprecated-testing.ts', './PlaybackRange.ts', './testJsList.ts', './render-ui-to-spriteframe.ts', './TweenDelay.ts', './progress.ts', './LoadDragonBones.ts', './SpineCollider.ts', './editbox-event.ts', './rich-text-event.ts', './asset-bundle.ts', './RaycastCanvasTest.ts', './DragonBonesAttach.ts', './tips-ctrl.ts', './AudioController.ts', './puzzle.ts', './LoadResDir_example.ts'], function () {
  'use strict';

  return {
    setters: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    execute: function () {}
  };
});

(function(r) {
  r('virtual:///prerequisite-imports/main', 'chunks:///_virtual/main'); 
})(function(mid, cid) {
    System.register(mid, [cid], function (_export, _context) {
    return {
        setters: [function(_m) {
            var _exportObj = {};

            for (var _key in _m) {
              if (_key !== "default" && _key !== "__esModule") _exportObj[_key] = _m[_key];
            }
      
            _export(_exportObj);
        }],
        execute: function () { }
    };
    });
});