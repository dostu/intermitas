var Path = function(path, id) {
  this.nodes = [];
  this.id = id + 1;

  this.nodes = this.initializeNodes(path.nodes);
  this.initializeLinks(path.links);

  this.shape = new createjs.Container();

  this.linksContainer = new createjs.Container();
  this.shape.addChild(this.linksContainer);

  this.nodes.forEach(function(node) {
    this.shape.addChild(node.shape);
  }, this);

  this.draw();
}

Path.prototype.initializeNodes = function(nodePositions) { 
  var nodes = [];

  for (var i = 0; i < nodePositions[0].length; i++) {
    var positions = [];

    for (var j = 0; j < nodePositions.length; j++) {
      positions.push(nodePositions[j][i]);
    } 

    var node = new Node(positions, this, i);

    nodes.push(node);
  }

  return nodes; 
}

Path.prototype.color = function() {
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

Path.prototype.initializeLinks = function(linkedNodes) {
  that = this;
  linkedNodes.forEach(function(link) {
    var from = that.nodes[link[0]];
    var to = that.nodes[link[1]];
    from.links.push(to);
  });
}

Path.prototype.update = function() {
  this.nodes.forEach(function(node) {
    node.update();
  });
  this.linksContainer.removeAllChildren();
  var that = this;
  var stroke = 0.8;
  if ($('.main-page.open-page').length) stroke = 0.3; 
  this.nodes.forEach(function(node) {
    node.links.forEach(function(link) {
      var line = new createjs.Shape();
      line.graphics.setStrokeStyle(stroke).beginStroke(that.color());
      line.graphics.moveTo(node.shape.x, node.shape.y).lineTo(link.shape.x, link.shape.y);
      that.linksContainer.addChild(line);
    });
  });
}

Path.prototype.draw = function() {
  this.nodes.forEach(function(node) {
    console.log('draw node');
    node.draw();
  });
}

Path.prototype.open = function() {
  this.opened = true;
  this.draw();
}

Path.prototype.close = function() {
  this.opened = false;
  this.nodes.forEach(function(node) {
    node.close();
  });
  this.draw();
}
