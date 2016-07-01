// Generated by CoffeeScript 1.10.0
(function() {
  $(function() {
    $('a[href$="group/"]').addClass('current');
    stickFooter();
    $('#joinBtn').on('click', function() {
      if ($('#invCode').val()) {
        return $.ajax({
          url: 'join/',
          type: 'post',
          dataType: 'json',
          data: {
            code: $('#invCode').val()
          },
          success: function(data) {
            if (data.name !== '%%') {
              $('#groupName').text(data.name);
              $('#joinSuccess').fadeIn();
              return window.setTimeout('location.href="/gruop/"', 1000);
            } else {
              return $('#joinFail').fadeIn();
            }
          }
        });
      }
    });
    $('#createBtn').on('click', function() {
      if ($('#grpName').val()) {
        return $.ajax({
          url: 'create/',
          type: 'post',
          dataType: 'json',
          data: {
            name: $('#grpName').val()
          },
          success: function(data) {
            if (data.msg === 'okay') {
              $('#createSuccess').fadeIn();
              return window.setTimeout('location.href="/group/"', 1000);
            } else {
              return $('#createFail').fadeIn();
            }
          }
        });
      }
    });
    $('btn[id^="apply-"]').on('click', function() {
      var $this, pk;
      pk = ($(this).attr('id')).substr(6);
      $this = $(this);
      return $.ajax({
        url: 'apply/',
        type: 'post',
        dataType: 'json',
        data: {
          pk: pk
        },
        success: function(data) {
          if (data.msg === 'okay') {
            $('#applySuccess').fadeIn();
            $('btn[id^="apply-"]').hide();
            $this.next().show();
            return window.setTimeout("$('#applySuccess').fadeOut()", 1000);
          } else {
            $('#applyFail').fadeIn();
            return window.setTimeout("$('#applyFail').fadeOut()", 1000);
          }
        }
      });
    });
    return $('btn.withdraw').on('click', function() {
      return $.ajax({
        url: 'withdraw/',
        type: 'post',
        dataType: 'json',
        success: function(data) {
          $('#withdrawSuccess').fadeIn();
          $('btn.withdraw').hide();
          $('btn[id^="apply-"]').show();
          return window.setTimeout("$('#withdrawSuccess').fadeOut()", 1000);
        }
      });
    });
  });

}).call(this);
