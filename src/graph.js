class Graph {
  constructor(container) {
    this.initializeContainer(container);
    this.initializePaths();
  }

  initializeContainer(container) {
    this.container = new createjs.Container();
    this.container.regX = 620;
    this.container.regY = 400;
    container.addChild(this.container);
  }

  initializePaths() {
    this.paths = App.paths.map((path, index) => {
      return new Path(path, index);
    });
  }

  update() {
    this.paths.forEach((path) => path.update());
  }

  draw() { 
    this.paths.forEach((path) => this.container.addChild(path.container));
  }

  handleClick(x, y) {
    this.paths.forEach((path) => path.close());

    let node = this.findClosestNode(x, y);
    if (node) node.open();

    return node;
  }

  findClosestNode(x, y) {
    var minDiff = 20;
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
}
