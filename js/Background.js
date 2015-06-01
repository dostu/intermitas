"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Background = (function () {
  function Background() {
    _classCallCheck(this, Background);

    this.container = new createjs.Container();
  }

  _createClass(Background, [{
    key: "draw",
    value: function draw(width, height) {
      this.container.removeAllChildren();
      this.drawBackground(width, height);
      this.drawPoints(width, height);
      this.drawLogo();
    }
  }, {
    key: "resize",
    value: function resize(width, height) {
      this.draw(width, height);
    }
  }, {
    key: "drawBackground",
    value: function drawBackground(width, height) {
      var background = new createjs.Shape();
      var x = width / 2;
      var y = height / 2;
      var radius = 600;

      background.graphics.beginRadialGradientFill([App.colors.background.outer, App.colors.background.inner], [0, 1], x, y, 0, x, y, radius);
      background.graphics.drawRect(0, 0, width, height);
      background.cache(0, 0, width, height);

      this.container.addChild(background);
    }
  }, {
    key: "drawPoints",
    value: function drawPoints(width, height) {
      this.pointsContainer = new createjs.Container();
      this.container.addChild(this.pointsContainer);
      this.pointsContainer.x = width / 2;
      this.pointsContainer.y = height / 2;
      this.pointsContainer.regX = 640;
      this.pointsContainer.regY = 400;

      var nodePositions = App.backgroundPoints;
      var nodes = [];

      for (var i = 0; i < nodePositions[0].length; i++) {
        var positions = [];

        for (var j = 0; j < nodePositions.length; j++) {
          positions.push(nodePositions[j][i]);
        }

        var node = new BackgroundNode(positions, i);
        this.pointsContainer.addChild(node.container);

        nodes.push(node);
      }

      this.nodes = nodes;
    }
  }, {
    key: "drawLogo",
    value: function drawLogo() {
      var _this = this;

      var logo = new createjs.Container();
      logo.x = 100;
      logo.y = 100;

      setTimeout(function () {
        return logo.addChild(_this.drawCircle(0, 0, 15));
      }, 1);
      setTimeout(function () {
        return logo.addChild(_this.drawCircle(0, 0, 15));
      }, 1000);

      this.container.addChild(logo);
      this.container.setChildIndex(logo, 1);
    }
  }, {
    key: "drawCircle",
    value: function drawCircle(x, y, size) {
      var circle = new createjs.Shape();
      circle.graphics.beginRadialGradientFill([createjs.Graphics.getRGB(819, 0), App.colors.yellow], [0, 1], 100, 100, size / 2, 100, 100, size).drawCircle(100, 100, size);
      circle.regX = 100;
      circle.regY = 100;
      circle.alpha = 0.7;
      createjs.Tween.get(circle, { loop: true }).to({ scaleX: 5, scaleY: 5, alpha: 0 }, 2000);
      return circle;
    }
  }]);

  return Background;
})();