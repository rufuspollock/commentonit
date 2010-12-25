;(function($) {
	var dbname = window.location.pathname.split('/')[1] || 'commentonit',
		db     = $.couch.db(dbname);

	var showdown = new Showdown.converter();

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

		this.helpers({
			setupEditForm: function(textDoc) {
				var self = this;
				$('form#new-text').live('submit', function(e) {
					e.preventDefault();
					// TODO: get account stuff working again
					// textDoc.author = $$('#account').userCtx.name;
					textDoc.body = $('textarea[name=body]').val();
					textDoc.title = $('input[name=title]').val();
					var dtags = [], tags = $('input[name=tags]').val().split(',');
					for(var i in tags) {
						dtags.push($.trim(tags[i]));
					}
					textDoc.tags = dtags;
					if (!textDoc.created_at) {
						textDoc.created_at = new Date();
					}
					db.saveDoc(textDoc, {
						success : function(resp) {
							self.redirect('#', 'text', resp.id);
						}
					});
					return false;
				});

				if (textDoc._id) {
					$('#preview').before('<input type="button" id="delete" value="Delete Post"/> ');
					$('#delete').live('click', function() {
						db.deleteDoc(textDoc, {
							success : function(resp) {
								$('h1').text('Deleted '+resp.id);
								$('form#new-text input').attr('disabled', true);
							}
						});
						return false;
					});
				}

				$('#preview').live('click', function() {
					var html = showdown.makeHtml($('textarea[name=body]').val());
					$('#show-preview').html(html);
				});
			}
		});

		this.get('#/text/edit', function(context) {
			this.title('Create - Text');
			context.partial('templates/text/edit.ms', {
				pageHeading: 'Create Text (to annotate)'
				});
			this.setupEditForm({
				type: 'text',
				format: 'markdown'
				});
		});

		this.get('#/text/edit/:id', function(context) {
			var self = this;
			this.title(' - Edit');
			docid = this.params['id'];
			context.log('edit - ' + docid);

			db.openDoc(docid, {
				success: function(doc) {
					self.title(doc.title + ' - Edit');
					// hack deep copy
					var templateVars = JSON.parse(JSON.stringify(doc));
					templateVars.pageHeading = 'Editing ' + doc.title;
					context.partial('templates/text/edit.ms', templateVars);
					self.setupEditForm(doc);
				}
			});
		});

		this.get('#/text/:id', function(context) {
			var self = this;
			this.title(' - View');
			docid = this.params['id'];
			db.openDoc(docid, {
				success: function(doc) {
					// copy doc as basis for template vars
					var templateVars = jQuery.extend(true, {}, doc);
					templateVars.editLink = '#/text/edit/' + docid;
					self.title(doc.title + ' - View');
					context.partial('templates/text/view.ms',
						templateVars);
				}
			});
		});
	});

	$(function() {
		app.run('#/');
	});
})(jQuery);
