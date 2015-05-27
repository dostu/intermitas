var App = function() {
  this.stage = null;
  this.container = null;
  this.graph = null;
  this.initialize();
  this.content = new Content();
}

App.prototype.initialize = function() {
  createjs.MotionGuidePlugin.install();

  this.stage = new createjs.Stage('canvas');
  this.graph = new Graph();

  var that = this;
  this.stage.addEventListener('stagemouseup', function(event) {
    that.handleClick(event); }, false); 
  createjs.Ticker.setFPS(40);

  var that = this;
  createjs.Ticker.addEventListener('tick', function() {
    that.update();
  });

  this.resize();

  this.background = new createjs.Shape();
  x = this.stage.canvas.width / 2;
  y = this.stage.canvas.height / 2;
  this.background.graphics.beginRadialGradientFill(
    ["#161616","#333"], [0, 1], x, y, 0, x, y, 600
  ).drawRect(0, 0, this.stage.canvas.width, this.stage.canvas.height);
  this.stage.addChild(this.background);

  this.stage.addChild(this.graph.draw());

  document.addEventListener('openPage', function(event) {
    that.openPage();
  });

  this.draw();
}

App.prototype.resize = function() {
  this.stage.canvas.width = window.innerWidth;
  this.stage.canvas.height = window.innerHeight;

  this.graph.container.x = window.innerWidth / 2;
  this.graph.container.y = window.innerHeight / 2;
}

App.prototype.update = function() {
  this.graph.update();
  this.stage.update();
}

App.prototype.draw = function() {
  var logo = new createjs.Container();
  var text = new createjs.Bitmap('images/logo.png');
  text.scaleX = 0.5;
  text.scaleY = 0.5;
  text.regX = 46 * 2;
  text.regY = 30 * 2;

  logo.addChild(text);
  logo.x = 100;
  logo.y = 100;

  var that = this;
  setTimeout(function() {
    logo.addChild(that.drawCircle(0, 0, 15));
  }, 1);

  setTimeout(function() {
    logo.addChild(that.drawCircle(0, 0, 15));
  }, 1000);

  this.stage.addChild(logo);
}

App.prototype.drawCircle = function(x, y, size) {
  var circle = new createjs.Shape();
  circle.graphics.beginRadialGradientFill(
    [createjs.Graphics.getRGB(0x333, 0), App.colors.yellow], [0, 1], 100, 100, size / 2, 100, 100, size)
    .drawCircle(100, 100, size);
  circle.regX = 100;
  circle.regY = 100;
  circle.alpha = 0.7;
  createjs.Tween.get(circle, {loop: true}) .to({ scaleX: 5, scaleY: 5, alpha: 0 }, 2000)
  return circle;
}

App.colors = {
  yellow: '#ffdd15',
  white: '#eee',
  light_grey: '#aaa',
  dark_grey: '#666'
}

App.prototype.openPage = function() {
  this.openedPage = true;

  var node = event.detail.node;
  var coords = node.globalCoords();

  createjs.Tween.get(this.stage).to({ 
    scaleX: 3,
    scaleY: 3,
    x: - coords.x * 2.5,
    y: - coords.y * 2,
  }, 500, createjs.Ease.getPowInOut(2))
}

App.prototype.closePage = function() {
  this.openedPage = false;
  this.content.close();

  createjs.Tween.get(this.stage).to({ 
    scaleX: 1,
    scaleY: 1,
    x: 0,
    y: 0,
  }, 500, createjs.Ease.getPowInOut(2))
}

App.prototype.handleClick = function(event) {
  var x = event.stageX;
  var y = event.stageY;

  if (this.openedPage) {
    this.closePage();
  } else {
    this.openNode = this.graph.handleClick(x, y);
    
    if (this.openNode) {
      createjs.Ticker.setFPS(40);
    } else {
      createjs.Ticker.setFPS(40);
    }
  }
}

App.prototype.changeDate = function() {
  this.info = App.dates[0].activity;
}
