/* global moment */
(function ($, moment) {
  'use strict';

  // SMARTDATE INPUT CLASS DEFINITION
  // ================================

  //
  //
  //
  var SmartDate = function (el, settings) {
    var $input;
    var defaultFormat = 'dddd, MMMM D, YYYY h:mma';
    var defaultFormatChangeEventType = 'blur';
    var api = this;

    settings = settings || {};

    // 1. cache elements for performance reasons and
    // 2. setup event bindings
    function initialize() {
      var format;
      $input = $(el);

      format = settings.format || $input.data('format') || defaultFormat;
      if (typeof format === 'function') {
        settings.format = format(settings);
      } else {
        settings.format = format;
      }

      $input.removeAttr('data-format');

      settings.event = settings.event || $input.data('format-format-event') || defaultFormatChangeEventType;
      $input.removeAttr('data-format-event');

      $input.on(settings.event, handleFormatChangeEvent);

      if (settings.date) {
        api.set(settings.date);
      }
    }

    // PUBLIC API
    // ----------
    api.set = function set(date) {
      var dateString;

      if (!(date instanceof Date) && typeof date === 'object') {
        return updateSettings(date);
      }

      if (! date) {
        date = new Date();
      }
      if (typeof date === 'string') {
        dateString = date;
      } else {
        // Date Object
        dateString = moment(date).format(settings.format);
      }
      $input.val(dateString);
      parseFormat(dateString);
    };
    api.setFormat = function setFormat(newFormat) {
      var val = $input.val();
      var currentDate;

      if (typeof newFormat === 'function') {
        settings.format = newFormat(settings);
      } else {
        settings.format = newFormat;
      }

      if (! val) return;

      currentDate = moment(val, settings.format).toDate();
      api.set(currentDate);
    };
    api.setEvent = function setEvent(eventType) {
      $input.unbind(settings.event, handleFormatChangeEvent);
      settings.event = eventType;
      $input.on(settings.event, handleFormatChangeEvent);
    };
    api.getFormat = function(callback) {
      callback(settings.format);
    };
    api.get = function(callback) {
      var val = $input.val();
      var currentDate;

      if (! val) return callback();

      parseFormat(val);
      currentDate = moment(val, settings.format).toDate();
      callback(currentDate);
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
    function updateSettings (newSettings) {
      if (newSettings.format) {
        api.setFormat(newSettings.format);
      }
    }

    //
    //
    //
    function parseFormat (dateString) {
      var newFormat;
      var oldFormatCheck;
      var newFormatCheck;

      // Stop if newFormat is same as old
      newFormat = moment.parseFormat(dateString);
      if (newFormat === settings.format) return;

      // Stop if old format still fits
      oldFormatCheck = moment(dateString, settings.format).format(settings.format);
      if (dateString.toLowerCase() === oldFormatCheck.toLowerCase()) return;

      // Stop if new format cannot parse dateString correctly
      newFormatCheck = moment(dateString, newFormat).format(newFormat);
      if (dateString.toLowerCase() !== newFormatCheck.toLowerCase()) return;

      // sanity check

      settings.format = newFormat;
      $input.trigger('change:format', [newFormat]);
    }

    initialize();
  };


  // EDITABLE TABLE PLUGIN DEFINITION
  // ================================

  $.fn.smartDate = function (method) {
    var args = [].slice.call(arguments, 1);
    return this.each(function () {
      var $this = $(this);
      var api  = $this.data('bs.smartDate');
      var options;

      if (typeof method === 'object') {
        options = method;
      }
      if (!api) {
        $this.data('bs.smartDate', (api = new SmartDate(this, options)));
      }
      if (api[method]) {
        return api[method].apply(this, args);
      }

      if (options) {
        api.set(options);
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
