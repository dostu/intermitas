var CANVAS_WIDTH = 1300;
var CANVAS_HEIGHT = 1200;

var openedNode = null;
var stage = null, container = null, background = null;
var openPage = false;
var offsetX = 0, offsetY = 0;

var activeCircle = null;

$(document).on('click', '.open-page', function() { 
  $('.page-content').attr('src', 'pages/' + openedNode.info.number + '.png');
  if (openedNode.info.count) {
    $('.page-count').show();
    $('.page-count').text(openedNode.info.count);
  } else {
    $('.page-count').hide();
  }
  $('.page-title').text(openedNode.info.title);
  $('.container').addClass('open');
  $('body').addClass('open-page')
  $('.popup').hide();

  stage.removeEventListener('stagemouseup', onClickGraph, false);
  setTimeout(function () {
    stage.addEventListener('stagemouseup', onClickPage, false);
  }, 1000);

  $('.logo').fadeOut(200);

  createjs.Tween.get(stage).to({ 
    scaleX: 3,
    scaleY: 3,
    x: -(openedNode.current_x + offsetX) * 2.5,
    y: -(openedNode.current_y + offsetY) * 2
  }, 500, createjs.Ease.getPowInOut(2))
  openPage = true;

  createjs.Ticker.setFPS(24);
});

function openPopup() {
  var $popup = $('.popup');
  if(openedNode.info.count) {
    $popup.find('.popup-count').show();
    $popup.find('.popup-count').text(openedNode.info.count);
  } else {
    $popup.find('.popup-count').hide();
  }
  $popup.find('.popup-text').html(openedNode.info.title);
  $popup.find('.open-page').attr('href', '#' + openedNode.info.number);
  $popup.show();
}

function onClickGraph(event) {
  var x = event.stageX
  var y = event.stageY

  var node = findNode(x, y);
  openedNode = node;

  if(openedNode) {
    createjs.Ticker.setFPS(50);
    openPopup();
  } else {
    $('.popup').hide();
    console.log(x, container.x);
    if (x > container.x && x < container.x + 1200 && y > container.y && y < container.y + 600) {
      createjs.Ticker.setFPS(50);
      setTimeout(function() {
        if(!openedNode && !openPage) createjs.Ticker.setFPS(300);
      }, 2000);
    } else {
      createjs.Ticker.setFPS(200);
    }
  }
}

function onClickPage() {
  createjs.Tween.get(stage).to({ 
    scaleX: 1,
    scaleY: 1,
    x: 0,
    y: 0
  }, 500, createjs.Ease.getPowInOut(2))

  setTimeout(function() {
    $('.popup').show();
  }, 500);
  setTimeout(function() {
    $('.logo').fadeIn();
  }, 300);
  $('.container').removeClass('open');
  $('body').removeClass('open-page');
  stage.removeEventListener('stagemouseup', onClickPage, false);
  stage.addEventListener('stagemouseup', onClickGraph, false);
  openPage = false;
}

function drawActiveCircle(x, y, size) {
  var circle = new createjs.Shape();
  circle.graphics.beginRadialGradientFill(
    [createjs.Graphics.getRGB(0x333, 0), COLOR.yellow], [0, 1], 100, 100, size / 2, 100, 100, size)
    .drawCircle(100, 100, size);
  circle.regX = 100;
  circle.regY = 100;
  circle.x = x + offsetX;
  circle.y = y + offsetY;
  createjs.Tween.get(circle, {loop: true})
    .to({scaleX: 5, scaleY: 5, alpha: 0}, 1200)
  return circle;
}

function aboutCircle() {
  var about = new createjs.Container();
  stage.addChild(about);
  
  setTimeout(function() {
    var circle = drawActiveCircle(0, 0, 10);
    about.addChild(circle);
  }, 1);
  setTimeout(function() {
    var circle = drawActiveCircle(0, 0, 10);
    about.addChild(circle);
  }, 600);
  return about;
}

var links = null;

function init() {
  sections = initializeSections(sections);

  stage = new createjs.Stage("canvas");
  background = new createjs.Shape();
  stage.addChild(background);
  container = new createjs.Container();

  links = new createjs.Container();
  container.addChild(links);

  window.addEventListener('resize', resize, false);
  stage.addEventListener('stagemouseup', onClickGraph, false);

  createjs.Ticker.setFPS(200);
  createjs.Ticker.addEventListener("tick", draw);

  activeCircle = aboutCircle();
  resize();

  stage.addChild(container);

  sections.forEach(drawSection);

  animate();
}

function resize() {
  stage.canvas.width = window.innerWidth;
  stage.canvas.height = window.innerHeight;
  // background.graphics.beginFill('#333').drawRect(0, 0, stage.canvas.width, stage.canvas.height);
  x = stage.canvas.width / 2;
  y = stage.canvas.height / 2;
  background.graphics.beginRadialGradientFill(["#161616","#333"], [0, 1], x, y, 0, x, y, 400).drawRect(0, 0, stage.canvas.width, stage.canvas.height);

  var bgCircle = new createjs.Shape();
  // bgCircle.graphics.beginFill('#111').drawCircle(x, y, 20);
  stage.addChild(bgCircle);

  var speed = 20;
  createjs.Tween.get(bgCircle, { loop: true })
  .to({ x: 100, y: 100 }, 1000, createjs.Ease.getPowInOut(1))


  offsetX = stage.canvas.width / 2 - 650;
  offsetY = stage.canvas.height / 2 - 400;
  container.x = offsetX; 
  container.y = offsetY;
  // draw();
}

