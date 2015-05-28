class Node {
  constructor(positions, path, id) {
    this.id = path.id * 100 + id + 1;
    if (this.id == 401) {
      this.id = 'about';
    }
    this.path = path;
    this.size = App.nodes[this.id] || 1;
    this.links = [];

    this.initializeContainer(path.container);
    this.initializeAnimations(positions);

    this.draw();
    this.container.x = positions[0][0];
    this.container.y = positions[0][1];
    this.animate();
  }

  initializeContainer(container) {
    this.container = new createjs.Container();
    container.addChild(this.container);
  }

  initializeAnimations(positions) {
    this.animation = positions.map(function(position) {
      return { x: position[0], y: position[1] };
    });
  }

  globalCoords() {
    return this.path.container.localToGlobal(this.container.x, this.container.y);
  }

  color() {
    return this.path.color();
  }

  draw() {
    this.container.removeAllChildren();
    clearTimeout(this.timeout);

    if (this.activity() && this.activity().level) {
      this.drawActiveCircle();
    }

    if (this.id == 'about') {
      this.drawStartingPoint();
    } else {
      var node = new createjs.Shape();
      node.graphics.beginFill(this.color()).drawCircle(0, 0, 3 + 2 * this.size);
      this.container.addChild(node);
    }
  }

  x() {
    return this.container.x; 
  }

  y() {
    return this.container.y; 
  }

  drawActiveCircle() {
    if(this.activity().level == 2) {
      this.drawCircle();
      this.timeout = setTimeout(() => this.drawCircle(), 1000);
    } else {
      this.drawCircle(Math.random() * 5000);
    }
  }

  drawCircle(wait) {
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

    this.container.addChild(circle);
    this.container.setChildIndex(circle, 0);
  }

  drawStartingPoint() {
    this.container.removeAllChildren();

    let circle = new createjs.Shape();
    circle.graphics.beginFill(App.colors.yellow).drawCircle(0, 0, 20);
    this.container.addChild(circle);

    let text = new createjs.Text('apie', "12px Arial", App.colors.black);
    text.set({
      textAlign: 'center'
    });
    text.y = -7;
    this.container.addChild(text);
  }

  animate() {
    var points = []
    this.animation.forEach((point) => points.push(point.x, point.y));
    
    var curvePoints = Array.prototype.slice.call(getCurvePoints(points, 1, 20, true));
    curvePoints.push(points[0], points[1]);
    curvePoints = _.chunk(curvePoints, 2);

    let convertedPoints = [this.container.x, this.container.y];;

    for (var i = 0; i < curvePoints.length - 2; i++) {
      var point = curvePoints[i];
      var nextPoint = curvePoints[i+1];

      var xc = (point[0] + nextPoint[0]) / 2;
      var yc = (point[1] + nextPoint[1]) / 2;

      convertedPoints.push(xc, yc, nextPoint[0], nextPoint[1]);
    }

    
    createjs.Tween.get(this.container, { loop: true, useTicks: true })
      .to({ guide: { path: convertedPoints } }, 5000);
  }

  activity() {
    return App.dates[0].activity[this.id];
  }

  title() {
    if (this.id == 'about') {
      return 'apie';
    } else {
      return this.activity().title;
    }
  }

  count() {
    if (this.id == 'about') {
      return '';
    } else {
      return this.activity().count;
    }
  }

  openPage() {
    var event = new CustomEvent('openPage', { detail: { node: this } });
    document.dispatchEvent(event);
  }

  update() {
    if (this.opened) {
      $('body .popup').css({ left: this.globalCoords().x, top: this.globalCoords().y });
    }
  }

  open() {
    this.opened = true;
    this.path.open();
    this.draw();

    if (this.id == 'about') {
      this.openPage();
      return;
    }

    if (this.activity() || this.id == 'about') {
      var popupTemplate = $('#popup').html();
      var popup = Mustache.render(popupTemplate, { 
        id: this.id,
        count: this.count(),
        title: this.title()
      });

      $('body').append(popup);
      $('body .popup-button').on('click', () => this.openPage());
    }
  }

  close() {
    $('body .popup').remove();
    this.opened = false;
    this.draw();
  }
}
