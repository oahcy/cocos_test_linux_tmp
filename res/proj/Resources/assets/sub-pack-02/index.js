System.register("chunks:///_virtual/subScript02.ts", ['./_rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _initializerDefineProperty, _defineProperty, cclegacy, Label, _decorator, Component, director;

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
      director = module.director;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor, _temp;

      cclegacy._RF.push({}, "67b3aCPJTtC8rtEG2nssjlx", "subScript02", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let subScript02 = exports('subScript02', (_dec = ccclass("subScript02"), _dec2 = property({
        type: Label
      }), _dec(_class = (_class2 = (_temp = class subScript02 extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "tips", _descriptor, this);

          _defineProperty(this, "backRoot", null);
        }

        start() {
          // Your initialization goes here.
          this.backRoot = this.node.getParent().getChildByName('backRoot');

          if (this.backRoot) {
            this.backRoot.active = false;
          }

          console.log('subScript02 load finish');
          this.tips.string = "subScript02 load finish!";
        } // update (deltaTime: number) {
        //     // Your update function goes here.
        // }


        backToList() {
          if (this.backRoot) {
            this.backRoot.active = true;
          }

          director.loadScene('sub-packages');
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

System.register("chunks:///_virtual/sub-pack-02", ['./subScript02.ts'], function () {
  'use strict';

  return {
    setters: [null],
    execute: function () {}
  };
});

(function(r) {
  r('virtual:///prerequisite-imports/sub-pack-02', 'chunks:///_virtual/sub-pack-02'); 
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