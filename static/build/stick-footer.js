// Generated by CoffeeScript 1.10.0
(function() {
  $(function() {
    var csrfSafeMethod, csrftoken;
    window.stickFooter = function() {
      var docHeight, footerTop;
      docHeight = $(window).height();
      footerTop = $('.footer').position().top + $('.footer').height() + 30;
      console.log(docHeight);
      console.log(footerTop);
      if (footerTop < docHeight) {
        return $('.footer').css({
          'margin-top': (docHeight - footerTop) + 'px'
        });
      }
    };
    csrftoken = $.cookie('csrftoken');
    csrfSafeMethod = function(method) {
      return /^(GET|HEAD|OPTIONS|TRACE)$/.test(method);
    };
    return $.ajaxSetup({
      beforeSend: function(xhr, settings) {
        if (!(csrfSafeMethod(settings.type) || this.crossDomain)) {
          return xhr.setRequestHeader('X-CSRFToken', csrftoken);
        }
      }
    });
  });

}).call(this);
