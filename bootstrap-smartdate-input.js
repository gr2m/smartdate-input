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
        dateString = moment(date).format(format || defaultFormat);
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
      var newFormat = moment.parseFormat(dateString);
      var check = moment(dateString, newFormat).format(newFormat);

      // sanity check
      if (dateString === check && newFormat !== format) {
        format = newFormat;
        $input.trigger('change:format', [newFormat]);
      }
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
    event.preventDefault();
    $(event.target).smartDate().removeAttr('data-smartdate-spy');
    $(event.target).trigger(event);
  });
})(jQuery, moment);
