"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Graph = (function () {
  function Graph(container) {
    _classCallCheck(this, Graph);

    this.initializeContainer(container);
    this.initializePaths();
  }

  _createClass(Graph, [{
    key: "initializeContainer",
    value: function initializeContainer(container) {
      this.container = new createjs.Container();
      this.container.regX = 620;
      this.container.regY = 400;
      container.addChild(this.container);
    }
  }, {
    key: "initializePaths",
    value: function initializePaths() {
      this.paths = App.paths.map(function (path, index) {
        return new Path(path, index);
      });
    }
  }, {
    key: "update",
    value: function update() {
      this.paths.forEach(function (path) {
        return path.update();
      });
    }
  }, {
    key: "draw",
    value: function draw() {
      var _this = this;

      this.paths.forEach(function (path) {
        return _this.container.addChild(path.container);
      });
    }
  }, {
    key: "handleClick",
    value: function handleClick(x, y) {
      this.paths.forEach(function (path) {
        return path.close();
      });

      var node = this.findClosestNode(x, y);
      if (node) node.open();

      return node;
    }
  }, {
    key: "findClosestNode",
    value: function findClosestNode(x, y) {
      var _this2 = this;

      var minDiff = 20;
      var targetNode = null;

      this.paths.forEach(function (path) {
        path.nodes.forEach(function (node) {
          var coords = _this2.container.localToGlobal(node.x(), node.y());
          var diffX = Math.abs(coords.x - x);
          var diffY = Math.abs(coords.y - y);
          var diff = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));

          if (diff < minDiff) {
            targetNode = node;
            minDiff = diff;
          }
        });
      });

      return targetNode;
    }
  }]);

  return Graph;
})();