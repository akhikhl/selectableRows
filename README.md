#selectableRows

##Overview

"selectableRows" is a javascript behavior (and, optionally, CSS) that can be attached to any table element.
When selectableRows is enabled, clicking on table rows adds/removes "selected" class on them and triggers events.

See [online example here](https://dl.dropboxusercontent.com/u/15089387/js/selectableRows/example_selectableRows.htm)

##API

### Initialization

"selectableRows" behavior is attached to table element via "selectableRows" class:

```html
<table id="exampleTable" class="selectableRows">
   ...
</table>

  ...
<script src="http://code.jquery.com/jquery-1.10.0.min.js"></script>
<script type="text/javascript" src="table.selectableRows.js"></script>
```

Effect: whenever some row within "table.selectableRows" element is clicked (or its descendant DOM-element is clicked), 
it gets "selected" class. If some other row in the same table had "selected" class before, it will lose it, 
so at any time there is only one table row (within the given table) having "selected" class.

When an additional class "multiselect" is specified, the table supports multiple-row selection (with the help of 
CTRL and SHIFT keys).

### Events

* "rowSelected.selectableRows"

Triggered when some row(s) is(are) selected.

Parameters: rows - jQuery object, associated with newly selected row(s).

Handler example:
```javascript
$("#exampleTable").on("rowSelected.selectableRows", function(event, rows) {
  console.log(event.type, rows);
});
```

Note that "rows" does not include previously selected rows. For example, if selection changes from ["A", "B", "C"] 
to ["B", "C", "D"], then rows will be [ "D" ].


* "rowUnselected.selectableRows"

Triggered when some row(s) is(are) deselected.

Parameters: rows - jQuery object, associated with newly deselected row(s).

Handler example:
```javascript
$("#exampleTable").on("rowUnselected.selectableRows", function(event, rows) {
  console.log(event.type, rows);
});
```

Note that "rows" does not include newly selected rows. For example, if selection changes from ["A", "B", "C"] 
to ["B", "C", "D"], then rows will be [ "A" ].

* "rowSelectionChanged.selectableRows"

Triggered when selection changes - some row(s) is(are) selected and/or deselected.

Parameters:
  newSelection - jQuery object, associated with new selection (rows).
  oldSelection - jQuery object, associated with old selection (rows).

Handler example:
```javascript
$("#exampleTable").on("rowSelectionChanged.selectableRows", function(event, newSelection, oldSelection) {
  console.log(event.type, newSelection, oldSelection);
});
```

Note that newSelection and oldSelection may intersect. For example, if selection changes from ["A", "B", "C"] 
to ["B", "C", "D"], then oldSelection will be [ "A", "B", "C" ] and newSelection will be ["B", "C", "D"].

You can calculate non-intersecting row sets like this:

```javascript
newSelection.not(oldSelection); // get only those rows that were not checked before

oldSelection.not(newSelection); // get only those rows that are not checked anymore
```

### Stylesheets

The page may optionally use CSS file:
```html
<link href="table.selectableRows.css" rel="stylesheet">
```

This CSS file paints selected rows in cyan color and shows "hand" mouse-pointer, when mouse is over selectable rows.
Users of "selectableRows" script are free to define their own CSS, of course.

##Copyright and License

Copyright 2013 (c) Andrey Hihlovskiy

All versions, present and past, of "selectableRows" script are licensed under MIT license:

* [MIT](http://opensource.org/licenses/MIT)
