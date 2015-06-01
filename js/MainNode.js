'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var MainNode = (function (_Node) {
  function MainNode(positions, path, id) {
    _classCallCheck(this, MainNode);

    _get(Object.getPrototypeOf(MainNode.prototype), 'constructor', this).call(this, positions, path, id);

    this.id = 'about';
    this.size = 6;
  }

  _inherits(MainNode, _Node);

  _createClass(MainNode, [{
    key: 'color',
    value: function color() {
      return App.colors.yellow;
    }
  }, {
    key: 'draw',
    value: function draw() {
      _get(Object.getPrototypeOf(MainNode.prototype), 'draw', this).call(this);
      this.drawActiveCircle(2);
      var text = new createjs.Text('apie', '10px Open Sans', App.colors.black);
      text.set({
        textAlign: 'center'
      });
      text.y = -8;
      this.container.addChild(text);
    }
  }, {
    key: 'activeColor',
    value: function activeColor() {
      return this.color();
    }
  }, {
    key: 'activity',
    value: function activity() {
      return true;
    }
  }, {
    key: 'title',
    value: function title() {
      return 'apie';
    }
  }, {
    key: 'count',
    value: function count() {
      return '';
    }
  }, {
    key: 'open',
    value: function open() {
      this.openPage();
    }
  }]);

  return MainNode;
})(Node);