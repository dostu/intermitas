'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Tab = (function () {
  function Tab(tab) {
    _classCallCheck(this, Tab);

    this.renderTab(tab);
    this.bindClick();
  }

  _createClass(Tab, [{
    key: 'renderTab',
    value: function renderTab(tab) {
      var tabTemplate = $('#tab').html();
      var tabHtml = Mustache.render(tabTemplate, tab);
      this.tab = $(tabHtml);

      $('.tabs').append(this.tab);
    }
  }, {
    key: 'bindClick',
    value: function bindClick() {
      var _this = this;

      $('.tab-text', this.tab).on('click', function () {
        _this.toggle();
      });

      $(document).click(function (event) {
        if (!$(event.target).hasClass('tab-text')) {
          _this.close();
        }
      });
    }
  }, {
    key: 'toggle',
    value: function toggle() {
      var open = $(this.tab).hasClass('open');
      this.close();
      if (!open) {
        this.open();
      }
    }
  }, {
    key: 'open',
    value: function open() {
      this.tab.addClass('open');
    }
  }, {
    key: 'close',
    value: function close() {
      $('.tab').removeClass('open');
    }
  }]);

  return Tab;
})();