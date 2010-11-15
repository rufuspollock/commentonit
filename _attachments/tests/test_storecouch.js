var dbname = 'annotations-test';

module("storecouch", {
	setup: function() {
		try {
			$.couch.db(dbname).drop();
		} catch(e) {
			alert('failed to delete database');
		}
		$.couch.db(dbname).create();
		var db = $.couch.db(dbname);
		var designDoc = {
			_id: '_design/annotator',
			views: {
				byuri: {
					map: "function(doc) {\n    if(doc.uri) {\n        emit(doc.uri, null);\n    }\n}\n"
				}
			}
		};
		db.saveDoc(designDoc);
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

test("view", function() {
	var db = $.couch.db(dbname);
	var sampleDoc = {
		user: {
			'name': 'abc',
			'id': 'xyz'
		},
		uri: 'http://xyz.com'
	};
	var sampleDoc2 = {
		uri: 'someotheruri'
	}

	stop();
	expect(1);

	db.bulkSave({docs: [sampleDoc, sampleDoc2]}, {
		success: function(resp) {
			checkIt(resp);
		}
	});

	function checkIt(inDoc) {
		db.view('annotator/byuri', {key: sampleDoc.uri, include_docs: true,
			success: function(resp) {
				equals(resp.rows.length, 1, 'number of rows is wrong');
			}
		});
	}

	setTimeout(function() {
		start();
	}, 1000);
});

