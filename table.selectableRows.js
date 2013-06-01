/**
 * table.selectableRows.js
 *
 * "selectableRows" behavior that can be attached to any table element.
 * Written by Andrey Hihlovskiy (akhikhl AT gmail DOT com).
 * Licensed under the MIT (http://opensource.org/licenses/MIT).
 * Date: 29.05.2013
 *
 * @author Andrey Hihlovskiy
 * @version 1.0.1
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

  function selectRow(table, row, modifier) {
    row = $(row);
    var oldSelection = table.find("> tbody > tr.selected");
    if(modifier == "selectSingle") {
      if(row.hasClass("selected") && oldSelection.length == 1)
        return false;
      var selectionToRemove = oldSelection.not(row);
      if(selectionToRemove.length != 0) {
        selectionToRemove.removeClass("selected");
        table.trigger("rowUnselected.selectableRows", [ selectionToRemove ]);
      }
      var selectionToAdd = row.not(oldSelection);
      if(selectionToAdd.length != 0) {
        selectionToAdd.addClass("selected");
        scrollElementIntoView(selectionToAdd);
        table.trigger("rowSelected.selectableRows", [ selectionToAdd ]);
      }
    }
    else if(modifier == "toggleSingle") {
      row.toggleClass("selected");
      scrollElementIntoView(row);
      if(row.hasClass("selected"))
        table.trigger("rowSelected.selectableRows", [ row ]);
      else
        table.trigger("rowUnselected.selectableRows", [ row ]);
      document.getSelection().removeAllRanges();      
    }
    else if(modifier == "selectRange") {
      var allRows = table.find("> tbody > tr");
      var firstSelIndex = allRows.index(oldSelection.first());
      var lastSelIndex = allRows.index(oldSelection.last());
      var rowIndex = allRows.index(row);
      var newSelection;
      var scrollToFirst = false; 
      if(rowIndex < firstSelIndex) {
        newSelection = allRows.slice(rowIndex, lastSelIndex + 1);
        scrollToFirst = true;
      }
      else
        newSelection = allRows.slice(firstSelIndex, rowIndex + 1);
      var selectionToRemove = oldSelection.not(newSelection);
      if(selectionToRemove.length != 0) {
        selectionToRemove.removeClass("selected");
        table.trigger("rowUnselected.selectableRows", [ selectionToRemove ]);
      }
      var selectionToAdd = newSelection.not(oldSelection);
      if(selectionToAdd.length != 0) {
        selectionToAdd.addClass("selected");
        scrollElementIntoView(scrollToFirst ? selectionToAdd.first() : selectionToAdd.last());
        table.trigger("rowSelected.selectableRows", [ selectionToAdd ]);
      }
      document.getSelection().removeAllRanges();      
    }
    table.trigger("rowSelectionChanged.selectableRows", [ table.find("> tbody > tr.selected"), oldSelection ]);
    return true;
  }

  function selectFirstRow(row, extendSelection) {
    row = $(row);
    var table = row.closest("table.selectableRows");
    var firstRow = table.find("> tbody > tr").first();
    if(firstRow.length != 0)
      return selectRow(table, firstRow, extendSelection ? "selectRange" : "selectSingle");
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
      return selectRow(table, prevRow, extendSelection ? "selectRange" : "selectSingle");
    return false;
  }
    
  function selectNextRow(row, extendSelection) {
    row = $(row);
    var table = row.closest("table.selectableRows");
    var nextRow = row.last().next("tr");
    if(nextRow.length != 0)
      return selectRow(table, nextRow, extendSelection ? "selectRange" : "selectSingle");
    return false;
  }

  function selectLastRow(row, extendSelection) {
    row = $(row);
    var table = row.closest("table.selectableRows");
    var lastRow = table.find("> tbody > tr").last();
    if(lastRow.length != 0)
      return selectRow(table, lastRow, extendSelection ? "selectRange" : "selectSingle");
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
    var modifier = "selectSingle";
    if(table.hasClass("multiselect")) {
      if(event.ctrlKey)
        modifier = "toggleSingle";
      else if(event.shiftKey)
        modifier = "selectRange";
    }
    selectRow(table, this, modifier);
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
});
