smartDate Input – a Bootstrap plugin
====================================

> A Bootstrap plugin that understands human date/time inputs & their format

Installation
------------

Install using [bower](http://bower.io/) for usage in browser:

```
bower install --save bootstrap-smartdate-input
```


Usage
-----

```js
var $input = $('input');

// initialize
$input.smartDate();

// set value to Date
$input.smartDate('set', new Date);

// set/change format
$input.smartDate('setFormat', 'dddd, MMMM Do, YYYY h:mma');

// listen to format changes
$input.on('change:format', function(event, newFormat) {
  // store newFormat as the user's preferred datetime format
});
```

You can make the data input self-initializing by using the data-api.
The input will be initialized on first interaction.

```
<input data-smartdate-spy>
```

You can also set the default date format:

```
<input data-smartdate-spy data-format="MMM Do, YYYY">
```

Fine Print
----------

The smartDate Input Plugin have been authored by [Gregor Martynus](https://github.com/gr2m),
proud member of [Team Hoodie](http://hood.ie/). Support our open source work: [gittip us](https://www.gittip.com/hoodiehq/).

License: MIT
