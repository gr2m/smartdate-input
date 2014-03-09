(function ($, moment) {
  'use strict';

  // SMARTDATE INPUT CLASS DEFINITION
  // ================================

  //
  //
  //
  var SmartDate = function (el) {
    var $input;
    var defaultFormat = 'dddd, MMMM D, YYYY h:mma';
    var formatChangeEventType = 'blur';
    var format;
    var api = this;

    // 1. cache elements for performance reasons and
    // 2. setup event bindings
    function initialize() {
      $input = $(el);

      if ($input.data('format')) {
        format = $input.data('format');
        $input.removeAttr('data-format');
      } else {
        format = defaultFormat;
      }
      if ($input.data('format-event')) {
        formatChangeEventType = $input.data('format-event');
        $input.removeAttr('data-format-event');
      }
      $input.on(formatChangeEventType, handleFormatChangeEvent);
    }

    // PUBLIC API
    // ----------
    api.set = function set(date) {
      var dateString;

      if (! date) {
        date = new Date();
      }
      if (typeof date === 'string') {
        dateString = date;
      } else {
        // Date Object
        dateString = moment(date).format(format);
      }
      $input.val(dateString);
      parseFormat(dateString);
    };
    api.setFormat = function setFormat(newFormat) {
      var val = $input.val();
      var currentDate;

      if (! val) {
        return;
      }

      currentDate = moment(val, format).toDate();
      format = newFormat;
      api.set(currentDate);
    };
    api.setEvent = function setEvent(eventType) {
      $input.unbind(formatChangeEventType, handleFormatChangeEvent);
      formatChangeEventType = eventType;
      $input.on(formatChangeEventType, handleFormatChangeEvent);
    };
    api.getFormat = function(callback) {
      callback(format);
    };


    // Event handlers
    // --------------

    //
    //
    //
    function handleFormatChangeEvent( /*event*/ ) {
      parseFormat($input.val());
    }


    // Internal Methods
    // ----------------

    //
    //
    //
    function parseFormat (dateString) {
      var newFormat;
      var oldFormatCheck;
      var newFormatCheck;

      // Stop if newFormat is same as old
      newFormat = moment.parseFormat(dateString);
      if (newFormat === format) return;

      // Stop if old format still fits
      oldFormatCheck = moment(dateString, format).format(format);
      if (dateString === oldFormatCheck) return;

      // Stop if new format cannot parse dateString correctly
      newFormatCheck = moment(dateString, newFormat).format(newFormat);
      if (dateString !== newFormatCheck) return;

      // sanity check
      console.log(dateString, 'dateString')
      console.log(oldFormatCheck, 'oldFormatCheck')
      console.log(newFormatCheck, 'newFormatCheck')
      console.log(format, 'format')
      console.log(newFormat, 'newFormat')
      console.log('')

      format = newFormat;
      $input.trigger('change:format', [newFormat]);
    }

    initialize();
  };


  // EDITABLE TABLE PLUGIN DEFINITION
  // ================================

  $.fn.smartDate = function (option, jsApiArg) {
    return this.each(function () {
      var $this = $(this);
      var api  = $this.data('bs.smartDate');

      if (!api) {
        $this.data('bs.smartDate', (api = new SmartDate(this)));
      }
      if (typeof option === 'string') {
        api[option].call($this, jsApiArg);
      }
    });
  };

  $.fn.smartDate.Constructor = SmartDate;


  // EDITABLE TABLE DATA-API
  // =======================

  $(document).on('input.bs.smartDate.data-api', '[data-smartdate-spy]', function(event) {
    var $input = $(event.target);
    event.preventDefault();
    event.stopImmediatePropagation();
    $input.removeAttr('data-smartdate-spy');
    $input.smartDate();
    $input.trigger( $.Event(event) );
  });
})(jQuery, moment);
