(function($) {
  // $(function() {
  with(QUnit) {
      context('Sammy.Application','run', {
        before: function () {
          window.location.hash = ''
          var context = this;
          this.app = CommentOnIt.app;
        }
      })
      .should('set the location to the start url', function() {
        var app = this.app;
        app.run('#/');
        soon(function() {
          equal(window.location.hash, '#/');
          app.unload();
        });
      })
      .should('trigger routes on URL change', function() {
        var app = this.app;
        app.run();
        window.location.hash = '#/text/edit';
        soon(function() {
          equal(document.title.slice(0,13), 'Create - Text');
          // TODO
          // equal($('.entry-content').text(), 'test success');
          app.unload();
        });
      })
    }
  // });
})(jQuery);
