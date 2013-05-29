jQuery(function($) {

  function selectRow(table, row) {
    row = $(row);
    table.find("> tbody > tr.selected").removeClass("selected");
    row.addClass("selected");
    scrollElementIntoView(row);
    table.trigger("rowSelected", row);
  }

  function selectNextRow(row) {
    row = $(row);
    var table = row.closest("table.selectableRows");
    var nextRow = row.next("tr");
    if(nextRow.length != 0) {
      selectRow(table, nextRow);
      return true;
    }
    return false;
  }

  function selectPrevRow(row) {
    row = $(row);
    var table = row.closest("table.selectableRows");
    var prevRow = row.prev("tr");
    if(prevRow.length == 0 && row.parent().is("tbody")) {
      scrollElementIntoView(table.find("> thead > tr"));
      return false;
    }
    if(prevRow.length != 0) {
      selectRow(table, prevRow);
      return true;
    }
    return false;
  }

  function scrollElementIntoView(elem) {
    elem = $(elem);
    if(typeof elem.scrollParent == "function") {
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

  $("body").on("click", "table.selectableRows > tbody > tr", function() {
    selectRow($(this).closest("table.selectableRows"), this);
  });

  $("body").on("keydown", function(event) {
    var table = $("table.selectableRows.focused, .focused table.selectableRows");
    if(table.length != 0) {
      if(event.altKey || event.ctrlKey || event.shiftKey)
        return; // we don't handle key combinations yet
      var selectedRow = table.find("> tbody > tr.selected");
      if(event.keyCode == $.ui.keyCode.UP) {
        if(selectPrevRow(selectedRow))
          return false;
      }
      else if(event.keyCode == $.ui.keyCode.DOWN) {
        if(selectNextRow(selectedRow))
          return false;
      }
    }
  });
});