function initializeSections(sections) {
  sections.forEach(function(section, index) {
    section.nodes = initializeNodes(section, index + 1);
    section.links = initializeLinks(section);
  });

  // sections.forEach(function(section) {
  //   section.nodes.forEach(function(node) {
  //     if (findDuplicateNodes(sections, node)) {
  //       node.static = true;
  //     }
  //   });
  // });

  return sections;
}

function initializeNodes(section, sectionNumber) {
  var nodes = section.nodes;
  var convertedNodes = [];

  for (var i = 0; i < nodes[0].length; i++) {
    var info = nodeInfo.find(function(node) { return node.number == sectionNumber * 100 + i + 1 });

    var convertedNode = {
      current_x: nodes[0][i][0],
      current_y: nodes[0][i][1],
      number: i,
      section: section,
      animation: [],
      info:  {
        number: sectionNumber * 100 + i + 1,
        size: 1,
        count: 20,
        title: 'Test'
      }
    }

    if(sectionNumber == 1 && i < 11) {
      convertedNode.info.size = info.size;
      convertedNode.info.count = info.count;
      convertedNode.info.title = info.title;
    }

    for (var j = 0; j < nodes.length; j++) {
    // for (var j = 0; j < 3; j++) {
      var node = nodes[j][i];
      convertedNode.animation.push({ x: node[0], y: node[1] });
    }
    // convertedNode.animation.push({ x: nodes[0][i][0], y: nodes[0][i][1] });
    // convertedNode.animation.push({ x: nodes[1][i][0], y: nodes[1][i][1] });
    // convertedNode.animation.push({ x: nodes[1][i][0], y: nodes[1][i][1] });
    // convertedNode.animation.push({ x: nodes[1][i][0], y: nodes[1][i][1] });
    // convertedNode.animation.push({ x: nodes[1][i][0], y: nodes[1][i][1] });
    // convertedNode.animation.push({ x: nodes[1][i][0], y: nodes[1][i][1] });

    convertedNodes.push(convertedNode);
  }

  return convertedNodes;
}

function findDuplicateNodes(sections, targetNode) {
  duplicates = 0;
  sections.forEach(function(section) {
    section.nodes.forEach(function(node) {
      if (node.current_x == targetNode.current_x && node.current_y == targetNode.current_y) {
        duplicates += 1;
      }
    });
  });
  return duplicates - 1;
}

function initializeLinks(section) {
  var links = section.links;
  var nodes = section.nodes;

  var convertedLinks = links.map(function(link) {
    return {
      from: nodes[link[0]],
      to: nodes[link[1]],
      section: section
    }
  });

  return convertedLinks;
}

function draw() {
  // container.removeAllChildren();
  // sections.forEach(drawSection);
  // if (openedNode && !openPage) drawTable(openedNode);
  // drawStartPoint();
  links.removeAllChildren();
  sections.forEach(function(section) {
    section.links.forEach(drawLink);
  });
  stage.update();
} 

function animateSection(section) {
  section.nodes.forEach(function(node) {
    if(node.static) return;
  });
}

function animate() {
  var speed = 300;
  var power = 1;

  createjs.MotionGuidePlugin.install();

  sections.forEach(function(section) {
    section.nodes.forEach(function(node) {
      if (node.static) return;

      // var points = node.animation;
      // var curvePoints = [node.current_x, node.current_y];

      var points = [];
      node.animation.forEach(function(point) {
        points.push(point.x);
        points.push(point.y);
      });
      
      var curvePoints = getCurvePoints(points, 1, 20, true);
      var points = Array.prototype.slice.call(curvePoints);
      points.push(points[0], points[1]);

      curvePoints = [node.current_x, node.current_y];

      for (i = 0; i < points.length / 2 - 2; i ++)
      {
        var j = i * 2;
        var xc = (points[j] + points[(i+1)*2]) / 2;
        var yc = (points[j+1] + points[(i+1)*2+1]) / 2;
        curvePoints.push(xc, yc, points[(i + 1) * 2], points[(i + 1) * 2+1]);

        // var curves = new createjs.Container();
        // var curve = new createjs.Shape();
        // curve.graphics.setStrokeStyle(1).beginStroke('#777');
        // curve.graphics.moveTo(points[j], points[j+1]).curveTo(xc, yc, points[(i + 1) * 2], points[(i + 1) * 2+1]);
        // curves.addChild(curve);
        // curves.x = offsetX;
        // curves.y = offsetY;
        // stage.addChild(curves);
      }

      createjs.Tween.get(node.shape, { loop: true }).to({ guide: { path: curvePoints } }, 40000);
    });
  });
}

function findNode(x, y) {
  var minDiff = 20;
  var targetNode = null;

  sections.forEach(function(section) {
    section.nodes.forEach(function(node) { 
      if (node.static) return;
      diff_x = Math.abs(node.current_x + offsetX - x);
      diff_y = Math.abs(node.current_y + offsetY - y);
      diff = Math.sqrt(diff_x * diff_x + diff_y * diff_y);

      if (diff < 20) {
        targetNode = node;
        minDiff = diff;
      }
    });
  });

  return targetNode;
}

if (!Array.prototype.find) {
  Array.prototype.find = function(predicate) {
    if (this == null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}
