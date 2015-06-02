class DatePicker {
  constructor() {
    this.datePicker = $('.date-picker');
    this.initializeDates();
    this.bindDateClick();
    this.bindClick();
    this.bindDateSelect();
    this.changeDate('today');
    this.showTooltip();
  }

  initializeDates() {
    let dates = [
      ['2015-04-19', '2015 balandžio 19 d.'],
      ['2015-04-30', '2015 balandžio 30 d.'],
      ['2015-05-27', '2015 gegužės 27 d.'],
    ];

    let date = new Date();
    let today = `2015 birželio ${date.getDay()} d.`;
    dates.push(['today', today]);

    dates.forEach((date) => this.addDate(date[0], date[1]));
  }

  addDate(date, title) {
    $('.date-select').append(`<li><a href="#" data-date="${date}">${title}</a></li>`);
  }

  bindDateClick() {
    $('.date', this.datePicker).on('click', () => {
      $('.tooltip').remove();
      this.datePicker.toggleClass('open-select');
    });
  }

  bindClick() {
    $(document).click((event) => {
      if(!$(event.target).closest('.date-picker').length) {
        this.close();
      }
    });
  }

  bindDateSelect() {
    $('.date-select a').on('click', (event) => {
      let date = $(event.target).data('date');
      this.changeDate(date);
    });
  }

  changeDate(date) {
    let dateText = $(`[data-date="${date}"]`, this.datePicker).text();
    $('.date').text(dateText);

    this.close();

    let changeDateEvent = new CustomEvent('change-date', { detail: { date: date } });
    document.dispatchEvent(changeDateEvent);
  }

  showTooltip() {
    $('.tooltip').delay(1500).fadeIn(300).delay(3000).fadeOut(300);
  }

  close() {
    this.datePicker.removeClass('open-select');
  }
}
