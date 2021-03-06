// Generated by CoffeeScript 1.10.0
(function() {
  $(function() {
    var csrfSafeMethod, csrftoken, handler, signup;
    csrftoken = $.cookie('csrftoken');
    csrfSafeMethod = function(method) {
      return /^(GET|HEAD|OPTIONS|TRACE)$/.test(method);
    };
    $.ajaxSetup({
      beforeSend: function(xhr, settings) {
        if (!(csrfSafeMethod(settings.type) || this.crossDomain)) {
          return xhr.setRequestHeader('X-CSRFToken', csrftoken);
        }
      }
    });
    $('#username').focus();
    $('.alert').on('click', function() {
      return $(this).fadeOut();
    });
    $('#signIn').on('click', function() {
      var salt;
      if ($('#username').val() && $('#password').val()) {
        salt = $('#signIn').data('salt');
        return $.ajax({
          url: 'person/sign-in/',
          type: 'post',
          dataType: 'json',
          data: {
            username: $('#username').val(),
            password: $.sha256($.sha256($('#password').val()) + salt),
            salt: salt
          },
          success: function(data) {
            if (data.msg === 'okay') {
              $('#signInDone').fadeIn();
              return window.setTimeout('location.href="/person/"', 500);
            } else if (data.msg === 'fail') {
              return $('#signInFail').fadeIn();
            } else if (data.msg === 'email') {
              return $('#emailFail').fadeIn();
            } else {
              return $('#alertError').fadeIn();
            }
          }
        });
      }
    });
    signup = function() {
      if ($('#remail').val() && $('#rusername').val() && $('#rpassword').val()) {
        return $.ajax({
          url: '/person/sign-up/',
          type: 'post',
          dataType: 'json',
          data: {
            username: $('#rusername').val(),
            password: $.sha256($('#rpassword').val()),
            email: $('#remail').val()
          },
          success: function(data) {
            if (data.msg === 'okay') {
              return $('#signUpDone').fadeIn();
            } else if (data.msg === 'fail') {
              return $('#signUpFail').fadeIn();
            } else {
              return $('#alertError').fadeIn();
            }
          }
        });
      }
    };
    $('#guest').on('click', function() {
      $('#signInDone').fadeIn();
      return window.setTimeout('location.href="/challenge/"', 500);
    });
    handler = function(captchaObj) {
      $('#signUp').on('click', function() {
        var validate;
        validate = captchaObj.getValidate();
        if (!validate) {
          alert('plz validate first');
          return;
        }
        return $.ajax({
          url: '/person/validate_captcha/',
          type: 'post',
          dataType: 'json',
          data: {
            challenge: validate.geetest_challenge,
            validate: validate.geetest_validate,
            seccode: validate.geetest_seccode
          },
          success: function(data) {
            return false;
          }
        });
      });
      captchaObj.bindOn('#signUp');
      captchaObj.appendTo('#captcha');
      return captchaObj.onSuccess(signup);
    };
    return $.ajax({
      url: '/person/get_captcha/',
      type: 'get',
      dataType: 'json',
      success: function(data) {
        return initGeetest({
          gt: data.gt,
          challenge: data.challenge,
          product: 'popup',
          offline: !data.success,
          lang: 'en'
        }, handler);
      }
    });
  });

}).call(this);
