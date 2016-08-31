(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.smartdateInput = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = smartdateInput

function smartdateInput ($, moment) {
  // SMARTDATE INPUT CLASS DEFINITION
  // ================================

  //
  //
  //
  var SmartDate = function (el, settings) {
    var $input
    var defaultFormat = 'dddd, MMMM D, YYYY h:mma'
    var defaultFormatChangeEventType = 'blur'
    var api = this
    var timestamp

    settings = settings || {}

    // 1. cache elements for performance reasons and
    // 2. setup event bindings
    function initialize () {
      var format
      $input = $(el)

      // init format
      format = settings.format || $input.data('format') || defaultFormat
      if (typeof format === 'function') {
        settings.format = format(settings)
      } else {
        settings.format = format
      }
      $input.removeAttr('data-format')

      // init timestamp
      timestamp = settings.timestamp || $input.data('timestamp')

      // init event on when to check for changed format timestamp
      settings.event = settings.event || $input.data('format-event') || defaultFormatChangeEventType
      $input.removeAttr('data-format-event')

      $input.on(settings.event, handleFormatChangeEvent)

      if (settings.date) {
        api.set(settings.date, { silent: true })
      }
    }

    // PUBLIC API
    // ----------
    api.set = function set (date, options) {
      var dateString
      var newTimestamp

      if (!options) options = {}

      if (!(date instanceof Date) && typeof date === 'object') {
        return updateSettings(date)
      }

      if (!date) {
        date = new Date()
      }
      if (typeof date === 'string') {
        dateString = date
      } else {
        // turning Date Object into string
        dateString = moment(date).format(settings.format)
      }
      $input.val(dateString)
      settings.format = parseFormat(dateString)
      newTimestamp = parseTimestamp(dateString)
      if (newTimestamp !== timestamp) {
        timestamp = newTimestamp

        if (!options.silent) {
          $input.trigger('change:timestamp', [newTimestamp])
        }
      }
    }
    api.setFormat = function setFormat (newFormat) {
      var val = $input.val()
      var currentDate

      if (val) currentDate = moment(val, settings.format).toDate()

      if (typeof newFormat === 'function') {
        settings.format = newFormat(settings)
      } else {
        settings.format = newFormat
      }

      if (val) api.set(currentDate)
    }
    api.setEvent = function setEvent (eventType) {
      $input.unbind(settings.event, handleFormatChangeEvent)
      settings.event = eventType
      $input.on(settings.event, handleFormatChangeEvent)
    }
    api.getFormat = function (callback) {
      callback(settings.format)
    }
    api.get = function (callback) {
      var val = $input.val()
      var currentDate

      if (!val) return callback()

      settings.format = parseFormat(val)
      currentDate = moment(val, settings.format).toDate()
      callback(currentDate)
    }

    // Event handlers
    // --------------

    //
    //
    //
    function handleFormatChangeEvent (/* event */) {
      var dateString = $input.val()
      var newFormat = parseFormat(dateString)
      var newTimestamp
      if (settings.format !== newFormat) {
        settings.format = newFormat
        $input.trigger('change:format', [newFormat])
      }
      newTimestamp = parseTimestamp(dateString)
      if (newTimestamp !== timestamp) {
        timestamp = newTimestamp
        $input.trigger('change:timestamp', [newTimestamp])
      }
    }

    // Internal Methods
    // ----------------

    //
    //
    //
    function updateSettings (newSettings) {
      if (newSettings.date) {
        api.set(newSettings.date)
      }
      if (newSettings.format) {
        api.setFormat(newSettings.format)
      }
    }

    //
    //
    //
    function parseFormat (dateString) {
      var newFormat
      var oldFormatCheck
      var newFormatCheck

      // Stop if newFormat is same as old
      newFormat = moment.parseFormat(dateString)
      if (newFormat === settings.format) return settings.format

      // Stop if old format still fits
      oldFormatCheck = moment(dateString, settings.format).format(settings.format)
      if (dateString.toLowerCase() === oldFormatCheck.toLowerCase()) return settings.format

      // Stop if new format cannot parse dateString correctly
      newFormatCheck = moment(dateString, newFormat).format(newFormat)
      if (dateString.toLowerCase() !== newFormatCheck.toLowerCase()) return settings.format

      // sanity check
      return newFormat
    }

    //
    //
    //
    function parseTimestamp (dateString) {
      var m
      if (!settings.format) return timestamp
      m = moment(dateString, settings.format, true)
      if (m.isValid()) return m.format()
      return timestamp
    }

    initialize()
  }

  // EDITABLE TABLE PLUGIN DEFINITION
  // ================================

  $.fn.smartDate = function (method) {
    var args = [].slice.call(arguments, 1)
    return this.each(function () {
      var $this = $(this)
      var api = $this.data('bs.smartDate')
      var options

      if (typeof method === 'object') {
        options = method
      }
      if (!api) {
        $this.data('bs.smartDate', (api = new SmartDate(this, options)))
      }
      if (api[method]) {
        return api[method].apply(this, args)
      }

      if (options) {
        api.set(options)
      }
    })
  }

  $.fn.smartDate.Constructor = SmartDate

  // EDITABLE TABLE DATA-API
  // =======================

  $(document).on('input.bs.smartDate.data-api', '[data-smartdate-spy]', function (event) {
    var $input = $(event.target)
    event.preventDefault()
    event.stopImmediatePropagation()
    $input.removeAttr('data-smartdate-spy')
    $input.smartDate()
    $input.trigger($.Event(event))
  })
}

// if run in a browser, init immediately
if (typeof window !== 'undefined') {
  smartdateInput(window.jQuery, window.moment)
}

},{}]},{},[1])(1)
});