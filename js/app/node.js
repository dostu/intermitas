var Node = function(positions, path, id) {
  this.current_x = positions[0][0];
  this.current_y = positions[0][1];
  this.id = id;
  this.animation = [];

  this.links = [];
  this.path = path;

  this.size = App.nodes[this.number()] || 1;

  this.animation = positions.map(function(position) {
    return { x: position[0], y: position[1] };
  });

  this.shape = new createjs.Container();
  this.draw();
  this.animate();
}

Node.prototype.globalCoords = function() {
  return this.path.shape.localToGlobal(this.shape.x, this.shape.y);
}

Node.prototype.color = function() {
  return this.path.color();
}

Node.prototype.number = function() {
  return this.path.id * 100 + this.id + 1
}

Node.prototype.draw = function() {
  this.shape.removeAllChildren();
  clearTimeout(this.timeout);

  if (this.activity() && this.activity().level) {
    this.drawActiveCircle();
  }

  var node = new createjs.Shape
  node.graphics.beginFill(this.color()).drawCircle(0, 0, 3 + 2 * this.size);
  this.shape.addChild(node);
}

Node.prototype.drawActiveCircle = function() {
  if(this.activity().level == 2) {
    this.drawCircle();
    var that = this;
    this.timeout = setTimeout(function() {
      that.drawCircle();
    }, 1000);
  } else {
    this.drawCircle(Math.random() * 5000);
  }
}

Node.prototype.drawCircle = function(wait) {
  var size = 6;

  if (!wait) wait = 0;

  var circle = new createjs.Shape();
  circle.graphics.beginRadialGradientFill(
    [createjs.Graphics.getRGB(0x333, 0), this.color()], [0, 1], 100, 100, size / 2, 100, 100, size)
    .drawCircle(100, 100, size);
  circle.regX = 100;
  circle.regY = 100;
  circle.alpha = 0.75;
  var scale = 1 + this.size * 2;
  createjs.Tween.get(circle, { loop: true }).wait(wait).to({ scaleX: scale, scaleY: scale, alpha: 0 }, 2000, createjs.Ease.cubicOut());

  this.shape.addChild(circle);
  this.shape.setChildIndex(circle, 0);
}

Node.prototype.animate = function() {
  var points = [];
  this.animation.forEach(function(point) {
    points.push(point.x, point.y);
  });
  
  var curvePoints = Array.prototype.slice.call(getCurvePoints(points, 1, 20, true));
  curvePoints.push(points[0], points[1]);

  curvePoints = _.chunk(curvePoints, 2);

  var converted = [this.current_x, this.current_y];;

  for (i = 0; i < curvePoints.length - 2; i++) {
    var point = curvePoints[i];
    var nextPoint = curvePoints[i+1];

    var xc = (point[0] + nextPoint[0]) / 2;
    var yc = (point[1] + nextPoint[1]) / 2;
    converted.push(xc, yc, nextPoint[0], nextPoint[1]);
  }
  
  createjs.Tween.get(this.shape, { loop: true, useTicks: true }).to({ guide: { path: converted } }, 5000);
}

Node.prototype.activity = function() {
  return App.dates[0].activity[this.number()];
}

Node.prototype.title = function() {
  return this.activity().title;
}

Node.prototype.count = function() {
  return this.activity().count;
}

Node.prototype.open = function() {
  this.opened = true;
  this.path.open();
  this.draw();

  if (this.activity()) {
    var popupTemplate = $('#popup').html();
    var popup = Mustache.render(popupTemplate, { 
      id: this.number(),
      count: this.count(),
      title: this.title()
    });

    $('body').append(popup);

    var that = this;
    $('body .popup-button').on('click', function() {
      that.openPage();
    });
  }
}

Node.prototype.openPage = function() {
  var that = this;
  var event = new CustomEvent('openPage', { detail: { node: this } });
  document.dispatchEvent(event);
}

Node.prototype.update = function() {
  if (this.opened) {
    $('body .popup').css({ left: this.globalCoords().x, top: this.globalCoords().y });
  }
}

Node.prototype.close = function() {
  $('body .popup').remove();
  this.opened = false;
  this.draw();
}
