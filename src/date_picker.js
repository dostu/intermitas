class DatePicker {
  constructor() {
    this.datePicker = $('.date-picker');
    this.bindDateClick();
    this.bindClick();
    this.bindDateSelect();
    this.changeDate('2015-04-30');
    this.showTooltip();
  }

  bindDateClick() {
    $('.date', this.datePicker).on('click', () => {
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
