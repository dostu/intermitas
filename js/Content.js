'use strict';

var Content = function Content() {
  var that = this;
  document.addEventListener('openPage', function (event) {
    var node = event.detail.node;
    that.open(node.id, node.title, node.count());
  });
};

Content.prototype.open = function (id, title, count) {
  var contentTemplate = $('#content').html();
  var content = Mustache.render(contentTemplate, {
    title: title,
    count: count
  });

  $('.container').html(content);
  $('.content').append($('#page-' + id));

  $('.content').mCustomScrollbar({
    theme: 'rounded',
    setLeft: 20,
    scrollInteria: 0,
    alwaysShowScrollbar: 1,
    contentTouchScroll: 10 });

  $('.container').addClass('open');
  $('body').addClass('open-page');
};

Content.prototype.close = function (id, title, count) {
  $('.container').removeClass('open');
  $('body').removeClass('open-page');
  $('.preloaded-pages').append($('.container img'));
};