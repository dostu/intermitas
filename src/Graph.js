class Graph {
  constructor() {
    this.initializeContainer();
    this.initializePaths();
  }

  initializeContainer() {
    this.container = new createjs.Container();
    this.container.regX = 620;
    this.container.regY = 400;
  }

  initializePaths() {
    this.paths = App.paths.map((pathData, index) => {
      let path = new Path(pathData, index);
      this.container.addChild(path.container);
      this.container.setChildIndex(path.container, 0);
      return path;
    });
  }

  update() {
    this.paths.forEach((path) => path.update());
  }

  draw() { 
    this.paths.forEach((path) => path.draw());
  }

  handleClick(x, y) {
    this.paths.forEach((path) => path.close());

    let node = this.findClosestNode(x, y);
    if (node && node.activity()) node.open();

    return node;
  }

  findClosestNode(x, y) {
    var minDiff = 40;
    var targetNode = null;

    this.paths.forEach((path) => {
      path.nodes.forEach((node) => {
        var coords = this.container.localToGlobal(node.x(), node.y());
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

  resize(width, height) {
    this.container.x = width / 2;
    this.container.y = height / 2;
  }
}
