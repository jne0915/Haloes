// Generated by CoffeeScript 1.10.0
(function() {
  $(function() {
    var editor;
    $('a[href$="writeup/"]').addClass('current');
    Simditor.locale = 'en-US';
    editor = new Simditor({
      textarea: $('#editor'),
      toolbar: ['title', 'bold', 'italic', 'strikethrough', '|', 'ol', 'ul', 'blockquote', 'code', 'table', '|', 'link', 'hr', '|', 'markdown'],
      toolbarFloatOffset: $('nav').height(),
      imageButton: ['upload', 'external'],
      upload: {
        url: '',
        params: null,
        fileKey: 'upload_file',
        connectionCount: 3,
        leaveConfirm: 'Uploading is in progress, are you sure to leave this page?'
      },
      markdown: true
    });
    $('#getv').on('click', function() {
      return console.log(editor.getValue());
    });
    $('#sync').on('click', function() {
      return console.log(editor.sync());
    });
    return stickFooter();
  });

}).call(this);
