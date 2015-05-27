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

function init() {
  sections = initializeSections(sections);

  stage = new createjs.Stage("canvas");
  background = new createjs.Shape();
  stage.addChild(background);
  container = new createjs.Container();

  window.addEventListener('resize', resize, false);
  stage.addEventListener('stagemouseup', onClickGraph, false);

  createjs.Ticker.setFPS(200);
  createjs.Ticker.addEventListener("tick", draw);

  activeCircle = aboutCircle();
  resize();

  stage.addChild(container);

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
  bgCircle.graphics.beginFill('#111').drawCircle(x, y, 20);
  stage.addChild(bgCircle);

  var speed = 20;
  createjs.Tween.get(bgCircle, { loop: true })
  .to({ x: 100, y: 100 }, 1000, createjs.Ease.getPowInOut(1))


  offsetX = stage.canvas.width / 2 - 650;
  offsetY = stage.canvas.height / 2 - 400;
  container.x = offsetX; 
  container.y = offsetY;
  draw();
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
      var node = nodes[j][i];
      console.log(i);
      convertedNode.animation.push({ x: node[0], y: node[1] });
    }

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
  container.removeAllChildren();
  sections.forEach(drawSection);
  if (openedNode && !openPage) drawTable(openedNode);
  drawStartPoint();
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

  sections.forEach(function(section) {
    section.nodes.forEach(function(node) {
      if (node.static) return;

      createjs.Tween.get(node, { loop: true, useTicks: true })
      .to({ 
        current_x: node.animation[1].x,
        current_y: node.animation[1].y
      }, speed, createjs.Ease.getPowInOut(power))
      .to({ 
        current_x: node.animation[2].x,
        current_y: node.animation[2].y
      }, speed, createjs.Ease.getPowInOut(power))
      .to({ 
        current_x: node.animation[3].x,
        current_y: node.animation[3].y
      }, speed, createjs.Ease.getPowInOut(power))
      .to({ 
        current_x: node.animation[4].x,
        current_y: node.animation[4].y
      }, speed, createjs.Ease.getPowInOut(power))
      .to({ 
        current_x: node.animation[5].x,
        current_y: node.animation[5].y
      }, speed, createjs.Ease.getPowInOut(power))
      .to({ 
        current_x: node.animation[6].x,
        current_y: node.animation[6].y
      }, speed, createjs.Ease.getPowInOut(power))
      .to({ 
        current_x: node.animation[7].x,
        current_y: node.animation[7].y
      }, speed, createjs.Ease.getPowInOut(power))
      .to({ 
        current_x: node.animation[8].x,
        current_y: node.animation[8].y
      }, speed, createjs.Ease.getPowInOut(power))
      .to({ 
        current_x: node.animation[0].x,
        current_y: node.animation[0].y
      }, speed, createjs.Ease.getPowInOut(power))
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

function getCurvePoints(ptsa, tension, isClosed, numOfSegments) {

    // use input value if provided, or use a default value   
    tension = (typeof tension != 'undefined') ? tension : 0.5;
    isClosed = isClosed ? isClosed : false;
    numOfSegments = numOfSegments ? numOfSegments : 16;

    var _pts = [], res = [],    // clone array
        x, y,           // our x,y coords
        t1x, t2x, t1y, t2y, // tension vectors
        c1, c2, c3, c4,     // cardinal points
        st, t, i;       // steps based on num. of segments

    // clone array so we don't change the original
    _pts = ptsa.slice(0);

    // The algorithm require a previous and next point to the actual point array.
    // Check if we will draw closed or open curve.
    // If closed, copy end points to beginning and first points to end
    // If open, duplicate first points to befinning, end points to end
    if (isClosed) {
        _pts.unshift(pts[pts.length - 1]);
        _pts.unshift(pts[pts.length - 2]);
        _pts.unshift(pts[pts.length - 1]);
        _pts.unshift(pts[pts.length - 2]);
        _pts.push(pts[0]);
        _pts.push(pts[1]);
    }
    else {
        _pts.unshift(pts[1]);   //copy 1. point and insert at beginning
        _pts.unshift(pts[0]);
        _pts.push(pts[pts.length - 2]); //copy last point and append
        _pts.push(pts[pts.length - 1]);
    }

    // ok, lets start..

    // 1. loop goes through point array
    // 2. loop goes through each segment between the 2 pts + 1e point before and after
    for (i=2; i < (_pts.length - 4); i+=2) {
        for (t=0; t <= numOfSegments; t++) {

            // calc tension vectors
            t1x = (_pts[i+2] - _pts[i-2]) * tension;
            t2x = (_pts[i+4] - _pts[i]) * tension;

            t1y = (_pts[i+3] - _pts[i-1]) * tension;
            t2y = (_pts[i+5] - _pts[i+1]) * tension;

            // calc step
            st = t / numOfSegments;

            // calc cardinals
            c1 =   2 * Math.pow(st, 3)  - 3 * Math.pow(st, 2) + 1; 
            c2 = -(2 * Math.pow(st, 3)) + 3 * Math.pow(st, 2); 
            c3 =       Math.pow(st, 3)  - 2 * Math.pow(st, 2) + st; 
            c4 =       Math.pow(st, 3)  -     Math.pow(st, 2);

            // calc x and y cords with common control vectors
            x = c1 * _pts[i]    + c2 * _pts[i+2] + c3 * t1x + c4 * t2x;
            y = c1 * _pts[i+1]  + c2 * _pts[i+3] + c3 * t1y + c4 * t2y;

            //store points in array
            res.push(x);
            res.push(y);

        }
    }

    return res;
}
