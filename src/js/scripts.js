(function() {
  $(function() {

    $("a[href=#]").click(function(e) {
      e.preventDefault();
    });

    $('.drawer-fixed .js-tab-access').focus(function () {
      var e = $(this);
      if (e.offset().top - $(window).scrollTop() < 51) {
        $('html, body').animate({
          scrollTop: e.offset().top - 51
        }, 500);
      }
    });

  });
}).call(this);
