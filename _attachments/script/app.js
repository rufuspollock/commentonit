;(function($) {
	var dbname = window.location.pathname.split('/')[1] || 'commentonit',
		db     = $.couch.db(dbname);

	// var showdown = new Showdown.converter();

	User = {
		_current_user: false,
		isLoggedIn: function() {
			return !!this._current_user;
		},
		current: function(callback, force) {
			var user = this;
			if (!this._current_user || force === true) {
				$.couch.session({
					success: function(session) {
						if (session.userCtx && session.userCtx.name) {
							user._current_user = session.userCtx;
							callback(user._current_user);
						} else {
							user._current_user = false;
							callback(false);
						}
					}
				});
			} else {
				callback(user._current_user);
			}
		},
		login: function(name, password, callback) {
			$.couch.login({
				name : name,
				password : password,
				success: function() {
					User.current(callback, true);
				},
				error: function(code, error, reason) {
					showNotification('error', reason);
				}
			});
		},
		logout: function(callback) {
			var user = this;
			$.couch.logout({
				success: function() {
					user._current_user = false;
					callback();
				},
				error: function(code, error, reason) {
					showNotification('error', reason);
				}
			});
		},
		signup: function(name, email, password, callback) {
			$.couch.signup({name: name, email: email}, password, {
				success: function() {
					User.login(name, password, callback);
				},
				error: function(code, error, reason) {
					showNotification('error', reason);
				}
			})
		}
	};


	var app = $.sammy('.entry-content', function() {
		this.use('Mustache', 'ms');
		this.use('Title');
		this.setTitle(function(title) {
			return [title, ' - Comment On It'].join('');
		});

		this.get('#/', function(context) {
			this.title('Home');
			db.view('commentonit/recent-items', {
				include_docs: true,
				success: function(resp) {
					texts = $.map(resp.rows, function(row, idx) {
						return row.doc;
					});
					context.partial('templates/home.ms', {
						count: resp.rows.length,
						texts: texts
					});
				}
			});
		});

		this.get('#/text/:id', function(context) {
			var self = this;
			this.title(' - View');
			docid = this.params['id'];
			db.openDoc(docid, {
				success: function(doc) {
					self.title(doc.title + ' - View');
					context.partial('templates/text/view.ms', doc);
				}
			});
		});
	});

	$(function() {
		app.run('#/');
	});
})(jQuery);
