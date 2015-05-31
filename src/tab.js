class Tab {
  constructor(tab) {
    this.renderTab(tab);
    this.bindClick();
  }

  renderTab(tab) {
    let tabTemplate = $('#tab').html();
    let tabHtml = Mustache.render(tabTemplate, tab);
    this.tab = $(tabHtml);

    $('.tabs').append(this.tab);
  }

  bindClick() {
    $('.tab-text', this.tab).on('click', () => {
      this.toggle();
    });

    $(document).click((event) => {
      if(!$(event.target).hasClass('tab-text')) {
        this.close();
      }
    });
  }

  toggle() {
    let open = $(this.tab).hasClass('open');
    this.close();
    if (!open) {
      this.open();
    }
  }

  open() {
    this.tab.addClass('open');
  }

  close() {
    $('.tab').removeClass('open');
  }
}
