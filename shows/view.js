function(doc, req) {
	var ddoc = this;
	var Mustache = require("vendor/couchapp/lib/mustache");
	var path = require("vendor/couchapp/lib/path").init(req);
	var markdown = require("vendor/couchapp/lib/markdown");

	var editPath = path.show('edit', doc._id);

	var data = {
		header : {
			blogName : ddoc.couchapp.name,
		},
		scripts : {},
		pageTitle : "View: "+doc.title,
		assets : path.asset(),
		editLink: editPath
	};
	
	data.doc = JSON.stringify(doc);
	data.title = doc.title;
	if (doc.format == "markdown") {
		var html = markdown.encode(doc.body);
	} else {
		var html = doc.body;
	}
	data.body = html;
	data.tags = doc.tags.join(", ");

	return Mustache.to_html(ddoc.templates.view, data, ddoc.templates.partials);
}
