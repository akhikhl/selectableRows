/**
 * table.selectableRows.js
 *
 * "selectableRows" behavior that can be attached to any table element.
 * Written by Andrey Hihlovskiy (akhikhl AT gmail DOT com).
 * Licensed under the MIT (http://opensource.org/licenses/MIT).
 * Date: 29.05.2013
 *
 * @author Andrey Hihlovskiy
 * @version 1.0.2
 * @requires jQuery v1.7 or later
 *
 * https://github.com/akhikhl/selectableRows
 *
 **/
jQuery(function($) {

  var keyCode = {
    UP: ($.ui && $.ui.keyCode.UP) || 38,
    DOWN: ($.ui && $.ui.keyCode.DOWN) || 40,
    HOME: ($.ui && $.ui.keyCode.HOME) || 36,
    END: ($.ui && $.ui.keyCode.END) || 35
  };
  
  function changeSelection(table, selectionToAdd, selectionToRemove, scrollToLast) {
    selectionToAdd = $(selectionToAdd);
    selectionToRemove = $(selectionToRemove);
    if(selectionToAdd.length == 0 && selectionToRemove.length == 0)
      return false;
    var oldSelection = table.find("> tbody > tr.selected");
    var newSelection = oldSelection.not(selectionToRemove).add(selectionToAdd);
    if(selectionToRemove.length != 0) {
      selectionToRemove.removeClass("selected");
      table.trigger("rowUnselected.selectableRows", [ selectionToRemove ]);
    }
    if(selectionToAdd.length != 0) {
      selectionToAdd.addClass("selected");
      scrollElementIntoView(scrollToLast ? selectionToAdd.last() : selectionToAdd.first());
      table.trigger("rowSelected.selectableRows", [ selectionToAdd ]);
    }
    table.trigger("rowSelectionChanged.selectableRows", [ newSelection, oldSelection ]);
    document.getSelection().removeAllRanges();
    return true;
  }
  
  function select(table, newSelection) {
    newSelection = $(newSelection);
    if(!table.hasClass("multiselect"))
      newSelection = newSelection.first();
    var oldSelection = table.find("> tbody > tr.selected");
    return changeSelection(table, newSelection.not(oldSelection), oldSelection.not(newSelection));
  }
  
  function toggle(table, rows) {
    rows = $(rows);
    if(!table.hasClass("multiselect"))
      rows = rows.first();
    return changeSelection(table, rows.not(".selected"), rows.filter(".selected"));
  }
  
  function selectRange(table, row) {
    row = $(row);
    if(!table.hasClass("multiselect"))
      return select(table, row);
    var oldSelection = table.find("> tbody > tr.selected");
    var allRows = table.find("> tbody > tr");
    var firstSelIndex = allRows.index(oldSelection.first());
    var lastSelIndex = allRows.index(oldSelection.last());
    var rowIndex = allRows.index(row);
    var newSelection;
    var scrollToLast = false;
    if(rowIndex < firstSelIndex)
      newSelection = allRows.slice(rowIndex, lastSelIndex + 1);
    else {
      newSelection = allRows.slice(firstSelIndex, rowIndex + 1);
      scrollToLast = true;
    }
    return changeSelection(table, newSelection.not(oldSelection), oldSelection.not(newSelection), scrollToLast);
  }

  function selectFirstRow(row, extendSelection) {
    row = $(row);
    var table = row.closest("table.selectableRows");
    var firstRow = table.find("> tbody > tr").first();
    if(firstRow.length != 0)
      return extendSelection ? selectRange(table, firstRow) : select(table, firstRow);
    return false;
  }

  function selectPrevRow(row, extendSelection) {
    row = $(row);
    var table = row.closest("table.selectableRows");
    var prevRow = row.first().prev("tr");
    if(prevRow.length == 0 && row.parent().is("tbody")) { // the very first row in tbody?
      // probably user would be pleased to see table header being scrolled into view
      scrollElementIntoView(table.find("> thead > tr"));
      return false;
    }
    if(prevRow.length != 0)
      return extendSelection ? selectRange(table, prevRow) : select(table, prevRow);
    return false;
  }
    
  function selectNextRow(row, extendSelection) {
    row = $(row);
    var table = row.closest("table.selectableRows");
    var nextRow = row.last().next("tr");
    if(nextRow.length != 0)
      return extendSelection ? selectRange(table, nextRow) : select(table, nextRow);
    return false;
  }

  function selectLastRow(row, extendSelection) {
    row = $(row);
    var table = row.closest("table.selectableRows");
    var lastRow = table.find("> tbody > tr").last();
    if(lastRow.length != 0)
      return extendSelection ? selectRange(table, lastRow) : select(table, lastRow);
    return false;
  }

  function scrollElementIntoView(elem) {
    elem = $(elem);
    if(typeof elem.scrollParent == "function") { // scrollParent is available only if jquery-ui was included
      var offsetParent = elem.offsetParent();
      var scrollParent = elem.scrollParent();
      if(offsetParent.length != 0 && offsetParent.get(0) === scrollParent.get(0)) {
        if(elem.position().top + elem.outerHeight() > offsetParent.innerHeight())
          elem.get(0).scrollIntoView(false);
        if(elem.position().top < 0)
          elem.get(0).scrollIntoView(true);
      }
    }
  }

  $("body").on("click", "table.selectableRows > tbody > tr", function(event) {
    var table = $(this).closest("table.selectableRows");
    if(table.hasClass("multiselect")) {
      if(event.ctrlKey) {
        toggle(table, this);
        return;
      }
      if(event.shiftKey) {
        selectRange(table, this);
        return;
      }
    }
    select(table, this);
  });

  $("body").on("keydown", function(event) {
    var table = $("table.selectableRows.focused, .focused table.selectableRows");
    if(table.length != 0) {
      if(event.altKey || event.ctrlKey)
        return; // we don't handle combinations with ALT and CTRL keys yet.
      var selectedRow = table.find("> tbody > tr.selected");
      var extendSelection = table.hasClass("multiselect") && event.shiftKey;
      if(event.keyCode == keyCode.UP) {
        if(selectPrevRow(selectedRow, extendSelection))
          return false;
      }
      else if(event.keyCode == keyCode.DOWN) {
        if(selectNextRow(selectedRow, extendSelection))
          return false;
      }
      else if(event.keyCode == keyCode.HOME) {
        if(selectFirstRow(selectedRow, extendSelection))
          return false;
      }
      else if(event.keyCode == keyCode.END) {
        if(selectLastRow(selectedRow, extendSelection))
          return false;
      }
    }
  });
  
  var methods = {
    selectAll: function() {
      if(this.hasClass("multiselect"))
        select(this, this.find("> tbody > tr"));
      return this;
    },
    selection: function(newValue) {
      if(newValue) {
        select(this, newValue);
        return this;
      }
      return this.find("> tbody > tr.selected");
    },
    selectNone: function() {
      select(this, $());
      return this;
    }
  };
  
  $.fn.selectableRows = function(method) {
    if (methods[method])
      return methods[ method ].apply(this, Array.prototype.slice.call(arguments, 1));
    $.error("Method " +  method + " does not exist on jQuery.selectableRows");
  };
});
