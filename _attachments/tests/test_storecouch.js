var dbname = 'annotations-test';

module("storecouch", {
	setup: function() {
		$.couch.db(dbname).drop();
		var db = $.couch.db(dbname).create();
	},
	teardown: function() {
	}
});

test("create", function() {
	var db = $.couch.db(dbname);
	var sampleDoc = {
		user: {
			'name': 'abc',
			'id': 'xyz'
		},
		uri: 'http://xyz/.com'
	};

	stop();
	expect(1);

	db.saveDoc(sampleDoc, {
		success: function(resp) {
			checkIt(resp);
		}
	});

	function checkIt(inDoc) {
		db.openDoc(sampleDoc._id, {
			success: function(doc) {
				equals(doc.user.name, 'abc');
			}
		});
	}

	setTimeout(function() {
		start();
	}, 1000);
});

