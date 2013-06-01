#selectableRows

##Overview

"selectableRows" is a javascript behavior (and, optionally, CSS) that can be attached to any table element.

See [online example here](http://akhikhl.blogspot.de/2013/05/test-selectablerows-script.html)

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

triggered when some row(s) is(are) selected.

parameters: row - jQuery object, associated with newly selected row(s).

handler example:
```javascript
$("#exampleTable").on("rowSelected.selectableRows", function(event, row) {
  console.log(event.type, row);
});
```

* "rowUnselected.selectableRows"

triggered when some row(s) is(are) deselected.

parameters: row - jQuery object, associated with newly deselected row(s).

handler example:
```javascript
$("#exampleTable").on("rowUnselected.selectableRows", function(event, row) {
  console.log(event.type, row);
});
```

* "rowSelectionChanged.selectableRows"

triggered when selection changes - some row(s) is(are) selected or deselected.

parameters:
  newSelection - jQuery object, associated with newly selected rows.
  oldSelection - jQuery object, associated with previously selected rows.
  
note that newSelection and oldSelection may intersect.

handler example:
```javascript
$("#exampleTable").on("rowSelectionChanged.selectableRows", function(event, newSelection, oldSelection) {
  console.log(event.type, newSelection, oldSelection);
});
```

The page may optionally use CSS file:
```html
<link href="table.selectableRows.css" rel="stylesheet">
```

This CSS file paints selected rows in cyan color and shows "hand" mouse-pointer, when mouse is over selectable rows.
Users of "selectableRows" script are free to define their own CSS, of course.

##Copyright and License

Copyright 2013 (c) Andrey Hihlovskiy

All versions, present and past, of "selectRows" script are licensed under MIT license:

* [MIT](http://opensource.org/licenses/MIT)
