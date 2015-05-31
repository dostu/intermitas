class App {
  constructor() {
    this.initializeWidgets();
    this.initializeContainer();

    this.resize();
    this.draw();
  }

  initializeContainer() {
    createjs.Ticker.setFPS(30);
    createjs.MotionGuidePlugin.install();
    createjs.Ticker.addEventListener('tick', () => this.update());

    this.container = new createjs.Stage('canvas');
    this.container.addEventListener('stagemouseup', (event) => this.handleClick(event), false); 

    this.background = new Background();
    this.container.addChild(this.background.container);
    this.container.setChildIndex(this.background, 0);

    this.graph = new Graph();
    this.container.addChild(this.graph.container);
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
    this.background.draw(this.width(), this.height());
    this.graph.draw();
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
    this.changeTabs();
  }

  changeTabs() {
    $('.tabs').empty();
    App.date.tabs.forEach((tab) => new Tab(tab));
  }
}

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
}
