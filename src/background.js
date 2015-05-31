class Background {
  constructor() {
    this.container = new createjs.Container();
  }

  draw(width, height) {
    this.container.removeAllChildren();
    this.drawBackground(width, height);
    this.drawPoints();
    this.drawLogo();
  }

  drawBackground(width, height) {
    let background = new createjs.Shape();
    let x = width / 2;
    let y = height / 2;
    let radius = 600;

    background.graphics.beginRadialGradientFill(
      [App.colors.background.outer, App.colors.background.inner],
      [0, 1], x, y, 0, x, y, radius
    );
    background.graphics.drawRect(0, 0, width, height);

    this.container.addChild(background);
  }

  drawPoints() {
    let nodePositions = App.backgroundPoints;
    let nodes = [];

    for (var i = 0; i < nodePositions[0].length; i++) {
      var positions = [];

      for (var j = 0; j < nodePositions.length; j++) {
        positions.push(nodePositions[j][i]);
      } 

      var node = new BackgroundNode(positions, i);
      this.container.addChild(node.container);

      nodes.push(node);
    }

    this.nodes = nodes;
  }

  drawLogo() {
    let logo = new createjs.Container();
    logo.x = 100;
    logo.y = 100;

    setTimeout(() => logo.addChild(this.drawCircle(0, 0, 15)), 1);
    setTimeout(() => logo.addChild(this.drawCircle(0, 0, 15)), 1000);

    this.container.addChild(logo);
    this.container.setChildIndex(logo, 1);
  }

  drawCircle(x, y, size) {
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
}
