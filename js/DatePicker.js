'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var DatePicker = (function () {
  function DatePicker() {
    _classCallCheck(this, DatePicker);

    this.datePicker = $('.date-picker');
    this.initializeDates();
    this.bindDateClick();
    this.bindClick();
    this.bindDateSelect();
    this.changeDate('2015-04-30');
    this.showTooltip();
  }

  _createClass(DatePicker, [{
    key: 'initializeDates',
    value: function initializeDates() {
      var _this = this;

      var dates = [['2015-04-17', '2015 balandžio 17 d.'], ['2015-04-30', '2015 balandžio 30 d.'], ['2015-05-27', '2015 gegužės 27 d.']];

      var date = new Date();
      var today = '2015 birželio ' + date.getDay() + ' d.';
      dates.push(['today', today]);

      dates.forEach(function (date) {
        return _this.addDate(date[0], date[1]);
      });
    }
  }, {
    key: 'addDate',
    value: function addDate(date, title) {
      $('.date-select').append('<li><a href="#" data-date="' + date + '">' + title + '</a></li>');
    }
  }, {
    key: 'bindDateClick',
    value: function bindDateClick() {
      var _this2 = this;

      $('.date', this.datePicker).on('click', function () {
        $('.tooltip').remove();
        _this2.datePicker.toggleClass('open-select');
      });
    }
  }, {
    key: 'bindClick',
    value: function bindClick() {
      var _this3 = this;

      $(document).click(function (event) {
        if (!$(event.target).closest('.date-picker').length) {
          _this3.close();
        }
      });
    }
  }, {
    key: 'bindDateSelect',
    value: function bindDateSelect() {
      var _this4 = this;

      $('.date-select a').on('click', function (event) {
        var date = $(event.target).data('date');
        _this4.changeDate(date);
      });
    }
  }, {
    key: 'changeDate',
    value: function changeDate(date) {
      var dateText = $('[data-date="' + date + '"]', this.datePicker).text();
      $('.date').text(dateText);

      this.close();

      var changeDateEvent = new CustomEvent('change-date', { detail: { date: date } });
      document.dispatchEvent(changeDateEvent);
    }
  }, {
    key: 'showTooltip',
    value: function showTooltip() {
      $('.tooltip').delay(1500).fadeIn(300).delay(3000).fadeOut(300);
    }
  }, {
    key: 'close',
    value: function close() {
      this.datePicker.removeClass('open-select');
    }
  }]);

  return DatePicker;
})();