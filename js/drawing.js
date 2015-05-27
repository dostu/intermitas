createjs.Graphics.prototype.dashedLineTo = function( x1 , y1 , x2 , y2 , dashLen) {
  this.moveTo(x1 , y1);

  var dX = x2 - x1;
  var dY = y2 - y1;
  var dashes = Math.floor(Math.sqrt( dX * dX + dY * dY ) / dashLen);
  var dashX = dX / dashes;
  var dashY = dY / dashes;

  var q = 0;
  while( q++ < dashes){
    x1 += dashX;
    y1 += dashY;
    this[q % 2 == 0 ? 'moveTo' : 'lineTo'](x1, y1);
  }
  this[q % 2 == 0 ? 'moveTo' : 'lineTo'](x2, y2);
  return this;
}

var COLOR = {
  yellow: '#ffdd15',
  white: '#fff',
  light_grey: '#999',
  dark_grey: '#666'
}


function drawTable(node) {
  $('.popup').css('left', node.current_x + offsetX);
  $('.popup').css('top', node.current_y + offsetY - 135);
}

function drawStartPoint() {
  var circle = new createjs.Shape();
  x = sections[3].nodes[0].current_x;
  y = sections[3].nodes[0].current_y;
  circle.graphics.beginFill(COLOR.yellow).drawCircle(x, y, 20);
  circle.addEventListener('click', function() {
    alert('test');
  }, true);
  activeCircle.x = x;
  activeCircle.y = y;
  container.addChild(circle);
}

function drawNode(node) {
  var circle = new createjs.Shape();
  var color = 'white';
  if (node.section == sections[1]) {
    color = COLOR.light_grey;
  }
  if (node.section == sections[2]) {
    color = COLOR.dark_grey;
  }
  if (openedNode && node.section == openedNode.section) color = COLOR.yellow; 
  circle.graphics.beginFill(color).drawCircle(0, 0, 3 + 2 * node.info.size );
  circle.x = node.current_x
  circle.y = node.current_y
  container.addChild(circle);
  node.shape = circle;
}

function drawLink(link) {
  var line = new createjs.Shape();
  var color = 'white';
  if (link.section == sections[1]) {
    color = '#999';
  }
  if (link.section == sections[2]) {
    color = '#666';
  }
  if (openedNode && link.section == openedNode.section) color = '#ffdd15';
  var stroke = 1;
  if (openPage) stroke = 0.5;
  line.graphics.setStrokeStyle(stroke).beginStroke(color)
  .moveTo(link.from.shape.x, link.from.shape.y).lineTo(link.to.shape.x, link.to.shape.y);
  links.addChild(line);
}

function drawSection(section) {
  section.nodes.forEach(drawNode);
  section.links.forEach(drawLink);
}
