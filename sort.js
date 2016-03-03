// consider the first line and the last line
// ++--
(function($) {
  // arrow-change
  $.fn.sorttable = function() {
    var $table = $(this),
      $header = $table.find('th'),
      $header_alp = $table.find('th.alp'),
      $header_num = $table.find('th.num'),
      $sortingbar = $('#sortingbar');


    if ($(window).width() > 800) {
      //change arrowshape
      $header.bind('click', function() {
        if ($(this).hasClass("arrow-up")) {
          $(this).removeClass('arrow-up').addClass('arrow-down')
            .siblings().removeClass('arrow-up arrow-down');
        } else {
          $(this).removeClass('arrow-down').addClass('arrow-up')
            .siblings().removeClass('arrow-up arrow-down');
        }
      });


      // sort alphabet
      $header_alp.bind('click', function() {
        // preprocess
        var colIndex = $(this).index();
        var vals = traverse($table, colIndex);
        vals = sortAlphabet($table, vals);
        if ($(this).hasClass('arrow-up')) {
          asac($table, vals);
        } else {
          desc($table, vals);
        }
      });
      // sort date
      $header_num.bind('click', function() {
        // console.log('num');
        // preprocess
        var colIndex = $(this).index();
        var vals = traverse($table, colIndex);
        vals = sortDate($table, vals);
        if ($(this).hasClass('arrow-up')) {
          asac($table, vals);
        } else {
          desc($table, vals);
        }
      });
    } else {

      // sort alphabet
      $sortingbar.bind('change', function() {
        var value = $(this).val();
        var $table = $('.small-only');
        var vals = [];
        // console.log(value);
        switch (value) {

          case 'title':
            sortMobile(value, $table, vals, 2, 0, 'asce');
            break;

          case 'conference':
            sortMobile(value, $table, vals, 3, 1, 'asce');
            break;

          case 'author':
            sortMobile(value, $table, vals, 4, 2, 'asce');
            break;

          case 'date':
            sortMobile(value, $table, vals, 5, 3, 'desc', true);
            break;

          default:
            return false;

        }
      });
    }
  }


  // Fuctions

  // sort for mobile version
  function sortMobile(value, $table, vals, m, q, sort, date) {
    $('.small-only tr:nth-child(4n +' + m + ')').each(function() {
      // console.log(n+1);
      var val = {};
      val.rowIndex = $(this)
        .closest('tr') // Get the closest tr parent element
        .prevAll() // Find all sibling elements in front of it
        .length; // Get their count

      val.value = $(this).text().toUpperCase();
      vals.push(val);
    });

    if (date) {
      vals = sortDate($table, vals);
    } else {
      vals = sortAlphabet($table, vals);
    }

    var length = vals.length;

    if (sort == 'asce') {
      for (var i = 0; i < length; i++) {
        for (var j = 0; j < 4; j++) {
          var index = vals[i].rowIndex - q + 3;
          var num = (index + 4 * i < 4 * length) ? (index + 4 * i) : (4 * length);
          if (i == 1 && (vals[0].rowIndex == 1 || vals[0].rowIndex == 2 || vals[0].rowIndex == 3 || vals[0].rowIndex == 4)) {
            num -= 4;
          }
          $table.find('tr').eq(0).after($table.find('tr').eq(num));
        }
      }
    } else {
      for (var i = 0; i < length; i++) {
        for (var j = 0; j < 4; j++) {
          var index = vals[i].rowIndex - q;
          var num = index + 3;
          $table.find('tr').eq(4 * i).after($table.find('tr').eq(num));
        }
      }
    }

  }

  // traverse
  function traverse($table, n) {
    var vals = [],
      index = n + 1;

    $table.find('tr td:nth-child(' + index + ')').each(function() {

      var val = {};
      val.rowIndex = $(this)
        .closest('tr') // Get the closest tr parent element
        .prevAll() // Find all sibling elements in front of it
        .length; // Get their count
      val.value = $(this).text().toUpperCase();
      vals.push(val);

    });

    return vals;
  }

  // sort by alphabet
  function sortAlphabet($table, vals) {

    var length = vals.length;

    for (var i = 0; i < length - 1; i++) {

      for (var j = i + 1; j < length; j++) {
        var val1 = vals[i].value;
        var val2 = vals[j].value;
        if (val1 < val2) {
          var temp = vals[i];
          vals[i] = vals[j];
          vals[j] = temp;
        }
      }
    }
    return vals;
  }

  // sort by date
  function sortDate($table, vals) {

    var months = {
      JAN: 0,
      FEB: 1,
      MARCH: 2,
      APRIL: 3,
      MAY: 4,
      JUNE: 5,
      JULY: 6,
      AUG: 7,
      SEP: 8,
      OCT: 9,
      NOV: 10,
      DEC: 12
    };

    var length = vals.length;

    for (var i = 0; i < length - 1; i++) {

      var date1 = vals[i].value.split(','),
        month1 = $.trim(date1[0]),
        year1 = parseInt($.trim(date1[1]));

      for (var j = i + 1; j < length; j++) {

        var date2 = vals[j].value.split(','),
          month2 = $.trim(date2[0]),
          year2 = parseInt($.trim(date2[1]));

        if (year1 < year2 || (year1 == year2 && months[month1] < months[month2])) {
          var temp = vals[i];
          vals[i] = vals[j];
          vals[j] = temp;
        }

      }

    }
    return vals;
  }
  // sort asac
  function asac($table, vals) {
    var length = vals.length;
    for (var i = 0; i < length; i++) {
      var index = vals[i].rowIndex;
      var num = (index + i < length) ? (index + i) : (length);
      if (i == 1 && vals[0].rowIndex == 1) {
        num -= 1;
      }
      $table.find('tr').eq(0).after($table.find('tr').eq(num));
    }
  }
  // sort desc
  function desc($table, vals) {
    var length = vals.length;
    for (var i = 0; i < length; i++) {
      var index = vals[i].rowIndex;
      var num = (index - i > 1) ? (index - i) : 1;
      if (i == 1 && vals[0].rowIndex == length) {
        num += 1;
      }
      $table.append($table.find('tr').eq(num));
    }
  }

})(jQuery);
