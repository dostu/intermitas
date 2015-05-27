var Graph = function() {
  this.container = new createjs.Container();
  this.container.regX = 620;
  this.container.regY = 400;
  this.paths = App.paths.map(function(path, index) {
    return new Path(path, index);
  });
}

Graph.prototype.update = function() {
  this.paths.forEach(function(path) {
    path.update();
  });
}

Graph.prototype.draw = function() { 
  var that = this;
  this.paths.forEach(function(path) {
    that.container.addChild(path.shape);
  });

  return this.container;
}

Graph.prototype.handleClick = function(x, y) {
  var node = this.findClosestNode(x, y);
  this.paths.forEach(function(path) {
    path.close();
  });
  if (node) node.open();
  return node;
  // openedNode = node;

  // if(openedNode) {
  //   createjs.Ticker.setFPS(50);
  //   openPopup();
  // } else {
  //   $('.popup').hide();
  //   console.log(x, container.x);
  //   if (x > container.x && x < container.x + 1200 && y > container.y && y < container.y + 600) {
  //     createjs.Ticker.setFPS(50);
  //     setTimeout(function() {
  //       if(!openedNode && !openPage) createjs.Ticker.setFPS(300);
  //     }, 2000);
  //   } else {
  //     createjs.Ticker.setFPS(300);
  //   }
  // }
}

Graph.prototype.findClosestNode = function(x, y) {
  var minDiff = 20;
  var targetNode = null;

  var that = this;
  this.paths.forEach(function(path) {
    path.nodes.forEach(function(node) { 
      var coords = that.container.localToGlobal(node.shape.x, node.shape.y);
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
