'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Path = (function () {
  function Path(path, id) {
    _classCallCheck(this, Path);

    this.id = id + 1;

    this.initializeContainer();

    this.initializeNodes(path.nodes);
    this.initializeLinks(path.links);
    this.draw();
  }

  _createClass(Path, [{
    key: 'initializeContainer',
    value: function initializeContainer() {
      this.container = new createjs.Container();
      this.linksContainer = new createjs.Container();
      this.container.addChild(this.linksContainer);
    }
  }, {
    key: 'initializeNodes',
    value: function initializeNodes(nodePositions) {
      var nodes = [];

      for (var i = 0; i < nodePositions[0].length; i++) {
        var positions = [];

        for (var j = 0; j < nodePositions.length; j++) {
          positions.push(nodePositions[j][i]);
        }

        var node = undefined;

        if (this.id == 4 && i == 0) {
          node = new MainNode(positions, this, i);
        } else {
          node = new Node(positions, this, i);
        }

        nodes.push(node);
      }

      this.nodes = nodes;
    }
  }, {
    key: 'color',
    value: function color() {
      if (this.opened) return App.colors.yellow;

      switch (this.id) {
        case 2:
          return App.colors.light_grey;
        case 3:
          return App.colors.dark_grey;
        case 4:
          return App.colors.yellow;
        default:
          return App.colors.white;
      }
    }
  }, {
    key: 'initializeLinks',
    value: function initializeLinks(linkedNodes) {
      var _this = this;

      linkedNodes.forEach(function (link) {
        var from = _this.nodes[link[0]];
        var to = _this.nodes[link[1]];
        from.links.push(to);
      });
    }
  }, {
    key: 'update',
    value: function update() {
      this.drawLinks();
      this.nodes.forEach(function (node) {
        return node.update();
      });
    }
  }, {
    key: 'draw',
    value: function draw() {
      this.drawLinks();
      this.nodes.forEach(function (node) {
        return node.draw();
      });
    }
  }, {
    key: 'drawLinks',
    value: function drawLinks() {
      this.linksContainer.removeAllChildren();

      var stroke = 0.8;
      if ($('.main-page.open-page').length) stroke = 0.3;

      var line = new createjs.Shape();
      line.graphics.setStrokeStyle(stroke).beginStroke(this.color());
      this.linksContainer.addChild(line);

      this.nodes.forEach(function (node) {
        node.links.forEach(function (link) {
          line.graphics.moveTo(node.x(), node.y()).lineTo(link.x(), link.y());
        });
      });
    }
  }, {
    key: 'open',
    value: function open() {
      this.opened = true;
      this.draw();
    }
  }, {
    key: 'close',
    value: function close() {
      if (!this.opened) return;

      this.opened = false;
      this.nodes.forEach(function (node) {
        node.close();
      });
      this.draw();
    }
  }]);

  return Path;
})();