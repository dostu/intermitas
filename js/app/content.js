var Content = function() {
  var that = this;
  document.addEventListener('openPage', function(event) {
    var node = event.detail.node;
    that.open(node.number(), node.title(), node.count());
  });
}

Content.prototype.open = function(id, title, count) {
  var contentTemplate = $('#content').html();
  var content = Mustache.render(contentTemplate, { 
    id: id,
    title: title,
    count: count
  });

  $('.container').html(content);
  $('.container').addClass('open');
  $('body').addClass('open-page');

  $(".content").mCustomScrollbar({
    theme: "rounded",
    setLeft: 20
  });
}

Content.prototype.close = function(id, title, count) {
  $('.container').removeClass('open');
  $('body').removeClass('open-page');
}
