class Path {
  constructor(path, id) {
    this.id = id + 1;

    this.initializeContainer();

    this.initializeNodes(path.nodes);
    this.initializeLinks(path.links);

    this.draw();
  }

  initializeContainer() {
    this.container = new createjs.Container();
    this.linksContainer = new createjs.Container();
    this.container.addChild(this.linksContainer);
  }

  initializeNodes(nodePositions) { 
    let nodes = [];

    for (var i = 0; i < nodePositions[0].length; i++) {
      var positions = [];

      for (var j = 0; j < nodePositions.length; j++) {
        positions.push(nodePositions[j][i]);
      } 

      var node = new Node(positions, this, i);

      nodes.push(node);
    }

    this.nodes = nodes; 
  }

  color() {
    switch(this.id) {
      case 2:
        return App.colors.light_grey;
      case 3:
        return App.colors.dark_grey;
      default:
        return App.colors.white; 
    }

    if (this.opened) color = App.colors.yellow; 

    return color;
  }

  initializeLinks(linkedNodes) {
    linkedNodes.forEach((link) => {
      let from = this.nodes[link[0]];
      let to = this.nodes[link[1]];
      from.links.push(to);
    });
  }

  update() {
    this.drawLinks();
    this.nodes.forEach((node) => node.update());
  }

  draw() {
    this.drawLinks();
    this.nodes.forEach((node) => node.draw());
  }

  drawLinks() {
    this.linksContainer.removeAllChildren();

    let stroke = 0.8;
    if ($('.main-page.open-page').length) stroke = 0.3; 

    this.nodes.forEach((node) => {
      node.links.forEach((link) => {
        let line = new createjs.Shape();
        line.graphics.setStrokeStyle(stroke).beginStroke(this.color());
        line.graphics.moveTo(node.container.x, node.container.y).lineTo(link.container.x, link.container.y);
        this.linksContainer.addChild(line);
      });
    });
  }

  open() {
    this.opened = true;
    this.draw();
  }

  close() {
    this.opened = false;
    this.nodes.forEach(function(node) {
      node.close();
    });
    this.draw();
  }
}
