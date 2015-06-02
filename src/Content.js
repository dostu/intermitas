var Content = function() {
  var that = this;
  document.addEventListener('openPage', function(event) {
    var node = event.detail.node;
    that.open(node.id, node.title, node.count(), node.path.id);
  });
}

Content.prototype.open = function(id, title, count, path_id) {
  var contentTemplate = $('#content').html();
  if (path_id == 4) path_id = undefined;

  var content = Mustache.render(contentTemplate, { 
    title: title,
    count: count,
    path_id: path_id
  });

  $('.container').html(content);
  $('.content').append($(`#page-${id}`));
  $('.content').jScrollPane({
    verticalDragMaxHeight: 10
  });

  $('.container').addClass('open');
  $('body').addClass('open-page');
}

Content.prototype.close = function(id, title, count) {
  $('.container').removeClass('open');
  $('body').removeClass('open-page');
  $('.preloaded-pages').append($('.container img'));
}
