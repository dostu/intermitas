'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var App = (function () {
  function App() {
    _classCallCheck(this, App);

    this.initialize();
    this.resize();
    this.draw();
  }

  _createClass(App, [{
    key: 'initialize',
    value: function initialize() {
      this.initializeApp();
      this.initializeWidgets();
      this.initializeContainer();
    }
  }, {
    key: 'initializeApp',
    value: function initializeApp() {
      var _this = this;

      createjs.Ticker.setFPS(30);
      createjs.MotionGuidePlugin.install();
      createjs.Ticker.addEventListener('tick', function () {
        return _this.update();
      });
      $(window).on('resize', function () {
        return _this.resize();
      });
    }
  }, {
    key: 'initializeContainer',
    value: function initializeContainer() {
      var _this2 = this;

      this.container = new createjs.Stage('canvas');
      this.container.addEventListener('stagemouseup', function (event) {
        return _this2.handleClick(event);
      }, false);

      this.background = new Background();
      this.container.addChild(this.background.container);
      this.container.setChildIndex(this.background, 0);

      this.graph = new Graph();
      this.container.addChild(this.graph.container);
    }
  }, {
    key: 'initializeWidgets',
    value: function initializeWidgets() {
      var _this3 = this;

      document.addEventListener('openPage', function (event) {
        return _this3.openPage();
      });
      this.content = new Content();

      document.addEventListener('change-date', function (event) {
        return _this3.changeDate(event.detail.date);
      });
      this.datePicker = new DatePicker();
    }
  }, {
    key: 'resize',
    value: function resize() {
      this.container.canvas.width = window.innerWidth;
      this.container.canvas.height = window.innerHeight;

      this.background.resize(this.width(), this.height());

      this.graph.resize(this.width(), this.height());
    }
  }, {
    key: 'update',
    value: function update() {
      this.container.update();
      this.graph.update();
    }
  }, {
    key: 'width',
    value: function width() {
      return this.container.canvas.width;
    }
  }, {
    key: 'height',
    value: function height() {
      return this.container.canvas.height;
    }
  }, {
    key: 'draw',
    value: function draw() {
      this.background.draw(this.width(), this.height());
      this.graph.draw();
    }
  }, {
    key: 'openPage',
    value: function openPage() {
      this.openedPage = true;

      var node = event.detail.node;
      var coords = node.globalCoords();

      createjs.Tween.get(this.container).to({
        scaleX: 2,
        scaleY: 2,
        x: -coords.x * 1.75,
        y: -coords.y }, 500, createjs.Ease.getPowInOut(2));
    }
  }, {
    key: 'closePage',
    value: function closePage() {
      this.openedPage = false;
      this.content.close();

      createjs.Tween.get(this.container).to({
        scaleX: 1,
        scaleY: 1,
        x: 0,
        y: 0 }, 500, createjs.Ease.getPowInOut(2));
    }
  }, {
    key: 'handleClick',
    value: function handleClick(event) {
      var x = event.stageX;
      var y = event.stageY;

      if (this.openedPage) {
        this.closePage();
      } else {
        this.openNode = this.graph.handleClick(x, y);
      }
    }
  }, {
    key: 'changeDate',
    value: function changeDate(date) {
      App.activity = App.dates[date].activity;
      App.date = App.dates[date];
      this.changeTabs();
      this.draw();
    }
  }, {
    key: 'changeTabs',
    value: function changeTabs() {
      $('.tabs .tab').remove();
      App.date.tabs.forEach(function (tab) {
        return new Tab(tab);
      });
    }
  }]);

  return App;
})();

App.colors = {
  yellow: '#ffdd15',
  white: '#eee',
  light_grey: '#aaa',
  dark_grey: '#666',
  black: '#000',
  backgroundNodes: '#111',
  background: {
    outer: '#161616',
    inner: '#333',
    nodes: '#111'
  }
};