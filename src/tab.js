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
      this.close();
      this.open();
    });

    $(document).click((event) => {
      if(!$(event.target).hasClass('tab-text')) {
        this.close();
      }
    });
  }

  open() {
    this.tab.addClass('open');
  }

  close() {
    $('.tab').removeClass('open');
  }
}
