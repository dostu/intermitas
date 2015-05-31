class App {
  constructor() {
    this.initializeWidgets();
    this.initializeContainer();

    this.resize();
    this.draw();
  }

  initializeContainer() {
    createjs.Ticker.setFPS(60);
    createjs.MotionGuidePlugin.install();
    createjs.Ticker.addEventListener('tick', () => this.update());

    this.container = new createjs.Stage('canvas');
    this.container.addEventListener('stagemouseup', (event) => this.handleClick(event), false); 

    this.graph = new Graph(this.container);
  }

  initializeWidgets() {
    document.addEventListener('openPage', (event) => this.openPage());
    this.content = new Content();

    document.addEventListener('change-date', (event) => this.changeDate(event.detail.date));
    this.datePicker = new DatePicker();
  }

  resize() {
    this.container.canvas.width = window.innerWidth;
    this.container.canvas.height = window.innerHeight;

    this.graph.container.x = window.innerWidth / 2;
    this.graph.container.y = window.innerHeight / 2;
  }

  update() {
    this.graph.update();
    this.container.update();
  }

  width() {
    return this.container.canvas.width;
  }

  height() {
    return this.container.canvas.height;
  }

  draw() {
    this.drawBackground();
    this.drawLogo();
    this.graph.draw();
  }

  drawBackground() {
    this.backgroundContainer = new createjs.Container();
    const background = new createjs.Shape();
    const x = this.width() / 2;
    const y = this.height() / 2;
    background.graphics.beginRadialGradientFill(
      ["#161616","#333"], [0, 1], x, y, 0, x, y, 600
    ).drawRect(0, 0, this.width(), this.height());
    this.backgroundContainer.addChild(background);
    this.container.addChild(this.backgroundContainer);
    this.container.setChildIndex(this.backgroundContainer, 0);
    this.drawBackgroundPoints();
  }

  drawBackgroundPoints() {
    let nodePositions = App.backgroundPoints;
    let nodes = [];

    for (var i = 0; i < nodePositions[0].length; i++) {
      var positions = [];

      for (var j = 0; j < nodePositions.length; j++) {
        positions.push(nodePositions[j][i]);
      } 

      var node = new BackgroundNode(positions, i);
      this.backgroundContainer.addChild(node.container);

      nodes.push(node);
    }
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

  openPage() {
    this.openedPage = true;

    var node = event.detail.node;
    var coords = node.globalCoords();

    createjs.Tween.get(this.container).to({ 
      scaleX: 2,
      scaleY: 2,
      x: - coords.x * 1.75,
      y: - coords.y,
    }, 500, createjs.Ease.getPowInOut(2))
  }

  closePage() {
    this.openedPage = false;
    this.content.close();

    createjs.Tween.get(this.container).to({ 
      scaleX: 1,
      scaleY: 1,
      x: 0,
      y: 0,
    }, 500, createjs.Ease.getPowInOut(2))
  }

  handleClick(event) {
    let x = event.stageX;
    let y = event.stageY;

    if (this.openedPage) {
      this.closePage();
    } else {
      this.openNode = this.graph.handleClick(x, y);
    }
  }

  changeDate(date) {
    App.activity = App.dates[date].activity;
    App.date = App.dates[date];
    this.initializeTabs();
  }

  initializeTabs() {
    App.date.tabs.forEach((tab) => new Tab(tab));
  }
}

App.colors = {
  yellow: '#ffdd15',
  white: '#eee',
  light_grey: '#aaa',
  dark_grey: '#666',
  black: '#000',
  backgroundNodes: '#111'
}
